const CACHE_VERSION = '0.0.2'
const CACHE_PATHS = []
const ONLY_FETCH_PATHS = ['sw.js']

self.addEventListener('install', async () => {
    await self.skipWaiting()
    caches.open(CACHE_VERSION).then(cache => {
        return cache.addAll(CACHE_PATHS)
    })
})

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(cache => {
            return Promise.all(
                cache.map(cacheName => {
                    return cacheName !== CACHE_VERSION && caches.delete(cacheName)
                }),
            )
        }),
    )
})

self.addEventListener('fetch', e => {
    // Если путь содержит скобки или какие то спецсимволы игнорим
    if (/[\{\}\(\)\|]/g.test(e.request.url)) return

    // Если путь не должен обрабатываться игнорируем
    if (ONLY_FETCH_PATHS.some(ofp => e.request.url?.match(ofp))) return

    // Если не ГЕТ запрос, игнорим
    const isGetMethod = e.request.method?.toLowerCase() === 'get'
    if (!isGetMethod) return

    const isRequestImage = e.request.destination === 'image'
    const isRequestImageFromTargetPaths =
        /\/img\/|\/images\/|\/yt3.ggpht.com\/|\/lh3.googleusercontent.com\/|\/storage\//.test(e.request.url)

    // Обрабатываем только кеш изображений
    if (isRequestImage && isRequestImageFromTargetPaths) {
        e.respondWith(
            caches
                .match(e.request)
                .then(cacheResponse => {
                    // Возвращаем ответ из кэша
                    if (cacheResponse) return cacheResponse
                    // Выполняем сетевой запрос и добавляем ответ в кэш
                    return fetch(e.request)
                        .then(networkResponse => {
                            return caches.open(CACHE_VERSION).then(cache => {
                                cache.put(e.request, networkResponse.clone())
                                return networkResponse
                            })
                        })
                        .catch(e => {
                            if ([401, 403].includes(e.status)) return Promise.reject(e)
                            return caches.match(e.request)
                        })
                })
                .catch(e => {
                    console.error(e)
                }),
        )
    } else {
        // Пропускаем остальные запросы
        e.respondWith(fetch(e.request))
    }
})
