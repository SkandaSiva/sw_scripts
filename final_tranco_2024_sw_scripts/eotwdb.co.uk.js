const CACHE_VERSION = 1.1;

let CURRENT_CACHES = {
    offline: 'offline-v' + CACHE_VERSION,
    pages: 'pages-v' + CACHE_VERSION,
    articles: 'articles-v' + CACHE_VERSION,
    redirects: 'redirects-v' + CACHE_VERSION,
    images: 'images-v' + CACHE_VERSION,
    styles: 'styles-v' + CACHE_VERSION,
    javascript: 'javascript-v' + CACHE_VERSION,
    fonts: 'fonts-v' + CACHE_VERSION,
};

const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CURRENT_CACHES['offline'])
              .then((cache) => {
                  console.log('Opened Cache: ' + CURRENT_CACHES['offline']);
                  return cache.add(OFFLINE_URL);
              })
              .catch((e) => {
                  console.log('Could not open cache', e);
                  return false;
              }),
    );
});

self.addEventListener('activate', (event) => {
    console.log("Service worker activated, cleaning old caches");
    let expectedCacheNames = Object.values(CURRENT_CACHES);

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if(url.origin !== self.location.origin) {
        console.debug("Skipping non-local origin request", event.request.url);

        return;
    }

    //Loading Fonts - Try to load from cache first
    if (event.request.mode !== 'navigate' && url.pathname.substring(0, 7) === '/fonts/') {
        event.respondWith(
            caches.open(CURRENT_CACHES['fonts']).then(async (cache) => {
                let match = await cache.match(event.request);

                if (match) {
                    return match;
                }

                let response = await fetch(event.request);

                await cache.put(event.request, response.clone());

                return response;
            }),
        );
    }

    //Loading style sheet
    if (event.request.mode === 'no-cors' && event.request.headers.get('accept').includes('text/css')) {
        event.respondWith(
            fetch(event.request).then((response) => {
                let responseClone = response.clone();

                caches.open(CURRENT_CACHES['styles'])
                      .then(cache => {
                          cache.put(event.request, responseClone);
                      });

                return response;
            }).catch(error => {
                console.log('Fetch failed; checking for cached style instead.', error);
                return caches.match(event.request);
            }),
        );
    }

    //Handle Pages
    if (event.request.mode === 'navigate' ||
        (event.request.method === 'GET' &&
            event.request.headers.get('accept').includes('text/html'))) {

        event.respondWith(
            fetch(event.request).then(async (response) => {
                // We don't want to use the cache for the offline page
                if (url.pathname === '/offline') {
                    return response;
                }

                // We don't want to cache any non 2xx response codes
                if (response.status < 200 || response.status >= 300) {
                    return response;
                }

                let cacheName = CURRENT_CACHES['pages'];

                if (url.pathname.match("/blog/([a-z0-9\\-]+)/?$")) {
                    cacheName = CURRENT_CACHES['articles'];
                }

                if (response.type.match('redirect')) {
                    cacheName = CURRENT_CACHES['redirects'];
                }

                try {
                    let cache = await caches.open(cacheName);
                    await cache.put(event.request, response.clone());
                } catch (e) {
                    console.warn("Couldn't cache requested page", e);
                }

                return response;
            }).catch(async (error) => {
                console.log('Fetch failed; checking for cached page instead.', error);

                let response = await caches.match(event.request);

                if ('undefined' !== typeof response) {
                    return response;
                }

                console.log('No cached page, using offline page instead', error);
                return caches.match(OFFLINE_URL);
            }),
        );
    }

    //Handle Images
    if ((event.request.mode === 'no-cors' || event.request.mode === 'same-origin') && event.request.headers.get('accept').includes('image/*')) {
        event.respondWith(
            caches.open(CURRENT_CACHES['images']).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function (response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            }),
        );
    }

    //Handle Javascript
    if (url.pathname.substring(url.pathname.length - 3) === '.js') {
        event.respondWith(
            fetch(event.request).then((response) => {
                let responseClone = response.clone();

                caches.open(CURRENT_CACHES['javascript'])
                      .then(cache => {
                          cache.put(event.request, responseClone);
                      });

                return response;
            }).catch(error => {
                console.log('Fetch failed; checking for cached javascript instead.', error);
                return caches.match(event.request);
            }),
        );
    }
});
