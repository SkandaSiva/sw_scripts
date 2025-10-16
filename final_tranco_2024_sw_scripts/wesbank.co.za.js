importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.0/workbox-sw.js');

const precacheManifest = [
  {
    "url": "assets/html/balloon-payments.html",
    "revision": "b883379afb69f8f4317e842f814a0e46"
  },
  {
    "url": "google72ce8288e7aec37a.html",
    "revision": "1b77471cf73ffd6dd0e216392b4ef522"
  },
  {
    "url": "index.html",
    "revision": "e16665c665064a82835bba1676a4fb2b"
  },
  {
    "url": "styles.9957627b2eb65f126948.css",
    "revision": "89b8431ae14dd88d9f2dbbae24e53a82"
  }
];

workbox.precaching.precacheAndRoute(precacheManifest);

workbox.googleAnalytics.initialize();

workbox.routing.registerRoute(
  /.*.(?:png|jpg|jpeg|svg)$/,
  new workbox.strategies.CacheFirst({
    cacheName: 'site-images',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
    ],
  }),
  'GET'
);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
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

const dataStoreCondig = {
  cacheName: 'engine-data',
};

workbox.routing.registerRoute(/.*.(?:js|html|json)$/, new workbox.strategies.StaleWhileRevalidate(dataStoreCondig), 'GET');
