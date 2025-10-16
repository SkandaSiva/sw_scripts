// Initialize Firebase
importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.2/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
var config = {
    apiKey: "AIzaSyDK0H9pP5AUyk_1PtcE7ouYuxIJKqaEUTk",
    authDomain: "vbulletin-immihelp.firebaseapp.com",
    projectId: "vbulletin-immihelp",
    storageBucket: "vbulletin-immihelp.appspot.com",
    messagingSenderId: "354433759732",
    appId: "1:354433759732:web:5f74a85d65629abe22e1a1",
    measurementId: "G-S4C7211G0G"
};
if (firebase) {

  firebase.initializeApp(config);
  
  // Retrieve an instance of Firebase Data Messaging so that it can handle background messages.
  const messaging = firebase.messaging()
  messaging.setBackgroundMessageHandler(function(payload) {
    const notificationTitle = 'Data Message Title';
    const notificationOptions = {
      body: 'Data Message body',
      icon: 'alarm.png'
    };
    
    return self.registration.showNotification(notificationTitle,
        notificationOptions);
  });
}