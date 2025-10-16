'use strict';

// reference: https://googlechrome.github.io/samples/service-worker/custom-offline-page/

const CACHE_NAME = 'offline-2'; // increment number case is needed to cache updated resources
const OFFLINE_URL = '/offline5.html';

self.addEventListener('install', (event) => {
    self.skipWaiting();

    // populate initial serviceworker cache
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.add(new Request(OFFLINE_URL, { cache: 'reload' }))) // cache:reload forces the resource to be fetched from network            
    );
});

addEventListener('activate', event => {
    /* 
    // DO NOT PUSH THIS INTO PRODUCTION...
    // unless necessary to destroy service worker
    self.registration.unregister()
        .then(function () {
            return self.clients.matchAll();
        })
        .then(function (clients) {
            clients.forEach(client => client.navigate(client.url))
        });
    return;
    /* */

    event.waitUntil(async function () {
        // enable navigation preload if it's supported
        // reference: https://developers.google.com/web/updates/2017/02/navigation-preload
        if (self.registration.navigationPreload) {
            await self.registration.navigationPreload.enable();
        }
    }());
});

addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        return event.respondWith(async function () {
            try {
                // preloading on an error page throws an error, which would redirect to the offline page on the catch section below;
                // in case more error pages are added to the site, they should also be added to this url verification
                var isErrorPage = false;
                var dummyInt = 1;
                if (event.request && event.request.url && event.request.url.indexOf('/NotFound?') > -1) {
                    isErrorPage = true;
                }

                // use the preloaded response, if it's there
                if (!isErrorPage && self.registration.navigationPreload) {
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }
                }

                // error page has to be loaded from network directly through it's url
                if (isErrorPage) {
                    const networkResponse = await fetch(event.request.url);
                    return networkResponse;
                }

                // Else try the network.
                return fetch(event.request);

                // preloaded response not available, fetch the response from the network
                /*var fetchRequest = event.request.clone();
                const networkResponse = await fetch(fetchRequest);
                return networkResponse;*/
            }
            catch (error) {
                // in case of error, redirect to an offline cached page
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
            }
        }());
    }
});
