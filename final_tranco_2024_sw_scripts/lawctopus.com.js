importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

const firebaseConfig = {
	apiKey: "AIzaSyDuZmyLLodeOxZ6nJzNt6IkFZKKLSQdzCc",
	authDomain: "lawctopus-web.firebaseapp.com",
	projectId: "lawctopus-web",
	storageBucket: "lawctopus-web.appspot.com",
	messagingSenderId: "782186592511",
	appId: "1:782186592511:web:391e75a095c55592b7b4ca"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Messaging
const messaging = firebase.messaging();

self.addEventListener('notificationclick', function(event) {

	event.notification.close();

	//event.action
	return clients.openWindow(event.notification.data.url);
});

// Handling background push notifications in service worker
self.addEventListener('push', (event) => {
    
    const payload = event.data.json();
    
    acknowledgeNotification(payload.data.campaign_id, messaging);

    const notificationOptions = {
        body: payload.data.body,
        image: payload.data.image,
        icon: payload.data.icon,
        data: {
            url: payload.data.destination
        }
    };

    event.waitUntil(
        self.registration.showNotification(payload.data.title, notificationOptions)
    );
});

// messaging.onBackgroundMessage((payload) => {

// 	acknowledgeNotification(payload.data.campaign_id);
	
// 	// notification options
// 	const notificationOptions = {
// 		body: payload.data.body,
// 		image: payload.data.image,
// 		icon: payload.data.icon,
// 		data: {
// 			url: payload.data.destination
// 		}
// 	};
	
// 	// show notification
// 	return self.registration.showNotification(payload.data.title, notificationOptions);
// });

function getFirebaseToken(messaging) {
    messaging.getToken({
        vapidKey: 'BITYknAGMa3-G8q1tc_zQPGk8mPOUNIrxsGeweKhiUh8L0FDnDDtKvLwtG5dWbzsSmi56G02JQgwNEkjnIM2Wu4'
    }).then(currentToken => {
        if (currentToken) {
    		return currentToken;
    	} 
    }).catch(err => {
    });
    return "";
}
    	
function acknowledgeNotification(campaignId, messaging) {
    
    // Retrieve the saved token from localStorage
    let savedToken = localStorage.getItem('fcm_token');
    
    if (!savedToken) {
        savedToken = getFirebaseToken(messaging); 
    }
    
	var formdata = new FormData();
	formdata.append("request_action", "acknowledge_notification");
	formdata.append("campaign_id", campaignId);
	formdata.append("action", "received");
	formdata.append("fcm_token", savedToken);
	
	var requestOptions = {
		method: 'POST',
		body: formdata
	};

	fetch("https://push.lawctopus.com/v3/api/campaigns", requestOptions)
		.then(response => response.text())
		.catch(error => console.log('error', error));
}