'use strict';

// Update cache names any time any of the cached files change.
const CACHE_NAME = 'sm-static-cache-v1';

let hostName = self.location.hostname;
let offlineUrl = 'domains/'+hostName+'/error/offline.html';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  offlineUrl,
  '/assets/sportisimo/images/logo.svg',
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  // Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  // console.log('[ServiceWorker] Fetch', evt.request.url);
  if (evt.request.mode !== 'navigate') {
    return;
  }
  evt.respondWith(
    fetch(evt.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match(offlineUrl);
          });
      })
  );
});

importScripts('https://api.exponea.com/js/service-worker.min.js');
