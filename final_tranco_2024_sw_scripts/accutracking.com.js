self.addEventListener('install', function(event) {
  var offlinePage = new Request('/pwa_offline.php');
  event.waitUntil(
    fetch(offlinePage).then(function(response) {
      return caches.open('accutracking-offline').then(function(cache) {
        console.log('Cached offline page during install');
        return cache.put(offlinePage, response);
      });
    }));
});

self.addEventListener('fetch', function(event) {
  if(event.request.url.includes('/pwa.php')) {
    event.respondWith(
      fetch(event.request).catch(function(error) {
        console.log('Serving offline page for ' + event.request.url);
        return caches.open('accutracking-offline').then(function(cache) {
          return cache.match('/pwa_offline.php');
        });
      }
    ));
  }
});
