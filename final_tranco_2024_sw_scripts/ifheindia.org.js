if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/icfai-sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

self.addEventListener('fetch', function (event) {
    //console.log(event.request.url);
    event.respondWith(
    caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    })
    );
});