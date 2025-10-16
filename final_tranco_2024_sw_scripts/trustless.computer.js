self.addEventListener("install", event => {
  console.log("Service worker installed");
  // event.waitUntil(
  //   (async () => {
  //     const cache = await caches.open(CACHE_NAME);
  //     // Setting {cache: 'reload'} in the new request ensures that the
  //     // response isn't fulfilled from the HTTP cache; i.e., it will be
  //     // from the network.
  //     await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
  //   })()
  // );

  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("Service worker activated");

});

self.addEventListener('fetch', event => {
  // Check if the request is for an image
  if (event.request.url.match(/\.(png|jpg|jpeg|gif|bmp|webp|svg|ico|css)$/i)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {

        const networkFetch = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            // Update the cache with a clone of the network response
            const responseClone = response.clone();
            caches.open('pwa-image-cache').then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        }).catch(function (reason) {
          console.error('ServiceWorker fetch failed: ', reason);
        });

        // Prioritize cached response over network
        return cachedResponse || networkFetch;
      })
    );
  }
  // For non-image requests skip caching.
});
