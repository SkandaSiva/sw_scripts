const staticCacheName = 'site-stat-v5';
const dynamicCacheName = 'site-dyna-v5';
// Note: Additional cache names must be addressed in Activate Event. 
const assets = [
    '/manifest.json',
    '/sw.js',
    '/', 
    '/darwin',
    '/stupid',
    '/darwin/',
    '/stupid/',
    '/index.html', 
    '/darwin/index.html',
    '/stupid/index.html',
    '/css/nav_main.css',
    '/css/template_story.css',
    '/css/indices_main.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
    'https://fonts.googleapis.com/css2?family=Raleway:wght@600&display=swap',
    '/misc/offline.html',
    '/i/mini_icon.gif',
    '/i/launcher/16.png',
    '/i/launcher/32.png',
    '/i/launcher/40.png',
    '/i/launcher/50.png',
    '/i/launcher/58.png',
    '/i/launcher/64.png',
    '/i/launcher/80.png',
    '/i/launcher/100.png',
    '/i/launcher/128.png',
    '/i/launcher/256.png',
    '/i/launcher/512.png',
    '/i/launcher/1024.png',
];

// Assets to add:
//    '/js/app.js', 
//    '/MobileWeb/homework4/js/pushnotifications.js',

// Install Event: happens once in the sw lifecycle.  This event gives the
// sw a place to setup the local environment, cache resources. caches.open
// is a syncronous event likely to finish after Install Event completes.
// To make sure caches.open is not stopped, wrap it in waitUntil().
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => { 
            console.log('Caching shell assets...');
            cache.addAll(assets);
        })
    );
});

// Listen for activate event.
// Delete old caches here.
self.addEventListener('activate', event => {
    event.waitUntil(                     // Waits for a promise to return
        caches.keys().then(keys =>{      // caches.keys is an Array of cache-names
            //console.log(keys);
            return Promise.all(keys      // Waits for an array of promises
              .filter(key => key !== staticCacheName && key !== dynamicCacheName)
              .map(key => caches.delete(key))
            );
        })
    );
});

// Service is active, and can access all files within its scope.
// Fires when app requests a resource (file or data) from the network.
// It can listen for all https requests, and intercept if needed.
// Strategy: Network first, falling back to cache.
// https://developer.chrome.com/docs/workbox/caching-strategies-overview/
self.addEventListener('fetch', (event) => {
  // Check if this is a navigation request
  if (event.request.mode === 'navigate') {
    // Open the cache
    event.respondWith(
      caches.open(staticCacheName).then((cache) => {
      // Go to the network first
      return fetch(event.request.url).then((fetchedResponse) => {
        cache.put(event.request, fetchedResponse.clone());

        return fetchedResponse;
      }).catch(() => {
        // If the network is unavailable, get
        return cache.match(event.request.url);
      });
    }));
  } else {
    return;
  }
});

// self.addEventListener('fetch', event => {
//     // console.log(`Service worker fetching ${event.request.url}`);
//     // Check if this is a navigation request
//   if (event.request.mode === 'navigate') {
//     // Fetch from web, else fetch the cached resource.
//     event.respondWith(
//         caches.match(event.request).then(cacheRes => {
//             return cacheRes || fetch(event.request).then(fetchRes => {
//                 return caches.open(dynamicCacheName).then(cache => {
//                     cache.put(event.request.url, fetchRes.clone());
//                     return fetchRes;
//                 });
//             });
//         }).catch(() => {
//           if(event.request.url.indexOf('.html') > -1){
//               return caches.match('/misc/offline.html');
//           }
//         }) //end .catch
//     );     //end event.respondWith
//   } else {
//     return;
//   }        //end the check-if-navigation block.
// });        //end self.addEventListener
//
