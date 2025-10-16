const timestamp = 1729775280;
const CACHE = `network-or-cache-${timestamp}`;

const cashes_urls = ['/get-translation/auth/vue/ru/', '/get-translation/auth/vue/ua/', '/get-translation/auth/vue/en/', '/get-translation/auth/vue/de/', '/get-translation/auth/vue/fr/', '/get-translation/auth/vue/it/', '/get-translation/auth/vue/cs/', '/get-translation/auth/vue/pl/', '/get-translation/auth/vue/hu/', '/get-translation/auth/vue/nl/'];
const lastSyncTimeHeaderName = 'Last-Sync-Time';

self.addEventListener('install', (event) => {
    self.skipWaiting();
    // event.waitUntil(
    //     caches.open(CACHE).then((cache) => {
    //         cache.addAll(cashes_urls);
    //     }));
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
  var expectedCacheNamesSet = new Set(Object.values(cashes_urls));
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!expectedCacheNamesSet.has(cacheName)) {
            // If this cache name isn't present in the set of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method !== 'GET') return;

  let url = new URL(event.request.url);
  let urlPath = url.pathname;

  if (cashes_urls.indexOf(urlPath) === -1) {
      return;
  }

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function() {
    // Try to get the response from a cache.

    const cache = await caches.open(CACHE);
    const cachedResponse = await cache.match(event.request);

    if (!cachedResponse) {
        event.waitUntil(cache.add(event.request));
    }

    if (cachedResponse) {
      updateDelta(event.request, cachedResponse.clone());
      // If we found a match in the cache, return it, but also
      // update the entry in the cache in the background.
      return cachedResponse;
    }

    // If we didn't find a match in the cache, use the network.
    return fetch(event.request);
  }());
});

async function updateDelta(request, cashedResponseClone) {

    const updatedTime = new Date().getTime().toString();
    console.log('updatedTime', updatedTime);

    const cache = await caches.open(CACHE);

    const lastSyncTime = cashedResponseClone.headers.get(lastSyncTimeHeaderName);

    const cachedData = await cashedResponseClone.json();

    let newRequestHeaders = {};
    request.headers.forEach((value, key) => newRequestHeaders[key] = value);
    if (lastSyncTime) {
        newRequestHeaders[lastSyncTimeHeaderName] = lastSyncTime;
    }

    const newRequest = new Request(request, { headers: newRequestHeaders});

    const response = await fetch(newRequest);
    if (response.status !== 200) {
        return;
    }

    let delta;
    try {
        delta = await response.json();
        if (typeof delta !== 'object') {
            return;
        }
        if (Object.keys(delta).length ===0) {
            return;
        }
    } catch (error) {
        console.log('Error during parsing response: ', error.message);
        return;
    }

    const updatedData = Object.assign({}, cachedData, delta);

    let newResponseHeaders = {};
    response.headers.forEach((value, key) => newResponseHeaders[key] = value);
    newResponseHeaders[lastSyncTimeHeaderName] = updatedTime;

    const blob = new Blob([JSON.stringify(updatedData)], {type: 'application/json'});
    const newResponse = new Response(blob, {
        headers: newResponseHeaders,
        status: response.status,
        statusText: response.statusText
    });

    const allProperties = ["type", "url", "ok", "redirected", "bodyUsed"];
    allProperties.forEach(property => {
        if (response[property] !== undefined) {
            Object.defineProperty(newResponse, property, {value: response[property]});
        }
    });

    cache.put(request, newResponse);
}