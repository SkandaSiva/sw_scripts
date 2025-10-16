importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAd3PtC83DU8hh6zywXJsLDucxyHD5t8JU",
  authDomain: "wallex-cb980.firebaseapp.com",
  projectId: "wallex-cb980",
  storageBucket: "wallex-cb980.appspot.com",
  messagingSenderId: "89354635753",
  appId: "1:89354635753:web:546a25e7ba82812085e378",
  measurementId: "${config.measurementId}",
});

const messaging = firebase.messaging();

