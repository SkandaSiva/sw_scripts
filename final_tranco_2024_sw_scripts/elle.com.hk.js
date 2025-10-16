self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
});

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log('on pushsubscriptionchange')
  const options = event.oldSubscription.options;
  // Fetch options if they do not exist in the event.
  event.waitUntil(
    self.registration.pushManager.subscribe(options).then((subscription) => { // eslint-disable-line no-unused-vars
      // Send new subscription to application server.
    }),
  );
});

self.addEventListener('push', (event) => {
  console.log('on push', event.data)
  if (event.data) {
    const data = event.data.json();

    const title = data.title;
    const options = {
      body: data.body,
      icon: data.icon,
      image: data.image,
      badge: data.badge,
      tag: data.tag || 'default',
      data: data.url,
      requireInteraction: data.requireInteraction,
      actions: data.actions,
      timestamp: data.timestamp
    };

    console.log({ title, options })

    event.waitUntil(
      self.registration.showNotification(title, options),
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  if (event.notification.data) {
    let url = event.notification.data;
    event.notification.close();

    event.waitUntil(
      self.clients.matchAll({
        type: 'window',
      }).then((clientList) => {
        for (let i = 0; i < clientList.length; i += 1) {
          const client = clientList[i];
          const found = client.url === url || client.url === `${url}/`;
          if (found && 'focus' in client) {
            client.focus();
            return;
          }
        }
        if (self.clients.openWindow) {
          self.clients.openWindow(url);
        }
      }),
    );
  }

});
