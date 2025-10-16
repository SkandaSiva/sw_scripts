self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  let clickResponsePromise = Promise.resolve();
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data.url);
  }
  event.waitUntil(
    Promise.all([
      clickResponsePromise
    ])
  );
});


self.addEventListener('push', function(event) {
  const payload = event.data.json()
  const notificationTitle = payload.data.title;
  let notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data: payload.data,
    badge: payload.data.badge || 'https://cdn.hullcode.com/webpush/images/badge.png'
  };

  if(payload.data.image) {
    notificationOptions.image = payload.data.image
  }

  const notificationPromise = self.registration.showNotification(notificationTitle,  notificationOptions);
   event.waitUntil(
    Promise.all([
      notificationPromise
    ])
  );
});
