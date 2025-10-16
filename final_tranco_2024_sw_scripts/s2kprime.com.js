// Listen to `push` notification event. Define the text to be displayed
// and show the notification.
self.addEventListener('push', function(event) {
  var data =JSON.parse(event.data ? event.data.text() : '{}') ;
  console.log('xxxx11122',data)
  event.waitUntil(self.registration.showNotification('S2K Prime', {
    body: data.message||'Push Notification from S2K Prime',
    actions: [{action: 'open', title: 'Open'}] ,
    icon: '/s2k/styles/s2k.png',
    data: data.payload.url
  }));
});

self.addEventListener('notificationclick', function(event) {  
  var url = event.notification.data;
  console.log('22222xx',event.notification)
  event.notification.close();
  if (event.action === 'open') {  
    clients.openWindow("/s2k/#/" + url);  
  } 
}, false);