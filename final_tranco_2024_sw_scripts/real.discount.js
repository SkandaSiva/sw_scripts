'use strict';

/* eslint-enable max-len */

self.addEventListener('install', function(event) {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating.');
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  const pushData = event.data.text();
  console.log(`[Service Worker] Push received this data - "${pushData}"`);
  let data, title, body, icon, click_action, image;
  try {
    data = JSON.parse(pushData);
    title = data.title;
    body = data.body;
    click_action = data.link + '?utm_source=webpush&utm_medium=social&utm_campaign=webpush' ;
    image = data.image;
    icon = "https://app.real.discount/img/one.jpg";
    console.log(`Link is - "${data}"`);
  } catch(e) {
    title = "Untitled";
    click_action = "https://app.real.discount/free-courses/"  ;
    body = pushData;
  }
  const options = {
    body: body,
    icon: icon,
    image : image,
    renotify: true,
    tag: click_action,
    data: {
      click_action
    },
    actions: [
      {
        action: 'get-coupon',
        title: 'Get Coupon',
        icon: '/images/demos/action-1-128x128.png'
      }
    ]
  
  };
  console.log(title, options);

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  var redirect_url = event.notification.data.click_action;
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window"
      })
      .then(function(clientList) {
        console.log(clientList);
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(redirect_url);
        }
      })
  );
});