'use strict';

var cacheVersion = 1;
var currentCache = {
    offline: 'offline-cache-' + cacheVersion
};
const offlineUrl = 'offline.html?v=' + cacheVersion;

this.addEventListener('install', event => {
    console.log('WORKER: install event in progress...');
    // this.skipWaiting(); // ONLY if needed to hard refresh version
    event.waitUntil(
        caches.open(currentCache.offline).then(function (cache) {
            console.log('WORKER: install completed!');
            return cache.addAll([
                './ui-images/brand/hopoti-logo-combined-white.svg',
                './static/js/offline.js',
                './static/css/offline.css',
                offlineUrl
            ]);
        })
    );
});

this.addEventListener('activate', event => {
    console.log('WORKER: activate event in progress...');
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!currentCache.offline.includes(key)) {
                    return caches.delete(key);
                }
            })
        )).then(() => {
            console.log('WORKER: activate completed!');
        })
    );
});

this.addEventListener('fetch', event => {
    // request.mode = navigate isn't supported in all browsers
    // so include a check for Accept: text/html header.
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(fetch(event.request).then(function (response) {
                if (!response.ok && response.type !== 'opaqueredirect' && response.status < 400 && response.status > 600) {
                    // An HTTP error response code (40x, 50x) won't cause the fetch() promise to reject.
                    // We need to explicitly throw an exception to trigger the catch() clause.
                    console.log("WORKER: Request error!");
                    throw Error('response status ' + response.status);
                }

                // If we got back a non-error HTTP response, return it to the page.
                return response;
            }).catch(function (error) {
                console.log("WORKER: Return offline page");
                return caches.match(offlineUrl);
            })
        );
    } else {
        // Respond with everything else if we can
        event.respondWith(caches.match(event.request)
            .then(function (response) {
                return response || fetch(event.request);
            }).catch(function (error) {
                console.log("WORKER: Error while request not in Scope");
                throw Error('WORKER: Error while request not in Scope');
            })
        );
    }
});
