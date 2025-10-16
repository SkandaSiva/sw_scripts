var cacheName = 'pwa';
var filesToCache = [
    
];
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});
//self.addEventListener('fetch', event => {
//    event.respondWith(
//        caches.match(event.request, { ignoreSearch: true }).then(response => {
//            return response || fetch(event.request);
//        })
//    );
//});


//function getgps() {

//    fetch("https://lightningrockapi.azurewebsites.net/api/latlong?lat=2&long=2");
//    setTimeout (getgps, 10000)
//}
//getgps();


