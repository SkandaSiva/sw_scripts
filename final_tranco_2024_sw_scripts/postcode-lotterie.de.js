/**
 * Debug level
 * @param {DEBUG_LEVEL} const - The level of debug information to log (1 - info, 2 - warning, 3 - critical)
 */

const DEBUG_LEVEL = 0;
const ONE_DAY = 24 * 60 * 60;
const ONE_MONTH = 24 * 60 * 60 * 31;
const ONE_YEAR = 365 * ONE_DAY;

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

registerRoute(
  /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
  staleWhileRevalidateStrategy({
    cacheName: 'dpl-static-assets',
    maxAgeSeconds: ONE_DAY,
  }),
  'GET',
);

registerRoute(
  /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
  cacheFirst({
    cacheName: 'dpl-fonts',
    maxAgeSeconds: ONE_YEAR,
    maxEntries: 5,
    purgeOnQuotaError: true, // Automatically cleanup if quota is exceeded.
  }),
  'GET',
);

registerRoute(
  /\.(?:css)$/i,
  staleWhileRevalidateStrategy({
    cacheName: 'dpl-styles-cache',
    maxAgeSeconds: ONE_MONTH,
  }),
  'GET',
);

registerRoute(
  ({ request }) => request.url.includes('website-header-'),
  staleWhileRevalidateStrategy({
    cacheName: 'dpl-campaign-assets',
    maxAgeSeconds: ONE_DAY,
  }),
  'GET',
);

// Core functions
function registerRoute(matchRegexOrFn, callback, method) {
  self.addEventListener('fetch', event => {
    if (matchRegexOrFn instanceof RegExp) {
      if (matchRegexOrFn.test(event.request.url) && event.request.method === method) callback(event);
    } else if (!!matchRegexOrFn && matchRegexOrFn instanceof Function && event.request.method === method) {
      if (matchRegexOrFn(event)) callback(event);
    }
  });
}

// Caching strategies
function cacheFirst({ cacheName }) {
  return event => {
    event.respondWith(
      caches.open(cacheName).then(cache => {
        // Go to the cache first
        return cache.match(event.request.url).then(cachedResponse => {
          // Return a cached response if we have one
          if (cachedResponse) {
            return cachedResponse;
          }

          // Otherwise, hit the network
          return fetch(event.request).then(fetchedResponse => {
            // Add the network response to the cache for later visits
            cache.put(event.request, fetchedResponse.clone());

            // Return the network response
            return fetchedResponse;
          });
        });
      }),
    );
  };
}

function networkFirst({ cacheName }) {
  return event => {
    event.respondWith(
      caches.open(cacheName).then(cache => {
        // Go to the network first
        return fetch(event.request.url).then(fetchedResponse => {
          cache.put(event.request, fetchedResponse.clone());

          return fetchedResponse;
        }).catch(() => {
          // If the network is unavailable, get
          return cache.match(event.request.url);
        });
      }),
    );
  };
}

// const checkCache = (cacheName) => {
//   caches.open(cacheName).then(cache => {
//     cache.keys().then(keys => {
//       const currentTime = Date.now();
//       for (const key of keys) {
//         cache.match(key).then(response => {
//           if (response) {
//             const headers = response.headers;
//             const timestamp = parseInt(headers.get('timestamp'));
//             if (isNaN(timestamp) || timestamp < currentTime) {
//               cache.delete(key);
//               log('Element ist abgelaufen und aus Cache entfernt:', key.url);
//             }
//           }
//         })
//       }
//     });
//   });

//   log('checkCache: ', cacheName);
// };

const updateTimestamp = ({ url, cacheName, maxAgeSeconds }) => {
  const timestamp = Date.now() + maxAgeSeconds * 1000;

  caches.open(cacheName).then(cache => {
    cache.match(url).then(response => {
      if (response) {
        const headers = new Headers(response.headers);
        headers.set('timestamp', timestamp.toString());
        const newResponse = new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers,
        });
        cache.put(url, newResponse);
      }
    });
  });
};

/**
 * TODO integrate cache invalidation based on maxEntries and maxAgeSeconds using IndexDB
 */
function staleWhileRevalidateStrategy(options) {
  const cacheName = options.cacheName;
  const maxAgeSeconds = options.maxAgeSeconds || 0;

  log('staleWhileRevalidateStrategy', options);

  return (event) => {
    event.respondWith(
      caches.open(cacheName).then(async cache => {
        const cachedResponse = await cache.match(event.request);
        const networkFetch = fetch(event.request)
          .then(response => {
            const responseClone = response.clone();
            cache.put(event.request, responseClone);
            return response;
          })
          .catch(reason => {
            log('ServiceWorker fetch failed: ', reason);
          });
        log({ cachedResponse, networkFetch });
        return cachedResponse || networkFetch;
      }),
    );
  };
}

// Helper functions
function log(...args) {
  DEBUG_LEVEL && console.log(...args);
}
