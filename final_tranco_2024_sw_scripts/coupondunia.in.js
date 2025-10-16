/* eslint-env browser, serviceworker, es6 */

'use strict';
self.registration.user = null;
var version = 1.0;


function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener('push', function(event) {
 
 var data = event.data.json();
 if(data) {
    const title = data.title;
    const options = {
      body: data.body ,
      icon: data.icon,
      badge: data.badge || 'images/badge.png',
      image : data.image || '',
      data : JSON.parse(data.data)

    };

    event.waitUntil(self.registration.showNotification(title, options));
  }

});

self.addEventListener('notificationclick', function(event) {
  
  if(!(event.notification.data && event.notification.data.landingPage)) {
    event.notification.close();
    return true;
  }

  var landingPage = event.notification.data.landingPage;
  event.waitUntil(clients.matchAll({
        type: "window"
  }).then(function(urls) {
        for (var index = 0; index < urls.length; index++) {
            var current = urls[index];
            if ("/" == current.url && "focus" in current) return current.focus()
        }
        if (clients.openWindow) return clients.openWindow(landingPage)
  }));
  event.notification.close();

});


self.addEventListener('message', function(event){
    if(event.data.type == 'update') {
        self.registration.user = event.data.value;
    } else if(event.data.type == 'get') {
      event.ports[0].postMessage({'data' : self.registration.user});
    }
});

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

