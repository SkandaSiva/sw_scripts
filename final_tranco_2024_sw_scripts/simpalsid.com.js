importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

const config = {
  apiKey: 'AIzaSyAGqAAy66IeP59OL1vEpJQN2gJ2lVTcJkM',
  authDomain: 'api-project-1047417137596.firebaseapp.com',
  databaseURL: 'https://api-project-1047417137596.firebaseio.com',
  projectId: 'api-project-1047417137596',
  storageBucket: '',
  messagingSenderId: '1047417137596'
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(payload => {
  const data = payload.data;
  const customData = JSON.parse(data.custom);
  const title = data.title;
  const url = customData.url || '';
  const options = {
    body: data.subject,
    icon: customData.image,
    data: { url }
  };
  return self.registration.showNotification(title, options);
})

self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  notification.close();
  notification.data && notification.data.url !== '' && clients.openWindow(notification.data.url);
}, false)
