self.addEventListener("fetch", function (event) {});

self.addEventListener("push", function (e) {
  var body;

  if (e.data) {
    body = e.data.text();
  } else {
    body = "Nachrichten für Sie!";
  }

  var options = {
    body: body,
    icon: "/images/logo512.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
    },
    actions: [
      {
        action: "my",
        title: "Öffnen",
        icon: "/logo512.png",
      },
    ],
  };
  e.waitUntil(self.registration.showNotification("Nachrichten", options));
});

self.addEventListener("notificationclick", function (e) {
  var notification = e.notification;
    var action = e.action;
    switch (action) {
        case "close": {
            notification.close();
            break;
        }
        case "my": {
            clients.openWindow("/~/");
            notification.close();
            break;
        }
        default: {
            clients.openWindow("/");
            notification.close();
            break;
        }
    }
});
