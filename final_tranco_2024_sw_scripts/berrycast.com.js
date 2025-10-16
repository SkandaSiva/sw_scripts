const channel = new BroadcastChannel('sw-berrycast-record');
channel.addEventListener('message', (event) => {
  const serviceWorkerEvent = event.data;
  if (serviceWorkerEvent.eventName === 'forward') {
    channel.postMessage(serviceWorkerEvent.data);
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('sw-cache').then((cache) => {
      return cache.add('/');
    }),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.indexOf(location.origin) === 0) {
    event.respondWith(fetch(event.request).catch(() => caches.match('/')));
  }
});
