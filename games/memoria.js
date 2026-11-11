/* Dentolingu, jogo "Memória": pares de termo e definição do tema, 12 cartas em 3 colunas x 4 linhas.
   Toque abre a carta; a segunda aberta compara. Par certo fica travado, errado fica aberto até o jogador tocar de novo (ou 8 s), pra dar tempo de ler.
   Pontos: 20 até 9 tentativas, 15 até 14, 10 acima disso. Sem derrota.
   A lógica pura (coletar pares, escolher, montar cartas, pontos) fica fora do DOM pra rodar no node. */
'use strict';
(function () {
  const ID = 'memoria';
  const MAX_PARES = 6, MIN_PARES = 4, MAX_TEXTO = 140, FECHA_MS = 8000;

  /* ===== PURAS ===== */
  const norm = s => String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const embaralhar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const escapar = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Lista de pares [esq, dir, origem]: primeiro as perguntas 'par' das lições; se der menos de 6, entram os cards.
  function coletarPares(t) {
    const out = [], vistos = new Set();
    const add = (a, b, origem) => {
      a = String(a == null ? '' : a).trim(); b = String(b == null ? '' : b).trim();
      if (!a || !b) return;
      const ka = norm(a), kb = norm(b);
      if (!ka || !kb || ka === kb) return;
      const k = ka + '|' + kb;
      if (vistos.has(k)) return;
      vistos.add(k); out.push([a, b, origem]);
    };
    const licoes = (t && Array.isArray(t.licoes)) ? t.licoes : [];
    licoes.forEach(l => ((l && Array.isArray(l.qs)) ? l.qs : []).forEach(q => {
      if (q && q.t === 'par' && Array.isArray(q.p)) q.p.forEach(p => { if (Array.isArray(p)) add(p[0], p[1], 'par'); });
    }));
    if (out.length < MAX_PARES && t && Array.isArray(t.cards)) t.cards.forEach(c => { if (Array.isArray(c)) add(c[0], c[1], 'card'); });
    return out;
  }

  // Dois pares "brigam" quando um texto está dentro do outro, em qualquer lado (Lingual x Nervo lingual,
  // "Gow-Gates" como termo num par e como resposta noutro): na mesma rodada isso vira carta repetida.
  const parecido = (x, y) => { x = norm(x); y = norm(y); return x === y || (x.length >= 3 && y.length >= 3 && (x.includes(y) || y.includes(x))); };
  function conflita(a, b) {
    return parecido(a[0], b[0]) || parecido(a[1], b[1]) || parecido(a[0], b[1]) || parecido(a[1], b[0]);
  }

  // Sorteia até n pares, preferindo os das lições e evitando termos parecidos na mesma rodada.
  function escolherPares(pares, n, shuf) {
    shuf = shuf || embaralhar;
    const pool = shuf(pares.filter(p => p[2] !== 'card')).concat(shuf(pares.filter(p => p[2] === 'card')));
    const sel = [];
    for (const p of pool) { if (sel.length >= n) break; if (sel.some(s => conflita(s, p))) continue; sel.push(p); }
    for (const p of pool) { if (sel.length >= n) break; if (!sel.includes(p)) sel.push(p); }
    return sel;
  }

  // 2 cartas por par, embaralhadas: {par, lado (0 termo, 1 definição), texto}.
  function montarCartas(pares, shuf) {
    shuf = shuf || embaralhar;
    const cartas = [];
    pares.forEach((p, i) => { cartas.push({ par: i, lado: 0, texto: p[0] }); cartas.push({ par: i, lado: 1, texto: p[1] }); });
    return shuf(cartas);
  }

  const calcularPontos = tentativas => tentativas <= 9 ? 20 : tentativas <= 14 ? 15 : 10;

  function encurtar(s, max) {
    s = String(s == null ? '' : s).trim(); max = max || MAX_TEXTO;
    if (s.length <= max) return s;
    let c = s.slice(0, max - 1);
    const i = c.lastIndexOf(' ');
    if (i > max * 0.6) c = c.slice(0, i);
    return c.replace(/[\s,;.]+$/, '') + '…';
  }

  const fmtTempo = seg => Math.floor(seg / 60) + 'min ' + (seg % 60) + 's';
  const disponivel = t => coletarPares(t).length >= MIN_PARES;

  /* ===== DOM ===== */
  const ICONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/><path d="M5.3 17.2l1.6 1.6 3-3.2"/></svg>';
  const DENTE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3C4.5 3 3 5 3 7.5c0 2.5 1 4 1.5 6 .5 2 .5 6 1.8 7 1.3.8 1.7-1.8 2-4 .3-1.5 1.4-1.5 1.7 0 .3 2.2.7 4.8 2 4 1.3-1 1.3-5 1.8-7 .5-2 1.5-3.5 1.5-6C21 5 19.5 3 17 3c-1.8 0-3 .8-5 .8S8.8 3 7 3z"/></svg>';
  const CSS = `
.${ID}-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.${ID}-top .stat b{font-weight:800;margin-left:2px}
.${ID}-sair{margin-left:auto}
.${ID}-dica{color:var(--muted);font-size:14px;margin:10px 0 12px}
.${ID}-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:1fr;gap:8px;perspective:900px}
.${ID}-c{display:flex;width:100%;min-width:0;min-height:86px;border:0;background:none;padding:0;border-radius:14px;text-align:center;-webkit-tap-highlight-color:transparent}
.${ID}-in{flex:1;display:flex;position:relative;min-width:0;transform-style:preserve-3d;transition:transform .35s}
.${ID}-c.aberta .${ID}-in{transform:rotateY(180deg)}
.${ID}-f{position:absolute;inset:0;border-radius:14px;background:var(--vio);color:var(--surface);box-shadow:0 4px 0 var(--vio-d);display:grid;place-items:center;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.${ID}-f svg{width:32px;height:32px}
.${ID}-v{flex:1;min-width:0;min-height:86px;display:flex;align-items:center;justify-content:center;padding:8px 7px;border-radius:14px;background:var(--surface);border:2px solid var(--line);box-shadow:0 4px 0 var(--line);color:var(--ink);font-family:var(--f-body);font-size:13px;line-height:1.3;font-weight:700;overflow-wrap:anywhere;hyphens:auto;transform:rotateY(180deg);backface-visibility:hidden;-webkit-backface-visibility:hidden}
.${ID}-c.certa{pointer-events:none}
.${ID}-c.certa .${ID}-v{border-color:var(--mint);background:var(--ok-bg);box-shadow:0 4px 0 var(--mint)}
.${ID}-c.erro .${ID}-v{border-color:var(--gum);background:var(--bad-bg);box-shadow:0 4px 0 var(--gum);animation:${ID}-shake .35s}
@keyframes ${ID}-shake{25%{transform:rotateY(180deg) translateX(-5px)}75%{transform:rotateY(180deg) translateX(5px)}}
.${ID}-fim{display:flex;flex-direction:column;align-items:center;text-align:center;gap:14px;padding-top:20px}
.${ID}-fim h2{font-size:26px}
.${ID}-fim .btn{min-width:min(100%,280px)}
.${ID}-big{font-family:var(--f-display);font-size:56px;font-weight:700;line-height:1;color:var(--mint)}
.${ID}-lista{width:100%;text-align:left;gap:8px}
.${ID}-lista h3{font-size:16px}
.${ID}-lista div{display:flex;flex-direction:column;gap:2px;padding:8px 10px;border:2px solid var(--line);border-radius:12px;font-size:14px;overflow-wrap:anywhere}
.${ID}-lista b{font-family:var(--f-display);font-weight:600;font-size:15px}
.${ID}-lista span{color:var(--muted);font-size:13.5px}
@media (prefers-reduced-motion:reduce){.${ID}-in{transition:none}.${ID}-c.erro .${ID}-v{animation:none}}
`;
  function css() {
    if (document.getElementById('css-' + ID)) return;
    const s = document.createElement('style'); s.id = 'css-' + ID; s.textContent = CSS; document.head.appendChild(s);
  }
  const ATIVOS = typeof WeakMap === 'function' ? new WeakMap() : null;

  function montar(el, t, api) {
    css();
    api = api || {};
    const esc = api.esc || escapar, shuf = api.shuf || embaralhar;
    const antigo = ATIVOS && ATIVOS.get(el); if (antigo) antigo.limpar();
    const sel = escolherPares(coletarPares(t), MAX_PARES, shuf);
    const cartas = montarCartas(sel, shuf);
    const total = sel.length;
    const st = { aberta: -1, pend: [], timer: null, tentativas: 0, feitos: 0, t0: Date.now(), fim: false, limpar() { clearTimeout(st.timer); st.timer = null; } };
    if (ATIVOS) ATIVOS.set(el, st);
    const voltar = () => { st.limpar(); if (api.voltar) api.voltar(); };

    el.innerHTML = `<div class="${ID}-top"><span class="stat">Tentativas <b class="${ID}-nt">0</b></span><span class="stat">Pares <b class="${ID}-np">0</b> de ${total}</span><button type="button" class="btn ghost sm ${ID}-sair">Sair</button></div>` +
      `<p class="${ID}-dica">Toque em duas cartas. Termo e definição que combinam formam um par.</p>` +
      `<div class="${ID}-grid" role="group" aria-label="Cartas da memória">${cartas.map((c, k) => `<button type="button" class="${ID}-c" data-k="${k}" aria-label="Carta ${k + 1}, fechada"><span class="${ID}-in"><span class="${ID}-f" aria-hidden="true">${DENTE}</span><span class="${ID}-v" aria-hidden="true">${esc(encurtar(c.texto, MAX_TEXTO))}</span></span></button>`).join('')}</div>`;
    const dicaEl = el.querySelector('.' + ID + '-dica'), dicaPadrao = dicaEl ? dicaEl.textContent : '';
    const bs = [...el.querySelectorAll('.' + ID + '-c')], nt = el.querySelector('.' + ID + '-nt'), np = el.querySelector('.' + ID + '-np');
    el.querySelector('.' + ID + '-sair').onclick = voltar;

    const abrir = (k, sim) => {
      bs[k].classList.toggle('aberta', sim);
      bs[k].setAttribute('aria-label', 'Carta ' + (k + 1) + (sim ? ', ' + cartas[k].texto : ', fechada'));
      bs[k].querySelector('.' + ID + '-v').setAttribute('aria-hidden', sim ? 'false' : 'true');
    };
    function fecharPendentes() {
      if (!st.pend.length) return;
      clearTimeout(st.timer); st.timer = null;
      st.pend.forEach(k => { bs[k].classList.remove('erro'); abrir(k, false); });
      st.pend = [];
      if (dicaEl) dicaEl.textContent = dicaPadrao;
    }
    function tocar(k) {
      if (st.fim) return;
      const b = bs[k];
      if (st.pend.includes(k)) { fecharPendentes(); return; } // tocar numa carta errada fecha as duas
      if (b.classList.contains('certa') || (b.classList.contains('aberta') && st.aberta === k)) return;
      fecharPendentes();
      abrir(k, true);
      if (st.aberta < 0) window.Sons && Sons.tocar('clique');
      if (st.aberta < 0) { st.aberta = k; return; }
      const a = st.aberta; st.aberta = -1;
      st.tentativas++; nt.textContent = st.tentativas;
      if (cartas[a].par === cartas[k].par) {
        [a, k].forEach(i => bs[i].classList.add('certa'));
        st.feitos++; np.textContent = st.feitos;
        if (st.feitos < total) window.Sons && Sons.tocar('acerto_jogo');
        if (st.feitos === total) terminar();
      } else {
        st.pend = [a, k];
        window.Sons && Sons.tocar('erro_jogo');
        [a, k].forEach(i => bs[i].classList.add('erro'));
        if (dicaEl) dicaEl.textContent = 'Não é par. Leia as duas com calma e toque em qualquer carta para continuar.';
        st.timer = setTimeout(fecharPendentes, FECHA_MS);
      }
    }
    bs.forEach((b, k) => b.onclick = () => tocar(k));

    function terminar() {
      st.fim = true; st.limpar();
      const pontos = calcularPontos(st.tentativas), seg = Math.round((Date.now() - st.t0) / 1000);
      if (api.ganhou) api.ganhou(pontos, 'Fechou ' + total + ' pares em ' + st.tentativas + ' tentativas');
      window.Sons && Sons.tocar('vitoria_jogo');
      st.timer = setTimeout(() => {
        st.timer = null;
        if (!el.isConnected) return;
        const frase = pontos === 20 ? 'Memória afiada, fechou em até 9 tentativas.' : pontos === 15 ? 'Boa, fechou em até 14 tentativas.' : 'Fechou todos. Dá pra fazer em menos tentativas.';
        el.innerHTML = `<div class="${ID}-fim"><div class="${ID}-big">+${pontos}</div><h2>Todos os pares fechados</h2>` +
          `<div class="chips"><span class="stat">${st.tentativas} tentativas</span><span class="stat">${total} pares</span><span class="stat">${fmtTempo(seg)}</span></div>` +
          `<p class="note">${frase}</p>` +
          `<div class="card ${ID}-lista"><h3>Os pares desta rodada</h3>${sel.map(p => `<div><b>${esc(p[0])}</b><span>${esc(p[1])}</span></div>`).join('')}</div>` +
          `<button type="button" class="btn ${ID}-again">Jogar de novo</button><button type="button" class="btn ghost ${ID}-voltar">Voltar</button></div>`;
        el.querySelector('.' + ID + '-again').onclick = () => montar(el, t, api);
        el.querySelector('.' + ID + '-voltar').onclick = voltar;
        window.scrollTo(0, 0);
      }, 650);
    }
  }

  if (typeof window !== 'undefined') {
    window.JOGOS = window.JOGOS || [];
    window.JOGOS.push({
      id: ID,
      nome: 'Memória',
      desc: 'Encontre os pares de termo e definição com o menor número de tentativas',
      icone: ICONE,
      disponivel(t) { return disponivel(t); },
      montar(el, t, api) { montar(el, t, api); }
    });
  }
  if (typeof module !== 'undefined') module.exports = { norm, embaralhar, coletarPares, conflita, escolherPares, montarCartas, calcularPontos, encurtar, disponivel };
})();
