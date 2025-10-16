self.addEventListener('install', (e) => {
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        fetch(event.request)
    );
});
