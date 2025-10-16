// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "malco-cache";
const FALLBACK_CACHE_NAME = "malco-offline-cache";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

// TODO: replace the following with the correct offline fallback page i.e.: const FALLBACK_HTML = "offline.html";
const FALLBACK_HTML = "/offline/index.html";

const staticAssets = [
  FALLBACK_HTML,
  "/font/fonts/bootstrap-icons.woff2?524846017b983fc8ded9325d94ed40f3",
  "/font/fonts/bootstrap-icons.woff?524846017b983fc8ded9325d94ed40f3",
  "/assets/images/n0_tSWV9IB-250.webp",
  "/assets/images/n0_tSWV9IB-150.webp",
];
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(FALLBACK_CACHE_NAME).then((cache) => cache.addAll(staticAssets))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}
workbox.routing.registerRoute("/jeff/*", new workbox.strategies.NetworkOnly());
workbox.routing.registerRoute("/admin/*", new workbox.strategies.NetworkOnly());
workbox.routing.registerRoute(
  new RegExp("/*"),
  new workbox.strategies.NetworkFirst({
    cacheName: CACHE,
    plugins: [
      {
        handlerDidError: async () => {
          return await caches.match(FALLBACK_HTML, {
            cacheName: FALLBACK_CACHE_NAME,
          });
        },
      },
    ],
  })
);
