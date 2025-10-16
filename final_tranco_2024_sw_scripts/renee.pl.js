var cacheVersion = 9;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
var offlineUrl = '/aza_store_renee_2020/offline/index.html?v='+cacheVersion;

importScripts('https://proxy.synerise.com/rtom/configs/SOOF6CpzUv9A/sw.js');

addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
        return cache.add(offlineUrl);
      }).then(function() {
        return skipWaiting();
      })
    );
});

addEventListener('fetch', function(event) {
  if (event.request.url.toLowerCase().endsWith('.pdf') || event.request.mode !== 'navigate' || navigator.onLine) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(error => {
      return caches.match(offlineUrl);
    })
  );
});

addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (currentCache.offline != key) {
          return caches.delete(key);
        }
      })
    ))
  );
});
