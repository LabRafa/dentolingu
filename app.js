/* Dentolingu: trilha de estudo da turma de Odontologia (lições, simulado, cartas, mapa mental, ranking, perfil).
   Conteúdo: temas-base.json (embutido) + coleção "temas" do Firestore (publicada pela Mônica depois de cada aula).
   Sem FIREBASE_CONFIG o site roda em modo demonstração: sem login, sem ranking, progresso só neste aparelho. */
'use strict';
const APP = 'Dentolingu';
const ADMIN_EMAILS = ['rafaraujoguerra@gmail.com'];
const LS_KEY = 'dentolingu';

/* ===== ÍCONES ===== */
const I = {
  tooth: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3C4.5 3 3 5 3 7.5c0 2.5 1 4 1.5 6 .5 2 .5 6 1.8 7 1.3.8 1.7-1.8 2-4 .3-1.5 1.4-1.5 1.7 0 .3 2.2.7 4.8 2 4 1.3-1 1.3-5 1.8-7 .5-2 1.5-3.5 1.5-6C21 5 19.5 3 17 3c-1.8 0-3 .8-5 .8S8.8 3 7 3z"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path fill="#ff8a1f" d="M12 2c1 3.5 5.5 5.5 5.5 11a5.5 5.5 0 0 1-11 0c0-2 .8-3.4 2-4.6.2 1.6.9 2.4 1.8 2.6C10 8 10.6 4.6 12 2z"/></svg>',
  xp: '<svg viewBox="0 0 24 24"><path fill="#ffbe3d" d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.5 6.7L12 16.8 5.9 20.3l1.5-6.7L2.3 9l6.8-.7z"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z"/></svg>',
  trilha: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8 17c6 0 2-10 8-10"/></svg>',
  simu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>',
  cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><rect x="3" y="6" width="14" height="14" rx="3"/><path d="M8 3h11a2 2 0 0 1 2 2v11"/></svg>',
  mapa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><circle cx="4.5" cy="5" r="1.8"/><circle cx="19.5" cy="5" r="1.8"/><circle cx="4.5" cy="19" r="1.8"/><circle cx="19.5" cy="19" r="1.8"/><path d="M9.8 10 6 6.2M14.2 10 18 6.2M9.8 14 6 17.8M14.2 14 18 17.8"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.2 2L15 15H9l-1.8 2A3 3 0 0 1 2 15v-3a4 4 0 0 1 4-4z"/><path d="M7 12h4M9 10v4M15.5 11.5h.01M17.5 13.5h.01"/></svg>',
  google: '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.8c2.3-2.1 3.6-5.1 3.6-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-3c-1.1.7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.4v3.1C3.4 21.3 7.4 24 12 24z"/><path fill="#FBBC05" d="M5.3 14.3c-.3-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4A12 12 0 0 0 0 12c0 1.9.5 3.8 1.4 5.4z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l3.9 3.1c.9-2.9 3.6-4.9 6.7-4.9z"/></svg>'
};
/* ===== VISUAL PIXEL (opção do Perfil, 11/11/2026): ícones em quadradinhos de 12x12. '#' = cor do texto; letras = cores fixas.
   A classe 'tema-pixel' no <html> liga o styles-pixel.css; já é posta no <head> antes de pintar. ===== */
const VISUAL_KEY = 'dentolingu-visual', I_NORMAL = Object.assign({}, I);
const I_PIXEL = (function () {
  const PAL = { o: '#ff8a1f', y: '#ffd24a', d: '#b07a00', w: '#ffffff', k: '#1b2250' };
  function px(rows) {
    const h = rows.length, w = rows[0].length; let r = '';
    rows.forEach((ln, y) => { let x = 0; while (x < w) { const ch = ln[x]; if (ch === '.') { x++; continue; } let n = 1; while (x + n < w && ln[x + n] === ch) n++; r += `<rect x="${x}" y="${y}" width="${n}" height="1" fill="${ch === '#' ? 'currentColor' : PAL[ch]}"/>`; x += n; } });
    return `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${r}</svg>`;
  }
  return Object.assign({}, I, {
    tooth: px(['............', '.###....###.', '############', '############', '############', '############', '.##########.', '.##########.', '..###..###..', '..###..###..', '..##....##..', '..#......#..']),
    flame: px(['.....o......', '.....oo.....', '....ooo.....', '....oooo..o.', '...ooooo.oo.', '..oooooooooo', '..ooooyooooo', '.ooooyyyoooo', '.oooyyyyyooo', '.oooyyyyyooo', '..ooyyyyyoo.', '...ooooooo..']),
    xp: px(['.....yy.....', '.....yy.....', '....yyyy....', 'yyyyyyyyyyyy', '.yyyyyyyyyy.', '..yyyyyyyy..', '...yyyyyy...', '...yyyyyy...', '..yyy..yyy..', '..yy....yy..', '.yy......yy.', '............']),
    heart: px(['............', '.###....###.', '#####..#####', '############', '############', '############', '.##########.', '..########..', '...######...', '....####....', '.....##.....', '............']),
    check: px(['............', '..........##', '.........###', '........###.', '.##....###..', '.###..###...', '..######....', '...####.....', '....##......', '............']),
    play: px(['............', '...##.......', '...####.....', '...######...', '...########.', '...#########', '...#########', '...########.', '...######...', '...####.....', '...##.......', '............']),
    home: px(['.....##.....', '....####....', '...######...', '..########..', '.##########.', '############', '.##########.', '.###....###.', '.###....###.', '.###....###.', '.###....###.', '............']),
    trophy: px(['.##########.', '#.########.#', '#.########.#', '#.########.#', '.##########.', '..########..', '...######...', '.....##.....', '.....##.....', '....####....', '..########..', '..########..']),
    user: px(['....####....', '...######...', '...######...', '...######...', '....####....', '............', '..########..', '.##########.', '.##########.', '############', '############', '............']),
    trilha: px(['.........###', '.........###', '.........###', '..........#.', '......####..', '.....#......', '.....#......', '..####......', '.#..........', '###.........', '###.........', '###.........']),
    simu: px(['....####....', '............', '...######...', '.##......##.', '.#...#....#.', '#....#.....#', '#....###...#', '#..........#', '.#........#.', '.##......##.', '...######...', '............']),
    cards: px(['...#########', '...#.......#', '#########..#', '#.......#..#', '#.......#..#', '#.......#..#', '#.......#..#', '#.......#..#', '#.......#..#', '#.......####', '#.......#...', '#########...']),
    mapa: px(['##........##', '##........##', '..#......#..', '...#....#...', '....####....', '....####....', '....####....', '....####....', '...#....#...', '..#......#..', '##........##', '##........##']),
    game: px(['............', '............', '.##########.', '############', '##.#####.###', '#...###.#.##', '##.#####.###', '############', '####....####', '.##......##.', '............', '............'])
  });
})();
function visualAtual() { try { return localStorage.getItem(VISUAL_KEY) === 'pixel' ? 'pixel' : 'normal'; } catch (e) { return 'normal'; } }
function aplicaVisual(v) {
  document.documentElement.classList.toggle('tema-pixel', v === 'pixel');
  Object.assign(I, v === 'pixel' ? I_PIXEL : I_NORMAL);
  const tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.content = v === 'pixel' ? '#1b2250' : '#1fa88f';
}
aplicaVisual(visualAtual());

