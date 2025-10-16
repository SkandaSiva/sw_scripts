importScripts('/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/workbox-v5.1.4/workbox-sw.js');

workbox.setConfig({
  modulePathPrefix: '/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/workbox-v5.1.4/'
});

/**
 * The precacheAndRoute method of the precaching module takes a manifest of
 * URLs to cache on service worker installation. precacheAndRoute intelligently
 * updates the cache and sets up a fetch handler to respond cache-first for
 * requests to URLs in the manifest.
 */
workbox.precaching.precacheAndRoute([{"revision":"8e58648e196adfc115c0e9ec75a1d5f4","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-128x128.png"},{"revision":"7c7eca6d32f0679797eda51e68acc05d","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-144x144.png"},{"revision":"71ed613f1e5a59071a2888dc0ac55041","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-152x152.png"},{"revision":"d559ea8ac241fb8e83ef4292746078e9","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-16x16.png"},{"revision":"01571bd07514beea2d616f96c614998c","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-192x192.png"},{"revision":"7a5d2101cf69696611fd526b0fddfe51","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-32x32.png"},{"revision":"462509456ca952955852eceb23092860","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-384x384.png"},{"revision":"5681304ab5ec1ffda22cdff9837c4525","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-48x48.png"},{"revision":"20e32eb3455cec9939c23a2334fe1f26","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-512x512.png"},{"revision":"1589dc440a103d765c044acdb86f0fae","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-72x72.png"},{"revision":"d03894d1bd2c288fbe19e9acb3dd9fad","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/icon-96x96.png"},{"revision":"a48fa5ebc73a155c9d49abb7ebddf370","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/favicon.ico"},{"revision":"d655b10d6d28efe0dc84293b06db5de6","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/favicon.png"},{"revision":"f37132c2f21202703e8aa930b6daa522","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-com/img/apple-touch-icon.png"}]);

/**
 * Cleaning up old precached data. The changes made to precaching in Workbox v4
 * mean that older precaches, created by previous versions of Workbox, are not compatible.
 * By default, they're left as-is, and if you upgrade from Workbox v3 to Workbox v4,
 * you'll end up with two copies of all your precached resources.
 */
workbox.precaching.cleanupOutdatedCaches();

/**
 * For the Add to Home Screen prompt to activate, the URL referenced on
 * start_url must always be available, even when the user is offline. Since
 * index.html is the start_url, that must be precached to ensure that it is
 * added to the cache when the service worker is installed.
 */
addEventListener('install', event => {
  const urls = [
    '/de/index.html',
    '/en/index.html',
    '/fr/index.html',
    '/it/index.html',
    '/es/index.html',
    '/ja/index.html'
  ];
  const cacheName = workbox.core.cacheNames.runtime;
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(urls)));
});

/**
 * Force the service worker to activate right away.
 */
addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    skipWaiting();
  }
});

/**
 * Filter for valid resources
 */
const bmwcomRegExp = '/(bmwcom|marketBMWCOM|marketBMW_M)/.+';

/**
 * CACHEFIRST: The important thing to note with this caching strategy is that once a
 * response is cached, it will not be updated.
 */
// Fonts
workbox.routing.registerRoute(new RegExp(bmwcomRegExp + "\.(?:woff|woff2)$"),
  new workbox.strategies.CacheFirst({
    cacheName: 'fonts-cache'
  })
);
// Images
workbox.routing.registerRoute(new RegExp(bmwcomRegExp + '\.(?:png|ico|gif|jpg|jpeg|webp|svg)$'),
  new workbox.strategies.CacheFirst({
    cacheName: 'images-cache'
  })
);

/**
 * STALEWHILEREVALIDATE: This strategy requests the resource from the cache and network in parallel,
 * and then responds with the cached version. When the network request
 * completes, the cache is updated with the newest version of the resource, so
 * that it can be served on the next request.
 */
workbox.routing.registerRoute(new RegExp(bmwcomRegExp + '\.(?:js|css)$'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);

/* Airship SW */
var swURI = 'https://' + this.location.hostname + '/uas_sw.js';
importScripts(swURI);

