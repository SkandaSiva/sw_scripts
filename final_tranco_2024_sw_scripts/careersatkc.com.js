

var CACHE_NAME = 'GlobalCareer_cache';
var urlsToPrefetch = [
  '/',
  '/styles/globalcareers.min.css',
  '/script/globalcareers.min.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function (cache) {
            console.log('Opened cache');
            cache.addAll(urlsToPrefetch.map(function (urlToPrefetch) {
                return new Request(urlToPrefetch, { mode: 'no-cors' });
            })).then(function () {
                console.log('All resources have been fetched and cached.');
            });
        })
    );
});