// serviceWorker.js

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', event => {
  if (event.data && event.data.tcfApiExists) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ callAdFunction: true });
      });
    });
  }
  if (event.data && event.data.finishAdRender) {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ finishAdRender: true });
      });
    });
  }
});
