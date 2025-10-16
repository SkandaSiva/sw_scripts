importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js');

(function(supported){
    if(!supported) {
        console.log('[SW] BROWSER DOES NOT SUPPORT WEB PUSH');
        return;
    }
    
    firebase.initializeApp({
        apiKey: "AIzaSyCjmA8RhrWEAJD0uWYSAUYij6BirXhMj2M",
        authDomain: "happy-706ae.firebaseapp.com",
        databaseURL: "https://happy-706ae.firebaseio.com",
        projectId: "happy-706ae",
        storageBucket: "happy-706ae.appspot.com",
        messagingSenderId: "644432654266",
        appId: "1:644432654266:web:e46e67306ad58252b5f783",
        measurementId: "G-QLC36LCEZV"
    });

    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[SW] Received background message.');
    });
})(firebase.messaging.isSupported());
