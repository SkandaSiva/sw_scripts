importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyBJcrOijTLeuTFZxAAusvwfZ-lHKrrTeto",
  authDomain: "ssnv-bebda.firebaseapp.com",
  projectId: "ssnv-bebda",
  storageBucket: "ssnv-bebda.appspot.com",
  messagingSenderId: "501676823166",
  appId: "1:501676823166:web:51ce6daa5e81a14d7dbe2f"
};

firebase.initializeApp(firebaseConfig);

self.onnotificationclick =  function (event) {
    event.notification.close();
    tag = event.notification.tag;
    if (tag == null)
        return;
    if (!tag.startsWith("http"))
        return;
    clients.openWindow(tag);

};

const messaging = firebase.messaging();
