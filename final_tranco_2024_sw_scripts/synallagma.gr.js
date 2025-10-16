const cacheName = 'synallagma-0.1';

/*
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/metatropeas-nomismaton'
      ]).then(() => self.skipWaiting());
    })
  );
});
*/

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
	      if( !response ) { return fetch(event.request); }
	      const date = new Date(response.headers.get('date'));
	      // if cached file is older than 1 hour
	      if( Date.now() > date.getTime() + 1000*60*60 ) {
		      return fetch(event.request); }
        return response || fetch(event.request);
    })
  );
});
