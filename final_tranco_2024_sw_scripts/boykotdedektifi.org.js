const version = 'v1'; // Versiyon numarası

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js')
            .then(function(registration) {
                console.log('Service Worker kaydedildi:', registration.scope);
            })
            .catch(function(error) {
                console.log('Service Worker kaydedilemedi:', error);
            });
    });
}
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            } else {
                return fetch(event.request);
            }
        })
    );
});

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('file-cache-' + version).then(function(cache) {
            return cache.addAll([
                '/assets/libs/bootstrap/css/bootstrap.css',
                '/assets/libs/bootstrap/css/bootstrap.min.css',
                '/assets/libs/bootstrap/js/bootstrap.min.js',
                '/assets/libs/jquery/jquery-3.6.3.min.js',
                '/assets/libs/bootstrap/js/bootstrap.bundle.js',
                '/assets/libs/swiper/swiper-bundle.min.css',
                '/assets/libs/swiper/swiper-bundle.min.js'
            ]);
        })
    );
});
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName.startsWith('file-cache-') && cacheName !== 'file-cache-' + version) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            if (!navigator.onLine) {
                console.log('Çevrimdışı mod: İnternet bağlantısı yok!');
            }
            return fetch(event.request).then(function(response) {
                return caches.open('file-cache-' + version).then(function(cache) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});