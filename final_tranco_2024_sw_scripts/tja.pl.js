/** Again import google libraries */
importScripts("https://www.gstatic.com/firebasejs/7.14.6/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.14.6/firebase-messaging.js");

/** Your web app's Firebase configuration 
 * Copy from Login 
 *      Firebase Console -> Select Projects From Top Naviagation 
 *      -> Left Side bar -> Project Overview -> Project Settings
 *      -> General -> Scroll Down and Choose CDN for all the details
*/
var config = {
    apiKey: "AIzaSyDo1u1axubxsYYw7UA1kMooM3xgOEKqwG4",
    authDomain: "powiadomienia-86863.firebaseapp.com",
    databaseURL: "https://powiadomienia-86863.firebaseio.com",
    projectId: "powiadomienia-86863",
    storageBucket: "powiadomienia-86863.appspot.com",
    messagingSenderId: "222455736967",
    appId: "1:222455736967:web:eae7b9e5e8f844ab90e622",
    measurementId: "G-SF2HZQBH74"  
};
firebase.initializeApp(config);

// Retrieve an instance of Firebase Data Messaging so that it can handle background messages.
const messaging = firebase.messaging();

/** THIS IS THE MAIN WHICH LISTENS IN BACKGROUND */
messaging.setBackgroundMessageHandler(function(payload) {
    const notificationTitle = 'BACKGROUND MESSAGE TITLE';
    const notificationOptions = {
        body: 'Data Message body',
        icon: 'https://c.disquscdn.com/uploads/users/34896/2802/avatar92.jpg',
        image: 'https://c.disquscdn.com/uploads/users/34896/2802/avatar92.jpg'
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

