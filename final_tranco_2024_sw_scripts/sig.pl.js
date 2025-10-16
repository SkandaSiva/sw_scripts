importScripts('https://cdn.jsdelivr.net/npm/workbox-cdn/workbox/workbox-sw.js')

const OFFLINE_CACHE_NAME = 'cache-offline'
const OFFLINE_FALLBACK_HTML_URL = 'error-screen/unavailable.html'

const cacheName = 'assets'

const cacheExpiration = new workbox.expiration.CacheExpiration({
  maxEntries: 50,
  maxAgeSeconds: 60 * 60 * 24 * 30
})

const cacheSettings = {
  cacheName,
  plugins: [
    new workbox.cacheableResponse.CacheableResponse({
      statuses: [200]
    }),
    cacheExpiration
  ]
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(OFFLINE_CACHE_NAME)
      .then(cache => cache.addAll([OFFLINE_FALLBACK_HTML_URL]))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', () => {})

workbox.routing.registerRoute(
  ({ request }) => ['script'].includes(request.destination),
  new workbox.strategies.NetworkFirst(cacheSettings)
)

workbox.routing.registerRoute(
  ({ request }) => ['style', 'font'].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate(cacheSettings)
)

workbox.routing.registerRoute(
  ({ request }) => ['image'].includes(request.destination),
  new workbox.strategies.CacheFirst(cacheSettings)
)
