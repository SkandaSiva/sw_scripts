const currentCacheVersion = '05-03-2024_1';

// ⚠️if any of these constants change, you need to bump currentCacheVersion ⚠️
const errorCSS = '/errors/error.css';
const favicon = '/favicon.ico';
const fonts = '/layout/fonts/';
const offlineHTML = getOfflineHtml();

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches
            .open(currentCacheVersion)
            .then(function (cache) {
                cache.addAll([
                    errorCSS,
                    favicon,
                ]);
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(caches.keys().then((cacheNames) => {
        return Promise.all(cacheNames.filter((cacheName) => {
            if (cacheName !== currentCacheVersion)
                return true;
        }).map(function (cacheName) {
            return caches.delete(cacheName);
        }));
    }));
});

self.addEventListener('fetch', event => {
    if ( event.request.url.indexOf( '/api/' ) !== -1 ) {
        return;
    }

    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    // request.mode of 'navigate' is unfortunately not supported in Chrome
    // versions older than 49, so we need to include a less precise fallback,
    // which checks for a GET request with an Accept: text/html header.

    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request).catch(error => {
                // The catch is only triggered if fetch() throws an exception, which will most likely
                // happen due to the server being unreachable.
                // If fetch() returns a valid HTTP response with an response code in the 4xx or 5xx
                // range, the catch() will NOT be called. If you need custom handling for 4xx or 5xx
                // errors, see https://github.com/GoogleChrome/samples/tree/gh-pages/service-worker/fallback-response
                return new Response(offlineHTML, {headers: {'Content-Type': 'text/html'}});
            })
        );
    } else if (requestMatchesAssetWeWantCached(event.request.url)) {
        event.respondWith(
            caches.open(currentCacheVersion).then(function(cache) {
                return cache.match(event.request).then(function (cachedResponse) {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    const clonedNetworkResponse = fetch(event.request).then(function(response) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                    return clonedNetworkResponse;
                });
            })
        );
    }

    function requestMatchesAssetWeWantCached(requestUrl) {
        const cacheAssets = [errorCSS, favicon, fonts];
        let matchFound = false;
        cacheAssets.some((cacheAsset) => {
            if (requestUrl.includes(cacheAsset)) {
                matchFound = true;
            }
        });
        return matchFound;
    }

    // If our if() condition is false, then this fetch handler won't intercept the request.
    // If there are any other fetch handlers registered, they will get a chance to call
    // event.respondWith(). If no fetch handlers call event.respondWith(), the request will be
    // handled by the browser as if there were no service worker involvement.
});

self.addEventListener('beforeinstallprompt', (e) => {
    prompt();
});

self.skipWaiting();
self.clients.claim();

