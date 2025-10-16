'use strict';

const applicationServerPublicKey = 'BB-j_uX5ojK8wwYf4vYVtHayXrWfghe0Nydv6AjskmJ3wwzPBg2h0gpOaoVmynxCylicEXjL9Sb_Mgp3MbQ82tw';

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

self.addEventListener('fetch', function(event) {});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});

self.addEventListener('push', function(event) {
  if (event.data) {
    var data = event.data.json();
    const options = {
      badge: '/images/badge-72x72.png',
      body: data.body,
      data: data.country == 'us' ? 'https://flixable.com/?utm_source=' + data.country + '&utm_medium=none&utm_campaign=push-notifications#filterContainer' : 'https://' + data.country + '.flixable.com/?utm_source=' + data.country + '&utm_medium=none&utm_campaign=push-notifications#filterContainer',
      icon: '/images/symbol-512x512.png'
    };
    self.registration.showNotification(data.title, options);
  }
});
