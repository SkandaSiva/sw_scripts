self.addEventListener('notificationclick', event => {
const notification = event.notification;
const url = notification.data.url;
const action = event.action;

if (action === 'close') {
  notification.close();
} else {
  clients.openWindow(url);   
  notification.close();
}
    self.registration.getNotifications().then(notifications => {
        notifications.forEach(notification => {
          notification.close();
        });
  });

});

self.addEventListener('install', event => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated');
});

self.addEventListener('push', event => {
  const payload = JSON.parse(event.data.text())
  const title = payload.title;
  const body  = payload.body;
  const url = `${self.location.origin}${payload.dataType}`;  

  const options = {
      body: body,
      icon: `${self.location.origin}/favicon.ico`,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        url: url,
      },
    };

    event.waitUntil(
      clients.matchAll().then(c => {
          self.registration.showNotification(title, options);
        })
    );
});

