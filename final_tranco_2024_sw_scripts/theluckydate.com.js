self.addEventListener('install', (_) => {
  console.info('SW installed');
  self.skipWaiting();
});

self.addEventListener('activate', (_) => {
  console.info('SW activated');
});

self.addEventListener('push', (_) => {
  console.info('SW push');
});

self.addEventListener('notificationclick', (_) => {
  console.info('SW notificationclick');
});

self.addEventListener('message', (event) => {
  if (event.data === 'userLoggedOut' && typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('user-status');

    channel.postMessage('userLoggedOut');
  }
});
