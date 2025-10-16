'use strict';

    self.addEventListener('push', (event) => {
      if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
      }

      if (event.data) {
        const {data} = event;
        let jsonData = {};

        try {
          jsonData = data.json();
        } catch (e) {
          return;
        }

        if (jsonData !== {}) {
          event.waitUntil(self.registration.showNotification(jsonData.title, {
            body: jsonData.options ? jsonData.options.body : 'event.data empty'
          }));
        }
      } else {
        console.log('This push event has no data');
      }
    });

const VERSION = '20211026';
const CACHE_NAME = 'static-cache-v34';
const FILES_TO_CACHE = [
  '/offline.html'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

addEventListener('fetch', (event) => {
  event.respondWith(async function () {
    try {
      const response = await fetch(event.request);

      return response || fetch(event.request);
    } catch (e) {
      return caches.match('/offline.html');
    }
  }());
});
