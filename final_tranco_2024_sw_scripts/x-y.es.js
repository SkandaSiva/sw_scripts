var CACHE = 'xy-v6';

var filesToCache = [
  '/app' ,'/app?utm_source=homescreen' ,'/off'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', event => {
	if (event.request.headers.has('range')) { return; }
	if (event.request.method !== 'GET') { return; }
	if(event.request.url.startsWith("https://x-y.")){
    event.respondWith(async function () {
			try {
				const response = await fetch(event.request);
				if (response.status === 404 || response.status === 500) {
					const cachedResponse = await caches.match(event.request);
					if (cachedResponse) {
						return cachedResponse;
					} else {
						const offResponse = await caches.match('/off');
						return offResponse;
					}
				}
				const cachedResponse = await caches.match(event.request);
				if (!cachedResponse) {
					const responseClone = response.clone();
					const cache = await caches.open(CACHE);
					cache.put(event.request, responseClone);
				}
				return response;
			} catch (err) {
				const cachedResponse = await caches.match(event.request);
				if (cachedResponse) {
					return cachedResponse;
				} else {
					const offResponse = await caches.match('/off');
					return offResponse;
				}
      }
    }());
	} else {
		event.respondWith(fetch(event.request));
	}
		
});