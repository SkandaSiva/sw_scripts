// IMPORTANT NOTICE: this service worker will only cache offline page on install event,
// to keep a good performance on first page load (both with end users & PageSpeed/Lighthouse scores for SEO)
// Assets files (js, css, woff, woff2 & png) will be cached on subsequent page loads only,
// meaning the more pages a user visits the more asset files will be stored into worker cache.

var CACHE_NAME = "assets-cache-d68b76779d06e824ae232a2bb432de802363878e";

var adminLoggedIn = false;

self.addEventListener('message', event => {
   if (event.data && event.data.hasOwnProperty('adminDebugToken')) {
      if (event.data.adminDebugToken == '6b6f0cf00b387141835494ecc90f3b9d') {
         adminLoggedIn = true;
      }
   }
});

self.addEventListener('install', event => {
   if (adminLoggedIn) { console.log('[pwa] installing service worker'); }
   var offlineAssets = [
      new URL('/offline.html', location.origin).toString(),
      new URL('/offline_background.jpg', location.origin).toString(),
      new URL('/offline_logo.png', location.origin).toString(),
      new URL('/offline_font.woff2', location.origin).toString()
   ];
   event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
         if (adminLoggedIn) { console.log('[pwa] caching offline assets'); }
         return cache.addAll(offlineAssets);
      }).then(() => self.skipWaiting())
   );
});

self.addEventListener('activate', event => {
   if (adminLoggedIn) { console.log('[pwa] worker has been activated'); }
   clients.claim();
   event.waitUntil(
      caches.keys().then(cacheNames => {
         return Promise.all(
            cacheNames.map(name => {
               if (name != CACHE_NAME) {
                  if (adminLoggedIn) { console.log(`[pwa] deleting old cache: ${name}`); }
                  return caches.delete(name);
               }
            })
         );
      })
   );
});

self.addEventListener('push', event => {

   if (adminLoggedIn) { console.log('[pwa] worker has received a push event', event); }

   // check if event.data exists & silently exit if it's missing
   if (!event.data) {
      if (adminLoggedIn) { console.log('[pwa] no data received in push event, exiting', event); }
      return;
   }

   // parse json data from backend
   const data = event.data.json();

   // Display the notification
   const notificationPromise = self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: data.data
   });

   // Call to backend to log the display of the notification
   const vanityMetricsEndpoint = new URL('/vanity_metrics/enqueue', location.origin).toString();

   const logDisplayEvent = fetch(vanityMetricsEndpoint, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
         metric: {
            vanity_metric: 'total_push_notifications_displayed',
            vanity_value: 1,
            message_id: data.data.message_id,
            token: '20memNG7Z2E5H7AtY6p9lphH8raG7P8GkY684k6o'
         }
      }),
   }).then(response => {
      return response.json();
   }).then(json => {
      if (adminLoggedIn) { console.log("[pwa] OK -> push notification displayed & 'total_push_notifications_displayed' vanity metric saved."); }
   }).catch(error => {
      console.error("[pwa] ERROR -> /vanity_metrics/enqueue failed for 'total_push_notifications_displayed' vanity metric", error);
   });

   // Use event.waitUntil to ensure the service worker does not terminate while the log is being sent
   event.waitUntil(Promise.all([notificationPromise, logDisplayEvent]));
});

