const staticCacheName = 'nzik-s6'; //v.01
const dynamicCacheName = 'nzik-d6';
const assets = [
  '/',
  '/js/js.min.js',
  '/css/style.min.css',
  '/offline',
  '/images/logos.png',
  'https://cdn.plyr.io/3.5.6/plyr.js',
  'https://cdn.plyr.io/3.5.6/plyr.css',
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event 
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          // check cached items size
          limitCacheSize(dynamicCacheName, 15);
          return fetchRes;
        })
      });
    }).catch(() => {
      if(evt.request.url.indexOf('musique/') > -1 || evt.request.url.indexOf('album/') > -1 || evt.request.url.indexOf('/videos') > -1 
              || evt.request.url.indexOf('/video-clip') > -1 || evt.request.url.indexOf('recherche/') > -1){
        return caches.match('/offline');
      } 
    })
  );
});