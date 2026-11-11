/* sons.js — base de sons nostálgicos da turma (anos 90: videogame e auditório de TV).
   Tudo SINTETIZADO na hora com a Web Audio API: nenhum arquivo de áudio, nenhuma voz.
   Motivos originais, só com o "clima" da época. Sem Web Audio ou com erro = silêncio.
   Uso: Sons.tocar('clique'), Sons.parar(), Sons.mudo(), Sons.alternarMudo(), Sons.volume(v),
        Sons.lista(), Sons.bordao('acerto'), Sons.disponivel().
   Opcional: Sons.tocar('aplausos', 'curto'), Sons.tocar('contagem', '3'|'2'|'1'|'ja'|'tique'),
             Sons.tocar('acerto_tv', { ganho: 0.6 }). */
(function () {
  'use strict';

  var AC = null;
  try { AC = window.AudioContext || window.webkitAudioContext || null; } catch (e) { AC = null; }

  var ac = null, mestre = null, ruido = null, falhou = false, avisou = false;
  var vol = 0.5, mudoAtual = false, ultimoClique = -1, fontes = 0;
  var houveGesto = false; /* o contexto de áudio só nasce depois do primeiro toque/tecla do aluno */
  var ativos = [];

  try {
    var m0 = localStorage.getItem('sons-mudo');
    if (m0 !== null) mudoAtual = m0 === '1';
    var v0 = localStorage.getItem('sons-volume');
    if (v0 !== null && v0 !== '' && !isNaN(+v0)) vol = Math.min(1, Math.max(0, +v0));
  } catch (e) { /* sem localStorage: começa com som e não lembra */ }

  function salvar() {
    try { localStorage.setItem('sons-mudo', mudoAtual ? '1' : '0'); localStorage.setItem('sons-volume', String(vol)); } catch (e) {}
  }
  function aviso(e) { if (!avisou) { avisou = true; try { console.warn('Sons: áudio indisponível, seguindo em silêncio.', e); } catch (x) {} } }
  function ganhoMestre() { return mudoAtual ? 0 : vol * 0.7; } /* volume 0,5 = mestre 0,35 */

  function iniciar() {
    if (ac) return true;
    if (falhou || !AC) { falhou = true; return false; }
    try {
      ac = new AC();
      var comp = ac.createDynamicsCompressor();
      comp.threshold.value = -12; comp.knee.value = 8; comp.ratio.value = 4;
      comp.attack.value = 0.003; comp.release.value = 0.2;
      comp.connect(ac.destination);
      mestre = ac.createGain();
      mestre.gain.value = ganhoMestre();
      mestre.connect(comp);
      var len = Math.floor(ac.sampleRate * 2);
      ruido = ac.createBuffer(1, len, ac.sampleRate);
      var d = ruido.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return true;
    } catch (e) { falhou = true; ac = null; aviso(e); return false; }
  }

  /* ---------- peças básicas ---------- */
  var busAtual = null;
  function conta(n) {
    fontes++;
    var b = busAtual; if (b) b.fontes.push(n);
    n.onended = function () { fontes--; try { n.disconnect(); } catch (e) {} if (b) { var i = b.fontes.indexOf(n); if (i >= 0) b.fontes.splice(i, 1); } };
  }
  function G(v, dest) { var g = ac.createGain(); g.gain.value = v; g.connect(dest); return g; }
  function F(tipo, f, q, dest) { var b = ac.createBiquadFilter(); b.type = tipo; b.frequency.value = f; if (q != null) b.Q.value = q; b.connect(dest); return b; }
  function O(tipo, f, t0, t1, dest) { var o = ac.createOscillator(); o.type = tipo; o.frequency.setValueAtTime(f, t0); o.connect(dest); o.start(t0); o.stop(t1); conta(o); return o; }
  function N(t0, dur, dest) { var s = ac.createBufferSource(); s.buffer = ruido; s.loop = true; s.connect(dest); s.start(t0, Math.random() * 1.5); s.stop(t0 + dur + 0.02); conta(s); return s; }
  /* ataque linear e queda exponencial */
  function ad(p, t0, pico, atk, tf) { p.setValueAtTime(0.0001, t0); p.linearRampToValueAtTime(pico, t0 + atk); p.exponentialRampToValueAtTime(0.0001, Math.max(tf, t0 + atk + 0.002)); }
  /* ataque, sustenta até th, queda exponencial */
  function adh(p, t0, pico, atk, th, tf) { p.setValueAtTime(0.0001, t0); p.linearRampToValueAtTime(pico, t0 + atk); th = Math.max(th, t0 + atk + 0.001); p.setValueAtTime(pico, th); p.exponentialRampToValueAtTime(0.0001, Math.max(tf, th + 0.002)); }
  /* ataque, sustenta, corte linear entre tc0 e tc1 */
  function corte(p, t0, pico, atk, tc0, tc1) { p.setValueAtTime(0.0001, t0); p.linearRampToValueAtTime(pico, t0 + atk); tc0 = Math.max(tc0, t0 + atk + 0.001); p.setValueAtTime(pico, tc0); p.linearRampToValueAtTime(0.0001, Math.max(tc1, tc0 + 0.002)); }
  /* vibrato em cents nos osciladores */
  function vib(oscs, t0, rate, cents, tCheio, tFim) {
    var l = ac.createOscillator(); l.frequency.value = rate;
    var g = ac.createGain(); g.gain.value = 0; g.gain.setValueAtTime(0, t0);
    if (tCheio && tCheio > t0) g.gain.linearRampToValueAtTime(cents, tCheio); else g.gain.setValueAtTime(cents, t0);
    l.connect(g); oscs.forEach(function (o) { g.connect(o.detune); });
    l.start(t0); l.stop(tFim); conta(l);
  }
  /* LFO somado a um parâmetro (tremolo) */
  function lfo(t0, t1, rate, prof, param) { var l = ac.createOscillator(); l.frequency.value = rate; var g = ac.createGain(); g.gain.value = prof; l.connect(g); g.connect(param); l.start(t0); l.stop(t1); conta(l); }
  /* rajada de ruído filtrado */
  function rb(t0, tf, pico, dest, tipo, f, q) { var g = G(0, dest); var fl = F(tipo, f, q, g); ad(g.gain, t0, pico, Math.min(0.002, (tf - t0) / 3), tf); N(t0, tf - t0 + 0.01, fl); return g; }
  function passos(o, t0, lista, passo) { lista.forEach(function (f, i) { o.frequency.setValueAtTime(f, t0 + i * passo); }); }

  /* METAL: 2 dentes-de-serra desafinados + quadrada uma oitava abaixo, filtro que "abre" */
  function metal(f, t0, t1, pico, dest, o) {
    o = o || {};
    var rel = o.rel != null ? o.rel : 0.08, atk = o.atk || 0.018, sus = o.sus != null ? o.sus : 0.75, det = o.det != null ? o.det : 7;
    var g = G(0, dest), lp;
    if (o.fixo) lp = F('lowpass', o.fixo, o.q != null ? o.q : 0.7, g);
    else if (o.filtro) { lp = F('lowpass', 600, o.q != null ? o.q : 1, g); o.filtro(lp.frequency, f); }
    else {
      lp = F('lowpass', 1.5 * f, 1, g);
      var pf = lp.frequency, base = Math.min(3 * f, 3200);
      pf.setValueAtTime(1.5 * f, t0); pf.linearRampToValueAtTime(Math.min(6 * f, 5000), t0 + 0.035); pf.linearRampToValueAtTime(base, t0 + 0.2);
      if (o.abre) { pf.setValueAtTime(base, Math.max(o.abre[0], t0 + 0.21)); pf.linearRampToValueAtTime(Math.min(base * o.abre[2], 9000), o.abre[1]); }
    }
    var ts = t1 + rel + 0.03, oscs = [], dets = [-det, det];
    dets.forEach(function (d) { oscs.push(O('sawtooth', f, t0, ts, G(0.5, lp))); });
    if (!o.semSub) { oscs.push(O('square', f / 2, t0, ts, G(0.15, lp))); dets.push(0); }
    oscs.forEach(function (x, i) {
      if (o.semEntrada) x.detune.setValueAtTime(dets[i], t0);
      else { x.detune.setValueAtTime(dets[i] - 25, t0); x.detune.linearRampToValueAtTime(dets[i], t0 + 0.03); }
    });
    var p = g.gain, v = pico;
    p.setValueAtTime(0.0001, t0); p.linearRampToValueAtTime(pico, t0 + atk);
    if (o.desce) { p.setValueAtTime(pico, Math.max(o.desce[0], t0 + atk + 0.001)); v = pico * o.desce[1]; p.linearRampToValueAtTime(v, o.desce[2]); }
    else if (t1 - t0 > 0.12 && sus !== 1) { v = pico * sus; p.linearRampToValueAtTime(v, t0 + 0.1); }
    p.setValueAtTime(v, Math.max(t1, t0 + atk + 0.002)); p.exponentialRampToValueAtTime(0.0001, Math.max(t1, t0 + atk + 0.002) + rel);
    if (o.vib) vib(oscs, o.vib[0], o.vib[1], o.vib[2], o.vib[3], ts);
    return oscs;
  }
  /* SINO: parciais inarmônicos */
  var SR = [1, 2.76, 5.4, 8.93], SG = [1, 0.35, 0.15, 0.06], SD = [1, 0.45, 0.22, 0.12];
  function sino(f, t0, pico, dest, esc, n) {
    esc = esc || 1; n = n || 4;
    for (var i = 0; i < n; i++) { var fr = f * SR[i]; if (fr > 12000) break; var g = G(0, dest); var tf = t0 + SD[i] * esc; ad(g.gain, t0, pico * SG[i], 0.002, tf); O('sine', fr, t0, tf + 0.03, g); }
  }
  function marimba(f, t0, pico, dest, q) {
    q = q || 0.35;
    var g1 = G(0, dest); ad(g1.gain, t0, pico, 0.003, t0 + q); O('sine', f, t0, t0 + q + 0.03, g1);
    var g2 = G(0, dest); ad(g2.gain, t0, pico * 0.12, 0.003, t0 + 0.08); O('sine', f * 4, t0, t0 + 0.11, g2);
    var g3 = G(0, dest); ad(g3.gain, t0, pico * 0.25, 0.003, t0 + q); O('triangle', f, t0, t0 + q + 0.03, g3);
    rb(t0, t0 + 0.012, 0.2 * pico, dest, 'bandpass', 3000, 1);
  }
  function caixa(t0, pico, dest, q) {
    q = q || 0.07;
    var g = G(0, dest); var bp = F('bandpass', 2000, 0.9, g); var hp = F('highpass', 700, null, bp);
    ad(g.gain, t0, pico, 0.001, t0 + q); N(t0, q + 0.01, hp);
    var gc = G(0, dest); ad(gc.gain, t0, pico * 0.3, 0.001, t0 + 0.06);
    var o = O('triangle', 190, t0, t0 + 0.08, gc); o.frequency.exponentialRampToValueAtTime(150, t0 + 0.04);
  }
  function tom(f0, f1, t0, pico, dest, tq, queda) {
    var g = G(0, dest); ad(g.gain, t0, pico, 0.002, t0 + queda);
    var o = O('sine', f0, t0, t0 + queda + 0.03, g); o.frequency.exponentialRampToValueAtTime(f1, t0 + tq);
    rb(t0, t0 + 0.02, pico * 0.15, dest, 'lowpass', 600);
  }
  function pratoCadeia(dest) { var pk = ac.createBiquadFilter(); pk.type = 'peaking'; pk.frequency.value = 8500; pk.gain.value = 6; pk.Q.value = 0.7; pk.connect(dest); return F('highpass', 5500, null, pk); }
  function prato(t0, pico, dest, queda) { var g = G(0, dest); ad(g.gain, t0, pico, 0.003, t0 + queda); N(t0, queda + 0.02, pratoCadeia(g)); }
  function pandeiro(t0, pico, dest) {
    var g = G(0, dest); var bp = F('bandpass', 9500, 1.5, g); var hp = F('highpass', 6500, null, bp); var p = g.gain;
    p.setValueAtTime(0.0001, t0);
    for (var k = 0; k < 3; k++) { var t = t0 + k * 0.012; p.setValueAtTime(0.0001, t); p.linearRampToValueAtTime(pico, t + 0.001); p.exponentialRampToValueAtTime(pico * 0.25, t + 0.01); }
    p.exponentialRampToValueAtTime(0.0001, t0 + 0.084); N(t0, 0.09, hp);
  }
  function palma(t0, pico, dest, centro, q, pan) {
    var out = dest;
    if (pan != null && ac.createStereoPanner) { var sp = ac.createStereoPanner(); sp.pan.value = pan; sp.connect(dest); out = sp; }
    var g = G(0, out); var bp = F('bandpass', centro || (900 + Math.random() * 1500), q || (0.8 + Math.random() * 0.8), g); var p = g.gain;
    p.setValueAtTime(0.0001, t0);
    for (var k = 0; k < 3; k++) { var t = t0 + k * 0.008; p.linearRampToValueAtTime(pico, t + 0.001); p.linearRampToValueAtTime(pico * 0.3, t + 0.007); }
    var cauda = 0.05 + Math.random() * 0.06;
    p.exponentialRampToValueAtTime(0.0001, t0 + 0.016 + cauda); N(t0, 0.02 + cauda, bp);
  }
  /* palmas sorteadas no tempo seguindo uma taxa (palmas por segundo) */
  function palmas(t0, dur, taxa, taxaMax, pmin, pmax, dest) {
    var fator = 1;
    try { if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) fator = 0.7; } catch (e) {}
    var t = 0, n = 0;
    while (t < dur && n < 140) {
      var r = taxa(t) * fator;
      if (r < 0.5) { t += 0.05; continue; }
      t += (1 / r) * (0.4 + Math.random() * 1.2);
      if (t >= dur) break;
      var rel = Math.max(0.25, Math.min(1, taxa(t) / taxaMax));
      palma(t0 + t, (pmin + Math.random() * (pmax - pmin)) * rel, dest, null, null, -0.8 + Math.random() * 1.6);
      n++;
    }
  }
  function interp(pts) { return function (t) { for (var i = 1; i < pts.length; i++) { if (t <= pts[i][0]) { var a = pts[i - 1], b = pts[i]; return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); } } return pts[pts.length - 1][1]; }; }
  /* aplausos completos começando em t0, até durMax segundos */
  function aplausosEm(t0, d, durMax) {
    var gm = G(0, d); var p = gm.gain; var fim = Math.min(2.6, durMax);
    p.setValueAtTime(0.0001, t0); p.linearRampToValueAtTime(0.06, t0 + 0.25); p.setValueAtTime(0.06, t0 + Math.min(1.6, fim - 0.05)); p.exponentialRampToValueAtTime(0.0001, t0 + fim);
    var resp = G(0.8, gm); lfo(t0, t0 + fim, 3.1, 0.2, resp.gain);
    var lp = F('lowpass', 4000, null, resp); var hp = F('highpass', 500, null, lp); N(t0, fim, hp);
    palmas(t0, Math.min(2.5, durMax), interp([[0, 12], [0.4, 45], [1.5, 45], [2.5, 6]]), 45, 0.06, 0.2, d);
    if (durMax > 0.5) [0.45, 0.47, 0.49].forEach(function (x) { palma(t0 + x, 0.3, d, 1600, 1.2, 0.3); });
  }

  /* ---------- GRUPO JOGO (8 e 16 bits) ---------- */
  function clique(T, d) {
    var g = G(0, d); ad(g.gain, T, 0.6, 0.002, T + 0.045);
    var o = O('triangle', 1046.5, T, T + 0.05, g); o.frequency.exponentialRampToValueAtTime(587.33, T + 0.025); o.detune.value = Math.random() * 40 - 20;
    rb(T, T + 0.012, 0.25, d, 'bandpass', 1800, 2);
  }
  function moeda(T, d) {
    var trem = G(1, d); var g = G(0, trem); var lp = F('lowpass', 3200, 0.7, g);
    var o = O('square', 698.46, T, T + 0.45, lp); o.frequency.setValueAtTime(880, T + 0.035); o.frequency.setValueAtTime(1046.5, T + 0.07);
    adh(g.gain, T, 0.45, 0.003, T + 0.07, T + 0.42);
    var l = ac.createOscillator(); l.frequency.value = 14; var dg = G(0, trem.gain); dg.gain.setValueAtTime(0, T + 0.07); dg.gain.linearRampToValueAtTime(0.2, T + 0.09);
    l.connect(dg); l.start(T); l.stop(T + 0.45); conta(l);
    var g2 = G(0, d); ad(g2.gain, T + 0.07, 0.1, 0.003, T + 0.22); O('triangle', 2093, T + 0.07, T + 0.25, g2);
    rb(T, T + 0.02, 0.15, d, 'bandpass', 2200, 5);
  }
  function acertoJogo(T, d) {
    var lp = F('lowpass', 3000, 0.7, d);
    var g1 = G(0, lp); corte(g1.gain, T, 0.4, 0.003, T + 0.0035, T + 0.05); O('square', 349.23, T, T + 0.06, g1);
    var g2 = G(0, lp); adh(g2.gain, T + 0.055, 0.5, 0.004, T + 0.12, T + 0.32);
    var o = O('square', 698.46, T + 0.055, T + 0.35, g2);
    passos(o, T + 0.055, [698.46, 880, 1046.5, 880, 698.46, 880, 1046.5, 880, 698.46, 880, 1046.5, 880], 0.022);
    var g3 = G(0, d); ad(g3.gain, T + 0.055, 0.3, 0.005, T + 0.3); O('triangle', 174.61, T + 0.055, T + 0.33, g3);
  }
  function erroJogo(T, d) {
    function camada(tipo, f1, f2, pico, dest) {
      var g = G(0, dest), p = g.gain;
      p.setValueAtTime(0.0001, T); p.linearRampToValueAtTime(pico, T + 0.004); p.setValueAtTime(pico, T + 0.08); p.linearRampToValueAtTime(0.0001, T + 0.09);
      p.setValueAtTime(0.0001, T + 0.11); p.linearRampToValueAtTime(pico, T + 0.114); p.exponentialRampToValueAtTime(0.0001, T + 0.38);
      var o = O(tipo, f1, T, T + 0.41, g); o.frequency.setValueAtTime(f2, T + 0.11);
      o.detune.setValueAtTime(0, T + 0.11); o.detune.linearRampToValueAtTime(-60, T + 0.38);
      return o;
    }
    var lp = F('lowpass', 1400, 0.7, d);
    var a = camada('square', 293.66, 207.65, 0.45, lp), b = camada('triangle', 146.83, 103.83, 0.22, d);
    vib([a, b], T + 0.15, 9, 25, T + 0.22, T + 0.41);
    rb(T + 0.11, T + 0.14, 0.2, d, 'lowpass', 500);
  }
  function powerup(T, d) {
    var esc = [349.23, 392, 440, 493.88, 554.37, 622.25, 698.46, 783.99, 880];
    var lp = F('lowpass', 3000, 0.7, d);
    var g1 = G(0, lp), p = g1.gain;
    p.setValueAtTime(0.0001, T); p.linearRampToValueAtTime(0.25, T + 0.005); p.linearRampToValueAtTime(0.45, T + 0.3); p.linearRampToValueAtTime(0.0001, T + 0.33);
    var o1 = O('square', esc[0], T, T + 0.36, g1); passos(o1, T, esc, 0.035); vib([o1], T, 7, 10, 0, T + 0.36);
    var t2 = T + 0.07, g2 = G(0, d); p = g2.gain;
    p.setValueAtTime(0.0001, t2); p.linearRampToValueAtTime(0.18, t2 + 0.005); p.setValueAtTime(0.18, T + 0.39); p.linearRampToValueAtTime(0.0001, T + 0.4);
    var o2 = O('triangle', esc[0], t2, T + 0.42, g2); passos(o2, t2, esc, 0.035);
    var gc = G(0, d); ad(gc.gain, T + 0.3, 0.4, 0.003, T + 0.66);
    var car = O('sine', 880, T + 0.3, T + 0.7, gc);
    var mg = ac.createGain(); mg.gain.setValueAtTime(600, T + 0.3); mg.gain.exponentialRampToValueAtTime(1, T + 0.5); mg.connect(car.frequency);
    O('sine', 1760, T + 0.3, T + 0.7, mg);
    var g4 = G(0, d); ad(g4.gain, T + 0.3, 0.15, 0.01, T + 0.6); O('triangle', 698.46, T + 0.3, T + 0.63, g4);
  }
  function nivel(T, d) {
    var c = [698.46, 783.99, 880, 1046.5, 1174.66, 1396.91];
    var lp = F('lowpass', 3200, 0.7, d);
    var g1 = G(0, lp), p = g1.gain;
    p.setValueAtTime(0.0001, T); p.linearRampToValueAtTime(0.3, T + 0.003); p.linearRampToValueAtTime(0.42, T + 0.24); p.linearRampToValueAtTime(0.0001, T + 0.27);
    passos(O('square', c[0], T, T + 0.3, g1), T, c, 0.04);
    var t2 = T + 0.06, g2 = G(0, d); p = g2.gain;
    p.setValueAtTime(0.0001, t2); p.linearRampToValueAtTime(0.15, t2 + 0.003); p.setValueAtTime(0.15, T + 0.3); p.linearRampToValueAtTime(0.0001, T + 0.33);
    passos(O('triangle', c[0], t2, T + 0.35, g2), t2, c, 0.04);
    var lp3 = F('lowpass', 2800, 0.7, d);
    [349.23, 466.16, 587.33].forEach(function (f) { var g = G(0, lp3); corte(g.gain, T + 0.3, 0.15, 0.004, T + 0.37, T + 0.38); O('square', f, T + 0.3, T + 0.4, g); });
    var vs = [];
    [349.23, 440, 523.25].forEach(function (f) { var g = G(0, lp3); adh(g.gain, T + 0.42, 0.15, 0.006, T + 0.55, T + 0.8); vs.push(O('square', f, T + 0.42, T + 0.83, g)); });
    vib(vs, T + 0.5, 6, 12, 0, T + 0.83);
    var gb = G(0, d); corte(gb.gain, T + 0.3, 0.3, 0.005, T + 0.37, T + 0.38); O('triangle', 174.61, T + 0.3, T + 0.4, gb);
    gb = G(0, d); ad(gb.gain, T + 0.42, 0.3, 0.005, T + 0.78); O('triangle', 174.61, T + 0.42, T + 0.81, gb);
    rb(T + 0.3, T + 0.35, 0.15, d, 'bandpass', 1600, 1);
    rb(T + 0.42, T + 0.52, 0.25, d, 'bandpass', 1600, 1);
  }
  function gameover(T, d) {
    var notas = [[0, 440], [0.2, 349.23], [0.4, 392], [0.6, 329.63]];
    function voz(tipo, pico, dest) {
      var g = G(0, dest), p = g.gain; p.setValueAtTime(0.0001, T);
      var o = O(tipo, 440, T, T + 0.93, g);
      notas.forEach(function (n, i) {
        var t = T + n[0], fim = i < 3 ? T + notas[i + 1][0] : T + 0.88;
        if (i > 0) { o.frequency.setValueAtTime(notas[i - 1][1], t); o.frequency.exponentialRampToValueAtTime(n[1], t + 0.02); }
        p.linearRampToValueAtTime(pico, t + 0.01); p.linearRampToValueAtTime(pico * 0.7, fim);
      });
      p.linearRampToValueAtTime(0.0001, T + 0.9);
      return o;
    }
    var lp = F('lowpass', 1600, null, d);
    var a = voz('triangle', 0.5, d), b = voz('square', 0.25, lp);
    vib([a, b], T + 0.65, 5, 15, 0, T + 0.93);
    var t0 = T + 0.9, gch = G(0, d), p = gch.gain;
    p.setValueAtTime(0.0001, t0); p.linearRampToValueAtTime(1, t0 + 0.02); p.setValueAtTime(1, T + 1.3); p.exponentialRampToValueAtTime(0.0001, T + 2.1);
    var lpc = F('lowpass', 1600, null, gch); lpc.frequency.setValueAtTime(1600, T + 1.3); lpc.frequency.exponentialRampToValueAtTime(150, T + 2.05);
    var os = [];
    [293.66, 349.23, 440].forEach(function (f) { os.push(O('triangle', f, t0, T + 2.15, G(0.1, gch))); os.push(O('square', f, t0, T + 2.15, G(0.05, lpc))); });
    os.push(O('triangle', 146.83, t0, T + 2.15, G(0.3, gch)));
    os.forEach(function (o) { o.detune.setValueAtTime(0, T + 1.3); o.detune.linearRampToValueAtTime(-1200, T + 2.05); });
    var l = ac.createOscillator(); l.frequency.value = 5; var vg = ac.createGain(); vg.gain.value = 0; vg.gain.setValueAtTime(12, T + 0.95); vg.gain.setValueAtTime(0, T + 1.3);
    l.connect(vg); os.forEach(function (o) { vg.connect(o.detune); }); l.start(t0); l.stop(T + 1.35); conta(l);
    rb(T + 2.06, T + 2.085, 0.15, d, 'lowpass', 900);
  }
  function vitoriaJogo(T, d) {
    var lp4 = F('lowpass', 4000, null, d);
    [0.1, 0.13, 0.16, 0.19, 0.22, 0.25, 0.28, 0.3].forEach(function (pk, i) { var t = T + i * 0.05; rb(t, t + 0.035, pk, lp4, 'bandpass', 1800, 1.2); });
    function acorde(fs, t0, t1, rel, extra) {
      var pico = 0.5 / fs.length;
      fs.forEach(function (f) {
        metal(f, t0, t1, pico, d, Object.assign({ det: 6, semSub: true, semEntrada: true, atk: 0.008, rel: rel, sus: 1, q: 1.2,
          filtro: function (p) { p.setValueAtTime(600, t0); p.linearRampToValueAtTime(2400, t0 + 0.035); p.linearRampToValueAtTime(1500, t0 + 0.15); if (extra && extra.fecha) { p.setValueAtTime(1500, T + 1.4); p.linearRampToValueAtTime(900, T + 2.3); } } }, extra || {}));
      });
    }
    acorde([392, 493.88, 587.33], T + 0.4, T + 0.53, 0.03);
    acorde([392, 523.25, 659.26], T + 0.6, T + 0.67, 0.03);
    acorde([440, 587.33, 739.99], T + 0.72, T + 0.85, 0.03);
    acorde([392, 493.88, 587.33, 783.99], T + 0.9, T + 1.7, 0.6, { fecha: true, desce: [T + 1.4, 0.7, T + 1.7], vib: [T + 1.0, 5.5, 12, T + 1.2] });
    [[98, 0.4, 0.56], [130.81, 0.6, 0.7], [146.83, 0.72, 0.88]].forEach(function (b) { var g = G(0, d); corte(g.gain, T + b[1], 0.35, 0.005, T + b[2] - 0.02, T + b[2]); O('triangle', b[0], T + b[1], T + b[2] + 0.03, g); });
    var gb = G(0, d); ad(gb.gain, T + 0.9, 0.35, 0.005, T + 2.2); O('triangle', 98, T + 0.9, T + 2.25, gb);
    [0.4, 0.9].forEach(function (x) { var g = G(0, d); ad(g.gain, T + x, 0.6, 0.002, T + x + 0.16); var o = O('sine', 140, T + x, T + x + 0.2, g); o.frequency.exponentialRampToValueAtTime(50, T + x + 0.1); });
    rb(T + 0.9, T + 1.02, 0.3, d, 'bandpass', 1800, 1);
    var gp = G(0, d); ad(gp.gain, T + 0.9, 0.06, 0.003, T + 1.25); var lpp = F('lowpass', 6000, null, gp); N(T + 0.9, 0.36, F('highpass', 2000, null, lpp));
    var lps = F('lowpass', 3000, 0.7, d), gs = G(0, lps), p = gs.gain;
    p.setValueAtTime(0.0001, T + 1.0); p.linearRampToValueAtTime(0.15, T + 1.003); p.linearRampToValueAtTime(0.05, T + 1.42); p.linearRampToValueAtTime(0.0001, T + 1.48);
    passos(O('square', 783.99, T + 1.0, T + 1.5, gs), T + 1.0, [783.99, 987.77, 1174.66, 987.77, 783.99, 987.77, 1174.66, 987.77], 0.06);
  }
  function pecaNumero(T, d, f, mult) {
    var lp = F('lowpass', 2500, null, d);
    var g = G(0, lp); adh(g.gain, T, 0.4 * mult, 0.003, T + 0.07, T + 0.14); O('square', f, T, T + 0.17, g);
    var g2 = G(0, d); adh(g2.gain, T, 0.2 * mult, 0.003, T + 0.07, T + 0.14); O('triangle', f, T, T + 0.17, g2);
    rb(T, T + 0.01, 0.2 * mult, d, 'bandpass', 1200, 4);
  }
  function pecaTique(T, d) { var lp = F('lowpass', 2500, null, d); var g = G(0, lp); adh(g.gain, T, 0.4 * 0.55, 0.003, T + 0.03, T + 0.08); O('square', 523.25, T, T + 0.11, g); rb(T, T + 0.01, 0.11, d, 'bandpass', 1200, 4); }
  function pecaJa(T, d) {
    var lp = F('lowpass', 3000, null, d), os = [];
    [523.25, 698.46].forEach(function (f) { var g = G(0, lp); adh(g.gain, T, 0.25 * 1.1, 0.005, T + 0.15, T + 0.45); var o = O('square', f, T, T + 0.48, g); o.detune.setValueAtTime(-100, T); o.detune.linearRampToValueAtTime(0, T + 0.04); os.push(o); });
    vib(os, T + 0.12, 7, 10, 0, T + 0.48);
    var gv = G(0, d); ad(gv.gain, T, 0.12 * 1.1, 0.02, T + 0.3); var bp = F('bandpass', 600, 1.5, gv); bp.frequency.setValueAtTime(600, T); bp.frequency.exponentialRampToValueAtTime(2400, T + 0.25); N(T, 0.31, bp);
    var gb = G(0, d); ad(gb.gain, T, 0.25 * 1.1, 0.005, T + 0.35); O('triangle', 174.61, T, T + 0.38, gb);
  }
  function contagem(T, d, v) {
    if (v === '3') { pecaNumero(T, d, 349.23, 1); return 0.2; }
    if (v === '2') { pecaNumero(T, d, 392, 1); return 0.2; }
    if (v === '1') { pecaNumero(T, d, 440, 1); return 0.2; }
    if (v === 'ja') { pecaJa(T, d); return 0.5; }
    if (v === 'tique') { pecaTique(T, d); return 0.12; }
    pecaNumero(T, d, 349.23, 1); pecaNumero(T + 1, d, 392, 1); pecaNumero(T + 2, d, 440, 1); pecaJa(T + 3, d);
    return 3.5;
  }

  /* ---------- GRUPO TV (auditório) ---------- */
  function vinheta(T, d) {
    var gv = G(0, d), p = gv.gain; p.setValueAtTime(0.0001, T); p.linearRampToValueAtTime(0.16, T + 0.28); p.exponentialRampToValueAtTime(0.0001, T + 0.4);
    var bp = F('bandpass', 400, 1.2, gv); bp.frequency.setValueAtTime(400, T); bp.frequency.exponentialRampToValueAtTime(3500, T + 0.38); N(T, 0.41, bp);
    tom(220, 165, T + 0.1, 0.3, d, 0.08, 0.3); tom(175, 130, T + 0.2, 0.3, d, 0.08, 0.3); tom(140, 100, T + 0.3, 0.34, d, 0.08, 0.3);
    [233.08, 293.66, 349.23, 466.16].forEach(function (f) { metal(f, T + 0.42, T + 0.56, 0.08, d); });
    var gb = G(0, d); ad(gb.gain, T + 0.42, 0.18, 0.01, T + 0.58); O('triangle', 116.54, T + 0.42, T + 0.6, gb);
    [261.63, 329.63, 392, 523.25].forEach(function (f) { metal(f, T + 0.62, T + 0.76, 0.08, d); });
    gb = G(0, d); ad(gb.gain, T + 0.62, 0.18, 0.01, T + 0.78); O('triangle', 130.81, T + 0.62, T + 0.8, gb);
    caixa(T + 0.62, 0.22, d, 0.08);
    metal(880, T + 0.8, T + 0.88, 0.22, d, { rel: 0.03 }); metal(783.99, T + 0.9, T + 0.98, 0.22, d, { rel: 0.03 });
    [174.61, 261.63, 349.23, 440, 523.25].forEach(function (f) { metal(f, T + 1.02, T + 2.45, 0.048, d, { atk: 0.02, rel: 0.55, abre: [T + 1.1, T + 1.6, 1.4] }); });
    metal(1046.5, T + 1.02, T + 2.45, 0.1, d, { atk: 0.02, rel: 0.55, abre: [T + 1.1, T + 1.6, 1.4], vib: [T + 1.55, 5.5, 9] });
    gb = G(0, d); ad(gb.gain, T + 1.02, 0.16, 0.01, T + 2.62); O('triangle', 87.31, T + 1.02, T + 2.65, gb);
    tom(174.61, 87.31, T + 1.02, 0.26, d, 0.06, 0.9);
    prato(T + 1.02, 0.1, d, 1.5);
    [1396.91, 1760, 2093, 2793.83].forEach(function (f, i) { sino(f, T + 1.12 + i * 0.1, 0.09, d, 0.7); });
    pandeiro(T + 2.3, 0.07, d); pandeiro(T + 2.4, 0.05, d);
    return 3.1;
  }
  function suspense(T, d) {
    var t = 0, k = 0;
    while (t < 1.5) {
      var pico = 0.05 * Math.pow(0.36 / 0.05, t / 1.5) * (0.88 + Math.random() * 0.24) * (k % 2 ? 0.9 : 1);
      caixa(T + Math.max(0, t + (Math.random() * 0.006 - 0.003)), pico, d, 0.07);
      t += 0.06 - 0.032 * (t / 1.5); k++;
    }
    var ge = G(0, d); ge.gain.setValueAtTime(0.0001, T); ge.gain.linearRampToValueAtTime(0.16, T + 1.5);
    var tr = G(0.5, ge); lfo(T, T + 1.6, 16, 0.5, tr.gain);
    O('sine', 73.42, T, T + 1.6, F('lowpass', 250, null, tr));
    var gs = G(0, d); gs.gain.setValueAtTime(0.0001, T); gs.gain.linearRampToValueAtTime(0.05, T + 1.5);
    var tr2 = G(1, gs); lfo(T, T + 1.6, 7, 0.2, tr2.gain);
    var o = O('triangle', 220, T, T + 1.6, F('lowpass', 1600, null, tr2)); o.frequency.exponentialRampToValueAtTime(440, T + 1.5);
    var gp = G(0, d); gp.gain.setValueAtTime(0.0001, T); gp.gain.exponentialRampToValueAtTime(0.08, T + 1.5); N(T, 1.6, pratoCadeia(gp));
    /* corte seco no barramento */
    d.gain.setValueAtTime(d.gain.value, T + 1.5); d.gain.exponentialRampToValueAtTime(0.0001, T + 1.54);
    return 1.6;
  }
  function acertoTv(T, d) {
    [523.25, 587.33, 659.25].forEach(function (f, i) { metal(f, T + i * 0.06, T + i * 0.06 + 0.05, 0.24, d, { rel: 0.03 }); });
    [349.23, 440, 523.25, 587.33].forEach(function (f) { metal(f, T + 0.18, T + 0.48, 0.06, d, { atk: 0.015, rel: 0.35 }); });
    metal(698.46, T + 0.18, T + 0.48, 0.08, d, { atk: 0.015, rel: 0.35 });
    var gb = G(0, d); ad(gb.gain, T + 0.18, 0.15, 0.01, T + 0.48); O('triangle', 174.61, T + 0.18, T + 0.5, gb);
    sino(1760, T + 0.18, 0.06, d, 0.75, 3); sino(2093, T + 0.18, 0.06, d, 0.75, 3);
    pandeiro(T + 0.18, 0.08, d); pandeiro(T + 0.26, 0.06, d); pandeiro(T + 0.34, 0.04, d);
  }
  function erroTv(T, d) {
    function buzina(f, t0, t1, pico, rel, escorrega, vibIni) {
      var g = G(0, d), lp = F('lowpass', 2400, 0.7, g), bp = F('bandpass', 1100, 2.5, lp), p = g.gain;
      p.setValueAtTime(0.0001, t0); p.linearRampToValueAtTime(pico, t0 + 0.008); p.linearRampToValueAtTime(pico * 0.85, t0 + 0.05); p.setValueAtTime(pico * 0.85, t1); p.exponentialRampToValueAtTime(0.0001, t1 + rel);
      var os = [];
      [['square', -12, 1], ['square', 12, 1], ['sawtooth', 0, 0.5]].forEach(function (c) {
        var o = O(c[0], f, t0, t1 + rel + 0.03, G(c[2] * 1.2, bp));
        o.detune.setValueAtTime(c[1] + 60, t0); o.detune.linearRampToValueAtTime(c[1], t0 + 0.03);
        if (escorrega) { o.detune.setValueAtTime(c[1], escorrega[0]); o.detune.linearRampToValueAtTime(c[1] - 50, escorrega[1]); }
        os.push(o);
      });
      if (vibIni) vib(os, vibIni, 6, 15, 0, t1 + rel + 0.03);
    }
    buzina(392, T, T + 0.12, 0.22, 0.04);
    buzina(293.66, T + 0.17, T + 0.48, 0.24, 0.06, [T + 0.33, T + 0.48], T + 0.3);
    var g = G(0, d); ad(g.gain, T + 0.17, 0.2, 0.003, T + 0.35); var o = O('sine', 110, T + 0.17, T + 0.38, g); o.frequency.exponentialRampToValueAtTime(65, T + 0.26);
  }
  function aplausos(T, d, v) {
    if (v === 'curto') { var sub = G(1, d); sub.gain.setValueAtTime(1, T + 0.9); sub.gain.linearRampToValueAtTime(0.0001, T + 1.2); aplausosEm(T, sub, 1.25); return 1.3; }
    aplausosEm(T, d, 2.6); return 2.7;
  }
  function milhao(T, d) {
    [174.61, 261.63, 349.23, 440, 523.25, 698.46].forEach(function (f) { metal(f, T, T + 0.25, 0.28 / 6, d, { atk: 0.01, rel: 0.1, desce: [T + 0.011, 0.3, T + 0.25] }); });
    rb(T, T + 0.12, 0.14, d, 'bandpass', 1500, 0.7);
    tom(174.61, 87.31, T, 0.26, d, 0.05, 0.7); prato(T, 0.1, d, 1.2);
    [[0.4, 880, 0.12], [0.54, 783.99, 0.08], [0.64, 1046.5, 0.26], [0.94, 880, 0.1], [1.06, 1046.5, 0.1], [1.18, 1174.66, 0.22]].forEach(function (n) {
      metal(n[1], T + n[0], T + n[0] + n[2], 0.22, d, { rel: 0.05 }); metal(n[1] / 2, T + n[0], T + n[0] + n[2], 0.11, d, { rel: 0.05, semSub: true });
    });
    [174.61, 261.63, 440].forEach(function (f) { metal(f, T + 0.4, T + 0.9, 0.033, d, { fixo: 1200, rel: 0.06 }); });
    [116.54, 174.61, 293.66].forEach(function (f) { metal(f, T + 0.92, T + 1.42, 0.033, d, { fixo: 1200, rel: 0.06 }); });
    [293.66, 369.99, 440, 523.25].forEach(function (f) { metal(f, T + 1.45, T + 1.61, 0.06, d, { rel: 0.05 }); });
    metal(1046.5, T + 1.45, T + 1.61, 0.2, d, { rel: 0.05 });
    tom(200, 150, T + 1.45, 0.24, d, 0.06, 0.25); tom(160, 120, T + 1.52, 0.24, d, 0.06, 0.25); tom(130, 95, T + 1.59, 0.24, d, 0.06, 0.25);
    var t0 = T + 1.7;
    function chegada(f, pico, extra) {
      metal(f, t0, T + 2.75, pico, d, Object.assign({ atk: 0.02, rel: 0.45, filtro: function (p, ff) { p.setValueAtTime(2 * ff, t0); p.linearRampToValueAtTime(Math.min(5 * ff, 9000), T + 2.1); } }, extra || {}));
    }
    [196, 293.66, 392, 493.88, 587.33].forEach(function (f) { chegada(f, 0.042); });
    chegada(987.77, 0.07, { vib: [T + 2.2, 5.5, 10] });
    var gb = G(0, d); ad(gb.gain, t0, 0.14, 0.01, t0 + 1.4); O('triangle', 98, t0, t0 + 1.43, gb);
    tom(196, 98, t0, 0.22, d, 0.06, 1.0); prato(t0, 0.1, d, 1.5);
    [1567.98, 1975.53, 2349.32, 3135.96].forEach(function (f, i) { sino(f, T + 1.75 + i * 0.08, 0.07, d, 0.8); });
    for (var r = 0; r < 6; r++) sino(3135.96, T + 2.08 + r * 0.08, 0.05 - r * (0.038 / 5), d, 0.6, 2);
    for (var c = 0; c < 40; c++) {
      var tc = T + 1.75 + Math.random() * 1.35, out = d;
      if (ac.createStereoPanner) { var sp = ac.createStereoPanner(); sp.pan.value = -0.8 + Math.random() * 1.6; sp.connect(d); out = sp; }
      var g = G(0, out); ad(g.gain, tc, 0.015 + Math.random() * 0.02, 0.002, tc + 0.03); O('sine', 3000 + Math.random() * 3000, tc, tc + 0.04, g);
    }
    var sub = G(0.45, d); sub.gain.setValueAtTime(0.45, T + 3.0); sub.gain.linearRampToValueAtTime(0.0001, T + 3.3);
    aplausosEm(T + 1.75, sub, 1.55);
    return 3.35;
  }
  function notaAlta(T, d) {
    [698.46, 880, 1046.5, 1396.91, 1760, 2093, 2793.83, 3520].forEach(function (f, i) {
      var t = T + i * 0.03, g = G(0, d); ad(g.gain, t, 0.08, 0.003, t + 0.5); O('triangle', f, t, t + 0.53, g);
      var g2 = G(0, d); ad(g2.gain, t, 0.024, 0.003, t + 0.5); O('sine', f * 2, t, t + 0.53, g2);
    });
    metal(880, T + 0.28, T + 0.37, 0.22, d, { rel: 0.03 }); metal(783.99, T + 0.4, T + 0.49, 0.22, d, { rel: 0.03 });
    metal(1046.5, T + 0.52, T + 0.97, 0.22, d, { rel: 0.3, vib: [T + 0.7, 5.5, 10] });
    [349.23, 440, 523.25, 783.99].forEach(function (f) { metal(f, T + 0.52, T + 1.0, 0.045, d, { fixo: 1600, atk: 0.03, rel: 0.35 }); });
    var gb = G(0, d); ad(gb.gain, T + 0.52, 0.12, 0.01, T + 1.12); O('triangle', 174.61, T + 0.52, T + 1.15, gb);
    sino(2093, T + 0.52, 0.05, d, 0.8, 2); sino(2793.83, T + 0.52, 0.05, d, 0.8, 2);
    pandeiro(T + 0.52, 0.08, d); pandeiro(T + 0.6, 0.06, d); pandeiro(T + 0.68, 0.04, d);
    palmas(T + 0.5, 0.8, interp([[0, 25], [0.6, 25], [0.8, 0]]), 25, 0.05, 0.14, d);
    return 1.45;
  }
  function notaMedia(T, d) {
    marimba(440, T, 0.2, d); marimba(523.25, T + 0.12, 0.2, d); marimba(698.46, T + 0.24, 0.2, d); marimba(587.33, T + 0.4, 0.2, d, 0.6);
    [349.23, 440, 523.25, 587.33].forEach(function (f) { metal(f, T + 0.4, T + 0.7, 0.0375, d, { fixo: 1100, q: 0.7, semSub: true, semEntrada: true, atk: 0.04, rel: 0.35, sus: 1 }); });
    var g = G(0, d); ad(g.gain, T + 0.4, 0.07, 0.002, T + 0.44); O('sine', 1200, T + 0.4, T + 0.46, g);
    rb(T + 0.4, T + 0.41, 0.05, d, 'bandpass', 2500, 1);
  }
  function notaBaixa(T, d) {
    function trom(f, t0, t1, rel, pico, nota3) {
      var g = G(0, d), lp = F('lowpass', 2000, null, g), bp = F('bandpass', 500, 3, lp), bf = bp.frequency;
      bf.setValueAtTime(500, t0); bf.linearRampToValueAtTime(1300, t0 + 0.08);
      if (nota3) { bf.linearRampToValueAtTime(800, T + 0.6); bf.linearRampToValueAtTime(1300, T + 0.68); bf.linearRampToValueAtTime(700, t1); }
      else bf.linearRampToValueAtTime(700, t1);
      var p = g.gain; p.setValueAtTime(0.0001, t0); p.linearRampToValueAtTime(pico, t0 + 0.02); p.setValueAtTime(pico, t1); p.exponentialRampToValueAtTime(0.0001, t1 + rel);
      var a = O('sawtooth', f, t0, t1 + rel + 0.03, G(1.4, bp)), b = O('square', f, t0, t1 + rel + 0.03, G(0.56, bp)); b.detune.value = 5;
      var lps = F('lowpass', 1500, null, G(0.04 * 3, g)); N(t0, t1 - t0 + rel, lps);
      if (nota3) {
        [a, b].forEach(function (o) { o.frequency.setValueAtTime(233.08, T + 0.6); o.frequency.linearRampToValueAtTime(220, T + 1.05); });
        vib([a, b], T + 0.6, 5, 35, T + 1.05, t1 + rel + 0.03);
      }
    }
    trom(293.66, T, T + 0.22, 0.04, 0.24); trom(246.94, T + 0.26, T + 0.48, 0.04, 0.24); trom(233.08, T + 0.52, T + 1.1, 0.1, 0.24, true);
    marimba(698.46, T + 1.22, 0.11, d, 0.12); marimba(880, T + 1.28, 0.11, d, 0.12); marimba(1046.5, T + 1.34, 0.11, d, 0.14);
  }
  function pagina(T, d) {
    var k = 0.9 + Math.random() * 0.2, g = G(0, d), p = g.gain;
    p.setValueAtTime(0.0001, T); p.linearRampToValueAtTime(0.15 * k, T + 0.06); p.exponentialRampToValueAtTime(0.0001, T + 0.22);
    var bp = F('bandpass', 900, 0.9, g); bp.frequency.setValueAtTime(900, T); bp.frequency.exponentialRampToValueAtTime(3600 + Math.random() * 1200, T + 0.18); N(T, 0.23, bp);
    rb(T + 0.2, T + 0.25, 0.07, d, 'bandpass', 2500, 1.2);
    var gc = G(0, d); ad(gc.gain, T + 0.2, 0.035, 0.002, T + 0.215); O('triangle', 1800, T + 0.2, T + 0.23, gc);
  }
  function novo(T, d) {
    [0, 0.07, 0.13, 0.18, 0.225, 0.265].forEach(function (x) { rb(T + x, T + x + 0.012, 0.09, d, 'bandpass', 2600 + Math.random() * 1000, 2); });
    var g = G(0, d), p = g.gain; p.setValueAtTime(0.0001, T + 0.25); p.linearRampToValueAtTime(0.1, T + 0.45); p.exponentialRampToValueAtTime(0.0001, T + 0.55);
    var bp = F('bandpass', 600, 1.4, g); bp.frequency.setValueAtTime(600, T + 0.25); bp.frequency.exponentialRampToValueAtTime(5000, T + 0.55); N(T + 0.25, 0.31, bp);
    [1174.66, 1567.98, 1760, 2349.32].forEach(function (f, i) { sino(f, T + 0.5 + i * 0.055, 0.08, d, 0.3, 3); });
    var gp = G(0, d); ad(gp.gain, T + 0.72, 0.12, 0.003, T + 0.78); var o = O('sine', 400, T + 0.72, T + 0.8, gp); o.frequency.exponentialRampToValueAtTime(1200, T + 0.76);
  }
  function alerta(T, d) {
    var g = G(0, d); ad(g.gain, T, 0.14, 0.002, T + 0.05); O('sine', 900, T, T + 0.07, g); rb(T, T + 0.008, 0.1, d, 'bandpass', 1800, 1);
    g = G(0, d); ad(g.gain, T + 0.12, 0.12, 0.002, T + 0.16); O('sine', 1350, T + 0.12, T + 0.18, g); rb(T + 0.12, T + 0.128, 0.08, d, 'bandpass', 2800, 1);
    var gb = G(0, d); adh(gb.gain, T + 0.26, 0.15, 0.004, T + 0.38, T + 0.43);
    var o1 = O('square', 880, T + 0.26, T + 0.46, F('lowpass', 2500, 0.7, gb)); var o2 = O('sine', 880, T + 0.26, T + 0.46, G(0.3, gb));
    [o1, o2].forEach(function (o) { o.frequency.exponentialRampToValueAtTime(1174.66, T + 0.31); });
  }

  /* ---------- catálogo ---------- */
  var SONS = {
    clique:       { fn: clique,      ganho: 0.30, dur: 0.05, grupo: 'jogo', rotulo: 'Clique', uso: 'Botões, escolher alternativa, abrir carta.', empilha: true },
    moeda:        { fn: moeda,       ganho: 0.45, dur: 0.45, grupo: 'jogo', rotulo: 'Moedinha', uso: 'Ponto pequeno: degrau de prêmio, letra certa, XP.', empilha: true },
    acerto_jogo:  { fn: acertoJogo,  ganho: 0.50, dur: 0.35, grupo: 'jogo', rotulo: 'Acertou', uso: 'Resposta certa nos jogos, par formado na Memória.' },
    erro_jogo:    { fn: erroJogo,    ganho: 0.40, dur: 0.41, grupo: 'jogo', rotulo: 'Ops, errado', uso: 'Resposta errada, par errado, letra errada.' },
    powerup:      { fn: powerup,     ganho: 0.45, dur: 0.70, grupo: 'jogo', rotulo: 'Poder extra', uso: 'Usar ajuda (50:50, Pular, Plateia), dica, bônus.' },
    nivel:        { fn: nivel,       ganho: 0.50, dur: 0.83, grupo: 'jogo', rotulo: 'Subiu de nível', uso: 'Prêmio garantido, lição concluída, fase nova.' },
    gameover:     { fn: gameover,    ganho: 0.45, dur: 2.15, grupo: 'jogo', rotulo: 'Fim de jogo', uso: 'Partida perdida, tempo esgotado sem acerto.', longo: true },
    vitoria_jogo: { fn: vitoriaJogo, ganho: 0.55, dur: 2.35, grupo: 'jogo', rotulo: 'Vitória!', uso: 'Prêmio maior de um jogo, recorde novo.', longo: true },
    contagem:     { fn: contagem,    ganho: 1.00, dur: 3.5,  grupo: 'jogo', rotulo: '3, 2, 1, já!', uso: 'Largada de jogo cronometrado (peças: 3, 2, 1, ja, tique).' },
    vinheta:      { fn: vinheta,     ganho: 1.00, dur: 3.1,  grupo: 'tv', rotulo: 'Vinheta de abertura', uso: 'Começar simulado ou jogo, uma vez por prova.', longo: true },
    suspense:     { fn: suspense,    ganho: 1.00, dur: 1.6,  grupo: 'tv', rotulo: 'Rufar de suspense', uso: 'Antes de revelar a resposta ou a nota.' },
    acerto_tv:    { fn: acertoTv,    ganho: 1.00, dur: 0.95, grupo: 'tv', rotulo: 'Acerto com metais', uso: 'Resposta certa em jogo de auditório.' },
    erro_tv:      { fn: erroTv,      ganho: 1.00, dur: 0.6,  grupo: 'tv', rotulo: 'Erro buzininha', uso: 'Resposta errada em jogo de auditório.' },
    aplausos:     { fn: aplausos,    ganho: 1.00, dur: 2.7,  grupo: 'tv', rotulo: 'Aplausos da plateia', uso: 'Prêmio garantido, depois da nota alta (variante curto).', empilha: true },
    milhao:       { fn: milhao,      ganho: 1.00, dur: 3.35, grupo: 'tv', rotulo: 'Prêmio máximo', uso: 'Nota 1,0 ou prêmio máximo do jogo.', longo: true },
    nota_alta:    { fn: notaAlta,    ganho: 1.00, dur: 1.45, grupo: 'tv', rotulo: 'Nota alta, festa', uso: 'Nota 0,8 a 1,0 (80 % ou mais).', longo: true },
    nota_media:   { fn: notaMedia,   ganho: 1.00, dur: 1.1,  grupo: 'tv', rotulo: 'Nota média, simpática', uso: 'Nota 0,5 a 0,7.', longo: true },
    nota_baixa:   { fn: notaBaixa,   ganho: 1.00, dur: 1.5,  grupo: 'tv', rotulo: 'Nota baixa, trombone triste', uso: 'Nota abaixo de 0,5, sem bronca.', longo: true },
    pagina:       { fn: pagina,      ganho: 1.00, dur: 0.3,  grupo: 'tv', rotulo: 'Virar página', uso: 'Revisão, Início, próxima pergunta, virar carta.' },
    novo:         { fn: novo,        ganho: 1.00, dur: 1.0,  grupo: 'tv', rotulo: 'Novo, embaralhar', uso: 'Gerar novo simulado, jogar de novo, embaralhar.' },
    alerta:       { fn: alerta,      ganho: 1.00, dur: 0.46, grupo: 'tv', rotulo: 'Atenção, aviso', uso: 'Faltam questões sem marcar, últimos segundos.' }
  };

  var BORDOES = {
    moeda: ['+1 no cofrinho do sorriso!', 'Pingou ponto!', 'Moedinha de esmalte!', 'Tilintou, contou!'],
    acerto_jogo: ['Na mosca do molar!', 'Oclusão perfeita!', 'Cravou o ponto de contato!', 'Encaixou igual prótese bem moldada!', 'Isso é que é anatomia!'],
    erro_jogo: ['Escorregou na cúspide.', 'Quase! Ajusta a mordida e vai de novo.', 'Esse não encaixou. Bora pro próximo.', 'Faltou um tiquinho de cimento.'],
    powerup: ['Turbo de flúor ligado!', 'Ajuda na mão, bora!', 'Bochecho de coragem ativado!', 'Lupa ligada, agora clareia.'],
    nivel: ['Subiu de fase, futuro(a) doutor(a)!', 'Fase nova destravada!', 'Mais um degrau rumo ao jaleco!', 'Prêmio garantido no bolso do jaleco!'],
    gameover: ['Fim de jogo. Bora mais uma?', 'O fliperama cansou... mais uma ficha?', 'A broca parou por aqui. Respira e recomeça.', 'Perdeu essa, ganhou revisão.'],
    vitoria_jogo: ['Zerou o jogo!', 'Sorriso de pódio!', 'Gabarito brilhando mais que esmalte novo!', 'Pode pendurar no consultório: vitória!'],
    contagem: ['Luvas calçadas? Três, dois, um... já!', 'Sugador ligado... vai!', 'Lupa no lugar: três, dois, um!', 'Cadeira reclinada, foco total!'],
    inicio: ['Luzes acesas, caneta na mão!', 'Auditório lotado, bora pra primeira!', 'Microfone ligado, cérebro também!', 'Cortinas abertas, o palco é seu!', 'Prepara o sorriso, o programa começou!', 'Aquecendo os neurônios… e começou!'],
    faltam: ['Dá uma conferida antes de entregar.', 'Ainda tem questão esperando por você.', 'Volta lá e marca as que ficaram pra trás.', 'Antes de entregar, passa o olho de novo.'],
    confirmar: ['Marcou, tá marcado!', 'Caneta no papel, coração na mão!', 'Rufem os tambores…', 'Plateia em silêncio, lá vem resposta!', 'Escolha travada, agora é com o gabarito!', 'Segura a emoção mais um pouquinho!'],
    acerto: ['Na mosca, colega!', 'Acertou na raiz!', 'Brilhou mais que esmalte novo!', 'Essa ficou bem cimentada!', 'Plateia de pé pra essa!', 'Tá craque, hein!'],
    erro: ['Quase! A próxima é sua.', 'Passou raspando, bora de novo!', 'Erro de treino vira acerto de prova!', 'Errar no treino sai de graça!', 'Respira, anota e vira o jogo!', 'Essa escorregou, a próxima não escapa!'],
    nota_alta: ['Nota alta! Pode subir no palco!', 'Sorriso de comercial de creme dental!', 'Brilho de porcelana, parabéns!', 'Aplausos demorados pra essa nota!', 'Desse jeito a prova de verdade treme!', 'Chuva de confete pra esse resultado!'],
    nota_media: ['Base boa, agora é o acabamento!', 'Bom caminho, falta só o polimento!', 'Meio do pódio, sobe mais um degrau!', 'Tá no jogo, bora caprichar!', 'Passou do meio, a plateia acredita!', 'Mais uma rodada e chega lá!'],
    nota_baixa: ['Ensaio geral serve pra isso!', 'Ainda é moldagem, o sorriso vem depois!', 'Hoje foi aquecimento, amanhã você brilha!', 'Bora revisar e voltar com tudo!', 'Primeiro rascunho, a obra-prima vem depois!', 'O auditório continua torcendo por você!'],
    novo: ['Rodada nova, plateia renovada!', 'Embaralhando as perguntas… prontinho!', 'Novo episódio no ar!', 'Outra rodada saindo do forno!', 'Cartas novas na mesa!', 'Troca de cenário, mesma estrela!']
  };
  var ultimoBordao = {};

  /* ---------- barramentos (um por disparo) ---------- */
  function soltar(b) { var i = ativos.indexOf(b); if (i >= 0) ativos.splice(i, 1); try { b.g.disconnect(); } catch (e) {} }
  function cortar(b, fade) {
    try { var t = ac.currentTime; b.g.gain.cancelScheduledValues(t); b.g.gain.setValueAtTime(Math.max(b.g.gain.value, 0.0001), t); b.g.gain.exponentialRampToValueAtTime(0.0001, t + fade); } catch (e) {}
    clearTimeout(b.timer);
    b.timer = setTimeout(function () {
      var t = ac.currentTime;
      b.fontes.slice().forEach(function (n) { try { n.stop(t); } catch (e) {} });
      soltar(b);
    }, fade * 1000 + 80);
  }

  function tocar(nome, op) {
    try {
      var s = SONS[nome];
      if (!s || mudoAtual || !houveGesto) return false;
      try { if (document.hidden) return false; } catch (e) {}
      if (!iniciar()) return false;
      if (ac.state === 'suspended' && ac.resume) { try { var pr = ac.resume(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
      var agora = ac.currentTime;
      /* com o contexto suspenso as fontes não terminam; o limite só vale tocando de verdade */
      var rodando = ac.state === 'running';
      if (nome === 'clique') { if (agora - ultimoClique < 0.04 || (rodando && fontes > 48)) return false; ultimoClique = agora; }
      else if (rodando && fontes > 400) return false;
      var opc = (op && typeof op === 'object') ? op : { variante: op };
      var mult = typeof opc.ganho === 'number' ? Math.max(0, Math.min(1.5, opc.ganho)) : 1;
      ativos.slice().forEach(function (b) {
        if ((b.nome === nome && !s.empilha) || (s.longo && b.longo)) cortar(b, s.longo && b.longo ? 0.05 : 0.03);
      });
      var g = ac.createGain(); g.gain.value = s.ganho * mult; g.connect(mestre);
      var b = { nome: nome, g: g, longo: !!s.longo, fontes: [] };
      ativos.push(b);
      var T = agora + 0.02, dur;
      busAtual = b;
      try { dur = s.fn(T, g, opc.variante); } finally { busAtual = null; }
      if (typeof dur !== 'number') dur = s.dur;
      b.timer = setTimeout(function () { soltar(b); }, (dur + 0.5) * 1000);
      return true;
    } catch (e) { aviso(e); return false; }
  }

  function parar() {
    try { if (!ac) return; ativos.slice().forEach(function (b) { cortar(b, 0.04); }); } catch (e) {}
  }

  function aplicarMestre() {
    try { if (ac && mestre) { var t = ac.currentTime; mestre.gain.cancelScheduledValues(t); mestre.gain.setValueAtTime(mestre.gain.value, t); mestre.gain.linearRampToValueAtTime(ganhoMestre(), t + 0.05); } } catch (e) {}
  }

  try {
    document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); });
    var destravar = function () { houveGesto = true; try { if (ac && ac.state === 'suspended') { var pr = ac.resume(); if (pr && pr.catch) pr.catch(function () {}); } } catch (e) {} };
    /* em captura, pra valer antes dos cliques da própria página */
    document.addEventListener('pointerdown', destravar, { passive: true, capture: true });
    document.addEventListener('keydown', destravar, true);
    document.addEventListener('click', destravar, true);
  } catch (e) {}

  window.Sons = {
    tocar: tocar,
    parar: parar,
    mudo: function () { return mudoAtual; },
    alternarMudo: function () { mudoAtual = !mudoAtual; if (mudoAtual) parar(); aplicarMestre(); salvar(); return mudoAtual; },
    volume: function (v) {
      if (v === undefined) return vol;
      var n = +v; if (isNaN(n)) return vol;
      vol = Math.min(1, Math.max(0, n)); aplicarMestre(); salvar(); return vol;
    },
    disponivel: function () { return !!AC && !falhou && !mudoAtual; },
    lista: function () { return Object.keys(SONS).map(function (k) { var s = SONS[k]; return { nome: k, grupo: s.grupo, rotulo: s.rotulo, uso: s.uso }; }); },
    bordao: function (momento) {
      var l = BORDOES[momento]; if (!l || !l.length) return '';
      var i = Math.floor(Math.random() * l.length);
      if (l.length > 1 && i === ultimoBordao[momento]) i = (i + 1 + Math.floor(Math.random() * (l.length - 1))) % l.length;
      ultimoBordao[momento] = i; return l[i];
    },
    momentos: function () { return Object.keys(BORDOES); },
    estado: function () { return { contexto: ac ? ac.state : 'nenhum', fontes: fontes, tocando: ativos.length }; }
  };
})();
