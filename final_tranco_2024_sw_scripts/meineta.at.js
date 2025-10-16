

var CACHE_NAME = 'at.meineta.web-v1';

var filesToCache = [
	'./public/offline.html'
];

self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('activate', function(e) {
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== CACHE_NAME) {
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function(e) {

	if (e.request.method === 'POST' && e.request.url.endsWith('/installation.xhtml')) {
        // A download could last longer than e.g. Firefox' 'dom.serviceworker.idle_timeout', so skip...
        return;
	}
	
	//console.log('[ServiceWorker] Fetching ', e.request.method, ' ', e.request.url, ', mode=', e.request.mode);
	
	// Wrapping the fetch() call in e.respondWith() prevents the browsers default fetch
	// handling and tells the browser we want to handle the response ourselves. If we do
	// not call e.respondWith() inside a fetch handler, we get the default network behavior.
	e.respondWith(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.match(e.request)
				.then(function (response) {
					if (response) {
						return response;
					}
					else {
						return fetch(e.request).catch(() => {

							// The device is offline. The user should be redirected to the cached offline site.
							// Depending on the type of request (HTML navigation or AJAX call) different actions
							// could be done:
							
							// Request.mode can have one of the following values set:
							//
							//   'same-origin' - If a request is made to another origin with this mode set, the result is simply an error. You could use this to ensure that a request is always being made to your origin.
							//   'no-cors' - Prevents the method from being anything other than HEAD, GET or POST, and the headers from being anything other than simple headers. If any ServiceWorkers intercept these requests, they may not add or override any headers except for those that are simple headers. In addition, JavaScript may not access any properties of the resulting Response. This ensures that ServiceWorkers do not affect the semantics of the Web and prevents security and privacy issues arising from leaking data across domains.
							//   'cors' - Allows cross-origin requests, for example to access various APIs offered by 3rd party vendors. These are expected to adhere to the CORS protocol. Only a limited set of headers are exposed in the Response, but the body is readable.
							//   'navigate' - The navigate value is intended to be used only by HTML navigation. A navigate request is created only while navigating between documents.
							//
							if (e.request.mode === 'navigate') {
								return cache.match('./public/offline.html');
							}
						});
					}
				});
			})
	);
});

self.addEventListener('message', function (event) {
	
	if (event.data.action == 'skipWaiting') {
		self.skipWaiting()
	}
});