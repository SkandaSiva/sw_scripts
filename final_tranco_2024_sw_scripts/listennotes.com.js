const CACHE_NAME = 'ln-cache-v1';
const urlsToCache = [
  '/static/v4/img/logo/home-horizontal-logo-desktop.png',
  '/static/v4/img/logo/home-horizontal-logo-mobile.png',
  '/static/v4/img/default/profile_avatar.jpg',
  '/static/v4/img/default/search_results.png',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', () => {});
