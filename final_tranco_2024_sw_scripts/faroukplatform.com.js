self.addEventListener('install', (e) => {
    
    e.waitUntil(
        caches.open('منصتي').then((cache) => cache.addAll([
            '../Assets/css/themes/layout/header/base/light.css',
            '../Assets/css/themes/layout/aside/light.css'
        ]))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});