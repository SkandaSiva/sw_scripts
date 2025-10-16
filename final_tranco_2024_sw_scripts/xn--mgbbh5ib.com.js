const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v2';
const assets = [
    './',
    './sw.js',
    './index.php',
    './app.js',
    './assets/script.js',
    './assets/style.css',
    './assets/img/logo.png',
    './assets/img/background-img.png',
    './assets/img/favicon.png',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11.0.19/dist/sweetalert2.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/sweetalert2@11',
    './fallback.php'
];

// cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        });
    });
};

// install event
self.addEventListener('install', evt => {
    //console.log('service worker installed');
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});

// activate event
self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    // Jika permintaan adalah dari tipe 'navigate' (halaman)
    if (evt.request.mode === 'navigate') {
        evt.respondWith(
            fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                });
            }).catch(() => {
                // Jika gagal mengambil dari jaringan, coba ambil dari cache
                return caches.match(evt.request);
            })
        );
    } else {
        // Jika permintaan bukan halaman, gunakan strategi cache first
        evt.respondWith(
            caches.match(evt.request).then(cacheRes => {
                return cacheRes || fetch(evt.request).then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(evt.request.url, fetchRes.clone());
                        // Batasi ukuran cache
                        limitCacheSize(dynamicCacheName, 15);
                        return fetchRes;
                    });
                });
            }).catch(() => {
                if (evt.request.url.indexOf('.php') > -1) {
                    return caches.match('/fallback.php');
                }
            })
        );
    }
});