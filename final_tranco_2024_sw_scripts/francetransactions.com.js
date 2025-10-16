'use strict';

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
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    
	  if(event.data){
	    var payload = JSON.parse(event.data.text());
	    console.log(payload); 
	    event.waitUntil(
  	    self.registration.showNotification(payload.title, {
  			 requireInteraction: true,
    	   body: payload.body,
     	   icon: payload.icon,
     	   badge: payload.badge,
  				image:payload.image, 
     	   tag: payload.tag,
     	   data: {url: payload.url,
                id: payload.id}
      	}).then(function(event) {
      		if(payload.id === '777') 
      		{
      			setTimeout(function(){ event.notification.close();}, 3000);
      		}
    		})
    	);
   	}
});
 
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');
  var data = event.notification.data
  event.notification.close();
  event.waitUntil(
    clients.openWindow(data.url)
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker] Pushsubscriptionchange pris en compte');
  const applicationServerPublicKey = localStorage.getItem('applicationServerPublicKey');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(subscription) {
	    const key = subscription.getKey('p256dh');
  	  const token = subscription.getKey('auth');
   	 	const contentEncoding = (self.registration.PushManager.supportedContentEncodings || ['aesgcm'])[0];
    	var webpushid = window.localStorage.getItem('webpushid');
		  console.log('[Service Worker] Appel push_subscription');
    	fetch('https://push.francetransactions.com/webpush/push_subscription.php', {
      	method: 'PUT',
      	body: JSON.stringify({
        	webpushuid: webpushid,		
        	endpoint: subscription.endpoint,
        	publicKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : null,
        	authToken: token ? btoa(String.fromCharCode.apply(null, new Uint8Array(token))) : null,
        	contentEncoding,
      	}),
    	})
    	.then(function(response) {
    		return response.text();
			})
			.then(function(mydata) {
	    	window.localStorage.setItem('webpushid', mydata);   	
    	})
    	.catch(error => console.warn("Erreur : " + error)); 	
    })
  );
});
