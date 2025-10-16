// Questo file deve rimanere nella root, altrimenti non funziona correttamente

// Importa le funzioni necessarie per il messaging
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js');


// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBTJ8MY6tfmpD1VmKjQGHscmkB2vHxbR20",
  authDomain: "webapp-13d6f.firebaseapp.com",
  databaseURL: "https://webapp-13d6f.firebaseio.com",
  projectId: "webapp-13d6f",
  storageBucket: "webapp-13d6f.appspot.com",
  messagingSenderId: "294001187078",
  appId: "1:294001187078:web:758353f8414cf2a232e687",
  measurementId: "G-MQTPJQZYRZ"
};

// Inizializzazione Firebase
firebase.initializeApp(firebaseConfig);

// Inizializzazione del servizio Firebase Messaging
const messaging = firebase.messaging();

// Gestisci i messaggi ricevuti quando l'app è in background o terminata
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});