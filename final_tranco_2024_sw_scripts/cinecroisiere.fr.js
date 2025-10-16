self.addEventListener('install',function(e)
{
 /*
 e.waitUntil(
   caches.open('video-store').then(function(cache) {
     return cache.addAll([
       '/pwa-examples/a2hs/',
       '/pwa-examples/a2hs/index.html',
       '/pwa-examples/a2hs/index.js',
       '/pwa-examples/a2hs/style.css',
       '/pwa-examples/a2hs/images/fox1.jpg',
       '/pwa-examples/a2hs/images/fox2.jpg',
       '/pwa-examples/a2hs/images/fox3.jpg',
       '/pwa-examples/a2hs/images/fox4.jpg'
     ]);
   })
 );
 */
});

self.addEventListener('fetch',function(e)
{
  /*
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
  */
});

self.addEventListener('push',function(event)
{
  // console.log('notification reçue');
  data=event.data.text();
  tab=data.split('$$$');
  const promise=self.registration.showNotification(tab[0],
  {
    body: tab[1],
    icon:'https://www.cinecroisiere.fr/i/favicon-48x48.png'
  });
  event.waitUntil(promise);
});

self.addEventListener('notificationclick',function(event)
{
	event.notification.close();
	event.preventDefault(); // empêcher le navigateur de passer le focus sur l'onglet de la navigation
	event.waitUntil(
		// clients.openWindow(event.data.url + "?notification_id=" + event.data.id);
		clients.openWindow('http://www.cinecroisiere.fr')
	);
}); // ,false ???