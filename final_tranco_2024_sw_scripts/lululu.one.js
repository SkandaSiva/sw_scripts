self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('cache').then(function(cache) {
      return cache.addAll(
        [
        	'/',
        ]
      );
    })
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(
		fetch(event.request).then(response => {
			  return caches.open("cache").then(cache => {
				  if(response.ok){
					  console.log("caching : "+response.url);
					  cache.put(response.url,response.clone());
				  }
			      return response;
			  });
		}).catch(function() {
		      return caches.match(event.request);
		})
    );
});