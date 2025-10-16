self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("my-cache").then((cache) => {
            return cache.addAll([
                "/image/app/logo/icon-152x152.png",
                "/image/ar.icons.svg",
                // другие статические ресурсы
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
