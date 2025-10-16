importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');


  // Initialize Firebase
    var firebaseConfig = {
    apiKey: "AIzaSyDQ72DFf3_99uQ96burYvcFVg_F_Y4uqMQ",
    authDomain: "gkpush-a0d45.firebaseapp.com",
    databaseURL: "https://gkpush-a0d45.firebaseio.com",
    projectId: "gkpush-a0d45",
    storageBucket: "gkpush-a0d45.appspot.com",
    messagingSenderId: "455207737709",
    appId: "1:455207737709:web:5abfdd71553f5392"
  };
  firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// message handling is done in subscribe.js i dont know why  
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;

const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon, // Add an icon if available in payload
    requireInteraction: true,
    renotify: true, 
    tag: 'unique-notification-tag',// Keeps the notification until the user interacts with it
    data: { // Use the 'data' field to store the URL
      url: payload.notification.click_action || 'https://www.gkexams.com', // Default URL if none is provided
    }
  };
//var notification = new Notification(title,options);
  return self.registration.showNotification(notificationTitle,notificationOptions);
});



self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Close the notification

  // This looks for existing windows/tabs and focuses on them or opens a new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Check if there's already an open window/tab with the URL
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window/tab is found, open a new one
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});


const filesToCache = [
'/manifest.json',
'/images/questionbank.svg',
'/images/mocktest.svg',
'/images/book.svg',
'/images/jobalert.svg',
'/images/current.svg',
'/images/bolo.svg',
'/images/logo192.png',
'/images/logo180.png',
'/offline.html'
];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request.url)
    .then(response => {
      if (response) {
        //console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      //console.log('Network request for ', event.request.url);
      // TODO 4 - Add fetched files to the cache only same origin
          caches.open(staticCacheName)
    .then(cache => {
                var filename = event.request.url;
    substring = 'gkexams.com/';
    substring2 = 'firebase';
    
if(filename.indexOf(substring) !== -1){
     console.log('Cached',filename);
if ( /\.(jpeg|jpg|png|gif|bmp|svg|css|woff|woff2|ico)$/i.test(filename) ) {
          //  console.log('this file added to cache',event.request.url);
            return cache.add(event.request.url);
            }
}
              //cross origin
  
  if(filename.indexOf(substring2) !== -1){
      console.log(filename);
  fetch(event.request).then(function(networkResponse) {
     // console.log('adding firebase to cache');
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
  }

        //cross origin upto here


    });
    
    
      return fetch(event.request);
    }).catch(error => {
       // console.log('Fetch failed; returning offline page instead.', error);
        return caches.match('/index.php');
      // TODO 6 - Respond with custom offline page
    })
  );
});




