
    'use strict';
    const pushOpen = 'open';

    self.addEventListener('notificationclick', function (event) {
      event.notification.close();
      insertPushPixel({eventAction: pushOpen, topic: event.notification.data.FCM_MSG.data.topic, attributes: {title: event.notification.title, click_action: event.notification.data.FCM_MSG.data.url}});
      event.waitUntil(
          clients.matchAll({type: 'window'}).then(windowClients => {
              for (const client in windowClients) {
                  const url = (event && event.notification && event.notification.data && event.notification.data.url) || '';
                  if (client.url === url && 'focus' in client) {
                      return client.focus();
                  }
              }
              if (clients.openWindow) {
                  const url =
                      (event &&
                          event.notification &&
                          event.notification.data.FCM_MSG &&
                          event.notification.data.FCM_MSG.data &&
                          event.notification.data.FCM_MSG.data.url) ||
                      '';
                  return clients.openWindow(url);
              }
          })
      );
    });


    importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js');

    firebase.initializeApp({
      apiKey: 'AIzaSyBqk9Wwk46XqLgdkK_2sH517LVbROajXDQ',
      authDomain: 'dv---notificaciones-push.firebaseapp.com',
      databaseURL: 'https://dv---notificaciones-push-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'dv---notificaciones-push',
      storageBucket: 'dv---notificaciones-push.appspot.com',
      messagingSenderId: '556377485105',
      appId: '1:556377485105:web:a2604a18d24e34d674ca10',
      publicVapKey: 'BH_l0pAJ4fMdSsFy2uvKUU08ppt5KzFU0bplXWocN7dgel3jzsLPEESQSoHPic6YWRlPC17qtLKOn6qbvTebGZQ',
    });

    const pixelUrl = 'https://www.prometeo-media-service.com/assets/pixel.gif';

    function getDevice() {
        const UA = navigator.userAgent;
        if (UA.match(/iPad|Tablet/i)) {
            return 'Tablet';
        }
        if (UA.match(/Mobi/i)) {
            return 'Mobile';
        }
        if (UA.match(/Windows NT|Macintosh|Linux/i)) {
            return 'Desktop';
        }
        return 'Others';
    }

    function notificationAttributes (notification) {
        if (!notification) {
            return {title: '', url: '', body: '', icon: '', id: ''};
        }
        const title = notification.title || '';
        const url = notification.url || '';
        const id = notification.id || '';
        const body = notification.description || '';
        const icon = notification.icon || '';
        return {title, url, body, icon, id};
    };

    async function insertPushPixel ({eventAction, topic, attributes}) {
        const urlPixel = new URL(pixelUrl);
        if (attributes) {
          urlPixel.searchParams.set('event_id', attributes.id || "");
          urlPixel.searchParams.set('article_title', attributes.title || "");
          urlPixel.searchParams.set('event_url', attributes.click_action || "");
        }
        urlPixel.searchParams.set('event_type', 'push-event');
        urlPixel.searchParams.set('event_action', eventAction);
        urlPixel.searchParams.set('mid', '1501');
        urlPixel.searchParams.set('topic', topic);
        // TODO no es posible actualmente sacar m�s informaci�n del dispositivo en el service worker. Evaluar
        urlPixel.searchParams.set('pr_browser', '');
        urlPixel.searchParams.set('pr_browser_ver', '');
        urlPixel.searchParams.set('pr_os', '');
        urlPixel.searchParams.set('pr_device', getDevice() || 'Others');
        await fetch(urlPixel);
    };

    const messaging = firebase.messaging();
    const pushReceived = 'received';
    const pushClosed = 'closed';


    self.addEventListener('push', function(event) {

    const payload = event.data ? event.data.json() : {};


    const options = {
      body: payload.notification.body,
      icon: payload.notification.icon,
      data: {
          topic: payload.notification.topic,
          url: payload.notification.click_action
      }

    };

      insertPushPixel({eventAction: pushReceived, topic: payload.notification.topic, attributes: payload.notification});
  });



  self.addEventListener('notificationclose', (evt) => {

    const url = evt && evt.notification && evt.notification.data.FCM_MSG && evt.notification.data.FCM_MSG.data && evt.notification.data.FCM_MSG.data.url;
    const topic = evt && evt.notification && evt.notification.data.FCM_MSG && evt.notification.data.FCM_MSG.data && evt.notification.data.FCM_MSG.data.topic;


    insertPushPixel({eventAction: pushClosed, topic: topic, attributes:{ title: evt.notification.title,  click_action: url }});
});
    