/* ===== ESTADO ===== */
const CORES = ['#7566f0', '#ec5b78', '#1fa88f', '#2f8fe0', '#e89a00', '#8a5a44'];
let TEMAS = [];
let S = { xp: 0, streak: 0, last: '', done: {}, acertos: 0, total: 0, xpSemana: {}, ranking: false, nome: '', foto: '' };
let FB = null, DB = null, USER = null, DEMO = true, PERFIS_CACHE = null;
const $ = s => document.querySelector(s), app = $('#app'), nav = $('#nav');

try { const r = localStorage.getItem(LS_KEY); if (r) S = Object.assign(S, JSON.parse(r)); } catch (e) { }
const saveLocal = () => { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { } };
let syncTimer = null;
function salvar() {
  saveLocal();
  if (DEMO || !USER || !DB) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    const doc = Object.assign({}, S, { nome: USER.displayName || S.nome || '', foto: USER.photoURL || '', atualizado: Date.now() });
    DB.collection('perfis').doc(USER.uid).set(doc, { merge: true }).catch(e => console.warn('sync', e));
  }, 800);
}
const hoje = () => new Date().toISOString().slice(0, 10);
function semanaKey(d) { // ISO week, ex.: 2026-W44 (ranking semanal zera toda segunda)
  d = d ? new Date(d) : new Date(); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dow = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - dow);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return t.getUTCFullYear() + '-W' + String(Math.ceil(((t - y0) / 864e5 + 1) / 7)).padStart(2, '0');
}
function marcaDia() {
  const h = hoje(); if (S.last === h) return;
  const ontem = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  S.streak = S.last === ontem ? S.streak + 1 : 1; S.last = h;
}
const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const temaPct = t => { const d = S.done[t.id] || {}; return t.licoes.length ? Math.round(100 * t.licoes.filter((_, i) => d[i]).length / t.licoes.length) : 0; };
const dataBr = iso => { if (!iso) return ''; const [y, m, d] = iso.split('-'); return d + '/' + m + '/' + y; };
function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2600); }

/* ===== NAVEGAÇÃO ===== */
function go(h) { if (location.hash !== '#' + h) location.hash = h; else render(); }
function render() {
  const h = (location.hash || '#temas').slice(1);
  if (!DEMO && !USER) return login();
  jogoAtual = null;
  if (h === 'milhao') return jogo({ id: '', titulo: 'Todas as matérias' }, 'milhao');
  if (h.startsWith('tema-')) { const [id, aba, sub] = h.slice(5).split('/'); const t = TEMAS.find(x => x.id === id); return t ? (aba === 'jogos' && sub ? jogo(t, sub) : tema(t, aba || 'trilha')) : home(); }
  if (h === 'ranking') return ranking();
  if (h === 'perfil') return perfil();
  home();
}
window.addEventListener('hashchange', render);
function barra(atual) {
  nav.hidden = false;
  nav.innerHTML = [['temas', 'Temas', I.home], ['ranking', 'Ranking', I.trophy], ['perfil', 'Perfil', I.user]].map(b => `<button data-h="${b[0]}" ${atual === b[0] ? 'aria-current="page"' : ''}>${b[2]}${b[1]}</button>`).join('');
  nav.querySelectorAll('button').forEach(b => b.onclick = () => go(b.dataset.h));
}
function topo(back) {
  return `<div class="top">${back ? `<button class="back" id="bk" aria-label="Voltar">&#8592;</button>` : ''}<button class="brand" id="hm"><span class="lg">${I.tooth}</span>${APP}</button><span class="stat" title="Dias seguidos">${I.flame}${S.streak}</span><span class="stat" title="Pontos">${I.xp}${S.xp}</span>${somBtn()}</div>`;
}
/* Botão de mudo (sons.js): o clique é por delegação porque render() refaz o HTML a cada tela. */
function somBtn() { let m = false; try { if (!window.Sons) return ''; m = Sons.mudo(); } catch (e) { return ''; } return `<button type="button" class="stat som" data-som aria-label="Silenciar sons" aria-pressed="${m}" title="${m ? 'Som desligado' : 'Som ligado'}">${m ? '🔇' : '🔊'}</button>`; }
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('[data-som]'); if (!b || !window.Sons) return; try { const m = Sons.alternarMudo(); document.querySelectorAll('[data-som]').forEach(x => { x.textContent = m ? '🔇' : '🔊'; x.setAttribute('aria-pressed', String(m)); x.title = m ? 'Som desligado' : 'Som ligado'; }); if (!m) Sons.tocar('clique'); } catch (err) { } });
/* Bordão em texto (sons.js); sem Sons ou com erro, fica o texto de reserva. */
function bordaoOu(momento, reserva) { try { return (window.Sons && Sons.bordao(momento)) || reserva; } catch (e) { return reserva; } }
function ligaTopo(fn) { const b = $('#bk'); if (b) b.onclick = fn; $('#hm').onclick = () => go('temas'); }

