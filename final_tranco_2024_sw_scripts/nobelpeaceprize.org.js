'use strict';

/**
 * Calls the given service and notifies about status changes for the notification found in the given dataset.
 *
 * @param data Data about the notification.
 * @param service The name of the server side service to call.
 */
var callNotificationStatusService = function(service, notificationId, securityToken) {
  // console.log('about to construct url', service, notificationId, securityToken);
  var url = "/service.php?service="+service+"&notificationId=" + notificationId + "&securityToken=" + securityToken;
  // console.log('url is ', url);

  // fire an fetch request
  fetch (
    url,
    { credentials: 'include' }
  ).then(function(response) {
      if (response.ok) {
        // console.log('Service ['+ service +'] succeeded for notification ['+notificationId+']', url);
      } else {
        console.log('Service ['+ service +'] failed for notification ['+notificationId+']', url);
        console.log(response);
      }
    }
  ).catch(function(error) {
    console.log('Fetch failed with error', error);
  });
}

/**
 * Checks whether the given url is already open in one of the browser tabs and re-uses
 * that window if true, opens new window if url is not already open.
 *
 * Source: https://web-push-book.gauntface.com/chapter-05/04-common-notification-patterns/
 *
 * @param string url
 * @returns promise
 */
const createUrlHandlerPromise = function (url) {
  const urlToOpen = new URL(url, self.location.origin).href;

  return clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return clients.openWindow(urlToOpen);
      }
    });
}



self.addEventListener('install', function(event) {
  // console.log('Service Worker installed !!!');
  // Skip the waiting phase, activate right away
  // self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  // console.log('Service Worker activating.');
});

self.addEventListener('fetch', function(event) {

  // DevTools opening will trigger these o-i-c requests, which this SW can't handle.
  // There's probaly more going on here, but I'd rather just ignore this problem. :)
  // See https://github.com/paulirish/caltrainschedule.io/issues/49
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }


  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});


/**
 * Handles received push notification
 */
self.addEventListener('push', function (event) {
  // console.log('[Service Worker] Event listener for push starting');
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  // console.log(event);
  // console.log('[Service Worker] received data', event.data);
  var data = {};
  if (event.data) {
    data = event.data.json();
  }

  // console.log('[Service Worker] Push Received!');

  const title = data.title || '';
  const options = {
    body: data.message ? data.message : '',
    icon: data.icon? data.icon : '/images/pwa-push-icon.png',
    badge: data.badge? data.badge : '/images/pwa-push-badge.png',
    // Vibration examples on https://tests.peter.sh/notification-generator/
    vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
    requireInteraction: data.requireInteraction? data.requireInteraction:false, // Whether user MUST click on the notification to go away (desktop only)
    data:data, // pass all data on so we can use it on the notificationclick handler.
    // actions: [{action: "get", title: "Get now.", 'icon': 'icon/bla.png'}, {action: "get2", title: "Get 2"}]
  };

  // Add custom actions if present.
  if (data.actions) {
    options['actions'] = data.actions;
  }

  // Use tag/grouping functionality if set.
  if (data.tag) {
    options['tag'] = data.tag;
    options['renew'] = data.renew? data.renew: true ;
  }

  // console.log('[Service Worker] options are', options);

  event.waitUntil(
    self.registration.showNotification(title, options).then(

      // NOTE: There is not way to register an event/catch when the user actually sees or closes the
      // notification. Earlier there were an onclose function on the notification object, but this seems
      // to be deprecated in most browsers now.
      // If you want to fetch the notification that was created here, you must use code like this and pick
      // out the proper registration:
      // self.registration.getNotifications().then(function(notifications) { for (var i in notifications) { console.log(notifications[i])} );

      // So what we do here is actually just to register that the notification was delivered to the user.
      function(event) {
        callNotificationStatusService.call(this,"event.notification.delivered", data.notificationId, data.securityToken);
      }
    )
  );
});


self.addEventListener('notificationclick', function(event) {
  // console.log('[Service Worker:notificationclick] notification clicked');
  // console.log(event);
  // console.log('[Service Worker:notificationclick] event data', event.notification);
  // console.log('[Service Worker:notificationclick] event action', event.action);

  // Mark the notification as clicked server side.
  callNotificationStatusService.call(this, "event.notification.clicked", event.notification.data.notificationId, event.notification.data.securityToken);

  // Close the event notification
  event.notification.close();

  // Open a window with the url if there is an url.
  if (event.notification.data.url) {
    // console.log('[Service Worker:notificationclick] found url ', event.notification.data.url);
    event.waitUntil(createUrlHandlerPromise.call(this, event.notification.data.url));
  }
})
