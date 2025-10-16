var CACHE_NAME = 'noriu-cache-v1';
var CACHE_WHITE_LIST = ['noriu-cache-v2'];
var ALLOWED_FILE_TYPES = [
    '.css',
    '.js',
    '.json',
                '.png',
    '.svg',
    '.eot',
    '.woff',
    '.ttf'
];
var urlsToCache = [
    '/manifest.json',
    '/pwa',
        '/js/d501b81.js',
    ];
var requestStrings = urlsToCache.map(function(url) {
    return (new Request(url)).url;
});
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(requestStrings);
            })
            .then(self.skipWaiting())
    );
});
                                                                                                    self.addEventListener('fetch', function(event) {
    if ( event.request.url.indexOf( '/admin/' ) !== -1 ) {
        return false;
    }

    event.respondWith(
        fetch(event.request)
            .catch(function() {
                    return caches.match(event.request);
                }
            )
    );
                                                                                                                                                                                                                                                
                                                            });


                                                    