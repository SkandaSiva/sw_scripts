// version 26/03/2023 

self.addEventListener("install", event => {
  self.skipWaiting();
});


self.addEventListener('activate', function(event) {
	caches.keys()
		.then(function(names) {
			for (let name of names) caches.delete(name);
		})
		.then(function() {
			caches.open('cache').then(function(cache) {
				var files = [
					'/index_cache.html',
					'/main.js',
					'/inc/style.css',
					'/favicon.ico'
				];
				files.forEach(element => cache.add(element));
		
				var img = ['vttour.png','bandeaux/1.jpg','bandeaux/fond.png','del.png'];
				img.forEach(element => cache.add('/img/' + element));
			});
		});
});

self.addEventListener('fetch', (event) => {
	if(event.request.method!='POST') {
		var response;
		const url = event.request.url;
		
		// tous les fichiers statiques hors repertoires photos/  ->  cache visu_assets sinon network + mise en cache
		if ((url.indexOf('.jpg')!=-1 || url.indexOf('.gif')!=-1 || url.indexOf('.png')!=-1 || url.indexOf('.css')!=-1 || url.indexOf('.js')!=-1) && url.indexOf('vttour.fr')!=-1 && url.indexOf('/ajax/')!=-1 && url.indexOf('/upload/')!=-1 && url.indexOf('vttour.fr/sorties/photos/')==-1 && url.indexOf('vttour.fr/topos/photos/')==-1) {
			event.respondWith(
				caches.open('cache').then(function(cache) {
					return cache.match(event.request).then(function(response) {
						var fetchPromise = fetch(event.request).then(function(networkResponse) {
							cache.put(event.request, networkResponse.clone());
							return networkResponse;
						}).catch(function() {})
						return response || fetchPromise;
					})
				})
			);
		}
		
		// redirection de la page d'accueil vers le cache si pas de réseau
		if (url=='https://vttour.fr/') {
			event.respondWith(
				fetch(event.request)
					.then(function(networkResponse) {
						return networkResponse;
					})
					.catch(function() {
						return caches.match('https://vttour.fr/index_cache.html').then(function(response) {
							return response;
						})					
					})
				
				
				
			);	
		}
	}
});

// notifications push
self.addEventListener('push', event => {
    const dataJSON = event.data.json();
    const options = {body: dataJSON.body,icon: dataJSON.icon,badge: "/img/badge.png",data: {url: dataJSON.url}};
	return self.registration.showNotification(dataJSON.title, options);
});

self.addEventListener('notificationclick', event => {
    const url = event.notification.data.url;
    event.notification.close();
    event.waitUntil(clients.openWindow(url));
});