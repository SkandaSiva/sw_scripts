
'use strict';

const applicationServerPublicKey = 'BP0CCc_JNm7jGxXLXhDlJl0uVGCWdMeKltxaOPzAQznhKJS46gZQvG1W6VHlOg08DTBnZ07Ax14RPB1abFboA1g';


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

self.addEventListener('push', function (event) {
  
  console.log('[Service Worker] Push Received.');
  //console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  var jsonData = event.data.json();
  if(jsonData.url == ''){
    jsonData.url = 'https://www.izigsm.pl/produkty-webpush.html';
  }
  const title = jsonData.title;
  const options = {
    body: jsonData.body,
    icon: jsonData.icon,
    badge: 'https://www.izigsm.pl/webpush/badge.png',
    data: {
      url: jsonData.url
    }
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

self.addEventListener('pushsubscriptionchange', function (event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
      .then(function (newSubscription) {
        // TODO: Send to application server
        console.log('[Service Worker] New subscription: ', newSubscription);
      })
  );
});
