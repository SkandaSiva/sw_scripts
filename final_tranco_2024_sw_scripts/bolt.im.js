
const CACHE_NAME = 'spike-cache-v202410091039';

// Define regular expressions for assets you want to cache
const assetsRegex = /\.(?:png|jpg|jpeg|svg|gif|css|js)(?:\?.*)?$/;

// Define a function to check if the URL belongs to the specified domains and their subdomains
const isValidDomain = (url) => {
    const validDomainPattern = /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?(spikenow\.com|kxcdn\.com)/;
    return validDomainPattern.test(url);
};

// Define a function to check if the request path should be excluded from caching
const shouldExcludeFromCache = (path, searchParams) => {
    return path.startsWith('/wp-admin') || 
           path.startsWith('/wp-includes') || 
           path.startsWith('/wp-content/plugins') || 
           path.startsWith('/wp-json') ||
           searchParams.has('s');
};

self.addEventListener('install', event => {
    // No initial caching is done here
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    const requestPath = requestUrl.pathname;
    const searchParams = requestUrl.searchParams;
    
    // Do not cache the service worker file itself
    if (requestPath === '/service-worker.js' || requestPath === '/service-worker.js.php') {
        event.respondWith(fetch(event.request));
        return;
    }
    
    if (requestPath.includes('service-worker.js') || requestPath.includes('service-worker.js.php') ) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Check if the request URL is valid for caching
    if (!isValidDomain(requestUrl.origin)) {
        // For URLs that don't match the domain, fetch directly from the network
        event.respondWith(fetch(event.request));
        return;
    }

    // Check if the request path or query parameters should be excluded from caching
    if (shouldExcludeFromCache(requestPath, searchParams)) {
        // For excluded paths or if the `s` parameter is present, fetch directly from the network
        event.respondWith(fetch(event.request));
        return;
    }
    
    // This block handles navigation requests without caching
    if (event.request.mode === 'navigate') {
        event.respondWith(fetch(event.request));
        return;
    } else {
        // For all other requests, also fetch directly without caching
        event.respondWith(fetch(event.request));
        return;
    }

    if (event.request.mode === 'navigate') {
        // This is a navigation request
        event.respondWith(
            caches.match(event.request).then(response => {
                if (response) {
                    //console.log('Returning cached page: ', event.request.url);
                    return response; // Cache hit - return the response from the cache
                }
                return fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        //console.log('Caching new page: ', event.request.url);
                        return networkResponse;
                    });
                });
            }).catch(() => {
                return caches.match('/');
            })
        );
    } else {
        // This is not a navigation request, continue as usual
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        //console.log('Returning cached asset: ', event.request.url);
                        return response; // Cache hit - return the response from the cache
                    }
                    return fetch(event.request).then(networkResponse => {
                        // Check if the request URL matches the assets regular expression
                        if (assetsRegex.test(event.request.url)) {
                            return caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, networkResponse.clone());
                                //console.log('Caching new asset: ', event.request.url);
                                return networkResponse;
                            });
                        } else {
                            return networkResponse;
                        }
                    });
                })
        );
    }
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        //console.log('Deleting old cache: ', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
            .then(() => self.clients.claim())
    );
});