/* ===== LOGIN ===== */
function login(msg) {
  nav.hidden = true;
  app.innerHTML = `<div class="login"><span class="lg">${I.tooth}</span><h1>${APP}</h1><p>Estude Odontologia jogando. Lições, simulado, cartas e mapa mental de cada aula, com ranking da turma.</p><button class="btn google" id="gl">${I.google} Entrar com Google</button>${msg ? `<p class="err">${esc(msg)}</p>` : ''}<p class="note">Entrar serve só pra guardar seu progresso e, se você quiser, aparecer no ranking.</p></div>`;
  $('#gl').onclick = async () => {
    const p = new firebase.auth.GoogleAuthProvider();
    try {
      if (/Android|iPhone|iPad/i.test(navigator.userAgent)) await FB.auth().signInWithRedirect(p);
      else await FB.auth().signInWithPopup(p);
    } catch (e) { login(e && e.code === 'auth/popup-blocked' ? 'O navegador bloqueou a janela de login. Tente de novo.' : 'Não deu pra entrar agora. ' + (e && e.message || '')); }
  };
}

/* ===== HOME ===== */
function home() {
  barra('temas');
  const porMateria = {};
  TEMAS.forEach(t => { (porMateria[t.materia || 'Geral'] = porMateria[t.materia || 'Geral'] || []).push(t); });
  const ultima = TEMAS.filter(t => t.aula).sort((a, b) => (b.aula || '').localeCompare(a.aula || ''))[0];
  const milhao = (window.JOGOS || []).find(j => j.id === 'milhao'); let milhaoOk = false; try { milhaoOk = !!milhao && milhao.disponivel(); } catch (e) { }
  const cardTema = t => `<button class="tema" data-id="${t.id}"><span class="ico" style="background:${t.cor || '#2f8fe0'}">${I.tooth}</span><span style="flex:1;min-width:0"><h3>${esc(t.titulo)}</h3><small>${esc(t.sub)}</small>${t.aula ? `<span class="meta">Aula de ${dataBr(t.aula)}</span>` : ''}<div class="bar"><i style="width:${temaPct(t)}%"></i></div></span></button>`;
  app.innerHTML = topo(false) + `<div class="hero"><h1>${S.nome ? 'Fala, ' + esc(S.nome.split(' ')[0]) : 'Estude jogando'}</h1><p>Escolha um tema, faça as lições, treine no simulado e revise com cartas e mapa mental.</p></div>` +
    (milhaoOk ? `<button class="milhao-faixa" id="mil"><span class="mf-luz"></span><span class="mf-txt"><small>Jogo da turma</small><b>${esc(milhao.nome)}</b><span>15 perguntas, de R$ 1 mil a R$ 1 milhão</span></span><span class="mf-go">Jogar</span></button>` : '') +
    (ultima ? `<div class="ultima"><span class="eyebrow">Última aula · ${dataBr(ultima.aula)}</span><h3>${esc(ultima.titulo)}</h3><p>${esc(ultima.sub)}</p><button class="btn sm" data-id="${ultima.id}">Continuar o estudo</button></div>` : '') +
    Object.keys(porMateria).sort().map(m => `<div class="materia"><h2>${esc(m)}</h2><div class="temas">${porMateria[m].sort((a, b) => (b.aula || '').localeCompare(a.aula || '')).map(cardTema).join('')}</div></div>`).join('') +
    `<p class="note">Material de estudo feito a partir do que o professor passou. Dose e conduta clínica valem as do professor.${DEMO ? '<br>Modo demonstração: progresso só neste aparelho.' : ''}<br>Mônica Fontes · inteligência artificial da turma de Odontologia</p>`;
  ligaTopo();
  app.querySelectorAll('[data-id]').forEach(b => b.onclick = () => go('tema-' + b.dataset.id));
  const mil = $('#mil'); if (mil) mil.onclick = () => go('milhao');
  window.scrollTo(0, 0);
}

