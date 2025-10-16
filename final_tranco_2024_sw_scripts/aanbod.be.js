var CACHE_STATIC_NAME = 'static-v1';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';

const assets = [
  '/',
  '/assets/js/ui.js',
  '/css/stylesheet.css',
  'https://fonts.googleapis.com/css?family=Roboto|Lato:300&display=swap'
];

// install event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_STATIC_NAME).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', function (event) {
    console.log('Activating Service Worker ....', event);
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                        console.log('Removing old cache.', key);
                        return caches.delete(key);
                    }
                }));
            })
    );
    return self.clients.claim();
});

// fetch event
self.addEventListener('fetch', function (event) {
    event.respondWith(
        // Try the network
        fetch(event.request)
            .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                    .then(function (cache) {
                        // Put in cache if succeeds
                        cache.put(event.request.url, res.clone());
                        return res;
                    })
            })
            .catch(function (err) {
                // Fallback to cache
                return caches.match(event.request);
            })
    );
});