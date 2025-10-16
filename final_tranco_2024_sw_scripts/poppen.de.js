importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.1/firebase-messaging.js');

(function(supported){
    if(!supported) {
        console.log('[SW] BROWSER DOES NOT SUPPORT WEB PUSH');
        return;
    }
    
    firebase.initializeApp({
        apiKey: "AIzaSyDAmLNC4ab2eCmDhjBDfT73aB61xQKFOdM",
        authDomain: "popcorn-dating.firebaseapp.com",
        databaseURL: "https://popcorn-dating.firebaseio.com",
        projectId: "popcorn-dating",
        storageBucket: "popcorn-dating.appspot.com",
        messagingSenderId: "151273177936",
        appId: "1:151273177936:web:b2562a6b0eaf20c8516255",
        measurementId: "G-3KTKEEMXNW"
    });

    const messaging = firebase.messaging();

    messaging.setBackgroundMessageHandler(function(payload) {
        console.log('[SW] Received background message.');
    });
})(firebase.messaging.isSupported());
