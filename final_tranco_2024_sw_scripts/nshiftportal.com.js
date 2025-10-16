'use strict';
const SW_VERSION = '0.23.2.0'; // Change this whenever changing something in the file;

self.addEventListener('install', function (evt) {
  console.debug('[EmptyServiceWorker] Install');
});

self.addEventListener('activate', function (evt) {
  console.debug('[EmptyServiceWorker] Activate');

  evt.waitUntil(Promise.all(
    [
      // Remove previous cached data from disk
      caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          console.debug('[EmptyServiceWorker] Removing old cache: ' + key);
          return caches.delete(key);
        }));
      }),
      clients.claim()
    ]
  ));
});
