	const CACHE_NAME = 'offline';
	const urlsToCache = ["https://ozhenbeauty.com/wp-content/themes/negarshop/statics/css/bootstrap.min.css","https://ozhenbeauty.com/wp-content/themes/negarshop/statics/css/owl.carousel.min.css","https://ozhenbeauty.com/wp-content/themes/negarshop/statics/css/core.css","https://ozhenbeauty.com/wp-content/themes/negarshop/statics/js/bootstrap.min.js","https://ozhenbeauty.com/wp-content/themes/negarshop/statics/js/script.js"];

	self.addEventListener('install', function(event) {
	event.waitUntil((async () => {
	const cache = await caches.open(CACHE_NAME);
	// Setting {cache: 'reload'} in the new request will ensure that the response
	// isn't fulfilled from the HTTP cache; i.e., it will be from the network.
	cache.addAll(urlsToCache);
	})());

	self.skipWaiting();
	});

	self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
	// Enable navigation preload if it's supported.
	// See https://developers.google.com/web/updates/2017/02/navigation-preload
	if ('navigationPreload' in self.registration) {
	await self.registration.navigationPreload.enable();
	}
	})());

	// Tell the active service worker to take control of the page immediately.
	self.clients.claim();
	});

	self.addEventListener('fetch', function(event) {
	// console.log('[Service Worker] Fetch', event.request.url);
	if (event.request.mode === 'navigate') {
	event.respondWith((async () => {
	try {
	const preloadResponse = await event.preloadResponse;
	if (preloadResponse) {
	return preloadResponse;
	}

	const networkResponse = await fetch(event.request);
	return networkResponse;
	} catch (error) {
	console.log('[Service Worker] Fetch failed; returning offline page instead.', error);
	}
	})());
	}
	});
	