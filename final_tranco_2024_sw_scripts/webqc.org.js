const resources = [
	'/images/logo.png',
]

self.addEventListener('install', function(event) {  
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(resources);
		})
	);
});

self.addEventListener('activate', function(event) {
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

