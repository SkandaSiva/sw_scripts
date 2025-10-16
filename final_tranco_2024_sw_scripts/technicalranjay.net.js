importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyAzH5Ze_im6kopUJd9qI8ZaTcPKgnTp3f8",
	authDomain: "aplu-c.firebaseapp.com",
	projectId: "aplu-c",
	storageBucket: "aplu-c.appspot.com",
	messagingSenderId: "916227774633",
	appId: "1:916227774633:web:1d1cb0ea978a093cd8f1b8"
});

function notificationClickAlert(notificationId){
    fetch("https://push.aplu.io/post-tes-data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
         body: JSON.stringify({'fcmMessageId':notificationId})
    }).then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok.')
        }
        return response.json();
    }).then(function(data) {
        console.log('Successfully sent data to API:', data)
    }).catch(function(error) {
        console.error('Failed to send data to API:', error)
    })
}

self.addEventListener('notificationclick', function(event) {
    const notification = event.notification;
    const urls = event.notification.data.FCM_MSG.notification.data.url;
    const url = typeof(urls) == 'string' ? urls : urls[0];
    let url2 = typeof(urls) == 'object' ? urls[1] : urls[0];
    const notifyIdd = event.notification.data.FCM_MSG.notification.data.notification_id;
    if (event.action === 'open_url') {
        event.waitUntil(
            notificationClickAlert(notifyIdd),
            clients.openWindow(url)
        );
    }
    else if(event.action === 'open_url_2')
    {
        event.waitUntil(
            notificationClickAlert(notifyIdd),
            clients.openWindow(url2)
        );
    }
    else if(event.action === 'close')
    {
        notification.close();
    }else{
        event.waitUntil(
            notificationClickAlert(notifyIdd),
            clients.openWindow(url)
        );
    }
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log("Message received.", payload);
    const title = "You have a notification";
    const options = {
        body: "Please check notificaiton message .",
        icon: "/firebase-logo.png",
    };
    return self.registration.showNotification(
        title,
        options,
    );
    });

    