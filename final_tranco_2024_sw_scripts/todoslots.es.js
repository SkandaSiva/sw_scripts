self.addEventListener('fetch', function(event) {
  	//event.respondWith(caches.match(event.request));
});
self.importScripts('https://cdn.jsdelivr.net/pouchdb/5.3.1/pouchdb.min.js');