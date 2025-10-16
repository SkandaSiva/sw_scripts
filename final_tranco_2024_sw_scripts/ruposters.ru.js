self.addEventListener('push', function(event) {
  console.log('Received push');
  event.waitUntil(
    fetch('/push/latest').then(function(data) {
      return data.json().then(function(response) {
        console.log('Received response:');
        console.debug(response);
        if ('ok' in response && response.ok == true) {
          var title = response.title;
          var body = response.message;
          var icon = response.icon;
          var tag = 'rp-notification-tag';

          return self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tag: tag,
            requireInteraction: true,
            data: {
              url: response.url
            }
          });

        }
      });
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if ('data' in event.notification && 'url' in event.notification.data) {
    console.log('URL: ' + event.notification.data.url);
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});