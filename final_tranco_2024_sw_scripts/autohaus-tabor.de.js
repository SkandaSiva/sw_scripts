// Tabor Service Worker
var serviceWorker = false;
var cacheName = 'tabor';

self.addEventListener('install', function(event) {
  try {
    event.waitUntil(
      caches.open(cacheName).then(function (cache) {
        return cache.addAll(
          [
            '/offline.html',
          ]
        );
      })
    );
  } catch (e) {

  }
});

self.addEventListener('activate', function(event) {
  try {
    event.waitUntil(
      caches.keys().then(function (cacheNames) {
        return Promise.all(
          cacheNames.filter(function (cacheName) {
          }).map(function (cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  } catch (e) {

  }
});

self.addEventListener('fetch', function(event) {
  try {
    if (
      /\.html/.test(event.request.url) ||
      /\/$/.test(event.request.url)
    ) {
      event.respondWith(
        caches.match(event.request).then(function (response) {
          return fetch(event.request) || response;
        }).catch(function () {
          return caches.match('/offline.html');
        })
      );
    }
  } catch (e) {

  }
});