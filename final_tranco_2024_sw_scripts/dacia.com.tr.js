
  'use strict';

  let CURRENT_CACHES = {
    offline: 'offline-v2',
  };
  const OFFLINE_URL = '/dacia/offline.html';

  function createCacheBustedRequest(url) {
    let request = new Request(url, { cache: 'reload' });
    if ('cache' in request) return request;
    let bustedUrl = new URL(url, self.location.href);
    const bustedUrlSearch = bustedUrl.search ? (bustedUrl.search + '&') : '?';
    bustedUrl.search = bustedUrlSearch + 'cachebust=' + Date.now();
    return new Request(bustedUrl);
  }

  self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
      fetch(createCacheBustedRequest(OFFLINE_URL)).then(function(response) {
        return caches.open(CURRENT_CACHES.offline).then(function(cache) {
          return cache.put(OFFLINE_URL, response);
        });
      }),
    );
  });

  self.addEventListener('activate', event => {
    let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
      return CURRENT_CACHES[key];
    });

    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (expectedCacheNames.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          }),
        );
      }),
    );
  });

  self.addEventListener('fetch', event => {
    if (
      event.request.mode === 'navigate' ||
      (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))
    ) {
      event.respondWith(fetch(event.request).catch(error => caches.match(OFFLINE_URL)));
    }
  });
  