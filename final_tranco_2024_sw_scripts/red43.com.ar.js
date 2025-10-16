(function() {
  'use strict';

  self.addEventListener('install', function(event) {
      event.waitUntil(self.skipWaiting()); // Activate worker immediately
  });

  self.addEventListener('activate', function(event) {
      event.waitUntil(self.clients.claim()); // Become available to all pages
  });

  // importScripts('/js/firebase.js');
  importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-app.js');
  importScripts('https://www.gstatic.com/firebasejs/5.3.0/firebase-messaging.js');

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
    'messagingSenderId': messagingSenderId+""
  });

  var messaging = firebase.messaging();

  messaging.setBackgroundMessageHandler(function(payload) {
    console.log("setBackgroundMessageHandler", payload)
    var notificationTitle = payload.data.body;
    var notificationOptions = {
      icon: 'img/push/notification.png',
      badge: 'img/push/badge.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        nota: payload.data.nota,
        url_destino: payload.data.url_destino,
        id_notificacion: payload.data.id_notificacion
      }
    };

    if (payload.data.image)
      notificationOptions.image = payload.data.image

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });

  self.addEventListener('notificationclick', function(e) {
    var notification = e.notification;
    if (notification.data) {

      var nota = notification.data.url_destino || notification.data.nota || 'https://www.red43.com.ar/';
      if (nota) {
        e.waitUntil(
          clients.matchAll().then(function(clis) {
            var client = clis.find(function(c) {
              return c.visibilityState === 'visible';
            });

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