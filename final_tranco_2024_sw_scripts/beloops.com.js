// sw.js

const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  '/',  
  '/app.js',
  // Add paths to other assets you want to cache
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event){
   event.respondWith(async function() {
      try{
        var res = await fetch(event.request);
        var cache = await caches.open('cache');
        cache.put(event.request.url, res.clone());
        return res;
      }
      catch(error){
        return caches.match(event.request);
       }
     }());
 });