var cacheName = ['dg-v1'];
var filesToCache = [
    "https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap",
    "https://fonts.googleapis.com/css2?family=Francois+One&display=swap",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css",
    "templates/asset/style.css?v=6",
    "templates/asset/home_style.css?v=2",
    "templates/asset/minelists.css?v=4",
    "templates/asset/location_style.css?v=7",
    "templates/asset/event_location_style.css?v=3",
    "templates/asset/guides_style.css?v=2",
    "templates/asset/main.js?v=4",
    "templates/asset/region-select.js",
    "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
    "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js",
    "https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js",
    "/images/asset/logo.webp",
    "/images/asset/abhi-gaming.webp"
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
    self.skipWaiting();
    e.waitUntil(
        caches.open(cacheName[0]).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!cacheName.includes(key)) {
                    return caches.delete(key);
                }
            })
        ))
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});