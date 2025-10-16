/*
	https://codelabs.developers.google.com/codelabs/your-first-pwapp/#4
	https://www.codementor.io/@malimirkeccita/how-i-built-my-first-progressive-web-app-pwa-sb-10w3un6bpo?utm_swu=3470
*/

const CACHE_NAME = 'ws-cache-v1.0';
const FILES_TO_CACHE = [
'/offline.html'
];

self.addEventListener('install', (event) => { 
event.waitUntil(
	caches.open(CACHE_NAME).then((cache) => {
	/*console.log('[ServiceWorker] Pre-caching offline page');*/
	return cache.addAll(FILES_TO_CACHE);
	})
);
});

self.addEventListener('activate', (event) => { 
event.waitUntil(
	caches.keys().then(keyList => Promise.all(keyList.map((key) => {
	if (key !== CACHE_NAME) {
		/*console.log('[ServiceWorker] Removing old cache', key);*/
		return caches.delete(key);
	}
	})))
);
});

self.addEventListener('fetch', (event) => { 
if (event.request.mode === 'navigate') {
	event.respondWith(
	fetch(event.request)
		.catch(() => caches.open(CACHE_NAME)
		.then(cache => cache.match('offline.html')))
	);
}
});