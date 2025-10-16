importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js');

(function(supported){
    if(!supported) {
        console.log('[SW] BROWSER DOES NOT SUPPORT WEB PUSH');
        return;
    }
    
    firebase.initializeApp({
        apiKey: "AIzaSyB1NB1Q6rQHIO3p5r3g2KmYtfukm94OokI",
        authDomain: "fet-app.firebaseapp.com",
        databaseURL: "https://fet-app.firebaseio.com",
        projectId: "fet-app",
        storageBucket: "fet-app.appspot.com",
        messagingSenderId: "439157693274",
        appId: "1:439157693274:web:f1ee2bba6902bcaf757163",
        measurementId: "G-NXZW62TGVG"
    });

    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[SW] Received background message.');
    });
})(firebase.messaging.isSupported());
