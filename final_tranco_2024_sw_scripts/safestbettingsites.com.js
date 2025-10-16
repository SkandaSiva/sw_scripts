const cacheName = 'TPM-PWA-1.0.0';
const startPage = 'https://www.safestbettingsites.com';
const offlinePage = 'https://www.safestbettingsites.com';
const filesToCache = [startPage, offlinePage];
const neverCacheUrls = [/\/wp-admin/,/\/wp-login/,/preview=true/];

self.addEventListener('install', event => {
    console.log('TPM PWA Service worker install event!');
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
        filesToCache.map(function(url) {
            return cache.add(url).catch(function (reason) {
            return console.log('TPM PWA: ' + String(reason) + ' ' + url);
            });
        });
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('TPM PWA service worker activation');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if ( key !== cacheName ) {
                    console.log('TPM PWA old cache removed', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e => {
    // Return if the current request url is in the never cache list
    if ( ! neverCacheUrls.every(checkNeverCacheList, e.request.url) ) {
        console.log( 'TPM: Current request is excluded from cache.' );
        return;
    }

    // Return if request url protocal isn't http or https
    if ( ! e.request.url.match(/^(http|https):\/\//i) )
        return;

    // Return if request url is from an external domain.
    if ( new URL(e.request.url).origin !== location.origin )
        return;

    // For POST requests, do not use the cache. Serve offline page if offline.
    if ( e.request.method !== 'GET' ) {
        e.respondWith(
            fetch(e.request).catch( function() {
                return caches.match(offlinePage);
            })
        );
        return;
    }

    e.respondWith(new Promise ((resolve, reject) => {
        fetch(e.request).then(function(response) {
            return caches.open(cacheName).then((cache) => {
                cache.put(e.request, response.clone());
                resolve(response);
            });
        }).catch(() => {

            function fallBackMatch () {
                caches.match(offlinePage).then((response) => {
                    resolve(response);
                });
            }

            caches.match(e.request).then((response) => {
                if(response) {
                    resolve(response)
                } else {
                    fallBackMatch();
                }
            }).catch(() => {
                fallBackMatch()
            });
        })
    }));
});

// Check if current url is in the neverCacheUrls list
function checkNeverCacheList(url) {
    if ( this.match(url) ) {
        return false;
    }
    return true;
}

self.addEventListener('push', event => {
    var body;

    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }

    const options = {
        body: body,
        vibrate: [100, 50, 100],
        data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
        },
        actions: [
        {action: 'explore', title: 'Go to the site'},
        {action: 'close', title: 'Close the notification'}
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});