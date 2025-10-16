importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  self.addEventListener('notificationclick', (event) => {
    if (clients.openWindow) {
      event.waitUntil(
        clients.openWindow((event.notification.data && event.notification.data.url) || 'https://csfloat.com')
      );
    }
  });
})();
