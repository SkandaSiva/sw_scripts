   function receivePushNotification(event) {
  console.log("[Service Worker] Push empfangen.");

  const payload = event.data.json();
  const title = payload.notification.title;
  
  const options = {
    body: payload.notification.body,
    //icon: payload.notification.icon,        
    data: payload.data.click_action,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(title, options));
}

function openPushNotification(event) {
  console.log("[Service Worker] Notification click", event.notification.data);
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
}

self.addEventListener("notificationclick", openPushNotification);
self.addEventListener("push", receivePushNotification);





 