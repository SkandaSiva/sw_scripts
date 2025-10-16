var currentVersion = 'v1.1';
var keepCaches = [
  currentVersion
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(currentVersion).then(function(cache) {
      return cache.addAll([
        "/scripts/vendor/bootstrap/bootstrap.min.js",
        "/scripts/bootstrap-rating.min.js",
        "/scripts/vendor/js.cookie.js",
        "/scripts/vendor/jquery.qtip.min.js",
      ])
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (!keepCaches.includes(key)) { return caches.delete(key); }
        })
      )
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
