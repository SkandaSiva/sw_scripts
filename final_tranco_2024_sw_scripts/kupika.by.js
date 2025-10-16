self.addEventListener('install', function (event) {
	self.skipWaiting();
});

// Allow sw to control of current page
self.addEventListener('activate', function (event) {
	event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function (event) {
	return;
});
