self.addEventListener('push',
  function(e){
    if(e.data){
      payload = e.data.json();
    
      var options = {
        body: payload.body,
        requireInteraction: true,
        icon: payload.icon,
        image: payload.image,
        vibrate: [50,50,50],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
          url: payload.url
        }
      };
      e.waitUntil(
        self.registration.showNotification(payload.title, options)
      );
    }
  }
);

self.addEventListener('notificationclick',
 function(e){
    payload = e.notification;
    
    e.notification.close();
    e.waitUntil(
      clients.openWindow(payload.data.url)
    );
  }
);