/* ===== TEMA ===== */
function tema(t, aba) {
  barra('temas');
  const d = S.done[t.id] || {};
  const abas = [['trilha', 'Trilha', I.trilha], ['simulado', 'Simulado', I.simu], ['jogos', 'Jogos', I.game], ['cartas', 'Cartas', I.cards], ['mapa', 'Mapa', I.mapa]];
  let corpo = '';
  if (aba === 'jogos') {
    const lista = (window.JOGOS || []).filter(j => { try { return !j.global && j.disponivel(t); } catch (e) { return false; } });
    corpo = (lista.length ? `<div class="temas">${lista.map(j => `<button class="tema" data-j="${esc(j.id)}"><span class="ico" style="background:${CORES[(window.JOGOS || []).indexOf(j) % CORES.length]}">${j.icone}</span><span style="flex:1;min-width:0"><h3>${esc(j.nome)}</h3><small>${esc(j.desc)}</small></span></button>`).join('')}</div>` : `<div class="card"><p>Este tema ainda não tem jogos. Eles aparecem quando o tema ganha a lista de termos.</p></div>`) + `<p class="fonte">Os jogos valem pontos no ranking e usam só o conteúdo deste tema.</p>`;
  } else if (aba === 'trilha') {
    corpo = `<div class="trilha">${t.licoes.map((l, i) => `<div class="no-wrap"><button class="no ${d[i] ? 'feito' : ''}" data-i="${i}" aria-label="Lição ${i + 1}: ${esc(l.nome)}">${d[i] ? I.check : I.play}</button><span>${esc(l.nome)}</span><small>${l.qs.length} perguntas${d[i] ? ' · concluída' : ''}</small></div>`).join('')}</div><p class="fonte">${esc(t.fonte)}</p>`;
  } else if (aba === 'simulado') {
    const n = t.licoes.reduce((a, l) => a + l.qs.length, 0);
    corpo = `<div class="card"><h3>Simulado</h3><p>Todas as perguntas do tema misturadas, com tempo e sem aviso de certo ou errado até o fim. Treina o que a prova cobra.</p><div class="chips" style="justify-content:flex-start"><span class="stat">${n} perguntas</span><span class="stat">sem vidas</span></div><button class="btn vio" id="go">Começar simulado</button></div><p class="fonte">${esc(t.fonte)}</p>`;
  } else if (aba === 'cartas') {
    corpo = `<div id="fc"></div><p class="fonte">${esc(t.fonte)}</p>`;
  } else {
    corpo = `<label class="switch"><input type="checkbox" id="oc"> Esconder as respostas e tocar para revelar</label><div class="mapa" id="mp"></div><p class="fonte">${esc(t.fonte)}</p>`;
  }
  app.innerHTML = topo(true) + `<div class="thead"><h2>${esc(t.titulo)}</h2><p>${esc(t.sub)}${t.aula ? ' · aula de ' + dataBr(t.aula) : ''}</p></div><div class="tabs" role="tablist">${abas.map(a => `<button class="tab" role="tab" aria-selected="${a[0] === aba}" data-a="${a[0]}">${a[2]}${a[1]}</button>`).join('')}</div>${corpo}`;
  ligaTopo(() => go('temas'));
  app.querySelectorAll('.tab').forEach(b => b.onclick = () => go('tema-' + t.id + '/' + b.dataset.a));
  if (aba === 'jogos') app.querySelectorAll('[data-j]').forEach(b => b.onclick = () => go('tema-' + t.id + '/jogos/' + b.dataset.j));
  if (aba === 'trilha') app.querySelectorAll('.no').forEach(b => b.onclick = () => sessao(t, { modo: 'licao', i: +b.dataset.i }));
  if (aba === 'simulado') $('#go').onclick = () => sessao(t, { modo: 'simulado' });
  if (aba === 'cartas') cartas(t);
  if (aba === 'mapa') mapa(t);
  window.scrollTo(0, 0);
}

