var cacheName = 'pogoda-sw';

self.addEventListener('install', function(ev) {
  ev.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([]);
    })
  );
});

self.addEventListener('fetch', function(ev) {
  if (ev.request.method == 'GET' && !/^https:\/\/node\.pogoda\.co\.il\/socket\.io\//.test(ev.request.url)) {
    ev.respondWith(
      fetch(ev.request).then(function (res) {
        caches.open(cacheName).then(function(cache) {
          return cache.addAll([res.url]);
        });
        return res;
      }).catch(function() {
        return caches.match(ev.request);
      })
    );
  }
});

self.addEventListener('activate', function(ev) {
  ev.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        return caches.delete(key);
      }));
    })
  );
});