const version = "0.5.0";
const cacheName = `invest-india-${version}`;
self.addEventListener('install', e => {
  caches.keys().then(cacheNames => {
    cacheNames.forEach(cacheName => {
      caches.delete(cacheName);
    });
  });
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        `/`,
      ])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('beforeinstallprompt', (e) => {
  e.userChoice.then(choiceResult => {
    ga('send', 'event', 'A2H', 'click', 'pwa', choiceResult.outcome);      
  });
  // Update UI notify the user they can add to home screen
  showInstallPromotion();
});

// self.addEventListener('appinstalled', (evt) => {
//   console.log('a2hs installed');
// });
