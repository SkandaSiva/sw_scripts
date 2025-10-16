var CACHE = 'yard-1.0.5-beta';

var ignore = [
    'extension://',
    '/cp/',
    'adobedtm.com',
    'cubed.weareyard.com/r.js',
    'digitalbeacon.co',
    '/csrf',
    'omtrdc.net', // adobe owned
];

self.addEventListener('install', function (evt) {
    skipWaiting();
    evt.waitUntil(precache());
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    if (cacheName == CACHE) {
                        return false;
                    }
                    return true;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function (evt) {
    var request = evt.request;


    // Ignore non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    if (request.url.search('extension://') != -1) {
        return;
    }
    if (request.url.search('/cp/') != -1) {
        return;
    }
    if (request.url.search('adobedtm.com') != -1) {
        return;
    }
    if (request.url.search('cubed.weareyard.com') != -1) {
        return;
    }
    if (request.url.search('digitalbeacon.co') != -1) {
        return;
    }
    if (request.url.search('omtrdc.net') != -1) {
        return;
    }
    if (request.url.search('2o7.net') != -1) {
        return;
    }
    if (request.url.search('/csrf') != -1) {
        return;
    }
    
    if (request.url.search('/!/') != -1) {
        return;
    }
       
    // Ignore video requests because of Safari's range bug https://philna.sh/blog/2018/10/23/service-workers-beware-safaris-range-request/
    if (request.url.match(/\.(mp4)$/)) {
        return;
    }

    evt.respondWith(fromCache(request));

});


function precache() {
    // Delete old caches
    caches.keys().then(function (names) {
        [].forEach.call(names, function (name) {
            if (name != CACHE) {
                caches.delete(name);
            }
        });
    });

    // Cache offline page and homepage
    return caches.open(CACHE).then(function (cache) {
        // Cache everything
        return cache.addAll([
            '/',
            '/offline'
        ]);
    });
}


function fromCache(request) {

    // If page - network first
    if (request.destination == 'document') {
        return fetch(request).then(function (response) {
            let responseClone = response.clone();
            caches.open(CACHE).then(function (cache) {
                cache.put(request, responseClone);
            });
            return response;
        }).catch(function () {
            return caches.open(CACHE).then(function (cache) {
                return cache.match(request).then(function (matching) {
                    if (matching) {
                        return matching;
                    }
                    return caches.match('/offline');
                });
            });
        });
    }

    // If image - cache first
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (matching) {

                return matching;
            } else {
                // Update cache if online
                return fetch(request).then(function (response) {
                    let responseClone = response.clone();
                    caches.open(CACHE).then(function (cache) {
                        cache.put(request, responseClone);
                    });
                    return response;
                });
            }
        }).catch(function (error) {
            // Serve offline asset if not online
            if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
                return missingImage(request);
            }
            return;
        });
    });
}


function missingImage(request) {
    if (navigator.onLine === false) {
        return new Response(`
            <svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <title id="offline-title">Offline</title>
                <g fill="none" fill-rule="evenodd">
                    <path fill="#D8D8D8" d="M0 0h400v300H0z"/>
                    <text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold">
                        <tspan x="93" y="172">offline</tspan>
                    </text>
                </g>
            </svg>`,
            {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-store'
                }
            }
        );
    } else {
        return fetch(request).then(function (response) {
            return response;
        });
    }
}
