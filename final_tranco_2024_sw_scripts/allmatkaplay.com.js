self.addEventListener('install', function(event) {
  console.log('Service worker installed');
});

self.addEventListener('fetch', function(event) {
  // You can handle caching here for offline functionality.
});
