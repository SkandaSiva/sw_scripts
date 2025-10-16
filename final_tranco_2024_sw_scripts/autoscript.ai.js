self.addEventListener('install', () => {
  self.skipWaiting();
  console.log('[ServiceWorker] Installed');
});

self.addEventListener(
  'notificationclick',
  (event) => {
    if (event?.notification?.data?.url) {
      self.clients.openWindow(event.notification.data.url);
    }
  },
  false,
);

self.addEventListener('push', (event) => {
  // console.log('[ServiceWorker] Event', event);
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    console.error('[ServiceWorker] No permissions to send this push');
    return;
  }
  if (!event.data || !event.data.json) {
    console.error('[ServiceWorker] No data in event', event);
    return;
  }

  const data = event.data.json() ?? {};
  console.log('[ServiceWorker] Data', data);
  const { title = '', body = '', url = '' } = data;
  if (!title || !body) {
    console.error('[ServiceWorker] No title or body');
    return;
  }
  const icon = '/favicon/android-chrome-192x192.png';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      data: {
        url: url ? url : undefined,
      },
      silent: false,
      timestamp: Date.now().toString(),
    }),
    self.clients.matchAll({}).then(function (clients) {
      if (clients && clients.length) {
        clients.map((client) =>
          client.postMessage({
            type: 'NEW_NOTIFICATION',
            body,
            icon,
            url: url ? url : undefined,
          }),
        );
      }
    }),
  );
});
