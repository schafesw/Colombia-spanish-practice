/* Network-first Service Worker with offline fallback for Español · Colombia PWA (v103.0) */
const CACHE_NAME = "esco-pwa-v103.0";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./manifest.json",
  "./icon-512.png",
  "./hero-colombia.webp",
  "./region-sanjuan.webp",
  "./region-bogota.webp",
  "./region-medellin.webp",
  "./region-costa.webp",
  "./region-cali.webp",
  "./guide-grid.webp",
  "./guide-corrientazo.webp",
  "./guide-trampas.webp",
  "./guide-sanjuan.webp",
  "./guide-panaderia.webp",
  "./guide-conectores.webp",
  "./guide-pagos.webp",
  "./guide-comodines.webp",
  "./guide-comida.webp",
  "./guide-modismos.webp",
  "./scene-panaderia.webp",
  "./scene-tienda.webp",
  "./scene-bogota-noche.webp",
  "./pm-tinto.webp",
  "./pm-arepa.webp",
  "./pm-empanada.webp",
  "./pm-lulo.webp",
  "./pm-buseta.webp",
  "./pm-drogueria.webp",
  "./pm-tienda.webp",
  "./pm-esquina.webp",
  "./pm-sombrilla.webp",
  "./pm-abanico.webp",
  "./pm-morral.webp",
  "./pm-sencillo.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(CORE_ASSETS.map(url => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request, { ignoreSearch: true })
          .then(cached => cached || caches.match("./index.html", { ignoreSearch: true }))
      )
  );
});
