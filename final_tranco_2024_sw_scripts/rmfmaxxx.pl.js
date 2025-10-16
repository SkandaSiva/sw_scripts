importScripts('https://www.rmfmaxxx.pl/work/push/client/js/sw-rmf-push.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.googleAnalytics.initialize();

workbox.routing.registerRoute(
    /\.css$/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'css-cache',
    })
);
  
workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|svg)$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
        new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 10 * 24 * 60 * 60, // 10 Days
        }),
        ],
    })
);

workbox.routing.registerRoute(
    // Cache image files.
    /\.(?:webp)$/,
    // Use the cache if it's available.
    new workbox.strategies.CacheFirst({
      // Use a custom cache name.
      cacheName: 'webp-cache',
      plugins: [
        new workbox.expiration.Plugin({
          // Cache only 20 images.
          maxEntries: 100,
          // Cache for a maximum of a week.
          maxAgeSeconds: 1 * 24 * 60 * 60,
        })
      ],
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
    })
);

workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
        new workbox.cacheableResponse.Plugin({
            statuses: [0, 200],
        }),
        new workbox.expiration.Plugin({
            maxAgeSeconds: 60 * 60 * 24 * 365,
            maxEntries: 30,
        }),
        ],
    })
);

workbox.routing.registerRoute(
    /.*(?:i.iplsc)\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: 'i.iplsc',
    })
);

workbox.routing.registerRoute(
    /.*(?:v.iplsc)\.com/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'v.iplsc',
    })
);

workbox.routing.registerRoute(
    /.*(?:i.static)\.rmf\.pl/,
    new workbox.strategies.NetworkFirst({
        cacheName: 'i.static',
    })
);

