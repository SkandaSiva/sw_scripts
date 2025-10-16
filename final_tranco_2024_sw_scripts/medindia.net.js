'use strict';

console.log('Medindia Service Worker is started');
var _medPush = {
    hash: 'fa471fa4f0f3e512cf398c236df7dcc0',
    serverUrl: 'https://www.medindia.net/',
    defaultIcon: 'https://www.medindia.net/push-service/images/logo_192x192.png',
	source:"MedIndia"
}

console.log('Started', self);

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
	  console.log('Activated', event);
});

var splitEndPointSubscription =  function (subscriptionDetails) {
    var endpointURL = 'https://android.googleapis.com/gcm/send/',
    endpoint = subscriptionDetails.endpoint,
    subscriptionId;

    if(endpoint.indexOf(endpointURL) === 0) {
       return subscriptionId = endpoint.replace(endpointURL , '');
    }
    return subscriptionDetails.subscriptionId;

};


function syncMedChromeEncryptionKeys() {
    self.registration.pushManager.getSubscription()
    .then(function(subscription) {
        if (subscription) {
            //var subscriptionId = splitEndPointSubscription(subscription);
			var subscriptionId = subscription.endpoint;
            var subscriptionJson = JSON.stringify(subscription);
            var subscriptionObj = JSON.parse(subscriptionJson);
            if(subscriptionObj.keys.auth && subscriptionObj.keys.p256dh) {
                fetch(_medPush.serverUrl + 'push-service/syncMedChromeEncryptionKey.asp?hash='+ _medPush.hash + '&subscriptionId=' +
            subscriptionId+'&subscription='+subscriptionId);
				console.log('Medindia Service Worker is added');
            }
        }
    }).
    catch(function() {
   				console.log('Error Occured');
    });
}
syncMedChromeEncryptionKeys();

