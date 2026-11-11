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
  function embaralhar(arr, rnd) {
    rnd = rnd || Math.random; const a = arr.slice();
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
  function plateia(ops, nivel, rnd) { // brincadeira: a plateia tende a acertar, menos nas difíceis, e erra de vez em quando
    rnd = rnd || Math.random;
    const acerta = [0.85, 0.62, 0.42][nivel - 1] || 0.5, certa = rnd() < acerta;
    const pesos = ops.map(o => (o.c ? (certa ? 5 : 1.5) : (certa ? 1 : 3)) * (0.6 + rnd()));
    const soma = pesos.reduce((a, b) => a + b, 0);
    const pct = pesos.map(p => Math.round(100 * p / soma)); pct[0] += 100 - pct.reduce((a, b) => a + b, 0);
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
.X-conf label{display:flex;gap:8px;align-items:center;justify-content:space-between;font-size:15px}
.X-conf select,.X-conf input[type=range]{max-width:55%}
.X-engrmini{float:right;background:none;border:0;font-size:22px;cursor:pointer;min-width:44px;min-height:44px}
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
@media (prefers-reduced-motion:reduce){.X-palco::before,.X-palco::after,.X-op.X-pisca,.X-pip.X-agora{animation:none}}
`.replace(/X-/g, ID + '-');

    function injetarCss() {
      if (!document.getElementById('css-' + ID)) { const s = document.createElement('style'); s.id = 'css-' + ID; s.textContent = CSS; document.head.appendChild(s); }
    }

    const jogo = {
      id: ID, nome: NOME, global: true,
      desc: 'Quinze perguntas de todas as matérias, do R$ 1 mil ao R$ 1 milhão. Tem 50:50, pular e plateia.',
      icone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M15.5 8.8c-.9-1-2.2-1.4-3.5-1.4-1.9 0-3.2 1-3.2 2.5 0 3.4 6.8 1.8 6.8 5.3 0 1.5-1.4 2.6-3.6 2.6-1.4 0-2.8-.5-3.8-1.6"/></svg>',
      disponivel() { return podeJogar(window.BANCO_MILHAO); },
      montar(el, t, api) {
        injetarCss();
        const banco = bancoValido(window.BANCO_MILHAO);
        if (!podeJogar(banco)) { el.innerHTML = `<div class="card"><p>O banco de perguntas ainda não está pronto.</p><button type="button" class="btn ghost full">Voltar</button></div>`; el.querySelector('button').onclick = () => api.voltar(); return; }
        let st = null;
        const reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const timers = []; const apos = (fn, ms) => { const h = setTimeout(fn, ms); timers.push(h); return h; };
        let antecipa = null; // toque na tela durante o suspense revela na hora
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
        function painelConf() {
          const box = document.createElement('div'); box.className = c('conf');
          box.innerHTML = `<b>Configurações</b>
<label><input type="checkbox" data-k="musica" ${CONF.musica ? 'checked' : ''}> Música de fundo</label>
<label><input type="checkbox" data-k="voz" ${CONF.voz ? 'checked' : ''}> Locutor</label>
<label><input type="checkbox" data-k="efeitos" ${CONF.efeitos ? 'checked' : ''}> Efeitos (acerto, erro, rufar)</label>
<label><input type="checkbox" data-k="bateria" ${CONF.bateria ? 'checked' : ''}> Bateria na música</label>
<label>Volume da música <input type="range" min="0.1" max="1" step="0.1" value="${CONF.volMusica}" data-k="volMusica"></label>

<button type="button" class="${c('btn')} ${c('azul')}" data-fechar>Fechar</button>`;
          box.querySelectorAll('[data-k]').forEach(inp => inp.onchange = () => {
            const k = inp.dataset.k;
            CONF[k] = inp.type === 'checkbox' ? inp.checked : k === 'trilha' ? inp.value : +inp.value; gravaConf();
            if (k === 'musica' || k === 'volMusica' || k === 'bateria' || k === 'trilha') { pararFundo(); if (CONF.musica && st && !st.fim) iniciarFundo(); }
            if (k === 'voz' && !CONF.voz) calar();
          });
          box.querySelector('[data-fechar]').onclick = () => { box.remove(); if (!st || st.fim) pararFundo(); };
          return box;
        }
        function abrirConf() { const velho = el.querySelector('.' + c('conf')); if (velho) { velho.remove(); return; } const pal = el.querySelector('.' + c('palco')); if (pal) pal.prepend(painelConf()); }
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
<div class="${c('regras')}"><div><b>15 perguntas</b> de todas as matérias, 5 fáceis, 5 médias e 5 difíceis.</div><div>Acertou a 5ª e a 10ª, o prêmio fica <b>garantido</b>. Errou, volta pro último garantido.</div><div><b>Parar</b> a qualquer hora leva o que já ganhou.</div><div>Ajudas: <b>50:50</b>, <b>Pular</b> (3 vezes, escolhendo a matéria da próxima) e <b>Plateia</b>.</div><div>O dinheiro é de brincadeira, os <b>pontos</b> entram no ranking (4 por pergunta garantida).</div></div>
<div class="${c('linha')}"><button type="button" class="${c('btn')} ${c('comecar')}">Valendo!</button><button type="button" class="${c('btn')} ${c('azul')} ${c('engr')}">⚙️ Configurações</button><button type="button" class="${c('btn')} ${c('azul')} ${c('sair')}">Voltar</button></div>
<p class="${c('nota')}">Perguntas feitas a partir do material das aulas, do laboratório e de conhecimentos gerais. Confira com o professor.</p></div>`;
          el.querySelector('.' + c('comecar')).onclick = nova;
          el.querySelector('.' + c('sair')).onclick = () => { limpar(); pararFundo(); api.voltar(); }; { const eg = el.querySelector('.' + c('engr')); if (eg) eg.onclick = abrirConf; }
        }
        // apresentador: voz sintética genérica do navegador (pt-BR), nunca imitação de pessoa real; respeita o mudo
        function falar(texto) {
          try {
            if (!CONF.voz || !('speechSynthesis' in window) || !window.Sons || Sons.mudo()) return;
            speechSynthesis.cancel();
            // locutor animado: voz masculina, mais rápida e mais aguda; frases curtas, cada uma com seu fôlego
            const vozes = speechSynthesis.getVoices().filter(x => /pt[-_]BR/i.test(x.lang));
            const v = vozes.find(x => /natural|online|antonio|francisco|daniel/i.test(x.name)) || vozes[0];
            String(texto).split(/(?<=[!?.])\s+/).filter(Boolean).forEach((frase, i) => {
              const u = new SpeechSynthesisUtterance(frase);
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
          const prox = () => {
            if (tok.c) return;
            if (i >= urls.length) { fila = null; if (aoFim) aoFim(); return; }
            const item = urls[i++];
            if (typeof item === 'object') { prox(); return; } // nunca outra voz: sem áudio gravado, pula
            const a = new Audio(item); tok.a = a;
            try { a.volume = Math.min(1, (Sons.volume ? Sons.volume() : 0.5) * 1.8); } catch (e) { }
            a.onended = prox; a.onerror = prox;
            const p = a.play(); if (p && p.catch) p.catch(prox);
          };
          prox();
        }
        function fala(chave, reserva) { const L = window.LOCUTOR; if (L && L.fixas[chave]) tocarFila([L.fixas[chave]]); else falar(reserva); }
        function calar() {
          if (fila) { fila.c = true; try { fila.a && fila.a.pause(); } catch (e) { } fila = null; }
          try { if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) { }
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
          st = { perguntas: montarPartida(banco), i: 0, acertos: 0, pulos: PULOS, c50: false, plat: false, ops: null, fora: [], plateia: null, sel: -1, travado: false, fim: false, erros: [] };
          pergunta();
        }
        function ordenar(q) { return embaralhar(q.o.map((x, k) => ({ x, c: k === q.a }))); }
        function pergunta() {
          limpar();
          const q = st.perguntas[st.i];
          st.ops = ordenar(q); st.fora = []; st.plateia = null; st.sel = -1; st.travado = false;
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
<button type="button" class="${c('engr')} ${c('engrmini')}" aria-label="Configurações de som">⚙️</button><div class="${c('valendo')}"><small>Pergunta ${st.i + 1} de 15 · valendo</small><b>${reais(valendo)}</b>${aberto ? `<div><span class="${c('relogio')}${(st.resta ?? TEMPO) <= 10 ? ' ' + c('urgente') : ''}" role="timer" aria-label="Tempo restante">${st.resta ?? TEMPO}s</span></div>` : ''}</div>
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
          $('confirmar').onclick = confirmar;
          $('a50').onclick = () => { if (st.c50) return; st.c50 = true; st.fora = cinquenta(st.ops); if (st.fora.includes(st.sel)) st.sel = -1; desenhar(); };
          $('apular').onclick = () => {
            if (st.pulos <= 0) return;
            if (!materiasDoPulo(st.perguntas, st.i, banco).length) { api.toast('Não há outra pergunta desse nível'); return; }
            pararTensao(); pararRelogio(); calar(); st.sel = -1; st.escolhendo = true; desenhar(); efeito('clique'); // relógio pausa enquanto escolhe; a próxima pergunta começa do zero
          };
          $('aplat').onclick = () => { if (st.plat) return; st.plat = true; st.plateia = plateia(st.ops, st.perguntas[st.i].n); desenhar(); };
          $('a50').addEventListener('click', () => efeito('powerup')); $('aplat').addEventListener('click', () => efeito('powerup'));
          $('parar').onclick = () => encerrar('parou');
        }
        function confirmar() {
          if (st.sel < 0 || st.travado) return;
          pararTensao(); pararRelogio(); calar();
          st.travado = true; desenhar();
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
          efeito(acertou ? (ultima ? 'milhao' : 'acerto_tv') : 'erro_tv');
          apos(() => acertou ? (ultima ? fala('milhao', 'É o milhão!') : fala('certa', 'Certa resposta!')) : st.esgotou ? fala('tempo', 'O tempo acabou!') : fala('errada', 'Que pena! Resposta errada.'), 450);
          const certa = st.ops.findIndex(o => o.c);
          const res = `<div class="${c('res')} ${acertou ? c('ok') : c('bad')}"><b>${acertou ? (ultima ? 'É O MILHÃO!' : 'Resposta certa') : st.esgotou ? 'O tempo acabou' : 'Resposta errada'}</b>${!acertou ? `<div>A certa era a ${LETRAS[certa]}.</div>` : ''}${q.w ? `<div>${api.esc(q.w)}</div>` : ''}</div>
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
        function encerrar(modo) {
          if (st.fim) return; st.fim = true; limpar(); pararFundo();
          const acertos = st.acertos, pts = modo === 'milhao' ? 60 : pontos(acertos, modo);
          const levou = modo === 'errou' ? premio(seguro(acertos)) : premio(acertos);
          const titulo = modo === 'milhao' ? 'VOCÊ GANHOU O MILHÃO' : modo === 'parou' ? 'Você parou e levou' : 'Não foi dessa vez, você leva';
          const msg = modo === 'milhao' ? 'Milhão da Odontologia' : 'Show do Sisão';
          if (pts > 0) api.ganhou(pts, msg); else api.perdeu(msg);
          if (modo !== 'errou' && levou > 0) { auditorio(); if (modo === 'parou') fala('parou', 'Parou e levou! Muito bem!'); }
          el.innerHTML = `<div class="${c('palco')}"><div class="${c('fim')}"><div class="${c('titulo')} ${c('h2')}">${titulo}</div>
<div class="${c('big')}">${levou ? reais(levou) : 'R$ 0'}</div>
<p class="${c('sub')}">${acertos} de 15 perguntas certas · ${pts} ${pts === 1 ? 'ponto' : 'pontos'} no ranking</p>
${st.erros.length ? `<div class="${c('lista')}"><b>Para rever</b>${st.erros.map(q => `<div>${api.esc(q.q)}<br><small>Certa: ${api.esc(q.o[q.a])}</small></div>`).join('')}</div>` : ''}
<div class="${c('linha')}"><button type="button" class="${c('btn')} ${c('denovo')}">Jogar de novo</button><button type="button" class="${c('btn')} ${c('azul')} ${c('voltar')}">Voltar</button></div></div></div>`;
          el.querySelector('.' + c('denovo')).onclick = () => { limpar(); jogo.montar(el, t, api); };
          el.querySelector('.' + c('voltar')).onclick = () => { limpar(); pararFundo(); api.voltar(); };
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
