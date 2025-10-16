// var CACHE_NAME = 'app_serviceworker_v_1',
// // ссылки на кэшируемые файлы
//     cacheUrls = [
//         './404.html'
// ];

// self.addEventListener('install', function(event) {
//     // задержим обработку события
//     // если произойдёт ошибка, serviceWorker не установится
//     event.waitUntil(
//         // находим в глобальном хранилище Cache-объект с нашим именем
//         // если такого не существует, то он будет создан
//         caches.open(CACHE_NAME).then(function(cache) {
//             // загружаем в наш cache необходимые файлы
//             return cache.addAll(cacheUrls);
//         })
//     );
// });



// Set a name for the current cache
// const precacheVersion = 2;
// let CACHE_NAME = 'sw-v1'
// const precacheName = 'precache-v' + precacheVersion;

// // Default files to always cache
// var precacheFiles = [
// 	"./css/styles.css",
// 	"./js/vendors.js",
// 	"./js/main.js",
// 	"./offline.html",
// 	"./images/favicon.png",
// 	"./sm.webmanifest",
// 	"./images/components/checked.svg ",
// 	"./files/images/components/round.svg",
// 	"./files/images/components/tree.svg",
// 	"./files/images/components/lemon.svg",
// 	"./files/images/components/arrow.svg",
// 	"./files/images/components/fire.svg",
// 	"./files/images/components/boomerang.svg",
// 	"./files/images/components/duck.svg",
// 	"./js/sww.js",
// 	"./js/localForage.js",
// ];

// self.addEventListener('install', function(e) {
// 	// var offlineRequest = new Request('offline.html');

// 	// self.skipWaiting();

// 	e.waitUntil(
// 		caches.open(CACHE_NAME).then(function(cache) {
// 			return cache.addAll('./404.html');
// 		}) // end caches.open()
// 	); // end e.waitUntil

// 	// e.waitUntil(
// 	// 	fetch(offlineRequest).then(function (response) {
// 	// 		return caches.open('offline').then(function (cache) {
// 	// 			return cache.put(offlineRequest, response);
// 	// 		});
// 	// 	})
// 	// );
// });

// self.addEventListener('fetch', (e) => {
// 	if (e.request.method === 'GET') {
// 	  e.respondWith(
// 		caches.match(e.request)
// 		.then((cached) => {
// 		  var networked = fetch(e.request)
// 			.then((response) => {
// 			  let cacheCopy = response.clone()
// 			  caches.open(CACHE_NAME)
// 				.then(cache => cache.put(e.request, cacheCopy))
// 			  return response;
// 			})
// 			.catch(() => caches.match(offlinePage));
// 		  return cached || networked;
// 		})
// 	  )
// 	}
// 	return;
// });

// self.addEventListener('activate', (e) => {
// 	e.waitUntil(
// 		caches.keys().then((cacheNames) => {
// 			return Promise.all(cacheNames.map((thisCacheName) => {

// 				if (thisCacheName.includes("precache") && thisCacheName !== precacheName) {
// 					console.log('[ServiceWorker] Removing cached files from old cache - ', thisCacheName);
// 					return caches.delete(thisCacheName);
// 				}

// 			}));
// 		}) // end caches.keys()
// 	); // end e.waitUntil
// });

// self.addEventListener('fetch', (e) => {
// 	e.respondWith(
// 		caches.match(e.request)
// 		.then((response) => {

// 			if (response) {
// 				console.log("[ServiceWorker] Found in cache", e.request.url);
// 				return response;
// 			}

// 			return fetch(e.request)
// 				.then((fetchResponse) => {
// 					if (fetchResponse.ok) return fetchResponse;

// 					// If failed fetch
// 				})
// 				.catch((err) => {
// 					// If offline
// 					const isHTMLPage = e.request.method === "GET" && e.request.headers.get("accept").includes("text/html");
// 					if (isHTMLPage) return caches.match("/offline.html");
// 				})

// 		}) // end caches.match(e.request)


// 	); // end e.respondWith
// });


// // importScripts('./js/sww.js');
// // importScripts('./js/localforage.js');

// // var root = (function() {
// //   var tokens = (self.location + '').split('/');
// //   tokens[tokens.length - 1] = '';
// //   return tokens.join('/');
// // })();

// // var worker = new ServiceWorkerWare();

// // function tryOrFallback(fakeResponse) {
// //   return function(req, res) {
// //     if (!navigator.onLine) {
// //       console.log('No network availability, enqueuing');
// //       return enqueue(req).then(function() {
// //         return fakeResponse.clone();
// //       });
// //     }

// //     console.log('Network available! Flushing queue.');
// //     return flushQueue().then(function() {
// //       return fetch(req);
// //     });
// //   };
// // }

// // worker.post('https://dev.drupal-beginner.com/telebot/getmess?*', tryOrFallback(new Response(null, {
// //   status: 202
// // })));

// // worker.init();

// // function enqueue(request) {
// //   return serialize(request).then(function(serialized) {
// //     localforage.getItem('queue').then(function(queue) {
// //       queue = queue || [];
// //       queue.push(serialized);
// //       return localforage.setItem('queue', queue).then(function() {
// //         console.log(serialized.method, serialized.url, 'enqueued!');
// //       });
// //     });
// //   });
// // }

// // function flushQueue() {
// //   return localforage.getItem('queue').then(function(queue) {
// //     queue = queue || [];

// //     if (!queue.length) {
// //       return Promise.resolve();
// //     }

// //     console.log('Sending ', queue.length, ' requests...');
// //     return sendInOrder(queue).then(function() {
// //       return localforage.setItem('queue', []);
// //     });
// //   });
// // }

// // function sendInOrder(requests) {
// //   var sending = requests.reduce(function(prevPromise, serialized) {
// //     console.log('Sending', serialized.method, serialized.url);
// //     return prevPromise.then(function() {
// //       return deserialize(serialized).then(function(request) {
// //         return fetch(request);
// //       });
// //     });
// //   }, Promise.resolve());
// //   return sending;
// // }

// // function serialize(request) {
// //   var headers = {};
// //   for (var entry of request.headers.entries()) {
// //     headers[entry[0]] = entry[1];
// //   }
// //   var serialized = {
// //     url: request.url,
// //     headers: headers,
// //     method: request.method,
// //     mode: request.mode,
// //     credentials: request.credentials,
// //     cache: request.cache,
// //     redirect: request.redirect,
// //     referrer: request.referrer
// //   };

// //   console.log(request);

// //   if (request.method !== 'GET' && request.method !== 'HEAD') {
// //     return request.clone().text().then(function(body) {
// //       serialized.body = body;
// //       return Promise.resolve(serialized);
// //     });
// //   }
// //   return Promise.resolve(serialized);
// // }

// // function deserialize(data) {
// //   return Promise.resolve(new Request(data.url, data));
// // }