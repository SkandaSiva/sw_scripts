// service-worker.js

importScripts("https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js");

if (workbox) {
  workbox.setConfig({
    debug: false,
  });

  // Function to determine whether the response should be cached
  const cacheIfSuccessful = async ({ response }) => {
    if (response && response.status === 200) {
      return response;
    }
    return null;
  };

  workbox.routing.registerRoute(
    ({ request }) => request.destination === "image",
    new workbox.strategies.CacheFirst({
      cacheName: "image-cache",
      plugins: [
        {
          cacheWillUpdate: cacheIfSuccessful,
        },
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith("/charting_library/"),
    new workbox.strategies.CacheFirst({
      cacheName: "charting-library-cache",
      plugins: [
        {
          cacheWillUpdate: cacheIfSuccessful,
        },
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.endsWith(".wasm"),
    new workbox.strategies.CacheFirst({
      cacheName: "wasm-cache",
      plugins: [
        {
          cacheWillUpdate: cacheIfSuccessful,
        },
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );
}
