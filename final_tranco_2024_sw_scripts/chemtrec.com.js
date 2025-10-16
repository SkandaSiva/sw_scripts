'use strict';

var CACHE_NAME = 'smlj0z';
var CACHE_URLS = [
  '/offline',
  '/themes/custom/chemtrec/logo.svg',
  '/themes/custom/chemtrec/css/vendor/normalize.css',
  '/themes/custom/chemtrec/css/style.css',
  '/core/assets/vendor/jquery/jquery.min.js',
  '/themes/custom/chemtrec/js/script.js'
];
var CACHE_DIRS = [
  '/core/assets/vendor/jquery/',
  '/themes/custom/chemtrec/',
  '/modules/custom/chemtrec_module/',
];

function canPullFromCache (request) {
  for (var i = 0, ii = CACHE_DIRS.length; i < ii; ++i) {
    if (request.url.indexOf(CACHE_DIRS[i]) !== -1) {
      return true;
    }
  }

  return false;
}

function cacheIt (cacheName, request, response) {
  caches.open(cacheName).then(function (cache) {
    cache.put(request, response);
  });
}

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_URLS);
    }).then(function () {
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== CACHE_NAME
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function () {
      self.clients.claim();
    })
  );
});

// upon fetch, load from cache if possible
self.addEventListener('fetch', function (e) {
  var request = e.request;

  if (request.mode === 'navigate') {
    // network first, fallback to offline
    e.respondWith(fetch(request).catch(function () {
      return caches.match('/offline');
    }));
  } else if (canPullFromCache(request)) {
    // cache first, fallback to network
    e.respondWith(caches.match(request).then(function (fromCache) {
      return fromCache || fetch(request).then(function (fromNetwork) {
        cacheIt(CACHE_NAME, request, fromNetwork.clone());
        return fromNetwork;
      });
    }));
  }
});