/* ===== SESSÃO (lição e simulado) ===== */
function sessao(t, cfg) {
  nav.hidden = true;
  const sim = cfg.modo === 'simulado';
  const qs = sim ? shuf(t.licoes.flatMap(l => l.qs)) : shuf(t.licoes[cfg.i].qs);
  const st = { i: 0, vidas: 5, pontos: 0, acertos: 0, erros: [], t0: Date.now(), tmp: null };
  window.Sons && Sons.tocar(sim ? 'contagem' : 'novo', sim ? 'ja' : undefined);
  const voltar = () => go('tema-' + t.id + '/' + (sim ? 'simulado' : 'trilha'));
  if (sim) st.tmp = setInterval(() => { const e = $('#tm'); if (!e) { clearInterval(st.tmp); return; } const s = Math.floor((Date.now() - st.t0) / 1000); e.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }, 500);
  function pergunta() {
    if (st.i >= qs.length) return fim();
    const q = qs[st.i], pct = Math.round(100 * st.i / qs.length);
    app.innerHTML = `<div class="sess"><div class="prog"><button class="back" id="sair" aria-label="Sair">&#10005;</button><div class="bar"><i style="width:${pct}%"></i></div>${sim ? `<span class="timer" id="tm">00:00</span>` : `<span class="hearts">${I.heart}${st.vidas}</span>`}${somBtn()}</div><div class="tag">${q.t === 'par' ? 'Ligue os pares' : q.t === 'vf' ? 'Verdadeiro ou falso' : 'Escolha a resposta'}</div><div class="q">${esc(q.q)}</div><div id="corpo"></div><div id="fb"></div></div>`;
    $('#sair').onclick = () => { clearInterval(st.tmp); voltar(); };
    if (q.t === 'mc') mc(q); else if (q.t === 'vf') vf(q); else par(q);
    window.scrollTo(0, 0);
  }
  function conta(ok) { S.total++; if (ok) S.acertos++; }
  function resp(q, ok, textoCerta) {
    if (sim) window.Sons && Sons.tocar('clique');
    conta(ok);
    if (ok) { st.acertos++; st.pontos += 10; } else { st.erros.push({ q: q.q, c: textoCerta }); if (!sim) st.vidas--; }
    if (sim) { st.i++; pergunta(); return; }
    const morreu = st.vidas <= 0;
    window.Sons && Sons.tocar(ok ? 'acerto_jogo' : 'erro_jogo');
    $('#fb').innerHTML = `<div class="feed ${ok ? 'ok' : 'bad'}"><b>${esc(ok ? bordaoOu('acerto_jogo', 'Isso aí') : bordaoOu('erro_jogo', 'Quase'))}</b>${q.w ? `<p>${esc(q.w)}</p>` : ''}${!ok && textoCerta ? `<p><strong>Certo:</strong> ${esc(textoCerta)}</p>` : ''}<button class="btn ${ok ? '' : 'gum'}" id="nx">${morreu ? 'Acabaram as vidas' : 'Continuar'}</button></div>`;
    $('#nx').onclick = () => { if (morreu) fim(true); else { st.i++; pergunta(); } };
    $('#nx').scrollIntoView({ block: 'nearest' });
  }
  function mc(q) {
    const o = shuf(q.o.map((x, i) => ({ x, c: i === q.a })));
    $('#corpo').innerHTML = `<div class="opts">${o.map((e, i) => `<button class="opt" data-i="${i}">${esc(e.x)}</button>`).join('')}</div>` + (sim ? `<button class="btn full" id="ok" disabled style="margin-top:14px">Confirmar</button>` : '');
    let sel = -1; const bs = [...document.querySelectorAll('.opt')];
    const decide = i => { bs.forEach(b => b.style.pointerEvents = 'none'); bs[i].classList.add(o[i].c ? 'ok' : 'bad'); bs[o.findIndex(e => e.c)].classList.add('ok'); resp(q, o[i].c, q.o[q.a]); };
    bs.forEach((b, i) => b.onclick = () => { if (sim) { sel = i; bs.forEach(x => x.classList.remove('sel')); b.classList.add('sel'); $('#ok').disabled = false; } else decide(i); });
    if (sim) $('#ok').onclick = () => resp(q, o[sel].c, q.o[q.a]);
  }
  function vf(q) {
    $('#corpo').innerHTML = `<div class="vf"><button class="opt" data-v="1">Verdadeiro</button><button class="opt" data-v="0">Falso</button></div>`;
    const bs = [...document.querySelectorAll('.opt')];
    bs.forEach(b => b.onclick = () => { const v = b.dataset.v === '1', ok = v === q.a; bs.forEach(x => x.style.pointerEvents = 'none'); if (!sim) { b.classList.add(ok ? 'ok' : 'bad'); if (!ok) bs[q.a ? 0 : 1].classList.add('ok'); } resp(q, ok, q.a ? 'Verdadeiro' : 'Falso'); });
  }
  function par(q) {
    const L = shuf(q.p.map((p, i) => ({ x: p[0], i }))), R = shuf(q.p.map((p, i) => ({ x: p[1], i })));
    $('#corpo').innerHTML = `<div class="pares"><div class="col" id="cl">${L.map((e, k) => `<button class="opt" data-k="${k}">${esc(e.x)}</button>`).join('')}</div><div class="col" id="cr">${R.map((e, k) => `<button class="opt" data-k="${k}">${esc(e.x)}</button>`).join('')}</div></div>`;
    const bl = [...$('#cl').children], br = [...$('#cr').children]; let a = -1, feitos = 0, erros = 0;
    const cores = ['var(--vio)', 'var(--mint)', 'var(--gum)', 'var(--sky)', 'var(--sun)'];
    bl.forEach((b, k) => b.onclick = () => { bl.forEach(x => x.classList.remove('sel')); a = k; b.classList.add('sel'); });
    br.forEach((b, k) => b.onclick = () => {
      if (a < 0) return;
      if (L[a].i === R[k].i) {
        const c = cores[feitos % 5];
        [bl[a], b].forEach(x => { x.classList.remove('sel'); x.classList.add('done'); x.style.borderColor = c; x.style.background = 'color-mix(in srgb,' + c + ' 18%,var(--surface))'; });
        a = -1; feitos++;
        if (!sim && window.Sons) { if (feitos < q.p.length) Sons.tocar('moeda'); else if (erros === 0) Sons.tocar('acerto_jogo'); }
        if (feitos === q.p.length) {
          const ok = erros === 0; conta(ok);
          if (sim) { if (ok) { st.acertos++; st.pontos += 10; } else st.erros.push({ q: q.q, c: '' }); st.i++; pergunta(); return; }
          if (ok) { st.acertos++; st.pontos += 10; } else st.erros.push({ q: q.q, c: '' });
          $('#fb').innerHTML = `<div class="feed ${ok ? 'ok' : 'bad'}"><b>${ok ? 'Isso aí' : 'Terminou'}</b><p>${ok ? 'Todos os pares certos.' : 'Ligações certas, com ' + erros + ' erro(s) no caminho.'}</p><button class="btn ${ok ? '' : 'gum'}" id="nx">Continuar</button></div>`;
          $('#nx').onclick = () => { st.i++; pergunta(); }; $('#nx').scrollIntoView({ block: 'nearest' });
        }
      } else {
        erros++;
        if (!sim) window.Sons && Sons.tocar('erro_jogo');
        if (!sim) { st.vidas--; const h = document.querySelector('.hearts'); if (h) h.innerHTML = I.heart + Math.max(st.vidas, 0); }
        b.classList.add('shake'); bl[a].classList.add('shake');
        setTimeout(() => { b.classList.remove('shake'); bl.forEach(x => x.classList.remove('shake', 'sel')); a = -1; }, 380);
        if (!sim && st.vidas <= 0) { conta(false); setTimeout(() => fim(true), 420); }
      }
    });
  }
  function fim(perdeu) {
    clearInterval(st.tmp);
    const total = qs.length, nota = Math.round(100 * st.acertos / total), ganho = perdeu ? 0 : st.pontos + (sim ? 0 : 20);
    window.Sons && Sons.tocar(perdeu ? 'gameover' : !sim ? 'nivel' : nota >= 80 ? 'nota_alta' : nota >= 50 ? 'nota_media' : 'nota_baixa');
    if (!perdeu) {
      S.xp += ganho; const wk = semanaKey(); S.xpSemana = S.xpSemana || {}; S.xpSemana[wk] = (S.xpSemana[wk] || 0) + ganho; marcaDia();
      if (!sim) { S.done[t.id] = S.done[t.id] || {}; S.done[t.id][cfg.i] = true; }
    }
    salvar();
    const tempo = Math.floor((Date.now() - st.t0) / 1000);
    const frase = bordaoOu(perdeu ? 'gameover' : !sim ? 'nivel' : nota >= 80 ? 'nota_alta' : nota >= 50 ? 'nota_media' : 'nota_baixa', '');
    app.innerHTML = `<div class="fim"><div class="big" style="color:${perdeu ? 'var(--gum)' : 'var(--mint)'}">${perdeu ? 'Quase lá' : nota + '%'}</div><h2>${perdeu ? 'As vidas acabaram' : sim ? 'Simulado terminado' : 'Lição concluída'}</h2>${frase ? `<p>${esc(frase)}</p>` : ''}<div class="chips"><span class="stat">${I.xp}+${ganho}</span><span class="stat">${st.acertos}/${total} certas</span>${sim ? `<span class="stat">${Math.floor(tempo / 60)}min ${tempo % 60}s</span>` : ''}</div>${st.erros.length ? `<div class="rev"><h3>Para rever</h3>${st.erros.map(e => `<div>${esc(e.q)}${e.c ? `<br><b>Certo:</b> ${esc(e.c)}` : ''}</div>`).join('')}</div>` : ''}<button class="btn" id="a1">${perdeu ? 'Tentar de novo' : 'Continuar'}</button><button class="btn ghost" id="a2">Voltar ao tema</button></div>`;
    $('#a1').onclick = () => perdeu ? sessao(t, cfg) : voltar(); $('#a2').onclick = voltar; window.scrollTo(0, 0);
  }
  pergunta();
}

