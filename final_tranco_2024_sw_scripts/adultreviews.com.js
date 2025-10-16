var applicationServerPublicKey = 'BHQCCJoWY8AHVgOniumdOVBkdGy--_H_f1ECnhQlCQ8yuJ9JkxbP4M6OKX2eJ-CaISyjR2rqcXa_8uZRwR1Qyto';
var host = "https://push.xxxlists.net";

function urlB64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

self.addEventListener('push', function (event) {
  var dataObj = JSON.parse(event.data.text());  
  var title = ("title" in dataObj ? dataObj.title : "Web Push");
  var options = {
    body: ("message" in dataObj ? dataObj.message : "New Notification"),
    icon: ("icon"  in dataObj ? dataObj.icon : host + "/icon-512x512.png"),
    badge: ("badge" in dataObj ? dataObj.badge : host + "/badge-128x128.png"),
    data: { 
      url: ("url" in dataObj ? dataObj.url : host)
    }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  var url = (event.notification.data && event.notification.data.url) ? event.notification.data.url : host;
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});

self.addEventListener('pushsubscriptionchange', function (event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  }).then(function (newSubscription) {
    // TODO: Send to application server
    console.log('[Service Worker] New subscription: ', newSubscription);
  }));
});
