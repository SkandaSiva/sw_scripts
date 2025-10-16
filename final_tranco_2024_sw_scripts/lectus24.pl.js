const CACHE_NAME = 'lectus24-pwa';

// List of files which are store in cache.
let filesToCache = [
    '/',
    '/themes/default-bootstrap/js/global.js',
    '/themes/default-bootstrap/css/global.css',
    '/img/logo.svg',
    '/img/logo192x192.png',
    '/img/logo512x512.png',
];

self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(filesToCache);
        }).catch(function (err) {
            // Snooze errors...
            // console.error(err);
        })
    );
});

self.addEventListener('fetch', function (evt) {
    // Snooze logs...
    // console.log(event.request.url);
    try {
        evt.respondWith(
            // Firstly, send request..
            fetch(evt.request).catch(function () {
                // When request failed, return file from cache...
                return caches.match(evt.request);
            })
        );
    } catch(err) {
        console.log(err.message);
    }
});