var dataCacheName = 'AspcData-v3';
var cacheName = 'AspcCache-v3';

var filesToCache = [
    '/assets/images/icons/pwa/icon-72x72.png',
    '/assets/images/icons/pwa/icon-96x96.png',
    '/assets/images/icons/pwa/icon-128x128.png',
    '/assets/images/icons/pwa/icon-144x144.png',
    '/assets/images/icons/pwa/icon-152x152.png',
    '/assets/images/icons/pwa/icon-192x192.png',
    '/assets/images/icons/pwa/icon-384x384.png',
    '/assets/images/icons/pwa/icon-512x512.png',
    '/assets/images/splash/launch-640x1136.png',
    '/assets/images/splash/launch-750x1294.png',
    '/assets/images/splash/launch-1242x2148.png',
    '/assets/images/splash/launch-1125x2436.png',
    '/assets/images/splash/launch-1536x2048.png',
    '/assets/images/splash/launch-1668x2224.png',
    '/assets/images/splash/launch-2048x2732.png',


    '/offline/index.html',
    '/assets/js/lib/modernizr.custom.js',
    '/assets/js/plugins/eqtr.detectdevice.js',
    '/assets/css/print.css',
    '/assets/scss/App.css',
    '/assets/js/pwa/layout.js',
    '/favicon.ico',
    '/assets/images/page-not-found-icon.png',
    '/assets/images/svg/site-logo.svg'

];

const offlineUrl = '/offline/index.html';

self.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
});

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache, offlineUrl);
            })
            .catch(function () {

            })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {

    var request = event.request;

    if (event.request.redirect === 'manual') {
        request = cleanResponse(event.request);
    }

    if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(request.url).catch(error => {
                // Return the offline page
                return caches.match(offlineUrl);
            })
        );
    }
    else {
        // Respond with everything else if we can
        event.respondWith(caches.match(request)
            .then(function (response) {
                return response || fetch(event.request);
            })
            .catch(function () {
                return caches.match(offlineUrl);
            })
        );
    }
});



function cleanResponse(response) {
    const clonedResponse = response.clone();

    // Not all browsers support the Response.body stream, so fall back to reading
    // the entire body into memory as a blob.
    const bodyPromise = 'body' in clonedResponse ?
        Promise.resolve(clonedResponse.body) :
        clonedResponse.blob();

    return bodyPromise.then((body) => {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
            headers: clonedResponse.headers,
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
        });
    });
}
