// Pedro Mendinhos CUE — Service Worker
// Bump do nome do cache a cada versao publicada (v3 -> v4 -> ...)
const CACHE = 'pedro-cue-v5';

// Nomes SEM hifen — tem de bater certo com os ficheiros reais do repositorio
const FILES = ['./', './index.html', './manifest-lite.json', './icon192.png', './icon512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      // cache.add() individual em vez de addAll():
      // addAll() e "tudo ou nada" — se UM ficheiro falhar, a instalacao inteira
      // aborta e a app fica sem modo offline. Assim, um ficheiro em falta
      // apenas fica de fora; o resto e cacheado na mesma.
      Promise.all(FILES.map(f =>
        c.add(f).catch(err => console.warn('[SW] falhou cache de', f, err))
      ))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});
