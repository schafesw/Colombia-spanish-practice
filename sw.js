/* Navigation network-first + stale-while-revalidate asset Service Worker for Español · Colombia PWA (v105.0) */
const CACHE_NAME = "esco-pwa-v106.1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./data.js",
  "./manifest.json",
  "./icon-512.png",
  "./icon-192.png",
  "./apple-touch-icon.png",
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
  "./pm-aguacero.webp",
  "./pm-pasaporte.webp",
  "./pm-recibo.webp",
  "./pm-llaves.webp",
  "./pm-datafono.webp",
  "./pm-cajero.webp",
  "./pm-panela.webp",
  "./pm-chicharron.webp",
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
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;
  const isNav = req.mode === "navigate" || ((req.headers.get("accept") || "").includes("text/html"));

  if (isNav) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: true })
            .then(cached => cached || caches.match("./index.html", { ignoreSearch: true }))
            .then(res => res || Response.error())
        )
    );
    return;
  }

  if (sameOrigin) {
    event.respondWith(
      caches.match(req, { ignoreSearch: true }).then(cached => {
        const netFetch = fetch(req)
          .then(res => {
            if (res && res.status === 200 && res.type === "basic") {
              const copy = res.clone();
              caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => null);
        if (cached) {
          event.waitUntil(netFetch);
          return cached;
        }
        return netFetch.then(res => res || Response.error());
      })
    );
    return;
  }

  event.respondWith(
    fetch(req).catch(() => caches.match(req).then(cached => cached || Response.error()))
  );
});
