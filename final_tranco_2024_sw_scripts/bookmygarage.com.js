var CACHE_NAME = 'bmg-cache-v2';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll([
          '/offline.htm',
          '/static/images/bmg-logo.png',
          '/static/images/bmg-logo_140.png',
          '/static/images/bmg-logo_120.png'
        ]);
      })
  );
});

self.addEventListener('fetch', function(event) {
  if(
    event.request.url.indexOf('/api/') !== -1
    || event.request.url.indexOf('/bmg-api/') !== -1
    || event.request.url.indexOf('localhost:4000') !== -1
  ){
    return false;
  }

  event.respondWith(async function() {
    try{
      return await fetch(event.request);
    }catch(err){
      const cachedResponse = await caches.match(event.request);
      if(cachedResponse) return cachedResponse;

      return caches.match('/offline.htm');
    }
  }());
});
