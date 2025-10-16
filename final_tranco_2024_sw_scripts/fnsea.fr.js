self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Push Codelab';
  const options = {
    body: 'Yay it works.',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click Received.');

  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/')
  );
});


importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');


const CACHE = "pwa-fngear";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
// const assets=[
//     "offline.html"
// ]
// const offlineFallbackPage = "offline.html";


// self.addEventListener('install',event=>{
//     event.waitUntil(
//         caches.open(CACHE)
//           .then((cache) => 
//             cache.addAll(assets)
//           )
//       );
// });



self.addEventListener('activate', function(event) {
   console.log("service woker has been activated")
});


workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'pwa-images-fnsea',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );

  workbox.routing.registerRoute(
    /\.(?:css|js)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "'pwa-assets-fnsea",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  );

  workbox.routing.registerRoute(
    /\.(?:pdf)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "'pwa-pdf-fnsea",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 5,
          maxAgeSeconds: 1 * 24 * 60 * 60, // 1 Days
        }),
      ],
    }),
  );

  workbox.routing.registerRoute(
    new RegExp('.*\/wp-admin.*'),
    new workbox.strategies.NetworkOnly()
  );

   workbox.routing.registerRoute(
    new RegExp('.*\/wp-includes.*'),
    new workbox.strategies.NetworkOnly()
  );

    workbox.routing.registerRoute(
    new RegExp('.*\/recaptcha.*'),
    new workbox.strategies.NetworkOnly()
  );

     workbox.routing.registerRoute(
    new RegExp('.*\/wp-json.*'),
    new workbox.strategies.NetworkOnly()
  );

      workbox.routing.registerRoute(
    new RegExp('.*\/wp-login.*'),
    new workbox.strategies.NetworkOnly()
  );


  // workbox.routing.registerRoute(
  //   new RegExp('.*fnsea.fr\/.*'),
  //   new workbox.strategies.StaleWhileRevalidate({
  //     cacheName: CACHE,
  //      plugins: [
  //       new workbox.expiration.ExpirationPlugin({
  //         maxEntries: 100,
  //         maxAgeSeconds: 30 * 24 * 60 * 60, // 1 Days
  //       }),
  //     ],
  //   })
  // );

  
