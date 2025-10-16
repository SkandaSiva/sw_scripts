/* eslint-disable */

const cacheName = 'v1';

const OFFLINE_URL = 'themes/itf/service-worker/offline.html';

const CACHE_VERSION = 1;

let CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};

const startPage = '/';
const startPageEn = '/en';
const filesToCache = [startPage, startPageEn];

function createCacheBustedRequest(url) {
  let request = new Request(url, {cache: 'reload'});
  if ('cache' in request) {
    return request;
  }

  // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
  let bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
  return new Request(bustedUrl);
}

self.addEventListener('install', (e) => {
  console.log('SW: Installed', e)

  e.waitUntil(
    caches.open(cacheName)
    .then(function(cache) {
			console.log('PWA service worker caching dependencies');
			filesToCache.map(function(url) {
				return cache.add(url).catch(function (reason) {
					return console.log('PWA: ' + String(reason) + ' ' + url);
				});
			});
		}),
    fetch(createCacheBustedRequest(OFFLINE_URL)).then(function(response) {
      return caches.open(CURRENT_CACHES.offline).then(function(cache) {
        return cache.put(OFFLINE_URL, response);
      });
    })
  );
});

self.addEventListener('activate', (e) => {
  console.log('SW: Activated', e)

  let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', e => {
  console.log('SW: Fetch', e)

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // make clone of response
        const resClone = res.clone();
        // open cache
        caches
          .open(cacheName)
          .then(cache => {
            // add response to cache
            if (e.request.method !== 'POST' && e.request.url.indexOf('chrome-extension') === -1) {
            	cache.put(e.request, resClone);
            }
          });

        return res
      })
      .catch(err => {
        return caches.match(e.request)
          .then(res => {
             if (res !== undefined) {
               return res;
             } else {
                return caches.match(OFFLINE_URL);
             }
          })
      })
  )
})