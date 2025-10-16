// version 16

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
	caches.keys()
		.then(function(names) {
			for (let name of names) if(name != 'visu_suivi') caches.delete(name); // on supprime tous les caches sauf celui du suivi !
		})
		.then(function() { // cache des tous les fichiers de base
			caches.open('visu_assets').then(function(cache) {
				var files = [
					'/leaflet_lib.js',
					'/main.js',
					'/visu.js',
					'/favicon.png','favicon.ico',
					'/inc/style.css',
					'/inc/leaflet/style.css',
					'/inc/leaflet/rotate.js',
					'/inc/leaflet/script.js',
					'/inc/leaflet/layers.png','/inc/leaflet/layers-2x.png',
					'/img/suivi.png',
					'/img/suivi_offline.png',
					'/img/cartes_offline.png',
					'/img/offline.png',
					'/img/logo.png',
					'/img/upPage.png',
					'/img/app_store.png',
					'/img/offline.jpg',
					'/img/zone.png',
					'/img/zone.jpg',
					'/img/compas.png',
					'/img/play_store.png',
					'/img/nocapture.png',
					'/img/x.png',
					'/img/warning.png',
					'/img/valid.png',
					'/img/marqueurs/suivi.png',
					'/img/marqueurs/red_node.png',
					'/img/locMeDir.png',
					'/img/satellite.png',
					'/img/myPos.png',
					'/img/myPos_grey.png',
					'/img/finish.png',
					'/img/bandeau.jpg',
					'/img/cancel.png',
					'/img/viseur.png',
					'/img/red_line.png',
					'/img/blue_line.png',
					'/img/poignee.png',
					'/img/menu.png',
					'/img/parametres.png',
					'/img/goout.png',
					'/img/resume_den.png','/img/logoCarre.png','/img/menuX.png',
					'/img/notification.png','/img/youtube.png','/img/facebook.png','/img/instagram.png','/img/rideout.png','/img/vttour.png','/img/skitour.png',
					'/img/menugrey.png',
					'/img/geoportail.gif',
					'/img/storage.png',
					'/img/plus.png','/img/saving.gif','/img/delete.png',
					'/img/rotation.png','/img/loupe.png',
					'/img/retour.png','/img/fullscreen.png','/img/cadenas.png',
					'/img/heatmap/ride.png','/img/heatmap/run.png','/img/heatmap/winter.png',
					'/img/activite/mn.png','/img/activite/vr.png','/img/activite/vtt.png',
					'/index_cache.php',
					'/zones/',
					'/zones/lib.js',
					'/editgpx/img/upload.png',
					'/editgpx/libC.js',
					'/editgpx/'
					
				];
				files.forEach(element => cache.add(element));
				
				var poi = ['','person','ville','sommet','col','drink','water','plage','essence','pharmacie','banque','commerce','hotel','refuge','camping','restaurant','bar','picnic','culture','spectacle','patrimoine','patrimoine_rural','patrimoine_vegetal','patrimoine_geo','activite','vue','attraction','institution','ecole','medecin','danger','alarm','gare','airport','park','star','telecabine','bus','ferry','tunnel','Waypoint','artisan', 'producteur', 'river','bienetre','info','toilettes','rechargeve','boulangerie','velo'];
				poi.forEach(element => cache.add('/img/marqueurs/poi_' + element + '.png'));
			});
		})
		.then(function() { // cache de l'index du suivi + son
			caches.open('visu_suivi').then(function(cache) {
				var files = [
					'/suivi/',
					'/suivi/out_track.mp3'
				];
				files.forEach(element => cache.add(element));
			});
		});
});

