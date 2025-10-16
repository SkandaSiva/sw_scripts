importScripts('https://www.gstatic.com/firebasejs/6.3.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.3/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: '303111472022',
});

const messaging = firebase.messaging();
