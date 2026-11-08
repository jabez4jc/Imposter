/* Imposter Party service worker.
   build.sh writes this file to /service-worker.js and stamps CACHE_VERSION with a hash of the build,
   so every new release installs a fresh cache and old ones are deleted. */
const CACHE_VERSION = "7ca992664881";
const CACHE = `imposter-${CACHE_VERSION}`;
const RUNTIME = "imposter-runtime";

// Everything the game needs to start offline. The game itself is one self-contained HTML file.
const PRECACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon-32.png",
  "/icons/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE.map(url => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== RUNTIME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Page navigations: network first so players get updates, falling back to the cached game offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put("/index.html", copy)); }
          return res;
        })
        .catch(() => caches.match("/index.html").then(r => r || caches.match("/")))
    );
    return;
  }

  // Google Fonts: serve from cache straight away and refresh in the background.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(
      caches.open(RUNTIME).then(cache =>
        cache.match(req).then(cached => {
          const network = fetch(req).then(res => { if (res.ok || res.type === "opaque") cache.put(req, res.clone()); return res; }).catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // Same-origin files (icons, manifest): cache first, then network, caching anything new.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(RUNTIME).then(c => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
