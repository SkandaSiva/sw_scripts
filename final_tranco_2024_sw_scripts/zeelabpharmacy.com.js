importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');
   
firebase.initializeApp({
      apiKey: "AIzaSyBG-53vW4jmyuUl1IGoUTvoRJA7-QVh9Ro",
      authDomain: "zeelabpharmacy24.firebaseapp.com",
      projectId: "zeelabpharmacy24",
      storageBucket: "zeelabpharmacy24.appspot.com",
      messagingSenderId: "833886998658",
      appId: "1:833886998658:web:3e50d9c30a7d844569249b",
      measurementId: "G-HY124E4Y3W"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function({data:{title,body,icon}}) {
    return self.registration.showNotification(title,{body,icon});
});