self.addEventListener('notificationclick', function(event) {

   // Close the notification
   event.notification.close(); 

   // Ensure minimal required data (redirect url) is available in notification event
   if (!event.notification.data || !event.notification.data.conversation_path) {
      console.warn('[pwa] notification data and/or conversation_path is missing, skipping redirect.', event.notification);
      return;
   }

   const conversationPath = event.notification.data.conversation_path;
   // will be null on new listings notifications, only sent for new message notifications
   const messageId = event.notification.data.message_id; 

   const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
   }).then((windowClients) => {

      let matchingClient = null;

      // check if browser already contains a tab opened on this website
      for (let i = 0; i < windowClients.length; i++) {
         const windowClient = windowClients[i];
         if (windowClient.url === conversationPath) {
            matchingClient = windowClient;
            break;
         }
      }
      // WARNING: we do not wait for fetch execution here,
      // it may crash or be unresponsive (network issues or else)
      const vanityMetricsEndpoint = new URL('/vanity_metrics/enqueue', location.origin).toString();

      fetch(vanityMetricsEndpoint, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
         },
         body: JSON.stringify({
            metric: {
               vanity_metric: 'total_push_notifications_clicked',
               vanity_value: 1,
               message_id: messageId,
               token: '20memNG7Z2E5H7AtY6p9lphH8raG7P8GkY684k6o'
            }
         }),
      }).then(response => {
         return response.json();
      }).then(json => {
         if (adminLoggedIn) { console.log("[pwa] OK -> push notification clicked & 'total_push_notifications_clicked' vanity metric saved."); }
      }).catch(error => {
         console.error("[pwa] ERROR -> /vanity_metrics/enqueue failed for 'total_push_notifications_clicked' vanity metric", error);
      });

      // if a browser tab was found above focus on it
      if (matchingClient) {
         return matchingClient.focus();
      // else open a new browser tab with our notification redirect url
      } else {
         return clients.openWindow(conversationPath);
      }
   });

   event.waitUntil(promiseChain);
});


self.addEventListener('fetch', event => {

   // Handle HTML navigation requests or fetching HTML documents
   if (
      event.request.mode === 'navigate' || (
         event.request.method === 'GET' && 
         event.request.headers.get('accept').includes('text/html')
      )
   ) {
      event.respondWith(
         fetch(event.request).catch(() => {
            // Return offline page from cache when network fetch fails
            return caches.match('/offline.html');
         })
      );
      return;
   }

   // Handle asset requests (CSS, JS, images, fonts, etc.)
   const extensionPattern = /\.(css|js|woff2?|png|jpg|jpeg|gif|svg)$|manifest\.json$/;
   const requestURL = new URL(event.request.url);
   const sameOrigin = requestURL.origin === self.location.origin;

   // Skip non-GET requests, cross-origin requests, or requests that don't match the asset pattern
   if (
      event.request.method !== 'GET' || 
      !sameOrigin || 
      !extensionPattern.test(requestURL.pathname) || 
      event.request.url.includes('localhost') // Skip requests in localhost for dev testing
   ) {
      return;
   }

   event.respondWith(
      caches.match(event.request).then(cachedResponse => {
         // Return cached asset if available
         if (cachedResponse) {
            return cachedResponse;
         }

         // If not in cache, try fetching from the network and cache it
         return fetch(event.request).then(networkResponse => {
         
            if (!networkResponse || !networkResponse.ok) {
               console.warn(`[pwa] Network fetch failed or invalid for ${event.request.url}`);
               return networkResponse; // Return failed response (if any)
            }

            // Clone the network response to cache it
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
               cache.put(event.request, responseToCache).catch(err => {
                  console.error(`[pwa] Failed to cache ${event.request.url}: `, err);
               });
            });

            return networkResponse;
         }).catch(() => {
            // If fetch fails (e.g., offline), try to return a fallback asset if applicable
            if (event.request.url.endsWith('.jpg')) {
               return caches.match('/offline_background.jpg');
            } else if (event.request.url.endsWith('.png')) {
               return caches.match('/offline_logo.png');
            } else if (event.request.url.endsWith('.woff2')) {
               return caches.match('/offline_font.woff2');
            } else {
               console.error(`[pwa] Cache fetch failed for ${event.request.url}`);
            }
         });
      })
   );
});

// https://caniuse.com/?search=pushsubscriptionchange
// -> this event is only supported by Safari as of 2024-04, not point using it
/*self.addEventListener('pushsubscriptionchange', function(event) {
   console.log('[pwa] pushsubscriptionchange event', event);
   event.waitUntil(
     self.registration.pushManager.subscribe(event.oldSubscription.options)
       .then(function(newSubscription) {
         // Send both old and new subscription to your server to update the database
         console.log('newSubscription', newSubscription);
         console.log('oldSubscription', event.oldSubscription);
      })
   );
});*/
