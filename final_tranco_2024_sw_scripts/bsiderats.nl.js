self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


self.addEventListener('notificationclose', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
});

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;
  const action = event.action;

  if (action === 'close') {
    notification.close();
  } else {
    // Read more
    //https://web-push-book.gauntface.com/chapter-05/04-common-notification-patterns/#focus-an-existing-window
    const newsUrl = notification.data.cUrl;
    const urlToOpen = new URL(newsUrl, self.location.origin).href;
    const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

    event.waitUntil(promiseChain);
    notification.close();
  }

});

self.addEventListener('push', event => {
  //https://web-push-book.gauntface.com/chapter-05/02-display-a-notification/#visual-options
  event.waitUntil(
    // check if user is already looking on the page
    clients.matchAll().then(c => {
      if (c.length === 0) {
        // Show notification
        let notificationData = event.data.json();
        self.registration.showNotification(notificationData.cTitle, notificationData);
      }
    })
  );
});
