
var CACHE_NAME = 'DiarioPresente-Home';
var urlsToCache = [
    "https://diariopresenterm.blob.core.windows.net/espanol/manifest.json"
];

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log("install sw");
                return cache.addAll(urlsToCache);
            })
    );
});

//self.addEventListener('fetch', function (event) {
//    console.log(event.request.url);
//    event.respondWith(
//        caches.match(event.request).then(function (response) {
//            return response || fetch(event.request);
//        })
//    );
//});

self.addEventListener('activate', function (event) {
    console.log('Finally active. Ready to start serving content!');
});