/* ===== JOGOS (arquivos em games/*.js, registrados em window.JOGOS) ===== */
let jogoAtual = null;
function jogo(t, id) {
  const j = (window.JOGOS || []).find(x => x.id === id);
  const volta = () => (t.id ? go('tema-' + t.id + '/jogos') : go('temas'));
  if (!j) return volta();
  nav.hidden = true;
  app.innerHTML = topo(true) + `<div class="thead"><h2>${esc(j.nome)}</h2><p>${esc(t.titulo)}</p></div><div id="jg"></div>`;
  ligaTopo(volta);
  const token = {}; jogoAtual = token; let fechou = false;
  const api = {
    esc, shuf, cores: CORES.slice(),
    toast,
    ganhou(p, msg) {
      if (jogoAtual !== token || fechou) return; fechou = true;
      p = Math.max(0, Math.min(60, Math.round(+p || 0)));
      S.xp += p; const wk = semanaKey(); S.xpSemana = S.xpSemana || {}; S.xpSemana[wk] = (S.xpSemana[wk] || 0) + p; marcaDia(); salvar();
      toast((msg ? msg + ' ' : '') + '+' + p + ' pontos');
    },
    perdeu(msg) { if (jogoAtual !== token || fechou) return; fechou = true; if (msg) toast(msg); },
    voltar() { volta(); },
  };
  try { j.montar($('#jg'), t, api); } catch (e) { console.error('jogo', id, e); $('#jg').innerHTML = `<div class="card"><p>Esse jogo não abriu agora. Tente outro.</p></div>`; }
  window.scrollTo(0, 0);
}

/* ===== CARTAS ===== */
function cartas(t) {
  let ordem = shuf(t.cards.map((_, i) => i)), k = 0, v = false;
  const box = $('#fc');
  function draw() {
    if (box.innerHTML) window.Sons && Sons.tocar('pagina');
    const c = t.cards[ordem[k]];
    box.innerHTML = `<div class="fcount">${k + 1} de ${ordem.length}</div><div class="flash"><button id="fl" aria-label="Virar a carta"><div class="face ${v ? 'v' : 'f'}"><div><small>${v ? 'Resposta' : 'Pergunta'}</small>${esc(v ? c[1] : c[0])}</div></div></button></div><div class="row2" style="margin-top:14px"><button class="btn ghost" id="pv">Anterior</button><button class="btn" id="nx2">Próxima</button></div><button class="btn ghost full" id="sh" style="margin-top:12px">Embaralhar</button>`;
    $('#fl').onclick = () => { v = !v; draw(); }; $('#pv').onclick = () => { k = (k - 1 + ordem.length) % ordem.length; v = false; draw(); }; $('#nx2').onclick = () => { k = (k + 1) % ordem.length; v = false; draw(); }; $('#sh').onclick = () => { ordem = shuf(ordem); k = 0; v = false; draw(); };
  }
  draw();
}

