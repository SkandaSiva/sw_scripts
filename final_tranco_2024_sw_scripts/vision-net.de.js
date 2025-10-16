
const staticCacheName = 'site-static-v3.1';
const dynamicCacheName = 'site-dynamic-v3.1';
const assets = [

];
//ServiceWorker 
self.addEventListener('install', evt => {
    //console.log('installed')
    /*evt.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets) 
        })
    )*/

});
self.addEventListener('activate', evt => {
    /*console.log('service worker has been activated')
    evt.waitUntil(
        caches.keys().then(keys => {     
            
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key);console.log(keys);)
            )
        })
    )*/
});

//fetch event
self.addEventListener('fetch', evt => {
    /*evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    //cache.put(evt.request.url, fetchRes.clone());
                    return fetchRes;
                })
            });
        })
    )*/

});


self.addEventListener('push', evt => {
    self.registration.sendNotification('test message',{});
    console.info('Event: Push');    

});

importScripts("/lib/scripts/firebase/firebase-app.js")
importScripts("/lib/scripts/firebase/firebase-messaging.js")

const firebaseConfig = {
  apiKey: "AIzaSyDh0qVnFtFzklmu-A7PLFRZwrAFdWUeIP0",
  authDomain: "visionwebnotification.firebaseapp.com",
  projectId: "visionwebnotification",
  storageBucket: "visionwebnotification.appspot.com",
  messagingSenderId: "246366729867",
  appId: "1:246366729867:web:5dacc8e3db2cca9b29068e"
};

firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log(payload);
    const notification=JSON.parse(payload);
    const notificationOption={
        body:notification.body,
        icon:notification.icon,
        vibrate: [200, 100, 200, 100, 200, 100, 200]
    };
    return self.registration.showNotification(payload.notification.title,notificationOption);
});