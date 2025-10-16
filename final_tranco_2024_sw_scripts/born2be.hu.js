var cacheVersion = 12;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
var offlineUrl = '/offline/index.html?v='+cacheVersion;

"function"===typeof importScripts&&importScripts('https://proxy.synerise.com/rtom/configs/tbpzGuiGenw7/sw.js');

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
