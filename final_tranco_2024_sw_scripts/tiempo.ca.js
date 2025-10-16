// https://www.pwabuilder.com/serviceworker - "Offline Page"
const CACHE = "sdgwf-offline-page";
const offlineFallbackPage = "offline.html";

self.addEventListener("install", function (event) {
    //Install Event processing
    event.waitUntil(
        caches.open(CACHE).then(function (cache) {
            //Cached offline page during install
            return cache.add(offlineFallbackPage);
        })
    );
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function (event) {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request).catch(function (error) {
            // The following validates that the request was for a navigation to a new document
            if (event.request.destination !== "document" ||
                event.request.mode !== "navigate") {
                return;
            }

            //Network request Failed. Serving offline page
            return caches.open(CACHE).then(function (cache) {
                return cache.match(offlineFallbackPage);
            });
        })
    );
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
    const offlinePageRequest = new Request(offlineFallbackPage);

    return fetch(offlineFallbackPage).then(function (response) {
        return caches.open(CACHE).then(function (cache) {
            //Offline page updated from refreshOffline event
            return cache.put(offlinePageRequest, response);
        });
    });
});
