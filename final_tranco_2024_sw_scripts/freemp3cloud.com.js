const filesToCache = [
    "/js/jquery.slim.min.js",
    "/js/nataudio.min.js",
    "/css/mstyle.min.css",
    "/img/free-mp3-cloud.svg"
];

const staticCacheName = "swcachev2";
self.addEventListener("install",
    event => {
        //console.log('Installing service worker');
        event.waitUntil(caches.open(staticCacheName).then(cache => {
            //console.log('Caching file');
            return cache.addAll(filesToCache);
        }));
    });


self.addEventListener("fetch",
    event => {
        // Skip cross-origin requests, like those for Google Analytics.
        if (event.request.url.startsWith(self.location.origin)) {
            event.respondWith(fetch(event.request));
        }
    });