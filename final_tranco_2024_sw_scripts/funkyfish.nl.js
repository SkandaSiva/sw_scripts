self.addEventListener('install', function(event) {
  // self.skipWaiting()
  // console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
  // console.log('Service Worker activating.');
});

self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  notification.close();

  if (Object.keys(notification.data).length > 1) {
    if (notification.data.hasOwnProperty('url')) {
      // clients.openWindow(notification.data.url);

      // This looks to see if the current is already open and
      // focuses if it is
      event.waitUntil(clients.matchAll({
        type: "window"
      }).then(function(clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == notification.data.url && 'focus' in client)
            return client.focus();
        }
        if (clients.openWindow)
          return clients.openWindow(notification.data.url);
      }));
    }
  }
});