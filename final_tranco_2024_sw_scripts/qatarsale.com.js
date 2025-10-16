importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCoywnBTg_wELVS1wGWH9EDXLIdLgxsU7M',
  authDomain: 'aqatarsale-users.firebaseapp.com',
  // databaseURL: "https://angularfire2-test.firebaseio.com",
  projectId: 'qatarsale-users',
  storageBucket: 'qatarsale-users.appspot.com',
  messagingSenderId: '754195716249',
  appId: '1:754195716249:web:1a29b8a5bed9381e3f8008',
  measurementId: 'G-0JSHBNG471',
});

const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  const messaging = firebase.messaging();
}
