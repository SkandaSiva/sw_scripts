var deferredPrompt;
const STATIC_CACHE_NAME = "rbc-casino-v2";
const APP_CACHE_NAME = "app-cache-#VERSION";
//Files to cache, and update if newer is available
const CACHE_APP = [
    '/',
    '/rbc/css/style.css',
    '/rbc/js/web.js'
];
//Static files to cache
const CACHE_STATIC = [
    'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js'
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
                            console.log('deleting', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

self.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    e.userChoice.then(function (choiceResult) {
        console.log(choiceResult.outcome);
        if (choiceResult.outcome == 'dismissed') {
            console.log('User cancelled home screen install');
        }
        else {
            console.log('User added to home screen');
        }
    });
});
self.addEventListener('fetch', function (e) {
    console.log("Requested from network::" +
        e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            console.log("MATCH: " + e.request);
            return response || fetch(e.request);
        })
    );
});
