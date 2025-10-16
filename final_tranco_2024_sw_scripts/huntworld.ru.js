// Caches
var CURRENT_CACHES = {
    font: 'font-cache-v1',
    css:'css-cache-v1',
    js:'js-cache-v1',
    image: 'image-cache-v1'
};

self.addEventListener('install', (event) => {
    self.skipWaiting();
    //console.log('Service Worker has been installed');
});

self.addEventListener('activate', (event) => {
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
        return CURRENT_CACHES[key];
    });

    // Delete out of date caches
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) == -1) {
                        //console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    //console.log('Service Worker has been activated');
});

// self.addEventListener('fetch', function(event) {
//     if(event.request.url.match('/bitrix/') == null ) {
//         //console.log('Fetching url:', event.request.url);
//         event.respondWith(async function () {
//             const cachedResponse = await caches.match(event.request);
//             if (cachedResponse) {
//                 //console.log("\tCached version found: " + event.request.url);
//                 return cachedResponse;
//             } else {
//                 //console.log("\tGetting from the Internet:" + event.request.url);
//                 return await fetchAndCache(event.request);
//             }
//         }());
//     }
// });

function fetchAndCache(request) {
    return fetch(request)
        .then(function (response) {
            // Check if we received a valid response
            if (!response.ok) {
                return response;
                // throw Error(response.statusText);
            }
            if (response.status < 400) {
                var cur_cache;
                if (response.headers.get('content-type') &&
                    response.headers.get('content-type').indexOf("text/css") >= 0) {
                    //cur_cache = CURRENT_CACHES.css;
                    caches.delete('css-cache-v1');
                } else if (response.headers.get('content-type') &&
                    response.headers.get('content-type').indexOf("application/javascript") >= 0) {
                    caches.delete('js-cache-v1');
                } else if (response.headers.get('content-type') &&
                    response.headers.get('content-type').indexOf("font") >= 0) {
                    caches.delete('font-cache-v1');
                    //cur_cache = CURRENT_CACHES.font;
                } else if (response.headers.get('content-type') &&
                    response.headers.get('content-type').indexOf("image") >= 0) {
                    caches.delete('image-cache-v1');
                    //cur_cache = CURRENT_CACHES.image;
                }
                if (cur_cache) {
                    //console.log('\tCaching the response to', request.url);
                    return caches.open(cur_cache).then(function (cache) {
                        cache.put(request, response.clone());
                        return response;
                    });
                }
            }
            return response;
        })
        .catch(function (error) {
            console.log('Request failed for: ' + request.url, error);
            throw error;
        });
}