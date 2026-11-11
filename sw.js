// Service worker do Dentolingu: guarda a casca do app pra abrir rápido e funcionar sem rede (os temas já vistos ficam no cache).
const V = 'dentolingu-v3'; // 06/11: troca de versão limpa o cache antigo dos celulares
const SHELL = ['./', './index.html', './styles.css', './app.js', './firebase-config.js', './temas-base.json', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;  // Firebase, fontes e Google ficam fora do cache
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
