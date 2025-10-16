//
// https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#on-install-not
//
self.addEventListener('install', function (event) {
	//
	// https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
	//
});

//
// Activate
// This fires once the old service worker is gone, and your new service worker is able to control clients.
// This is the ideal time to do stuff that you couldn't do while the old worker was still in use, such as migrating databases and clearing caches.
//
// https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#on-activate
//
self.addEventListener('activate', function (event) {
	// Active worker won't be treated as activated until promise
	// resolves successfully.
	//
	// https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil
	//
});

self.addEventListener('fetch', function (event) {
	// Let the browser do its default thing
	// for non-GET requests.
	if (event.request.method != 'GET') return;

	var url = event.request.url;

	// never use cached version for AMP CORS requests
	if (url.indexOf("__amp_source_origin") != -1) return;

	// cache.put(): The promise will reject with a TypeError if the URL scheme is not http or https.
	if (url.indexOf('://') != -1 && !['http', 'https'].includes(url.substr(0, url.indexOf('://')))) {
		return;
	}
});