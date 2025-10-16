const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
    OFFLINE_URL,
    'icon-192x192.png',
    'offline-mode/offline-wifi.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    console.log('Service Worker installed.');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated.');
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // اگر در کش موجود بود، از کش استفاده کن
            if (response) {
                return response;
            }
            // اگر در کش نبود، درخواست شبکه را ادامه بده
            return fetch(event.request).catch(() => {
                // در صورت آفلاین بودن و درخواست برای صفحه اصلی، صفحه آفلاین را برگردان
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});
