const CACHE_NAME = 'ghasedak-assets-v1';
const STATIC_ASSETS = [
    // CSS Files
    'https://ghasedak24.com/assets/css/fonts/mainFont.css?v=3',
    'https://ghasedak24.com/assets/css/menu/topDefaults.css?v=19',
    'https://ghasedak24.com/assets/css/menu/desktopSpecific.css?v=4',
    'https://cdn.ghasedak24.com/static/content/shared/bundles/css/cdn_build_home.202409231127.css',
    'https://cdn.ghasedak24.com/static/content/shared/assets/css/landing/flightLandingsOutput.css?v=1731143598',
    'https://cdn.ghasedak24.com/static/content/shared/bundles/css/bottombase.202409231127.css',
    'https://cdn.ghasedak24.com/static/content/shared/bundles/css/index-base.202407021631.css',
    'https://cdn.ghasedak24.com/static/content/shared/bundles/css/init-build.202401171149.css',

    // JavaScript Files
    'https://cdn.ghasedak24.com/static/content/shared/bundles/js/index-core.202312201224.js',
    'https://cdn.ghasedak24.com/static/content/shared/bundles/js/base-func.202409011545.js',
    'https://cdn.ghasedak24.com/static/content/shared/bundles/js/home-build.202409301730.js',
    'https://cdn.ghasedak24.com/static/content/shared/assets/js/menu/flightSwitch.js?v=4',
    'https://cdn.ghasedak24.com/static/content/shared/assets/js/dist/domesticFlight/search.bundle.js?v=1731143598',
    'https://cdn.ghasedak24.com/static/content/shared/assets/js/menu/searchAgain.js?v=1',
    'https://cdn.ghasedak24.com/static/content/shared/bundles/js/base.202409231447.js',
    'https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js',
    'https://www.gstatic.com/firebasejs/8.9.1/firebase-messaging.js',
    'https://www.googletagmanager.com/gtm.js?id=GTM-WWS563F',

    // Fonts
    'https://cdn.ghasedak24.com/static/content/shared/webfonts/font-awesome/fontawesome-webfont.woff2?v=4.7.0',
    'https://cdn.ghasedak24.com/static/content/shared/webfonts/glyphicons-halflings-regular.woff',
    'https://ghasedak24.com/assets/fonts/IranYekan/IRANYekanXVFaNumVF.woff',

    // Images
    'https://cdn.ghasedak24.com/static/content/shared/media/mainHeroImage.png',
    'https://cdn.ghasedak24.com/static/content/shared/media/mainHeroImage.webp',
    'https://cdn.ghasedak24.com/static/content/shared/media/app-banner.webp',
    'https://ghasedak24.com/assets/images/moreServicesVisa.svg',
    'https://ghasedak24.com/assets/images/moreServicesArrow.svg',
    'https://ghasedak24.com/assets/images/moreServicesTour.svg',
    'https://cdn.ghasedak24.com/static/content/shared/media/homepageCard1.svg',
    'https://cdn.ghasedak24.com/static/content/shared/media/homepageCard2.svg',
    'https://cdn.ghasedak24.com/static/content/shared/media/homepageCard3.svg',

    // Icons
    'https://ghasedak24.com/favicon.ico',
    'https://ghasedak24.com/maskable_icon_x192.png',

    // JSON and Manifest
    'https://ghasedak24.com/manifest.json',
];

// Install event: Cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);
    if (!STATIC_ASSETS.includes(requestUrl.href)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});