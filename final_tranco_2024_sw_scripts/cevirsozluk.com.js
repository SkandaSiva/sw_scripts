const ver = 'v1';
const ad = `cevirsozluk-${ver}`;


self.addEventListener('install', function() {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {

});