/* ===== MAPA MENTAL ===== */
function mapa(t) {
  const m = t.mapa || { centro: t.titulo, ramos: [] };
  $('#mp').innerHTML = `<div class="centro">${esc(m.centro)}</div><div class="tronco"></div>` + m.ramos.map((r, k) => `<div class="ramo" style="--c:${r.cor || CORES[k % CORES.length]}"><div><i>${esc(r.n || k + 1)}</i>${esc(r.t)}</div><div class="folhas">${r.i.map(x => `<button class="folha">${esc(x)}</button>`).join('')}</div></div>`).join('');
  const oc = $('#oc');
  oc.onchange = () => document.querySelectorAll('.folha').forEach(f => f.classList.toggle('oculta', oc.checked));
  document.querySelectorAll('.folha').forEach(f => f.onclick = () => f.classList.remove('oculta'));
}

/* ===== RANKING ===== */
const pctDe = p => p.total >= 20 ? Math.round(100 * (p.acertos || 0) / p.total) : null;
async function ranking(aba) {
  barra('ranking'); aba = aba || 'semana';
  const wk = semanaKey();
  const abas = [['semana', 'Esta semana'], ['acertos', '% de acertos'], ['dias', 'Dias seguidos']];
  app.innerHTML = topo(false) + `<div class="thead"><h2>Ranking da turma</h2><p>${aba === 'semana' ? 'Pontos desta semana. Zera toda segunda-feira.' : aba === 'acertos' ? 'Porcentagem de acertos, com pelo menos 20 respostas.' : 'Dias seguidos estudando.'}</p></div><div class="rtabs">${abas.map(a => `<button class="tab" aria-selected="${a[0] === aba}" data-a="${a[0]}">${a[1]}</button>`).join('')}</div><div class="rank" id="rk"><div class="skel"></div><div class="skel"></div></div><p class="note" id="rn"></p>`;
  ligaTopo();
  app.querySelectorAll('.tab').forEach(b => b.onclick = () => ranking(b.dataset.a));
  const rk = $('#rk'), rn = $('#rn');
  if (DEMO) { rk.innerHTML = `<div class="card"><h3>Ranking entra com o login da turma</h3><p>Nesta versão de demonstração o progresso fica só no seu aparelho. Seus números de hoje: ${S.xpSemana[wk] || 0} pontos na semana, ${pctDe(S) == null ? 'ainda sem 20 respostas' : pctDe(S) + '% de acertos'}, ${S.streak} dia(s) seguido(s).</p></div>`; rn.textContent = ''; return; }
  let perfis = PERFIS_CACHE;
  if (!perfis) {
    try { const snap = await DB.collection('perfis').where('ranking', '==', true).limit(200).get(); perfis = snap.docs.map(d => Object.assign({ uid: d.id }, d.data())); PERFIS_CACHE = perfis; setTimeout(() => PERFIS_CACHE = null, 60000); }
    catch (e) { rk.innerHTML = `<div class="card"><p>Não consegui carregar o ranking agora.</p></div>`; return; }
  }
  const val = p => aba === 'semana' ? ((p.xpSemana || {})[wk] || 0) : aba === 'acertos' ? pctDe(p) : (p.streak || 0);
  const lista = perfis.map(p => ({ p, v: val(p) })).filter(x => x.v != null).sort((a, b) => b.v - a.v || (b.p.xp || 0) - (a.p.xp || 0));
  const fmt = v => aba === 'acertos' ? v + '%' : String(v);
  const linha = (x, i) => `<div class="rrow ${x.p.uid === USER.uid ? 'me' : ''}"><span class="pos ${i < 3 ? 'p' + (i + 1) : ''}">${i + 1}</span><img class="av" src="${esc(x.p.foto || '')}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'"><span class="nm">${esc(x.p.nome || 'Aluno')}<small>${x.p.xp || 0} pontos no total</small></span><span class="val">${fmt(x.v)}</span></div>`;
  const top = lista.slice(0, 20);
  rk.innerHTML = top.length ? top.map(linha).join('') : `<div class="card"><p>Ninguém no ranking ainda. Faça uma lição e marque "aparecer no ranking" no seu perfil.</p></div>`;
  const minha = lista.findIndex(x => x.p.uid === USER.uid);
  if (minha >= 20) rk.innerHTML += `<div class="note">…</div>` + linha(lista[minha], minha);
  rn.textContent = S.ranking ? '' : 'Você não aparece aqui porque não marcou "aparecer no ranking" no perfil.';
}

