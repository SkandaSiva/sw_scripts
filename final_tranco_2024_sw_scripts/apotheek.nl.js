const CACHE_NAME = '2.1.0';

const RUNTIME = `${CACHE_NAME}_runtime`;
const PRECACHE = `${CACHE_NAME}_precache`;
const PRECACHE_URLS = ['/'];

const sameOrigin = true;
const exceptions = ['/cms', '/api', '/webservice', '/sw', '/xml', 'hmr'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  self.clients.claim();
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => {
        console.log(`${RUNTIME} now ready to handle fetches!`);
      })
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url.split('?')[0].split('#')[0];
  const isException =
    exceptions.filter(exception => url.indexOf(exception) !== -1).length &&
    url.indexOf('/cms/sites/default/files/') === -1;
  const isRightOrigin = sameOrigin ? url.startsWith(self.location.origin) : true;
  if (!isException && isRightOrigin && event.request.method === 'GET') {
    event.respondWith(
      caches.open(RUNTIME).then(cache => {
        return fetch(event.request)
          .then(response => {
            return cache.put(url, response.clone()).then(() => {
              return response;
            });
          })
          .catch(() => {
            return caches.match(url).then(response =>
              response
                ? response
                : caches.open(RUNTIME).then(cache => {
                    return cache.match('/');
                  })
            );
          });
      })
    );
    return;
  }
  // console.log(url, self.location.origin, event.request.method);
});
