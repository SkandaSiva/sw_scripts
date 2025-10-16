self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('lib').then(function (cache) {
            return cache.addAll([
                '/app.aspx?mode=pwa&utm_source=pwa',
                '/app.js',
                '/wcl/js/jquery-3.6.0.min.js',
                '/app/istruzioni-android.png',
                '/app/istruzioni-iphone.png',
                '/app/logo.jpg'
            ]);
        })
    );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) { 
                return response;
            } 
            return fetch(event.request);
        })
    );
});
