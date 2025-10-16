self.addEventListener("install", e => e.waitUntil(self.skipWaiting()));

async function sendAnalytics(event, notificationBody) {
  const subscription = await self.registration.pushManager.getSubscription();
  const response = await fetch('https://crm.rfdatacenter.ru/web-push/analytics/megasimka', {
    method: 'POST',
    body: JSON.stringify({
      event,
      tag: notificationBody.tag,
      endpoint: subscription?.endpoint,
    }),
    headers: { 'content-type': 'application/json', },
  });
  if (!response.ok) throw response;
  return {response, body: await response.json(),};
};

self.addEventListener('push', e => {
  console.log(e, e.data.json());
  const notificationBody = e.data.json();
  self.registration.showNotification(notificationBody.title, notificationBody);
  sendAnalytics('delivered', notificationBody).then(console.log).catch(console.err);
});

self.addEventListener('notificationclick', e => {
  console.log(e);
  const notificationBody = e.notification;
  if (notificationBody.data?.url)
    e.waitUntil(clients.openWindow(notificationBody.data.url));
  sendAnalytics('clicked', notificationBody).then(console.log).catch(console.err);
});

self.addEventListener('notificationclose', e => {
  console.log(e);
  const notificationBody = e.notification;
  sendAnalytics('closed', notificationBody).then(console.log).catch(console.err);
});