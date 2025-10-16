/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js'
);
var firebaseConfig = {
  apiKey: 'AIzaSyBKidv83_9AYgj739OVX0D6_xvJxPOdxYY',
  authDomain: 'arzif-id.firebaseapp.com',
  databaseURL: 'https://arzif-id.firebaseio.com',
  projectId: 'arzif-id',
  storageBucket: 'arzif-id.appspot.com',
  messagingSenderId: '494476378477',
  appId: '1:494476378477:web:84d599412b1b9ddd63da64',
  measurementId: 'G-KFGB3VVTXL',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  const opt = payload.data;
  if (opt.actions) {
    opt.actions = JSON.parse(opt.actions);
  }

  return self.registration.showNotification(payload.data.title, opt);
});
