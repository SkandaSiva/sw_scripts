'use strict';
const TGAbxApp = "static-cache-v1";
const assets = [
	//paths to files to add
	'/start_pwa',
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(TGAbxApp).then(cache => {
      cache.addAll(assets)
    })
  )
})

//self.addEventListener('fetch', function(event) {
//  event.respondWith(
//    caches.match(event.request)
//      .then(function(response) {
//        // Cache hit - return response
//        if (response) {
//          return response;
//        }
//        return fetch(event.request);
//      }
//    )
//  );
//});

self.addEventListener('fetch', (e) => {
	//console.log(`[Service Worker] Fetched resource ${e.request.url}`);
});