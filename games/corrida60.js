/* Dentolingu · jogo "Corrida 60s": responder o máximo de perguntas do tema (múltipla escolha e verdadeiro/falso)
   antes de o relógio zerar. Acerto vale 1 ponto; a partir do 3º acerto seguido vale 2. Errou, o combo volta a zero.
   Máximo que entra no ranking: 40 pontos por partida.
   A lógica pura (coleta das perguntas, embaralhador, fila com reembaralho, placar) fica separada do DOM pra rodar em teste com node. */
'use strict';
(function () {
  const ID = 'corrida60';
  const DURACAO_MS = 60000;
  const MAX_PONTOS = 40;
  const COMBO_DOBRA = 3;     // a partir deste acerto seguido, cada acerto vale 2
  const MIN_PERGUNTAS = 8;
  const PISCA_OK_MS = 250, PISCA_BAD_MS = 400, MOSTRA_CERTA_MS = 1200;

  /* ===== LÓGICA PURA ===== */
  function coletarPerguntas(t) {
    const out = [];
    if (!t || !Array.isArray(t.licoes)) return out;
    t.licoes.forEach(l => {
      if (!l || !Array.isArray(l.qs)) return;
      l.qs.forEach(q => {
        if (!q || typeof q.q !== 'string' || !q.q.trim()) return;
        if (q.t === 'mc' && Array.isArray(q.o) && q.o.length >= 2 && Number.isInteger(q.a) && q.a >= 0 && q.a < q.o.length) out.push(q);
        else if (q.t === 'vf' && typeof q.a === 'boolean') out.push(q);
      });
    });
    return out;
  }
  function baralhar(arr, rnd) {
    rnd = rnd || Math.random;
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function novoEstado() { return { fila: [], pos: 0, acertos: 0, erros: 0, combo: 0, maiorCombo: 0, pontos: 0 }; }
  // Próxima pergunta da fila; quando acaba, reembaralha (sem repetir de cara a última que apareceu, se der).
  function proxima(st, perguntas, rnd) {
    if (st.pos >= st.fila.length) {
      const ultima = st.fila.length ? st.fila[st.fila.length - 1] : null;
      const nova = baralhar(perguntas, rnd);
      if (nova.length > 1 && nova[0] === ultima) nova.push(nova.shift());
      st.fila = nova; st.pos = 0;
    }
    return st.fila[st.pos++];
  }
  function valorDoAcerto(comboNovo) { return comboNovo >= COMBO_DOBRA ? 2 : 1; }
  function registrar(st, ok) {
    if (ok) {
      st.acertos++; st.combo++;
      if (st.combo > st.maiorCombo) st.maiorCombo = st.combo;
      st.pontos += valorDoAcerto(st.combo);
    } else { st.erros++; st.combo = 0; }
    return st;
  }
  function pontosFinais(st) { return Math.min(MAX_PONTOS, st.pontos); }
  function opcoesEmbaralhadas(q, rnd) { return baralhar(q.o.map((x, i) => ({ x, c: i === q.a })), rnd); }
  function disponivel(t) { return coletarPerguntas(t).length >= MIN_PERGUNTAS; }
  const plural = (n, s, p) => n + ' ' + (n === 1 ? s : p);

  /* ===== DOM ===== */
  const ICONE = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="7"/><path d="M12 11v3l2.2 1.6M9 2.5h6M12 2.5V7M18.6 8.4 20 7"/></svg>';
  const SVG_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  const SVG_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const SVG_RAIO = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>';
  const CSS = `
.${ID}-jogo{display:flex;flex-direction:column;gap:14px}
.${ID}-topo{display:flex;flex-direction:column;align-items:center;gap:8px}
.${ID}-relogio{font-family:var(--f-display);font-weight:700;font-size:66px;line-height:1;font-variant-numeric:tabular-nums;color:var(--sun-d);display:flex;align-items:baseline;gap:6px}
.${ID}-relogio small{font-family:var(--f-body);font-size:13px;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
.${ID}-relogio.${ID}-urgente{color:var(--gum)}
.${ID}-trilho{width:100%;height:14px;border-radius:99px;background:var(--line);overflow:hidden}
.${ID}-barra{display:block;height:100%;width:100%;background:var(--sun);border-radius:99px;transition:width .12s linear}
.${ID}-placar{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.${ID}-placar .stat b{font-family:var(--f-display);font-size:17px;font-weight:700}
.${ID}-placar .stat svg{color:var(--muted)}
.${ID}-placar .stat.${ID}-quente{border-color:var(--sun);background:color-mix(in srgb,var(--sun) 20%,var(--surface))}
.${ID}-placar .stat.${ID}-quente svg{color:var(--sun-d)}
.${ID}-card{transition:background .15s,border-color .15s}
.${ID}-card.${ID}-ok{background:var(--ok-bg);border-color:var(--mint)}
.${ID}-card.${ID}-bad{background:var(--bad-bg);border-color:var(--gum)}
.${ID}-corpo .opt{min-height:48px}
.${ID}-corpo .vf .opt{min-height:72px}
.${ID}-certa{font-weight:700;color:var(--gum-d);font-size:15px;line-height:1.35}
.${ID}-certa b{color:var(--ink)}
.${ID}-ico{width:58px;height:58px;border-radius:18px;background:var(--sun);color:var(--bg);display:grid;place-items:center}
.${ID}-ico svg{width:32px;height:32px}
.${ID}-inicio h3{font-size:22px}
.${ID}-inicio p{color:var(--muted)}
.${ID}-fim .${ID}-sub{color:var(--muted);font-weight:700;margin-top:-6px}
.${ID}-fim .stat svg{color:var(--muted)}
@media (prefers-reduced-motion: reduce){.${ID}-barra,.${ID}-card{transition:none}}
`;
  function injetarCss() {
    if (document.getElementById('css-' + ID)) return;
    const s = document.createElement('style'); s.id = 'css-' + ID; s.textContent = CSS; document.head.appendChild(s);
  }

  function montar(el, t, api) {
    injetarCss();
    const esc = api.esc;
    const perguntas = coletarPerguntas(t);
    let st = novoEstado(), timer = null, espera = null, fimMs = 0, acabou = false, rodando = false;

    function limpar() {
      if (timer) { clearInterval(timer); timer = null; }
      if (espera) { clearTimeout(espera); espera = null; }
    }
    function sair() { limpar(); api.voltar(); }
    function reiniciar() { limpar(); el.innerHTML = ''; montar(el, t, api); }
    const q$ = s => el.querySelector('.' + ID + '-' + s);

    /* --- tela inicial --- */
    function telaInicio() {
      el.innerHTML = `<div class="card ${ID}-inicio"><div class="${ID}-ico">${ICONE}</div><h3>Corrida de 60 segundos</h3>` +
        `<p>Responda o máximo que conseguir antes do relógio zerar. Cada acerto vale 1 ponto e, a partir do 3º acerto seguido, vale 2. Errou, o combo volta a zero.</p>` +
        `<div class="chips" style="justify-content:flex-start"><span class="stat">${plural(perguntas.length, 'pergunta', 'perguntas')}</span><span class="stat">60 seg</span><span class="stat">até ${MAX_PONTOS} pontos</span></div>` +
        `<button class="btn gum full ${ID}-comecar">Começar</button><button class="btn ghost sm full ${ID}-voltar">Voltar</button></div>`;
      q$('comecar').onclick = comecar;
      q$('voltar').onclick = sair;
    }

    /* --- partida --- */
    function comecar() {
      st = novoEstado(); acabou = false; rodando = true;
      el.innerHTML = `<div class="${ID}-jogo">` +
        `<div class="${ID}-topo"><div class="${ID}-relogio" aria-live="off"><span class="${ID}-seg">60</span><small>seg</small></div><div class="${ID}-trilho"><i class="${ID}-barra"></i></div></div>` +
        `<div class="${ID}-placar"><span class="stat ${ID}-stat-ac">${SVG_OK}<b class="${ID}-ac">0</b> acertos</span><span class="stat ${ID}-stat-cb">${SVG_RAIO}combo <b class="${ID}-cb">0</b></span></div>` +
        `<div class="card ${ID}-card"><div class="tag ${ID}-tag"></div><div class="q ${ID}-q"></div><div class="${ID}-corpo"></div><div class="${ID}-certa" hidden></div></div>` +
        `<button class="btn ghost sm ${ID}-sair" style="align-self:center">Sair</button></div>`;
      q$('sair').onclick = sair;
      fimMs = Date.now() + DURACAO_MS;
      window.Sons && Sons.tocar('contagem', 'ja');
      timer = setInterval(tick, 100);
      mostrarPergunta();
    }
    function tick() {
      if (!el.isConnected) { limpar(); return; }
      const rest = Math.max(0, fimMs - Date.now());
      const seg = q$('seg'), barra = q$('barra'), rel = q$('relogio');
      { const s = Math.ceil(rest / 1000); if (seg && rest > 0 && s <= 10 && seg.textContent !== String(s)) window.Sons && Sons.tocar(s === 10 ? 'alerta' : 'contagem', 'tique'); }
      if (seg) seg.textContent = Math.ceil(rest / 1000);
      if (barra) barra.style.width = (100 * rest / DURACAO_MS).toFixed(1) + '%';
      if (rel) rel.classList.toggle(ID + '-urgente', rest <= 10000);
      if (rest <= 0) terminar();
    }
    function atualizaPlacar() {
      const ac = q$('ac'), cb = q$('cb'), scb = q$('stat-cb');
      if (ac) ac.textContent = st.acertos;
      if (cb) cb.textContent = st.combo;
      if (scb) scb.classList.toggle(ID + '-quente', st.combo >= COMBO_DOBRA);
    }
    function mostrarPergunta() {
      if (acabou) return;
      const q = proxima(st, perguntas);
      const card = q$('card'), tag = q$('tag'), qq = q$('q'), corpo = q$('corpo'), certa = q$('certa');
      if (!card) return;
      card.classList.remove(ID + '-ok', ID + '-bad');
      certa.hidden = true; certa.innerHTML = '';
      tag.textContent = q.t === 'vf' ? 'Verdadeiro ou falso' : 'Escolha a resposta';
      qq.textContent = q.q;
      if (q.t === 'mc') {
        const o = opcoesEmbaralhadas(q);
        corpo.innerHTML = `<div class="opts">${o.map((e, i) => `<button class="opt" data-i="${i}">${esc(e.x)}</button>`).join('')}</div>`;
        const bs = [...corpo.querySelectorAll('.opt')];
        bs.forEach((b, i) => b.onclick = () => {
          bs.forEach(x => x.style.pointerEvents = 'none');
          b.classList.add(o[i].c ? 'ok' : 'bad');
          if (!o[i].c) bs[o.findIndex(e => e.c)].classList.add('ok');
          responder(o[i].c, q.o[q.a]);
        });
      } else {
        corpo.innerHTML = `<div class="vf"><button class="opt" data-v="1">Verdadeiro</button><button class="opt" data-v="0">Falso</button></div>`;
        const bs = [...corpo.querySelectorAll('.opt')];
        bs.forEach(b => b.onclick = () => {
          const v = b.dataset.v === '1', ok = v === q.a;
          bs.forEach(x => x.style.pointerEvents = 'none');
          b.classList.add(ok ? 'ok' : 'bad');
          if (!ok) bs[q.a ? 0 : 1].classList.add('ok');
          responder(ok, q.a ? 'Verdadeiro' : 'Falso');
        });
      }
      atualizaPlacar();
    }
    function responder(ok, textoCerta) {
      if (acabou || !rodando) return;
      registrar(st, ok);
      window.Sons && Sons.tocar(ok ? (st.combo === COMBO_DOBRA ? 'powerup' : 'acerto_jogo') : 'erro_jogo');
      atualizaPlacar();
      const card = q$('card'), certa = q$('certa');
      if (ok) {
        card.classList.add(ID + '-ok');
        espera = setTimeout(() => { espera = null; mostrarPergunta(); }, PISCA_OK_MS);
      } else {
        card.classList.add(ID + '-bad');
        certa.innerHTML = `A resposta certa era <b>${esc(textoCerta)}</b>`;
        certa.hidden = false;
        espera = setTimeout(() => {
          espera = null; if (acabou) return;
          card.classList.remove(ID + '-bad');
          espera = setTimeout(() => { espera = null; mostrarPergunta(); }, Math.max(0, MOSTRA_CERTA_MS - PISCA_BAD_MS));
        }, PISCA_BAD_MS);
      }
    }

    /* --- fim --- */
    function terminar() {
      if (acabou) return;
      acabou = true; rodando = false; limpar();
      const p = pontosFinais(st), ganhou = st.acertos >= 1;
      if (ganhou) api.ganhou(p, 'Corrida fechada com ' + plural(st.acertos, 'acerto', 'acertos'));
      else api.perdeu('O tempo acabou sem nenhum acerto');
      window.Sons && Sons.tocar(ganhou ? 'vitoria_jogo' : 'gameover');
      el.innerHTML = `<div class="fim ${ID}-fim"><div class="big" style="color:${ganhou ? 'var(--mint)' : 'var(--gum)'}">${p}</div>` +
        `<h2>${ganhou ? 'Tempo esgotado' : 'Nenhum acerto desta vez'}</h2><p class="${ID}-sub">${ganhou ? (p === 1 ? 'ponto nesta corrida' : 'pontos nesta corrida') : 'Tenta de novo, agora você já viu as perguntas'}</p>` +
        `<div class="chips"><span class="stat">${SVG_OK}${plural(st.acertos, 'acerto', 'acertos')}</span><span class="stat">${SVG_X}${plural(st.erros, 'erro', 'erros')}</span><span class="stat">${SVG_RAIO}combo máximo ${st.maiorCombo}</span></div>` +
        (st.pontos > MAX_PONTOS ? `<p class="note">Você somou ${st.pontos}, mas o máximo que entra no ranking por corrida é ${MAX_PONTOS}.</p>` : '') +
        `<button class="btn ${ID}-denovo">Jogar de novo</button><button class="btn ghost ${ID}-voltar">Voltar</button></div>`;
      q$('denovo').onclick = reiniciar;
      q$('voltar').onclick = sair;
      try { window.scrollTo(0, 0); } catch (e) { }
    }

    telaInicio();
  }

  if (typeof window !== 'undefined') {
    window.JOGOS = window.JOGOS || [];
    window.JOGOS.push({
      id: ID,
      nome: 'Corrida 60s',
      desc: 'Responda o máximo de perguntas do tema em 60 segundos, com combo a cada acerto seguido.',
      icone: ICONE,
      disponivel(t) { return disponivel(t); },
      montar(el, t, api) { montar(el, t, api); }
    });
  }
  if (typeof module !== 'undefined') module.exports = { coletarPerguntas, baralhar, novoEstado, proxima, valorDoAcerto, registrar, pontosFinais, opcoesEmbaralhadas, disponivel, MAX_PONTOS, DURACAO_MS, COMBO_DOBRA, MIN_PERGUNTAS };
})();
