var CACHE_VER = '1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_VER)
      .then(function(cache) {
        return cache.addAll([
          '/eroff.html',
          '/ernet.html'
        ]);
      })
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_VER];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function (event) {
  if(self.navigator.onLine === false && event.request.mode === 'navigate'){
    event.respondWith(async function() {
      return fetch(event.request).catch(() => caches.match('/eroff.html'));
    }());
  }else if(event.request.url.split('/?')[0] === self.location.origin){
    event.respondWith(async function() {
      event.waitUntil(caches.open(CACHE_VER).then(function(cache) {
          cache.match('/ernet.html').then(function (isCached) {
            if(!isCached){
              cache.add('/ernet.html');
            }
          });
        })
      );
      return fetch(event.request).catch(() => caches.match('/ernet.html'));
    }());
  }
});