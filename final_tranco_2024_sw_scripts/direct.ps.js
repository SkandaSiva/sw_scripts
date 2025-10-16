self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('dlcms-store').then((cache) => cache.addAll([
            '/upload/12-2019/system/5df3af470f968.jpg',
        ])),
    );

});

self.addEventListener('fetch',(e) => {
     console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});