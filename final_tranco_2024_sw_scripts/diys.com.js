if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
            function (registration) {
                // Registration was successful
                console.log(
                    "Service worker has been registered. ",
                    registration.scope
                );
            },
            function (err) {
                // registration failed :(
                console.log("ServiceWorker registration failed: ", err);
            }
        );
    });
}

self.addEventListener('install', function (event) {
    var CACHE_NAME = 'cache-1';
    var urlsToCache = [
        '/',
        '/assets_new/css/home_2021.css?v=1.6.7',
        '/assets_new/css/bootstrap.min.css',
        '/assets_new/js/sweetalert2.all.js',
        '/assets_new/js/jquery.min.js'
    ];

    self.addEventListener('install', function (event) {
        // Perform install steps
        event.waitUntil(
            caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
        );
    });
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});