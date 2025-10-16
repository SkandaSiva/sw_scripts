  var offlineExclude = [
    '/api/',
    'cloudflare', 
    'captcha',
    'challenge',
    '.html',
    '/config.js'
  ];
  
  
  
  self.addEventListener('push', function(event) {
    // console.log('[Service Worker] Push Received.');
    // console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)
    let data = JSON.parse(event.data.text())
  
    const title =  data.notification.title || '';
    const options = {
      body: data.notification.body,
      icon: data.notification.image || '',
      badge: data.notification.image || ''
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });
  self.addEventListener('notificationclick', function(event) {
    // console.log('[Service Worker] Notification click Received.');
  
    event.notification.close();
  
    event.waitUntil(
      clients.openWindow('https://www.JJ789.com/')
    );
  });


  self.addEventListener('install', (e) => {
    e.waitUntil(
      caches.open('fox-store').then((cache) => cache.addAll([
        '/',
      ])),
    );
    e.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener('fetch', (e) => {
    // e.waitUntil(Promise.all([            
    //     self.clients.claim(),            
    //     caches.keys().then(function (cacheList) {
    //       return Promise.all(
    //         cacheList.map(function (cacheName) {
    //           return caches.delete(cacheName);
    //         })
    //       );
    //     })
    //   ])
    // );
    for (let i = 0; i < offlineExclude.length; i++){
      if (e.request.url.indexOf(offlineExclude[i]) !== -1) return false;
    }  
    var u = e.request.url.replace('https://', '')
    var n = u.indexOf('/')
    if (u.slice(n, 60).indexOf('.') == -1) {
      return false;
    }
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request)),
    );
  });