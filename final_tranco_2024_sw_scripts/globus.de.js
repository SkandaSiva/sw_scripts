var fontFiles = [
    '/fonts/payback_regular.ttf'
];

addEventListener('install', function (event) {
    self.skipWaiting();
    caches.delete('core')
    event.waitUntil(caches.open('base').then(function (cache) {
        fontFiles.forEach(function (file) {
            cache.add(new Request(file));
        });
    }));
});

addEventListener('fetch', function (event) {

    var request = event.request;

    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
    let fontRequest = request.destination === 'font';
    let scriptRequest = request.destination === 'script' && request.url.includes('?id=');
    let styleRequest = request.destination === 'style' && request.url.includes('?id=');

    if ( fontRequest || styleRequest || scriptRequest) {
        event.respondWith(
            caches.match(request).then(function (response) {
                return response || fetch(request).then(function (response) {

                    var copy = response.clone();
                    event.waitUntil(caches.open('base').then(function (cache) {
                        return cache.put(request, copy);
                    }));

                    return response;
                });
            })
        );
    }

});
