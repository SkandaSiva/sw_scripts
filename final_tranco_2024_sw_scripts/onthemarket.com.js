importScripts('static/js/lib/serviceworkerCachePolyfill.js');

var staticCacheName = 'otm-cache-v0.1.2853';
var offlinePage = '/offline/';
var killServiceWorkers = false;

var homeUrlsToCache = [
	'/',
	offlinePage
];


self.addEventListener('install', function(event) {
	if (killServiceWorkers) {
		self.skipWaiting();
		return;
	}

	event.waitUntil(
		caches.open(staticCacheName).then(function(cache) {
				homeUrlsToCache.map(function(urlToPrefetch) {
					const request = new Request(urlToPrefetch, {
						mode: 'cors'
					})
					fetch(request).then(function(response) {
						if (response && response.status === 200) {
							return cache.put(request, response);
						}
					})
				})
			})
		)
	});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					var cacheToDelete = killServiceWorkers ? cacheName.startsWith('otm-cache-') : cacheName.startsWith('otm-cache-') && cacheName !== staticCacheName;
					return cacheToDelete;
				}).map(function(cacheName) {
					return caches.delete(cacheName);
				})
			)
		})
	)
});

self.addEventListener('message', function(event) {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});

function timeout(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(new Response('', {
        status: 504,
        statusText: 'Gateway Timeout'
      }));
    }, delay);
  });
}

self.addEventListener('fetch', function (event) {
  if (/https:\/\/.*onthemarket\.com.*/.test(event.request.url) ||
      /https:\/\/.*wearethemarket\.co\.uk.*/.test(event.request.url)) {
    event.respondWith(fetch(event.request));
  } else {
    event.respondWith(Promise.race([timeout(10000), fetch(event.request)]));
  }
});
