const preLoad = function () {
    return caches.open("offline").then(function (cache) {
        // caching index and important routes
        return cache.addAll(filesToCache);
    });
};

self.addEventListener("install", function (event) {
    event.waitUntil(preLoad());
});

const filesToCache = [
    '/',
    '/offline.html'
];

const checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
        fetch(request).then(function (response) {
            if (response.status !== 404) {
                fulfill(response);
            } else {
                reject();
            }
        }, reject);
    });
};

const addToCache = function (request) {
    return caches.open("offline").then(function (cache) {
        return fetch(request).then(function (response) {
            return cache.put(request, response);
        });
    });
};

const returnFromCache = function (request) {
    return caches.open("offline").then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status === 404) {
                return cache.match("offline.html");
            } else {
                return matching;
            }
        });
    });
};

self.addEventListener("fetch", function (event) {
    event.respondWith(checkResponse(event.request).catch(function () {
        return returnFromCache(event.request);
    }));
    if(!event.request.url.startsWith('http')){
        event.waitUntil(addToCache(event.request));
    }
});

self.addEventListener('push', function (e) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        //notifications aren't supported or permission not granted!
        return;
    }

    if (e.data) {
        var msg = e.data.json();
        console.log(msg)
        e.waitUntil(self.registration.showNotification(msg.title, {
            body: msg.body,
            icon: msg.icon,
            // image: msg.icon,
            // badge: msg.icon,
            actions: msg.actions,
            data: msg.data
        }));
    }
});

// self.addEventListener("notificationclick", (event) => {
//     // // TODO
//     console.log(event.notification);
//     // event.notification.close();
//     event.waitUntil(self.clients.openWindow("/"));
// });

// self.notificationActions = {
//     // Your custom actions must be defined here
  
//     exampleAction: function (customData) {
//       console.log('exampleAction called with data: ' + customData);
  
//       // You can use the notification "custom data" field to pass a param to your actions
//       var itemId = customData;
  
//       // All actions must return a Promise
//     //   return fetch('/item/' + itemId + '/like', { method: "POST" });
//         return fetch('/contact-us', { method: "GET" });
//     }
//   };

// self.addEventListener('notificationclick', function(event) {
//     if (event.action === 'view_app') {
//       // Open a URL when clicking on the notification
//         // let data = event.data.text();
//         // console.log(data,event);
//     //   console.log(event.notification, data);
//     //   clients.openWindow('https://inqaku.com/' + event.notification.data.foo);
//     clients.openWindow('https://inqaku.com/');
//     //   console.log('PING');
//     }
//   });

  self.addEventListener('notificationclick', function(event) {
    //
    //NB!!! body, icon, actions, data properties needs to be set in the push eventlistener first
    //

    event.notification.close();

    event.waitUntil(clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then(function(clientList) {
        // If there is at least one open window
        if (clientList.length > 0) {
            // Focus on the first window
            clientList[0].navigate('https://inqaku.com' + event.notification.data.foo);
            return clientList[0].focus();
        //   return clientList[0].navigate('http://localhost:8027');
        //   return clientList[0].focus();
        } else {
            // Otherwise, open a new window
            return clients.openWindow('/');
        }
    }));
  });
  