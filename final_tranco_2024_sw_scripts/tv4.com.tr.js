/** Again import google libraries */

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

importScripts("https://www.gstatic.com/firebasejs/7.15.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.15.1/firebase-messaging.js"
);

var config = {
    apiKey: "AIzaSyCrfHKTydUTWn46TBrtRdRWZ9uuPig2YKs",
    authDomain: "tv4-push.firebaseapp.com",
    projectId: "tv4-push",
    storageBucket: "tv4-push.appspot.com",
    messagingSenderId: "109579686435",
    appId: "1:109579686435:web:ad0d8b50e00b2a5d2bd796",
    measurementId: "G-BV6WW2RZF8"
};

firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
	//console.log("back-payload:",payload)
    return showNotification(payload.data);
});

self.addEventListener('message', function (event) {
	//console.log("message",event.data.data);
    return showNotification(event.data.data);
});
self.addEventListener("notificationclick", function (event) {

	//console.log("current event",event.action);
	//console.log("event it self:",event);
  if (event.action === "close") {
    return closeNotifications();
  }

  event.notification.close();
  if (
    !event.notification ||
    !event.notification.data
  ){
	  //console.log("hata");
    return;
  }
	//console.log("trying to oNC");
  return event.waitUntil(onNotificationClicked(event));
});
function onNotificationClicked(event) {
	//console.log("onNotificationClicked Func:", event.notification.data)
  if (clients.openWindow) {
    if (event.action === "open") {
		//console.log("open event triggered");
    return clients.openWindow(event.notification.data.FCM_MSG.data.payload);

    
    } else if (event.action === "TwoClickButton") {
      console.log("TwoClickButton", event.notification.data);
      return;
    } else {
      console.log("TwoClickButton", event.notification.data);
      return;
    }
  }
  return;
}
 // if (self.Notification.permission === "granted") {
   // const notificationObject = {
     // body: "Click here to view your messages.",
     // data: { url: "https://www.gunes.com/" },
     // // data: { url: 'http://example.com' },
   // };
   // self.registration.showNotification(
     // "You've got messages2!",
     // notificationObject
   // );
 // }







function showNotification(notification) {
    if (notification == null)
        return;
    recentNotif = notification;

    var title = notification.Title;
    var body = notification.Body;
    var iconUrl = notification.Logo;
    //var tag = notification.Tag;
    var notificationOptionActions = [
        { action: 'open', title: 'Görüntüle!' }
    ];

    if (notification.ButtonType == "1") {
        notificationOptionActions = [
            {
                action: "OneClickButton",
                title: notification.FirstButtonTitle,
            }
        ];
    }
    else if (notification.ButtonType == "2") {
        notificationOptionActions = [
            {
                action: "OneClickButton",
                title: notification.FirstButtonTitle
            },
            {
                action: 'TwoClickButton',
                title: notification.SecondButtonTitle
            }
        ];
    }

    var notificationOptionImage = "";
    if (notification.LogoType == "2") {
        notificationOptionImage = notification.Image;
    }

    if (HIDE_NOTIFICATION_AFTER) {
        setTimeout(closeNotifications, HIDE_NOTIFICATION_AFTER * 1000);
    }

    return self.registration.showNotification(title, {
        body: body,
        icon: iconUrl,
        tag: tag,
        image: notificationOptionImage,
        data: { payload: notification },
        actions: notificationOptionActions
    })
        .then(function () {
            return delay(Math.ceil(Math.random() * 19900))
        });
}


function closeNotifications() {
    self.registration.getNotifications().then(function (notifications) {
        for (var i = 0; i < notifications.length; ++i) {
            notifications[i].close();
        }
    });
}
