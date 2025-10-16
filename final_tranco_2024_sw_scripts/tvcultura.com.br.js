importScripts('https://www.gstatic.com/firebasejs/6.2.4/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.2.4/firebase-messaging.js');

firebase.initializeApp({ 'messagingSenderId': '370456186282' });

const showNotification = function(title, notification) {
  return self.registration.showNotification(title, {
    ...notification,
    data: {
      link: notification.click_action
    }
  });
};

self.addEventListener('push', function(event) {
  const payload = event.data.json();
  event.waitUntil(
    showNotification(payload.notification.title, payload.notification)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if(event.notification && event.notification.data && event.notification.data.link) {
    const notificationPage = event.notification.data.link;
    event.waitUntil(
      clients.openWindow(notificationPage)
    );
  }
});
