// ------------------------------------------------------------------------
//
//                              CACHE
//
// ------------------------------------------------------------------------
let CACHE_VERSION = null;
let CACHE_NAME = null;
const STATIC_TO_CACHE = [
    'https://matomo.monitoring.nolio.beer/matomo.js',
];
const STATIC_TO_CACHE_INCLUDE = [
    '/shadow_footer/',

    // s3 static
    'nolio-static.s3.eu-west-3.amazonaws.com',

    // s3 assets
    'nolio-assets.s3.amazonaws.com',

    // stripe
    'js.stripe.com',
    'm.stripe.network',

    // google fonts
    'fonts.gstatic.com',

    // leaflet - images
    'unpkg.com',
];

function cleanURL(url) {
    // clean AWS parameters to guarantee a unique key
    const url_obj = new URL(url);
    url_obj.searchParams.delete('X-Amz-Algorithm');
    url_obj.searchParams.delete('X-Amz-Credential');
    url_obj.searchParams.delete('X-Amz-Date');
    url_obj.searchParams.delete('X-Amz-Expires');
    url_obj.searchParams.delete('X-Amz-SignedHeaders');
    url_obj.searchParams.delete('X-Amz-Signature');
    return url_obj.toString();
}

// Important note:
// we handle the sw version with sw.js?v=VERSION
// when VERSION is changed, install & activate we be triggered
// activate will clear old caches

self.addEventListener('install', function(event) {
    // console.log('install');
    if (CACHE_NAME){
        event.waitUntil(
            caches.open(CACHE_NAME).then(function(cache) {
                cache.addAll(STATIC_TO_CACHE);
            })
        );
    }
});

self.addEventListener('activate', function(event) {
    // console.log('activate');
});

self.addEventListener('fetch', function(event) {
    if (CACHE_NAME !== null) {
        // console.log('use cache', CACHE_NAME);
        const cleaned_url = cleanURL(event.request.url);
        const should_use_cache = STATIC_TO_CACHE_INCLUDE.some(function (url) {
            return cleaned_url.includes(url);
        });
        // await update_cache_name();
        if (should_use_cache) {
            event.respondWith(
                caches.open(CACHE_NAME).then(function (cache) {
                    return cache.match(cleaned_url).then(function (response) {
                        // if (response) {
                        //     console.log('Le fichier est en cache', response);
                        // }
                        return response || fetch(event.request).then(function (networkResponse) {
                            // add the new response to the cache
                            cache.put(cleaned_url, networkResponse.clone());
                            return networkResponse;
                        });
                    });
                })
            );
        } else {
            event.respondWith(
                caches.match(event.request).then(function (response) {
                    // if (response) {
                    //     console.log('Le fichier est en cache', response);
                    // }
                    return response || fetch(event.request);
                })
            );
        }
    } else {
        // no cache
        // console.log('no cache');
        event.respondWith(fetch(event.request));
    }
});

self.addEventListener('message', function(event) {
    if (event.data === 'check_cache_version') {
        fetch('/nolio_version/').then(function(response) {
            response.text().then(function (version) {
                if (version !== CACHE_VERSION) {
                    // new version detected
                    CACHE_VERSION = version;
                    CACHE_NAME = 'nolio_cache_' + version;

                    // clear old caches
                    caches.keys().then(function(cacheNames) {
                        return Promise.all(
                            cacheNames.filter(function(cacheName) {
                                return cacheName !== CACHE_NAME;
                            }).map(function(cacheName) {
                                return caches.delete(cacheName);
                            })
                        );
                    });
                }
            });
        });
    }
});

// ------------------------------------------------------------------------
//
//                                  PUSH
//
// ------------------------------------------------------------------------
// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
    // Retrieve the textual payload from event.data (a PushMessageData object).
    // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
    // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
    const eventInfo = event.data.text();
    const data = JSON.parse(eventInfo);
    const head = data.head;
    const body = data.body;

    // Keep the service worker alive until the notification is created.
    event.waitUntil(
        self.registration.showNotification(head, {
            body: body,
            icon: 'https://nolio-static.s3.eu-west-3.amazonaws.com/nolio/images/nolio_logo_circle.png',
        })
    );
});

self.addEventListener('notificationclick', function (event) {
    let url = event.notification.data.url;
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({includeUncontrolled: true, type: 'window'}).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});