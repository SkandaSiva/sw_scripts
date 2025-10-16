self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json();
    const chain = [];

    if (data.title || data.body) {
      const showNotification = self.registration.showNotification(data.title, {
        body: data.body,
        badge: '/push-badge.png',
        icon: data.icon,
        data,
        actions: [
          {
            action: 'open',
            title: data.action_title,
          },
        ],
      });
      chain.push(showNotification);
    }
    if (data.badge && navigator.setAppBadge) {
      navigator.setAppBadge(data.badge).catch(() => {});
    }

    const PostMessageChain = self.clients
      .matchAll({
        includeUncontrolled: true,
        type: 'window',
      })
      .then((windowClients) => {
        // Send a response - the clients
        // array is ordered by last focused
        for (let i = 0; i < windowClients.length; i++) {
          const windowClient = windowClients[i];
          windowClient.postMessage({
            type: 'NEW_PUSH_MESSAGE',
            data,
          });
        }
        return true;
      });
    chain.push(PostMessageChain);

    if (data.pushMessageId) {
      const deliveryNotifyURL = new URL(
        `/api/push-delivery.php?token=${data.pushMessageToken}&message=${data.pushMessageId}`,
        self.location.origin
      ).href;

      const deliveryNotify = fetch(deliveryNotifyURL);
      chain.push(deliveryNotify);
    }

    event.waitUntil(Promise.allSettled(chain));
  } else {
    // no data? maybe Samsung Internet bug, no message details
    const promiseChain = self.registration.showNotification('New message', {
      actions: [
        {
          action: 'read-message',
          title: 'Read Message',
        },
      ],
    });
    event.waitUntil(promiseChain);
  }
});

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  let toOpen = null;
  let toCheck = null;
  if (notification.data) {
    event.notification.close();
    toCheck = notification.data.checkUrl;
    toOpen = notification.data.openUrl;
  } else {
    event.notification.close();
    toOpen = '/chats';
    toCheck = '/chats';
  }

  const urlToOpen = new URL(toOpen, self.location.origin).href;
  const urlToCheck = new URL(toCheck, self.location.origin).href;

  const promiseChain = self.clients
    .matchAll({
      type: 'window',
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToCheck) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        matchingClient.postMessage({
          type: 'NEW_PUSH_CLICK',
          data: notification.data,
        });
        return matchingClient.focus();
      } else {
        try {
          const w = self.clients.openWindow(urlToOpen).then(function (client) {
            if (client === null && windowClients) {
              // PWA click? can't open new window?
              for (let i = 0; i < windowClients.length; i++) {
                const windowClient = windowClients[i];
                windowClient.postMessage({
                  type: 'NEW_PUSH_CLICK',
                  data: notification.data,
                });
              }
              return true;
            } else {
              return client.focus();
            }
          });

          return w;
        } catch (err) {
          // err
        }
      }
    });

  event.waitUntil(promiseChain);
});
