self.addEventListener("push", function (event) {
  if (event.data) {
    const pushData = event.data.json();
    const options = {
      body: pushData.body,
      icon: pushData.icon,
      badge: pushData.badge,
      image: pushData.image,
      data: {
        url: pushData.url,
        notificationId: pushData.notificationId,
        userId: pushData.userId,
      },
      tag: pushData.tag,
      renotify: true,
      actions: [{ action: "open", title: "Open" }],
      requireInteraction: true,
    };

    event.waitUntil(
      self.registration.showNotification(pushData.title, options).then(() => {
        // Log that the notification was received
        return fetch("/push/log-notification-event.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "received",
            notificationId: pushData.notificationId,
            userId: pushData.userId,
          }),
        });
      }),
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const notificationData = event.notification.data;
  const urlToOpen = notificationData.url || "https://deeezy.com";
  const notificationId = notificationData.notificationId;
  const userId = notificationData.userId;

  event.waitUntil(
    Promise.all([
      clients.openWindow(urlToOpen),
      fetch("/push/log-notification-event.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "clicked",
          notificationId: notificationId,
          userId: userId,
        }),
      }),
    ]),
  );
});
