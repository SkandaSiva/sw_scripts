const version = '1.0126';
const kCacheName = 'ketabnak-static-v'+version;

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(kCacheName).then(function (cache) {
            return cache.addAll([
                '/templates/default/assets/font/IRANSansX/IRANSansXV.woff2',
                '/templates/default/assets/css/main.min.css?ver='+version,
                '/templates/default/vendors/swiper/swiper-bundle.min.css?7',
                '/templates/default/vendors/swiper/swiper-bundle.min.js?7',
                '/templates/default/vendors/modernizr/modernizr-custom.js',
                '/templates/default/assets/js/xhook.js',
                '/templates/default/vendors/jquery/dist/jquery.min.js',
                '/templates/default/vendors/pace/pace.min.js?1',
                '/templates/default/vendors/ResponsiveDom/js/jquery.responsive-dom.min.js',
                '/templates/default/assets/js/jquery.easing.min.js',
                '/templates/default/assets/js/main.min.js?ver='+version,
                '/templates/default/assets/symbol/sprite.svg?'+version,
                '/templates/default/assets/symbol/ketabnak.svg',
                '/templates/default/assets/symbol/telegram.svg',
                '/templates/default/assets/symbol/instagram.svg',
                '/templates/default/assets/symbol/twitter.svg',
                '/templates/default/assets/symbol/rss.svg'
            ]);
        }).then(() => self.skipWaiting())
    );
});


self.addEventListener('fetch', (event) => {
    var offlineExclude = [
        'add_book.php',
        'redirect.php',
        '/download/',
        '/admin/',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://www.google.',
        'https://logo.samandehi.ir'
    ];
    for (let i = 0; i < offlineExclude.length; i++) {
        if (event.request.url.indexOf(offlineExclude[i]) !== -1) {
            return;
        }
    }

    // Ignore everything but Ketabnak.com
    /*const url = new URL(event.request.url);
    if (url.origin !== location.origin) {
        return;
    }*/

    // Ignore post
    if (event.request.method !== 'GET') {
        return;
    }

    // Prevent the default, and handle the request ourselves
    event.respondWith(async function() {
        // Try to get the response from a cache
        const cachedResponse = await caches.match(event.request);
        // Return it if we found one
        if (cachedResponse) return cachedResponse;
        // If we didn't find a match in the cache, use network
        return fetch(event.request);
    }());

    /*e.respondWith((async () => {
        const r = await caches.match(e.request);
        if (r) { return r; }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        cache.put(e.request, response.clone());
        return response;
    })());*/
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function (cacheName) {
                        //If not current cache, return true to delete
                        if(cacheName != kCacheName)
                            return true;
                        else
                            return false;
                    })
                    .map(function (cacheName) {
                        return caches.delete(cacheName);
                    }),
            );
        }),
    );
});