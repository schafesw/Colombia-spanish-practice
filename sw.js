/* Navigation + JS/CSS network-first, static media stale-while-revalidate Service Worker for Español · Colombia PWA (v129.0) */
const CACHE_NAME = "esco-pwa-v129.0";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./styles/base.css",
  "./styles/labs.css",
  "./styles/polish.css",
  "./styles/shell.css",
  "./styles/studio.css",
  "./data/brain-drills.js",
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
  "./src/features/brain-lab.js",
  "./src/features/colombia-chats.js",
  "./src/features/daily-flow.js",
  "./src/features/guides.js",
  "./src/features/lesson-player.js",
  "./src/features/lessons-meta.js",
  "./src/features/lessons.js",
  "./src/features/navigation.js",
  "./src/features/phonetics.js",
  "./src/features/phrases.js",
  "./src/features/picture-match.js",
  "./src/features/quiz-labs.js",
  "./src/features/quiz.js",
  "./src/features/rapida.js",
  "./src/features/speaking-labs.js",
  "./src/features/studio-shell.js",
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
  "./assets/logo.png",
  "./assets/pm-abanico.webp",
  "./assets/pm-acordeon.webp",
  "./assets/pm-aguacate.webp",
  "./assets/pm-aguacero.webp",
  "./assets/pm-anden.webp",
  "./assets/pm-arepa.webp",
  "./assets/pm-barberia.webp",
  "./assets/pm-billete.webp",
  "./assets/pm-bloqueador.webp",
  "./assets/pm-bunuelo.webp",
  "./assets/pm-buseta.webp",
  "./assets/pm-buso.webp",
  "./assets/pm-cajero.webp",
  "./assets/pm-calentado.webp",
  "./assets/pm-candado.webp",
  "./assets/pm-caneca.webp",
  "./assets/pm-chicharron.webp",
  "./assets/pm-ciclovia.webp",
  "./assets/pm-citofono.webp",
  "./assets/pm-cobija.webp",
  "./assets/pm-corrientazo.webp",
  "./assets/pm-crema-dental.webp",
  "./assets/pm-datafono.webp",
  "./assets/pm-desodorante.webp",
  "./assets/pm-domicilio.webp",
  "./assets/pm-drogueria.webp",
  "./assets/pm-empanada.webp",
  "./assets/pm-enchufe.webp",
  "./assets/pm-escoba.webp",
  "./assets/pm-esquina.webp",
  "./assets/pm-gafas.webp",
  "./assets/pm-gaseosa.webp",
  "./assets/pm-jarabe.webp",
  "./assets/pm-lavadora.webp",
  "./assets/pm-llaves.webp",
  "./assets/pm-lulo.webp",
  "./assets/pm-maleta.webp",
  "./assets/pm-maracuya.webp",
  "./assets/pm-metro.webp",
  "./assets/pm-morral.webp",
  "./assets/pm-mototaxi.webp",
  "./assets/pm-pandebono.webp",
  "./assets/pm-panela.webp",
  "./assets/pm-paradero.webp",
  "./assets/pm-pasaporte.webp",
  "./assets/pm-pastillas.webp",
  "./assets/pm-pesa.webp",
  "./assets/pm-pitillo.webp",
  "./assets/pm-platano.webp",
  "./assets/pm-pocillo.webp",
  "./assets/pm-porteria.webp",
  "./assets/pm-recibo.webp",
  "./assets/pm-repelente.webp",
  "./assets/pm-semaforo.webp",
  "./assets/pm-sencillo.webp",
  "./assets/pm-simcard.webp",
  "./assets/pm-sombrilla.webp",
  "./assets/pm-tacos.webp",
  "./assets/pm-terminal.webp",
  "./assets/pm-termometro.webp",
  "./assets/pm-tienda.webp",
  "./assets/pm-tinto.webp",
  "./assets/region-bogota.webp",
  "./assets/region-cali.webp",
  "./assets/region-costa.webp",
  "./assets/region-medellin.webp",
  "./assets/region-sanjuan.webp",
  "./assets/scene-aeropuerto.webp",
  "./assets/scene-bogota-noche.webp",
  "./assets/scene-drogueria.webp",
  "./assets/scene-farmacia.webp",
  "./assets/scene-panaderia.webp",
  "./assets/scene-porteria.webp",
  "./assets/scene-restaurante.webp",
  "./assets/scene-taxi.webp",
  "./assets/scene-terraza.webp",
  "./assets/scene-tienda.webp",
  "./assets/scene-uber.webp"
];

function precacheAsset(cache, url) {
  const isMutable = url === "./" || /\.(?:html|json|js|mjs|css)$/i.test(url);
  const req = isMutable ? new Request(url, { cache: "no-cache" }) : url;
  return fetch(req).then(res => {
    if (res && res.ok) return cache.put(url, res);
  }).catch(() => {});
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(CORE_ASSETS.map(url => precacheAsset(cache, url))))
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
  /* Never cache /api/ progress, auth, or avatar responses (review #1). */
  if (sameOrigin && url.pathname.startsWith("/api/")) return;
  const isNav = req.mode === "navigate" || ((req.headers.get("accept") || "").includes("text/html"));
  const hasVersionQuery = sameOrigin && url.searchParams.has("v");
  const isCodeOrStyle = sameOrigin && /\.(?:js|mjs|css)$/i.test(url.pathname);

  if (isNav || hasVersionQuery || isCodeOrStyle) {
    const netReq = req.mode === "navigate" ? req : new Request(req, { cache: "no-cache" });
    event.respondWith(
      fetch(netReq)
        .then(res => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(req, { ignoreSearch: isNav })
            .then(cached => cached || (isNav ? caches.match("./index.html", { ignoreSearch: true }) : null))
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
