(function() {
  self.addEventListener('push', function(event) {
    var json;
    json = event.data.json();
    event.waitUntil(self.registration.showNotification(json.title, json.options));
  });

  self.addEventListener('notificationclick', function(event) {
    var appUrl, json;
    event.notification.close();
    json = event.notification.data;
    appUrl = json.url;
    return event.waitUntil(clients.matchAll({
      includeUncontrolled: true,
      type: 'window'
    }).then(function(activeClients) {
      if (activeClients.length > 0) {
        activeClients[0].navigate(appUrl);
        return activeClients[0].focus();
      } else {
        return clients.openWindow(appUrl);
      }
    }));
  });

  self.addEventListener('notificationclose', (function(_this) {
    return function(event) {};
  })(this));

}).call(this);
