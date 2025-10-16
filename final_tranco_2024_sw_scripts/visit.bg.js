/* if(window.navigator && navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations()
    .then(function(registrations) {
        for(let registration of registrations) {
            registration.unregister();
        }
    });
}
 */


 const filesToCache = [
        '/',
        '/index.php'

];

const staticCacheName = 'VisitBG-pages-cache-v1.2.2';
const oldCacheName = 'VisitBG-pages-cache-v1.2.1';

self.addEventListener('install', event => {
  //console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  //event.respondWith(fetch(event.request));
});


self.addEventListener('activate', function(event) {
  event.waitUntil(
		caches.keys().then(function(names) {
		for (let name of names)
        caches.delete(name);
})
  );
});
