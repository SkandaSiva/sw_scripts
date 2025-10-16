var cacheVersion = 1;
var currentCache = {
    offline: 'offline-cache' + cacheVersion
};
const offlineUrl = 'offline';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(currentCache.offline).then(function(cache) {
            return cache.addAll([
                offlineUrl,
                "./img/imgNew/offline/photo-logo-mecatechnic.jpg",
                "./img/imgNew/offline/nuage-offline.jpg"
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    // request.mode = navigate isn't supported in all browsers
    // so include a check for Accept: text/html header.
    if(!navigator.onLine){
        event.respondWith(
            fetch(event.request.url).catch(error => {
                // Return the offline page
                return caches.match(offlineUrl);
            })
        );
    }
});
