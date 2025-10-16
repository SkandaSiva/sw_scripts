// importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js");
// importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js");

// // Get registration token. Initially this makes a network call, once retrieved
// // subsequent calls to getToken will return from cache.
// firebase.initializeApp({
//   apiKey: "AIzaSyAyBQT3vpAwVnX5tEXRI0pEgQMsOpQgWEg",
//   authDomain: "hdfc360.firebaseapp.com",
//   databaseURL: "https://hdfc360.firebaseio.com",
//   projectId: "hdfc360",
//   storageBucket: "hdfc360.appspot.com",
//   messagingSenderId: "66449821161",
//   appId: "1:66449821161:web:442f1b0967b4eedb950f78",
//   measurementId: "G-KBJZE17QCJ",
// });

// const messaging = firebase.messaging();
// messaging.firebaseDependencies.installations
//   .getToken(messaging, {
//     vapidKey:
//       "BHo8AtLzeZwBXSw98CvOzGJ1nxXuGsAJKJikCVxHeREkkmJ8AfvnQoiqyn3pnHjb3irJtWN960Fy_l0A_JWufXY",
//   })
//   .then((currentToken) => {
//     if (currentToken) {
//       // Send the token to your server and update the UI if necessary
//       // ...
//       console.log(currentToken, "current token");
//     } else {
//       // Show permission request UI
//       console.log(
//         "No registration token available. Request permission to generate one.",
//       );
//       // ...
//     }
//   })
//   .catch((err) => {
//     console.log("An error occurred while retrieving token. ", err);
//     // ...
//   });

// // onMessage(messaging, (payload) => {
// //   console.log("Message received. ", payload);
// //   // ...
// // });

// messaging.onBackgroundMessage(messaging, (payload) => {
//   console.log(
//     "[firebase-messaging-sw.js] Received background message ",
//     payload,
//   );
//   // Customize notification here
//   const notificationTitle = "Background Message Title";
//   const notificationOptions = {
//     body: "Background Message body.",
//     icon: "/firebase-logo.png",
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyAyBQT3vpAwVnX5tEXRI0pEgQMsOpQgWEg",
  authDomain: "hdfc360.firebaseapp.com",
  databaseURL: "https://hdfc360.firebaseio.com",
  projectId: "hdfc360",
  storageBucket: "hdfc360.appspot.com",
  messagingSenderId: "66449821161",
  appId: "1:66449821161:web:442f1b0967b4eedb950f78",
  measurementId: "G-KBJZE17QCJ",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
