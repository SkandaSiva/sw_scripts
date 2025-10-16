const CACHE_NAME = 'app-shell-cache-v1';
const FILES_TO_CACHE = [
    '/offline.html',
    '/assets/img/0to9.svg',
    '/assets/css/app.css',
    '/assets/js/app.js'
];

self.addEventListener('install', 
    (event) => {
        event.waitUntil(
            caches.open(CACHE_NAME).then(function(cache) {
                return cache.addAll(FILES_TO_CACHE);
            }).then(function() {
                return self.skipWaiting();
            })
        )
    });

self.addEventListener('activate', 
    (event) => {
        event.waitUntil(
            caches.keys().then(keyList => {
                return Promise.all(keyList.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                }));
            })
        );
        return self.clients.claim();
    });

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then( response => {
                return response;
            })
            .catch( () => {
                return caches.match(event.request)
                    .then(response => response || caches.match('/offline.html'));
            })
    );
});