// whenever getOfflineHtml changes, currentCacheVersion must change as well for cachebusting
function getOfflineHtml() {
    return `<!DOCTYPE html>
        <html style="font-size: 10px">
        <head>
            <meta charset="utf-8" />
            <title>Bolia | New Scandinavian Design | Offline</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="robots" content="noindex" />
            <meta name="robots" content="nofollow" />
            <link rel="stylesheet" type="text/css" href="../../../../errors/error.css"/>

        </head>
        <body class="c-disconnected-body">
            <div class="c-disconnected-logo c-disconnected-logo--offline">
                <svg viewBox="0 0 607 151" xmlns="http://www.w3.org/2000/svg" width="100" height="25">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <path d="M243.7047,75.096 C243.7047,44.685 230.8807,23.586 201.7087,23.586 C172.5407,23.586 159.7167,44.685 159.7167,75.096 C159.7167,106.541 174.6117,128.883 201.7087,128.883 C228.8097,128.883 243.7047,106.541 243.7047,75.096 M133.0267,75.096 C133.0267,31.033 155.1637,0 201.7087,0 C248.2587,0 270.3897,31.033 270.3897,75.096 C270.3897,119.78 245.5657,150.814 201.7087,150.814 C157.8517,150.814 133.0267,119.78 133.0267,75.096 M60.4068,124.6644 C77.1648,124.6644 86.8868,118.4604 86.8868,105.2204 C86.8868,91.4254 78.2808,85.1844 56.9928,85.1244 C56.8898,85.1244 46.4728,85.1234 46.3688,85.1234 L27.0988,85.7724 L27.0988,101.0834 C27.0988,109.1524 27.3068,117.2174 27.3068,124.6644 L60.4068,124.6644 Z M27.3068,25.3654 C27.3068,32.8134 27.0988,40.8824 27.0988,48.9514 L27.0988,64.8794 L46.3588,65.5054 C47.0268,65.5054 56.3508,65.4974 56.9918,65.4824 C75.2488,65.0474 83.1628,58.4034 83.1628,44.8144 C83.1628,31.7794 75.0938,25.3654 58.3378,25.3654 L27.3068,25.3654 Z M81.9218,74.1874 C99.7128,74.6034 113.1578,89.9094 113.1578,108.9424 C113.1578,134.8044 92.8868,147.4224 62.4758,147.4224 L-0.0002,147.4224 C0.4138,136.6654 1.0358,119.0824 1.0358,101.0834 L1.0358,48.9514 C1.0358,30.9524 0.4138,13.3694 -0.0002,2.6124 L65.3718,2.6124 C91.2318,2.6124 109.0208,17.0904 109.0208,40.4714 C109.0208,58.4654 98.8848,70.6724 81.9218,73.1544 L81.9218,74.1874 Z M418.2762,147.4231 C418.6922,136.6661 419.3092,119.0831 419.3092,101.0841 L419.3092,48.9521 C419.3092,30.9531 418.6922,13.3701 418.2762,2.6121 L446.4112,2.6121 C445.9942,13.3701 445.3782,30.9531 445.3782,48.9521 L445.3782,101.0841 C445.3782,119.0831 445.9942,136.6661 446.4112,147.4231 L418.2762,147.4231 Z M324.6163,124.2522 L348.4763,124.2522 C366.4753,124.2522 384.0583,123.6352 394.8163,123.2192 L394.8163,147.4232 L385.0373,147.4232 L295.7233,147.4232 C296.1343,136.6662 296.7563,119.0832 296.7563,101.0832 L296.7563,48.9522 C296.7563,30.9522 296.1343,13.3702 295.7233,2.6122 L323.8573,2.6122 C323.4463,13.3702 322.8243,30.9522 322.8243,48.9522 L322.8243,101.0832 C322.8243,109.1532 323.0303,117.0112 323.0303,124.2532 L324.6163,124.2522 Z M515.168,90.7373 L523.854,65.5013 C529.03,50.6063 534.2,35.2953 536.061,28.4703 L536.888,28.4703 C538.543,35.2953 544.13,50.6063 549.301,65.5013 L557.987,90.7373 C557.987,90.7373 552.738,91.5703 536.868,91.5703 C520.997,91.5703 515.168,90.7373 515.168,90.7373 M587.811,101.5523 L567.663,49.3513 C560.706,31.3283 554.519,13.5333 550.75,2.6123 L522.821,2.6123 C519.051,13.5333 512.842,31.3313 505.886,49.3543 L485.737,101.5543 C478.78,119.5773 471.509,136.8013 466.963,147.4233 L495.93,147.4233 C499.24,137.2873 502.339,128.5963 507.515,113.4953 C507.515,113.4953 519.705,112.6593 536.868,112.6593 C554.03,112.6593 565.645,113.4953 565.645,113.4953 C570.815,128.5963 573.714,137.2873 577.024,147.4233 L606.772,147.4233 C602.226,136.8013 594.768,119.5753 587.811,101.5523" id="bolia-logo-2" fill="#ffffff"></path>
                    </g>
                </svg>
            </div>

            <section class="c-disconnected-text-wrapper">
                <h1>It looks like you’re out of internet...</h1>
                <p class="mb-0">Might sound a bit old-school, but check your connection or give it a few minutes?</p>
                <p class="mt-2">Even the bravest need a little breather.</p>
                <button class="c-button" onclick="window.location.reload();">Get reconnected</button>
            </section>
            <footer class="c-disconnected-links">
                <p><a href="//www.facebook.com/Boliacom" target="_blank">Facebook</a></p>
                <p><a href="//instagram.com/boliacom/" target="_blank">Instagram</a></p>
                <p><a href="//youtube.com/c/Boliacom" target="_blank">YouTube</a></p>
                <p><a href="//www.pinterest.com/bolia/" target="_blank">Pinterest</a></p>
                <p><a href="//soundcloud.com/bolia" target="_blank">Soundcloud</a></p>
            </footer>
            <div class="c-disconnected-body--background_offline"></div>
        </body>
        </html>
    `
}
