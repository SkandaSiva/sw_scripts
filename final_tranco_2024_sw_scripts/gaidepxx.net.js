importScripts('./cache-polyfill.js');

const CACHE_VERSION = '1.0.0.1';
const CACHE_NAME = 'web18' + CACHE_VERSION;
const CACHE_FOLDER = {
    IMAGES: '/' + CACHE_NAME + '/images/',
    MEDIA: '/' + CACHE_NAME + '/media/',
    CSS: '/' + CACHE_NAME + '/css/'
};
const staticCaches = [
    'index.php'
];

// self.addEventListener('install', function(event) {
//     console.log('Service worker install event!');
//     event.waitUntil(
//         caches.open(CACHE_NAME).then(function(cache) {
//             return cache.addAll(staticCaches);
//         })
//     );
// });

self.addEventListener('activate', function(event) {
    console.log('Service worker activate event!');
});

self.addEventListener('backgroundfetchsuccess', event => {
    console.log('[Service Worker]: Background Fetch Success', event.registration);
});

self.addEventListener('message', function(event) {
    console.log('SW Received Message: ' + event.data);
    if (typeof(event.data.eventType) !== 'undefined') {
        return;
    }
    const message = JSON.parse(event.data);
    switch (message.name) {
        case 'saveAudio':
            fetch(message.body).then(function(response) {

                if (!response.ok) {
                    console.log('bad response status');
                    return;
                }

                var responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then(function(cache) {
                        const filename = message.body.substring(message.body.lastIndexOf('/') + 1);
                        const cacheFile = CACHE_FOLDER.MEDIA + filename;

                        cache.match(cacheFile).then(function(response) {
                            if (typeof(response) === 'undefined') {
                                cache.put(cacheFile, responseToCache);

                                clients.matchAll().then(function(clients) {
                                    clients.forEach(function(client) {
                                        message.name = 'fileCached';
                                        client.postMessage(JSON.stringify(message));
                                    });
                                });

                            }
                        });

                    });

            });
            break;
        case 'updateJS':
            const timeTicks = new Date().getTime();
            const urlRequest = message.body + '?v=' + timeTicks;
            fetch(urlRequest).then(function(response) {

                if (!response.ok) {
                    console.log('bad response status');
                    return;
                }

                var responseToCache = response.clone();

                caches.open(CACHE_NAME)
                    .then(function(cache) {
                        const filename = message.body.substring(message.body.lastIndexOf('/') + 1);
                        const cacheFile = CACHE_FOLDER.MEDIA + filename;

                        cache.put(cacheFile, responseToCache);

                        clients.matchAll().then(function(clients) {
                            clients.forEach(function(client) {
                                message.name = 'JS files have been updated!';
                                client.postMessage(JSON.stringify(message));
                            });
                        });

                    });

            });
            break;
        default:
    }
});

self.addEventListener('fetch', function(event) {

    // console.log('Handling fetch event for', event.request.url);
    // Magic work. just make sure don't fetch any resource related to POST method
    if (event.request.method === 'POST' || event.request.headers.get('range') || event.request.url.indexOf('vtt') > -1) {
        return false;
    }

    let isAllowCache = false;
    // console.log(event.request.url);
    for (var i = 0; i < staticCaches.length; i++) {
        if (event.request.url.indexOf(staticCaches[i]) > -1) {
            isAllowCache = true;
        } else {
            if (location.href.indexOf('admin') === -1){
                if ((event.request.url.indexOf('js') > -1 ||
                    event.request.url.indexOf('css') > -1 ||
                    event.request.url.indexOf('jpg') > -1 ||
                    event.request.url.indexOf('jpeg') > -1 ||
                    event.request.url.indexOf('gift') > -1 ||
                    event.request.url.indexOf('png') > -1 ||
                    event.request.url.indexOf('font') > -1 ||
                    event.request.url.indexOf('js') > -1 ||
                    event.request.url.indexOf('css?v=') > -1 ||
                    event.request.url.indexOf('jpg?v=') > -1 ||
                    event.request.url.indexOf('jpeg?v=') > -1 ||
                    event.request.url.indexOf('gift?v=') > -1 ||
                    event.request.url.indexOf('png?v=') > -1 ||
                    event.request.url.indexOf('webmanifest') > -1) 
                    && event.request.url.indexOf('facebook') === -1 
                    && event.request.url.indexOf('fbcdn') === -1 
                    && event.request.url.indexOf('instagram') === -1 
                    && event.request.url.indexOf('invoke.js') === -1 
                    && event.request.url.indexOf('profitabletrustednetwork') === -1 
                    && event.request.url.indexOf('ads1-adnow') === -1 
                    && event.request.url.indexOf('chrome-extension') === -1 
                    && event.request.url.indexOf('highmaidfhr') === -1
                ) {
                    isAllowCache = true;
                }
            }
        }
    }

    if (isAllowCache === false) {
        return false;
    }

    if (event.request.headers.get('range')) {
        var pos =
            Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
        console.log('Range request for', event.request.url, ', starting position:', pos);
        event.respondWith(
            caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.match(event.request.url);
            }).then(function(res) {
                if (!res) {
                    return fetch(event.request)
                        .then(res => {
                            return res.arrayBuffer();
                        });
                }
                return res.arrayBuffer();
            }).then(function(ab) {
                return new Response(
                    ab.slice(pos), {
                        status: 206,
                        statusText: 'Partial Content',
                        headers: [
                            // ['Content-Type', 'video/webm'],
                            ['Content-Range', 'bytes ' + pos + '-' +
                                (ab.byteLength - 1) + '/' + ab.byteLength
                            ]
                        ]
                    });
            }));
    } else {
        // console.log('Non-range request for', event.request.url);
        event.respondWith(
            // caches.match() will look for a cache entry in all of the caches available to the service worker.
            // It's an alternative to first opening a specific named cache and then matching on that.
            caches.match(event.request).then(function(response) {
                if (response) {
                    // console.log('Found response in cache:', response);
                    return response;
                }
                // console.log('No response found in cache. About to fetch from network...');
                // event.request will always have the proper mode set ('cors, 'no-cors', etc.) so we don't
                // have to hardcode 'no-cors' like we do when fetch()ing in the install handler.
                return fetch(event.request).then(function(response) {
                    // console.log('Response from network is:', response);

                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                }).catch(function(error) {
                    // This catch() will handle exceptions thrown from the fetch() operation.
                    // Note that a HTTP error response (e.g. 404) will NOT trigger an exception.
                    // It will return a normal response object that has the appropriate error code set.
                    console.log('Fetching failed:', error);

                    return;
                });
            })
        );
    }

});