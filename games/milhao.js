/* Dentolingu · "Show do Milhão da Odontologia" (games/milhao.js, id "milhao"). Jogo GLOBAL: usa o banco de perguntas de todas as matérias
   (window.BANCO_MILHAO, gerado por games/juntar_banco.py), não um tema só. Fica separado dos temas pra virar app próprio depois.
   Partida: 15 perguntas (5 fáceis, 5 médias, 5 difíceis), escada de prêmios de brincadeira, prêmio garantido depois da 5ª e da 10ª,
   ajudas 50:50, Pular (3) e Plateia, e "Parar e levar". Pontos pro ranking: 4 por pergunta garantida (máx. 60).
   Estética: auditório de TV (azul royal, dourado, lâmpadas), inspiração visual, sem nada da marca do programa.
   Lógica pura fora do DOM (exportada pra teste em node); o registro em window.JOGOS só roda no navegador. */
'use strict';
(function () {
  const ID = 'milhao', NOME = 'Show do Sisão da Odontologia';
  const ESCADA = [1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 50000, 100000, 200000, 300000, 400000, 1000000];
  const NIVEIS = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3];
  const SEGUROS = [5, 10]; // acertou 5 ou 10 perguntas = esse prêmio fica garantido
  const PULOS = 3, PTS_POR_ACERTO = 4, LETRAS = ['A', 'B', 'C', 'D'];

  /* ===== LÓGICA PURA ===== */
  // Rafael 11/11: aleatoriedade boa = gerador criptográfico do navegador (Math.random só se não tiver)
  function aleatorio() { try { const u = new Uint32Array(1); crypto.getRandomValues(u); return u[0] / 4294967296; } catch (e) { return Math.random(); } }
  function embaralhar(arr, rnd) {
    rnd = rnd || aleatorio; const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function perguntaValida(q) {
    return !!q && typeof q.q === 'string' && q.q.trim().length > 5 && Array.isArray(q.o) && q.o.length === 4 && q.o.every(x => typeof x === 'string' && x.trim()) &&
      new Set(q.o.map(x => x.trim().toLowerCase())).size === 4 && Number.isInteger(q.a) && q.a >= 0 && q.a < 4 && [1, 2, 3].includes(q.n);
  }
  const bancoValido = b => (Array.isArray(b) ? b : []).filter(perguntaValida);
  function podeJogar(b) { b = bancoValido(b); return [1, 2, 3].every(n => b.filter(q => q.n === n).length >= 5) && b.length >= 15; }
  function sortearNivel(banco, nivel, n, usadas, rnd) { // n perguntas do nível; se faltar, completa com o nível vizinho
    const pega = lv => embaralhar(banco.filter(q => q.n === lv && !usadas.has(q.q)), rnd);
    let lista = pega(nivel);
    for (const lv of [nivel - 1, nivel + 1, nivel - 2, nivel + 2]) { if (lista.length >= n) break; if (lv >= 1 && lv <= 3) lista = lista.concat(pega(lv)); }
    // Rafael 06/11: variar as matérias (no máx. 2 da mesma por nível) e garantir 1 engraçada (g) por nível quando houver
    const out = [], porM = {}, gracinha = lista.find(q => q.g && q.n === nivel);
    if (gracinha) { out.push(gracinha); porM[gracinha.m] = 1; }
    for (const q of lista) { if (out.length >= n) break; if (out.includes(q) || (porM[q.m] || 0) >= 2) continue; out.push(q); porM[q.m] = (porM[q.m] || 0) + 1; }
    for (const q of lista) { if (out.length >= n) break; if (!out.includes(q)) out.push(q); }
    return embaralhar(out, rnd);
  }
  // Rafael 11/11: perguntas das matérias do simulado (window.BANCOS, simulado/bancos.js) viram perguntas do Sisão (4 alternativas)
  const NOMES_SIM = { bases: 'Bases Morfológicas', carie: 'Cárie', inter: 'Interações', farmaco: 'Farmacologia', imagino: 'Imaginologia' };
  function bancoDoSimulado(chaves, rnd) {
    const B = (typeof window !== 'undefined' && window.BANCOS) || {}, lista = [];
    (chaves || []).forEach(m => (B[m] && B[m].q || []).forEach(q => {
      if (!q || !q.p || !Array.isArray(q.o) || q.o.length < 4 || typeof q.a !== 'number') return;
      // Rafael 11/11: o jogo é aberto, não só da turma: pergunta que depende de 'o professor disse / slide da aula' fica fora do Sisão
      if (/professor|professora|slide|sebasti|gustavo|em aula|na aula|da aula/i.test((q.ctx || '') + ' ' + q.p + ' ' + q.o.join(' '))) return;
      // Rafael 11/11: estilo de prova (asserção-razão, afirmativas I/II/III) é chato no jogo; o jogo fica só com pergunta direta
      if (/asserç|afirmativa|afirmaç|proposiç|I e II|II e III|I, II e III|apenas\.?$/i.test((q.ctx || '') + ' ' + q.p + ' ' + q.o.join(' | '))) return;
      const certa = q.o[q.a], ops = embaralhar([certa].concat(embaralhar(q.o.filter((x, k) => k !== q.a), rnd).slice(0, 3)), rnd);
      if (new Set(ops.map(x => String(x).trim().toLowerCase())).size !== 4) return;
      const txt = (q.ctx || '') + ' ' + q.p;
      let d = txt.length / 60; if (/\bI{1,3}\.|assertiva|asserç|afirmativa|afirmaç/i.test(txt)) d += 6; if (q.sm1) d += 3;
      lista.push({ m: NOMES_SIM[m] || m, q: (q.ctx ? q.ctx + '\n\n' : '') + q.p, o: ops, a: ops.indexOf(certa), w: q.w || '', _d: d });
    }));
    lista.sort((a, b) => a._d - b._d); const t = Math.ceil(lista.length / 3);
    lista.forEach((q, i) => { q.n = i < t ? 1 : i < 2 * t ? 2 : 3; delete q._d; });
    return lista;
  }
  // Rafael 11/11: "no início tá repetindo muita pergunta". Guarda as já vistas e sorteia primeiro as que ainda não saíram.
  function lerVistas(chave) { try { return new Set(JSON.parse(localStorage.getItem(chave) || '[]')); } catch (e) { return new Set(); } }
  function gravarVistas(chave, set) { try { localStorage.setItem(chave, JSON.stringify([...set].slice(-800))); } catch (e) { } }
  function montarPartidaNova(banco, chave, rnd) {
    // Rafael 11/11: "essa pergunta aparece toda vez". Sorteia várias partidas e fica com a que tem MENOS perguntas já vistas;
    // a memória só zera quando quase tudo já saiu.
    banco = bancoValido(banco); let vistas = lerVistas(chave);
    if (banco.filter(q => !vistas.has(q.q)).length < 15) vistas = new Set();
    let melhor = null, menos = Infinity;
    for (let t = 0; t < 40 && menos > 0; t++) {
      const p = montarPartida(banco, rnd), rep = p.filter(q => vistas.has(q.q)).length;
      if (rep < menos) { menos = rep; melhor = p; }
    }
    melhor.forEach(q => vistas.add(q.q)); gravarVistas(chave, vistas);
    return melhor;
  }
  function montarPartida(banco, rnd) {
    banco = bancoValido(banco); const usadas = new Set(), out = [];
    for (const nivel of [1, 2, 3]) for (const q of sortearNivel(banco, nivel, 5, usadas, rnd)) { usadas.add(q.q); out.push(q); }
    return out;
  }
  function pularPergunta(partida, i, banco, rnd, materia) { // troca a pergunta i por outra do mesmo nível que ainda não saiu (da matéria escolhida, se veio)
    const atual = partida[i], usadas = new Set(partida.map(q => q.q));
    const outra = embaralhar(bancoValido(banco).filter(q => q.n === atual.n && !usadas.has(q.q) && (!materia || q.m === materia)), rnd)[0];
    return outra || null;
  }
  function materiasDoPulo(partida, i, banco) { // Rafael 06/11: pular e escolher a especialidade da próxima
    const atual = partida[i], usadas = new Set(partida.map(q => q.q)), cont = {};
    bancoValido(banco).forEach(q => { if (q.n === atual.n && !usadas.has(q.q)) cont[q.m || 'Odontologia'] = (cont[q.m || 'Odontologia'] || 0) + 1; });
    return Object.keys(cont).sort();
  }
  const premio = acertos => (acertos > 0 ? ESCADA[Math.min(acertos, ESCADA.length) - 1] : 0);
  const seguro = acertos => SEGUROS.filter(s => acertos >= s).pop() || 0; // quantas perguntas estão garantidas
  const pontos = (acertos, modo) => Math.min(60, PTS_POR_ACERTO * (modo === 'errou' ? seguro(acertos) : acertos));
  function cinquenta(ops, rnd) { // índices (na ordem exibida) de 2 alternativas erradas pra esconder
    const erradas = ops.map((o, k) => (o.c ? -1 : k)).filter(k => k >= 0);
    return embaralhar(erradas, rnd).slice(0, 2);
  }
  function plateia(ops, nivel, rnd) { // Rafael 11/11: a plateia erra só em 3% dos casos (a mais votada é a errada)
    rnd = rnd || aleatorio;
    const certa = rnd() >= 0.03;
    const idxC = ops.findIndex(o => o.c), erradas = ops.map((o, k) => k).filter(k => k !== idxC);
    const alvo = certa ? idxC : erradas[Math.floor(rnd() * erradas.length)];
    const pct = ops.map(() => 0); pct[alvo] = 45 + Math.floor(rnd() * 31); // a mais votada: 45% a 75%
    let resto = 100 - pct[alvo]; const outros = ops.map((o, k) => k).filter(k => k !== alvo);
    outros.forEach((k, n) => { const v = n === outros.length - 1 ? resto : Math.floor(rnd() * Math.min(resto, pct[alvo] - 1)); pct[k] = v; resto -= v; });
    if (Math.max(...outros.map(k => pct[k])) >= pct[alvo]) { const k = outros.reduce((a, b) => pct[a] >= pct[b] ? a : b); const d = pct[k] - pct[alvo] + 5; pct[k] -= d; pct[alvo] += d; }
    return pct;
  }
  const reais = n => (n >= 1000000 ? 'R$ 1 MILHÃO' : 'R$ ' + n.toLocaleString('pt-BR'));

  /* ===== DESENHO ===== */
  if (typeof window !== 'undefined') {
    const c = n => ID + '-' + n;
    const CSS = `
.X-palco{position:relative;border-radius:24px;padding:26px 14px 18px;color:#fff;overflow:hidden;border:3px solid #ffc83d;box-shadow:0 0 0 4px #0a1450,0 12px 30px rgba(0,0,0,.35);background:radial-gradient(ellipse 90% 55% at 50% 0%,#4a74ff 0%,#1a2f9a 38%,#0a1450 70%,#050a2e 100%);font-family:var(--f-body);display:flex;flex-direction:column;gap:14px;min-width:0}
.X-palco::before,.X-palco::after{content:"";position:absolute;left:0;right:0;height:12px;background:radial-gradient(circle,#ffe58a 34%,rgba(255,229,138,0) 38%) 0 50%/20px 12px repeat-x;animation:X-pisca 1.1s steps(2) infinite}
.X-palco::before{top:4px}.X-palco::after{bottom:4px;animation-delay:.55s}
@keyframes X-pisca{50%{opacity:.25}}
.X-titulo{font-family:'Bungee','Lilita One',var(--f-display),system-ui,sans-serif;text-align:center;color:#ffd24a;text-shadow:0 3px 0 #8a5a00,0 0 18px rgba(255,210,74,.55);line-height:1.1;text-wrap:balance}
.X-h1{font-size:clamp(25px,8vw,38px)}
.X-h2{font-size:clamp(19px,6vw,26px)}
.X-sub{text-align:center;color:#cfe0ff;font-weight:700;font-size:15px}
.X-regras{background:rgba(5,10,46,.55);border:2px solid rgba(255,210,74,.5);border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;font-size:14.5px;line-height:1.35}
.X-regras b{color:#ffd24a}
.X-btn{border:0;border-radius:16px;padding:14px 18px;font-family:'Bungee',var(--f-display),sans-serif;font-size:17px;letter-spacing:.02em;color:#3b2500;background:linear-gradient(#ffe27a,#ffb81f);box-shadow:0 5px 0 #8a5a00;cursor:pointer;min-height:48px}
.X-btn:active{transform:translateY(4px);box-shadow:0 1px 0 #8a5a00}
.X-btn.X-azul{color:#fff;background:linear-gradient(#3a63ff,#1a2f9a);box-shadow:0 5px 0 #0a1450}
.X-btn.X-azul:active{box-shadow:0 1px 0 #0a1450}
.X-btn.X-vermelho{color:#fff;background:linear-gradient(#ff6b6b,#d62f2f);box-shadow:0 5px 0 #7f1414}
.X-btn[disabled]{opacity:.45;pointer-events:none}
.X-linha{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.X-valendo{text-align:center}
.X-valendo small{display:block;color:#cfe0ff;font-weight:800;letter-spacing:.08em;text-transform:uppercase;font-size:12px}
.X-valendo b{font-family:'Bungee',var(--f-display),sans-serif;font-size:clamp(24px,8vw,34px);color:#ffd24a;text-shadow:0 3px 0 #8a5a00}
.X-relogio{display:inline-block;margin-top:6px;min-width:64px;padding:4px 12px;border-radius:20px;border:2px solid #ffd24a;color:#ffd24a;font-weight:800;font-size:18px}
.X-relogio.X-urgente{border-color:#ff5b6b;color:#fff;background:#c0392b;animation:X-bate .5s infinite alternate}
@keyframes X-bate{from{transform:scale(1)}to{transform:scale(1.08)}}
@media (prefers-reduced-motion:reduce){.X-relogio.X-urgente{animation:none}}
.X-conf{display:flex;flex-direction:column;gap:8px;background:#0b1a4a;border:2px solid #ffd24a;border-radius:14px;padding:14px;margin-bottom:12px;color:#fff;text-align:left}
.X-conf{gap:14px}
.X-ctopo{display:flex;align-items:center;justify-content:space-between;font-family:'Bungee',var(--f-display),sans-serif;font-size:18px;color:#ffd24a}
.X-xis{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#fff;border-radius:50%;width:36px;height:36px;font-size:16px;cursor:pointer}
.X-sec{background:rgba(5,10,46,.55);border:1px solid rgba(255,210,74,.25);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:10px}
.X-sec h4{margin:0;font-family:var(--f-display);font-size:15px;color:#ffd24a;font-weight:600}
.X-fontes{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.X-fonte{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;padding:14px 8px;border-radius:14px;border:2px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);color:#fff;cursor:pointer;font-family:var(--f-body)}
.X-fonte b{font-size:15px}.X-fonte small{font-size:12px;color:#b8c8f0}
.X-fic{font-size:26px;line-height:1}
.X-fonte[aria-pressed="true"]{border-color:#ffd24a;background:rgba(255,210,74,.14);box-shadow:0 0 0 3px rgba(255,210,74,.18)}
.X-mats{display:flex;flex-wrap:wrap;gap:8px}.X-mats[hidden]{display:none}
.X-mats p{width:100%;margin:0;font-size:13px;color:#cfdcff}
.X-mat{border-radius:999px;padding:9px 14px;border:2px solid rgba(255,255,255,.25);background:transparent;color:#fff;font-family:var(--f-display);font-weight:600;font-size:14px;cursor:pointer}
.X-mat[aria-pressed="true"]{background:#ffd24a;border-color:#ffd24a;color:#3b2500}
.X-mat[aria-pressed="true"]::before{content:'✓ '}
.X-lin{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:15px;cursor:pointer}
.X-lin span{display:flex;flex-direction:column}.X-lin small{font-size:12px;color:#b8c8f0}
.X-lin input[type=range]{width:45%}
.X-sw{appearance:none;-webkit-appearance:none;flex:0 0 46px;width:46px;height:26px;border-radius:13px;background:#3a4672;position:relative;cursor:pointer;transition:background .2s}
.X-sw::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .2s}
.X-sw:checked{background:#2bd67b}.X-sw:checked::after{left:23px}
.X-sw:focus-visible,.X-fonte:focus-visible,.X-mat:focus-visible{outline:3px solid #ffd24a;outline-offset:2px}
.X-engrmini{background:rgba(5,10,46,.55);border:2px solid rgba(255,210,74,.5);border-radius:12px;font-size:19px;line-height:1;cursor:pointer;width:42px;height:42px;padding:0;display:grid;place-items:center;color:#fff}
.X-topo{display:grid;grid-template-columns:auto 1fr auto;align-items:start;gap:6px;min-width:0}
.X-barra{display:flex;gap:6px}
@media (max-width:420px){.X-barra{flex-direction:column}}
.X-topo .X-valendo{min-width:0;padding-top:2px}
.X-topo .X-valendo b{font-size:clamp(21px,7vw,34px)}
.X-sisfim{display:flex;justify-content:center}
.X-abre{display:flex;flex-direction:column;align-items:center;gap:4px}
.X-balao{position:relative;width:100%;background:#fff;color:#14205a;border-radius:18px;padding:12px 14px;box-shadow:0 4px 0 #8a5a00,0 0 0 3px #ffd24a;margin-top:10px}
.X-balao::before{content:"";position:absolute;top:-17px;left:50%;margin-left:-12px;border:12px solid transparent;border-bottom:14px solid #ffd24a;border-top:0}
.X-balao::after{content:"";position:absolute;top:-11px;left:50%;margin-left:-9px;border:9px solid transparent;border-bottom:11px solid #fff;border-top:0}
.X-oi{display:block;font-family:'Bungee',var(--f-display),sans-serif;font-size:15px;color:#1a2f9a;margin-bottom:8px;text-align:center}
.X-escada{display:grid;grid-template-columns:repeat(15,1fr);gap:3px}
.X-pip{height:8px;border-radius:4px;background:rgba(255,255,255,.2)}
.X-pip.X-ok{background:#2ee59d}.X-pip.X-ja{background:#2ee59d}.X-pip.X-seg{box-shadow:0 0 0 2px #ffd24a}.X-pip.X-agora{background:#ffd24a;animation:X-pisca .8s steps(2) infinite}
.X-info{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font-weight:800;font-size:13.5px;color:#cfe0ff}
.X-info b{color:#fff}
.X-tag{align-self:center;font-weight:800;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#cfe0ff;background:rgba(5,10,46,.55);border:1px solid rgba(255,210,74,.4);border-radius:999px;padding:3px 10px}
.X-pergunta{background:linear-gradient(#173aa8,#0b1f6e);border:3px solid #ffd24a;border-radius:18px;padding:16px 14px;font-family:var(--f-display);font-weight:500;font-size:clamp(18px,5.4vw,23px);line-height:1.3;text-align:center;text-wrap:balance;overflow-wrap:anywhere;box-shadow:inset 0 0 18px rgba(0,0,0,.35)}
.X-ops{display:grid;gap:10px}
.X-op{display:flex;align-items:center;gap:10px;text-align:left;border:2px solid #ffd24a;border-radius:14px;padding:11px 12px;min-height:52px;color:#fff;background:linear-gradient(#173aa8,#0b1f6e);font:inherit;font-weight:700;font-size:15.5px;cursor:pointer;overflow-wrap:anywhere;min-width:0}
.X-op i{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#ffd24a;color:#3b2500;font-style:normal;font-family:'Bungee',var(--f-display),sans-serif;font-size:15px}
.X-op:active{transform:translateY(2px)}
.X-op.X-sel{background:linear-gradient(#ffb347,#e8780a);color:#2a1500;border-color:#fff}
.X-op.X-pisca{animation:X-pisca .35s steps(2) infinite}
.X-op.X-certa{background:linear-gradient(#35e2a0,#0f9a68);color:#04271a;border-color:#fff}
.X-op.X-errada{background:linear-gradient(#ff6b6b,#c42b2b);color:#fff;border-color:#fff}
.X-op.X-fora{visibility:hidden}
.X-op[disabled]{pointer-events:none}
.X-plateia{display:grid;gap:5px;background:rgba(5,10,46,.55);border:2px solid rgba(255,210,74,.5);border-radius:14px;padding:10px}
.X-bar{display:grid;grid-template-columns:22px 1fr 40px;align-items:center;gap:8px;font-weight:800;font-size:13px}
.X-bar span:nth-child(2){height:12px;border-radius:6px;background:rgba(255,255,255,.18);overflow:hidden}
.X-bar span:nth-child(2) i{display:block;height:100%;background:linear-gradient(#ffe27a,#ffb81f);border-radius:6px}
.X-ajudas{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.X-aj{border:2px solid #ffd24a;border-radius:14px;padding:8px 4px;color:#fff;background:rgba(5,10,46,.55);font:inherit;font-weight:800;font-size:13px;line-height:1.15;cursor:pointer;min-height:48px}
.X-aj small{display:block;font-weight:700;opacity:.8;font-size:11px}
.X-aj[disabled]{opacity:.35;text-decoration:line-through;pointer-events:none}
.X-res{border-radius:16px;padding:12px 14px;font-size:15px;line-height:1.35;display:flex;flex-direction:column;gap:6px}
.X-res.X-ok{background:#0f9a68;color:#fff}.X-res.X-bad{background:#c42b2b;color:#fff}
.X-res b{font-family:'Bungee',var(--f-display),sans-serif;font-size:18px}
.X-big{font-family:'Bungee',var(--f-display),sans-serif;font-size:clamp(30px,10vw,46px);color:#ffd24a;text-shadow:0 3px 0 #8a5a00,0 0 18px rgba(255,210,74,.5);text-align:center;line-height:1.1}
.X-fim{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
.X-lista{width:100%;text-align:left;display:flex;flex-direction:column;gap:6px}
.X-lista div{background:rgba(5,10,46,.55);border:1px solid rgba(255,210,74,.4);border-radius:12px;padding:8px 10px;font-size:14px}
.X-nota{font-size:12px;color:#9fb6ee;text-align:center}
.X-refs{margin-top:8px;display:flex;flex-direction:column;gap:4px;font-size:13px;text-align:left}.X-refs a{color:#ffe27a;text-decoration:underline}
@media (prefers-reduced-motion:reduce){.X-palco::before,.X-palco::after,.X-op.X-pisca,.X-pip.X-agora{animation:none}}
.X-regras2{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.X-regras2 li{display:flex;gap:10px;align-items:center;font-size:15px;line-height:1.3;font-weight:600}
.X-regras2 li>span:first-child{flex:none;width:26px;text-align:center;font-size:20px;line-height:1}
.X-regras2 b{color:#1a2f9a}
.X-regras2 li{color:#14205a}
.X-mentira{text-align:center;font-size:13px;color:#ffe9a8;font-weight:700;margin:-4px 0 0}
`.replace(/X-/g, ID + '-');

    // Sisão (mascote): motor games/sisao/sisao.js + quadros v3 (cartum = visual Normal; pixel = body.tema-pixel)
    const SIS_BASE = (() => { try { const s = document.currentScript && document.currentScript.src; if (s) return s.replace(/milhao\.js[^/]*$/, '') + 'sisao/'; } catch (e) { } return 'games/sisao/'; })();
    function injetarCss() {
      if (!document.getElementById('css-' + ID)) { const s = document.createElement('style'); s.id = 'css-' + ID; s.textContent = CSS; document.head.appendChild(s); }
    }

    const jogo = {
      id: ID, nome: NOME, global: true,
      desc: 'Jogo de 15 perguntas, só pela diversão: o prêmio é de mentirinha. Tem 50:50, pular e plateia.',
      icone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M15.5 8.8c-.9-1-2.2-1.4-3.5-1.4-1.9 0-3.2 1-3.2 2.5 0 3.4 6.8 1.8 6.8 5.3 0 1.5-1.4 2.6-3.6 2.6-1.4 0-2.8-.5-3.8-1.6"/></svg>',
      disponivel() { return podeJogar(window.BANCO_MILHAO); },
      montar(el, t, api) {
        injetarCss();
        let banco = bancoValido(window.BANCO_MILHAO);
        if (!podeJogar(banco)) { el.innerHTML = `<div class="card"><p>O banco de perguntas ainda não está pronto.</p><button type="button" class="btn ghost full">Voltar</button></div>`; el.querySelector('button').onclick = () => api.voltar(); return; }
        let st = null;
        const reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const timers = []; const apos = (fn, ms) => { const h = setTimeout(fn, ms); timers.push(h); return h; };
        let antecipa = null; // toque na tela durante o suspense revela na hora
        // ===== SISÃO: um só personagem, reposto em cada tela; mexe a boca junto com o locutor =====
        if (window.__sisao) { try { window.__sisao.destruir(); } catch (e) { } }
        const sis = window.Sisao ? (window.__sisao = Sisao.criar(null, { base: SIS_BASE, escala: 2, versao: 4 })) : null;
        const ESC_SIS = { grande: 2, canto: 0.85, fim: 2 };
        function poeSis(lugar) {
          if (!sis) return; const slot = el.querySelector('.' + c('sislugar')); if (!slot) return;
          sis.escala(ESC_SIS[lugar] || 1); slot.replaceWith(sis.el);
        }
        const sisFala = sim => { if (sis) sis.falar(sim); };
        const sisReage = (n, o) => { if (sis) sis.reacao(n, o); };
        // cronômetro de suspense: 45 s por pergunta, pulso grave a cada segundo e mais rápido nos últimos 10 (som original, sintetizado)
        const TEMPO = 45; let relogio = null, ctxPulso = null;
        function pulso(urgente) {
          try {
            if (!window.Sons || Sons.mudo() || !Sons.disponivel()) return;
            const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
            ctxPulso = ctxPulso || new AC(); if (ctxPulso.state === 'suspended') ctxPulso.resume();
            const vol = (Sons.volume ? Sons.volume() : 0.5) * 0.5;
            const batida = (t, f) => {
              const o = ctxPulso.createOscillator(), g = ctxPulso.createGain();
              o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.7, t + 0.18);
              g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
              o.connect(g).connect(ctxPulso.destination); o.start(t); o.stop(t + 0.25);
            };
            const t = ctxPulso.currentTime;
            batida(t, urgente ? 98 : 82);
            if (urgente) batida(t + 0.5, 104);
          } catch (e) { }
        }
        // configurações do jogo (salvas neste aparelho)
        const CONF_PADRAO = { musica: true, voz: true, efeitos: true, bateria: false, volMusica: 0.5 };
        let CONF = Object.assign({}, CONF_PADRAO);
        try { CONF = Object.assign(CONF, JSON.parse(localStorage.getItem('sisao-conf') || '{}')); } catch (e) { }
        if (!Array.isArray(CONF.materias)) CONF.materias = [];
        if (!Array.isArray(CONF.categorias)) CONF.categorias = [];
        if (!CONF.modo) CONF.modo = CONF.materias.length ? 'materias' : 'geral';
        const temSimulado = () => !!(window.BANCOS && Object.keys(NOMES_SIM).some(k => window.BANCOS[k]));
        const simDisp = () => temSimulado() ? Object.keys(NOMES_SIM).filter(k => window.BANCOS[k]) : [];
        // categorias = o campo "m" das perguntas originais (Curiosidades da odonto, Prótese e laboratório...)
        const categoriasDisp = () => { const c = {}; bancoValido(window.BANCO_MILHAO).forEach(q => { const m = q.m || 'Odontologia'; c[m] = (c[m] || 0) + 1; }); return Object.keys(c).sort().map(m => ({ m, n: c[m] })); };
        function bancoEscolhido() {
          const orig = bancoValido(window.BANCO_MILHAO);
          if (CONF.modo === 'materias') {
            const sel = CONF.materias.filter(k => window.BANCOS && window.BANCOS[k]);
            const b = bancoValido(bancoDoSimulado(sel));
            if (sel.length && podeJogar(b)) return { b, chave: 'sisao-vistas-' + sel.slice().sort().join('-') };
            return { b: orig, chave: 'sisao-vistas-geral', aviso: 'Poucas perguntas nessas matérias, joguei com tudo.' };
          }
          if (CONF.modo === 'personalizar') {
            const cats = new Set(CONF.categorias);
            const b = orig.filter(q => cats.has(q.m || 'Odontologia'));
            if (podeJogar(b)) return { b, chave: 'sisao-vistas-cat-' + [...cats].sort().join('-') };
            return { b: orig, chave: 'sisao-vistas-geral', aviso: 'Poucas perguntas nesses temas, juntei com tudo.' };
          }
          // Rafael 11/11: no Geral entra TUDO, inclusive as perguntas das matérias da facul
          const tudo = orig.concat(bancoValido(bancoDoSimulado(simDisp())));
          return { b: tudo, chave: 'sisao-vistas-geral' };
        }
        const gravaConf = () => { try { localStorage.setItem('sisao-conf', JSON.stringify(CONF)); } catch (e) { } };
        const efeito = (nome, extra) => { if (CONF.efeitos && window.Sons) Sons.tocar(nome, extra); };
        // trilhas de fundo originais (nostalgia de games 8/16 bits + metais de auditório): variam por partida e trocam na 6ª e na 11ª pergunta
        // cada compasso: [nota em Hz, tempos]; notas longas, cantáveis, clima de RPG/plataforma dos anos 90 (melodias próprias)
        const TRILHAS = [ // suspense o jogo inteiro (Rafael 06/11 01h36), tons menores, cada nível mais rápido e mais tenso; melodias próprias
          { nome: 'Suspense 1', bpm: 100, ac: [[110, 220, 261.63, 329.63], [87.31, 174.61, 220, 261.63], [98, 196, 246.94, 293.66], [82.41, 164.81, 207.65, 246.94]],
            mel: [[[659.25, 2], [523.25, 2]], [[698.46, 3], [659.25, 1]], [[587.33, 2], [493.88, 2]], [[830.61, 2], [659.25, 2]]] },
          { nome: 'Suspense 2', bpm: 110, ac: [[146.83, 293.66, 349.23, 440], [116.54, 233.08, 293.66, 349.23], [98, 196, 233.08, 293.66], [110, 220, 277.18, 329.63]],
            mel: [[[587.33, 2], [698.46, 2]], [[587.33, 3], [466.16, 1]], [[466.16, 2], [392, 2]], [[554.37, 2], [659.25, 2]]] },
          { nome: 'Suspense 3', bpm: 120, ac: [[82.41, 164.81, 196, 246.94], [130.81, 261.63, 329.63, 392], [146.83, 293.66, 369.99, 440], [123.47, 246.94, 311.13, 369.99]],
            mel: [[[659.25, 2], [783.99, 2]], [[659.25, 3], [523.25, 1]], [[587.33, 2], [739.99, 2]], [[622.25, 2], [739.99, 2]]] },
          { nome: 'Suspense 4', bpm: 130, ac: [[130.81, 261.63, 311.13, 392], [103.83, 207.65, 261.63, 311.13], [116.54, 233.08, 293.66, 349.23], [98, 196, 246.94, 293.66]],
            mel: [[[523.25, 2], [622.25, 2]], [[523.25, 3], [415.3, 1]], [[466.16, 2], [587.33, 2]], [[493.88, 2], [587.33, 2]]] },
          { nome: 'Reta final', bpm: 140, ac: [[110, 220, 261.63, 329.63], [110, 220, 261.63, 329.63], [87.31, 174.61, 220, 261.63], [82.41, 164.81, 207.65, 246.94]],
            mel: [[[440, 1], [523.25, 1], [659.25, 2]], [[622.25, 2], [659.25, 2]], [[698.46, 2], [659.25, 2]], [[830.61, 2], [659.25, 2]]] }
        ];
        // "fases" como no videogame: leve no começo e mais suspense a cada pergunta vencida (ou trilha fixa escolhida pelo jogador)
        const FASES = [3, 3, 3, 0, 0, 0, 2, 2, 2, 1, 1, 1, 4, 4, 4];
        if (CONF.trilha === undefined) CONF.trilha = 'auto';
        let fundo = null, faixa = 3;
        const faixaDaVez = () => FASES[Math.min(14, st ? st.i : 0)]; // fixa por nível (Rafael)
        function iniciarFundo() {
          try {
            faixa = faixaDaVez();
            if (fundo && fundo.faixa !== faixa) pararFundo();
            if (fundo || !CONF.musica || !window.Sons || Sons.mudo() || !Sons.disponivel()) return;
            const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
            ctxPulso = ctxPulso || new AC(); if (ctxPulso.state === 'suspended') ctxPulso.resume();
            const ac = ctxPulso, mestre = ac.createGain(), T = TRILHAS[faixa], batida = 60 / (T.bpm * (1 + (st ? st.i : 0) * 0.008));
            const alvo = Math.max(0.0001, (Sons.volume ? Sons.volume() : 0.5) * 0.32 * CONF.volMusica);
            mestre.gain.setValueAtTime(0.0001, ac.currentTime); mestre.gain.exponentialRampToValueAtTime(alvo, ac.currentTime + 1.5);
            mestre.connect(ac.destination);
            const chimbal = ac.createBuffer(1, ac.sampleRate * 0.04, ac.sampleRate), cd = chimbal.getChannelData(0);
            for (let i = 0; i < cd.length; i++) cd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / cd.length, 5);
            let compasso = 0;
            const tempo = () => {
              try { if (Sons.mudo() || !CONF.musica) { pararFundo(); return; } } catch (e) { }
              const t0 = ac.currentTime + 0.05, k = compasso % 4, acd = T.ac[k], volta = Math.floor(compasso / 4) % 2, bar = batida * 4;
              // pad: acorde sustentado o compasso inteiro, entrada suave (cordas de videogame)
              acd.slice(1).forEach(f => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.07, t0 + 0.5); g.gain.setValueAtTime(0.07, t0 + bar - 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t0 + bar + 0.1); o.connect(g).connect(mestre); o.start(t0); o.stop(t0 + bar + 0.15); });
              // baixo: duas notas longas por compasso
              [0, 1, 2, 3].forEach(b => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.value = b % 2 ? acd[0] * 2 : acd[0]; const ti = t0 + b * batida; g.gain.setValueAtTime(0.0001, ti); g.gain.exponentialRampToValueAtTime(0.5, ti + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ti + batida * 0.6); o.connect(g).connect(mestre); o.start(ti); o.stop(ti + batida * 0.7); }); // baixo pulsando, como coração acelerado
              // melodia: notas longas com vibrato (flauta/sopro 16 bits), na volta uma oitava abaixo com terça
              let ti = t0;
              T.mel[k].forEach(([f, dur]) => {
                const d = dur * batida, freq = volta ? f / 2 : f;
                [[0, 'triangle', 0.16], [4, 'square', 0.03]].forEach(([cents, tipo, g0]) => {
                  const o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
                  o.type = tipo; o.frequency.value = freq; o.detune.value = cents;
                  lfo.frequency.value = 5; lg.gain.setValueAtTime(0, ti); lg.gain.linearRampToValueAtTime(freq * 0.006, ti + Math.min(0.4, d * 0.5));
                  lfo.connect(lg).connect(o.frequency);
                  g.gain.setValueAtTime(0.0001, ti); g.gain.exponentialRampToValueAtTime(g0, ti + 0.05); g.gain.setValueAtTime(g0 * 0.8, ti + d * 0.7); g.gain.exponentialRampToValueAtTime(0.0001, ti + d * 0.98);
                  o.connect(g).connect(mestre); o.start(ti); lfo.start(ti); o.stop(ti + d); lfo.stop(ti + d);
                });
                if (volta) { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine'; o.frequency.value = freq * 1.26; g.gain.setValueAtTime(0.0001, ti); g.gain.exponentialRampToValueAtTime(0.05, ti + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, ti + d * 0.95); o.connect(g).connect(mestre); o.start(ti); o.stop(ti + d); }
                ti += d;
              });
              if (CONF.bateria) [1, 3].forEach(b => { const sr = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); sr.buffer = chimbal; f.type = 'highpass'; f.frequency.value = 7000; g.gain.value = 0.06; sr.connect(f).connect(g).connect(mestre); sr.start(t0 + b * batida); });
              compasso++;
            };
            tempo(); fundo = { h: setInterval(tempo, batida * 4000), mestre, alvo, faixa };
          } catch (e) { fundo = null; }
        }
        // painel de configurações
        function painelConf(tipo, aoComecar) {
          tipo = tipo || 'som';
          const box = document.createElement('div'); box.className = c('conf');
          const sw = (k, titulo, sub) => `<label class="${c('lin')}"><span><b>${titulo}</b>${sub ? `<small>${sub}</small>` : ''}</span><input type="checkbox" class="${c('sw')}" data-k="${k}" ${CONF[k] ? 'checked' : ''}></label>`;
          const matsDisp = simDisp();
          box.innerHTML = `<div class="${c('ctopo')}"><b>${tipo === 'materias' ? '📚 Escolha as matérias' : 'Configurações de som'}</b><button type="button" class="${c('xis')}" data-fechar aria-label="Fechar">✕</button></div>
${tipo === 'materias' ? `<section class="${c('sec')}"><h4>O que vai cair no jogo?</h4>
<div class="${c('fontes')}">
<button type="button" class="${c('fonte')}" data-modo="geral" aria-pressed="${CONF.modo === 'geral'}"><span class="${c('fic')}">🦷</span><b>Tudo</b><small>Odontologia geral, de tudo um pouco</small></button>
${matsDisp.length ? `<button type="button" class="${c('fonte')}" data-modo="materias" aria-pressed="${CONF.modo === 'materias'}"><span class="${c('fic')}">📚</span><b>Minhas matérias</b><small>Só o que cai na prova da facul</small></button>` : ''}
<button type="button" class="${c('fonte')}" data-modo="personalizar" aria-pressed="${CONF.modo === 'personalizar'}"><span class="${c('fic')}">🎛️</span><b>Personalizar</b><small>Escolha os temas</small></button>
</div>
<div class="${c('mats')}" data-painel="materias" ${CONF.modo === 'materias' ? '' : 'hidden'}><p>Toque nas matérias que você quer estudar:</p>
${matsDisp.map(k => `<button type="button" class="${c('mat')}" data-mat="${k}" aria-pressed="${CONF.materias.includes(k)}">${NOMES_SIM[k]}</button>`).join('')}
</div>
<div class="${c('mats')}" data-painel="personalizar" ${CONF.modo === 'personalizar' ? '' : 'hidden'}><p>Toque nos temas que você quer no jogo:</p>
${categoriasDisp().map(x => `<button type="button" class="${c('mat')}" data-cat="${api.esc(x.m)}" aria-pressed="${CONF.categorias.includes(x.m)}">${api.esc(x.m)} <small style="opacity:.6">${x.n}</small></button>`).join('')}
</div>
</section>
<button type="button" class="${c('btn')} ${c('comecar')}" data-ir>${st && !st.fim ? 'Começar nova partida' : 'Começar!'}</button>` : ''}
${tipo === 'som' ? `<section class="${c('sec')}">
${sw('voz', 'Locutor', 'Lê a pergunta e as alternativas')}
${sw('musica', 'Música de fundo', '')}
${sw('efeitos', 'Efeitos', 'Acerto, erro e rufar')}
${sw('bateria', 'Bateria na música', '')}
<label class="${c('lin')}"><span><b>Volume da música</b></span><input type="range" min="0.1" max="1" step="0.1" value="${CONF.volMusica}" data-k="volMusica"></label>
</section>
<button type="button" class="${c('btn')} ${c('azul')}" data-fechar>Pronto</button>` : ''}`;
          { const ir = box.querySelector('[data-ir]'); if (ir) ir.onclick = () => { box.remove(); if (aoComecar) aoComecar(); }; }
          box.querySelectorAll('[data-k]').forEach(inp => inp.onchange = () => {
            const k = inp.dataset.k;
            CONF[k] = inp.type === 'checkbox' ? inp.checked : k === 'trilha' ? inp.value : +inp.value; gravaConf();
            if (k === 'musica' || k === 'volMusica' || k === 'bateria' || k === 'trilha') { pararFundo(); if (CONF.musica && st && !st.fim) iniciarFundo(); }
            if (k === 'voz' && !CONF.voz) calar();
          });
          const pintar = () => {
            box.querySelectorAll('[data-modo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.modo === CONF.modo)));
            box.querySelectorAll('[data-mat]').forEach(b => b.setAttribute('aria-pressed', String(CONF.materias.includes(b.dataset.mat))));
            box.querySelectorAll('[data-cat]').forEach(b => b.setAttribute('aria-pressed', String(CONF.categorias.includes(b.dataset.cat))));
            box.querySelectorAll('[data-painel]').forEach(p => { p.hidden = p.dataset.painel !== CONF.modo; });
          };
          box.querySelectorAll('[data-modo]').forEach(b => b.onclick = () => {
            CONF.modo = b.dataset.modo;
            if (CONF.modo === 'materias' && !CONF.materias.length) CONF.materias = matsDisp.slice();
            if (CONF.modo === 'personalizar' && !CONF.categorias.length) CONF.categorias = categoriasDisp().map(x => x.m);
            gravaConf(); pintar();
          });
          const alterna = (lista, k) => {
            const tem = CONF[lista].includes(k);
            if (tem && CONF[lista].length === 1) { api.toast('Deixe pelo menos um marcado'); return; }
            CONF[lista] = tem ? CONF[lista].filter(x => x !== k) : CONF[lista].concat(k);
            gravaConf(); pintar();
          };
          box.querySelectorAll('[data-mat]').forEach(b => b.onclick = () => alterna('materias', b.dataset.mat));
          box.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => alterna('categorias', b.dataset.cat));
          box.querySelectorAll('[data-fechar]').forEach(x => x.onclick = () => { box.remove(); if (!st || st.fim) pararFundo(); });
          return box;
        }
        function abrirConf() { const velho = el.querySelector('.' + c('conf')); if (velho) { velho.remove(); return; } const pal = el.querySelector('.' + c('palco')); if (pal) pal.prepend(painelConf('som')); }
        // Rafael 11/11: tela de escolher as matérias ANTES do jogo e botão de livrinhos durante o jogo
        function abrirMaterias(aoComecar) { const velho = el.querySelector('.' + c('conf')); if (velho) velho.remove(); const pal = el.querySelector('.' + c('palco')); if (pal) { pal.prepend(painelConf('materias', aoComecar)); pal.scrollIntoView({ block: 'start' }); } }
        function volumeFundo(fator) { try { if (fundo) { const t = ctxPulso.currentTime; fundo.mestre.gain.cancelScheduledValues(t); fundo.mestre.gain.setValueAtTime(Math.max(0.0001, fundo.mestre.gain.value), t); fundo.mestre.gain.exponentialRampToValueAtTime(Math.max(0.0001, fundo.alvo * fator), t + 0.4); } } catch (e) { } }
        function pararFundo() {
          if (!fundo) return;
          try { clearInterval(fundo.h); const t = ctxPulso.currentTime; fundo.mestre.gain.cancelScheduledValues(t); fundo.mestre.gain.setValueAtTime(Math.max(0.0001, fundo.mestre.gain.value), t); fundo.mestre.gain.exponentialRampToValueAtTime(0.0001, t + 0.6); } catch (e) { }
          fundo = null;
        }
        // música de tensão (original): baixo grave pulsando + arpejo menor lento em loop, enquanto o aluno escolhe e não confirma
        let tensao = null;
        function iniciarTensao() {
          try {
            if (tensao || !window.Sons || Sons.mudo() || !Sons.disponivel()) return;
            const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
            ctxPulso = ctxPulso || new AC(); if (ctxPulso.state === 'suspended') ctxPulso.resume();
            const ac = ctxPulso, mestre = ac.createGain();
            mestre.gain.setValueAtTime(0.0001, ac.currentTime);
            mestre.gain.exponentialRampToValueAtTime((Sons.volume ? Sons.volume() : 0.5) * 0.28, ac.currentTime + 0.8);
            mestre.connect(ac.destination);
            const drone = ac.createOscillator(), dg = ac.createGain(), filtro = ac.createBiquadFilter();
            drone.type = 'sawtooth'; drone.frequency.value = 55; filtro.type = 'lowpass'; filtro.frequency.value = 260;
            dg.gain.value = 0.35; drone.connect(filtro).connect(dg).connect(mestre); drone.start();
            const notas = [220, 261.63, 329.63, 311.13, 261.63, 246.94]; // lá menor com a nota de tensão (mi bemol), motivo próprio
            let passo = 0;
            const toca = () => {
              const t = ac.currentTime, f = notas[passo % notas.length]; passo++;
              const o = ac.createOscillator(), g = ac.createGain();
              o.type = 'triangle'; o.frequency.value = f;
              g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
              o.connect(g).connect(mestre); o.start(t); o.stop(t + 0.45);
              if (passo % 2 === 0) { const b = ac.createOscillator(), bg = ac.createGain(); b.type = 'sine'; b.frequency.setValueAtTime(70, t); b.frequency.exponentialRampToValueAtTime(45, t + 0.2); bg.gain.setValueAtTime(0.0001, t); bg.gain.exponentialRampToValueAtTime(0.8, t + 0.01); bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.25); b.connect(bg).connect(mestre); b.start(t); b.stop(t + 0.3); }
            };
            toca();
            const h = setInterval(toca, 480);
            tensao = { h, drone, mestre }; volumeFundo(0.25);
          } catch (e) { tensao = null; }
        }
        function pararTensao() {
          if (!tensao) return;
          try {
            clearInterval(tensao.h);
            const t = ctxPulso.currentTime;
            tensao.mestre.gain.cancelScheduledValues(t); tensao.mestre.gain.setValueAtTime(tensao.mestre.gain.value, t); tensao.mestre.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
            tensao.drone.stop(t + 0.35);
          } catch (e) { }
          tensao = null; volumeFundo(1);
        }
        function pararRelogio() { if (relogio) { clearInterval(relogio); relogio = null; } }
        function iniciarRelogio() {
          pararRelogio(); st.resta = TEMPO; st.esgotou = false;
          relogio = setInterval(() => {
            if (!st || st.fim || st.travado) { pararRelogio(); return; }
            st.resta--;
            const r = el.querySelector('.' + c('relogio'));
            if (r) { r.textContent = st.resta + 's'; r.classList.toggle(c('urgente'), st.resta <= 10); }
            if (st.resta <= 0) { pararRelogio(); st.esgotou = true; st.travado = true; desenhar(); revelar(); return; }
            pulso(st.resta <= 10);
          }, 1000);
        }
        const limpar = () => { pararRelogio(); pararTensao(); calar(); timers.forEach(clearTimeout); timers.length = 0; if (antecipa) { el.removeEventListener('pointerdown', antecipa); antecipa = null; } };

        function intro() {
          efeito('vinheta');
          limpar();
          el.innerHTML = `<div class="${c('palco')}"><div class="${c('titulo')} ${c('h1')}">${api.esc(NOME)}</div>
<p class="${c('sub')}">O quiz que vale um milhão de sorrisos</p>
<div class="${c('abre')}"><div class="${c('sislugar')}"></div><div class="${c('balao')}"><b class="${c('oi')}">Bem-vindos ao show!</b><ul class="${c('regras2')}">
<li><span>🎯</span><span><b>15 perguntas</b>, das fáceis às difíceis</span></li>
<li><span>🛡️</span><span>A <b>5ª e a 10ª</b> garantem o prêmio</span></li>
<li><span>✋</span><span><b>Pare</b> quando quiser e leve o que ganhou</span></li>
<li><span>🆘</span><span>Ajudas: <b>50:50</b>, <b>3 pulos</b> e <b>plateia</b></span></li></ul></div></div>
<p class="${c('mentira')}">O prêmio é de mentirinha; os pontos vão pro ranking.</p>
<div class="${c('linha')}"><button type="button" class="${c('btn')} ${c('comecar')}">Valendo!</button><button type="button" class="${c('btn')} ${c('azul')} ${c('engr')}">⚙️ Configurações</button><button type="button" class="${c('btn')} ${c('azul')} ${c('sair')}">Voltar</button></div>
<p class="${c('nota')}">Perguntas feitas a partir do material das aulas, do laboratório e de conhecimentos gerais. Confira com o professor.</p></div>`;
          poeSis('grande'); sisReage('apresentando', { ficar: true });
          el.querySelector('.' + c('comecar')).onclick = () => abrirMaterias(nova);
          el.querySelector('.' + c('sair')).onclick = () => { limpar(); pararFundo(); if (sis) sis.destruir(); api.voltar(); }; { const eg = el.querySelector('.' + c('engr')); if (eg) eg.onclick = abrirConf; }
        }
        // apresentador: voz sintética genérica do navegador (pt-BR), nunca imitação de pessoa real; respeita o mudo
        function falar(texto) {
          try {
            if (!CONF.voz || !('speechSynthesis' in window) || !window.Sons || Sons.mudo()) return;
            speechSynthesis.cancel();
            // locutor animado: voz masculina, mais rápida e mais aguda; frases curtas, cada uma com seu fôlego
            const vozes = speechSynthesis.getVoices().filter(x => /pt[-_]BR/i.test(x.lang));
            const v = vozes.find(x => /natural|online|antonio|francisco|daniel/i.test(x.name)) || vozes[0];
            const frases = String(texto).split(/(?<=[!?.])\s+/).filter(Boolean);
            frases.forEach((frase, i) => {
              const u = new SpeechSynthesisUtterance(frase);
              if (i === 0) u.onstart = () => sisFala(true);
              if (i === frases.length - 1) { u.onend = () => sisFala(false); u.onerror = () => sisFala(false); }
              u.lang = 'pt-BR'; if (v) u.voice = v;
              const grito = /!$/.test(frase);
              u.rate = grito ? 1.18 : 1.12; u.pitch = grito ? 1.45 : 1.2; u.volume = 1;
              speechSynthesis.speak(u);
            });
          } catch (e) { }
        }
        // locutor com voz neural gravada (games/locutor.js + audio/locutor/*.mp3, gerados por gerar_locutor.py); toca em fila
        let fila = null;
        function tocarFila(urls, aoFim) {
          calar();
          let ok = false; try { ok = !!(window.Sons && !Sons.mudo()); } catch (e) { ok = false; }
          urls = (urls || []).filter(Boolean);
          if (!CONF.voz) ok = false;
          if (!ok || !urls.length) { if (aoFim) aoFim(); return; }
          const tok = { c: false, a: null }; fila = tok; let i = 0;
          // Rafael 11/11: "Letra A" e a alternativa têm que sair colados. Web Audio: baixa tudo, corta o silêncio
          // das pontas de cada gravação e agenda uma atrás da outra, sem buraco. Sem Web Audio = jeito antigo.
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) {
            const ctx = window.__ctxFala || (window.__ctxFala = new AC());
            const cache = window.__bufFala || (window.__bufFala = {});
            const aparar = b => {
              const d = b.getChannelData(0), lim = 0.012, pad = Math.floor(b.sampleRate * 0.03);
              let ini = 0, fim = d.length - 1;
              while (ini < fim && Math.abs(d[ini]) < lim) ini++;
              while (fim > ini && Math.abs(d[fim]) < lim) fim--;
              ini = Math.max(0, ini - pad); fim = Math.min(d.length, fim + pad);
              const nb = ctx.createBuffer(b.numberOfChannels, Math.max(1, fim - ini), b.sampleRate);
              for (let ch = 0; ch < b.numberOfChannels; ch++) nb.getChannelData(ch).set(b.getChannelData(ch).subarray(ini, fim));
              return nb;
            };
            const lista = urls.filter(u => typeof u === 'string');
            const fontes = []; let timer = null;
            tok.a = { pause() { fontes.forEach(x => { try { x.stop(); } catch (e) { } }); if (timer) clearTimeout(timer); } };
            Promise.all(lista.map(u => cache[u] || (cache[u] = fetch(u).then(r => r.arrayBuffer()).then(b => new Promise((ok, no) => ctx.decodeAudioData(b, ok, no))).then(aparar)))).then(bufs => {
              if (tok.c) return;
              if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { } }
              const g = ctx.createGain(); let vol = 0.9; try { vol = Math.min(1, (Sons.volume ? Sons.volume() : 0.5) * 1.8); } catch (e) { } g.gain.value = vol; g.connect(ctx.destination);
              let t = ctx.currentTime + 0.05;
              bufs.forEach((b, k) => { const x = ctx.createBufferSource(); x.buffer = b; x.connect(g); x.start(t); fontes.push(x); t += b.duration + (/letra[A-D]/.test(lista[k]) ? 0.06 : 0.28); });
              sisFala(true);
              timer = setTimeout(() => { if (tok.c) return; fila = null; sisFala(false); if (aoFim) aoFim(); }, Math.max(0, (t - ctx.currentTime) * 1000));
            }).catch(() => { if (tok.c) return; simples(); });
            return;
          }
          simples();
          function simples() {
          const pre = urls.map(u => { if (typeof u !== 'string') return null; const x = new Audio(); x.preload = 'auto'; x.src = u; try { x.load(); } catch (e) { } return x; });
          const prox = () => {
            if (tok.c) return;
            if (i >= urls.length) { fila = null; sisFala(false); if (aoFim) aoFim(); return; }
            const a = pre[i++];
            if (!a) { prox(); return; } // nunca outra voz: sem áudio gravado, pula
            tok.a = a; sisFala(true);
            try { a.volume = Math.min(1, (Sons.volume ? Sons.volume() : 0.5) * 1.8); } catch (e) { }
            a.onended = prox; a.onerror = prox;
            const p = a.play(); if (p && p.catch) p.catch(prox);
          };
          prox();
          }
        }
        function fala(chave, reserva) { const L = window.LOCUTOR; if (L && L.fixas[chave]) tocarFila([L.fixas[chave]]); else falar(reserva); }
        function calar() {
          if (fila) { fila.c = true; try { fila.a && fila.a.pause(); } catch (e) { } fila = null; }
          try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { }
          sisFala(false);
        }
        // gritos e palmas de auditório (sintetizados, originais): palmas de ruído + "uhuuu" de vários vozes + clamor
        function auditorio() {
          try {
            if (!window.Sons || Sons.mudo() || !Sons.disponivel()) return;
            const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
            ctxPulso = ctxPulso || new AC(); if (ctxPulso.state === 'suspended') ctxPulso.resume();
            const ac = ctxPulso, t0 = ac.currentTime, dur = 4.5, vol = (Sons.volume ? Sons.volume() : 0.5);
            const mestre = ac.createGain(); mestre.gain.value = vol * 0.9; mestre.connect(ac.destination);
            const ruido = ac.createBuffer(1, ac.sampleRate * 0.1, ac.sampleRate); const d = ruido.getChannelData(0);
            for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
            for (let k = 0; k < 160; k++) { // palmas
              const t = t0 + Math.random() * dur * (0.6 + 0.4 * Math.random()), s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
              s.buffer = ruido; f.type = 'bandpass'; f.frequency.value = 900 + Math.random() * 1600; f.Q.value = 1.2;
              g.gain.value = 0.25 + Math.random() * 0.35; s.connect(f).connect(g).connect(mestre); s.start(t);
            }
            for (let k = 0; k < 7; k++) { // gritos "uhuuu"
              const t = t0 + 0.1 + Math.random() * 1.8, o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain(), vib = ac.createOscillator(), vg = ac.createGain();
              const base = 260 + Math.random() * 220; o.type = 'sawtooth';
              o.frequency.setValueAtTime(base, t); o.frequency.exponentialRampToValueAtTime(base * 1.9, t + 0.35); o.frequency.exponentialRampToValueAtTime(base * 1.5, t + 1.1);
              vib.frequency.value = 6 + Math.random() * 2; vg.gain.value = base * 0.03; vib.connect(vg).connect(o.frequency);
              f.type = 'bandpass'; f.frequency.value = 800 + Math.random() * 400; f.Q.value = 4;
              g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.12); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
              o.connect(f).connect(g).connect(mestre); o.start(t); vib.start(t); o.stop(t + 1.25); vib.stop(t + 1.25);
            }
            const roar = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate), rd = roar.getChannelData(0); // clamor da plateia
            for (let i = 0; i < rd.length; i++) rd[i] = Math.random() * 2 - 1;
            const rs = ac.createBufferSource(), rf = ac.createBiquadFilter(), rg = ac.createGain();
            rs.buffer = roar; rf.type = 'lowpass'; rf.frequency.value = 700;
            rg.gain.setValueAtTime(0.0001, t0); rg.gain.exponentialRampToValueAtTime(0.18, t0 + 0.5); rg.gain.setValueAtTime(0.18, t0 + dur - 1.2); rg.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
            rs.connect(rf).connect(rg).connect(mestre); rs.start(t0);
          } catch (e) { }
        }
        function nova() {
          efeito('novo');
          iniciarFundo();
          const esc = bancoEscolhido(); banco = esc.b; if (esc.aviso) api.toast(esc.aviso);
          st = { perguntas: montarPartidaNova(banco, esc.chave), i: 0, acertos: 0, pulos: PULOS, c50: false, plat: false, ops: null, fora: [], plateia: null, sel: -1, travado: false, fim: false, erros: [] };
          pergunta();
        }
        function ordenar(q) { return embaralhar(q.o.map((x, k) => ({ x, c: k === q.a }))); }
        function pergunta() {
          limpar();
          const q = st.perguntas[st.i];
          st.ops = ordenar(q); st.fora = []; st.plateia = null; st.sel = -1; st.travado = false;
          sisReage('neutro', { ficar: true });
          iniciarFundo();
          desenhar();
          const v = ESCADA[st.i], porExtenso = v >= 1000000 ? 'um milhão de reais' : v >= 1000 ? `${v / 1000} mil reais` : `${v} reais`;
          // o cronômetro só começa quando o locutor termina de ler até a última letra
          const L = window.LOCUTOR;
          if (L && L.fixas && L.perguntas) { const ops = L.opcoes || {}, todas = st.ops.every(o => ops[o.x]); tocarFila([L.fixas['valendo' + String(st.i + 1).padStart(2, '0')], L.perguntas[q.q]].concat(todas ? [].concat(...st.ops.map((o, k) => [L.fixas['letra' + LETRAS[k]], ops[o.x]])) : []), iniciarRelogio); }
          else { falar(`${st.i === 0 ? 'Vamos começar! Valendo' : 'E agora, valendo'} ${porExtenso}! ${q.q} ` + st.ops.map((o, k) => `${LETRAS[k]}: ${o.x}.`).join(' ')); iniciarRelogio(); }
        }
        function pips() {
          return ESCADA.map((_, k) => `<span class="${c('pip')} ${k < st.acertos ? c('ok') : ''} ${k === st.i ? c('agora') : ''} ${SEGUROS.includes(k + 1) ? c('seg') : ''}"></span>`).join('');
        }
        function desenhar(resultado) {
          const q = st.perguntas[st.i], valendo = ESCADA[st.i], garantido = premio(seguro(st.acertos));
          const aberto = !resultado;
          el.innerHTML = `<div class="${c('palco')}">
<div class="${c('topo')}"><div class="${c('sislugar')}"></div><div class="${c('valendo')}"><small>Pergunta ${st.i + 1} de 15 · valendo</small><b>${reais(valendo)}</b>${aberto ? `<div><span class="${c('relogio')}${(st.resta ?? TEMPO) <= 10 ? ' ' + c('urgente') : ''}" role="timer" aria-label="Tempo restante">${st.resta ?? TEMPO}s</span></div>` : ''}</div><div class="${c('barra')}"><button type="button" class="${c('engr')} ${c('engrmini')}" aria-label="Configurações de som">⚙️</button><button type="button" class="${c('engrmini')} ${c('livros')}" aria-label="Escolher as matérias">📚</button></div></div>
<div class="${c('escada')}" aria-hidden="true">${pips()}</div>
<div class="${c('info')}"><span>Ganhou <b>${reais(premio(st.acertos))}</b></span><span>Garantido <b>${garantido ? reais(garantido) : 'R$ 0'}</b></span></div>
<span class="${c('tag')}">${api.esc(q.m || 'Odontologia')} · ${['fácil', 'média', 'difícil'][q.n - 1]}</span>
<div class="${c('pergunta')}">${api.esc(q.q)}</div>
<div class="${c('ops')}">${st.ops.map((o, k) => {
            let cls = '';
            if (st.fora.includes(k)) cls = c('fora');
            else if (resultado) cls = o.c ? c('certa') : (k === st.sel ? c('errada') : '');
            else if (k === st.sel) cls = c('sel') + (st.travado ? ' ' + c('pisca') : '');
            return `<button type="button" class="${c('op')} ${cls}" data-k="${k}" ${resultado || st.travado ? 'disabled' : ''}><i>${LETRAS[k]}</i><span>${api.esc(o.x)}</span></button>`;
          }).join('')}</div>
${st.plateia ? `<div class="${c('plateia')}">${st.plateia.map((p, k) => st.fora.includes(k) ? '' : `<div class="${c('bar')}"><span>${LETRAS[k]}</span><span><i style="width:${p}%"></i></span><span>${p}%</span></div>`).join('')}<div class="${c('nota')}">A plateia também erra.</div></div>` : ''}
${aberto && st.escolhendo ? `<div class="${c('plateia')}"><b>Pular pra qual matéria?</b>${materiasDoPulo(st.perguntas, st.i, banco).map(m => `<button type="button" class="${c('aj')} ${c('mpulo')}" data-m="${api.esc(m)}">${api.esc(m)}</button>`).join('')}<button type="button" class="${c('aj')} ${c('mpulo')}" data-m="">Qualquer matéria</button></div>` : aberto ? `<div class="${c('linha')}"><button type="button" class="${c('btn')} ${c('confirmar')}" ${st.sel < 0 || st.travado ? 'disabled' : ''}>Confirmar</button></div>
<div class="${c('ajudas')}"><button type="button" class="${c('aj')} ${c('a50')}" ${st.c50 || st.travado ? 'disabled' : ''}>50:50<small>tira 2 erradas</small></button><button type="button" class="${c('aj')} ${c('apular')}" ${st.pulos <= 0 || st.travado ? 'disabled' : ''}>Pular<small>${st.pulos} restante${st.pulos === 1 ? '' : 's'}</small></button><button type="button" class="${c('aj')} ${c('aplat')}" ${st.plat || st.travado ? 'disabled' : ''}>Plateia<small>uma vez</small></button></div>
<div class="${c('linha')}"><button type="button" class="${c('btn')} ${c('vermelho')} ${c('parar')}" ${st.travado ? 'disabled' : ''}>Parar e levar ${reais(premio(st.acertos))}</button></div>` : resultado}
</div>`;
          poeSis('canto');
          if (aberto) ligar(); else ligarResultado();
        }
        function ligar() {
          if (st.escolhendo) { // escolha da matéria do pulo
            el.querySelectorAll('.' + c('mpulo')).forEach(b => { b.onclick = () => {
              const outra = pularPergunta(st.perguntas, st.i, banco, undefined, b.dataset.m || undefined);
              st.escolhendo = false;
              if (!outra) { api.toast('Não há outra pergunta desse nível'); desenhar(); return; }
              st.pulos--; st.perguntas[st.i] = outra; pergunta(); efeito('powerup');
            }; });
            return;
          }
          el.querySelectorAll('.' + c('op')).forEach(b => { b.onclick = () => { if (st.travado) return; st.sel = +b.dataset.k; desenhar(); iniciarTensao(); }; });
          el.querySelectorAll('.' + c('op')).forEach(b => b.addEventListener('click', () => { if (!st.travado) efeito('clique'); }));
          const $ = k => el.querySelector('.' + c(k));
          if ($('engrmini')) $('engrmini').onclick = abrirConf;
          if ($('livros')) $('livros').onclick = () => abrirMaterias(() => { pararRelogio(); calar(); nova(); });
          $('confirmar').onclick = confirmar;
          $('a50').onclick = () => { if (st.c50) return; st.c50 = true; sisReage('pensando', { depois: 'neutro' }); st.fora = cinquenta(st.ops); if (st.fora.includes(st.sel)) st.sel = -1; desenhar(); };
          $('apular').onclick = () => {
            if (st.pulos <= 0) return;
            if (!materiasDoPulo(st.perguntas, st.i, banco).length) { api.toast('Não há outra pergunta desse nível'); return; }
            pararTensao(); pararRelogio(); calar(); st.sel = -1; st.escolhendo = true; desenhar(); efeito('clique'); sisReage('pensando', { ficar: true }); // relógio pausa enquanto escolhe; a próxima pergunta começa do zero
          };
          $('aplat').onclick = () => { if (st.plat) return; st.plat = true; sisReage('pensando', { depois: 'neutro' }); st.plateia = plateia(st.ops, st.perguntas[st.i].n); desenhar(); };
          $('a50').addEventListener('click', () => efeito('powerup')); $('aplat').addEventListener('click', () => efeito('powerup'));
          $('parar').onclick = () => encerrar('parou');
        }
        function confirmar() {
          if (st.sel < 0 || st.travado) return;
          pararTensao(); pararRelogio(); calar();
          st.travado = true; desenhar(); sisReage('suspense', { ficar: true });
          // rufar só nas perguntas que garantem prêmio (5ª, 10ª) e na do milhão; nas outras, revela rápido
          const tensa = SEGUROS.includes(st.i + 1) || st.i === ESCADA.length - 1;
          let somOk = false; try { somOk = !!(window.Sons && Sons.disponivel()); } catch (e) { somOk = false; }
          const suspense = tensa && somOk && !reduz;
          if (suspense) { try { efeito('suspense'); } catch (e) { } }
          const idx = st.i; let feito = false;
          const vai = () => {
            if (antecipa) { el.removeEventListener('pointerdown', antecipa); antecipa = null; }
            if (feito || st.fim || st.i !== idx || !st.travado) return;
            feito = true; revelar();
          };
          apos(vai, suspense ? 1600 : (reduz || !somOk ? 350 : 400));
          antecipa = () => vai();
          el.addEventListener('pointerdown', antecipa);
        }
        function revelar() {
          pararTensao(); pararRelogio();
          const q = st.perguntas[st.i], acertou = st.sel >= 0 && st.ops[st.sel].c, ultima = st.i === ESCADA.length - 1;
          if (acertou) st.acertos++; else st.erros.push(q);
          sisReage(acertou ? (ultima ? 'milhao' : 'acerto') : 'erro', { ficar: true });
          efeito(acertou ? (ultima ? 'milhao' : 'acerto_tv') : 'erro_tv');
          apos(() => acertou ? (ultima ? fala('milhao', 'É o milhão!') : fala('certa', 'Certa resposta!')) : st.esgotou ? fala('tempo', 'O tempo acabou!') : fala('errada', 'Que pena! Resposta errada.'), 450);
          const certa = st.ops.findIndex(o => o.c);
          const res = `<div class="${c('res')} ${acertou ? c('ok') : c('bad')}"><b>${acertou ? (ultima ? 'É O MILHÃO!' : 'Resposta certa') : st.esgotou ? 'O tempo acabou' : 'Resposta errada'}</b>${!acertou ? `<div>A certa era a ${LETRAS[certa]}.</div>` : ''}${q.w ? `<div>${api.esc(q.w)}</div>` : ''}${Array.isArray(q.r) && q.r.length ? `<div class="${c('refs')}"><b>Quer saber mais?</b>${q.r.map(x => `<a href="${api.esc(x.u)}" target="_blank" rel="noopener">${api.esc(x.t)}</a>`).join('')}</div>` : ''}</div>
<div class="${c('linha')}"><button type="button" class="${c('btn')} ${c('prox')}">${acertou ? (ultima ? 'Ver o prêmio' : 'Próxima pergunta') : 'Ver resultado'}</button></div>`;
          desenhar(res);
        }
        function ligarResultado() {
          const acertou = st.ops[st.sel] && st.ops[st.sel].c, ultima = st.i === ESCADA.length - 1;
          el.querySelector('.' + c('prox')).onclick = () => {
            if (!acertou) return encerrar('errou');
            if (ultima) return encerrar('milhao');
            efeito(SEGUROS.includes(st.acertos) ? 'aplausos' : 'moeda', 'curto');
            st.i++; pergunta(); window.scrollTo(0, 0);
          };
          el.querySelector('.' + c('prox')).scrollIntoView({ block: 'nearest' });
        }
        // Rafael 11/11: musiquinha de "perdeu" de videogame 8-bit, nostálgica. Melodia ORIGINAL (não copia jogo nenhum):
        // onda quadrada como os consoles antigos, um "tropeço" subindo e uma descida triste, fechando com o "plim" grave.
        function gameOver8bit() {
          try {
            if (!CONF.efeitos || (window.Sons && Sons.mudo())) return;
            const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
            const ctx = window.__ctxGameOver || (window.__ctxGameOver = new AC());
            if (ctx.state === 'suspended') ctx.resume();
            let vol = 0.18; try { vol = 0.12 + 0.2 * (Sons.volume ? Sons.volume() : 0.5); } catch (e) { }
            const g = ctx.createGain(); g.gain.value = vol; g.connect(ctx.destination);
            const nota = (f, t0, dur, tipo, ate) => {
              const o = ctx.createOscillator(), e = ctx.createGain();
              o.type = tipo || 'square'; o.frequency.setValueAtTime(f, t0);
              if (ate) o.frequency.exponentialRampToValueAtTime(ate, t0 + dur);
              e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(1, t0 + 0.01);
              e.gain.setValueAtTime(1, t0 + dur * 0.7); e.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
              o.connect(e); e.connect(g); o.start(t0); o.stop(t0 + dur + 0.02);
            };
            const t = ctx.currentTime + 0.15, B = 0.11; // B = uma "batida" curta
            // tropeço: sobe rápido e engasga
            [[784, 0], [988, 1], [1175, 2], [1109, 3]].forEach(([f, k]) => nota(f, t + k * B, B * 0.9));
            // pausa de susto, depois a descida triste em passos
            const d = t + 5 * B;
            [[659, 0, 2], [587, 2, 2], [523, 4, 2], [440, 6, 3]].forEach(([f, k, n]) => nota(f, d + k * B, n * B * 0.95));
            // baixo acompanhando (onda triangular, como o canal de baixo dos consoles)
            [[165, 0], [147, 2], [131, 4], [110, 6]].forEach(([f, k]) => nota(f, d + k * B, 2 * B * 0.95, 'triangle'));
            // final: "plim" grave caindo
            nota(392, d + 9.5 * B, 6 * B, 'square', 98);
          } catch (e) { }
        }
        function encerrar(modo) {
          if (st.fim) return; st.fim = true; limpar(); pararFundo();
          const acertos = st.acertos, pts = modo === 'milhao' ? 60 : pontos(acertos, modo);
          const levou = modo === 'errou' ? premio(seguro(acertos)) : premio(acertos);
          const titulo = modo === 'milhao' ? 'VOCÊ GANHOU O MILHÃO' : modo === 'parou' ? 'Você parou e levou' : 'Não foi dessa vez, você leva';
          const msg = modo === 'milhao' ? 'Milhão da Odontologia' : 'Show do Sisão';
          if (pts > 0) api.ganhou(pts, msg); else api.perdeu(msg);
          // Rafael 11/11: levou algum prêmio = festa (mesmo errando); musiquinha de azar só quando sai sem nada
          if (levou <= 0) gameOver8bit();
          if (levou > 0) { auditorio(); if (modo === 'parou') fala('parou', 'Parou e levou! Muito bem!'); }
          el.innerHTML = `<div class="${c('palco')}"><div class="${c('fim')}"><div class="${c('sisfim')}"><div class="${c('sislugar')}"></div></div><div class="${c('titulo')} ${c('h2')}">${titulo}</div>
<div class="${c('big')}">${levou ? reais(levou) : 'R$ 0'}</div>
<p class="${c('sub')}">${acertos} de 15 perguntas certas · ${pts} ${pts === 1 ? 'ponto' : 'pontos'} no ranking</p>
${st.erros.length ? `<div class="${c('lista')}"><b>Para rever</b>${st.erros.map(q => `<div>${api.esc(q.q)}<br><small>Certa: ${api.esc(q.o[q.a])}</small></div>`).join('')}</div>` : ''}
<div class="${c('linha')}"><button type="button" class="${c('btn')} ${c('denovo')}">Jogar de novo</button><button type="button" class="${c('btn')} ${c('azul')} ${c('voltar')}">Voltar</button></div></div></div>`;
          poeSis('fim'); sisReage(modo === 'milhao' ? 'milhao' : levou > 0 ? 'comemorando' : 'perdeu', modo === 'milhao' || levou <= 0 ? { ficar: true } : { depois: 'tchau' });
          el.querySelector('.' + c('denovo')).onclick = () => { limpar(); jogo.montar(el, t, api); };
          el.querySelector('.' + c('voltar')).onclick = () => { limpar(); pararFundo(); if (sis) sis.destruir(); api.voltar(); };
          window.scrollTo(0, 0);
        }
        intro();
      }
    };
    window.JOGOS = window.JOGOS || [];
    if (!window.JOGOS.some(j => j.id === ID)) window.JOGOS.push(jogo);
  }

  if (typeof module !== 'undefined') {
    module.exports = { ID, ESCADA, NIVEIS, SEGUROS, PULOS, embaralhar, perguntaValida, bancoValido, podeJogar, montarPartida, pularPergunta, materiasDoPulo, premio, seguro, pontos, cinquenta, plateia, reais };
  }
})();
