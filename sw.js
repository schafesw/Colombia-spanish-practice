/* Navigation network-first + stale-while-revalidate asset Service Worker for Español · Colombia PWA (v107.0) */
const CACHE_NAME = "esco-pwa-v107.0";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./styles/base.css",
  "./styles/labs.css",
  "./styles/polish.css",
  "./data/content.js",
  "./data/expansions.js",
  "./data/index.js",
  "./data/labs.js",
  "./data/phonetics.js",
  "./data/visuals.js",
  "./data/vocab.js",
  "./src/audio/voice-engine.js",
  "./src/core/quiz-bank.js",
  "./src/core/speech-mic.js",
  "./src/core/stores.js",
  "./src/core/text-utils.js",
  "./src/core/validator.js",
  "./src/features/daily-flow.js",
  "./src/features/guides.js",
  "./src/features/lessons-meta.js",
  "./src/features/lessons.js",
  "./src/features/navigation.js",
  "./src/features/phonetics.js",
  "./src/features/phrases.js",
  "./src/features/quiz.js",
  "./src/features/vocab.js",
  "./src/main.js",
  "./src/state/app-state.js",
  "./src/state/preferences.js",
  "./src/state/storage.js",
  "./assets/apple-touch-icon.png",
  "./assets/guide-comida.webp",
  "./assets/guide-comodines.webp",
  "./assets/guide-conectores.webp",
  "./assets/guide-corrientazo.webp",
  "./assets/guide-grid.webp",
  "./assets/guide-modismos.webp",
  "./assets/guide-pagos.webp",
  "./assets/guide-panaderia.webp",
  "./assets/guide-sanjuan.webp",
  "./assets/guide-trampas.webp",
  "./assets/hero-colombia.webp",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/pm-abanico.webp",
  "./assets/pm-aguacero.webp",
  "./assets/pm-arepa.webp",
  "./assets/pm-buseta.webp",
  "./assets/pm-cajero.webp",
  "./assets/pm-chicharron.webp",
  "./assets/pm-datafono.webp",
  "./assets/pm-drogueria.webp",
  "./assets/pm-empanada.webp",
  "./assets/pm-esquina.webp",
  "./assets/pm-llaves.webp",
  "./assets/pm-lulo.webp",
  "./assets/pm-morral.webp",
  "./assets/pm-panela.webp",
  "./assets/pm-pasaporte.webp",
  "./assets/pm-recibo.webp",
  "./assets/pm-sencillo.webp",
  "./assets/pm-sombrilla.webp",
  "./assets/pm-tienda.webp",
  "./assets/pm-tinto.webp",
  "./assets/region-bogota.webp",
  "./assets/region-cali.webp",
  "./assets/region-costa.webp",
  "./assets/region-medellin.webp",
  "./assets/region-sanjuan.webp",
  "./assets/scene-bogota-noche.webp",
  "./assets/scene-panaderia.webp",
  "./assets/scene-tienda.webp"
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
