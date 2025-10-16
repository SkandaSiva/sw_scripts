const STATIC_CACHE_NAME = 'static-cache-v12';
const APP_CACHE_NAME = 'app-cache-v1l';

const CACHE_APP = [
    '/_pwa/?v1l',
    '/_pwa/index.html?v1l',
    '/css/pt-2018-07.min.css',
    '/css/pt-mobile_2016-12.min.css',
    '/images/2016/pt_logo_trans_50x50.png',
    '/apple-touch-icon.png'
];
const CACHE_STATIC = [
    'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap-theme.min.css',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        Promise.all([caches.open(STATIC_CACHE_NAME), caches.open(APP_CACHE_NAME), self.skipWaiting()]).then(function (storage) {
            var static_cache = storage[0];
            var app_cache = storage[1];
            return Promise.all([static_cache.addAll(CACHE_STATIC), app_cache.addAll(CACHE_APP)]);
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.map(function (cacheName) {
                        if (cacheName !== APP_CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
    
});