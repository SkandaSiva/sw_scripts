self.addEventListener('install', function(event) {
	console.log('PWA: Installation succeeded');
});

self.addEventListener('fetch', function(event) {
	// console.log('Fetch: ', event);
});
