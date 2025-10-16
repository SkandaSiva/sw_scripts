/* eslint-disable */
self.addEventListener('message', (event) => {
  clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(event.data);
    });
  });
});

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
