const OFFLINE_CACHE = 'vk-offline'
const OFFLINE_HTML = '/assets/static/offline.html'

self.addEventListener('install', (event) => {
    const offlineRequest = new Request(OFFLINE_HTML)
    event.waitUntil(
        fetch(offlineRequest).then(async (response) => {
            const cache = await caches.open(OFFLINE_CACHE)
            await cache.put(offlineRequest, response)
            return self.skipWaiting()
        })
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
    const request = event.request
    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(async (error) => {
                console.error('[offline]' + error)
                const cache = await caches.open(OFFLINE_CACHE)
                return await cache.match(OFFLINE_HTML)
            })
        )
    }
})
