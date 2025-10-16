var cacheName = 'havinschool';
var filesToCache = [
  '/wp-content/themes/havinschool/assets/fonts/kalameh/woff2/KalamehWebFaNum-Bold.woff2',
  '/wp-content/themes/havinschool/assets/fonts/kalameh/woff2/KalamehWebFaNum-ExtraBold.woff2',
  '/wp-content/themes/havinschool/assets/fonts/kalameh/woff2/KalamehWebFaNum-Light.woff2',
  '/wp-content/themes/havinschool/assets/fonts/kalameh/woff2/KalamehWebFaNum-Medium.woff2',
  '/wp-content/themes/havinschool/assets/fonts/kalameh/woff2/KalamehWebFaNum-Regular.woff2',
  '/wp-content/themes/havinschool/assets/fonts/kalameh/woff2/KalamehWebFaNum-SemiBold.woff2',
  '/wp-content/themes/havinschool/assets/css/main.css',
  '/wp-content/themes/havinschool/assets/css/plyr.css',
  '/wp-content/themes/havinschool/assets/images/main/logo.png',
  '/wp-content/themes/havinschool/assets/images/main/user-avatar.jpg',
  '/wp-content/themes/havinschool/assets/images/main/cute-background.png',
  '/wp-content/themes/havinschool/assets/js/jquery-3.6.0.min.js',
  '/wp-content/themes/havinschool/assets/js/main.js',
  '/wp-content/themes/havinschool/assets/js/plyr.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
