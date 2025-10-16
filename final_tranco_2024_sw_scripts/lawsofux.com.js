/**
 * Cache
 */

var CACHE_NAME = 'cache-v161';
var filesToCache = [
  '/',
  '/index.html',
  '/css/app.min.css',
  '/js/app.js',
  '/site.webmanifest',
  '/fonts/IBMPlexMono-Regular-Subset.woff',
  '/fonts/IBMPlexMono-Regular-Subset.woff2',
  '/fonts/IBMPlexSans-Regular-Subset.woff',
  '/fonts/IBMPlexSans-Regular-Subset.woff2',
  '/fonts/IBMPlexSans-Bold-Subset.woff',
  '/fonts/IBMPlexSans-Bold-Subset.woff2',
  '/fonts/IBMPlexSansArabic-Regular-Subset.woff',
  '/fonts/IBMPlexSansArabic-Regular-Subset.woff2',
  '/fonts/IBMPlexSansArabic-Bold-Subset.woff',
  '/fonts/IBMPlexSansArabic-Bold-Subset.woff2',
  '/fonts/NotoSansArabic-Bold-Subset.woff',
  '/fonts/NotoSansArabic-Bold-Subset.woff2',
  '/fonts/NotoSansArabic-Regular-Subset.woff',
  '/fonts/NotoSansArabic-Regular-Subset.woff2',
  '/icons/favicon.ico',
  '/icons/android-chrome-192x192.png',
  '/icons/android-chrome-512x512.png'
];



/**
 * Listen for install events
 */

self.addEventListener('install', event => {
  event.waitUntil(
    
    // Open browser cache
    caches.open(CACHE_NAME)

      // Pre-cache assets on install
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
  );
});



/**
 * Listen for request events
 */

self.addEventListener('fetch', event => {

  // Get the request
  let request = event.request;

  // Bug fix
  // https://stackoverflow.com/a/49719964
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

  // Check the cache first
  // If it's not found, send the request to the network
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(request).then(function (response) {
        return response || fetch(request).then(function(response) {
          cache.put(request, response.clone());
          return response;
        });
      });
    })
  );
});



/**
 * Listen for activate events
 */

self.addEventListener('activate', event => {
  const cacheAllowlist = [CACHE_NAME];

  // Delete outdated caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});