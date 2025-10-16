self.addEventListener('notificationclick', function(event) {
  let notification = event.notification;
  notification.close();

  let client = null;
  let url = new URL(notification.data.link, self.location.origin).href;

  let promiseChain = clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  }).then((windowClients) => {
    for(let i = 0; i < windowClients.length; i++) {
      const wClient = windowClients[i];

      if(wClient.url === url) {
        client = wClient;
        break;
      }
    }

    if(client) {
      return client.focus();
    }else {
      return clients.openWindow(url);
    }
  });

  event.waitUntil(promiseChain);
});

self.addEventListener("push", (event) => {
  let payload = (event.data && event.data.text());
  let notification = JSON.parse(payload);

  console.log(`Got notification`, notification);

  let title = 'Piczel.tv';

  let { text, icon, link } = notification;

  let tag = `piczel-${notification.type}-notif`;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: text,
      icon,
      tag,
      data: {
        link,
      }
    })
  )
});

/**
 * Avatar cache service worker 
 */

const avatarUrlRegex = /avatars\/(\w+)/;

const isAvatarRequest = str => str.match(avatarUrlRegex);

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open('avatars'));
});

self.addEventListener('fetch', async (event) => {
    if (event.request.destination === 'image' && isAvatarRequest(event.request.url)) {
        const cache = await caches.open('avatars');

        event.respondWith(
          cache.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            return fetch(event.request).then(response => {
                cache.put(event.request.url, response.clone());
                return response;
            });
        })
      )
    }
});