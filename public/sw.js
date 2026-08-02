const CACHE = 'salve-shell-v1';
const SHELL = ['/', '/logo-salve.svg', '/logo-salve.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.mode !== 'navigate') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        e.waitUntil(caches.open(CACHE).then((c) => c.put('/', copy)));
        return res;
      })
      .catch(() => caches.match('/'))
  );
});
