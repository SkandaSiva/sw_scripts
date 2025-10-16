importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.3/firebase-messaging.js');
importScripts("https://stc.aeplcdn.com/staticminv2/js/notification/customtracking-1e96b6cb9a.js");

var landingUrl = "https://www.carwale.com/",    
	defaulTitle = "CarWale"
	subscriptionReqSent = false;

//need for manifest file
self.addEventListener('fetch', function (event) {
});

self.addEventListener('install', function (event) {    
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {    
	event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
	var notificationData = event.data.json();
	var title = notificationData.data.title;
	var icon = notificationData.data.smallPicUrl ? notificationData.data.smallPicUrl.replace("http:", "https:") : "";
	
	var options = {
		body: notificationData.data.description,
		image: notificationData.data.largePicUrl ? notificationData.data.largePicUrl.replace("http:", "https:") : "",
		vibrate: [300, 100, 400], // Vibrate 300ms, pause 100ms, then vibrate 400ms
		data: notificationData.data,
		actions: [
			{
				action: 'readMore', title: 'Read More'
			}
		],
		badge: "https://imgd.aeplcdn.com/0x0/cw/design15/cw-logo.ico?v1&sa=D&source=hangouts&ust=1561026940992000&usg=AFQjCNHGNNEBVVinu8pconUmQSi1zgywOQ"
	}
	if (icon && icon != "") {
		options.icon = icon
	}

	event.waitUntil(
		Promise.all([
			self.registration.showNotification(title, options),
			fetch(customTracking.getTrackingUrl("WebNotification", "NotificationImpression", customTracking.getEventLabel(notificationData.data.title, notificationData.data.alertId, notificationData.data.alertTypeId)),
			{
				credentials: 'same-origin'
			})
		])
	);
	
});


self.addEventListener('notificationclick', function (event) {
	event.notification.close();

	var notificationData = event.notification.data;    
	let clickResponsePromise = Promise.resolve();
	if (notificationData && notificationData.detailUrl) {
		clickResponsePromise = clients.openWindow(notificationData.detailUrl);
	}

	event.waitUntil(
	  Promise.all([
		clickResponsePromise,
		fetch(customTracking.getTrackingUrl("WebNotification", "NotificationClick", customTracking.getEventLabel(notificationData.title, notificationData.alertId, notificationData.alertTypeId)),
			{
				credentials: 'same-origin'
			})
	  ])
	);
});

self.addEventListener('notificationclose', function (event) {
	var notificationData = event.notification.data;
	event.waitUntil(
	   Promise.all([
		 fetch(customTracking.getTrackingUrl("WebNotification", "NotificationClose", customTracking.getEventLabel(notificationData.title, notificationData.alertId, notificationData.alertTypeId)),
			 {
				 credentials: 'same-origin'
			 })
	   ])
	 );

});

// Push Notification Subscription handling for AMP pages

const WorkerMessengerCommand = {
	/*
	  Used to request the current subscription state.
	 */
	AMP_SUBSCRIPTION_STATE: 'amp-web-push-subscription-state',
	/*
	  Used to request the service worker to subscribe the user to push.
	  Notification permissions are already granted at this point.
	 */
	AMP_SUBSCRIBE: 'amp-web-push-subscribe',
	/*
	  Used to unsusbcribe the user from push.
	 */
	AMP_UNSUBSCRIBE: 'amp-web-push-unsubscribe',
};
self.addEventListener('message', event => {

	/*
	  Messages sent from amp-web-push have the format:
	  - command: A string describing the message topic (e.g.
		'amp-web-push-subscribe')
	  - payload: An optional JavaScript object containing extra data relevant to
		the command.
	 */

	const { command } = event.data;

	switch (command) {
		case WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE:
			onMessageReceivedSubscriptionState();
			break;
		case WorkerMessengerCommand.AMP_SUBSCRIBE:
			onMessageReceivedSubscribe();
			break;
		case WorkerMessengerCommand.AMP_UNSUBSCRIBE:
			onMessageReceivedUnsubscribe();
			break;
	}
});


function onMessageReceivedSubscribe() {
	if(firebase && firebase.apps.length <= 0)
	{
		var _FCMconfig = {
			messagingSenderId: '533502385610'
		};
		firebase.initializeApp(_FCMconfig);
	}

	FCMmessaging = firebase.messaging();
	FCMmessaging.getToken()
	.then(function (fcmDbToken) { 
		if(!subscriptionReqSent)
		{
			saveTokenDetails(fcmDbToken,true);
			broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIBE, null);
		}
	})
	.catch(function (err) { });
	
};

/**
  Broadcasts a single boolean describing whether the user is subscribed.
 */
function onMessageReceivedSubscriptionState() {
	let retrievedPushSubscription = null;
	self.registration.pushManager
		.getSubscription()
		.then(pushSubscription => {
			retrievedPushSubscription = pushSubscription;
			if (!pushSubscription) {
				return null;
			} else {
				return self.registration.pushManager.permissionState(
					pushSubscription.options
				);
			}
		})
		.then(permissionStateOrNull => {
			if (permissionStateOrNull == null) {
				broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE, false);
			} else {
				const isSubscribed =
					!!retrievedPushSubscription && permissionStateOrNull === 'granted';
				broadcastReply(
					WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE,
					isSubscribed
				);
			}
		});
};
function onMessageReceivedUnsubscribe() {
	self.registration.pushManager
		.getSubscription()
		.then(subscription => subscription.unsubscribe())
		.then(() => {
			// OPTIONALLY IMPLEMENT: Forward the unsubscription to your server here
			broadcastReply(WorkerMessengerCommand.AMP_UNSUBSCRIBE, null);
		});
	fetch(customTracking.getTrackingUrl("WebNotification", "AmpConfirmationPopupBlockClick", "platform=Amp|page=NewsDetails"),
	{
		credentials: 'same-origin'
	});
};

function broadcastReply(command, payload) {
	self.clients.matchAll().then(clients => {
		for (let i = 0; i < clients.length; i++) {
			const client = clients[i];
			client./*OK*/ postMessage({
				command,
				payload,
			});
		}
	});
};

function getRegistrationUrl(isRegisteredToFcm, fcmToken) {
	var os = "&os=43";
	var gcmId = "?gcmid=" + fcmToken;
	var subsMasterId = isRegisteredToFcm ? "&subsmasterid=1" : "";
	return (
	  "/api/MobileAppAlert/GetManageMobileAppAlerts/" +
	  gcmId +
	  os +
	  subsMasterId
	);
  };

function saveTokenDetails(fcmToken, isRegisteredToFcm) {
	subscriptionReqSent = true;
	fetch(getRegistrationUrl(isRegisteredToFcm, fcmToken), {
		method: 'GET',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(function(){
		subscriptionReqSent = false;
		fetch(customTracking.getTrackingUrl("WebNotification", "SubscriptionViaAMP", "platform=Amp|page=NewsDetails"),
		{
			credentials: 'same-origin'
		});
	}).catch(function(){
		// add tracking here
		subscriptionReqSent = false;
	});
};