// var CACHE_STATIC = 'static2';
// var CACHE_DYNAMIC = 'dynamic2';

// Listen for install event, set callback
// TODO Définir les fichiers de base à cacher
// Voir si l'on peut récupérer le no mdu fichier caché Ex : vendor~2019-07-12-17-51-44-000~cache.css
// self.addEventListener('install', function (event) {
// 	event.waitUntil(
// 		caches.open(CACHE_STATIC)
// 			.then(function (cache) {
// 				cache.addAll([
// 				])
// 			})
// 	)
// });


// self.addEventListener('activate', function (event) {
// 	event.waitUntil(
// 		caches.keys()
// 			.then(function (keyList) {
// 				return Promise.all(keyList.map(function (key) {
// 					if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
// 						return caches.delete(key);
// 					}
// 				}));
// 			}).catch(function (err) {
// 				console.log(err);
// 			})
// 	);

// 	return self.clients.claim();
// });

//self.addEventListener('fetch', function (event) {
//	event.respondWith(
//		fetch(event.request)
//			// .catch(function(err) {
//			// 	// return caches.match(event.request)
//			// })
//	);
//});

// TODO cache dynamic
// self.addEventListener('fetch', function (event) {
// 	event.respondWith(
// 		caches.match(event.request)
// 			.then(function (response) {
// 				if (response) {
//                    // console.log( 'fetch response', response );
// 					return response;
// 				} else {
// 					return fetch(event.request)
// 						.then(function (res) {
// 							return caches.open(CACHE_DYNAMIC)
// 								.then(function (cache) {
//                                  //  console.log( 'fetch response', event.request.url );
// 									cache.put(event.request.url, res.clone());
// 									return res;
// 								})
// 						})
// 						.catch(function (err) {
//                            console.log( 'fetch error', err );
// 						});
// 				}
// 			})
// 	);
// });
