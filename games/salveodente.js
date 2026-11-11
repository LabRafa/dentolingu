/* Dentolingu · jogo "Salve o dente" (games/salveodente.js, id "salveodente", o mesmo que o index.html carrega): forca com tema de dente.
   Dados: t.termos (p = palavra só A-Z, e = como se escreve com acento, d = dica). Uma partida = 3 rodadas, cada uma com um termo
   diferente. A cada letra errada o dente ganha uma cárie; 6 erros e o dente se perde (fica cinza, com rachadura).
   Pontos por rodada = 5 + (6 - erros) - 2 por dica pedida, ou 0 se perdeu o dente. Máximo da partida: 33.
   DICAS (Rafael, 28/10/2026): até 3 por rodada, cada uma custa 2 pontos do que a rodada renderia. 1ª = uma FRASE do próprio tema com a
   palavra escondida; 2ª = revela uma letra; 3ª = "revisãozinha" (até 3 trechos do tema sobre o termo, palavra escondida). O que não existir pro termo é pulado. Nada inventado: a frase vem do texto do tema.
   A lógica pura fica fora do DOM (exportada pra teste com node); o registro em window.JOGOS só roda no navegador. */
'use strict';
(function () {
  const ID = 'salveodente';
  const RODADAS = 3, MAX_ERROS = 6, MIN_TERMOS = 4, MAX_DICAS = 3, CUSTO_DICA = 2;
  const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  /* ===== LÓGICA PURA (sem DOM) ===== */
  const semAcento = s => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, ''); // tira os acentos (marcas combinantes)
  function termoValido(x) {
    return !!x && typeof x.p === 'string' && /^[A-Z]{3,14}$/.test(x.p) && typeof x.d === 'string' && x.d.trim().length > 0;
  }
  function termosValidos(t) { // só termos no formato certo, sem palavra repetida
    const lista = t && Array.isArray(t.termos) ? t.termos.filter(termoValido) : [];
    const vistos = new Set();
    return lista.filter(x => (vistos.has(x.p) ? false : (vistos.add(x.p), true)));
  }
  const temaServe = t => termosValidos(t).length >= MIN_TERMOS;
  function embaralhar(arr, rnd) { // Fisher-Yates; não mexe no original; rnd injetável pra teste
    rnd = rnd || Math.random; const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  const sortearTermos = (termos, n, rnd) => embaralhar(termos, rnd).slice(0, n);
  const novaRodada = termo => ({ termo, usadas: [], erros: 0, acertou: false, perdeu: false, dicas: 0, tipos: [], frase: '', revisao: [] });
  const todasReveladas = (p, usadas) => p.split('').every(ch => usadas.includes(ch));
  function chutar(r, letra) { // devolve a rodada nova (sem alterar a antiga) e o efeito: acerto | erro | repetida | fim | ignorado
    const L = semAcento(letra).toUpperCase();
    if (!/^[A-Z]$/.test(L)) return { rodada: r, efeito: 'ignorado' };
    if (r.acertou || r.perdeu) return { rodada: r, efeito: 'fim' };
    if (r.usadas.includes(L)) return { rodada: r, efeito: 'repetida' };
    const usadas = r.usadas.concat(L), certa = r.termo.p.includes(L);
    const erros = r.erros + (certa ? 0 : 1);
    const acertou = certa && todasReveladas(r.termo.p, usadas);
    return { rodada: Object.assign({}, r, { usadas, erros, acertou, perdeu: !acertou && erros >= MAX_ERROS }), efeito: certa ? 'acerto' : 'erro' };
  }
  const pontosRodada = r => (r.acertou ? Math.max(1, 5 + (MAX_ERROS - r.erros) - CUSTO_DICA * (r.dicas || 0)) : 0);
  /* Frase do tema que contém o termo, com a palavra trocada por ____ (nunca inventa: só texto do próprio tema). */
  function textosDoTema(t) {
    const out = [];
    for (const l of (t && t.licoes) || []) for (const q of (l.qs || [])) {
      if (q.w) out.push(q.w);
      if (q.q) out.push(q.q);
      for (const o of (q.o || [])) if (typeof o === 'string') out.push(o);
      for (const p of (q.p || [])) for (const x of p) if (typeof x === 'string') out.push(x);
    }
    for (const c of (t && t.cards) || []) for (const x of c) if (typeof x === 'string') out.push(x);
    const m = (t && t.mapa) || {};
    for (const r of (m.ramos || [])) for (const x of (r.i || [])) if (typeof x === 'string') out.push(x);
    return out;
  }
  function mascarar(f, palavra) { // troca a 1ª ocorrência da palavra inteira por ____ ('' se não tem)
    const n = semAcento(f).toLowerCase();
    let de = 0, pos;
    while ((pos = n.indexOf(palavra, de)) >= 0) {
      const antes = pos > 0 ? n[pos - 1] : ' ', depois = n[pos + palavra.length] || ' ';
      if (!/[a-z]/.test(antes) && !/[a-z]/.test(depois)) return f.slice(0, pos) + '____' + f.slice(pos + palavra.length);
      de = pos + 1;
    }
    return '';
  }
  function mascararTudo(f, palavra) { // esconde TODAS as ocorrências; '' se a palavra nem aparece
    let out = mascarar(f, palavra);
    if (!out) return '';
    for (let k = 0; k < 6; k++) { const m = mascarar(out, palavra); if (!m) break; out = m; }
    return out;
  }
  const palavraDe = termo => semAcento(termo.e || termo.p).toLowerCase();
  const soLetras = x => semAcento(x).toLowerCase().replace(/[-\s]/g, '');
  function fraseComTermo(t, termo) {
    const palavra = palavraDe(termo), alvo = palavra.replace(/[-\s]/g, '');
    if (alvo.length < 3) return '';
    const cand = [];
    for (const txt of textosDoTema(t)) {
      for (const f of String(txt).normalize('NFC').split(/(?<=[.!?])\s+/)) {
        if (f.length < 20 || f.length > 170) continue;
        const m = mascararTudo(f, palavra);
        if (m) cand.push(m);
      }
    }
    const boas = cand.filter(x => !soLetras(x).includes(alvo)); // sem a palavra aparecendo de outro jeito
    boas.sort((a, b) => a.length - b.length);
    return boas[0] || '';
  }
  /* "Revisãozinha": até 3 trechos do tema sobre o termo (cartas e explicações), com a palavra escondida. */
  function revisaoComTermo(t, termo, excluir) {
    const palavra = palavraDe(termo), alvo = palavra.replace(/[-\s]/g, '');
    if (alvo.length < 3) return [];
    const pecas = [];
    for (const c of (t && t.cards) || []) pecas.push(String(c[0]) + ' ' + String(c[1]));
    for (const l of (t && t.licoes) || []) for (const q of (l.qs || [])) if (q.w) pecas.push(String(q.w));
    const vistos = new Set(excluir ? [excluir] : []), out = [];
    for (const x of pecas) {
      const m = mascararTudo(String(x).normalize('NFC'), palavra);
      if (!m || m.length > 220 || vistos.has(m) || soLetras(m).includes(alvo)) continue;
      vistos.add(m); out.push(m);
    }
    out.sort((a, b) => a.length - b.length);
    return out.slice(0, 3);
  }
  /* Pede dica, na ordem: 1 frase do tema, 2 uma letra, 3 revisãozinha. O que não existir pro termo é pulado. */
  function pedirDica(r, t, rnd) {
    rnd = rnd || Math.random;
    const usados = r.tipos || [];
    if (r.acertou || r.perdeu || usados.length >= MAX_DICAS) return { rodada: r, tipo: 'nada' };
    for (const tipo of ['frase', 'letra', 'revisao']) {
      if (usados.includes(tipo)) continue;
      const base = { tipos: usados.concat(tipo), dicas: usados.length + 1 };
      if (tipo === 'frase') {
        const f = fraseComTermo(t, r.termo);
        if (f) return { rodada: Object.assign({}, r, base, { frase: f }), tipo };
      } else if (tipo === 'letra') {
        const faltam = Array.from(new Set(r.termo.p.split(''))).filter(ch => !r.usadas.includes(ch));
        if (faltam.length > 1) { // não entrega a última letra
          const L = faltam[Math.floor(rnd() * faltam.length)], novas = r.usadas.concat(L);
          return { rodada: Object.assign({}, r, base, { usadas: novas, acertou: todasReveladas(r.termo.p, novas) }), tipo, letra: L };
        }
      } else {
        const rv = revisaoComTermo(t, r.termo, r.frase);
        if (rv.length) return { rodada: Object.assign({}, r, base, { revisao: rv }), tipo };
      }
    }
    return { rodada: r, tipo: 'nada' };
  }
  const pontosPartida = rs => rs.reduce((s, r) => s + pontosRodada(r), 0);
  const contarSalvos = rs => rs.filter(r => r.acertou).length;
  function acentuar(p, e) { // letras com acento pras caixas, se "e" bater letra a letra com "p"; senão as letras de "p"
    const cheio = Array.from(String(e == null ? '' : e).normalize('NFC').toUpperCase());
    return cheio.length === p.length && semAcento(cheio.join('')) === p ? cheio : p.split('');
  }
  function caixas(r, fim) { // uma caixa por letra: ch (o que aparece) e estado: on (revelada), falta (só no fim), '' (escondida)
    const letras = acentuar(r.termo.p, r.termo.e);
    return r.termo.p.split('').map((ch, k) => {
      const on = r.usadas.includes(ch);
      return { ch: on || fim ? letras[k] : '', estado: on ? 'on' : fim ? 'falta' : '' };
    });
  }
  function mensagemFim(rs) {
    const n = contarSalvos(rs), pontos = pontosPartida(rs);
    const msg = n === 0 ? 'Nenhum dente salvo dessa vez' : n === rs.length ? 'Salvou todos os dentes' : 'Salvou ' + n + ' de ' + rs.length + ' dentes';
    return { ganhou: n > 0, pontos, salvos: n, msg };
  }

  /* ===== DESENHO DO DENTE (SVG) ===== */
  const DENTE_PATH = 'M60 20C50 20 44 14 32 14C18 14 12 26 12 40C12 54 20 62 24 76C28 90 28 108 36 110C44 112 46 90 50 80C54 70 66 70 70 80C74 90 76 112 84 110C92 108 92 90 96 76C100 62 108 54 108 40C108 26 102 14 88 14C76 14 70 20 60 20Z';
  const MANCHAS = [[42, 34, 7, 'marrom'], [80, 28, 6, 'cinza'], [60, 52, 8, 'marrom'], [28, 50, 5, 'cinza'], [92, 54, 6, 'marrom'], [37, 90, 5, 'cinza']];
  const BRILHOS = [[16, 22], [106, 16], [110, 80], [10, 86]];
  const ESTRELA = 'M0-9L2.2-2.2 9 0 2.2 2.2 0 9-2.2 2.2-9 0-2.2-2.2Z';
  const RACHA = 'M60 19L53 34 64 48 55 62 58 70';

  if (typeof window !== 'undefined') {
    const c = n => ID + '-' + n;
    const CSS = `
.X-wrap{display:flex;flex-direction:column;gap:12px;min-width:0}
.X-top{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:center}
.X-top .stat{font-size:13.5px;padding:4px 10px}
.X-errou{color:var(--gum-d);border-color:var(--gum)}
.X-minis{display:flex;gap:4px;align-items:center;margin-right:2px}
.X-mini{display:inline-block;width:26px;height:26px;color:var(--line);flex:none}
.X-mini svg{width:100%;height:100%;display:block}
.X-mini.X-atual{color:var(--sun)}.X-mini.X-ok{color:var(--mint)}.X-mini.X-bad{color:var(--muted)}
.X-dente{display:flex;justify-content:center;padding:2px 0}
.X-svg{width:150px;max-width:44vw;height:auto;overflow:visible}
.X-corpo{fill:var(--surface);stroke:var(--ink);stroke-width:4;stroke-linejoin:round;transition:fill .3s}
.X-perdido .X-corpo{fill:var(--muted)}
.X-mancha{opacity:0;transition:opacity .25s}
.X-mancha.X-on{opacity:1}
.X-mancha.X-marrom{fill:var(--sun-d)}.X-mancha.X-cinza{fill:var(--muted)}
.X-perdido .X-mancha.X-on{fill:var(--ink);opacity:.5}
.X-racha{fill:none;stroke:var(--ink);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round;display:none}
.X-perdido .X-racha{display:inline}
.X-brilho{fill:var(--sun);display:none;transform-box:fill-box;transform-origin:center}
.X-salvo .X-brilho{display:inline;animation:X-brilha .7s ease-out both}
.X-salvo .X-b1{animation-delay:.1s}.X-salvo .X-b2{animation-delay:.2s}.X-salvo .X-b3{animation-delay:.3s}
.X-tremor{animation:X-treme .35s}
@keyframes X-treme{25%{transform:translateX(-7px) rotate(-3deg)}75%{transform:translateX(7px) rotate(3deg)}}
@keyframes X-brilha{0%{transform:scale(0);opacity:0}60%{transform:scale(1.3);opacity:1}100%{transform:scale(1);opacity:1}}
.X-estado{text-align:center;font-family:var(--f-display);font-weight:600;font-size:21px;min-height:28px;line-height:1.3}
.X-estado.X-ok{color:var(--mint-d)}.X-estado.X-bad{color:var(--gum-d)}
.X-dica{padding:12px 14px;gap:4px;text-align:center;align-items:center}
.X-dica-txt{font-family:var(--f-display);font-weight:500;font-size:19px;line-height:1.25;text-wrap:balance;overflow-wrap:anywhere}
.X-frase{margin-top:6px;padding-top:8px;border-top:2px dashed var(--line);font-size:16px;font-weight:600;color:var(--ink);overflow-wrap:anywhere}
.X-frase small{display:block;color:var(--muted);font-size:12px;letter-spacing:.06em;text-transform:uppercase;font-weight:800;margin-bottom:2px}
.X-pedir{display:flex;justify-content:center}
.X-pedir .btn{min-width:min(100%,260px)}
.X-palavra{display:flex;flex-wrap:wrap;justify-content:center;gap:4px;--n:14}
.X-letra{width:clamp(19px,calc((100vw - 32px - (var(--n) - 1)*4px)/var(--n)),34px);height:40px;border:2px solid var(--line);border-bottom-width:4px;border-radius:8px;background:var(--surface);display:grid;place-items:center;font-family:var(--f-display);font-weight:700;font-size:clamp(14px,4.6vw,20px);color:var(--ink);line-height:1}
.X-letra.X-on{border-color:var(--mint);background:var(--ok-bg)}
.X-letra.X-falta{border-color:var(--gum);background:var(--bad-bg);color:var(--gum-d)}
.X-extenso{text-align:center;color:var(--muted);font-weight:700;min-height:22px;font-size:14.5px}
.X-teclado{display:flex;flex-wrap:wrap;justify-content:center;gap:6px}
.X-tecla{flex:0 0 calc((100% - 36px)/7);min-height:44px;border:2px solid var(--line);border-radius:12px;background:var(--surface);box-shadow:0 3px 0 var(--line);font-family:var(--f-display);font-weight:600;font-size:19px;color:var(--ink);padding:0;transition:transform .08s,box-shadow .08s}
.X-tecla:active{transform:translateY(2px);box-shadow:0 1px 0 var(--line)}
.X-tecla[disabled]{opacity:.35;pointer-events:none;box-shadow:none;transform:translateY(2px)}
.X-tecla.X-ok{border-color:var(--mint);background:var(--ok-bg);color:var(--mint-d);opacity:.85}
.X-tecla.X-bad{border-color:var(--gum);background:var(--bad-bg);color:var(--gum-d);opacity:.6}
.X-acoes{display:flex;justify-content:center}
.X-acoes .btn{min-width:min(100%,260px)}
.X-fim{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;padding-top:12px}
.X-fim h2{font-size:28px}
.X-big{font-family:var(--f-display);font-size:54px;font-weight:700;line-height:1}
.X-sub{color:var(--muted);font-weight:700}
.X-lista{width:100%;display:flex;flex-direction:column;gap:8px}
.X-item{display:flex;align-items:center;gap:10px;background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:10px 12px;text-align:left;min-width:0}
.X-item-txt{flex:1;min-width:0}
.X-item b{font-family:var(--f-display);font-weight:600;font-size:17px;overflow-wrap:anywhere}
.X-item small{display:block;color:var(--muted);font-size:13px}
.X-pts{font-family:var(--f-display);font-weight:700;font-size:20px;font-variant-numeric:tabular-nums}
.X-botoes{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;margin-top:4px}
@media (prefers-reduced-motion:reduce){.X-tremor,.X-salvo .X-brilho{animation:none}.X-mancha,.X-corpo,.X-tecla{transition:none}}
`.replace(/X-/g, ID + '-');

    function injetarCss() {
      if (document.getElementById('css-' + ID)) return;
      const s = document.createElement('style'); s.id = 'css-' + ID; s.textContent = CSS; document.head.appendChild(s);
    }
    const miniDente = () => `<svg viewBox="0 0 120 122" aria-hidden="true"><path d="${DENTE_PATH}" fill="currentColor"/></svg>`;
    function svgDente(r, efeito) {
      const cls = [c('svg'), r.perdeu ? c('perdido') : '', r.acertou ? c('salvo') : '', efeito === 'erro' ? c('tremor') : ''].join(' ');
      return `<svg class="${cls}" viewBox="0 0 120 122" aria-hidden="true"><path class="${c('corpo')}" d="${DENTE_PATH}"/>` +
        MANCHAS.map((m, k) => `<circle class="${c('mancha')} ${c(m[3])} ${r.erros > k ? c('on') : ''}" cx="${m[0]}" cy="${m[1]}" r="${m[2]}"/>`).join('') +
        `<path class="${c('racha')}" d="${RACHA}"/>` +
        BRILHOS.map((b, k) => `<g transform="translate(${b[0]} ${b[1]})"><path class="${c('brilho')} ${c('b' + k)}" d="${ESTRELA}"/></g>`).join('') +
        '</svg>';
    }

    const jogo = {
      id: ID,
      nome: 'Salve o dente',
      desc: 'Forca com dica. Cada letra errada abre uma cárie no dente e dá pra pedir mais dicas, que custam pontos.',
      icone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M12 4C10 4 8.8 2.8 6.4 2.8C3.6 2.8 2.4 5.2 2.4 8C2.4 10.8 4 12.4 4.8 15.2C5.6 18 5.6 21.6 7.2 22C8.8 22.4 9.2 18 10 16C10.8 14 13.2 14 14 16C14.8 18 15.2 22.4 16.8 22C18.4 21.6 18.4 18 19.2 15.2C20 12.4 21.6 10.8 21.6 8C21.6 5.2 20.4 2.8 17.6 2.8C15.2 2.8 14 4 12 4Z"/><circle cx="9" cy="8.2" r="1.4" fill="currentColor" stroke="none"/><circle cx="15.2" cy="10.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
      disponivel(t) { return temaServe(t); },
      montar(el, t, api) {
        injetarCss();
        const termos = termosValidos(t);
        if (termos.length < RODADAS) {
          el.innerHTML = `<div class="card"><p>Esse tema ainda não tem termos suficientes pra esse jogo.</p><button type="button" class="btn ghost full">Voltar</button></div>`;
          el.querySelector('button').onclick = () => api.voltar();
          return;
        }
        const st = { rodadas: sortearTermos(termos, RODADAS).map(novaRodada), i: 0, encerrada: false };

        function limpar() { document.removeEventListener('keydown', onKey); }
        function onKey(ev) { // teclado físico, quando houver
          if (!el.isConnected) { limpar(); return; }
          if (ev.ctrlKey || ev.metaKey || ev.altKey || typeof ev.key !== 'string') return;
          const alvo = ev.target && ev.target.tagName;
          if (alvo === 'INPUT' || alvo === 'TEXTAREA' || (ev.target && ev.target.isContentEditable)) return;
          if (ev.key === 'Enter' && alvo !== 'BUTTON') { // rodada terminada: Enter passa pro próximo dente
            const r = st.rodadas[st.i];
            if (!st.encerrada && (r.acertou || r.perdeu)) { ev.preventDefault(); avancar(); }
            return;
          }
          if (ev.key.length !== 1) return;
          const L = semAcento(ev.key).toUpperCase();
          if (!/^[A-Z]$/.test(L)) return;
          ev.preventDefault();
          chute(L);
        }
        function chute(L) {
          if (st.encerrada) return;
          const res = chutar(st.rodadas[st.i], L);
          if (res.efeito !== 'acerto' && res.efeito !== 'erro') return;
          st.rodadas[st.i] = res.rodada;
          desenhar(res.efeito);
          window.Sons && Sons.tocar(res.rodada.acertou ? 'acerto_jogo' : res.rodada.perdeu ? 'gameover' : res.efeito === 'acerto' ? 'moeda' : 'erro_jogo');
        }
        function dica() {
          if (st.encerrada) return;
          const res = pedirDica(st.rodadas[st.i], t);
          if (res.tipo === 'nada') { api.toast('Sem mais dicas nesse dente'); return; }
          st.rodadas[st.i] = res.rodada;
          desenhar();
          api.toast((res.tipo === 'letra' ? 'Letra ' + res.letra + ' revelada' : res.tipo === 'revisao' ? 'Revisãozinha do tema' : 'Dica no material do tema') + ', -' + CUSTO_DICA + ' pontos');
          window.Sons && Sons.tocar('powerup');
        }
        function avancar() { if (st.i < RODADAS - 1) { st.i++; desenhar(); window.scrollTo(0, 0); } else encerrar(); }
        function encerrar() {
          if (st.encerrada) return;
          st.encerrada = true; limpar();
          const f = mensagemFim(st.rodadas);
          if (f.ganhou) api.ganhou(f.pontos, f.msg); else api.perdeu(f.msg);
          if (f.ganhou) window.Sons && Sons.tocar('vitoria_jogo');
          desenharFim(f);
        }
        function minis(fimRodada) {
          return `<span class="${c('minis')}" aria-label="Dentes da partida">${st.rodadas.map((r, k) => {
            let s = '';
            if (k < st.i || (k === st.i && fimRodada)) s = r.acertou ? c('ok') : c('bad'); else if (k === st.i) s = c('atual');
            return `<span class="${c('mini')} ${s}">${miniDente()}</span>`;
          }).join('')}</span>`;
        }
        function desenhar(efeito) {
          const r = st.rodadas[st.i], fimRodada = r.acertou || r.perdeu, ultima = st.i === RODADAS - 1;
          const pts = pontosPartida(st.rodadas), cx = caixas(r, fimRodada);
          el.innerHTML = `<div class="${c('wrap')}">
<div class="${c('top')}">${minis(fimRodada)}<span class="stat">Dente ${st.i + 1} de ${RODADAS}</span><span class="stat">${pts} ${pts === 1 ? 'ponto' : 'pontos'}</span><span class="stat ${r.erros ? c('errou') : ''}">Erros ${r.erros} de ${MAX_ERROS}</span></div>
<div class="${c('dente')}">${svgDente(r, efeito)}</div>
<div class="${c('estado')} ${r.acertou ? c('ok') : r.perdeu ? c('bad') : ''}" role="status">${r.acertou ? 'Dente salvo' : r.perdeu ? 'Perdeu esse dente' : ''}</div>
<div class="card ${c('dica')}"><span class="tag">Dica</span><div class="${c('dica-txt')}">${api.esc(r.termo.d)}</div>${r.frase ? `<div class="${c('frase')}"><small>No material do tema</small>${api.esc(r.frase)}</div>` : ''}${r.revisao && r.revisao.length ? `<div class="${c('frase')}"><small>Revisãozinha</small>${r.revisao.map(x => '<div>' + api.esc(x) + '</div>').join('')}</div>` : ''}</div>
<div class="${c('palavra')}" style="--n:${r.termo.p.length}" aria-label="Palavra com ${r.termo.p.length} letras">${cx.map(b => `<span class="${c('letra')} ${b.estado ? c(b.estado) : ''}">${api.esc(b.ch)}</span>`).join('')}</div>
${!fimRodada && (r.dicas || 0) < MAX_DICAS ? `<div class="${c('pedir')}"><button type="button" class="btn ghost sm ${c('btn-dica')}">Pedir dica (-${CUSTO_DICA} pontos)${r.dicas ? ' · ' + r.dicas + ' de ' + MAX_DICAS + ' usada' + (r.dicas > 1 ? 's' : '') : ''}</button></div>` : ''}
<div class="${c('extenso')}">${fimRodada ? api.esc(r.termo.e || r.termo.p.toLowerCase()) : r.termo.p.length + ' letras'}</div>
<div class="${c('teclado')}">${LETRAS.map(L => {
            const usada = r.usadas.includes(L), k = usada ? (r.termo.p.includes(L) ? c('ok') : c('bad')) : '';
            return `<button type="button" class="${c('tecla')} ${k}" data-l="${L}" ${usada || fimRodada ? 'disabled' : ''} aria-label="Letra ${L}">${L}</button>`;
          }).join('')}</div>
<div class="${c('acoes')}">${fimRodada ? `<button type="button" class="btn ${ultima ? 'vio' : ''} ${c('prox')}">${ultima ? 'Ver resultado' : 'Próximo dente'}</button>` : ''}</div>
</div>`;
          el.querySelectorAll('.' + c('tecla')).forEach(b => { b.onclick = () => chute(b.dataset.l); });
          const px = el.querySelector('.' + c('prox')); if (px) px.onclick = avancar;
          const pd = el.querySelector('.' + c('btn-dica')); if (pd) pd.onclick = dica;
        }
        function desenharFim(f) {
          const titulo = f.salvos === RODADAS ? 'Todos os dentes salvos' : f.ganhou ? 'Fim da partida' : 'Nenhum dente salvo';
          el.innerHTML = `<div class="${c('fim')}">
<h2>${titulo}</h2>
<div class="${c('big')}">${f.pontos}</div>
<p class="${c('sub')}">${f.pontos === 1 ? 'ponto' : 'pontos'} · ${f.salvos} de ${RODADAS} dentes salvos</p>
<div class="${c('lista')}">${st.rodadas.map(r => `<div class="${c('item')}"><span class="${c('mini')} ${r.acertou ? c('ok') : c('bad')}">${miniDente()}</span><span class="${c('item-txt')}"><b>${api.esc(r.termo.e || r.termo.p.toLowerCase())}</b><small>${api.esc(r.termo.d)}</small></span><span class="${c('pts')}">${pontosRodada(r)}</span></div>`).join('')}</div>
<div class="${c('botoes')}"><button type="button" class="btn ${c('denovo')}">Jogar de novo</button><button type="button" class="btn ghost ${c('voltar')}">Voltar</button></div>
</div>`;
          el.querySelector('.' + c('denovo')).onclick = () => { limpar(); jogo.montar(el, t, api); };
          el.querySelector('.' + c('voltar')).onclick = () => { limpar(); api.voltar(); };
          window.scrollTo(0, 0);
        }

        document.addEventListener('keydown', onKey);
        desenhar();
      }
    };
    window.JOGOS = window.JOGOS || [];
    window.JOGOS.push(jogo);
  }

  if (typeof module !== 'undefined') {
    module.exports = { ID, RODADAS, MAX_ERROS, MIN_TERMOS, semAcento, termoValido, termosValidos, temaServe, embaralhar, sortearTermos, novaRodada, todasReveladas, chutar, pedirDica, fraseComTermo, MAX_DICAS, CUSTO_DICA, pontosRodada, pontosPartida, contarSalvos, acentuar, caixas, mensagemFim };
  }
})();
