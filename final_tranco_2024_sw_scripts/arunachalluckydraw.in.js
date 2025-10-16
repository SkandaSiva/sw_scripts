//--------------------------------------------------------------------------
// You can find dozens of practical, detailed, and working examples of 
// service worker usage on https://github.com/mozilla/serviceworker-cookbook
//--------------------------------------------------------------------------

self.addEventListener('install', function (event) {
  // Perform install step: skip waiting to activate the new service worker immediately
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('fetch', function (event) {
  // Always fetch from the network for dynamic fresh fetch
  event.respondWith(
    fetch(event.request)
      .catch(function () {
        // Fallback in case of network failure
        return new Response('Network request failed.');
      })
  );
});

self.addEventListener('activate', function (event) {
  // Claim clients immediately after activation
  event.waitUntil(self.clients.claim());
});
