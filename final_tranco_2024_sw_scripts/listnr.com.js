/* eslint-disable */
self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    clients.claim(),
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          caches.keys().then(function (names) {
            for (let name of names) {
              caches.delete(name);
            }
          });
        })
      );
    })
  );
});
