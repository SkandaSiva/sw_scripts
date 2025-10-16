/* eslint-disable */
/* tslint:disable */

/**
 * Service Worker
 */

const CACHE_NAME = 'kurlymall-2.7.2';

const FILES_TO_CACHE = ['/favicon.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (CACHE_NAME !== key) return caches.delete(key);
        }),
      ),
    ),
  );
});
