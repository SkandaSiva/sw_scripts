/* eslint-disable no-console */
const cacheVersion = 'app4';

const cacheAssets = () => {
  return caches
    .open(cacheVersion)
    .then((cache) => cache.addAll([]))
    .catch((error) => console.warn(error));
};

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting().then(() => cacheAssets()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== cacheVersion) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => cacheAssets())
  );
});

self.addEventListener('fetch', (event) => {
  if (
    event.request.cache === 'only-if-cached' &&
    event.request.mode !== 'same-origin'
  ) {
    return;
  }

  if (!new RegExp('^' + self.registration.scope + '').test(event.request.url)) {
    return;
  }

  if (
    event.request.method === 'GET' &&
    /\.(ico|png|svg|webp|jpg|avif)$/.test(event.request.url)
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                '[' +
                  event.request.url +
                  ']: bad response status [' +
                  response.status +
                  ']'
              );
            }

            return response;
          })
          .then((response) => {
            return caches
              .open(cacheVersion)
              .then((cache) => {
                const responseClone = response.clone();
                return cache.put(event.request, responseClone);
              })
              .then(() => response);
          })
          .catch((error) => console.warn(error, event.request.url));
      })
    );
  } /* else {
        return fetch(event.request);
    }*/
});
