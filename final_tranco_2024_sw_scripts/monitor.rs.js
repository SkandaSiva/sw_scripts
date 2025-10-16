const cacheName = "monitor_offline";

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(
                [
                    'Components/libs/offline.html',
                    'Components/libs/logo.svg',
                ]
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (navigator.onLine || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html') )) {
      //return fetch(event.request);
    } else {
      event.respondWith(
        fetch(event.request.url).catch(error => {
          return caches.match('Components/libs/offline.html');
        })
      );
    }
});

self.addEventListener('push', function(e) {
  const payload = e.data ? e.data.text() : 'no payload';
  json_payload = JSON.parse(payload);
  // kada nema url-a onda se korisnik salje na root sajta
  event_url = json_payload.action_url !== undefined ? json_payload.action_url : '/';
    var options = {
      body: json_payload.message,
      icon: json_payload.image,
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: event_url,
      },
      actions: [
        {
          action: 'comment_answered',
          title:  'Vidi komentar',
          icon:   'images/checkmark.png',
          data: {
            url : event_url
          }
        },
        {
          action: 'close_test',
          title: 'Zatvori',
          icon: 'images/xmark.png'
        },
      ]
    };
    e.waitUntil(
      self.registration.showNotification(json_payload.subject, options)
    );
  });

  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    if(event.action === undefined) {
      event.waitUntil(
        clients.openWindow(event.notification.data.url)
      );
    } else {

    }
  });
