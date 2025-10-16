var cacheName = 'v1';
var filesToCache = [
    '/',
    '/sw.js',
    '/css/fonts.min.css',
    '/css/bootstrap-grid.min.css',
    '/css/bootstrap-reboot.min.css',
    '/css/headers/header_branco.min.css',
    '/css/style.min.css',
    '/js/jquery.min.js',
    '/js/scripts.js',
    '/js/dashboard.js',
    '/js/bootstrap.min.js',
    '/js/popper.min.js',
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName)
        .then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate',  event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, {ignoreSearch:true}).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('beforeinstallprompt', function(e) {
    // beforeinstallprompt Event fired

    // e.userChoice will return a Promise.
    // For more details read: https://developers.google.com/web/fundamentals/getting-started/primers/promises
    e.userChoice.then(function(choiceResult) {

        console.log(choiceResult.outcome);

        if(choiceResult.outcome === 'dismissed') {
            console.log('User cancelled home screen install');
        }
        else {
            console.log('User added to home screen');
        }
    });
});