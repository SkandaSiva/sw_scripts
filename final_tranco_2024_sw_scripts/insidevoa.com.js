// CURENTLY UNUSED !!
var pwa = location.href.match(/pwa=true/g);
var cacheDiasabled = location.href.match(/sw-cache-dis=true/g);
if (pwa && pwa.length) {
    console.log('PWA enabled');
    self.addEventListener('install', function (evt) {
        // install event handler for later
    });

    self.addEventListener('activate', function (evt) {
        // activate event handler for later
    });
}
var regexCheck = function (url) {
    var responsiveMatch = url.match(/(Content\/responsive\/|Scripts\/responsive\/|res\?callback)/gi);
    var match = (responsiveMatch && responsiveMatch.length);
    if (match) {
        return true
    } else {
        return false
    }
}
var noCache = cacheDiasabled && cacheDiasabled.length;
self.addEventListener('fetch', function (event) {
    if (regexCheck(event.request.url) && !noCache) {
        event.respondWith(
            caches.open('cache-dynamic').then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    var fetchPromise = fetch(event.request).then(function (networkResponse) {
                        if (networkResponse.status === 200 || networkResponse.type === "opaque") {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    })
                    return response || fetchPromise;
                })
            }).catch(function (error) {
                console.error(error, event.request.url);
            })
        );
    } else {
        // browser default
    }
});
