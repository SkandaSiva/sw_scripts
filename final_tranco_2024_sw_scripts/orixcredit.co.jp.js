importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js');

workbox.setConfig({ debug: false });
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  /img_visual.*\.(?:png|jpg|jpeg|svg|gif|webp)/,
  workbox.strategies.cacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // 100件 1週間
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 7
      })
    ],
  })
);

workbox.precaching.addRoute({
  directoryIndex: 'index.html',
  ignoreUrlParametersMatching: [/./]
});

workbox.precaching.precacheAndRoute([
  {
    "url": "assets/css/credit-orix_2020.css",
    "revision": "24b5c426f8152b4208108cc8ef7e87af"
  },
  {
    "url": "assets/libs/libs_2020.js",
    "revision": "b7bab1daa2c2e9bb47e0e80e626d5e2f"
  },
  {
    "url": "assets/img/renew/bg_logo_sp.png",
    "revision": "565c3aca9d9a7d820f5562e516167795"
  },
  {
    "url": "assets/css/credit-orix_2020_home_pc.css",
    "revision": "82dc6c9e0e30f1263797fbf068757d92"
  },
  {
    "url": "assets/css/credit-orix_2020_home_tb.css",
    "revision": "b901c6053ff631eabc117b55e388b7c1"
  },
  {
    "url": "assets/css/credit-orix_2020_home_sp.css",
    "revision": "728ea2907af8d44ce0883fdf3a5b8b9a"
  }
]);