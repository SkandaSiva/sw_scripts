/*
 * AGNITAS Push Notifications Service Worker
 *
 * Version 1.1.0
 */

self.addEventListener("push", function(e) {
  if (e.data) {
    var msg = e.data.json();

    msg.requireInteraction = true; /* do not disappear automatically */
    
    
    /*
     *  Show notification only, if there is a message body defined.
     *  This helps us to force the browser to update the ServiceWorker silently it needed.
     */
    if(msg.body) {    
    	e.waitUntil(self.registration.showNotification(msg.data.title, msg));
    }

    /*
     * Because updating the ServiceWorker does not take effect for this run,
     * we can do it at the end to avoid any delays showing the message.
     */ 
    
    if(msg.data.force_update) {
        e.waitUntil(self.registration.update());
    }
  } else {
    console.log("Received push notification without payload", e);
  }
});

self.addEventListener("notificationclick", function(e) {
  var data = e.notification && e.notification.data;

  console.log(e);

  if (data.link) {
    try {
      e.target.clients.openWindow(data.link);
    } catch (error) {
      console.error("Error handling link from push notification", error);
    }
  }
});
