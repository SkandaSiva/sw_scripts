self.addEventListener('fetch', function(event){
});
importScripts('https://www.gstatic.com/firebasejs/6.3.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.3.5/firebase-messaging.js');

var firebaseConfig = {
    apiKey: "AIzaSyAst40EKXLS1J2SCy9Nd9DehrYU98olQmY",
    authDomain: "fixmatka-notify.firebaseapp.com",
    databaseURL: "https://fixmatka-notify.firebaseio.com",
    projectId: "fixmatka-notify",
    storageBucket: "",
    messagingSenderId: "1096815032981",
    appId: "1:1096815032981:web:e219e4ec0332edef"
  };
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();