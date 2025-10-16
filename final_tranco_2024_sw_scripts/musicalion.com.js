self.addEventListener('install', (e) => {
	console.log('Service worker musicalion installed.');
  e.waitUntil(
    caches.open('musicalion-store').then((cache) => cache.addAll([
				/*
				'/images/temp/',
				'/images/temp/fox1.jpg'
				*/
    ]))
  );
});
//--
self.addEventListener('fetch', (e) => {
	//-- this service is worked --
  // console.log('Musicalion fetch: ' + e.request.url);
	/*
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
	*/
});