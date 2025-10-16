//This is the "Offline page" service worker

//Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open('pwabuilder-offline')
		.then((cache) => cache.add('offline.html'))
	);
});

//If any fetch fails, it will show the offline page.
//Maybe this should be limited to HTML documents?
self.addEventListener('fetch', event => {
	if (event.request.mode === 'navigate') {
		event.respondWith((async () => {
		  try {
			const preloadResp = await event.preloadResponse;
	
			if (preloadResp) {
			  return preloadResp;
			}
	
			const networkResp = await fetch(event.request);
			return networkResp;
		  } catch (error) {
	
			const cache = await caches.open('pwabuilder-offline');
			const cachedResp = await cache.match('offline.html');
			return cachedResp;
		  }
		})());
	}
});

//This is a event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', event => {
	return caches.open('pwabuilder-offline')
	.then((cache) => {
		console.log('[PWA Builder] Offline page updated from refreshOffline event: ' + event.url);
		return cache.put('offline.html', event);
	});
});

self.addEventListener('message', event => {  
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});