importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// TODO: rewrite this in typescript and make it bundled by Vite
// https://vite-pwa-org.netlify.app/guide/register-service-worker might be one way of doing it
const firebaseConfig = JSON.parse(new URL(location).searchParams.get('firebaseConfig'));
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
