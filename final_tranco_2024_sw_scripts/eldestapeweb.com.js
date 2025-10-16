(function() {
  'use strict';

  self.addEventListener('install', function(event) {
      event.waitUntil(self.skipWaiting()); // Activate worker immediately
  });

  /*----------------------------------------------------------*/
  //After install, fetch event is triggered for every page request
  //self.addEventListener("fetch", function (event) {
  //  //console.log("Request -->", event.request.url);
  //  //To tell browser to evaluate the result of event
  //  event.respondWith(
  //    caches.match(event.request) //To match current request with cached request it
  //    .then(function (response) {
  //      //If response found return it, else fetch again.
  //      return response || fetch(event.request);
  //    })
  //    .catch(function (error) {
  //      console.error("Error: ", error);
  //    })
  //  );
  //});
  /*----------------------------------------------------------*/

  self.addEventListener('activate', function(event) {
      event.waitUntil(self.clients.claim()); // Become available to all pages
  });

  importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-app.js');
  importScripts('https://www.gstatic.com/firebasejs/4.9.0/firebase-messaging.js');
  //importScripts('/js/firebase.js');

  var messagingSenderId = get_sw_url_parameters( 'messagingSenderId' );

  function get_sw_url_parameters( param ) {
      var vars = {};
      self.location.href.replace( self.location.hash, '' ).replace( 
          /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
          function( m, key, value ) { // callback
              vars[key] = value !== undefined ? value : '';
          }
      );
      if( param ) {
          return vars[param] ? vars[param] : null;    
      }
      return vars;
  }
  
  firebase.initializeApp({
    'messagingSenderId': messagingSenderId
  });

  var messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler(function(payload) {
    console.log("setBackgroundMessageHandler", payload)
    const notificationTitle = payload.data.titulo || "EL DESTAPE";

    //fetch("/webpush/" + payload.data.id_notificacion + "/show")
    
    var notificationOptions = {
      icon: 'img/push/notification.png',
      badge: 'img/push/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        nota: payload.data.nota,
        url_destino: payload.data.url_destino,
        id_notificacion: payload.data.id_notificacion
      },
      body : payload.data.body,
      requireInteraction: true
    };

    if (payload.data.image)
      notificationOptions.image = payload.data.image

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    if (notification.data) {
      //fetch("/webpush/" + notification.data.id_notificacion + "/click")

      var nota = notification.data.url_destino || notification.data.nota || 'https://www.eldestapeweb.com';
      if (nota) {
        e.waitUntil(
          clients.matchAll().then(function(clis) {
            var client = clis.find(function(c) {
              return c.visibilityState === 'visible';
            });
            //fetch("/webpush/" + notification.data.id_notificacion + "/click")

            if (client !== undefined) {
              client.navigate(nota);
              client.focus();
            } else {
              clients.openWindow(nota);
              notification.close();
            }
          })
        );
      }
    }

    self.registration.getNotifications().then(function(notifications) {
      notifications.forEach(function(notification) {
        notification.close();
      });
    });
  });
})();