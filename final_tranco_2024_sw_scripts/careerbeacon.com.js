var currentCache = {
  offline: 'offline-cache'
};
var filesToCache = [];

self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(currentCache.offline).then((cache) => cache.addAll([]))
	);
});

self.addEventListener('fetch', (e) => {
	e.respondWith(
		caches.match(e.request).then((response) => response || fetch(e.request)),
	);
});