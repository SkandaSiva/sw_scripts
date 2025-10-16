var CACHE_NAME = "10";
var urlsToCache = [
  '/',
  '/offline',
  '/manifest.json?v=1',
  '/app/templates/assets/js/url_slug.js ',
  '/bower_components/javascript-auto-complete/auto-complete.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
  '/bower_components/qwest/qwest.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  '/bower_components/javascript-auto-complete/auto-complete.css',
  '/app/templates/assets/image/bg/prayer-times_bg.jpg',
  '/app/templates/assets/image/logo/launcher-icon-4x.png',
  '/app/templates/assets/image/compass.png',
  '/app/templates/assets/image/favicon.ico',
  '/app/templates/assets/image/qibla_active.png',
  '/app/templates/assets/image/logo/logo.svg',
  '/app/templates/assets/image/logo/logo-icon.svg',
  '/app/templates/assets/image/logo/google-play.svg',
  '/app/templates/assets/image/logo/app-store.svg',
  '/app/templates/assets/css/getmdl-select.min.css',
  '/app/templates/assets/css/icon.css',
  '/app/templates/assets/css/material.teal-blue.min.css',
  '/app/templates/assets/css/mdl-ext-eqjs.min.css',
  '/app/templates/assets/css/master.css?v=1',
  '/app/templates/assets/css/responsive-tables.css',
  '/app/templates/assets/js/material.min.js',
  '/app/templates/assets/js/getmdl-select.min.js',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(async function() {
    try {
      return await fetch(event.request);
    } catch (err) {
      return caches.match(event.request);
    }
  }());
});

self.addEventListener('activate', function(event) {
event.waitUntil(
    caches.keys().then(function(cacheNames) {
    return Promise.all(
            cacheNames.map(function(cacheName) {
                if (CACHE_NAME.indexOf(cacheName) === -1) {
                    return caches.delete(cacheName);
                }
            })
        );
    })
);
});