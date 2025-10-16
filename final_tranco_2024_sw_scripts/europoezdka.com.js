const staticVersion = new URL(location).searchParams.get('staticVersion');
const CACHE_NAME = 'service-worker-cache-' + staticVersion;
const OFFLINE_URL = '/offline';
const lang = new URL(location).searchParams.get('lang');
const HTMLToCache = new URL(location).searchParams.get('cdn');
const MY_FILES = [
    '/',
    '/offline',
    '/pomoc',
    '/podroze-pociagiem',
    '/kontakt',
    '/kierunki-podrozy-pociagiem',
    '/zwroty-i-wymiany-biletow',
    '/support',
    '/travel-inspirations',
    '/contact',
    '/destinations',
    '/refunds',
    '/train-schedule',
    '/rozklad-jazdy',
    '/dworce-kolejowe',
    '/moja-rezerwacja',
    '/my-reservation',

    '/manifest.json?v=1.0.3',

    HTMLToCache + '/public/train/css/fonts/lato/lato-v23-latin-ext_latin-700.woff2',
    HTMLToCache + '/public/train/css/fonts/lato/lato-v23-latin-ext_latin-regular.woff2',

    HTMLToCache + '/public/train/css/europodroze/dist/components/reservation_components.min.css',
    HTMLToCache + '/public/train/css/europodroze/dist/components/schedule.min.css',
    HTMLToCache + '/public/train/css/europodroze/dist/components/railways_station.min.css',
    HTMLToCache + '/bower_components/bootstrap/dist/css/bootstrap.min.css',
    HTMLToCache + '/bower_components/bootstrap/dist/css/bootstrap-theme.min.css',

    HTMLToCache + '/public/train/js/firstpage/main.min.js',
    HTMLToCache + '/public/train/js/firstpage/login_form.min.js',
    HTMLToCache + '/public/train/js/subpages/subpages.min.js',
    HTMLToCache + '/public/train/js/dist/reservation_components.min.js',
    HTMLToCache + '/public/train/js/load-sliders.js',
    HTMLToCache + '/public/train/js/cookie-info/js/load-cookie-info.js',
    HTMLToCache + '/public/train/js/dist/utils_header.min.js',
    HTMLToCache + '/public/train/js/dist/utils_footer.min.js',

    HTMLToCache + '/public/train/css/europodroze/dist/subpages.min.css',
    HTMLToCache + '/public/train/css/europodroze/dist/bundle.css',

    HTMLToCache + '/public/train/img/trains/firstpage/logo_pl.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/logo_en.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/logo_ru.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/logo_ua.svg',
    HTMLToCache + '/public/train/img/icon/payment_logo.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/logo_blik.png',
    HTMLToCache + '/public/train/img/trains/firstpage/secured_by_rapidssl.gif',
    HTMLToCache + '/public/train/img/icon/icons.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/ep_logo_footer_pl.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/ep_logo_footer_en.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/ep_logo_footer_ru.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/ep_logo_footer_ua.svg',
    HTMLToCache + '/public/train/img/flag/pl.png',
    HTMLToCache + '/public/train/img/flag/en.png',
    HTMLToCache + '/public/train/img/flag/ru.png',
    HTMLToCache + '/public/train/img/flag/ua.png',
    HTMLToCache + '/public/train/img/traveltech.png',
    HTMLToCache + '/public/train/img/trains/firstpage/qsf.png',
    HTMLToCache + '/public/favicon/favicon-144x144.png',
    HTMLToCache + '/public/favicon/favicon.ico',
    HTMLToCache + '/public/train/img/loader.gif',
    HTMLToCache + '/public/train/img/icon/eye_open.svg',
    HTMLToCache + '/public/train/img/icon/eye_closed.svg',
    HTMLToCache + '/public/train/img/trains/firstpage/sprite_gwarancja_opinia.png',
    HTMLToCache + '/public/train/img/icon/icons.svg',
    HTMLToCache + '/public/train/img/icon/payment_logo.svg',
];
const cacheExclude = [
    '/wyniki',
    '/wyniki/**/*',
    '/formularz-osobowy',
    '/formularz-osobowy/**/*',
    '/results',
    '/results/**/*',
    '/personal-form',
    '/personal-form/**/*',
];

function hasUrlCacheExcludeMatch(url) {
    // .endsWith() does not work in IE.
    return cacheExclude.some((path) => url.endsWith(path) || url.toString().includes(path));
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            MY_FILES.push(
                HTMLToCache + '/public/train/js/jquery.min.js?' + staticVersion,
                HTMLToCache + '/public/train/js/additional.js?' + staticVersion,
                HTMLToCache + '/public/train/js/dist/bundle.js?' + staticVersion,
                HTMLToCache + '/public/train/js/dist/bundle_extended.js?' + staticVersion,
                HTMLToCache + '/public/train/js/dist/subpages.min.js?' + staticVersion,
                HTMLToCache + '/public/train/css/europodroze/dist/bundle.css?' + staticVersion,
                HTMLToCache + '/public/train/css/europodroze/dist/subpages.min.css?' + staticVersion,
                HTMLToCache + '/public/train/css/tt1/style-fluid.min.css?' + staticVersion,
                HTMLToCache + '/public/train/css/tt1/style-fluid.css?' + staticVersion,
                HTMLToCache + '/public/train/js/dist/behav.min.js?' + staticVersion,
                HTMLToCache + '/public/train/css/europodroze/dist/components/login_form.min.css?' + staticVersion,
            );
            await MY_FILES.forEach((item) => {
                cache.add(item).catch(() => console.error(`Can't load ${item} to cache`));
            });
            // await cache.addAll(MY_FILES);
        })(),
    );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName !== CACHE_NAME;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                }),
            );
        }),
    );
    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});
// 'Network falling back to cache' strategy
self.addEventListener('fetch', function (event) {
    event.respondWith(
        (async () => {
            try {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) {
                    return preloadResponse;
                }

                try {
                    return await fetch(event.request);
                } catch (error) {
                    console.log(error);
                }

                return await caches.match(event.request) || await caches.match(OFFLINE_URL);
            } catch (error) {
                console.log('Fetch failed; returning offline page instead.', error);

                const cache = await caches.open(CACHE_NAME);
                return cache.match(OFFLINE_URL);
            }
        })(),
    );
});
