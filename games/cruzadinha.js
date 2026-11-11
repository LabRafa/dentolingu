/* Dentolingu, jogo CRUZADINHA (palavras cruzadas): de 6 a 10 termos do tema (t.termos) cruzados numa grade montada na hora.
   A palavra mais longa vai na horizontal, no centro; as outras entram cruzando por letras em comum, alternando horizontal
   e vertical, sempre na posição que cruza mais letras e sem encostar em palavra vizinha sem cruzar. O que não coube fica de fora.
   Toque numa casa pra escolher a palavra (toque de novo pra alternar horizontal/vertical onde as duas se cruzam); as letras
   vêm de um input escondido, que abre o teclado do celular. "Conferir" pinta certo/errado; "Revelar uma letra" até 3 vezes.
   Pontos: 30 menos 3 por letra revelada (mínimo 10). Máximo 30. Sem derrota, o jogador desiste pelo Voltar.
   A lógica pura (grade, numeração, pontos) fica fora do DOM pra ser testada com node. */
'use strict';
(function () {
  const ID = 'cruzadinha';
  const MAX_REV = 3, PONTOS_MAX = 30, SENT = ' ';
  const ICONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/><rect x="4.5" y="16.5" width="3" height="3" fill="currentColor" stroke="none"/><rect x="16.5" y="4.5" width="3" height="3" fill="currentColor" stroke="none"/></svg>';

  /* ===== LÓGICA PURA (sem DOM) ===== */
  // só A-Z maiúsculas, sem acento, sem espaço ou hífen (Gow-Gates vira GOWGATES)
  const normalizarPalavra = s => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '');
  function embaralhar(a, rnd) { rnd = rnd || Math.random; a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const pontuacao = reveladas => Math.max(10, PONTOS_MAX - 3 * (reveladas || 0));
  // termos que servem: 3 a 14 letras, com dica, sem repetição
  function termosValidos(termos) {
    const vistos = new Set(), out = [];
    (Array.isArray(termos) ? termos : []).forEach(x => {
      if (!x || typeof x !== 'object') return;
      const p = normalizarPalavra(x.p || x.e), d = String(x.d || '').trim();
      if (p.length < 3 || p.length > 14 || !d || vistos.has(p)) return;
      vistos.add(p); out.push({ p, e: String(x.e || '').trim() || p.toLowerCase(), d });
    });
    return out;
  }
  // uma tentativa de cruzar as palavras na ordem dada (ordem[0] = a mais longa, na horizontal, no centro de uma grade virtual NxN)
  function tentar(palavras, ordem, N) {
    const g = new Map(), chave = (r, c) => r * N + c;
    const get = (r, c) => (r < 0 || c < 0 || r >= N || c >= N) ? undefined : g.get(chave(r, c));
    const colocados = [];
    // quantas letras cruza (-1 = não cabe): letra diferente, mesma direção já ocupada, casa antes/depois ocupada ou vizinho lateral sem cruzar
    function cabe(p, r0, c0, dir) {
      const len = p.length, dr = dir === 'v' ? 1 : 0, dc = dir === 'h' ? 1 : 0;
      if (r0 < 0 || c0 < 0 || r0 + dr * (len - 1) >= N || c0 + dc * (len - 1) >= N) return -1;
      if (get(r0 - dr, c0 - dc) || get(r0 + dr * len, c0 + dc * len)) return -1;
      let cruz = 0;
      for (let i = 0; i < len; i++) {
        const r = r0 + dr * i, c = c0 + dc * i, ex = get(r, c);
        if (ex) { if (ex.l !== p[i] || ex[dir] >= 0) return -1; cruz++; }
        else if (get(r - dc, c - dr) || get(r + dc, c + dr)) return -1;
      }
      return cruz;
    }
    function por(idx, r0, c0, dir) {
      const p = palavras[idx].p, dr = dir === 'v' ? 1 : 0, dc = dir === 'h' ? 1 : 0;
      for (let i = 0; i < p.length; i++) {
        const r = r0 + dr * i, c = c0 + dc * i; let cel = g.get(chave(r, c));
        if (!cel) { cel = { l: p[i], h: -1, v: -1, r, c }; g.set(chave(r, c), cel); }
        cel[dir] = idx;
      }
      colocados.push({ i: idx, r: r0, c: c0, dir });
    }
    const p0 = palavras[ordem[0]].p;
    por(ordem[0], N >> 1, (N >> 1) - (p0.length >> 1), 'h');
    let quer = 'v'; // alterna a direção preferida
    for (let o = 1; o < ordem.length; o++) {
      const idx = ordem[o], p = palavras[idx].p; let melhor = null;
      for (const cel of g.values()) for (let i = 0; i < p.length; i++) {
        if (p[i] !== cel.l) continue;
        for (const dir of ['h', 'v']) {
          if (cel[dir] >= 0) continue;
          const r0 = dir === 'v' ? cel.r - i : cel.r, c0 = dir === 'h' ? cel.c - i : cel.c;
          const cruz = cabe(p, r0, c0, dir);
          if (cruz < 0) continue;
          const dist = Math.abs(r0 + (dir === 'v' ? p.length / 2 : 0) - N / 2) + Math.abs(c0 + (dir === 'h' ? p.length / 2 : 0) - N / 2);
          const sc = cruz * 10 + (dir === quer ? 3 : 0) - dist * 0.05;
          if (!melhor || sc > melhor.sc) melhor = { r0, c0, dir, sc };
        }
      }
      if (melhor) { por(idx, melhor.r0, melhor.c0, melhor.dir); quer = melhor.dir === 'h' ? 'v' : 'h'; }
    }
    return { g, colocados };
  }
  // recorta ao retângulo usado e numera (ordem de leitura; casa que começa horizontal e vertical recebe um número só)
  function recortar(g, colocados, palavras) {
    let rmin = Infinity, rmax = -1, cmin = Infinity, cmax = -1;
    for (const cel of g.values()) { rmin = Math.min(rmin, cel.r); rmax = Math.max(rmax, cel.r); cmin = Math.min(cmin, cel.c); cmax = Math.max(cmax, cel.c); }
    const rows = rmax - rmin + 1, cols = cmax - cmin + 1;
    const celulas = Array.from({ length: rows }, () => Array(cols).fill(null));
    const idxToJ = {}; colocados.forEach((w, j) => { idxToJ[w.i] = j; });
    const pals = colocados.map((w, j) => ({ j, p: palavras[w.i].p, e: palavras[w.i].e, d: palavras[w.i].d, dir: w.dir, r: w.r - rmin, c: w.c - cmin, n: 0 }));
    for (const cel of g.values()) celulas[cel.r - rmin][cel.c - cmin] = { l: cel.l, h: cel.h >= 0 ? idxToJ[cel.h] : -1, v: cel.v >= 0 ? idxToJ[cel.v] : -1, n: 0 };
    let n = 0;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const cel = celulas[r][c]; if (!cel) continue;
      const comecaH = cel.h >= 0 && pals[cel.h].r === r && pals[cel.h].c === c;
      const comecaV = cel.v >= 0 && pals[cel.v].r === r && pals[cel.v].c === c;
      if (comecaH || comecaV) { n++; cel.n = n; if (comecaH) pals[cel.h].n = n; if (comecaV) pals[cel.v].n = n; }
    }
    return { rows, cols, celulas, palavras: pals, total: g.size };
  }
  // várias tentativas (ordens diferentes, e até 3 subconjuntos de 10 quando o tema tem mais termos); fica a melhor:
  // mais palavras, depois grade estreita (cabe no celular, maxCols), depois compacta
  function gerarGrade(termos, opts) {
    opts = opts || {};
    const rnd = opts.rnd || Math.random, tentativas = opts.tentativas || 40, maxCols = opts.maxCols || 13, maxPal = opts.maxPalavras || 10, N = 64;
    const validos = termosValidos(termos);
    if (!validos.length) return null;
    const subconjuntos = validos.length > maxPal ? 3 : 1;
    let melhor = null;
    for (let s = 0; s < subconjuntos; s++) {
      const pool = (validos.length > maxPal ? embaralhar(validos, rnd).slice(0, maxPal) : validos.slice()).sort((a, b) => b.p.length - a.p.length);
      const resto = pool.slice(1).map((_, i) => i + 1);
      for (let t = 0; t < tentativas; t++) {
        const ordem = [0].concat(t === 0 ? resto : embaralhar(resto, rnd));
        const { g, colocados } = tentar(pool, ordem, N);
        const res = recortar(g, colocados, pool);
        const sobra = Math.max(0, res.cols - maxCols);
        res.score = colocados.length * 10 - sobra * 4 - Math.max(res.cols, res.rows) * 0.5 - res.rows * res.cols * 0.02;
        if (!melhor || res.score > melhor.score) melhor = res;
        if (colocados.length === pool.length && !sobra && t >= 8) break;
      }
    }
    return melhor;
  }

  /* ===== INTERFACE ===== */
  function injetarCss() {
    if (document.getElementById('css-' + ID)) return;
    const st = document.createElement('style'); st.id = 'css-' + ID;
    st.textContent = [
      '.cruzadinha{display:flex;flex-direction:column;gap:14px;min-width:0}',
      '.cruzadinha-top{display:flex;gap:8px;flex-wrap:wrap;align-items:center}',
      '.cruzadinha-ativa{gap:4px;min-height:76px;justify-content:center}',
      '.cruzadinha-dtexto{font-family:var(--f-display);font-weight:500;font-size:19px;line-height:1.25;text-wrap:balance;overflow-wrap:anywhere}',
      '.cruzadinha-wrap{position:relative;min-width:0}',
      '.cruzadinha-grade{--cs:28px;display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:2px;width:100%;max-width:calc(var(--cols)*44px + (var(--cols) - 1)*2px);margin:0 auto}',
      '.cruzadinha-cel{position:relative;aspect-ratio:1;border:2px solid var(--line);background:var(--surface);border-radius:6px;padding:0;margin:0;display:grid;place-items:center;font-family:var(--f-display);font-weight:600;font-size:calc(var(--cs)*.56);line-height:1;color:var(--ink);min-width:0;transition:background-color .12s,border-color .12s;-webkit-tap-highlight-color:transparent}',
      '.cruzadinha-cel>span{pointer-events:none}',
      '.cruzadinha-cel>small{position:absolute;top:1px;left:2px;font-family:var(--f-body);font-weight:800;font-size:calc(var(--cs)*.3);line-height:1;color:var(--muted);pointer-events:none}',
      '.cruzadinha-vazia{visibility:hidden;pointer-events:none;border-color:transparent;background:transparent}',
      '.cruzadinha-pal{background:color-mix(in srgb,var(--sky) 18%,var(--surface));border-color:color-mix(in srgb,var(--sky) 50%,var(--line))}',
      '.cruzadinha-cur{background:color-mix(in srgb,var(--sky) 36%,var(--surface));border-color:var(--sky)}',
      '.cruzadinha-ok{background:var(--ok-bg)}',
      '.cruzadinha-bad{background:var(--bad-bg)}',
      '.cruzadinha-rev{color:var(--vio)}',
      '.cruzadinha-in{position:absolute;top:0;left:0;width:1px;height:1px;opacity:0;border:0;padding:0;margin:0;font-size:16px;pointer-events:none;caret-color:transparent;background:transparent;color:transparent}',
      '.cruzadinha-acoes{display:grid;grid-template-columns:1fr 1fr;gap:10px}',
      '.cruzadinha-acoes .btn{white-space:normal;line-height:1.15;min-height:46px;padding-inline:10px}',
      '.cruzadinha-lista{display:flex;flex-direction:column;gap:8px}',
      '.cruzadinha-lista h3{font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-family:var(--f-body);font-weight:800;margin-top:6px}',
      '.cruzadinha-item{display:flex;gap:10px;align-items:flex-start;text-align:left;background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:10px 12px;font-size:14.5px;font-weight:600;color:var(--ink);min-height:44px;min-width:0;overflow-wrap:anywhere}',
      '.cruzadinha-item b{font-family:var(--f-display);font-size:16px;min-width:22px;color:var(--vio);flex:none}',
      '.cruzadinha-item small{color:var(--muted);font-weight:700}',
      '.cruzadinha-item.cruzadinha-sel{border-color:var(--sky);background:color-mix(in srgb,var(--sky) 14%,var(--surface))}',
      '.cruzadinha-item.cruzadinha-feita{opacity:.6}',
      '.cruzadinha-pals{width:100%;text-align:left;display:flex;flex-direction:column;gap:8px}',
      '.cruzadinha-pals div{background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:10px 12px;font-size:14.5px;overflow-wrap:anywhere}',
      '.cruzadinha-pals b{color:var(--vio);font-family:var(--f-display);font-weight:600;font-size:16px}',
      '@media (prefers-reduced-motion:reduce){.cruzadinha-cel{transition:none}}'
    ].join('\n');
    document.head.appendChild(st);
  }

  function montar(el, t, api) {
    injetarCss();
    el.innerHTML = '';
    const grade = gerarGrade(t && t.termos, { rnd: Math.random });
    const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (!grade || grade.palavras.length < 3) {
      el.innerHTML = '<div class="card"><h3>Cruzadinha</h3><p>Este tema ainda não tem termos suficientes pra cruzar as palavras.</p><button type="button" class="btn ghost full">Voltar</button></div>';
      el.querySelector('button').onclick = () => api.voltar();
      return;
    }
    const P = grade.palavras;
    const matriz = v => grade.celulas.map(row => row.map(() => v));
    const S = { pal: -1, cur: null, reveladas: 0, fim: false, timers: [], letras: matriz(''), marca: matriz(''), rev: matriz(false) };
    const celDe = (j, i) => { const p = P[j]; return { r: p.r + (p.dir === 'v' ? i : 0), c: p.c + (p.dir === 'h' ? i : 0) }; };
    const idxEm = (j, r, c) => P[j].dir === 'h' ? c - P[j].c : r - P[j].r;
    const certa = (r, c) => S.letras[r][c] === grade.celulas[r][c].l;
    const porN = (a, b) => a.n - b.n;
    const plural = (n, um, varios) => n === 1 ? um : varios.replace('#', n);

    const raiz = document.createElement('div'); raiz.className = ID;
    raiz.innerHTML = `<div class="cruzadinha-top"><span class="stat">${P.length} palavras</span><span class="stat cruzadinha-strev">0 de ${MAX_REV} reveladas</span></div>` +
      `<div class="card cruzadinha-ativa"><span class="tag">Como jogar</span><div class="cruzadinha-dtexto">Toque numa casa da grade ou numa dica da lista e digite as letras.</div></div>` +
      `<div class="cruzadinha-wrap"><div class="cruzadinha-grade" style="--cols:${grade.cols}" role="grid" aria-label="Grade da cruzadinha"></div><input class="cruzadinha-in" type="text" autocapitalize="characters" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="next" aria-label="Digite a letra da casa escolhida"></div>` +
      `<div class="cruzadinha-acoes"><button type="button" class="btn sm cruzadinha-bchk">Conferir</button><button type="button" class="btn ghost sm cruzadinha-brev">Revelar uma letra</button></div>` +
      `<div class="cruzadinha-lista"></div><button type="button" class="btn ghost full cruzadinha-bvoltar">Voltar</button>`;
    el.appendChild(raiz);
    const q = s => raiz.querySelector(s);
    const g = q('.cruzadinha-grade'), inp = q('.cruzadinha-in'), at = q('.cruzadinha-ativa'), lista = q('.cruzadinha-lista'), stRev = q('.cruzadinha-strev'), bRev = q('.cruzadinha-brev');

    // casas
    const cels = grade.celulas.map((row, r) => row.map((cel, c) => {
      let n;
      if (!cel) { n = document.createElement('span'); n.className = 'cruzadinha-cel cruzadinha-vazia'; n.setAttribute('aria-hidden', 'true'); }
      else {
        n = document.createElement('button'); n.type = 'button'; n.className = 'cruzadinha-cel';
        n.innerHTML = (cel.n ? '<small>' + cel.n + '</small>' : '') + '<span></span>';
        n.setAttribute('aria-label', 'Casa ' + (cel.n ? cel.n + ', ' : '') + 'linha ' + (r + 1) + ', coluna ' + (c + 1));
        n.onclick = () => tocar(r, c);
      }
      g.appendChild(n); return n;
    }));
    // dicas
    const item = p => `<button type="button" class="cruzadinha-item" data-j="${p.j}"><b>${p.n}</b><span>${api.esc(p.d)}<small> · ${p.p.length} letras</small></span></button>`;
    lista.innerHTML = '<h3>Horizontais</h3>' + P.filter(p => p.dir === 'h').sort(porN).map(item).join('') + '<h3>Verticais</h3>' + P.filter(p => p.dir === 'v').sort(porN).map(item).join('');
    const itens = {}; lista.querySelectorAll('.cruzadinha-item').forEach(b => { itens[b.dataset.j] = b; b.onclick = () => escolher(+b.dataset.j, true); });

    // tamanho da casa (a fonte acompanha)
    function ajustar() {
      if (!raiz.isConnected) { if (ajustar.ligado) limpar(); return; }
      const w = g.clientWidth; if (!w) return;
      g.style.setProperty('--cs', Math.max(16, Math.floor((w - 2 * (grade.cols - 1)) / grade.cols)) + 'px');
    }
    window.addEventListener('resize', ajustar); ajustar.ligado = true;
    ajustar(); S.timers.push(setTimeout(ajustar, 0), setTimeout(ajustar, 150));
    function limpar() { window.removeEventListener('resize', ajustar); ajustar.ligado = false; S.timers.forEach(clearTimeout); S.timers = []; }

    function foco() { inp.value = SENT; try { inp.focus({ preventScroll: true }); inp.setSelectionRange(1, 1); } catch (e) { } }
    const feita = j => { for (let i = 0; i < P[j].p.length; i++) { const cc = celDe(j, i); if (S.marca[cc.r][cc.c] !== 'ok') return false; } return true; };
    function pintar() {
      for (let r = 0; r < grade.rows; r++) for (let c = 0; c < grade.cols; c++) {
        const cel = grade.celulas[r][c]; if (!cel) continue;
        const n = cels[r][c];
        n.lastChild.textContent = S.letras[r][c];
        n.classList.toggle('cruzadinha-pal', S.pal >= 0 && (cel.h === S.pal || cel.v === S.pal));
        n.classList.toggle('cruzadinha-cur', !!S.cur && S.cur.r === r && S.cur.c === c);
        n.classList.toggle('cruzadinha-ok', S.marca[r][c] === 'ok');
        n.classList.toggle('cruzadinha-bad', S.marca[r][c] === 'bad');
        n.classList.toggle('cruzadinha-rev', S.rev[r][c]);
      }
      Object.keys(itens).forEach(j => { itens[j].classList.toggle('cruzadinha-sel', +j === S.pal); itens[j].classList.toggle('cruzadinha-feita', feita(+j)); });
      if (S.pal >= 0) { const p = P[S.pal]; at.innerHTML = `<span class="tag">${p.n} ${p.dir === 'h' ? 'horizontal' : 'vertical'} · ${p.p.length} letras</span><div class="cruzadinha-dtexto">${api.esc(p.d)}</div>`; }
      stRev.textContent = S.reveladas + ' de ' + MAX_REV + ' reveladas';
      bRev.disabled = S.reveladas >= MAX_REV || S.fim;
    }
    function escolher(j, rolar) {
      if (S.fim) return;
      S.pal = j; let alvo = null;
      for (let i = 0; i < P[j].p.length; i++) { const cc = celDe(j, i); if (!S.letras[cc.r][cc.c]) { alvo = cc; break; } }
      S.cur = alvo || celDe(j, 0);
      pintar(); foco();
      if (rolar) q('.cruzadinha-wrap').scrollIntoView({ block: 'center', behavior: RM ? 'auto' : 'smooth' });
    }
    function tocar(r, c) {
      const cel = grade.celulas[r][c]; if (!cel || S.fim) return;
      const mesma = !!S.cur && S.cur.r === r && S.cur.c === c, temH = cel.h >= 0, temV = cel.v >= 0;
      let pal;
      if (mesma && temH && temV) pal = S.pal === cel.h ? cel.v : cel.h;          // toque de novo: alterna
      else if (S.pal >= 0 && (cel.h === S.pal || cel.v === S.pal)) pal = S.pal;  // casa da palavra ativa: só move o cursor
      else { const dirAtual = S.pal >= 0 ? P[S.pal].dir : 'h'; pal = (dirAtual === 'v' && temV) ? cel.v : (temH ? cel.h : cel.v); }
      S.pal = pal; S.cur = { r, c };
      pintar(); foco();
    }
    function mover(d) {
      if (S.pal < 0 || !S.cur) return;
      const len = P[S.pal].p.length; let i = idxEm(S.pal, S.cur.r, S.cur.c) + d;
      if (i < 0 || i >= len) return;
      while (d > 0 && i < len - 1) { const cc = celDe(S.pal, i); if (S.rev[cc.r][cc.c]) i++; else break; } // pula letra já revelada
      S.cur = celDe(S.pal, i);
    }
    const completa = () => { for (let r = 0; r < grade.rows; r++) for (let c = 0; c < grade.cols; c++) if (grade.celulas[r][c] && !certa(r, c)) return false; return true; };
    function escrever(ch) {
      if (S.fim || !S.cur || S.pal < 0) return;
      const { r, c } = S.cur;
      if (!S.rev[r][c]) { S.letras[r][c] = ch; S.marca[r][c] = ''; }
      mover(1); pintar();
      if (completa()) vitoria();
    }
    function apagar() {
      if (S.fim || !S.cur || S.pal < 0) return;
      let { r, c } = S.cur;
      if (!S.letras[r][c] || S.rev[r][c]) { const i = idxEm(S.pal, r, c); if (i > 0) { S.cur = celDe(S.pal, i - 1); r = S.cur.r; c = S.cur.c; } }
      if (!S.rev[r][c]) { S.letras[r][c] = ''; S.marca[r][c] = ''; }
      pintar();
    }
    function proximaPalavra() {
      if (S.fim) return;
      const ordem = P.slice().sort(porN), k = ordem.findIndex(p => p.j === S.pal);
      escolher(ordem[(k + 1) % ordem.length].j, false);
    }
    function conferir() {
      if (S.fim) return;
      let erradas = 0, vazias = 0;
      for (let r = 0; r < grade.rows; r++) for (let c = 0; c < grade.cols; c++) {
        const cel = grade.celulas[r][c]; if (!cel) continue;
        if (!S.letras[r][c]) { vazias++; S.marca[r][c] = ''; }
        else { const ok = certa(r, c); S.marca[r][c] = ok ? 'ok' : 'bad'; if (!ok) erradas++; }
      }
      pintar();
      if (!erradas && !vazias) return vitoria();
      api.toast(erradas ? plural(erradas, '1 letra errada', '# letras erradas') : 'Tudo certo até aqui, ' + plural(vazias, 'falta 1 letra', 'faltam # letras'));
      window.Sons && Sons.tocar(erradas ? 'erro_jogo' : 'acerto_jogo');
    }
    function revelar() {
      if (S.fim || S.reveladas >= MAX_REV) return;
      let alvo = null;
      if (S.cur && !certa(S.cur.r, S.cur.c)) alvo = S.cur;
      if (!alvo && S.pal >= 0) for (let i = 0; i < P[S.pal].p.length && !alvo; i++) { const cc = celDe(S.pal, i); if (!certa(cc.r, cc.c)) alvo = cc; }
      if (!alvo) for (let r = 0; r < grade.rows && !alvo; r++) for (let c = 0; c < grade.cols && !alvo; c++) if (grade.celulas[r][c] && !certa(r, c)) alvo = { r, c };
      if (!alvo) return;
      const cel = grade.celulas[alvo.r][alvo.c];
      S.letras[alvo.r][alvo.c] = cel.l; S.marca[alvo.r][alvo.c] = 'ok'; S.rev[alvo.r][alvo.c] = true; S.reveladas++;
      if (S.pal < 0 || (cel.h !== S.pal && cel.v !== S.pal)) S.pal = cel.h >= 0 ? cel.h : cel.v;
      S.cur = alvo; mover(1); pintar();
      if (completa()) vitoria();
      else api.toast(plural(MAX_REV - S.reveladas, 'Só mais 1 letra pra revelar', 'Ainda dá pra revelar # letras').replace('Ainda dá pra revelar 0 letras', 'Acabaram as letras pra revelar'));
      if (!S.fim) window.Sons && Sons.tocar('powerup');
    }
    function vitoria() {
      if (S.fim) return; S.fim = true;
      for (let r = 0; r < grade.rows; r++) for (let c = 0; c < grade.cols; c++) if (grade.celulas[r][c]) S.marca[r][c] = 'ok';
      S.cur = null; pintar();
      at.innerHTML = '<span class="tag">Tudo certo</span><div class="cruzadinha-dtexto">Cruzadinha completa</div>';
      try { inp.blur(); } catch (e) { }
      const pts = pontuacao(S.reveladas);
      window.Sons && Sons.tocar('vitoria_jogo');
      api.ganhou(pts, S.reveladas ? 'Cruzadinha completa, ' + plural(S.reveladas, '1 letra revelada', '# letras reveladas') : 'Cruzadinha completa sem revelar nenhuma letra');
      S.timers.push(setTimeout(() => telaFim(pts), RM ? 0 : 700));
    }
    function telaFim(pts) {
      limpar();
      el.innerHTML = `<div class="fim"><div class="big" style="color:var(--mint)">+${pts}</div><h2>Cruzadinha completa</h2><div class="chips"><span class="stat">${pts} pontos</span><span class="stat">${P.length} palavras</span><span class="stat">${S.reveladas} de ${MAX_REV} reveladas</span></div>` +
        `<div class="cruzadinha-pals"><h3>Palavras do tema</h3>${P.slice().sort(porN).map(p => `<div><b>${api.esc(p.e)}</b> · ${api.esc(p.d)}</div>`).join('')}</div>` +
        `<button type="button" class="btn cruzadinha-denovo">Jogar de novo</button><button type="button" class="btn ghost cruzadinha-voltar2">Voltar</button></div>`;
      el.querySelector('.cruzadinha-denovo').onclick = () => montar(el, t, api);
      el.querySelector('.cruzadinha-voltar2').onclick = () => api.voltar();
      window.scrollTo(0, 0);
    }

    // teclado: o input guarda um espaço de sentinela; valor vazio = backspace (teclado do celular), letras novas = o que veio depois
    inp.addEventListener('input', () => {
      const v = inp.value;
      if (v.length === 0) apagar();
      else for (const ch of normalizarPalavra(v)) escrever(ch);
      inp.value = SENT; try { inp.setSelectionRange(1, 1); } catch (e) { }
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); apagar(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); mover(1); pintar(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); mover(-1); pintar(); }
      else if (e.key === 'Enter') { e.preventDefault(); proximaPalavra(); }
    });
    q('.cruzadinha-bchk').onclick = conferir;
    bRev.onclick = revelar;
    q('.cruzadinha-bvoltar').onclick = () => { limpar(); api.voltar(); };
    pintar();
  }

  if (typeof window !== 'undefined') {
    window.JOGOS = window.JOGOS || [];
    window.JOGOS.push({
      id: ID,
      nome: 'Cruzadinha',
      desc: 'Palavras cruzadas com os termos do tema, cada dica numa casa numerada',
      icone: ICONE,
      disponivel(t) { return termosValidos(t && t.termos).length >= 6; },
      montar
    });
  }
  if (typeof module !== 'undefined') module.exports = { normalizarPalavra, embaralhar, pontuacao, termosValidos, gerarGrade };
})();
