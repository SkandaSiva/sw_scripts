const SERVICE_WORKER_VERSION = 1.1;
const CACHE_VERSION = 'ft' + SERVICE_WORKER_VERSION;

let cacheResources = [
    '/LANG/offline.php',
    'BASE_URL/main/css/main.min.css',
    'BASE_URL/main/css/fonts/notoSans/notoSans.css',
    'BASE_URL/main/css/fonts/fontawesome/fonts/fontawesome-webfont.eot#iefix&v=4.4.0',
    'BASE_URL/main/css/fonts/fontawesome/fonts/fontawesome-webfont.woff?v=4.4.0',
    'BASE_URL/main/css/fonts/fontawesome/fonts/fontawesome-webfont.woff2?v=4.4.0',
    'BASE_URL/main/css/fonts/fontawesome/fonts/fontawesome-webfont.ttf?v=4.4.0',
    'BASE_URL/main/css/fonts/fontawesome/fonts/fontawesome-webfont.svg?v=4.4.0#fontawesomeregular',
    '/WORLD/ajax/offline.php',
    '/WORLD/js/templates/dialog.base.html',
    '/WORLD/js/templates/dialog.error.html',
    'BASE_URL/main/js/templates/dialog.base.html',
    'BASE_URL/main/js/templates/dialog.error.html'
];

let language = 'de';
let world = null;
let baseURL = '';

self.addEventListener('install', event => {
    baseURL = new URL(location).searchParams.get('baseURL');
    language = new URL(location).searchParams.get('language');
    world = new URL(location).searchParams.get('world');

    cacheResources = cacheResources.filter((resource, index) => {
        return resource.indexOf('/WORLD/') !== -1 ? world !== null : true
    });

    cacheResources.map((resource, index) => {
        resource = resource.replace('BASE_URL', baseURL);
        resource = resource.replace('LANG', language);
        if(world !== null) {
            resource = resource.replace('/WORLD/', world);
        }
        cacheResources[index] = resource;
        return resource;
    });

    event.waitUntil(caches.open(CACHE_VERSION)
        .then(cache => {
            return cache.addAll(cacheResources);
        })
        .then(() => {
            return self.skipWaiting();
        })
    );
})

// Cleanup old cache storages
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (CACHE_VERSION !== cacheName) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                return fetch(event.request)
                    .catch(() => {
                        if(event.request.mode === 'navigate') {
                            return caches.match('/' + language + '/offline.php');
                        }

                        if(event.request.url.includes('/ajax/')) {
                            if(world !== null) {
                                return caches.match(world + 'ajax/offline.php');
                            }
                        }

                        if(event.request.url.includes('/js/templates/')) {
                            if(world !== null) {
                                return caches.match(event.request.url);
                            }
                        }
                    });
            })
    );
});