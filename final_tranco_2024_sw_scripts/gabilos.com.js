self.addEventListener('install', function(event) {
  console.log('install');
  self.skipWaiting();
});


self.addEventListener('activate', function(event) {
  console.log('activate');
  return self.clients.claim();
});


self.addEventListener('fetch', function(event) {
  if (event.request.url.endsWith('.js')) {
    event.respondWith(fetch(event.request, {cache: "no-store"}));
  } else if (event.request.url.endsWith('.html')) {
    event.respondWith(fetch(event.request, {cache: "no-store"}));
  } else if (event.request.url.endsWith('.css')) {
    event.respondWith(fetch(event.request, {cache: "no-store"}));
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('message', function(event) {
  if (event.data === 'skipWaiting') {	  
	console.log('message skipWaiting recibed');
    self.skipWaiting();
  }
});
