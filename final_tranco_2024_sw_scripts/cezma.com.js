const mode = {
  beta: {
    firebaseConfig: {
      apiKey: 'AIzaSyC23QyxFJYlDG66PRHcpZbq3sk-T5OD2rU',
      authDomain: 'cezma-test.firebaseapp.com',
      projectId: 'cezma-test',
      storageBucket: 'cezma-test.appspot.com',
      messagingSenderId: '720310463799',
      appId: '1:720310463799:web:c0dc972d6787671c14beb2',
      measurementId: 'G-FK8FJL8DPZ',
    },
    Key_pair: 'BLHS2g0NTtPnr2b-bJ41AOXqg6PaY5lOk-dJTChQDeBAnzo-X2PeokzW14edW5qGFpUSvfIGxs1K_a4_6Hpqbw4',
  },

  production: {
    firebaseConfig: {
      apiKey: 'AIzaSyBQl3gxjPZ1RXUUegprdX9rXoq0K9m3O2U',
      authDomain: 'cezma-65e3a.firebaseapp.com',
      databaseURL: 'https://cezma-65e3a-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'cezma-65e3a',
      storageBucket: 'cezma-65e3a.appspot.com',
      messagingSenderId: '899455794450',
      appId: '1:899455794450:web:11211aaf46c847728287cb',
      measurementId: 'G-BHK7M9PRR9',
    },
    Key_pair: 'BHvjyX9voBSwIcca0lOpeEnwEmAJXcwGAlKnu3ZDBTRX5fDXgtXnfOIvk_6GIiXnu65qeWH0JwXlBL3RakRVO1Y',
  },
};

//if you are facing any problem move this file to public folder

// ##------Give the service worker access to Firebase Messaging------##
// Note that you can only use Firebase Messaging here. Other Firebase libraries are not available in the service worker.

//##The purpose of the importScripts statement in firebase-messaging-sw.js is to load the Firebase SDK scripts within the service worker context so that the service worker can handle push notifications and messaging tasks.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
importScripts('../notificationsEnvMode.js');

// Initialize the Firebase app in the service worker by passing in your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const activeFBConfig = isProduction ? mode.production : mode.beta;

firebase.initializeApp(activeFBConfig.firebaseConfig);
// Retrieve an instance of Firebase Messaging so that it can handle background  messages
// for recienving message in back ground if tab is active or not active or closed

//this for console messages  that came from server with configuration in app.vue file
const messaging = firebase.messaging();

//this for console messages that came from server but in alert of browser
messaging.onBackgroundMessage(async (payload) => {
  // console.log("background notification", payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.jpg',
    badge: '/favicon.jpg', // Specify a fallback icon
  };
  // console.log('payload',payload);
  // console.log('self.registration',self.registration);

  //redirect to specific page depend on notification action-type  if user click on notification on background
  let notificationPath = getPathOfNotificationActions(payload?.data?.type, payload?.data?.type_id);
  self.onnotificationclick = (event) => {
    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === notificationPath && 'focus' in client) return client.focus();
        }
        if (clients.openWindow) return clients.openWindow(notificationPath);
      })
    );
  };
  // self.registration.showNotification(notificationTitle, notificationOptions);

  const channel = new BroadcastChannel('sw-messages'); //create channel and give it a name in service worker to send message through it you can receive message through this channel by channel name at anyware
  channel.postMessage(JSON.stringify(payload)); //send as text then convert to object again and receiving
});

function getPathOfNotificationActions(actionType, type_id = '') {
  switch (actionType) {
    case 'welcome_message':
      return '/';

    case 'new_order':
      return '/';

    case 'change_order_status':
      return `/orders`;

    case 'chat_message':
      return `/chats?id=${type_id}`;

    case 'store_expiration':
      return '/';

    default:
      return '/';
  }
}
