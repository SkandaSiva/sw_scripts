self.addEventListener('install', async event => {
    console.log('install event');
    
});

self.addEventListener('fetch', async event => {
    console.log('fetch event');
});

const cacheName = 'pwa-conf-v1';
const staticAssets = [
    //'Default.aspx',
   // 'js/app.js'
  //  'css/Style.css'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});


self.addEventListener('notificationclick', function (event) {
    clients.openWindow(event.notification.data.url);

    event.notification.close();

    //switch (event.action) {
    //    case 'open_url':
    //        clients.openWindow(event.notification.data.url);
    //        break;
    //}
}, false);