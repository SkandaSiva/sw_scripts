'use strict';

self.addEventListener('push', function(event) {
  event.waitUntil(
    fetch('/ajax/notifications/get',{credentials: 'include'}).then(function(response) {
      if (response.status !== 200) {
        throw new Error('Invalid status code');
      }
      return response.json();
    }).then(function (data) {
      return registration.getNotifications()
      .then(function(res){
        for (var i = res.length - 1; i >= 0; i--) {
          if(res[i].tag === data.tag){
            res[i].close();
          }
        };
        return data;
      }).then(function (data) {
        return self.registration.showNotification(data.title, {
          body: data.body,
          icon: data.icon,
          tag: data.tag,
          data: data,
          requireInteraction: false,
        });
      });
    })
  );

});

self.addEventListener('notificationclick', function(event) {
  // Track the click
  fetch(new Request('/ajax/notifications/click', {credentials: 'include'}) )
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();
  var url = event.notification.data.url;
  event.waitUntil(
    clients.openWindow(url)
  );
});


self.addEventListener('install', (e) => {});


self.addEventListener('fetch', function(event) {
  event.respondWith(fetch(event.request));
  // event.respondWith(
  //   caches.match(event.request)
  //   .then(function(response) {
  //       if (response) {
  //           return response;
  //       }
  //       return fetch(event.request);
  //     }
  //   ).catch(function () {
  //       return fetch(event.request);
  //   })
  // );
});