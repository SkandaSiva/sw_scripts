importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyA-l4qBJD5rCSZuqgxbZFcKYeyqxqcnUPo",
    projectId: "paratlanauth",
    messagingSenderId: "1052737098001",
    appId: "1:1052737098001:web:ebb5f91fc575364a30fcb0"
});
 
var messaging = firebase.messaging();