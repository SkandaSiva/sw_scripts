// This is run when the service worker is installed.
self.addEventListener('install', function(event) {
    console.log('Service Worker: Installed');
  });
  
  // This is run when the service worker is activated.
  self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activated');
  });
  
  // Fetch event. Even though this isn't doing anything with fetch events,
  // you need to have it for the Service Worker to be valid.
  self.addEventListener('fetch', function(event) {});
  