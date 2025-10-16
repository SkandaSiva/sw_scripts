self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('fox-store').then((cache) => cache.addAll([
            '/frontend/css/bootstrap.min.css',
            '/frontend/css/flexslider.css',
            '/frontend/css/runninghorse.jpg',
            '/frontend/css/bootstrap-select.min.css',
            '/frontend/images/submenu.png',
            '/frontend/js/bootstrap.min.js',
            '/frontend/js/bootstrap-select.min.js',
            '/frontend/js/jquery.flexslider.js',
        ])),
    );
});

self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});