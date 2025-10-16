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
workbox.precaching.precacheAndRoute([{"revision":"3eef804ff3225eca978d24aa9d60405b","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-128x128.png"},{"revision":"dd0bae793ecd1f291757f649638582af","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-144x144.png"},{"revision":"8c4bcee01fd209918092db46bc53490b","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-152x152.png"},{"revision":"a998529d3c624e54717c2db8c4e18ce3","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-16x16.png"},{"revision":"204306dae7150ef4529b1699ff3bb38a","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-192x192.png"},{"revision":"0d7e447088fc7f0e5491fa776be65caf","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-32x32.png"},{"revision":"efa7530475ee21952a4dbd96cec7d39c","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-384x384.png"},{"revision":"ea354ede41c95828cfdee5e590befa37","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-48x48.png"},{"revision":"b53f64916a1a86b65821fdfa1a3eba2b","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-512x512.png"},{"revision":"23e98e67d19a09131ad399aed87d9a53","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-72x72.png"},{"revision":"41a71d9e982c332bb4a3330445506198","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/icon-96x96.png"},{"revision":"82f1aa1e2efefc79a5cc4fb6abb719b3","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/favicon.ico"},{"revision":"41a71d9e982c332bb4a3330445506198","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/favicon.png"},{"revision":"ba3a2fd992c91df153b0a40e83cdc64e","url":"/etc.clientlibs/settings/wcm/designs/bmwcom/base/resources/ci2020/context-bmw-m/img/apple-touch-icon.png"}]);

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
