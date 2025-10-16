importScripts("https://www.gstatic.com/firebasejs/7.14.3/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.14.3/firebase-messaging.js");

var firebaseConfig = {
    apiKey: "AIzaSyB0SI35fYUhK2Dhns0C1WMPMRGR8RF6Sq8",
    authDomain: "presidencia-b3f25.firebaseapp.com",
    databaseURL: "https://presidencia-b3f25.firebaseio.com",
    projectId: "presidencia-b3f25",
    storageBucket: "presidencia-b3f25.appspot.com",
    messagingSenderId: "109719034408",
    appId: "1:109719034408:web:aa592f4c007120a7b4b31d"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
