const OFFLINE_URL = '/shop/pwastart.html';
var CACHE_NAME;
var CACHE_FILES = [
    '/shop/templates_satellitenseiten/default/js/lazysizes.min.js',
    '/shop/templates_satellitenseiten/default/css/bootstrap.min.css',
    '/shop/templates_satellitenseiten/default/js/bootstrap.bundle.min.js',
    '/shop/templates_satellitenseiten/default/js/script.min.js',
    '/shop/templates_satellitenseiten/favicon/favicon-16x16.png',
    '/shop/templates_satellitenseiten/favicon/favicon-32x32.png',
    '/shop/templates_satellitenseiten/default/images/logo.svg',
    OFFLINE_URL
];

switch(self.location.hostname){
    case 'polstermoebel-online-kaufen.de':
        CACHE_NAME = 'PMOK_CACHE2';
        CACHE_FILES.push('/templates/templates_satellitenseiten/javascript/polsterplaner-tablet.min.js');
        CACHE_FILES.push('/templates/templates_satellitenseiten/css/polsterplaner.min.css');
        break;
    case 'wohnzimmermoebel-online-kaufen.de':
        CACHE_NAME = 'WMOK_CACHE';
        CACHE_FILES.push('/templates/templates_satellitenseiten/javascript/konfigurator-tablet.min.js');
        CACHE_FILES.push('/templates/templates_satellitenseiten/css/konfigurator.min.css');
        break;
    case 'schlafzimmermoebel-online-kaufen.de':
        CACHE_NAME = 'SMOK_CACHE';
        CACHE_FILES.push('/templates/templates_satellitenseiten/javascript/konfigurator-tablet.min.js');
        CACHE_FILES.push('/templates/templates_satellitenseiten/css/konfigurator.min.css');
        break;
    default:
        CACHE_NAME = 'LOCAL_CACHE';
        CACHE_FILES.push('/shop/templates/templates_satellitenseiten/javascript/polsterplaner-tablet.min.js');
        CACHE_FILES.push('/shop/templates/templates_satellitenseiten/css/polsterplaner.min.css');
        CACHE_FILES.push('/shop/templates/templates_satellitenseiten/javascript/konfigurator-tablet.min.js');
        CACHE_FILES.push('/shop/templates/templates_satellitenseiten/javascript/letz_jquery.min.js');
        CACHE_FILES.push('/shop/templates/templates_satellitenseiten/javascript/swiper/swiper.min.js');
        CACHE_FILES.push('/shop/templates/templates_satellitenseiten/javascript/photoswipe/photoswipe.min.js');
        CACHE_FILES.push('/shop/templates_satellitenseiten/default/js/jquery-3.4.1.min.js');
        CACHE_FILES.push('/shop/templates/templates_satellitenseiten/css/konfigurator.min.css');
}


// Customize this with a different URL if needed.

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache){
            // Setting {cache: 'reload'} in the new request will ensure that the response
            // isn't fulfilled from the HTTP cache; i.e., it will be from the network.
            //cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
            return cache.addAll(
                CACHE_FILES.map(url => new Request(url, { credentials: 'same-origin' }))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                // First, try to use the navigation preload response if it's supported.
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }

                const networkResponse = await fetch(event.request);
                return networkResponse;
            } catch (error) {
                // catch is only triggered if an exception is thrown, which is likely
                // due to a network error.
                // If fetch() returns a valid HTTP response with a response code in
                // the 4xx or 5xx range, the catch() will NOT be called.
                console.log('Fetch failed; returning offline page instead.', error);

                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(OFFLINE_URL);
                return cachedResponse;
            }
        })());
    }
});

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = body => {
        // you could refresh a notification badge here with postMessage API
        const title = "ML-Push";

        return self.registration.showNotification(title, {
            body,
        });
    };

    if (event.data) {
        const message = event.data.text();
        event.waitUntil(sendNotification(message));
    }
});


self.addEventListener('activate', function(event) {

    console.log('activating...');
    if ('navigationPreload' in self.registration) {
        event.waitUntil(
            self.registration.navigationPreload.enable()
                .then(function(){
                    console.log('active...');
                    return self.clients.claim();
                })
        );
    }
    // Tell the active service worker to take control of the page immediately.

});