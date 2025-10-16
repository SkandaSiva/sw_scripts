'use strict';
const CACHE_VERSION = 1;
let CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};
const OFFLINE_URL = 'swoffline.php';

function createCacheBustedRequest(url) {
  let request = new Request(url, {cache: 'reload'});
  if ('cache' in request) {
    return request;
  }
  let bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
  return new Request(bustedUrl);
}

self.addEventListener('install', event => {
  event.waitUntil(
    fetch(createCacheBustedRequest(OFFLINE_URL)).then(function(response) {
      return caches.open(CURRENT_CACHES.offline).then(function(cache) {
        return cache.put(OFFLINE_URL, response);
      });
    })
  );
});

self.addEventListener('activate', event => {
  let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    console.log('Handling fetch event for', event.request.url);
    event.respondWith(
      fetch(event.request).catch(error => {
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match(OFFLINE_URL);
      })
    );
  }
});

self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    var sendNotification = function(message, tag) {
        // on actualise la page des notifications ou/et le compteur de notifications
        self.refreshNotifications();
        var title = message.title;
        if(message.icon){
            var icon = message.icon;
        } else {
            var icon = "https://cdn.inicium.com/images/i7/logos/logo_notif.png";
        }

        tag = tag || '/';

        return self.registration.showNotification(title, {
            body: message.body,
            icon: icon,
            tag: tag
        });
    };

    if (event.data) {
        var data = event.data.json();
        event.waitUntil(
            sendNotification(data, data.tag)
        );
    } else {
        event.waitUntil(
            self.registration.pushManager.getSubscription().then(function(subscription) {
                if (!subscription) {
                    return;
                }

                return fetch('api/notifications/last?endpoint=' + encodeURIComponent(subscription.endpoint)).then(function (response) {
                    if (response.status !== 200) {
                        throw new Error();
                    }

                    // Examine the text in the response
                    return response.json().then(function (data) {
                        if (data.error || !data.notification) {
                            throw new Error();
                        }

                        return sendNotification(data.notification.message);
                    });
                }).catch(function () {
                    return sendNotification();
                });
            })
        );
    }
});

self.refreshNotifications = function(clientList) {
    if (clientList == undefined) {
        clients.matchAll({ type: "window" }).then(function (clientList) {
            self.refreshNotifications(clientList);
        });
    } else {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url.search(/notifications/i) >= 0) {
                // si la page des notifications est ouverte on la recharge
                client.postMessage('reload');
            }

            // si on n'est pas sur la page des notifications on recharge le compteur
            client.postMessage('refreshNotifications');
        }
    }
};

self.addEventListener('notificationclick', function (event) {
    // fix http://crbug.com/463146
    if(event.notification.tag){
        var url = event.notification.tag;
    } else {
        var url = "/";
    }
    event.notification.close();
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
            .then(function (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url.search(url) >= 0 && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});

self.addEventListener('message', function (event) {
    var message = event.data;

    switch (message) {
        case 'dispatchRemoveNotifications':
            clients.matchAll({ type: "window" }).then(function (clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    clientList[i].postMessage('removeNotifications');
                }
            });
            break;
        default:
            console.warn("Message '" + message + "' not handled.");
            break;
    }
});

