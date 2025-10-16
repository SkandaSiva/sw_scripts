'use strict';

const applicationServerPublicKey = 'BFC35DKy5in2qVn8AvlpeKm1bxieUQpyt0AAmnViVKkV4mkFjXMbItn8oZ2HUawoQV9HJ729N96mI20FofKJjCg';

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
    var title = '';
    const options = {
        body: '',
        icon: '',
        badge: '',
        data: {
            url: '',
        },
    };

    if (event.data) {
        const dataJson = event.data.json();
        title = dataJson.title;
        options.body = dataJson.body;
        options.icon = dataJson.icon;
        options.data.url = dataJson.link;
    }

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); 
    if (event.notification.data && event.notification.data.url) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

self.addEventListener('pushsubscriptionchange', function(event) {
    var post = function post(url, payload, callback) {
        var err = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : console.error;
        var request = new XMLHttpRequest();
        request.open('POST', url, true);
      
        request.onload = function () {
          return callback(request.responseText);
        };
      
        request.onerror = function () {
          return err(request);
        };
      
        request.send(JSON.stringify(payload));
    };

    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    event.waitUntil(
        self.registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function(newSubscription) {
            subscription_info = JSON.stringify(subscription.toJSON());
            pData = {
                'infos': subscription_info
            };
            post('/api/push/', pData, function(response) {
                console.log(response);
            });
            console.log('[Service Worker] New subscription: ', newSubscription);
        })
    );


});