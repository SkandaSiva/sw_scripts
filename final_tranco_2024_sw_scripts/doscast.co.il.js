
importScripts('/firebase/app.js');
importScripts('/firebase/messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyBHQfrrngWmRZS8TdBxzCXLsGkWionUtj8",
  authDomain: "doscast-2de91.firebaseapp.com",
  projectId: "doscast-2de91",
  storageBucket: "doscast-2de91.appspot.com",
  messagingSenderId: "511110900927",
  appId: "1:511110900927:web:5891468dc1a232a87a6a0a",
  measurementId: "G-359VMTGBL9"
};

  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  // Handle background messages
  // messaging.setBackgroundMessageHandler((payload) => {
  //   console.log('Background message received:', payload);
  //   // Handle the received payload and display the notification in your app.
  //   // You may also use a third-party library for more customized notifications.
  // });

  messaging.setBackgroundMessageHandler(function (payload) {

    console.log(payload);
      const notification=JSON.parse(payload);
      const notificationOption={
          body:notification.body,
          icon:notification.icon
      };
      return self.registration.showNotification(payload.notification.title,notificationOption);
  });