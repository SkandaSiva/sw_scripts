"use strict";

self.addEventListener('install', function (event) {
    // Activate right away
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(self.clients.claim());
    event.waitUntil(async function () {
        // Feature-detect
        if (self.registration.navigationPreload) {
            // Enable navigation preloads!
            console.log("Enable navigation preloads!");
            await self.registration.navigationPreload.enable();
        } return;
    });
});

/* Listen to fetch events */
self.addEventListener('fetch', function (event) {

    /* Check if the image is a jpeg */
    if (/\/site-media\/[0-9]+\/.*\.(jpg|jpeg|png)\?format=/gmi.test(event.request.url)) {
        var supportsWebp = false;
        var liteMode = false;

        /* Inspect the accept header for WebP support */
        if (event.request.headers.has('accept')) {
            supportsWebp = event.request.headers
                .get('accept')
                .includes('webp');
        }

        if ("connection" in navigator) {
            if (navigator.connection.saveData === true) {
                liteMode = true;
            }
        }

        /* If we support WebP or in Lite mode */
        if (supportsWebp || liteMode) {

            /* Clone the request */
            var req = event.request.clone();
            var returnUrl = req.url;

            if (!returnUrl.includes("?")) {
                returnUrl += "?";
            }

            if (supportsWebp) {
                returnUrl = returnUrl
                    .replace(/(&format=[a-zA-Z]+)/gm, '')
                    .replace(/(\?format=[a-zA-Z]+)/gm, '?');
                /* Build the return URL */
                returnUrl += "&format=webp";
            }

            if (liteMode) {
                /* Build the return URL */
                returnUrl += "&lite=true";
            }

            event.respondWith(
                fetch(returnUrl, {
                    mode: 'no-cors'
                })
            );
        }
    }
});