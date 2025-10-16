importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAqmTlsyfaC9PJvE-EgQoLTCUkSGDhicQ0",
  authDomain: "ltpcalculator-1a271.firebaseapp.com",
  projectId: "ltpcalculator-1a271",
  storageBucket: "ltpcalculator-1a271.appspot.com",
  messagingSenderId: "874255684437",
  appId: "1:874255684437:web:c14f9791db1073042ed5dc",
  measurementId: "G-F21DT0GTB6",
});
// Necessary to receive background messages:
const messaging = firebase.messaging();

// Optional:
messaging.onBackgroundMessage((m) => {
  console.log("onBackgroundMessage", m);
});
