const staticFallBackCache = 'fallback-static.v2.3';
caches.delete('fallback-static');
caches.delete('fallback-static.v2');
caches.delete('fallback-static.v2.1');
caches.delete('fallback-static.v2.2');
//install service worker
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticFallBackCache).then(cache => {
            cache.addAll([
                '/maintenance',
                '/img/maintenance_work.jpg',
                '/wp-content/uploads/2020/08/maintenance_page-02-min-scaled.jpg',
                '/favicon.ico'
            ]);
        })
    );
});

self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);
            return Promise.all(keys
                .filter(key => key !== staticFallBackCache)
                .map(key => caches.delete(key))
            );
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        }).catch(() => caches.match('/maintenance'))
    );
});