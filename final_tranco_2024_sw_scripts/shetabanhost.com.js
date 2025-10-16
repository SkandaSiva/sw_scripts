self.addEventListener('install', event => {
    //console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    //console.log('[Service Worker] Activating Service Worker ...', event);
    return self.clients.claim();
});

self.addEventListener('fetch', event => {
    //console.log('[Service Worker] Fetching something ....', event);
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }
    event.respondWith(fetch(event.request));
});

const prefolder = "/wp-content/themes/shetabanx";

const CACHE_STATIC_NAME = 'static-chache';
let URLS_TO_PRECACHE = [
    prefolder + '/assets/css/main.css',
    prefolder + '/assets/fonts/Estedad-Black-91699999.woff2',
    prefolder + '/assets/fonts/Estedad-Bold-f2aa3c71.woff2',
    prefolder + '/assets/fonts/Estedad-ExtraBold-d7819da3.woff2',
    prefolder + '/assets/fonts/Estedad-ExtraLight-c2638a77.woff2',
    prefolder + '/assets/fonts/Estedad-Light-1100bc82.woff2',
    prefolder + '/assets/fonts/Estedad-Medium-6f491962.woff2',
    prefolder + '/assets/fonts/Estedad-Regular-713f26e4.woff2',
    prefolder + '/assets/fonts/Estedad-SemiBold-dadf51a6.woff2',
    prefolder + '/assets/fonts/Estedad-Thin-40c39a40.woff2',
    prefolder + '/assets/fonts/remixicon-8fc22423.eot',
    prefolder + '/assets/fonts/remixicon-ea008af6.woff2',
    prefolder + '/assets/fonts/remixicon-f535f7a6.woff',
    prefolder + '/assets/img/aic1.svg',
    prefolder + '/assets/img/aic2.svg',
    prefolder + '/assets/img/aic3.svg',
    prefolder + '/assets/img/aic4.svg',
    prefolder + '/assets/img/aic5.svg',
    prefolder + '/assets/img/aic6.svg',
    prefolder + '/assets/img/azadi.jpg',
    prefolder + '/assets/img/backup.svg',
    prefolder + '/assets/img/bandwidth.png',
    prefolder + '/assets/img/bank1.svg',
    prefolder + '/assets/img/bank2.svg',
    prefolder + '/assets/img/bank3.svg',
    prefolder + '/assets/img/bank4.svg',
    prefolder + '/assets/img/building.jpg',
    prefolder + '/assets/img/cpanel.svg',
    prefolder + '/assets/img/cs1.svg',
    prefolder + '/assets/img/cs2.svg',
    prefolder + '/assets/img/cs3.svg',
    prefolder + '/assets/img/df1.svg',
    prefolder + '/assets/img/df2.svg',
    prefolder + '/assets/img/df3.svg',
    prefolder + '/assets/img/dots.svg',
    prefolder + '/assets/img/eu.jpg',
    prefolder + '/assets/img/fboom.svg',
    prefolder + '/assets/img/freedomain.svg',
    prefolder + '/assets/img/gr.png',
    prefolder + '/assets/img/gridline.svg',
    prefolder + '/assets/img/hand.png',
    prefolder + '/assets/img/hands-work-together.jpg',
    prefolder + '/assets/img/hetz-server.svg',
    prefolder + '/assets/img/ir-server.svg',
    prefolder + '/assets/img/laptop.png',
    prefolder + '/assets/img/license.svg',
    prefolder + '/assets/img/logo.svg',
    prefolder + '/assets/img/logo-w.svg',
    prefolder + '/assets/img/milad.jpg',
    prefolder + '/assets/img/remixicon.svg',
    prefolder + '/assets/img/rezayat.svg',
    prefolder + '/assets/img/round-text.png',
    prefolder + '/assets/img/server-dots.svg',
    prefolder + '/assets/img/simone.jpg',
    prefolder + '/assets/img/ssl1.jpg',
    prefolder + '/assets/img/ssl2.jpg',
    prefolder + '/assets/img/sup.svg',
    prefolder + '/assets/img/techno.svg',
    prefolder + '/assets/img/trade-bg.png',
    prefolder + '/assets/img/transfer-server.svg',
    prefolder + '/assets/img/vps-hosting.jpg',
    prefolder + '/assets/img/win11.png',
    prefolder + '/assets/js/main.js',
];


self.addEventListener('install', event => {
    //console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(cache => {
                //console.log('[Service Worker] Precaching App Shell');
                cache.addAll(URLS_TO_PRECACHE);
            })
            .then(() => {
                //console.log('[ServiceWorker] Skip waiting on install');
                return self.skipWaiting();
            })
    );
});