self.addEventListener('install', function(event) {
  self.skipWaiting();
});
self.addEventListener('activate', function(event) {
});
self.addEventListener('push', function(event) {

  event.waitUntil(  
    fetch("https://apism.speedmeta.com/get_notification_V2/?key=O816MV0N6C4OEKUUXUEN").then(function(response) {  
      if (response.status !== 200) {  
        throw new Error();  
      }

      // Examine the text in the response  
      return response.json().then(function(data) {  
        if (data.error || !data.notification) {  
          throw new Error();  
        }  

        var ua = navigator.userAgent.toLowerCase();
        var isMac = ua.indexOf("macintosh") > -1;


        var title = data.notification.title;  
        var message = data.notification.message;  
        var icon = data.notification.icon;  
        var image = data.notification.image;  
        var notificationTag = data.notification.tag;
        var final_link = data.notification.link;
        var req_interaction = (isMac) ? false : true;

        return self.registration.showNotification(title, {  
          body: message, icon: icon,image: image, tag: notificationTag,data: data,requireInteraction: req_interaction
        });  
      });  
    }).catch(function(err) {  
      console.error('Unable to retrieve data', err);
    })  
  );  
});

self.addEventListener('notificationclick', function(ev) {  
  ev.waitUntil(
    clients.matchAll({ type: "window" }).then(function(clientList) {  
      return clients.openWindow(ev.notification.data.notification.link);  
    })
  );
  ev.notification.close();
});