
var staticCacheName = "worddisk-v" + new Date().getTime();
var filesToCache = [
    '/start-page/',
    '/offline/',
    '/manifest.json',
    '/static/vendor/fontawesome-free/css/all.min.css',
    '/static/vendor/fontawesome-free/webfonts/fa-brands-400.ttf',
    '/static/vendor/fontawesome-free/webfonts/fa-regular-400.ttf',
    '/static/vendor/fontawesome-free/webfonts/fa-solid-900.ttf',
    '/static/vendor/bootstrap/css/bootstrap.min.css',
    '/static/css/theme.css',
    '/static/css/theme-elements.css',
    '/static/css/skins/default.css',
    '/static/vendor/jquery/jquery.min.js',
    '/static/img/icons/sizes-bg/Icon-192.png',
    '/static/img/icons/sizes-bg/Icon-512.png',
    '/static/img/logo/new/wd-logo-light-1024.png',
    '/static/img/icons/search-solid.png',
    '/static/img/icons/newspaper-regular.png',
    '/static/img/icons/list-ul-solid.png',
];

// Cache on install
self.addEventListener("install", event => {
    this.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache);
            })
    )
});

// Clear cache on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("worddisk-v")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Serve from Cache
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
            .catch(() => {
                return caches.match('/offline/');
            })
    )
});
