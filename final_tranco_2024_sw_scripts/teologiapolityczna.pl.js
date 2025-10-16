const CACHE_NAME = 'tp';

// List of files which are store in cache.
let filesToCache = [
    '/assets/_combinedfiles/c3.css',
    '/themes/tpv8/js/jquery.min.js',
    '/themes/tpv8/js/perfect-scrollbar.js',
    '/themes/tpv8/js/masonry.pkgd.min.js',
    '/themes/tpv8/js/bootstrap.min.js',
    '/themes/tpv8/js/slick.min.js',
    '/themes/tpv8/js/modernizr.min.js',
    '/themes/tpv8/js/vivus.js',
    '/themes/tpv8/js/pathformer.js',
    '/themes/tpv8/js/tp.js',
    '/themes/tpv8/js/Magnific-Popup-master/dist/jquery.magnific-popup.min.js',
    '/themes/tpv8/js/jquery.lazy.min.js',
    '/themes/tpv8/js/app.jquery.js'
];


self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(filesToCache);
        }).catch(function (err) {
            // Snooze errors...
             console.error(err);
        })
    );
});

self.addEventListener('fetch', function (evt) {
    // Snooze logs...
    // console.log(event.request.url);
    evt.respondWith(
        // Firstly, send request..
        fetch(evt.request).catch(function () {
            // When request failed, return file from cache...
            return caches.match(evt.request);
        })
    );
});