/* ===== PERFIL ===== */
function perfil() {
  barra('perfil');
  const pct = pctDe(S), feitas = Object.values(S.done || {}).reduce((a, d) => a + Object.values(d).filter(Boolean).length, 0);
  const admin = USER && ADMIN_EMAILS.includes(USER.email || '');
  app.innerHTML = topo(false) + `<div class="perfil"><img class="av" src="${esc(S.foto || (USER && USER.photoURL) || '')}" alt="" referrerpolicy="no-referrer" onerror="this.style.visibility='hidden'"><h2>${esc(S.nome || (USER && USER.displayName) || 'Visitante')}</h2>${DEMO ? '<p class="note">Modo demonstração: sem login, progresso só neste aparelho.</p>' : ''}<div class="stats"><div><b>${S.xp}</b><small>pontos</small></div><div><b>${S.streak}</b><small>dias seguidos</small></div><div><b>${pct == null ? '–' : pct + '%'}</b><small>acertos</small></div><div><b>${feitas}</b><small>lições feitas</small></div><div><b>${S.total}</b><small>respostas</small></div><div><b>${(S.xpSemana || {})[semanaKey()] || 0}</b><small>esta semana</small></div></div>` +
    (() => { const v = visualAtual(); return `<div class="card" style="width:100%;text-align:left"><h3>Visual</h3><div class="visual" role="group" aria-label="Visual do app"><button type="button" class="btn sm ${v === 'normal' ? '' : 'ghost'}" data-vis="normal" aria-pressed="${v === 'normal'}">Normal</button><button type="button" class="btn sm px-amostra ${v === 'pixel' ? '' : 'ghost'}" data-vis="pixel" aria-pressed="${v === 'pixel'}">Pixel</button></div><p class="fonte">Pixel deixa botões e títulos com cara de videogame. Fica salvo neste aparelho.</p></div>`; })() +
    (DEMO ? '' : `<div class="card" style="width:100%;text-align:left"><label class="switch"><input type="checkbox" id="rk" ${S.ranking ? 'checked' : ''}> Aparecer no ranking da turma</label><p class="fonte">Quem marca aparece com nome e foto do Google pra turma. Desmarque quando quiser.</p></div><button class="btn ghost" id="out">Sair</button>`) +
    (admin ? `<div class="card" style="width:100%;text-align:left"><h3>Publicar tema (admin)</h3><p class="fonte">Cole o JSON de um tema gerado pela Mônica. Ele entra na coleção "temas" e aparece pra turma.</p><textarea id="tj" rows="6" style="width:100%;font:13px monospace;border-radius:12px;border:2px solid var(--line);background:var(--surface);color:var(--ink);padding:8px"></textarea><button class="btn vio sm" id="tp">Publicar</button><p class="fonte" id="ts"></p></div>` : '') + `</div>`;
  ligaTopo();
  app.querySelectorAll('[data-vis]').forEach(b => b.onclick = () => { const v = b.dataset.vis; try { localStorage.setItem(VISUAL_KEY, v); } catch (e) { } aplicaVisual(v); perfil(); toast(v === 'pixel' ? 'Visual pixel ligado' : 'Visual normal ligado'); });
  if (!DEMO) {
    $('#rk').onchange = e => { S.ranking = e.target.checked; salvar(); toast(S.ranking ? 'Você entrou no ranking' : 'Você saiu do ranking'); };
    $('#out').onclick = () => FB.auth().signOut();
  }
  if (admin) $('#tp').onclick = async () => {
    const ts = $('#ts');
    try { const t = JSON.parse($('#tj').value); if (!t.id || !t.titulo || !Array.isArray(t.licoes)) throw new Error('faltou id, titulo ou licoes'); await DB.collection('temas').doc(t.id).set(t); ts.textContent = 'Publicado: ' + t.titulo; await carregaTemas(); }
    catch (e) { ts.textContent = 'Não publicou: ' + (e.message || e); }
  };
}

/* ===== CARREGAMENTO ===== */
async function carregaTemas() {
  let base = [];
  try { base = await (await fetch('temas-base.json', { cache: 'no-cache' })).json(); } catch (e) { console.warn('temas-base', e); }
  const mapaT = {}; base.forEach(t => mapaT[t.id] = t);
  if (!DEMO && DB && USER) {
    try { const snap = await DB.collection('temas').get(); snap.docs.forEach(d => mapaT[d.id] = Object.assign({ id: d.id }, d.data())); } catch (e) { console.warn('temas', e); }
  }
  TEMAS = Object.values(mapaT).filter(t => Array.isArray(t.licoes) && t.licoes.length).map(t => Object.assign({ cor: CORES[0], cards: [], mapa: { centro: t.titulo, ramos: [] } }, t));
}
async function entrou(u) {
  USER = u;
  try {
    const d = await DB.collection('perfis').doc(u.uid).get();
    if (d.exists) { const r = d.data(); S = Object.assign(S, r, { xp: Math.max(S.xp || 0, r.xp || 0) }); }
    S.nome = u.displayName || S.nome || ''; S.foto = u.photoURL || '';
    salvar();
  } catch (e) { console.warn('perfil', e); }
  await carregaTemas();
  render();
}
async function boot() {
  $('#lg0').innerHTML = I.tooth;
  if (window.FIREBASE_CONFIG && window.firebase) {
    DEMO = false;
    FB = firebase.initializeApp(window.FIREBASE_CONFIG); DB = FB.firestore();
    try { await FB.auth().getRedirectResult(); } catch (e) { console.warn('redirect', e); }
    FB.auth().onAuthStateChanged(u => { if (u) entrou(u); else { USER = null; PERFIS_CACHE = null; render(); } });
  } else {
    DEMO = true; await carregaTemas(); render();
  }
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => { });
}
boot();
