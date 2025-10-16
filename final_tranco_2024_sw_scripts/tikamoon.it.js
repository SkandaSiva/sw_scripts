var cacheName = 'CacheV2024110615031730907200'; //Version du cache, changer cette url reinit tout.
var filesToCache = [ //Liste de urls des fichiers / images / page HTML a mettre en cache.
  '/build/fonts/sofia_pro_light.c8ea28e7.woff2',
  '/build/fonts/sofia_pro_medium.899f8051.woff2',
  '/build/fonts/sofia_pro_semibold.908e6bad.woff2',
  '/build/page-list-script-entry.6958e8fe.js',
  '/build/product-zoom-script-entry.a74ae55f.js',
  '/build/institutionnel-script-entry.e076cc45.js',
  '/build/product-landing-script-entry.6e6c02a6.js',
  '/build/product-script-entry.df471389.js',
  '/build/lazysize-script-entry.bf94df29.js',
  '/build/global-script-entry.75acb7d6.js',
  '/build/rangeslider-script-entry.87b666bb.js',
  '/build/productGrid-script-entry.cd14c770.js',
  '/build/datalayer-script-entry.453e3337.js',
  '/build/wishlist-script-entry.f59fac6b.js',
  '/build/stimulus-script-entry.bb30e37d.js',
  '/build/global-style-entry.f1404376.css',
  '/build/homepage-style-entry.0b8e544d.css',
  '/build/product-style-entry.c8bb5e09.css',
  '/build/review-style-entry.8957b213.css',
  '/build/blog-style-entry.8d491817.css',
  '/build/categorie-style-entry.3dc800a1.css',
  '/build/images/account.svg',
  '/build/images/basket.svg',
  '/build/images/co2-neutral/co2-neutral@2x.png',
  '/build/images/ecl/ecl-logo@2x.png',
  '/build/images/exit-search.svg',
  '/build/images/foot/garantie.svg',
  '/build/images/foot/livraison.svg',
  '/build/images/foot/payment.svg',
  '/build/images/foot/return.svg',
  '/build/images/foot/wwf-opti.jpg',
  '/build/images/fsc/fsc.svg',
  '/build/images/logo.svg',
  '/build/images/menu.svg',
  '/build/images/picto-marker.svg',
  '/build/images/search-new.svg',
  '/build/images/support.svg',
  '/build/images/wishlist.svg'
];

self.importScripts("/lib/web-emarsys-service-worker.js")

//A l'installation on ajoute les fichiers en cache
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName)
    .then(function(cache) {
      return cache.addAll(filesToCache);
    })
    .then(self.skipWaiting())
  );
});
// A l'activation on supprime les anciennes versions du cache
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName) {
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    if(!event.request.url.match(/^https:\/\/[a-zA-Z-0-9]+\.?(tikamoon|tika)(\.[a-zA-Z]+)?/)){
      return;
    }

    if(event.request.method.toLowerCase() !== 'get'){
      return;
    }
    event.respondWith(
      // Try the cache
      caches.match(event.request).then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function(response) {
          return response;
        }).catch(function(e) {
          return caches.match('/offline');
        });
      })
    );
});
