self.importScripts("https://api.signalize.com/sw.js");
self.addEventListener('install', function(event) {

    console.log('[Service Worker] Installing Service Worker ...');
});

self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activating Service Worker ...');
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    // console.log('[Service Worker] Fetching ....', event);
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }
    event.respondWith(fetch(event.request));
    // event.respondWith(caches.match(event.request));
});
