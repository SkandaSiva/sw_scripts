var CACHE_NAME = 'bincheck';
var urlsToCache = [
    './',
    'sw.js',
    'manifest.webmanifest',
    '/assets/css/app.css?id=8f129d6c1cb7612052300511978201ac',
    '/assets/js/app.js?id=87c45b803481c78169f406fd11fef818',
    '/assets/js/cleave.js',
    '/assets/icons/android-chrome-512x512.png',
    '/assets/icons/android-chrome-192x192.png',
    '/assets/icons/apple-icon-57x57.png',
    '/assets/icons/apple-icon-60x60.png',
    '/assets/icons/apple-icon-72x72.png',
    '/assets/icons/apple-icon-76x76.png',
    '/assets/icons/apple-icon-114x114.png',
    '/assets/icons/apple-icon-120x120.png',
    '/assets/icons/apple-icon-144x144.png',
    '/assets/icons/apple-icon-152x152.png',
    '/assets/icons/apple-icon-180x180.png',
    '/assets/icons/android-icon-192x192.png',
    '/assets/icons/favicon-32x32.png',
    '/assets/icons/favicon-96x96.png',
    '/assets/icons/favicon-16x16.png',
];
//console.log('loading sw');

self.addEventListener('install', function(event) {
    // Perform install steps
    //console.log('installing sw');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            //console.log('Opened cache');
            var x = cache.addAll(urlsToCache);
            //console.log('cache added');
            return x;
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});