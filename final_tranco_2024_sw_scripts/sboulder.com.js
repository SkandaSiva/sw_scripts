self.addEventListener("install", () => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  self.skipWaiting();
});

self.addEventListener("push", function (event) {
  const data = event.data.json();

  const title = data.title;
  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    image: data.image,
    data: data.data,
  };

  const promiseChain = self.registration.showNotification(title, options);

  event.waitUntil(promiseChain);
});

self.addEventListener("notificationclick", function (event) {
  const clickedNotification = event.notification;
  clickedNotification.close();

  const promiseChain = clients.openWindow(clickedNotification.data.url);
  event.waitUntil(promiseChain);
});
