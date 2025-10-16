importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyBTYkkvmNnJRn2UXulbDzsPFBx-nVsQomI",
    authDomain: "myfreescorenow-acd3b.firebaseapp.com",
    projectId: "myfreescorenow-acd3b",
    storageBucket: "myfreescorenow-acd3b.appspot.com",
    messagingSenderId: "524057498388",
    appId: "1:524057498388:web:85312b6fb6556c6b91a801",
    measurementId: "G-SB4E21Z143"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Recieved Background Messages", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
})

messaging.onMessage(messaging, (payload) => {
    console.log('Message received11111. ', payload);
});

// // Customize the notification behavior when action buttons are clicked
// self.addEventListener('notificationclick', (event) => {
//     console.log('open window')
//     const notification = event.notification;
//     const action = event.action;
  
//     if (action === 'explore') {
        
//         // Handle the "Explore" button click here
//         // For example, redirect the user to a specific page
//         self.clients.openWindow('http://localhost:3000/AbandonedMembers');
//     }
  
//     // Close the notification after handling the action
//     notification.close();
// });
