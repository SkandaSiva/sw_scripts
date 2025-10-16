        // Register event listener for the 'push' event.
        self.addEventListener('push', function(event) {
          let data = event.data?.json();
          event.waitUntil(
            self.registration.showNotification(data.title, {
              body: data.message,
              actions: data.actions || []
            })
          );
        });
        self.addEventListener('notificationclick', function (event)  {
          const clickedNotification = event.notification;
          clickedNotification.close();
        
          // Do something as the result of the notification click
          if (event.action.startsWith('open:')) {
              const url = event.action.replace('open:', '');
              event.waitUntil(
                clients.matchAll({type: 'window'}).then(function(windowClients) {
                    // Check if there is already a window/tab open with the target URL
                    for (var i = 0; i < windowClients.length; i++) {
                        var client = windowClients[i];
                        // If so, just focus it.
                        if (client.url === url && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // If not, then open the target URL in a new window/tab.
                    if (clients.openWindow) {
                        return clients.openWindow(url);
                    }
                })
            );
          }
        });