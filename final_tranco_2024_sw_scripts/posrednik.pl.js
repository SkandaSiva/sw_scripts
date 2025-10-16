  addEventListener('install', (event) => {
    event.waitUntil(async function() {
      const cache = await caches.open('static-v2');
      await cache.addAll([
        '/offline/',
        '/templates/website_v2/css/style.css',
        '/include/bootstrap-5/css/bootstrap.min.css'
      ]);
    }());
  });
  
  // See https://developers.google.com/web/updates/2017/02/navigation-preload#activating_navigation_preload
  addEventListener('activate', event => {
    event.waitUntil(async function() {
      // Feature-detect
      if (self.registration.navigationPreload) {
        // Enable navigation preloads!
        await self.registration.navigationPreload.enable();
      }
    }());
  });
  
  addEventListener('fetch', (event) => {
  
    /*
    if ( event.request.url.indexOf( 'https://posrednik.pl/zaplecze/' ) !== -1 ) {
        console.log('admin');
    }
    */
  
    const { request } = event;
  
    // Always bypass for range requests, due to browser bugs
    if (request.headers.has('range')) return;
    event.respondWith(async function() {
      // Try to get from the cache:
      const cachedResponse = await caches.match(request);
      if (cachedResponse) return cachedResponse;
  
      try {
        // See https://developers.google.com/web/updates/2017/02/navigation-preload#using_the_preloaded_response
        const response = await event.preloadResponse;
        if (response) return response;
  
        // Otherwise, get from the network
        return await fetch(request);
      } catch (err) {
        // If this was a navigation, show the offline page:
        if (request.mode === 'navigate') {
          return caches.match('offline/');
        }
  
        // Otherwise throw
        throw err;
      }
    }());
  });
  
  self.addEventListener('push', function(event) {
  
    if(!(self.Notification && self.Notification.permission === 'granted')) {
      return;
    }
  
    const sendNotification = body => {
  
      const obj = JSON.parse(body);

      fetch('https://posrednik.pl/ajax.php?action=push_set_as_shown&log_id='+obj.log_id);
  
      return self.registration.showNotification(obj.title, {
          'body':  obj.body,
          'icon':  obj.icon,
          'image': obj.image,
          'data':  {
            'url':    obj.url,
            'log_id': obj.log_id
          }
      });
    };
  
    if(event.data) {
      const message = event.data.text();
      event.waitUntil(sendNotification(message));
    }
  
  });
  
  self.addEventListener('notificationclick', function(event) {

    const clickedNotification = event.notification;

    fetch('https://posrednik.pl/ajax.php?action=push_set_as_clicked&log_id='+clickedNotification.data.log_id);

    clients.openWindow(clickedNotification.data.url);
    clickedNotification.close();

  });