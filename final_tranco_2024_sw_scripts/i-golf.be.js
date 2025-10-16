self.addEventListener('push', function(event) {
  //console.log('[Service Worker] Push Received.');
  var payload = event.data ? event.data.text() : '{"titel":"ISB","bericht":"ISB"}';

  var message = JSON.parse(payload);
  
  var title = message.titel;
  var options = {
    body: message.bericht,
    icon: message.icon,
    //badge: 'images/badge.png',
    //vibrate: [500, 100, 500, 100, 500], 
    requireInteraction: true,
    tag: message.tag,
    data: { id:message.id , link:message.link , update:message.update }
  };

//  event.waitUntil(self.registration.showNotification(title, options));

  //filteren op lijst van notificaties met zelfde tag
  //indien meerdere notificaties, nemen we ze samen en zetten een extra teller
  var notificationFilter = { tag: message.tag };
  return self.registration.getNotifications(notificationFilter)
    .then(function(notifications) {
      if (notifications && notifications.length > 0) {
        // Start with one to account for the new notification we are adding
        var notificationCount = 1;
        for (var i = 0; i < notifications.length; i++) {
          var existingNotification = notifications[i];
          if (existingNotification.data && existingNotification.data.notificationCount) {
            notificationCount += existingNotification.data.notificationCount;
          } else {
            notificationCount++;
          }
          //
          title = '(' + notificationCount + ') ' + title;
          options.data.notificationCount = notificationCount;
          //
          existingNotification.close();
        }
      }

      return self.registration.showNotification(title, options);
    });
    
});

self.addEventListener('notificationclick', function(event) {
  //console.log('[Service Worker] Notification click Received.'); 
  //update van message
  hurl = event.notification.data.update;
  if (hurl) {
    hurl = hurl+'&paction=CLICKED';
    fetch(hurl).then(function(response) {
      // success
    }).catch(function(err) {
      // error
    });
  }
      
  event.notification.close();

  //Focus tab if open
  event.waitUntil(clients.matchAll({includeUncontrolled: true, type: 'window'}).then(function (clientList) {
    //console.log("clients:" + clientList.length);
    var hfocus;
    for (var i = 0; i < clientList.length; ++i) {
      var client = clientList[i];
      //console.log("client:" + client.url);
      if (client.url.indexOf(event.notification.data.link) != -1) {
        //console.log("focus:" + client.url);
        hfocus = client;
      }
    }
    if (hfocus) {
      return hfocus.focus();
    }
    if (clients.openWindow) {
      return clients.openWindow(event.notification.data.link);
    }
  }));
});
    
self.addEventListener('notificationclose', function(event) {
  //console.log('[Service Worker] Notification close Received.'); 
  hurl = event.notification.data.update;
  if (hurl) {
    hurl = hurl+'&paction=CLOSED';
    fetch(hurl).then(function(response) {
      // success
    }).catch(function(err) {
      // error
    });
  }
});

//cache en fetch
var cacheVersion = 1.1;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};
const offlineUrl = '/i/isb/alg/js/serviceWorkers/pwa-offline.html?v=1.1';
//install event
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([
          offlineUrl,
          '/i/isb/alg/js/serviceWorkers/pwa-offline.css?v=1.1'
      ]);
    })
  );
});

//fetch event
self.addEventListener('fetch', function(event) {
//  //request.mode = navigate isn't supported in all browsers
//  //so include a check for Accept: text/html header.
//  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
//    event.respondWith(
//      fetch(event.request).catch(error => {
//        //Return the offline page
//        return caches.match(offlineUrl);
//      })
//    );
//  } else {
    // Respond with everything else if we can
    event.respondWith(
      caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
      })
    );
//  }
});
