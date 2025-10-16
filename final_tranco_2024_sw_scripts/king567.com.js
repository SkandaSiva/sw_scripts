self.addEventListener("push", (event) => {
  const data = event.data.json();
  const title = data.title || "Yay a message";
  const body = data.body || "We have received a push message";
  const image = data.image;
  self.defaultHost = data.open_url;

  const options = {
    body: body,
    tag: data.tag,
    requireInteraction: true
  };

  if (image) {
    options.icon = image;
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Close the notification when clicked

  // Open a new window with the specified URL
  event.waitUntil(
    Promise.resolve().then(() => {
      let defaultHost = self.defaultHost;
      console.log(defaultHost);
      return clients.openWindow(defaultHost);
    })
  );
});
