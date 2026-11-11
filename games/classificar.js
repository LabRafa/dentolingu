/* Dentolingu, jogo "Classificar": cada coisa no seu ramo.
   Usa t.mapa.ramos: sorteia até 12 itens (no máximo 3 por ramo) e o aluno toca no ramo onde o item se encaixa.
   Lógica pura (sorteio, pontos) separada do DOM pra testar com node. JavaScript puro, sem biblioteca, sem build. */
'use strict';
(function () {
  const ID = 'classificar', MAX_ITENS = 12, POR_RAMO = 3;

  /* ===== PURAS (sem DOM) ===== */
  const norm = s => String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, ' ');
  function embaralhar(arr, rand) {
    rand = rand || Math.random; const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  // Ramos que dão jogo: nome, cor e itens. Item que aparece em mais de um ramo é ambíguo e sai do sorteio.
  function ramosJogaveis(t) {
    const brutos = t && t.mapa && Array.isArray(t.mapa.ramos) ? t.mapa.ramos : [];
    const conta = {};
    brutos.forEach(r => (r && Array.isArray(r.i) ? r.i : []).forEach(x => { if (typeof x === 'string' && x.trim()) conta[norm(x)] = (conta[norm(x)] || 0) + 1; }));
    return brutos.map(r => ({
      nome: r && typeof r.t === 'string' ? r.t.trim() : '',
      cor: r && typeof r.cor === 'string' && /^#[0-9a-f]{3,8}$/i.test(r.cor.trim()) ? r.cor.trim() : '',
      i: (r && Array.isArray(r.i) ? r.i : []).filter(x => typeof x === 'string' && x.trim() && conta[norm(x)] === 1)
    })).filter(r => r.nome && r.i.length >= 1);
  }
  const disponivel = t => ramosJogaveis(t).filter(r => r.i.length >= 2).length >= 3;
  // Sorteio: até 3 itens por ramo, em rodízio entre os ramos (todo ramo entra se couber), até 12 no total, embaralhado.
  // Devolve [{texto, ramo}] onde ramo é o índice dentro de `ramos`.
  function sortear(ramos, rand) {
    rand = rand || Math.random;
    const filas = ramos.map((r, k) => embaralhar(r.i, rand).slice(0, POR_RAMO).map(texto => ({ texto, ramo: k })));
    const ordem = embaralhar(filas.map((_, k) => k), rand), out = [];
    for (let volta = 0; volta < POR_RAMO && out.length < MAX_ITENS; volta++)
      for (const k of ordem) { if (out.length >= MAX_ITENS) break; if (filas[k][volta]) out.push(filas[k][volta]); }
    return embaralhar(out, rand);
  }
  const pontuar = (acertos, erros) => acertos * 2 + (erros === 0 && acertos > 0 ? 1 : 0);
  const venceu = (acertos, total) => total > 0 && acertos * 2 >= total;

  if (typeof module !== 'undefined' && module.exports) module.exports = { embaralhar, ramosJogaveis, disponivel, sortear, pontuar, venceu, MAX_ITENS, POR_RAMO };
  if (typeof window === 'undefined') return;

  /* ===== NAVEGADOR ===== */
  const ICONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8.5" y="2.5" width="7" height="6" rx="2"/><rect x="2.5" y="14.5" width="7.5" height="7" rx="2"/><rect x="14" y="14.5" width="7.5" height="7" rx="2"/><path d="M12 8.5v2.5M12 11l-5.75 3.5M12 11l5.75 3.5"/></svg>';
  const CSS = `
.${ID}-wrap{display:flex;flex-direction:column;gap:14px;min-height:60vh}
.${ID}-top{display:flex;align-items:center;gap:12px}
.${ID}-top .bar{flex:1;margin:0;height:14px}
.${ID}-sair{flex:none;min-width:44px;min-height:44px;display:grid;place-items:center;border-radius:12px}
.${ID}-cnt{font-weight:800;font-variant-numeric:tabular-nums;color:var(--muted);font-size:14px;white-space:nowrap}
.${ID}-item{position:relative;background:var(--surface);border:2px solid var(--line);border-radius:22px;padding:28px 18px;min-height:132px;display:grid;place-items:center;text-align:center;font-family:var(--f-display);font-weight:500;font-size:21px;line-height:1.25;text-wrap:balance;overflow-wrap:anywhere;color:var(--ink);transition:background .2s,border-color .2s}
.${ID}-item.${ID}-ok{background:var(--ok-bg);border-color:var(--mint)}
.${ID}-item.${ID}-bad{background:var(--bad-bg);border-color:var(--gum)}
.${ID}-item.${ID}-shake{animation:${ID}-shake .4s}
@keyframes ${ID}-shake{20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}
.${ID}-selo{position:absolute;top:-13px;right:14px;background:var(--surface);border:2px solid var(--sun-d);color:var(--sun-d);border-radius:999px;padding:3px 11px;font-family:var(--f-body);font-weight:800;font-size:12.5px;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}
.${ID}-fb{min-height:22px;text-align:center;font-weight:800;color:var(--gum-d);font-size:15px}
.${ID}-fb.${ID}-prev{color:var(--muted);font-weight:700;font-size:13.5px}
.${ID}-dica{text-align:center;color:var(--muted);font-size:13px;font-weight:700;margin:0}
.${ID}-ramos{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.${ID}-ramo{--c:var(--sky);min-height:60px;border-radius:16px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 18%,var(--surface));color:var(--ink);font-family:var(--f-display);font-weight:600;font-size:16px;line-height:1.2;padding:10px 12px;display:flex;align-items:center;gap:10px;text-align:left;box-shadow:0 4px 0 var(--c);transition:transform .08s,box-shadow .08s,opacity .2s;min-width:0}
.${ID}-ramo span{min-width:0;overflow-wrap:anywhere}
.${ID}-ramo i{flex:none;width:14px;height:14px;border-radius:50%;background:var(--c)}
.${ID}-ramo:active{transform:translateY(3px);box-shadow:0 1px 0 var(--c)}
.${ID}-ramo:last-child:nth-child(odd){grid-column:1/-1}
.${ID}-ramos.${ID}-lock .${ID}-ramo{pointer-events:none}
.${ID}-ramo.${ID}-certo{box-shadow:0 0 0 3px var(--mint),0 4px 0 var(--c);background:var(--ok-bg)}
.${ID}-ramo.${ID}-errado{opacity:.5;background:var(--bad-bg)}
.${ID}-fim{display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;padding-top:24px}
.${ID}-fim h2{font-size:26px}
.${ID}-big{font-family:var(--f-display);font-size:54px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
.${ID}-rev{width:100%;text-align:left;display:flex;flex-direction:column;gap:8px}
.${ID}-rev h3{font-size:17px}
.${ID}-rev div{background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:10px 12px;font-size:14.5px;overflow-wrap:anywhere}
.${ID}-rev b{color:var(--gum)}
@media (prefers-reduced-motion: reduce){.${ID}-item,.${ID}-ramo{animation:none!important;transition:none!important}}
`;
  function css() {
    if (document.getElementById('css-' + ID)) return;
    const s = document.createElement('style'); s.id = 'css-' + ID; s.textContent = CSS; document.head.appendChild(s);
  }

  function montar(el, t, api) {
    css();
    const esc = api.esc, $ = s => el.querySelector(s);
    const ramos = ramosJogaveis(t), itens = sortear(ramos), total = itens.length;
    const st = { i: 0, acertos: 0, erros: [], combo: 0, lock: false, fim: false, timers: [] };
    const depois = (fn, ms) => { const id = setTimeout(() => { st.timers = st.timers.filter(x => x !== id); if (el.isConnected) fn(); }, ms); st.timers.push(id); };
    const limpar = () => { st.timers.forEach(clearTimeout); st.timers = []; };
    const sair = () => { limpar(); api.voltar(); };
    const paleta = Array.isArray(api.cores) && api.cores.length ? api.cores : ['#7566f0', '#ec5b78', '#1fa88f', '#2f8fe0', '#e89a00', '#8a5a44'];
    const corDe = (r, k) => r.cor || paleta[k % paleta.length];

    if (!total) {
      el.innerHTML = `<div class="card"><p>Este tema ainda não tem mapa suficiente pra classificar.</p><button class="btn ghost ${ID}-back">Voltar</button></div>`;
      $(`.${ID}-back`).onclick = sair; return;
    }
    el.innerHTML = `<div class="${ID}-wrap">
      <div class="${ID}-top"><button class="back ${ID}-sair" aria-label="Sair do jogo">&#10005;</button><div class="bar"><i style="width:0%"></i></div><span class="${ID}-cnt"></span></div>
      <div class="${ID}-item" aria-live="polite"><span class="${ID}-txt"></span><span class="${ID}-selo" hidden></span></div>
      <div class="${ID}-fb" aria-live="polite"></div>
      <p class="${ID}-dica">Toque no ramo onde isso se encaixa</p>
      <div class="${ID}-ramos">${ramos.map((r, k) => `<button class="${ID}-ramo" data-k="${k}" style="--c:${esc(corDe(r, k))}"><i></i><span>${esc(r.nome)}</span></button>`).join('')}</div>
    </div>`;
    const bar = $('.bar>i'), cnt = $(`.${ID}-cnt`), card = $(`.${ID}-item`), txt = $(`.${ID}-txt`), selo = $(`.${ID}-selo`), fb = $(`.${ID}-fb`), grid = $(`.${ID}-ramos`), bts = [...grid.children];
    $(`.${ID}-sair`).onclick = sair;

    function seloCombo() { if (st.combo >= 3) { selo.textContent = st.combo + ' em sequência'; selo.hidden = false; } else selo.hidden = true; }
    function mostrar() {
      if (st.i >= total) return fim();
      bar.style.width = Math.round(100 * st.i / total) + '%';
      cnt.textContent = (st.i + 1) + ' de ' + total;
      card.className = ID + '-item'; txt.textContent = itens[st.i].texto; seloCombo();
      bts.forEach(b => b.classList.remove(`${ID}-certo`, `${ID}-errado`));
      grid.classList.remove(`${ID}-lock`); st.lock = false;
    }
    function responder(k) {
      if (st.lock || st.fim) return;
      st.lock = true; grid.classList.add(`${ID}-lock`);
      const it = itens[st.i], certo = ramos[it.ramo].nome;
      if (k === it.ramo) {
        st.acertos++; st.combo++; seloCombo();
        window.Sons && Sons.tocar(st.combo === 3 ? 'powerup' : 'acerto_jogo');
        card.classList.add(`${ID}-ok`); fb.className = `${ID}-fb`; fb.textContent = '';
        depois(() => { st.i++; mostrar(); }, 450);
      } else {
        st.combo = 0; seloCombo(); st.erros.push({ texto: it.texto, certo });
        window.Sons && Sons.tocar('erro_jogo');
        card.classList.add(`${ID}-bad`, `${ID}-shake`);
        bts[k].classList.add(`${ID}-errado`); bts[it.ramo].classList.add(`${ID}-certo`);
        fb.className = `${ID}-fb`; fb.textContent = 'Era: ' + certo;
        depois(() => { fb.className = `${ID}-fb ${ID}-prev`; fb.textContent = 'O anterior era ' + certo; st.i++; mostrar(); }, 700);
      }
    }
    bts.forEach(b => b.onclick = () => responder(+b.dataset.k));

    function fim() {
      if (st.fim) return; st.fim = true; limpar();
      const pts = pontuar(st.acertos, st.erros.length), ganhou = venceu(st.acertos, total), perfeito = st.erros.length === 0;
      const msg = perfeito ? 'Tudo no lugar certo' : ganhou ? 'Boa, a maioria no lugar' : 'Faltou encaixar mais da metade';
      if (ganhou) api.ganhou(pts, msg); else api.perdeu(msg);
      window.Sons && Sons.tocar(ganhou ? 'vitoria_jogo' : 'gameover');
      el.innerHTML = `<div class="${ID}-fim">
        <div class="${ID}-big" style="color:${ganhou ? 'var(--mint)' : 'var(--gum)'}">${st.acertos}/${total}</div>
        <h2>${msg}</h2>
        <div class="chips">${ganhou ? `<span class="stat">+${pts} pontos</span>` : ''}<span class="stat">${st.acertos} ${st.acertos === 1 ? 'certa' : 'certas'}</span>${perfeito ? '<span class="stat">bônus +1</span>' : `<span class="stat">${st.erros.length} ${st.erros.length === 1 ? 'erro' : 'erros'}</span>`}</div>
        ${ganhou ? '' : `<p class="note">Acertando metade ou mais os pontos entram no ranking.</p>`}
        ${st.erros.length ? `<div class="${ID}-rev"><h3>Para rever</h3>${st.erros.map(e => `<div>${esc(e.texto)}<br><b>Era:</b> ${esc(e.certo)}</div>`).join('')}</div>` : ''}
        <button class="btn full ${ID}-again">Jogar de novo</button><button class="btn ghost full ${ID}-back">Voltar</button>
      </div>`;
      $(`.${ID}-again`).onclick = () => montar(el, t, api); $(`.${ID}-back`).onclick = sair;
      window.scrollTo(0, 0);
    }
    mostrar();
  }

  if (typeof window !== 'undefined') {
    window.JOGOS = window.JOGOS || [];
    if (!window.JOGOS.some(j => j && j.id === ID)) window.JOGOS.push({
      id: ID,
      nome: 'Classificar',
      desc: 'Cada coisa no seu ramo: toque no ramo do mapa onde o item se encaixa.',
      icone: ICONE,
      disponivel(t) { return disponivel(t); },
      montar(el, t, api) { montar(el, t, api); }
    });
  }
})();
