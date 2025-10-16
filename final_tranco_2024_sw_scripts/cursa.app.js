var CACHE_NAME = 'cursa-cache-v100008';
var urlsToCache = [
  '/libs/fontawesome/css/all.min.css',
  '/libs/fontawesome/webfonts/*',
  '/libs/jquery/jquery-3.6.3.min.js',
  'https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900',
  '/img/logo.webp',
  '/css/svg/brand-instagram.svg',
  '/css/svg/brand-facebook.svg',
  '/css/svg/brand-linkedin.svg',
  '/css/svg/brand-youtube.svg',
  '/img/downapp/google_play_en.webp',
  '/img/downapp/apple_store_en.webp',
  '/img/downapp/google_play_es.webp',
  '/img/downapp/apple_store_es.webp',
  '/img/downapp/google_play_pt.webp',
  '/img/downapp/apple_store_pt.webp',
  '/img/test_home.webp',
  '/img/test_category.webp',
  '/img/sample-certificate/pt.webp',
  '/img/sample-certificate/en.webp',
  '/img/sample-certificate/es.webp',
  '/img/sample-certificate/fr.webp',
  '/img/down-app-banner.webp',
  '/img/associados-abed-2.webp',
  '/img/footer-down-pt.webp',
  '/img/intro/a.webp',
  '/img/intro/b.webp',
  '/img/intro/c.webp',
];

//'https://www.google-analytics.com/analytics.js',

self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        cache.addAll(urlsToCache.map(function (urlToPrefetch) {
          return new Request(urlsToCache, { mode: 'no-cors' });
        })).then(function () {
          console.log('All resources have been fetched and cached.');
        });
      })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
      )
  );
});