/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
console.log("service worker is registed on Embibe.");

if ("function" === typeof importScripts) {
  console.log("CT worker script loaded on Embibe.");
  importScripts('https://s3-eu-west-1.amazonaws.com/static.wizrocket.com/js/sw_webpush.js');
}

const CACHE_NAME = 'cache-v1-2024-11-08-11:30:15';
const PRECACHE = [];

const API_CACHE_FIRST_LIST = ["/content_ms_fiber/v1/embibe/en/fiber-countries-goals-exams-v2"]
const FILE_EXTENTIONS_TO_CACHE = ["js", "css", "svg", "png", "jpg", "webp", "woff", "woff2", "ttf", "otf"]
const CDN_ORIGIN = "https://assets.embibe.com"
const CACHE_URLS = [CDN_ORIGIN]

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker ...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('[Service Worker] Precaching');
      return cache.addAll(PRECACHE);
    })
      .then(self.skipWaiting())
      .catch(error => {
        console.error('Failed to open cache:', error);
      })
  );
});

//for static assets (same origin || CDN origin)
function shouldCache(requestUrl) {
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isCDNOrigin = requestUrl.origin === CDN_ORIGIN
  if (isSameOrigin || isCDNOrigin) {
    const extension = requestUrl.pathname.split('.').pop();
    return FILE_EXTENTIONS_TO_CACHE.includes(extension)
  }
  return false;
}

//for API
function shouldCacheAPI(requestUrl) {
  return API_CACHE_FIRST_LIST.includes(requestUrl.pathname)
}

//for static assets (different origin)
function shouldCacheUrl(requestUrl) {
  return CACHE_URLS.some(cacheUrl => requestUrl?.href?.includes(cacheUrl));
}

function shouldUpdateInBackground(requestUrl) {
  return shouldCacheAPI(requestUrl)
}

//fetch from the network and cache the response
function fetchAndCache(request) {
  return fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.ok) {
      const clonedResponse = networkResponse.clone();
      caches.open(CACHE_NAME).then(cache => {
        return cache.put(request, clonedResponse); // Return this promise
      }).catch(cacheError => {
        console.error('Failed to cache response:', cacheError); // Handle any errors with caching
      });
    }
    return networkResponse;
  }).catch(error => {
    console.error('Fetch failed; returning cached version.', error);
    return caches.match(request);
  });
}


self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Cache First Strategy for static assets and APIs
  if (shouldCache(requestUrl) || shouldCacheAPI(requestUrl) || shouldCacheUrl(requestUrl)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          // Return cached response and update the cache in the background
          if (shouldUpdateInBackground(requestUrl)) {
            event.waitUntil(fetchAndCache(event.request));
          }
          return cachedResponse;
        } else {
          return fetchAndCache(event.request);
        }
      })
    );
  }
  // Bypass the service worker and allow the request to go directly to the network
  return;
  // Network First Strategy for other requests
  // return event.respondWith(
  //   fetch(event.request).catch(() => caches.match(event.request))
  // );

});

self.addEventListener('activate', event => {

  console.log('[Service Worker] Activating Service Worker ....');

  event.waitUntil(
    caches.keys().then(cacheKeys => {
      return Promise.all(
        cacheKeys.map(cachekey => {
          if (![CACHE_NAME].includes(cachekey)) {
            console.log('[Service Worker] Removing old cache.', cachekey);
            return caches.delete(cachekey); // Delete outdated caches
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting(); // Force the new service worker to activate
  }
});


