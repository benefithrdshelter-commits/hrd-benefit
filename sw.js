// Service worker HRD Benefit: menyimpan "cangkang" aplikasi supaya cepat dibuka
// dan bisa di-install. Data & halaman Apps Script tetap selalu diambil online.
const CACHE = 'hrd-benefit-v2';
const FILE_CANGKANG = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './maskable-512.png',
  './apple-touch-icon.png', './favicon-32.png', './logo-launcher.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILE_CANGKANG)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Hanya file cangkang (domain sendiri) yang ditangani: coba online dulu, kalau gagal pakai cache.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const salinan = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, salinan));
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
