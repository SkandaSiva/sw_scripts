var staticCacheName = 'pwa-v' + new Date().getTime()
var filesToCache = [
    '/offline',
    '/css/app.css',
    '/js/app.js',
    '/js/manifest.js',
    '/js/vendor.js',
    '/img/icons/76x76.png',
    '/img/icons/120x120.png',
    '/img/icons/152x152.png',
    '/img/icons/180x180.png',
    '/img/splashscreens/640x1136.png',
    '/img/splashscreens/750x1334.png',
    '/img/splashscreens/1242x2208.png',
    '/img/splashscreens/1125x2436.png',
    '/img/splashscreens/828x1792.png',
    '/img/splashscreens/1242x2688.png',
    '/img/splashscreens/1536x2048.png',
    '/img/splashscreens/1668x2224.png',
    '/img/splashscreens/1668x2388.png',
    '/img/splashscreens/2048x2732.png'
]

self.addEventListener('install', event => {
    this.skipWaiting()

    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache)
            })
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith('pwa-')))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            )
        })
    )
})

self.addEventListener('fetch', event => {
    var request = event.request

    if (request.method !== 'GET') {
        return
    }

    if (request.url.search('tookapic.com') === -1) {
        return
    }

    event.respondWith(
        caches.match(request)
            .then(response => {
                return response || fetch(request)
            })
            .catch(() => {
                return caches.match('offline')
            })
    )
})
