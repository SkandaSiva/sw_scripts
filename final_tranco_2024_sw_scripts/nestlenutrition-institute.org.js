/**
 * @file
 * Serviceworker file for browser push notification.
 */

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {

  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  var data = {
    body: '',
    message: '',
    icon: ''
  };

  if (event.data) {
    data = event.data.json();
    event.waitUntil(self.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: data.notification.image,
      data: {
        url: data.notification.click_action
      }
    }));
  }
});

self.addEventListener('notificationclick', function (event) {
  event.waitUntil(
    self.clients.matchAll({ type: 'window' })
      .then(function (clientList) {
        var url = event.notification.data.url || '/';
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url == url && 'focus' in client) {
            return client.focus();
          }
        }
        return self.clients.openWindow(url);
      })
  );
});
