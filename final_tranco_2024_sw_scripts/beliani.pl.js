let coreAssets = [
    'https://pictureserver.net/templates/shop_mobile/css/beliani-mobile-site.css'
];

// On install, cache some stuff
self.addEventListener('install', function (event) {
    // Cache core assets
    event.waitUntil(caches.open('app').then(function (cache) {
        for (let asset of coreAssets) {
            cache.add(new Request(asset));
        }
        return cache;
    }));
});

// Listen for request events
self.addEventListener('fetch', function (event) {
    // Get the request
    let request = event.request;
  
    // Bug fix
    // https://stackoverflow.com/a/49719964
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

    // CSS & JavaScript
    // Offline-first
    if (request.headers.get('Accept').includes('text/css') || request.headers.get('Accept').includes('text/javascript')) {
        // Handle CSS and JavaScript files...
        // Check the cache first
        // If it's not found, send the request to the network
        event.respondWith(
            caches.match(request).then(function (response) {
                return response || fetch(request).then(function (response) {
                    return response;
                });
            })
        );
    }
});
