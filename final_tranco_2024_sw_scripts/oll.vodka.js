const CACHE_NAME = 'my-app-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => {
        console.error('Failed to cache resources during install:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Отдельно обрабатываем навигационные запросы
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Если ответ успешный, кладем его в кэш и возвращаем
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
                .catch((error) => {
                  console.error('Failed to update cache with new resource:', error);
                });
            });
            return response;
          }
          // Если ответ не успешный, возвращаем ресурс из кэша
          return caches.match(request).catch(() => fetch(request));
        })
        .catch(() => {
          // В случае ошибки сети или 500 Internal Server Error, возвращаем ресурс из кэша
          return caches.match(request);
        })
    );
    return;
  }

  // Для всех остальных запросов используем стратегию cache-first
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then((networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache)
                .catch((error) => {
                  console.error('Failed to update cache with new resource:', error);
                });
            });
            return networkResponse;
          })
          .catch(() => {
            // В случае ошибки сети или 500 Internal Server Error, возвращаем ресурс из кэша
            return caches.match(request);
          });
      })
      .catch(() => {
        // В случае ошибки сети или 500 Internal Server Error, возвращаем ресурс из кэша
        return caches.match(request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      ))
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
