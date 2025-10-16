importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.11.1/firebase-messaging.js');


firebase.initializeApp({
    'messagingSenderId': '1049417736738'
});

console.log('starting init firebase');
// messages.
const fb_messaging = firebase.messaging();


// Shows a notification
function showNotification(payload) {
    console.log(payload);
    var notificationTitle='';
    var notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
        image: payload.notification.image,
        click_action: payload.notification.click_action,
        data:{
            click_action: payload.notification.click_action
        }
    };
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
}

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
fb_messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    return showNotification(payload);
});



// Forces a notification
self.addEventListener('message', function (evt) {
    console.log('addEventListener message run!!!');
    console.log(evt);
    if(!evt.data.eventType){
        console.log('real message');
        console.log(evt.data);
        evt.waitUntil(showNotification(evt.data));
    }
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');
    console.log(event);
    console.log(event.notification.data);
    console.log(event.notification.data.click_action);
    event.waitUntil(
        clients.openWindow(event.notification.data.click_action)
    );
    event.notification.close();
});
// The user has clicked on the notification ...
// self.addEventListener('notificationclick', function(event) {
// });



