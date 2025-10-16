//serviceWorker.js

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const targetURL = event.notification.data.gotoURL;
  if (!targetURL) return;

  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({
        includeUncontrolled: true,
      });

      let targetClient;

      // Let's see if we already have a chat window open:
      for (const client of allClients) {
        const url = new URL(client.url);

        if (url.pathname === targetURL) {
          // Excellent, let's use it!
          client.focus();
          targetClient = client;
          break;
        }
      }

      // If we didn't find an existing chat window,
      // open a new one:
      if (!targetClient) {
        targetClient = await clients.openWindow(targetURL);
      }
    })()
  );
});
