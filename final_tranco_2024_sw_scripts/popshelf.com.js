/* eslint-disable no-useless-escape */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
const CACHE = 'pOpshelf'

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE).map(cacheName => caches.delete(cacheName))
      )
    })
  )
  return self.skipWaiting()
})

self.addEventListener('fetch', (evt) => {
  if (evt.request.url.includes('login')) {
    return false
  } else if (evt.request.url.includes('gigya ')) {
    return false
  } else if (evt.request.url.includes('cart')) {
    return false
  } else if (evt.request.url.includes('accountlocked')) {
    return false
  } else if (evt.request.url.includes('changepassword')) {
    return false
  } else if (evt.request.url.includes('checkout')) {
    return false
  } else if (evt.request.url.includes('contact-preferences')) {
    return false
  } else if (evt.request.url.includes('editmyinformation')) {
    return false
  } else if (evt.request.url.includes('forgotpassword')) {
    return false
  } else if (evt.request.url.includes('paymentmethods')) {
    return false
  } else if (evt.request.url.includes('registration')) {
    return false
  } else if (evt.request.url.includes('registration-phone')) {
    return false
  } else if (evt.request.url.includes('order')) {
    return false
  } else if (evt.request.url.includes('cache-reset')) {
    return false
  } else if (evt.request.url.includes('card?popkey')) {
    return false
  } else if (evt.request.url.includes('aurus?popkey')) {
    return false
  } else if (evt.request.url.includes('cdn.brcdn.com')) {
    return false
  } else if (evt.request.url.includes('rewards')) {
    return false
  } else if (evt.request.url.includes('p.brsrvr.com')) {
    return false
  } else if (evt.request.url.includes('sprinklr')) {
    return false
  } else if (evt.request.url.includes('reviews')) {
    return false
  } else if (evt.request.url.includes('analytics')) {
    return false
  } else if (evt.request.url.includes('ct.pinterest.com')) {
    return false
  } else if (evt.request.url.includes('facebook')) {
    return false
  } else if (evt.request.url.includes('googletagmanager')) {
    return false
  } else if (evt.request.url.includes('pagead')) {
    return false
  } else if (evt.request.url.includes('api2.branch.io')) {
    return false
  } else if (evt.request.url.includes('s.pinimg')) {
    return false
  } else if (evt.request.url.includes('insight.adsrvr.org')) {
    return false
  } else {
    evt.respondWith(async function () {
      const cache = await caches.open(CACHE)
      const cachedResponsePromise = await cache.match(evt.request)
      const comparableCachedResponse = await cache.match(evt.request)
      const networkResponsePromise = fetch(evt.request)

      await caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.filter(cacheName => cacheName !== CACHE).map(cacheName => caches.delete(cacheName))
        )
      })

      if (evt.request.url.startsWith(self.location.origin)) {
        evt.waitUntil(async function () {
          const networkResponse = await networkResponsePromise
          await cache.put(evt.request, networkResponse.clone())

          if (cachedResponsePromise && networkResponse && evt.request.url === `${self.location.origin}/`) {
            const jsonCached = await comparableCachedResponse.text()
            const comparableNetworkBody = networkResponse.clone()
            const jsonNetwork = await comparableNetworkBody.text()
            const cachedModified = jsonCached.match(/<meta property=\"home:published_time\"(.*?)\/>/g) || []
            const networkModified = jsonNetwork.match(/<meta property=\"home:published_time\"(.*?)\/>/g) || []

            if (!cachedModified.length || !networkModified.length || cachedModified[0] !== networkModified[0]) {
              return self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                  const message = {
                    type: 'refresh'
                  }
                  client.postMessage(JSON.stringify(message))
                })
              })
            }
          }
        }())
      }

      return cachedResponsePromise || networkResponsePromise
    }())
  }
})
