const CACHE_NAME = 'offline-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/css/style.css',
  '/js/offlinelistening/service-worker-registration.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    }).catch(error => {
      console.error('Failed to cache resources during installation:', error);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request, { credentials: 'include' }).then(networkResponse => {
            if (!networkResponse.ok) {
              throw new Error('Network response was not ok');
            }
            return networkResponse.blob().then(blob => {
              if (blob.size === 0) {
                throw new Error('Downloaded blob is empty');
              }
              const responseToCache = new Response(blob, {
                status: networkResponse.status,
                statusText: networkResponse.statusText,
                headers: { 'Content-Type': 'audio/mpeg' }
              });
              cache.put(event.request, responseToCache);
              return responseToCache;
            });
          }).catch(() => {
            return new Response('', { status: 404, statusText: 'Not Found' });
          });
        });
      })
    );
  } else if (requestUrl.pathname === '/downloads') {
    event.respondWith(
      caches.match('/downloads').then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch('/downloads').then(networkResponse => {
          if (!networkResponse.ok) {
            return new Response('', { status: 404, statusText: 'Not Found' });
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put('/downloads', responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          return new Response('', { status: 404, statusText: 'Not Found' });
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(networkResponse => {
          if (!networkResponse.ok) {
            return new Response('', { status: 404, statusText: 'Not Found' });
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          return new Response('', { status: 404, statusText: 'Not Found' });
        });
      })
    );
  }
});

self.addEventListener('message', event => {
  if (event.data.action === 'cacheDownloadsPage') {
    caches.open(CACHE_NAME).then(cache => {
      return fetch('/downloads').then(response => {
        if (response.ok) {
          return cache.put('/downloads', response).then(() => {
            console.log('/downloads page cached successfully.');
          });
        } else {
          console.error('Failed to fetch /downloads page:', response.statusText);
        }
      }).catch(error => {
        console.error('Failed to fetch /downloads page:', error);
      });
    });
  }
});
