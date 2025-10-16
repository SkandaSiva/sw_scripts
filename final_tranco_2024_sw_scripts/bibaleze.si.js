var offlineUrl = '/assets/upup/offline.html';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('sw-cache').then(function(cache) {
            return cache.addAll([
                offlineUrl,
                '/assets/img/confetti.png',
                '/assets/img/logo.svg'
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    if (!location.origin || !event.request || !event.request.url) {
        return;
    }

    var isPageRequest = location.origin + '/' === event.request.url ||
                        location.origin + '/index.html' === event.request.url;
    var isLogoRequest = event.request.url.indexOf('assets/img/logo.svg') > -1 ||
                        event.request.url.indexOf('assets/img/confetti.png') > -1;

    if (!isPageRequest && !isLogoRequest) {
        return;
    }

    event.respondWith(
        fetch(event.request.url).catch(function(error) {
            return isLogoRequest ? caches.match(event.request.url) : caches.match(offlineUrl);
        })
    );
});
