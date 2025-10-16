/*jshint esversion: 6 */
/*jshint strict:false */
/*global self:true */
/*global caches:true */
/*global alert:true */
/*global Response:true */
/*global Request:true */

(function () {
  'use strict';

  // print to logs for better debugging
  const ENABLE_LOGGING = false;

  // use version to force an update
  const version = 'v1';
  const LEGACY_URL_REGEX = /cdn.filestackcontent.com\/.*/i;
  const LEGACY_CACHE_NAME = 'filestack-media';
  const LEGACY_CACHE_LIMIT = 200;

  const CDN_URL_REGEX = /\/_cdn/i;
  const CDN_CACHE_NAME = version + '::nyla::cdn';
  const CDN_CACHE_LIMIT = 200;

  // limit the number of items in a specified cache.
  function trimCache(cacheName, maxItems) {
    caches.open(cacheName).then(cache => {
      cache.keys().then(keys => {
        if (keys.length > maxItems) {
          cache.delete(keys[0]).then(trimCache(cacheName, maxItems));
        }
      });
    });
  }

  // remove caches whose name is no longer valid
  function clearOldCaches() {
    return caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(
            key => key.indexOf(version) !== 0 && key !== LEGACY_CACHE_NAME
          )
          .map(key => caches.delete(key))
      );
    });
  }

  self.addEventListener('install', event => {
    self.skipWaiting();
  });

  self.addEventListener('activate', event => {
    // delete caches that aren't used anymore
    event.waitUntil(clearOldCaches().then(() => self.clients.claim()));
  });

  self.addEventListener('message', event => {
    // trim caches to prevent them going beyond maximum items
    if (event.data.command === 'NYLA_SW_TRIM_CACHES') {
      trimCache(CDN_CACHE_NAME, CDN_CACHE_LIMIT);
      trimCache(LEGACY_CACHE_NAME, LEGACY_CACHE_LIMIT);
    }
  });

  self.addEventListener('fetch', event => {
    const url = event.request.url;

    // ignore any non-GET requests
    if (event.request.method !== 'GET') {
      return;
    }

    // for /_cdn requests, try the cache first and fall back to the network
    if (CDN_URL_REGEX.test(url) || LEGACY_URL_REGEX.test(url)) {
      event.respondWith(
        (async function () {
          // Create promises for both the network response,
          // and a copy of the response that can be used in the cache.
          const fetchResponse = fetch(event.request);
          const fetchResponseClone = fetchResponse.then(r => r.clone());
          const cachedResponse = await caches.match(event.request);

          // event.waitUntil() ensures that the service worker is kept alive
          // long enough to complete the cache update.
          event.waitUntil(
            (async function () {
              if (!cachedResponse) {
                const cacheName = LEGACY_URL_REGEX.test(url)
                  ? LEGACY_CACHE_NAME
                  : CDN_CACHE_NAME;
                const cache = await caches.open(cacheName);
                const responseToCache = await fetchResponseClone;
                if (responseToCache.ok && responseToCache.status !== 206) {
                  await cache.put(event.request, responseToCache);
                }
              }
            })()
          );

          if (ENABLE_LOGGING) {
            if (cachedResponse) {
              console.log('[SERVICE WORKER] CACHE HIT', url);
            } else {
              console.log('[SERVICE WORKER] CACHE MISS', url);
            }
          }

          // prefer CACHE-FIRST
          if (cachedResponse) {
            return cachedResponse;
          }

          // fallback to the NETWORK
          return fetchResponse;
        })()
      );
    }
  });
})();
