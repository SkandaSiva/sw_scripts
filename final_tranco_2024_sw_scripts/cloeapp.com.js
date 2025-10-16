const CACHE_NAME = 'cloe-web'

const BLACK_LIST_URLS = [
  'googletagmanager',
  'facebook',
  'hubapi',
  'freshstatus',
  'jsdelivr',
  'appcues',
  'hubspot',
  'hs-analytics',
  'hs-banner',
  'hsadspixel',
  'hscollectedforms',
  'google-analytics',
  'hotjar',
  'usemessages',
  'hsforms',
  'hs-scripts'
]

const BACK_END_ALLOWED_PATHS = [
  '/users/me',
  '/users/session',
  '/classes/.*/disciplines',
  '/classes/.*/schedules'
]

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/images/cat-offline.png',
        '/images/icon.png',
        '/images/empty-state-screen-content-unit-list-only-downloaded.svg',
        '/pwa.dev.min.js',
        '/favicon.svg'
      ])
    })
  )
})


function cacheRunner(event, cloned) {
  caches.open(CACHE_NAME)
    .then(function (cache) {
      if(!BLACK_LIST_URLS.some(url => event.request.url.indexOf(url) >= 0)) {
        const isBackend = /content.*cloeapp/i.test(event.request.url)
        const isBackendAllowed = BACK_END_ALLOWED_PATHS.some(url => new RegExp(url, 'i').test(event.request.url))
        if(!isBackend || isBackendAllowed) {
          cache.put(event.request, cloned)
          return
        }
        cache.match(event.request).then(cached => {
          if(cached) {
            cache.put(event.request, cloned)
          }
        })
      }
  })
}

self.addEventListener('fetch', function (event) {
  //check if stopServiceWorking exists in params
  if (event.request.url.indexOf('stopServiceWorking=true') !== -1) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        if (!/get/i.test(event.request.method)) {
          return response
        }
        const cloned = response.clone()
        cacheRunner(event, cloned)
        return response
      })
      .catch(async function (error) {
        let cache
        if (/get/i.test(event.request.method)) {
          try {
            cache = await caches.match(event.request)
          } catch (error) {
            console.error(error)
          }
        }
        return cache || error
      })
  )
})
