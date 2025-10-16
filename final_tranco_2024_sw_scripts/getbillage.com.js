// Vars
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';
var CACHE_NAME = 'billage';
var urlsToCache = [
  '../customjs/mobile.js',
  '../fonts/gelion/stylesheet.css',
  '../css/custom.css',
  '/site.webmanifest',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');

        // Open a cache and cache our files
        return cache.addAll(urlsToCache);
      })
      // Skip waiting if it's on the cache
      .then(self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', function (event) {
  console.log('Activating event ' + event);
});

//Control fetch
self.addEventListener('fetch', function (event) {
  //console.log('Fetching some data');
  //console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      //console.log('File is on the cache! Hooray! Let\'s take it from there!');
      // if(response.redirected){
      //response= cleanResponse(response);
      //}
      return response || fetch(event.request);
    })
  );
});
