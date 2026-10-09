// Service worker HRD Benefit: menyimpan tampilan aplikasi di HP supaya terbuka instan.
// Data (Apps Script) TIDAK disimpan di sini, selalu diambil langsung dari server.
var CACHE = 'hrd-benefit-v8';
var ASET = [
  './', './index.html', './d.html', './manifest.webmanifest',
  './p/Dashboard.html', './p/DashboardKaryawan.html', './p/DashboardKecelakaan.html', './p/DashboardKeluargaAdmin.html', './p/DashboardKoreksi.html', './p/DashboardKritikSaran.html', './p/DashboardPaymentKesehatan.html', './p/Identitas.html', './p/RiwayatSaldoKaryawan.html', './p/DashboardPaymentKetenagakerjaan.html', './p/DashboardPerbaikanNPP.html', './p/DashboardPesan.html', './p/FormKaryawan.html', './p/FormKecelakaan.html', './p/FormKeluargaKaryawan.html', './p/FormKoreksi.html', './p/KritikSaranAnonimKaryawan.html', './p/LandingAdmin.html', './p/RequestQuestionKaryawan.html', './p/RiwayatKeluargaKaryawan.html', './p/RiwayatKoreksiKaryawan.html', './p/Sidebar.html',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png',
  './icons/apple-touch-icon.png', './icons/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASET); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

// Tampilan: ambil dari simpanan HP dulu (instan), lalu perbarui diam-diam dari GitHub
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(caches.open(CACHE).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (simpan) {
      var baru = fetch(req).then(function (res) {
        if (res && res.ok) c.put(req, res.clone());
        return res;
      }).catch(function () { return simpan; });
      return simpan || baru;
    });
  }));
});
