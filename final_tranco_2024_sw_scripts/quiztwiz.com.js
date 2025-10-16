self.addEventListener("push", function (event) {
  const data = event.data.json();
  console.log("data", data.data.url);
  const options = {
    body: data.body,
    data: data.data,
    title: data.title,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  console.log("notification event", event);
  const url = event.notification.data.url || "https://example.com";
  console.log("url", url);
  event.waitUntil(clients.openWindow(url));
});
