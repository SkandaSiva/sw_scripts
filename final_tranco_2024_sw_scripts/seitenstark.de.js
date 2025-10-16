var version = 5;
var dataCacheName = 'seitenstarkData-'+version;
var cacheName = 'seitenstarkPWA-'+version;
const filesToCache = [
  '/',
  '/offline',
  '/sites/all/themes/smobil/assets/css/smobil-all.min.css',
  '/sites/all/themes/smobil/assets/js/jquery.min.js',
  '/sites/all/themes/smobil/assets/js/smobil-all.js',
  '/sites/all/themes/seitenstark/assets/fonts/Rambla-Regular.woff2',
  '/sites/all/themes/seitenstark/assets/fonts/Rambla-Bold.woff2',
  '/sites/default/files/bmfsfj-logo2.jpg',
  '/sites/default/files/aufwachsen-logo.jpg'
];
self.addEventListener('install', async function () {
  const cache = await caches.open(cacheName);
  cache.addAll(filesToCache);
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});
self.addEventListener('fetch', function (event) {
  event.respondWith(
      fetch(event.request).catch(function() {
          return caches.match(event.request)
      })
  )
});

  /*
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(function(response) {
      // Fall back to network
      return response || fetch(event.request);
    }).catch(function() {
      // If both fail, show a generic fallback:
      return caches.match('/offline');
      // However, in reality you'd have many different
      // fallbacks, depending on URL & headers.
      // Eg, a fallback silhouette image for avatars.
    })
  );
});*/