
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyDvJ296IsxsKT3xd_4CGBQCdrJXe_9FkTM",
  authDomain: "tehillim-7368b.firebaseapp.com",
  projectId: "tehillim-7368b",
  storageBucket: "tehillim-7368b.appspot.com",
  messagingSenderId: "855685804948",
  appId: "1:855685804948:web:f04988a25ebb9394e15581",
  measurementId: "G-WG8RBJ830F"
};

firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();


messaging.setBackgroundMessageHandler(function (payload) {

	console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});