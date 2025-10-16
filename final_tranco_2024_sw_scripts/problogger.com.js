importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js')
workbox.setConfig({debug: false})
const versionSW = '-v-19.02.05'
/**
 * Clears Old Cache
 */
let clearOldCaches = function () {
  return caches.keys().then(function (keys) {
    return Promise.all(
      keys.filter(function (key) {
        return key.includes(versionSW)
      }).map(function (key) {
        return caches.delete(key)
      })
    )
  })
}
/**
 * Install Event
 */
self.addEventListener('install', function (event) {
  return self.skipWaiting()
})
/**
 * Service Worker Activation event.
 * Clear old caches on SW update.
 */
self.addEventListener('activate', function (event) {
  event.waitUntil(clearOldCaches().then(function () {
      return self.clients.claim()
    })
  )
})
workbox.routing.registerRoute(
  new RegExp('(.*)(?:wp-admin|wp-login|wp-includes|thrive)(.*)'),
  workbox.strategies.networkOnly()
)
workbox.routing.registerRoute('/',
  workbox.strategies.networkFirst({
    cacheName: 'fallback' + versionSW,
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 2,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
)
workbox.routing.registerRoute(
  new RegExp('(.*)\/(?:plugins|sassy-dps|^thrive)\/(.*)'),
  workbox.strategies.cacheFirst({
    maxEntries: 70,
    cacheName: 'theme-cache' + versionSW,
    maxAgeSeconds: 30 * 24 * 60 * 60,
  })
)
self.addEventListener('fetch', function (event) {
  let request = event.request
  event.respondWith(
    fetch(request).then(function (response) {
      return response
    }).catch(function () {
      if (request.url.match(/\.(jpe?g|png|gif|svg|webp)$/)) {
        return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><title id="offline-title">Offline</title><path fill="rgba(0,103,182,0)" d="M0 0h400v225H0z" /><text fill="rgba(255,255,255,1)" font-family="Helvetica Neue,Arial,sans-serif" font-size="27" text-anchor="middle" x="200" y="113" dominant-baseline="central">offline</text></svg>', {headers: {'Content-Type': 'image/svg+xml'}})
      }
    })
  )
})
