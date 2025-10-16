const CACHE_NAME = 'TD_5.1.2-1-g1231cef2.3.1.1';
const DOMAIN = 'https://www.toutdonner.com';

const urlsToNotCache = [
  '#',
  '/ping',
  '/dashboard',
];

self.addEventListener('install', (event) => {
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', event => {
  // event.respondWith(handleRequest(event));
});

const handleRequest = async (event) => {
  const request = event.request;

  // Skip non-GET requests and requests to other domains
  if (
    request.method !== 'GET' ||
    !request.url.startsWith(DOMAIN) ||
    urlsToNotCache.filter((part) => request.url.includes(part)).length > 0 ||
    await isAuthenticated()
  ) {
    return fetch(request);
  }

  return fetch(request)
    .then(networkResponse => {
      const responseToCache = networkResponse.clone();

      caches.open(CACHE_NAME)
        .then(cache => cache.put(request, responseToCache));
      return networkResponse;
    })
    .catch(() => {
      return caches.match(request)
        .then(cacheResponse => cacheResponse || caches.match('/offline.html'));
    });
};

const isAuthenticated = async () => {
  try {
    const response = await fetch(`${DOMAIN}/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.status === 204;
  } catch (e) {
    return false;
  }
};
