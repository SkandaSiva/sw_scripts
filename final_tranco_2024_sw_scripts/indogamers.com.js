importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");
const firebaseConfig = {
    apiKey: "AIzaSyARt5sbdBts7QpB1eg-BsFdbYgQR4V4X6k",
    authDomain: "indogamers-12ee6.firebaseapp.com",
    projectId: "indogamers-12ee6",
    storageBucket: "indogamers-12ee6.appspot.com",
    messagingSenderId: "277478102257",
    appId: "1:277478102257:web:444011b6596e1924380550",
    measurementId: "G-8GNS7H5LZW"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Data Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    // console.log(payload);
    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
        icon: payload.data.image,
        onclick: payload.data.action,
        data: {
            action: payload.data.action,
            click: payload.data.click_action
        }
    };

    return self.registration.showNotification(notificationTitle,
                                              notificationOptions);
});


self.addEventListener("notificationclick", function(e) {
    // console.log(e);
    var notification = e.notification;
    var action = e.notification.data.action;

    // if (action === 'close') {
    //   notification.close();
    // } else {
    clients.openWindow(action);
    // window.open(action)
    notification.close();
    // }
});