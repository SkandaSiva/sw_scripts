self.importScripts('/js/workbox-v5.1.2/workbox-sw.js');

workbox.routing.registerRoute(
  new RegExp('^https://.*.muted.io'),

  new workbox.strategies.CacheFirst({
    cacheName: 'mutedio',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 30
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
);

workbox.routing.setDefaultHandler(new workbox.strategies.NetworkFirst());
