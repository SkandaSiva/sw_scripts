importScripts('https://www.gstatic.com/firebasejs/4.13.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.13.0/firebase-messaging.js');

//onlinemahjong.games
firebase.initializeApp(
{
	
    "messagingSenderId": "281170523694"
});

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(_payload)
{
    var notificationTitle   = _payload.data.title;
    var notificationOptions =
    {
        body: _payload.data.body,
        icon: _payload.data.icon,
        data: _payload.data.click_action
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('install', function(event) {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activating.');
});