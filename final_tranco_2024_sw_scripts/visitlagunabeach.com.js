// This is the current worker version. Bump if you
// need to update your cache.
var version = 1;

// These files will be added to the static cache
// ONLY places files here that are very unlikely to
// change. A missing file may throw errors and negate
// the performance benefits of a service woker.
var toCache = [
    // Favicon:
    // [ADD YOUR THEME PATH HERE] '/wp-content/themes/mmn-your-theme/favicon.png',
    // JS:
    '/wp-includes/js/jquery/jquery.js',
    '/wp-includes/js/wp-emoji-release.min.js',
    '/wp-includes/js/wp-embed.min.js',
    '/wp-includes/js/hoverintent-js.min.js',
    '/wp-includes/js/dist/vendor/wp-polyfill.min.js',
    // CSS:
    '/wp-includes/css/dashicons.min.css',
    '/wp-includes/css/dist/block-library/style.min.css',
];

// Cache vital files on install:
self.addEventListener('install', function(event) {
    event.waitUntil(caches.open('mmmadre-core-v' + version)
    .then(function(cache) {
        return cache.addAll(toCache);
    })
    .catch(function(error) {
        console.error('Service worker error: ' + error);
    }));
});

// Intercept requests and respond from cache if possible:
self.addEventListener('fetch', function(event) {
    // Ignore non-GET requests:
    if (event.request.method !== 'GET') {
        return;
    }
    // Open cache:
    caches.open('mmmadre-dynamic-v' + version)
    .then(function(cache) {
        return cache.match(event.request)
        // If a match exists:
        .then(function(response) {
            // Return it and save it:
            if(response) return response;
            
            fetch(event.request)
            .then(function(response) {
                if(response.status === 200) cache.put(event.request, response.clone());
                return response;
            })
            .catch(function(error) {
                console.error('Service worker error: ' + error);
            });
        })
        .catch(function(error) {
            console.error('Service worker error: ' + error);
        });
    })
    .catch(function(error) {
        console.error('Service worker error: ' + error);
    });
});

// Clean out old versions:
self.addEventListener('activate', function(event) {
    event.waitUntil(caches.keys()
    .then(function(cacheNames) {
        cacheNames.filter(function(cacheName) {
            return cacheName === 'mmmadre-dynamic-v' + version;
        })
        .map(function(cacheName) {
            console.log('Service worker has cleared outdated caches.')
            return caches.delete(cacheName);
        });
    })
    .catch(function(err) {
        console.error('Service worker error: ' + error);
    }));
});
