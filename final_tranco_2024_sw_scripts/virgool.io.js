self.addEventListener('install', function (event) {
  // console.log('Hello world from the Service Worker');
});

self.addEventListener('activate', function(event) {
  // Perform some task
  // console.log('Active!!!');
});

self.addEventListener('fetch', function(event) {
  
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', (event) => {
  const payload = event.data.json();
  self.registration.showNotification(payload.title, payload);
});

self.addEventListener('notificationclick', function(event) {
  const action = event.action; 
  const notification = event.notification;
  
  notification.close();
  // Default behavior if the notification body is clicked (not the buttons)
  if (!action) {
    console.log('Notification clicked');
    // You can handle the default notification click (e.g., open URL)
    event.waitUntil(
      clients.openWindow(notification.data.url)
    );
    return;
  }
});
