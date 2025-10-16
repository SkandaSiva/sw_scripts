const queryParams = new URLSearchParams(self.location.search);
const VERSION = queryParams.get('v');
const CACHE_NAME = `pwa-cache-${VERSION}`;
const urlsToCache = [
    '/dist/js/main.min.js',
    '/dist/js/index.min.js?v='+VERSION,
    '/dist/js/index_mobile.min.js?v='+VERSION,
    '/dist/js/doctors.min.js?v='+VERSION,
    '/dist/js/doctors_mobile.min.js?v='+VERSION,
    '/dist/js/doctor.min.js?v='+VERSION,
    '/dist/js/doctor_unreg.min.js?v='+VERSION,
    '/dist/js/booking.min.js?v='+VERSION,
    '/dist/js/register.min.js?v='+VERSION,
    '/dist/js/gmapGlobal.min.js?v='+VERSION,
    '/dist/js/page.min.js?v='+VERSION,
    '/dist/js/blog.min.js?v='+VERSION,
    '/dist/js/review.min.js?v='+VERSION,
    '/dist/js/lgUtils.min.js?v='+VERSION,
    '/dist/js/loginRegisterUtils.min.js?v='+VERSION,
    '/assets/js/plugins/maps.js?v='+VERSION,
    '/assets/js/plugins/swiper/swiper-bundle.min.js',
    '/dist/css/indexmain.min.css?v='+VERSION,
    '/dist/css/doctormain.min.css?v='+VERSION,
    '/dist/css/doctorsmain.min.css?v='+VERSION,
    '/dist/css/booking.min.css?v='+VERSION,
    '/dist/css/pagemain.min.css?v='+VERSION,
    '/dist/css/loginRegisterCSS.min.css?v='+VERSION,
    '/assets/css/maps.css?v='+VERSION,
    '/assets/fonts/open-sans-v34-latin_greek-ext_greek-regular.woff2',
    '/assets/fonts/open-sans-v34-latin_greek-ext_greek-500.woff2',
    '/assets/fonts/open-sans-v34-latin_greek-ext_greek-600.woff2',
    '/assets/fonts/Feather-Icons.woff?7ncawf',
    '/assets/fonts/Material-Icons.woff?e8u1sb',
];



self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        //console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const request = event.request;
    /*if (url.hostname === 'instadoctor.gr') {
        event.respondWith(fetch(event.request));
        return;
    }*/

    if (request.destination === 'document' || (request.mode === 'cors' && request.destination === '')) {
        return;
    }

    if (request.method === 'POST') {
        return;
    }

    if (urlsToCache.includes(url.pathname+url.search)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    }

                    // Clone the request as it's a one-time use
                    const fetchRequest = event.request.clone();

                    return fetch(fetchRequest).then(response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response as it's a one-time use
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
                })
        );
    }
});