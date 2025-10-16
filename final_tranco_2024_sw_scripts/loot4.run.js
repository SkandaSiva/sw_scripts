/* eslint-disable */
/* global self */
const API_URL = "https://api.webpush.cc";

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let notification = event.data.json();
  event.waitUntil(self.registration.showNotification(notification.title, notification.options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  let targetUrl = `${API_URL}/notification/${event.notification.tag}/redirect`;
  event.waitUntil(clients.openWindow(targetUrl));
});

self.addEventListener("pushsubscriptionchange", function (event) {
  if (!event.oldSubscription || !event.newSubscription) return;
  event.waitUntil(
    fetch(`${API_URL}/change-subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        old: event.oldSubscription,
        new: event.newSubscription,
      }),
    })
  );
});
