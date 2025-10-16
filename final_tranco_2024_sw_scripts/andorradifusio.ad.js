importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.9.1/firebase-messaging.js')

var config = {
    messagingSenderId: "626447345504",
};
firebase.initializeApp(config);

const messaging = firebase.messaging()
messaging.setBackgroundMessageHandler(function (payload) {
    const notificationTitle = 'Andorra Difusió';
    const notificationOptions = {
        body: 'Data Message body',
        icon: 'https://www.andorradifusio.ad/content/template/images/favicon/apple-icon-57x57.png'
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
});