/* SISÃO: motor de animação do mascote do Show do Sisão (Jonatas, 11/11/2026; skill animacao-personagem).
   Duas roupas, mesmos quadros e reações:
     - "cartum" (visual Normal, o principal): um SVG meio 3D por quadro (cartum/<quadro>.svg), empilhados e pré-carregados
     - "pixel"  (quando o body tem a classe tema-pixel): folha de sprites 64x80 (pixel/sisao-sheet.png)
   Os dois saem de v3/quadros_v3.py (Sisão v3: coroa do siso como cabeça, corpo em V, raízes como pés).
   Troca sozinho quando a classe tema-pixel entra/sai do body.
   Uso: const s = Sisao.criar(elemento, { base: 'games/sisao/', escala: 4, visual: 'auto'|'cartum'|'pixel' });
        s.pose('neutro'|'apresentando'|'pensando'|'suspense'|'acerto'|'erro'|'comemorando'|'milhao'|'perdeu'|'tchau');
        s.reacao(nome, {ficar, depois}); s.falar(true|false); s.falarAudio(audio); s.destruir();
   Idle: respira e pisca a cada 3-5 s. Fala: boca troca ~9 quadros/s só enquanto o áudio toca.
   prefers-reduced-motion: sem respirar nem pular, só a troca de pose. Sem biblioteca. */
