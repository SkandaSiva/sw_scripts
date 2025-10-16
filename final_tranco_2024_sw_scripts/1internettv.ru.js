function receivePushNotification(event) {

  const { icon, url, title, body } = event.data.json();

  const options = {
    body: body,
    icon: icon,
    requireInteraction: true,
    data: url
  };

  event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", openPushNotification);
