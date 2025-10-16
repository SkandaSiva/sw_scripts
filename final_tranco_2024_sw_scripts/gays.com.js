importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js');

(function(supported){
    if(!supported) {
        console.log('[SW] BROWSER DOES NOT SUPPORT WEB PUSH');
        return;
    }
    
    firebase.initializeApp({
        apiKey: "AIzaSyC_0skVZ66t7Rac5aAyHkFawqsmm1sa6Eo",
        authDomain: "gaudi-app-9fc37.firebaseapp.com",
        databaseURL: "https://gaudi-app-9fc37.firebaseio.com",
        projectId: "gaudi-app-9fc37",
        storageBucket: "gaudi-app-9fc37.appspot.com",
        messagingSenderId: "253473706525",
        appId: "1:253473706525:web:304c06cd8cb55009cd6cf4",
        measurementId: "G-6TVF0J4085"
    });

    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[SW] Received background message.');
    });
})(firebase.messaging.isSupported());