(function () {
  'use strict';
  const QUADROS = ['neutro', 'piscar', 'falar-a', 'falar-b', 'falar-c', 'apresentando', 'pensando', 'suspense', 'suspense-b', 'acerto', 'erro',
    'comemorando-a', 'comemorando-b', 'milhao-a', 'milhao-b', 'perdeu-a', 'perdeu-b', 'tchau-a', 'tchau-b'];
  const W = 64, H = 80;
  const POSES = {
    neutro: [['neutro'], 0], apresentando: [['apresentando'], 0], pensando: [['pensando'], 0],
    suspense: [['suspense', 'suspense-b'], 2.5], acerto: [['acerto'], 0], erro: [['erro'], 0],
    comemorando: [['comemorando-a', 'comemorando-b'], 6], milhao: [['milhao-a', 'milhao-b'], 7],
    perdeu: [['perdeu-a', 'perdeu-b'], 4], tchau: [['tchau-a', 'tchau-b'], 5]
  };
  const FALA_OK = ['neutro', 'apresentando'];
  const CSS = `
.sx{position:relative;display:inline-block;flex:none}
.sx-pulo{position:absolute;left:0;bottom:0;width:100%;height:100%;transform-origin:50% 92%;will-change:transform}
.sx-rp,.sx-rc{position:absolute;inset:0;will-change:transform;transform-origin:50% 92%}
.sx-rp{background-repeat:no-repeat;image-rendering:pixelated;image-rendering:crisp-edges}
.sx-rc img{position:absolute;inset:0;width:100%;height:100%;display:none}.sx-rc img.sx-on{display:block}
.sx-sombra{position:absolute;left:28%;right:28%;bottom:calc(var(--u) * 13.5);height:calc(var(--u) * 3);border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,25,.5),rgba(0,0,25,0))}
.sx.sx-pix .sx-sombra{background:rgba(0,0,25,.35)}
.sx.sx-vivo .sx-rp{animation:sx-resp-p 1.8s infinite}
.sx.sx-vivo .sx-rc{animation:sx-resp-c 2s ease-in-out infinite}
@keyframes sx-resp-p{0%,44%{transform:translateY(0)}50%,94%{transform:translateY(calc(var(--u) * -1))}100%{transform:translateY(0)}}
@keyframes sx-resp-c{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(calc(var(--u) * -1.2)) scale(.99,1.02)}}
@media (prefers-reduced-motion:reduce){.sx.sx-vivo .sx-rp,.sx.sx-vivo .sx-rc{animation:none}}`;
  function css() { if (!document.getElementById('css-sisao')) { const s = document.createElement('style'); s.id = 'css-sisao'; s.textContent = CSS; document.head.appendChild(s); } }
  let nInst = 0;

  function criar(alvo, op) {
    css(); op = op || {};
    let esc = op.escala || 4, u = esc; const base = op.base || '', versao = op.versao || 3;
    const reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const raiz = document.createElement('div'); raiz.className = 'sx sx-vivo'; raiz.setAttribute('aria-hidden', 'true');
    const sombra = document.createElement('div'); sombra.className = 'sx-sombra';
    const pulo = document.createElement('div'); pulo.className = 'sx-pulo';
    // roupa pixel
    const rp = document.createElement('div'); rp.className = 'sx-rp';
    rp.style.backgroundImage = `url(${base}pixel/sisao-sheet.png?v=${versao})`;
    // roupa cartum: um <img> por quadro (troca sem piscar: todos já carregados)
    const rc = document.createElement('div'); rc.className = 'sx-rc';
    const imgs = {};
    QUADROS.forEach(n => { const im = document.createElement('img'); im.alt = ''; im.decoding = 'async'; im.src = `${base}cartum/${n}.svg?v=${versao}`; rc.appendChild(im); imgs[n] = im; });
    function medidas(e) {
      raiz.style.width = W * e + 'px'; raiz.style.height = H * e + 'px'; raiz.style.setProperty('--u', e + 'px');
      rp.style.backgroundSize = `${QUADROS.length * W * e}px ${H * e}px`; esc = u = e; if (quadroAtual) mostra(quadroAtual);
    }
    pulo.appendChild(rp); pulo.appendChild(rc); raiz.appendChild(sombra); raiz.appendChild(pulo);
    let quadroAtual = '';
    medidas(esc);
    if (alvo) alvo.appendChild(raiz);

    let visual = 'cartum';
    function escolheVisual() {
      const pedido = op.visual && op.visual !== 'auto' ? op.visual : (document.body && document.body.classList.contains('tema-pixel') ? 'pixel' : 'cartum');
      visual = pedido;
      rp.style.display = visual === 'pixel' ? '' : 'none'; rc.style.display = visual === 'cartum' ? '' : 'none';
      raiz.classList.toggle('sx-pix', visual === 'pixel');
    }
    escolheVisual();
    let obs = null;
    if ((!op.visual || op.visual === 'auto') && window.MutationObserver && document.body) { obs = new MutationObserver(escolheVisual); obs.observe(document.body, { attributes: true, attributeFilter: ['class'] }); }

    function mostra(n) {
      quadroAtual = n;
      const i = QUADROS.indexOf(n); if (i >= 0) rp.style.backgroundPosition = `${-i * W * esc}px 0`;
      QUADROS.forEach(k => imgs[k].classList.toggle('sx-on', k === n));
    }
    let poseAtual = 'neutro', laco = null, falando = false, boca = null, pisca = null, volta = null, anims = [];
    function pinta() {
      if (laco) { clearInterval(laco); laco = null; }
      if (falando && FALA_OK.includes(poseAtual)) return;
      const [lista, fps] = POSES[poseAtual] || POSES.neutro; let k = 0; mostra(lista[0]);
      if (fps && lista.length > 1) laco = setInterval(() => { k = (k + 1) % lista.length; mostra(lista[k]); }, 1000 / fps);
    }
    function agendaPiscar() {
      clearTimeout(pisca);
      pisca = setTimeout(() => {
        if (poseAtual === 'neutro' && !falando) { mostra('piscar'); setTimeout(() => { if (poseAtual === 'neutro' && !falando) mostra('neutro'); }, 120); }
        agendaPiscar();
      }, 3000 + Math.random() * 2000);
    }
    function pose(n) { if (!POSES[n]) return; clearTimeout(volta); poseAtual = n; if (falando) falar(true); else pinta(); }
    function falar(sim) {
      falando = !!sim; clearInterval(boca); boca = null;
      if (falando && FALA_OK.includes(poseAtual)) {
        if (laco) { clearInterval(laco); laco = null; }
        const seq = ['falar-a', 'falar-b', 'falar-c', 'falar-b', 'falar-a', 'falar-c']; let k = 0;
        mostra(seq[0]); boca = setInterval(() => { k = (k + 1) % seq.length; mostra(seq[k]); }, 110);
      } else pinta();
    }
    function falarAudio(a) { a.addEventListener('playing', () => falar(true)); ['ended', 'pause', 'error'].forEach(ev => a.addEventListener(ev, () => falar(false))); }
    const anima = (el, q, dur, easing) => { if (reduz) return null; const x = el.animate(q, { duration: dur, easing: easing || 'ease-out' }); anims.push(x); return x; };
    function pararAnims() { anims.forEach(a => { try { a.cancel(); } catch (e) { } }); anims = []; }
    const px = n => n * u + 'px';
    function pulinho(alto, vezes) { // antecipação (agacha), sobe esticando, desce, achata ao cair
      const um = [
        { transform: 'translateY(0) scale(1,1)', offset: 0 },
        { transform: 'translateY(0) scale(1.08,.86)', offset: .16, easing: 'ease-out' },
        { transform: `translateY(${px(-alto)}) scale(.94,1.08)`, offset: .5, easing: 'ease-in' },
        { transform: 'translateY(0) scale(1.08,.9)', offset: .82, easing: 'ease-out' },
        { transform: 'translateY(0) scale(1,1)', offset: 1 }];
      const s = [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.1)', opacity: 1, offset: .16 }, { transform: 'scale(.55)', opacity: .5, offset: .5 }, { transform: 'scale(1.1)', opacity: 1, offset: .82 }, { transform: 'scale(1)', opacity: 1 }];
      const a = anima(pulo, um, 620, 'linear'); anima(sombra, s, 620, 'linear');
      if (a && vezes > 1) a.onfinish = () => pulinho(alto * 0.75, vezes - 1);
    }
    function reacao(n, op2) {
      op2 = op2 || {}; pararAnims(); clearTimeout(volta);
      n = ({ comemorar: 'comemorando', perdeu_tudo: 'perdeu', 'perdeu-tudo': 'perdeu' })[n] || n;
      pose(n); let dur = 1400;
      if (n === 'acerto') { anima(pulo, [{ transform: 'translateY(0)' }, { transform: `translateY(${px(-4)})`, offset: .4 }, { transform: 'translateY(0)' }], 380); dur = 1300; }
      else if (n === 'erro') { anima(pulo, [{ transform: 'translate(0,0) scale(1)' }, { transform: `translate(${px(-1)},0) scale(.94)`, offset: .2 }, { transform: `translate(${px(1)},0) scale(.94)`, offset: .4 }, { transform: `translate(${px(-1)},0) scale(.94)`, offset: .6 }, { transform: `translate(${px(1)},0) scale(.95)`, offset: .8 }, { transform: 'translate(0,0) scale(1)' }], 560, 'linear'); dur = 1500; }
      else if (n === 'comemorando') { pulinho(14, 2); dur = 1900; }
      else if (n === 'milhao') { pulinho(18, 3); dur = 2600; }
      else if (n === 'perdeu') { const a = anima(pulo, [{ transform: 'translateY(0) scale(1,1)' }, { transform: `translateY(${px(2)}) scale(1.03,.94)` }], 500, 'ease-in'); if (a) a.effect.updateTiming({ fill: 'forwards' }); dur = 2600; }
      else if (n === 'tchau') dur = 1600;
      else if (n === 'apresentando') { anima(pulo, [{ transform: 'translateY(0)' }, { transform: `translateY(${px(-2)})`, offset: .4 }, { transform: 'translateY(0)' }], 360); }
      else if (n === 'suspense' || n === 'pensando') { anima(pulo, [{ transform: 'translateY(0)' }, { transform: `translateY(${px(1)})`, offset: .5 }, { transform: 'translateY(0)' }], 300); dur = 0; }
      if (dur && !op2.ficar) volta = setTimeout(() => { pararAnims(); pose(op2.depois || 'neutro'); }, dur);
    }
    function destruir() { clearInterval(laco); clearInterval(boca); clearTimeout(pisca); clearTimeout(volta); pararAnims(); if (obs) obs.disconnect(); raiz.remove(); }
    new Image().src = `${base}pixel/sisao-sheet.png?v=${versao}`;
    pose(op.pose || 'neutro'); agendaPiscar();
    return { el: raiz, pose, reacao, falar, falarAudio, destruir, trocarVisual: v => { op.visual = v; escolheVisual(); }, escala: medidas, get poseAtual() { return poseAtual; }, get visual() { return visual; } };
  }
  window.Sisao = { criar, QUADROS, POSES };
})();