self.addEventListener('push', function(event) {
     event.waitUntil(
        self.registration.pushManager.getSubscription()
        .then(function(subscription) {
            //var subscriptionId = splitEndPointSubscription(subscription);
			
			var subscriptionId = subscription.endpoint.replace('https://fcm.googleapis.com/fcm/send/','');

					console.log(subscriptionId);

            if(event.data) {
                var payloadObject = event.data.json();

                var notificationDetails = {};

                notificationDetails.title = payloadObject.title;
                notificationDetails.message = payloadObject.message;
                notificationDetails.icon = payloadObject.icon_url + '?notificationURL=' + encodeURIComponent(payloadObject.url);
                notificationDetails.notificationTag = payloadObject.tag;
                notificationDetails.url = payloadObject.url;
                notificationDetails.image  = payloadObject.image_url+ '?notificationURL=' + encodeURIComponent(payloadObject.url);
                notificationDetails.requireInteraction = true;
                if(payloadObject.hasOwnProperty('ri_flag') && payloadObject.ri_flag === false) {
                    notificationDetails.requireInteraction = false;
                }

                var trackDeliveryURL = '';

                trackDeliveryURL =  _medPush.serverUrl + 'push-service/trackDelivery.asp' +
                '?subscriptionId=' + subscriptionId + '&subscriberId=' + payloadObject.subscriber_id + 
                '&notificationTag=' + notificationDetails.notificationTag +
                '&hash=' + _medPush.hash + '&medium=payload';

                fetch(trackDeliveryURL).
                catch(function(err) {
                });

                return self.registration.showNotification(notificationDetails.title, {
                    body: notificationDetails.message,
                    icon: notificationDetails.icon,
					image: notificationDetails.image,
                    requireInteraction: notificationDetails.requireInteraction,
                    tag: notificationDetails.notificationTag
                });
            }
            else {
                return fetch(_medPush.serverUrl + 'push-service/getMessage.asp').then(function(response) {
                    var notificationDetails = {};

                    if (response.status !== 200) {
                        throw new Error();
                    }

                    return response.json().then(function(data) {
                        var trackDeliveryURL = '';

                        if (data.error || !data.notification) {
                            console.error('The API returned an error.', data.error);
                            throw new Error();
                        }

                        notificationDetails.title = data.notification.title;
                        notificationDetails.message = data.notification.message;
                        notificationDetails.icon = data.notification.icon + '?notificationURL=' + encodeURIComponent(data.notification.url);
                        notificationDetails.notificationTag = data.notification.tag;
                        notificationDetails.url = data.notification.url;
						notificationDetails.image = data.notification.image  + '?notificationURL=' + encodeURIComponent(data.notification.url);
                        notificationDetails.requireInteraction = true;
						console.log(notificationDetails.title);
						
                        if(data.notification.hasOwnProperty('requireInteraction') && data.notification.requireInteraction === false) {
                            notificationDetails.requireInteraction = false;
                        }

						//console.log(subscriptionId);
						
                        trackDeliveryURL =  _medPush.serverUrl + 'push-service/trackDelivery.asp' +
                        '?subscriptionId=' + subscriptionId +
                        '&notificationTag=' + notificationDetails.notificationTag +
                        '&hash=' + _medPush.hash + '&medium=fetch&track=push';;

                        fetch(trackDeliveryURL).
                        catch(function(err) {
                        });
						
                        return self.registration.showNotification(notificationDetails.title, {
                            body: notificationDetails.message,
                            icon: notificationDetails.icon,
                            image: notificationDetails.image,
                            requireInteraction: notificationDetails.requireInteraction,
                            tag: notificationDetails.url + notificationDetails.message + notificationDetails.icon
							//notificationDetails.notificationTag,
							//data: notificationDetails.url
                        });
                    });
                }).catch(function(err) {
                    var title = 'www.medindia.net';
                    var message = 'This site has been updated in the background.';
                    var icon = _medPush.defaultIcon + '?notificationURL=' + encodeURIComponent('https://www.medindia.net/?hash='+_medPush.hash);
                    var notificationTag = 'notification-error';

                    var logSwErrorUrl =  _medPush.serverUrl + 'push-service/logServiceWorkerError.asp' +
                        '?subscriptionId=' + subscriptionId +
                        '&error=' + err.toString() +
                        '&hash=' + _medPush.hash;

                    fetch(logSwErrorUrl);

                    return self.registration.showNotification(title, {
                        body: message,
                        icon: icon,
                        tag: notificationTag
                    });
                });
            }  
        })
    );
});


self.addEventListener('notificationclick', function(event) {

    self.registration.pushManager.getSubscription()
    .then(function(subscription) {
        //var subscriptionId = splitEndPointSubscription(subscription),
		
		//var subscriptionId = subscription.endpoint;
		var subscriptionId = subscription.endpoint.replace('https://fcm.googleapis.com/fcm/send/','');
		//console.log('click' + ' ' + subscriptionId);
		
		var clickDeliveryURL='';
		
        clickDeliveryURL =  _medPush.serverUrl + 'push-service/trackClick.asp' +
        '?subscriptionId=' + subscriptionId +
        '&notificationTag=' + event.notification.tag +
        '&hash=' + _medPush.hash  + '&track=click';

        // send update to server
		//console.log(clickDeliveryURL);
		
        fetch(clickDeliveryURL).
        catch(function(err) {
        });
    });

    event.notification.close();

    function notificationURL () {
        var query = event.notification.icon,
        url,
        queryString;

        if(query.indexOf('?') > -1) {
            queryString = query.substring(query.indexOf('?'));
            url = decodeURIComponent(queryString.split('=')[1]);
        }
        else {
            console.error('failed to extract url value');
            url = '';
        }
        return url;
    }

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
        clients.matchAll({
            type: "window"
        })
        .then(function(clientList) {
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url === notificationURL() && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(notificationURL());
            }
        })
    );
});

console.log('Service Worker is ended');