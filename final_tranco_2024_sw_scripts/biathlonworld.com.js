"use strict";

self.addEventListener("push", function (event) {
  var notification = event.data.json();
  var title = notification.title
    ? notification.title
    : "International Biathlon Union";
  var icon = notification.icon
    ? notification.icon
    : "/android-chrome-192x192.png";
  var url = notification.url
    ? notification.url
    : "https://www.biathlonworld.com/";
  var bodyText = notification.body ? notification.body : "";

  event.waitUntil(
    self.registration.showNotification(title, {
      body: bodyText,
      icon: icon,
      data: {
        url: url
      }
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // Make relative URL absolute
  const sourceUrl = event.notification.data;
  const urlToOpen = new URL(sourceUrl.url, self.location.origin).href;

  // This looks to see if the current is already open and focuses if it is
  const promiseChain = self.clients
    .matchAll({
      type: "window",
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];

        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient && "focus" in matchingClient) {
        return matchingClient.focus();
      } else {
        return self.clients.openWindow(urlToOpen);
      }
    });

  event.waitUntil(promiseChain);
});