self.addEventListener('fetch', (event) => {
	if(event.request.method!='POST') {
		
		const url = new URL(event.request.url);
		const path = url.pathname;
		const origin = url.origin;
		
		// Normalisation de l'URL pour le cache
		const cacheUrl = origin + path;
	  
		// Définir les dossiers et types de fichiers à exclure du cache
		const excludePaths = ['/photos/', '/capture/', '/suivi/', '/img/cartes_ign/', '/story/', '/qrcode_img/'];
		const fileTypes = ['.jpg', '.gif', '.png', '.css', '.js'];
	  
		// Vérifier si l'URL doit être mise en cache
		const shouldCache = fileTypes.some(type => path.includes(type)) && excludePaths.every(excluded => !path.includes(excluded));

		if (shouldCache && origin === 'https://www.visugpx.com') {
			event.respondWith(
				caches.open('visu_assets').then(cache => {
					return cache.match(cacheUrl).then(response => {
						const fetchPromise = fetch(event.request).then(networkResponse => {
							cache.put(cacheUrl, networkResponse.clone());
							return networkResponse;
						});
						return response || fetchPromise;
					});
				})
			);
		}
		
		//  tous les fichiers du repertoire suivi & capture ->  cache visu_suivi sinon network. Mise en cache uniquement de l'index (pour mise a jour compte), les fichiers spécifiques ont été mis à jour par le fonction cache premium
		else if (cacheUrl.indexOf('https://www.visugpx.com/suivi/')==0 || cacheUrl.indexOf('https://www.visugpx.com/capture/')==0) {
			event.respondWith(
				caches.open('visu_suivi').then(function(cache) {
					return cache.match(event.request).then(function(response) {
						var fetchPromise = fetch(event.request).then(function(networkResponse) {
							if(cacheUrl=='https://www.visugpx.com/suivi/') cache.put(event.request, networkResponse.clone());
							return networkResponse;
						})
						return response || fetchPromise;
					})
				})
			);	
		}
		
		// page zone -> network sinon visu_assets + mise en cache
		else if (cacheUrl.indexOf('https://www.visugpx.com/zones/')==0) {
			event.respondWith(
				fetch(event.request)
					.then(function(networkResponse) {
						caches.open('visu_assets').then(function(cache) {
							cache.put(event.request, networkResponse.clone());
						})
						return networkResponse.clone();
					})
					.catch(function() {
						return caches.match('https://www.visugpx.com/zones/').then(function(response) {
							return response;
						})					
					})
				
				
				
			);	
		}
		
		// page editgpx -> network sinon visu_assets + mise en cache
		else if (cacheUrl.indexOf('https://www.visugpx.com/editgpx/')==0) {
			event.respondWith(
				fetch(event.request)
					.then(function(networkResponse) {
						caches.open('visu_assets').then(function(cache) {
							cache.put(event.request, networkResponse.clone());
						})
						return networkResponse.clone();
					})
					.catch(function() {
						return caches.match('https://www.visugpx.com/editgpx/').then(function(response) {
							return response;
						})					
					})
				
				
				
			);	
		}
		
		else if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
			event.respondWith(
				fetch(event.request).catch(function() {
					if (!navigator.onLine) {
						return caches.match(event.request)
							.then(response => {
								return response || caches.match('/index_cache.php');
							});
					}
				})
			);
		}
	
	}
	else {
		// api share_target pour que visugpx les fichiers gpx dont il est la cible (voir manifest)
		const url = new URL(event.request.url);
		if (url.pathname === '/share_target') {
			event.respondWith(Response.redirect('/editgpx/'));
			event.waitUntil(async function () {
				const data = await event.request.formData();
				const client = await self.clients.get(event.resultingClientId || event.clientId);
				const file = data.get('file');
				console.log(file, client);
				client.postMessage({ file, action: 'load-file'});
			}());
		
		}
	}
});

// notifications push
self.addEventListener('push', event => {
    const dataJSON = event.data.json();
    const options = {
        body: dataJSON.body,
		icon: dataJSON.icon,
		badge: "/img/badge.png",
		data: {
            url: dataJSON.url,
        }
    };
    return self.registration.showNotification(dataJSON.title, options);
});

self.addEventListener('notificationclick', event => {
    const url = event.notification.data.url;
    event.notification.close();
    event.waitUntil(clients.openWindow(url));
});