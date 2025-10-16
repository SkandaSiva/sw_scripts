importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');


self.__WB_MANIFEST = [
    // ... your precache entries
  ];
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Add additional caching strategies as needed
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new workbox.strategies.CacheFirst()
);