self.addEventListener("notificationclick", function (event) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const { templateId, broadcastId, broadcastName } = event.notification.data;
  var raw = JSON.stringify({
    eventName: "read", // pushing read event in case read event is not pushed
    properties: { templateId, broadcastId, broadcastName },
    storeUrl: self.location.host,
    broadcastId: event.notification.data.broadcastId,
    customerId: event.notification.data.customerId,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    `${event.notification.data.baseUrl}/webPushApiFunctions-captureEvent`,
    requestOptions
  )
    .then((response) => response.text())
    .catch((error) => console.log("error", error));
  if (!event.action) {
    var click_action = event.notification.data.url || event.notification.data;
    event.notification.close();
    event.waitUntil(
      clients
        .matchAll({
          type: "window",
        })
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == click_action && "focus" in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(click_action);
          }
        })
    );
    return;
  }

  clients.openWindow(event.action);
});

importScripts(
  "https://bikayi-chat.firebaseapp.com/__/firebase/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://bikayi-chat.firebaseapp.com/__/firebase/9.2.0/firebase-messaging-compat.js"
);
importScripts("https://bikayi-chat.firebaseapp.com/__/firebase/init.js");

const messaging = firebase.messaging();

function captureMessageReceiveEvent(notificationOptions) {
  const eventsOnDelivered = ["read"];
  const { templateId, broadcastId, broadcastName } = notificationOptions.data;
  eventsOnDelivered.forEach((eventName) => {
    const payload = {
      eventName,
      properties: { templateId, broadcastId, broadcastName },
      storeUrl: self.location.host,
      broadcastId: notificationOptions.data.broadcastId,
      customerId: notificationOptions.data.customerId,
    };
    const deliveredRaw = JSON.stringify(payload);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: deliveredRaw,
      redirect: "follow",
    };

    fetch(
      notificationOptions.data.baseUrl + "/webPushApiFunctions-captureEvent",
      requestOptions
    )
      .then((response) => response.text())
      .catch((error) => console.log("error", error));
  });
}

messaging.onBackgroundMessage(function (payload) {
  const actions = JSON.parse(payload.data["actions"]);
  const broadcastId = parseInt(payload.data["broadcast_id"]);
  const customerId = parseInt(payload.data["customer_id"]);
  const baseUrl = `${payload.data["base_url"]}`;

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    image: payload.data.image,
    title: payload.data.title,
    data: {
      url: payload.data.click_action,
      broadcastId,
      customerId,
      baseUrl,
    },
    actions,
  };
  captureMessageReceiveEvent(notificationOptions);
  if (!actions) {
    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications.");
    } else if (Notification.permission === "granted") {
      var notification = new Notification(
        notificationTitle,
        notificationOptions
      );
      const linkToOpen = payload.fcmOptions.link.trim();
      notification.onclick = function (event) {
        event.preventDefault();
        clients.openWindow(linkToOpen, "_blank");
        notification.close();
      };
    }
    return;
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});
