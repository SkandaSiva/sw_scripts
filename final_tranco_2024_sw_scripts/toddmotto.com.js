                        importScripts("/assets/js/workbox-v3.6.3/workbox-sw.js");
            workbox.setConfig({modulePathPrefix: "/assets/js/workbox-v3.6.3"});

            self.__precacheManifest = [{"url":"/index.html","revision":"ff1f3126ba4bb642e81e2e8ec3300043"}];
            // service-worker.js
workbox.core.setCacheNameDetails({
  prefix: 'ultimatecourses',
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime-cache',
});

workbox.skipWaiting();
workbox.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(
  /\.(html|css)$/,
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  /assets\/(img|icons)/,
  workbox.strategies.cacheFirst()
);

