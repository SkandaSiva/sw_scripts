    
self.addEventListener('fetch', function(event) {
    if (event.request.mode === "navigate" && event.request.method === "GET" && !/\.pdf/i.test(event.request.url)) {
        event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
            })
        );
    }
});