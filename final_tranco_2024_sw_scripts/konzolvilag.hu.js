var CACHE_NAME = 'kv-cache-v1';
var urlsToCache = [
    '/view/phantoms/Konzolvilag/images/',
    '/view/phantoms/Konzolvilag/js/',
    '/view/phantoms/Konzolvilag/css/'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    console.log('Service Worker install');
});

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
            caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            );
});

self.addEventListener('fetch', function (event) {
    
});