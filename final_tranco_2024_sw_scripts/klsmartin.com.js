'use strict';

self.addEventListener('push', function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted'))
    return;

  if (!(event.data)) return;

  const data = event.data?.json();

  event.waitUntil(
    self.registration.showNotification(data?.title ?? 'KLS Martin', {
      body: data?.body ?? '',
      icon: data?.icon ?? '',
      image: data?.image ?? '',
      data: {
        link: data?.link ?? 'https://www.klsmartin.com/'
      },
      tag: data?.tag ?? ''
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('On notification click: ', event.notification.tag);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then((clientList) => {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url === '/' && 'focus' in client) {
        return client.focus();
      }
    }

    if (clients.openWindow) {
      return clients.openWindow(event?.notification?.data?.link ?? 'https://www.klsmartin.com/');
    }
  }));
});
