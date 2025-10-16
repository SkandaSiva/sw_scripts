var CACHE_NAME = 'v2';
urlsToCache = [];

self.addEventListener('install', function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) {
    // return cache.addAll(urlsToCache);
  }));
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(caches.keys().then(function(keyList) {
    return Promise.all(keyList.map(function(key) {
      if (cacheWhitelist.indexOf(key) === -1) {
        return caches.delete(key);
      }
    }));
  }));
});

self.addEventListener('fetch', function(e) {});