/* eslint-disable no-restricted-globals */

self.addEventListener("push", function (event) {
  var data = event?.data?.json();

  var myHeaders = new Headers();
  myHeaders.append("Authorization", data?.token);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    tracking_type: "delivered",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch(
    data?.notification_service_url + "/notification_tracking",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {})
    .catch((error) => {});

  var title = data?.title;

  // Ensure that data.actions is an array, providing a default if undefined
  var actions = Array.isArray(data.actions) ? data.actions : [];

  // Ensure that each action object has at least the 'action' and 'title' properties
  actions = actions.map(function (action) {
    return {
      action: action?.redirect_url ?? "",
      title: action?.title ?? "",
      // Add other properties if needed
    };
  });

  var options = {
    body: data?.description,
    icon: data?.logo_url,
    image: data?.image_url,
    actions: actions,
    data: {
      token: data?.token,
      endpoint: data?.notification_service_url,
      url: data?.redirect_url,
      id: data?.event_id || "",
    },
  };


  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  var urlToOpen = event?.notification?.data?.url;
  var token = event?.notification?.data?.token;
  var endpoint = event?.notification?.data?.endpoint;
  var action =
    event?.action === "" ||
    event?.action === null ||
    event?.action === undefined
      ? urlToOpen
      : event?.action;
  var type = "clicked";

  for (let i = 0; i < event?.notification?.actions?.length; i++) {
    if (event?.notification?.actions[i]?.action === action) {
      if (i === 1) type = "secondary_button_clicked";
      if (i === 0) type = "primary_button_clicked";
    }
  }

  var myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    tracking_type: type,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch(endpoint + "/notification_tracking", requestOptions)
    .then((response) => response.text())
    .then((result) => {})
    .catch((error) => {});

  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({
        type: "all",
      })
      .then(function (clientList) {
        // If a window with the same URL already exists, focus on it.
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if ((client?.url === action && "focus" in client) || "focus" in client) {
            return client.focus();
          }
        }

        // If no window with the same URL is open, open a new one.
        if (self.clients.openWindow) {
          return self.clients.openWindow(action);
        }
      })
  );
});

self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});
