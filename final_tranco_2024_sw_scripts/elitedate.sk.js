self.addEventListener('install', function(event) {
  var offlinePage = new Request('/pwa/offline', {credentials: 'same-origin'});
  event.waitUntil(
    fetch(offlinePage).then(function(response) {
      return caches.open('ed-offline').then(function(cache) {
        return cache.put(offlinePage, response);
      });
    }));
});

self.addEventListener('fetch', function(event) {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function (error) {
          return caches.open('ed-offline').then(function (cache) {
            return cache.match('/pwa/offline');
          });
        }
      ));
  }
});

self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }
  if (event.data) {
    var data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title, data)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var eventAction = (event.action)? event.action : 'bodyAction';
  if (event.notification.data.hasOwnProperty(eventAction)) {
    switch (event.notification.data[eventAction].type) {
      case 'openLink':
        event.waitUntil(clients.openWindow(event.notification.data[eventAction].url));
        break;
    }
  }
});