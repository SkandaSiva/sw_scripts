self.addEventListener('push', (event) => {
  try {
    if (
      self.Notification == null ||
      self.Notification.permission !== 'granted'
    ) {
      console.debug('notification is disabled.');
      return;
    }

    const payload = event.data?.json() ?? null;
    const title = payload?.title ?? 'odaibako';
    const tag = payload?.tag ?? '';
    const body = payload?.body ?? '';
    const icon = payload?.icon ?? 'https://odaibako.net/favicon.ico';
    const data = payload?.data ?? null;

    self.registration.showNotification(title, {
      body,
      tag,
      icon,
      data,
    });
  } catch (e) {
    console.error(e);
  }
});

self.addEventListener('notificationclick', (event) => {
  try {
    event.notification.close();
    clients.openWindow(event.notification.data?.url ?? '/');
  } catch (e) {
    console.error(e);
  }
});
