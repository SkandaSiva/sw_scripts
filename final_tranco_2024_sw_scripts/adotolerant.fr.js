const OFFLINE_VERSION = 1;
const CACHE_NAME1 = 'offline1';
const OFFLINE_URL = 'horsligne.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME1);
    await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  })());

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        console.log('Fetch failed; returning offline page instead.', error);
        const cache = await caches.open(CACHE_NAME1);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })());
  }
});

var CACHE_NAME = 'v2.0.0.5';
var urlsToCache = [
  '/assets/javascripts/socket.io.js',
  '/assets/css/ado/style.css',
  '/assets/javascripts/flowbite.bundle.js',
  '/assets/message.mp3',
  '/assets/javascripts/fancybox.umd.js',
  '/assets/css/fancy.css',
  '/assets/css/fontawesome.css',
  '/assets/webfonts/fa-brands-400.eot',
  '/assets/webfonts/fa-brands-400.ttf',
  '/assets/webfonts/fa-brands-400.woff',
  '/assets/webfonts/fa-brands-400.woff2',
  '/assets/webfonts/fa-regular-400.eot',
  '/assets/webfonts/fa-regular-400.svg',
  '/assets/webfonts/fa-regular-400.ttf',
  '/assets/webfonts/fa-regular-400.woff',
  '/assets/webfonts/fa-regular-400.woff2',
  '/assets/webfonts/fa-solid-900.svg',
  '/assets/webfonts/fa-solid-900.ttf',
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
    if(event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      )
    );
});