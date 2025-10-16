/* eslint-disable no-restricted-globals */

/** Logic to handle push notifications */

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('push', event => {
  const data = event.data.json()

  const { title, body, url, icon } = data

  const options = {
    body,
    data: {
      url,
    },
    icon,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()

  let clickResponsePromise = Promise.resolve()
  if (event.notification.data?.url != null) {
    // eslint-disable-next-line no-undef
    clickResponsePromise = clients.openWindow(event.notification.data.url)
  }

  event.waitUntil(clickResponsePromise)
})

/** Logic to handle offline state */

const CACHE_BUCKET = 'shw-offline-cache-v2'
const OFFLINE_PAGE_URL = '/offline'

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('install', async event => {
  event.waitUntil(caches.open(CACHE_BUCKET).then(cache => cache.add(OFFLINE_PAGE_URL)))
})

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  if (event.request.mode === 'navigate' && url.hostname !== 'localhost') {
    event.respondWith(
      (async () => {
        try {
          const networkResp = await fetch(event.request)
          return networkResp
        } catch (_) {
          const cache = await caches.open(CACHE_BUCKET)
          const cachedResp = await cache.match(OFFLINE_PAGE_URL)
          return cachedResp
        }
      })()
    )
  }
})
