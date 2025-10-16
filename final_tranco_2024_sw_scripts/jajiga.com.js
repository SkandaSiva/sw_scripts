/// <reference lib="webworker" />
importScripts('/static/js/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('/static/js/firebasejs/10.1.0/firebase-messaging-compat.js');

console.log('fcm sw installing...');
const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAk4GySEjBncKzSouVzy1V8RkD9dhVFA74',
  projectId: 'endless-mariner-333510',
  messagingSenderId: '616286211925',
  appId: '1:616286211925:web:952a7fa365d35df97f29dc',
});

/**
 * @type ServiceWorkerGlobalScope
 */
const localSelf = self;

const openUrl = async (url) => {
  if (localSelf.clients.openWindow) {
    return localSelf.clients.openWindow(url);
  }
};

const isUrl = (url) => {
  return url.startsWith('http') || url.startsWith('https') || url.startsWith('intent');
};

localSelf.addEventListener('notificationclick', function (event) {
  console.log('notificationclick', event);
  const actionUrl = [
    { type: 'eventAction', action: event.action },
    {
      type: 'panelClickAction',
      action: event.notification?.data?.FCM_MSG?.notification?.click_action,
    },
    { type: 'fcmClickAction', action: event.notification?.data?.FCM_MSG?.data?.click_action },
  ].find((item) => isUrl(item.action));

  if (!!actionUrl) {
    event.waitUntil(openUrl(actionUrl.action));
  }
});

const runFirebase = () => {
  if (firebase.messaging.isSupported()) {
    return firebase.messaging(firebaseApp);
  }
};

runFirebase();

console.log('fcm sw finished...');
