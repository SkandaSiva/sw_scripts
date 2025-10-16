// firebase-messaging-sw.js

//console.log('Service Worker Loaded');

self.addEventListener('push', function(event) {
  const data = event.data.json();
  //console.log('[Service Worker] Push Received.', data);

  const notificationTitle = data.notification.title;
  const notificationOptions = {
    body: data.notification.body,
    icon: '/favicon.pink.png', // Adjust the path to your notification icon
  };

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      let isWindowFocused = false;

      for (const client of clientList) {
        if (data.data && data.data.testpush && data.data.testpush == '1') {
          return self.registration.showNotification(notificationTitle, notificationOptions);
        } else if (client.focused || client.visibilityState === 'visible') {
          isWindowFocused = true;
          client.postMessage({
            type: 'push',
            data: data
          });
          break;
        }
      }

      if (!isWindowFocused) {
        return self.registration.showNotification(notificationTitle, notificationOptions);
      }
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  //console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.focused) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
