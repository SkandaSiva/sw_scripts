// SW for fallback offline page

// Install offline page
self.addEventListener('install', function (event) {
    var offlinePage = new Request('/offline.html');
    event.waitUntil(
        fetch(offlinePage).then(function (response) {
            return caches.open('pwa-offline').then(function (cache) {
                console.log('[PWA] Cached offline page during Install ' + response.url);
                return cache.put(offlinePage, response);
            });
        }));
});

// If any fetch fails, it will show the offline page.
self.addEventListener('fetch', function (event) {
    var url = new URL(event.request.url),
        ignore = RegExp('^/((api|static)/|sw.*\.js$)','g');

    if (location.host !== url.host || ignore.test(url.pathname)) {
        return;
    }

    event.respondWith(fetch(event.request).catch(function (error) {
        console.log('[PWA] Network request Failed. Serving offline page ' + error);
        return caches.open('pwa-offline').then(function (cache) {
            return cache.match('/offline.html');
        });
    }));
});
