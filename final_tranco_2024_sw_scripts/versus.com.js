importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js')

workbox.core.setCacheNameDetails({
  prefix: 'versus',
  suffix: 'v1'
})

workbox.routing.registerRoute(
  /(^https:\/\/images\.versus\.io\/favicon\/.*\.png$|\/favicon.ico$)/,
  new workbox.strategies.CacheFirst({
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ],
    cacheName: 'versus-icon-v1',
  })
)

const OFFLINE_CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/offline.html';
self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(OFFLINE_CACHE_NAME)
      .then((cache) => cache.add(FALLBACK_HTML_URL))
  );
});

const networkOnly = new workbox.strategies.NetworkOnly();
const navigationHandler = async (params) => {
  try {
    // Attempt a network request.
    return await networkOnly.handle(params);
  } catch (error) {
    // If it fails, return the cached HTML.
    return caches.match(FALLBACK_HTML_URL, {
      cacheName: OFFLINE_CACHE_NAME,
    });
  }
};

// Register this strategy to handle all navigations.
workbox.routing.registerRoute(
  new workbox.routing.NavigationRoute(navigationHandler)
);

workbox.routing.registerRoute(
  /\/compiled\/.*\.(mjs|js)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'versus-js-v1',
  })
)

workbox.routing.registerRoute(
  /\/compiled\/.*\.css$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'versus-css-v1',
  })
)
