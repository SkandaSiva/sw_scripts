// version 19/12/2021 

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
					'/favicon.ico',
					'/favicon.png'
				];
				files.forEach(element => cache.add(element));
		
				var img = ['cadenas.png','menu.png','logo.png','bandeau.jpg','x.png','wait.gif','googleSignIn.png','facebookConnexion.png','del.png','sortie.png','topo.png','photo.png','forum.png','matos.png','com.png','facebook.png','twitter.png','visugpx.png','accueil/1.jpg','accueil/2.jpg','accueil/3.jpg','accueil/4.jpg','accueil/5.jpg','accueil/6.jpg'];
				img.forEach(element => cache.add('/img/' + element));
			});
		});
});

self.addEventListener('fetch', (event) => {
	if(event.request.method!='POST') {
		var response;
		const url = event.request.url;
		
		// tous les fichiers statiques hors repertoires photos/  ->  cache visu_assets sinon network + mise en cache
		if ((url.indexOf('.jpg')!=-1 || url.indexOf('.gif')!=-1 || url.indexOf('.png')!=-1 || url.indexOf('.css')!=-1 || url.indexOf('.js')!=-1) && url.indexOf('skitour.fr')!=-1 && url.indexOf('/ajax/')!=-1 && url.indexOf('/upload/')!=-1 && url.indexOf('skitour.fr/photos_rep/')==-1 && url.indexOf('skitour.fr/topos/photos/')==-1 && url.indexOf('skitour.fr/annonces/photos/')==-1 && url.indexOf('skitour.fr/matos/photos/')==-1) {
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
		if (url=='https://skitour.fr/') {
			event.respondWith(
				fetch(event.request)
					.then(function(networkResponse) {
						return networkResponse;
					})
					.catch(function() {
						return caches.match('https://skitour.fr/index_cache.html').then(function(response) {
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