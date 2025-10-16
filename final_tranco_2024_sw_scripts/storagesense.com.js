var me = self;

self.addEventListener('fetch', function(event){ 
  // console.log('fetch for add to home');
});//we need for add to screen

self.addEventListener('install', function(event) {
  console.log('Candee sw installed!');
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
  // event.waitUntil(
  //   caches.open('casCache').then(function(cache) {
  //     return cache.addAll(
  //       [
  //         './',
  //         './index.html',
  //         '../../css/style.min.css',
  //         'css/app.css',
  //         '../../js/candee.min.js'
  //       ]
  //     );
  //   })
  // );
});


self.addEventListener('activate', function(event) {
  console.log('Candee sw activated!');
  event.waitUntil(self.clients.claim()); // Become available to all pages
});


//self.addEventListener('push', function(event) {
  //var params = JSON.parse(new URL(location).searchParams.get('params'));

  //if(params.allowPush == 1 || params.allowPush == '1'){
    //const title = params.name;
   // const options = {
     // body: `${event.data.text()}`,
     // icon: params.logo,
     // badge: params.logo
    //};
  
   // event.waitUntil(self.registration.showNotification(title, options));
 // }
  //});

  self.addEventListener('notificationclick', function(event) {
    //console.log('[Service Worker] Notification click Received.');
  
    event.notification.close();
  
    // event.waitUntil(
    //   clients.openWindow('https://developers.google.com/web/')
    // );
  });
