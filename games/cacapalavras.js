/* Dentolingu, jogo CAÇA-PALAVRAS: os termos do tema escondidos numa grade de letras (10x10, ou 12x12 se houver termo com mais de 10 letras).
   Toque: primeira letra e depois a última (mesma linha, coluna ou diagonal). A lista mostra as DICAS com a quantidade de letras;
   ao achar, aparece a palavra escrita por extenso. "Mostrar palavras" custa 10 pontos, uma vez só.
   Pontos: 20 (ou 10 se mostrou) + 5 de bônus se terminar em menos de 3 min. Máximo 25. Sem derrota.
   A lógica pura (grade, alinhamento, pontos) fica fora do DOM pra ser testada com node.
   Arquivo e id = "cacapalavras" (é o nome que o index.html carrega). */
'use strict';
(function () {
  const ID = 'cacapalavras';
  const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DIR_F = [[0, 1], [1, 0], [1, 1], [-1, 1]];     // leitura normal (da esquerda pra direita, ou de cima pra baixo): →, ↓, ↘, ↗
  const DIR_R = [[0, -1], [-1, 0], [-1, -1], [1, -1]]; // de trás pra frente: ←, ↑, ↖, ↙
  const ICO_TM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>';
  const ICO_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>';
  const ICONE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h5M4 10h5M4 15h5M4 20h9M13 5h7M13 10h2"/><circle cx="16.5" cy="15.5" r="3.5"/><path d="M19 18l2.5 2.5"/></svg>';

  /* ===== LÓGICA PURA (sem DOM) ===== */
  const rndInt = (rnd, a, b) => a + Math.floor(rnd() * (b - a + 1)); // inteiro em [a, b]
  function shufR(a, rnd) { rnd = rnd || Math.random; a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  // termos que servem: p só com A-Z, de 3 a 12 letras (mais que 12 não cabe nem na grade 12x12), sem repetição
  function validos(termos) {
    const vistos = {};
    return (Array.isArray(termos) ? termos : []).filter(x => x && typeof x.p === 'string' && /^[A-Z]{3,12}$/.test(x.p) && !vistos[x.p] && (vistos[x.p] = true));
  }
  const escolher = (termos, rnd) => shufR(validos(termos), rnd).slice(0, 10); // de 6 a 10 (quem garante o mínimo é disponivel)
  const tamanho = ts => ts.some(x => x.p.length > 10) ? 12 : 10;
  const faixa = (d, L, n) => d === 0 ? [0, n - 1] : d > 0 ? [0, n - L] : [L - 1, n - 1]; // onde a palavra pode começar naquela direção
  function marcarInvertidos(qtd, rnd) { // 1 ou 2 termos de trás pra frente
    rnd = rnd || Math.random;
    const inv = Array(qtd).fill(false), k = Math.min(qtd, rndInt(rnd, 1, 2));
    shufR(inv.map((_, i) => i), rnd).slice(0, k).forEach(i => { inv[i] = true; });
    return inv;
  }
  function tentar(ts, n, rnd, inv) { // uma tentativa de colocar todos; null se algum não coube
    const grade = Array.from({ length: n }, () => Array(n).fill(''));
    const palavras = [];
    for (let k = 0; k < ts.length; k++) {
      const w = ts[k].p, L = w.length, dirs = inv[k] ? DIR_R : DIR_F;
      let ok = false;
      for (let a = 0; a < 200 && !ok; a++) {
        const [dr, dc] = dirs[Math.floor(rnd() * dirs.length)];
        const [ra, rb] = faixa(dr, L, n), [ca, cb] = faixa(dc, L, n);
        if (rb < ra || cb < ca) continue;
        const r0 = rndInt(rnd, ra, rb), c0 = rndInt(rnd, ca, cb);
        let cabe = true;
        for (let i = 0; i < L && cabe; i++) { const ch = grade[r0 + dr * i][c0 + dc * i]; if (ch && ch !== w[i]) cabe = false; }
        if (!cabe) continue;
        for (let i = 0; i < L; i++) grade[r0 + dr * i][c0 + dc * i] = w[i];
        palavras.push({ p: w, e: ts[k].e || w, d: ts[k].d || '', r0, c0, r1: r0 + dr * (L - 1), c1: c0 + dc * (L - 1), inv: !!inv[k] });
        ok = true;
      }
      if (!ok) return null;
    }
    return { grade, palavras };
  }
  function gerarGrade(termos, rnd) {
    rnd = rnd || Math.random;
    let ts = validos(termos).sort((a, b) => b.p.length - a.p.length); // mais longo primeiro: encaixa melhor
    while (ts.length) {
      const n = tamanho(ts);
      for (let v = 0; v < 40; v++) {
        const r = tentar(ts, n, rnd, marcarInvertidos(ts.length, rnd));
        if (r) {
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (!r.grade[i][j]) r.grade[i][j] = LETRAS[Math.floor(rnd() * 26)];
          return { n, grade: r.grade, palavras: r.palavras };
        }
      }
      ts = ts.slice(1); // não coube de jeito nenhum: tira o mais longo e tenta de novo
    }
    return null;
  }
  function alinhado(a, b) { // células entre dois toques, se estão na mesma linha, coluna ou diagonal; senão null
    const dR = b.r - a.r, dC = b.c - a.c;
    if (dR && dC && Math.abs(dR) !== Math.abs(dC)) return null;
    const dr = Math.sign(dR), dc = Math.sign(dC), L = Math.max(Math.abs(dR), Math.abs(dC)), cs = [];
    for (let i = 0; i <= L; i++) cs.push({ r: a.r + dr * i, c: a.c + dc * i });
    return cs;
  }
  const lerCaminho = (grade, cs) => cs.map(x => grade[x.r][x.c]).join('');
  const inverter = s => s.split('').reverse().join('');
  const conferir = (palavras, str) => palavras.find(w => !w.achada && (w.p === str || w.p === inverter(str))) || null;
  const pontos = (mostrou, seg) => (mostrou ? 10 : 20) + (seg < 180 ? 5 : 0);
  const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0');

  /* ===== CSS (uma vez, tudo com prefixo cacapalavras-) ===== */
  const CSS = `
.cacapalavras-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.cacapalavras-grade{display:grid;grid-template-columns:repeat(var(--n),1fr);gap:2px;width:100%;max-width:480px;margin:0 auto;background:var(--surface);border:2px solid var(--line);border-radius:18px;padding:5px;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.cacapalavras-grade.cacapalavras-g12{gap:1px;padding:3px;border-radius:14px}
.cacapalavras-cel{aspect-ratio:1;min-width:0;padding:0;border:2px solid transparent;border-radius:8px;background:var(--bg);color:var(--ink);font-family:var(--f-display);font-weight:600;font-size:clamp(11px,calc(52vw / var(--n)),20px);line-height:1;display:grid;place-items:center;-webkit-tap-highlight-color:transparent;transition:background .12s,border-color .12s}
.cacapalavras-g12 .cacapalavras-cel{border-radius:6px}
.cacapalavras-cel.cacapalavras-sel{border-color:var(--sky);background:color-mix(in srgb,var(--sky) 22%,var(--surface))}
.cacapalavras-cel.cacapalavras-ok{border-color:var(--c);background:color-mix(in srgb,var(--c) 32%,var(--surface))}
.cacapalavras-ajuda{text-align:center;color:var(--muted);font-size:13.5px}
.cacapalavras-lista{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.cacapalavras-item{display:flex;align-items:center;gap:10px;background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:9px 12px;font-size:14.5px;min-width:0;min-height:44px}
.cacapalavras-item i{flex:none;width:12px;height:12px;border-radius:50%;background:var(--line)}
.cacapalavras-item.cacapalavras-feita{border-color:var(--c);background:color-mix(in srgb,var(--c) 10%,var(--surface))} .cacapalavras-item.cacapalavras-feita i{background:var(--c)}
.cacapalavras-item span{flex:1;min-width:0;overflow-wrap:anywhere}
.cacapalavras-item s{font-weight:800;text-decoration-thickness:2px} .cacapalavras-item small{display:block;color:var(--muted);font-size:12.5px}
.cacapalavras-item b{font-family:var(--f-display);letter-spacing:.06em;font-weight:600}
.cacapalavras-rodape{display:flex;flex-direction:column;gap:8px}
.cacapalavras-fim{align-items:center;text-align:center}
@media (prefers-reduced-motion: reduce){.cacapalavras-cel{transition:none}}
`;
  function css() { if (typeof document === 'undefined' || document.getElementById('css-' + ID)) return; const s = document.createElement('style'); s.id = 'css-' + ID; s.textContent = CSS; document.head.appendChild(s); }

  /* ===== JOGO (DOM) ===== */
  function montar(el, t, api) {
    css();
    const esc = api.esc;
    const g = gerarGrade(escolher(t && t.termos));
    if (!g) {
      el.innerHTML = `<div class="card"><p>Este tema ainda não tem termos suficientes pra montar a grade.</p><button class="btn ghost full" data-k="back">Voltar</button></div>`;
      el.querySelector('[data-k="back"]').onclick = () => api.voltar();
      return;
    }
    const { n, grade } = g, palavras = shufR(g.palavras); // ordem da lista não entrega o tamanho
    palavras.forEach((w, i) => { w.cor = api.cores[i % api.cores.length]; w.achada = false; });
    const st = { t0: Date.now(), timer: null, sel: null, achadas: 0, mostrou: false, fim: false, shakes: [] };
    el.innerHTML = `<div class="cacapalavras-top"><span class="stat" data-k="ct" title="Achadas">${ICO_OK}0/${palavras.length}</span><span class="stat" data-k="tm" title="Tempo">${ICO_TM}00:00</span></div>` +
      `<div class="cacapalavras-grade${n === 12 ? ' cacapalavras-g12' : ''}" style="--n:${n}" role="group" aria-label="Grade de letras" data-k="gr">${grade.map((lin, r) => lin.map((ch, c) => `<button type="button" class="cacapalavras-cel" data-r="${r}" data-c="${c}">${ch}</button>`).join('')).join('')}</div>` +
      `<p class="cacapalavras-ajuda">Toque na primeira letra e depois na última. Vale na horizontal, na vertical e na diagonal.</p>` +
      `<ul class="cacapalavras-lista" data-k="ls"></ul>` +
      `<div class="cacapalavras-rodape" data-k="rodape"><button class="btn ghost full" data-k="rev">Mostrar palavras</button><p class="note">Custa 10 pontos e só pode uma vez.</p></div>`;
    const q = k => el.querySelector(`[data-k="${k}"]`);
    const cel = (r, c) => el.querySelector(`.cacapalavras-cel[data-r="${r}"][data-c="${c}"]`);
    const parar = () => { if (st.timer) { clearInterval(st.timer); st.timer = null; } st.shakes.forEach(clearTimeout); st.shakes = []; };
    const tick = () => { if (!el.isConnected) return parar(); const e = q('tm'); if (e) e.innerHTML = ICO_TM + fmt((Date.now() - st.t0) / 1000); };
    st.timer = setInterval(tick, 500);
    function lista() {
      q('ls').innerHTML = palavras.map(w => {
        const L = w.p.length, dica = w.d ? esc(w.d) : '';
        const corpo = w.achada ? `<s>${esc(w.e)}</s>${dica ? `<small>${dica}</small>` : ''}`
          : st.mostrou ? `<b>${esc(w.p)}</b>${dica ? `<small>${dica}</small>` : ''}`
            : dica ? `${dica} (${L})` : `Palavra de ${L} letras`;
        return `<li class="cacapalavras-item${w.achada ? ' cacapalavras-feita' : ''}" style="--c:${w.cor}"><i></i><span>${corpo}</span></li>`;
      }).join('');
      q('ct').innerHTML = ICO_OK + st.achadas + '/' + palavras.length;
    }
    function limpar() { if (st.sel) { const b = cel(st.sel.r, st.sel.c); if (b) b.classList.remove('cacapalavras-sel'); } st.sel = null; }
    function erra(cs) {
      window.Sons && Sons.tocar('erro_jogo');
      cs.forEach(x => { const b = cel(x.r, x.c); if (b) b.classList.add('shake'); });
      st.shakes.push(setTimeout(() => cs.forEach(x => { const b = cel(x.r, x.c); if (b) b.classList.remove('shake'); }), 380));
      limpar();
    }
    function tocar(r, c) {
      if (!st.fim && !st.sel) window.Sons && Sons.tocar('clique');
      if (st.fim) return;
      if (!st.sel) { st.sel = { r, c }; cel(r, c).classList.add('cacapalavras-sel'); return; }
      if (st.sel.r === r && st.sel.c === c) return limpar(); // tocou de novo na mesma: desmarca
      const cs = alinhado(st.sel, { r, c });
      if (!cs) return erra([st.sel, { r, c }]);
      const w = conferir(palavras, lerCaminho(grade, cs));
      if (!w) return erra(cs);
      limpar(); w.achada = true; st.achadas++;
      if (st.achadas < palavras.length) window.Sons && Sons.tocar('acerto_jogo');
      cs.forEach(x => { const b = cel(x.r, x.c); if (b && !b.classList.contains('cacapalavras-ok')) { b.classList.add('cacapalavras-ok'); b.style.setProperty('--c', w.cor); } });
      lista();
      if (st.achadas === palavras.length) fim();
    }
    q('gr').addEventListener('click', e => { const b = e.target.closest('.cacapalavras-cel'); if (b) tocar(+b.dataset.r, +b.dataset.c); });
    q('rev').onclick = () => {
      if (st.mostrou || st.fim) return;
      st.mostrou = true; q('rev').disabled = true; q('rev').textContent = 'Palavras à mostra'; lista();
      api.toast('Menos 10 pontos nesta partida');
      window.Sons && Sons.tocar('powerup');
    };
    function fim() {
      st.fim = true; parar();
      const seg = Math.floor((Date.now() - st.t0) / 1000), pts = pontos(st.mostrou, seg), bonus = seg < 180;
      const e = q('tm'); if (e) e.innerHTML = ICO_TM + fmt(seg);
      api.ganhou(pts, 'Achou todas as palavras');
      window.Sons && Sons.tocar('vitoria_jogo');
      q('rodape').innerHTML = `<div class="card cacapalavras-fim"><div class="big" style="color:var(--mint)">+${pts}</div><h3>Achou todas</h3>` +
        `<div class="chips"><span class="stat">${ICO_TM}${fmt(seg)}</span><span class="stat">${palavras.length} palavras</span>${bonus ? '<span class="stat">Bônus de tempo +5</span>' : ''}${st.mostrou ? '<span class="stat">Mostrou as palavras</span>' : ''}</div>` +
        `<button class="btn full" data-k="again">Jogar de novo</button><button class="btn ghost full" data-k="back">Voltar</button></div>`;
      q('again').onclick = () => montar(el, t, api);
      q('back').onclick = () => { parar(); api.voltar(); };
      q('rodape').scrollIntoView({ block: 'nearest' });
    }
    lista();
  }

  /* ===== REGISTRO ===== */
  if (typeof window !== 'undefined') {
    window.JOGOS = window.JOGOS || [];
    window.JOGOS.push({
      id: ID,
      nome: 'Caça-palavras',
      desc: 'Ache os termos do tema escondidos na grade, só pela dica.',
      icone: ICONE,
      disponivel(t) { return validos(t && t.termos).length >= 6; },
      montar
    });
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { validos, escolher, tamanho, marcarInvertidos, gerarGrade, alinhado, lerCaminho, conferir, pontos, fmt, shufR };
})();
