self.addEventListener('install', event => {

});

self.addEventListener('activate', event => {
});

self.addEventListener('fetch', event => {
});



// nghigd9

self.addEventListener('push', event => {
    const data = event.data.json();
    let title = data.title || "lorem title";
    let body = data.body || "lorem body";
    let tag = "tag";
    let icon = data.icon || 'https://floridajs.com/images/logo.jpg';
    let image = data.image || 'https://techbigs.com/uploads/2024/4/idle-town-master-thumbnail.jpg';
    let url = data.url || '';
    console.log(data);
    let action = [
      {
        action: 'confirm',
        title: 'OK'
      },
      {
        action: 'close',
        title: 'Download'
      },
    ];
    event.waitUntil(
      self.registration.showNotification(title,
        {
          body,
          icon,
          tag,
          image,
          actions: action,
          requireInteraction: true,
          data: { url: url },
          vibrate: [200, 100, 200],
          silent: false,
        })
    )
  
  });
  // self.addEventListener('notificationclick', function (event) {
  //   event.notification.close();
  //   console.log('clck ', event);
  //   let url = event.notification.data?.url || '';
  //   if (url) {
  //     let clickResponsePromise = Promise.resolve();
  //     clickResponsePromise = clients.openWindow(url);
  
  //     event.waitUntil(
  //       Promise.all([
  //         clickResponsePromise,
  //         // self.analytics.trackEvent('notification-click'),
  //       ])
  //     );
  //   }
  
  // });
  
  self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    console.log('clck ', event);
    let url = event.notification.data?.url || '';
    if (url) {
      let clickResponsePromise = Promise.resolve();
      clickResponsePromise = clients.openWindow(url).then(windowClient => {
        console.log(windowClient);
        // Check if the window was opened successfully
        if (windowClient) {
          // Send a message to the window to show an alert
          windowClient.postMessage({
            command: 'showAlert',
            message: 'URL opened in new window'
          });
        }
      });
  
      event.waitUntil(
        Promise.all([
          clickResponsePromise,
        ])
      );
    }
  });
  
  
  
  self.addEventListener('notificationclose', function (event) {
    event.waitUntil(
      Promise.all([
        // self.analytics.trackEvent('notification-close'),
        console.log("notificationclose")
      ])
    );
  });
  