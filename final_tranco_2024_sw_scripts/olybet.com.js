var INVALIDATION_INTERVAL = 10 * 60 * 1000; // 10 min
var NS = 'LDIMAGE';
var SEPARATOR = '|';
var VERSION = Math.ceil(now() / INVALIDATION_INTERVAL);

function now() {
  var d = new Date();
  return d.getTime();
}

function buildKey(url) {
  return NS + SEPARATOR + url + SEPARATOR + VERSION;
}

function parseKey(key) {
  var parts = key.split(SEPARATOR);
  return {
    ns: parts[0],
    key: parts[1],
    ver: parseInt(parts[2], 10),
  };
}

function purgeExpiredRecords(caches) {
  console.log('Purging...');
  return caches.keys().then(function (keys) {
    return Promise.all(
      keys.map(function (key) {
        var record = parseKey(key);
        if (record.ns === NS && record.ver !== VERSION) {
          console.log('deleting', key);
          return caches.delete(key);
        }
      })
    );
  });
}

function proxyRequest(caches, request) {
  var key = buildKey(request.url);
  return caches.open(key).then(function (cache) {
    return cache.match(request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request.clone())
        .then(function (networkResponse) {
          if (
            networkResponse.type !== 'opaque' &&
            networkResponse.ok === false
          ) {
            throw new Error('Resource not available');
          }
          cache.put(request, networkResponse.clone());
          return networkResponse;
        })
        .catch(function () {
          console.error('Failed to fetch', request.url);
          // Placeholder image for the fallback
          return fetch('./img/live-dealer/olybet-placeholder.png', { mode: 'no-cors' });
        });
    });
  });
}

let hostHref = null;
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'URL_CHANGED') {
    hostHref = event.data.payload;
  }
});

self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(purgeExpiredRecords(caches));
});

self.addEventListener('fetch', function (event) {
  var request = event.request;

  const hostUrl = hostHref ? new URL(hostHref) : null;
  if (!hostUrl) return;
  if (!hostUrl.pathname.startsWith('/live-dealer')) return;

  if (
    request.method !== 'GET' ||
    !request.url.match(/\.(jpe?g|png|gif|svg)$/)
  ) {
    return;
  }

  event.respondWith(proxyRequest(caches, request));
});
