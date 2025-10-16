// The service worker running in background to receive the incoming push notifications
// WARN: once you change anything here, you shd update RV in web-push.js MANUALLY!

var NotifUrl = '/';

self.addEventListener('push', function(event) {
		event.waitUntil(
			registration.pushManager.getSubscription().then(function(subscription) {
				var endpoint;
        if (/fcm\.google/.test(subscription.endpoint))
          endpoint = 'https://fcm.googleapis.com/fcm/send/';
        else if (/google/.test(subscription.endpoint))
					endpoint = 'https://android.googleapis.com/gcm/send/';
				else if (/mozilla/.test(subscription.endpoint))
					endpoint = 'https://updates.push.services.mozilla.com/wpush/v1/'; // TODO: could change to v2, huh? Need a simple test for that...
				//console.log("FULL_EP " + subscription.endpoint + " var ep " + endpoint + " EP " + subscription.endpoint.split(endpoint)[1]); //here we should do .ajax.then() or .waitUntil or smth like that.
				var RegID = subscription.endpoint.split(endpoint)[1];
//TODO: /ajax... ?
			return fetch('/ajax_getpushmessage?token=' + encodeURIComponent(RegID)).then(function(response) {
				// Examine the text in the response
				return response.json().then(function(data) {
					var title = data.title;
					var body = data.body;
					var icon = data.icon; //TODO: логотип здесь должен бы быть
					if (data.url) {
						NotifUrl = data.url;
					}

					if (body && title) {
						return self.registration.showNotification(title, {
							icon: icon,
							body: body
						});
					} else {
						return;
					}
				});
			});
		})
	)
});


// The user has clicked on the notification ...
self.addEventListener('notificationclick', function(event) {
  // Android doesn't close the notification when you click on it
	console.log(event.notification);
  event.notification.close();
  // This looks to see if the current is already open and  focuses if it is
  event.waitUntil(
    clients.matchAll({
      type: "window"
    })
    .then(function(clientList) {
			return clients.openWindow(NotifUrl);
    })
  );
});
