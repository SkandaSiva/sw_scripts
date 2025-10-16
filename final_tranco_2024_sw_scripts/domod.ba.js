importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.routing.registerRoute(
    new RegExp('https://domod.ba/assets/fonts/(.*)'),
    workbox.strategies.cacheFirst({
      cacheName: 'local-fonts',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 30,
        }),
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
      ],
    }),
  );

workbox.precaching.precacheAndRoute([
  {
    "url": "/assets/css/app.min.css",
    "revision": "d3072ab3693c185313018e404e07d914"
  },
  {
    "url": "/assets/js/app.min.js",
    "revision": "6b73f45a2506a26e00e425688eaa6514"
  }
]);
