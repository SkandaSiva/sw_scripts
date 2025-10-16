const CACHE_NAME = 'cache-name-v4'

const fromCache = async (request) => {
  const cache = await caches.open(CACHE_NAME)
  const matching = await cache.match(request)

  return matching || fetch(request)
}

const update = async (request) => {
  const promiseValues = await Promise.all([
    fetch(request),
    caches.open(CACHE_NAME),
  ])

  const response = promiseValues[0]
  const cache = promiseValues[1]

  await cache.put(request, response)

  return response
}

const CACHED_ROUTES = [
  '/about/',
  '/terms_of_use/',
  '/confidential/',
  '/important/',
  '/rules/',
  '/payment/',
  '/bonus/',
]

const isCachedUrl = (url) => {
  for (const cachedRoute of CACHED_ROUTES) {
    if (url.includes(cachedRoute)) return true
  }

  return false
}

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Take control of the page and start serving new content immediately.
  clients.claim()

  // Delete old cache versions.
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

self.addEventListener('fetch', (event) => {
  // Only first page document
  if (event.request.destination !== 'document') return

  // Если страницу не надо кэшировать
  if (!isCachedUrl(event.request.url)) return

  // используем `respondWith()`, чтобы мгновенно ответить без ожидания ответа с сервера.
  event.respondWith(fromCache(event.request))
  // `waitUntil()` нужен, чтобы предотвратить прекращение работы worker'a до того как кэш обновиться.
  event.waitUntil(update(event.request))
})
