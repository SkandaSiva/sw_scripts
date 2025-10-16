/*
Copyright 2015, 2019 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
*/

// Zwiększanie wersji wymusi aktualizację cache przy instalacji.
const OFFLINE_VERSION = 2;
const CACHE_NAME = 'offline-cache';
const OFFLINE_URL = '/_website/offline.php';
const BACKGROUND_IMAGE_URL = '/images/page_images/foto_main/9/marketing-internetowy.jpg';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Dodawanie zasobów do cache z wymuszeniem pobrania z sieci
    await cache.addAll([
      new Request(OFFLINE_URL, { cache: 'reload' }),
      BACKGROUND_IMAGE_URL
    ]);
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
    // Usunięcie starych wersji cache
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name !== CACHE_NAME)
        .map(name => caches.delete(name))
    );
  })());
  // Upewnienie się, że service worker przejmuje kontrolę nad stroną
  self.clients.claim();
});

self.onnotificationclick = function(event) {
  const url = event.notification.tag;
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
};

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigateRequest(event));
  } else if (event.request.destination === 'image' || event.request.destination === 'style') {
    event.respondWith(handleStaticAssets(event));
  }
});

async function handleNavigateRequest(event) {
  try {
    const preloadResponse = await event.preloadResponse;
    if (preloadResponse) return preloadResponse;

    const networkResponse = await fetch(event.request);
    return networkResponse;
  } catch (error) {
    console.log('Navigation fetch failed; returning offline page.', error);
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(OFFLINE_URL);
  }
}

async function handleStaticAssets(event) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(event.request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(event.request);
    cache.put(event.request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Static asset fetch failed; returning cached version if available.', error);
    return cachedResponse;
  }
}
