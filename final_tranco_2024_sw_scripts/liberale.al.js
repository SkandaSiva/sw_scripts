'use strict';
const applicationServerPublicKey = 'BPh1BHPogTcijQdl-nXwZsjnZlKfn0Ya1RGNOtM8wSYaRogn7A6iwigtvLC7kAKyc2NxtFFWZRmFB4-hpqoyBM0';
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
  var json=event.data.json();
  var title = json.titull;
  const options = {
    body: json.tekst,
    icon: json.icon,
    badge: json.badge,
    image: json.image,
    requireInteraction: true,
    data: {
        url: json.link
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});


function updateSubscriptionOnServer(subscription) {
  console.log(subscription);
    return fetch('https://push.mediadesk.al/go/', {
      method: 'POST',
      body: JSON.stringify(subscription)
    });
}

self.addEventListener('pushsubscriptionchange', function(event) {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      updateSubscriptionOnServer(newSubscription);
    })
  );
});

self.addEventListener('install', function(event) {
  // The promise that skipWaiting() returns can be safely ignored.
  self.skipWaiting();
  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
});