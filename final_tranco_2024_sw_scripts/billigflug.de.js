/* global clients */

"use strict";

// we're only using one service-worker
self.addEventListener('install', function () {
    self.skipWaiting();
});

// handle fetch-requests also for the page that installs the service-worker
self.addEventListener('activate', function (event) {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function (event) {
    // handle internal images but skip ones with adaptive sizes
    if (true === /__(b127b0bc|[abcdef\d]+)\.(jpg|png)$/.test(event.request.url)
        && false === /\/x\d+\/x\d+\//.test(event.request.url)
    ) {
        var supportsWebp = false;
        if (event.request.headers.has('accept')) {
            supportsWebp = event.request.headers
                .get('accept')
                .includes('webp');
        }

        if (supportsWebp) {
            var req = event.request.clone(),
                webpImage = fetch(req.url.substr(0, req.url.lastIndexOf(".")) + '.webp', {
                    mode: 'cors'
                });

            event.respondWith(
                webpImage.then(function (response) {
                    if (!response || response.status !== 200) {
                        return fetch(event.request);
                    } else {
                        return response;
                    }
                }).catch(function () {
                    return fetch(event.request);
                })
            );
        }
    }
});