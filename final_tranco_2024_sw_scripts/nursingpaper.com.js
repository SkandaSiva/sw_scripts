// Version: 1.0.0

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting(); // Immediately activate the new Service Worker
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    // Clearing old caches, if any (can be adapted to specific needs)
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      // We notify customers about the activation of a new version
      return self.clients.claim();
    })
  );
});

// Processing fetch events: we pass all requests to the network without caching anything
self.addEventListener('fetch', (event) => {
  // Here you can add logic for intercepting requests if necessary, but by default we let them through the network
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      fetch(event.request).catch((error) => {
        console.error('Fetch failed; returning offline page instead.', error);
        return new Response('Offline content not available', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
    );
  });
});

// Processing messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log( 'skip waiting' )
    self.skipWaiting(); // Immediately activate the new Service Worker
  }
});

// Оповещение клиентов о доступности новой версии Service Worker
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     clients.matchAll({ type: 'window' }).then((clients) => {
//       clients.forEach((client) => {
//         client.postMessage({ type: 'NEW_VERSION', message: 'New version available' });
//       });
//     })
//   );
// });