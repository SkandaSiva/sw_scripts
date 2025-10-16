
			const score_cache_app = {
				version   : 'score-app-5.1.0',
				resources : ['https://aroya.io/manifest.json', 'https://aroya.io/assets/icons/app/016x016.ico', 'https://aroya.io/assets/icons/app/016x016.png', 'https://aroya.io/assets/icons/app/032x032.png', 'https://aroya.io/assets/icons/app/096x096.png', 'https://aroya.io/assets/icons/app/128x128.png', 'https://aroya.io/assets/icons/app/160x160.png', 'https://aroya.io/assets/icons/app/192x192.png', 'https://aroya.io/assets/icons/app/256x256.png', 'https://aroya.io/assets/icons/app/512x512.png', 'https://aroya.io/css/app.5.1.0.css', 'https://aroya.io/js/app.5.1.0.js', 'https://aroya.io/assets/fonts/addium-serif-400.woff2', 'https://aroya.io/assets/fonts/addium-mono-400.woff2', 'https://aroya.io/assets/fonts/addium-sans-400.woff2', 'https://aroya.io/assets/fonts/addium-sans-400-italic.woff2', 'https://aroya.io/assets/fonts/addium-sans-500.woff2', 'https://aroya.io/assets/fonts/addium-sans-500-italic.woff2']
			};

			const score_cache_content = {
				version   : 'score-content-5.1.0',
				resources : ['https://aroya.io/api/navigation/main.json', 'https://aroya.io/api/navigation/footer.json', 'https://aroya.io/api/navigation/utility.json', 'https://aroya.io/api/navigation/legal.json', 'https://aroya.io/api/tracker.json', 'https://aroya.io/api/webpush.json']
			};

			const score_cache_media = {
				version   : 'score-media',
				resources : []
			};

			self.addEventListener('install', (e) => {
				e.waitUntil(Promise.all([
					caches.open(score_cache_app.version).then(
						(c) => {
							//console.log('SCORE SW cache ' + score_cache_app.version, score_cache_app.resources);
							return c.addAll(score_cache_app.resources);
						}
					),
					caches.open(score_cache_content.version).then(
						(c) => {
							//console.log('SCORE SW cache ' + score_cache_content.version, score_cache_content.resources);
							return c.addAll(score_cache_content.resources);
						}
					),
					caches.open(score_cache_media.version).then(
						(c) => {
							//console.log('SCORE SW cache ' + score_cache_media.version, score_cache_media.resources);
							return c.addAll(score_cache_media.resources);
						}
					)
				]));
			});

			self.addEventListener('activate', (e) => {
				//console.log('SCORE SW activate');

				self.skipWaiting();

				e.waitUntil(
					caches.keys().then(
						(keyList) => {
							return Promise.all(
								keyList.map(
									(key) => {
										if (key !== score_cache_app.version ||
											key !== score_cache_content.version ||
											key !== score_cache_media.version) {
												//console.log('SCORE SW remove outdated cache: ', key);
												return caches.delete(key);
										}
									}
								)
							);
						}
					)
				);

				//Force reload on update
				const tabs = self.clients.matchAll({type: 'window'}).then((tabs)=>{
					tabs.forEach((tab) => {
						tab.navigate(tab.url)
					})
				});

				return self.clients.claim();
			});

			self.addEventListener('message', (e) => {
				switch (e.data) {
					case 'SCORE_INSTALL':
						self.skipWaiting();
					break;
					case 'SCORE_REFRESH':
						self.clients.matchAll({type: 'window'}).then((c) => {
							for (let i = 0 ; i < c.length ; i++) {
								c[i].navigate(c[i].url);
							}
						});
					break;
				}
			});

			self.addEventListener('fetch', (e) => {
				//Exclude Url Parts
				let exclude = ['?tok=', '.mp4'];
	
				for(let i=0; i < exclude.length; i++){
					if (e.request.url.indexOf(exclude[i]) != -1){
						e.respondWith(
							fetch(e.request)
						);
						return;
					}
				}
			
				//Exclude POST Requests
				if (e.request.method == 'POST'){
					e.respondWith(
						fetch(e.request)
					);
					return;
				}
				
				//Exclude POST Requests
				let whitelist   = ['https://cms.aroya.io/api', 'https://addium-aroya.sfo3.digitaloceanspaces.com', 'https://aroya.io'];
				let whitelisted = false;
				for(let i=0; i < whitelist.length; i++){
					if (e.request.url.indexOf(whitelist[i]) != -1){
						whitelisted = true;
						break;
					}
				}

				if(!whitelisted){
					e.respondWith(
						fetch(e.request)
					);
					return;
				}

				const nf_score_cache_app = () => {
					e.respondWith(
						fetch(e.request).then((response) => {
							return caches.open(score_cache_app.version).then(
								(cache) => {
									//console.log('SCORE SW SET cache ' + score_cache_app.version, e.request.url, response);
									cache.put(e.request, response.clone());

									return response;
								}
							)
						}).catch(
							(err) => {
								return caches.match(e.request);
							}
						)
					);
				};

				const nf_score_cache_media = () => {
					e.respondWith(
						fetch(e.request).then((response) => {
							return caches.open(score_cache_media.version).then(
								(cache) => {
									//console.log('SCORE SW SET cache ' + score_cache_media.version, e.request.url, response);
									cache.put(e.request, response.clone());

									return response;
								}
							)
						}).catch(
							(err) => {
								return caches.match(e.request);
							}
						)
					);
				};

				const nf_score_cache_content = () => {
					e.respondWith(
						fetch(e.request).then((response) => {
							return caches.open(score_cache_content.version).then(
								(cache) => {
									//console.log('SCORE SW SET cache ' + score_cache_content.version, e.request.url, response);
									cache.put(e.request, response.clone());

									return response;
								}
							)
						}).catch(
							(err) => {
								return caches.match(e.request);
							}
						)
					);
				};
				
				//BASIC RESSOURCES
				for(let i=0; i < score_cache_app.resources.length; i++){
					if (e.request.url.indexOf(score_cache_app.resources[i]) != -1){
						//console.log('SCORE SW CACHE APP RESSOURCE ' + e.request.url);
						nf_score_cache_app();
						return;
					}
				}

				for(let i=0; i < score_cache_content.resources.length; i++){
					if (e.request.url.indexOf(score_cache_content.resources[i]) != -1){
						//console.log('SCORE SW CACHE CONTENT RESSOURCE ' + e.request.url);
						nf_score_cache_content();
						return;
					}
				}

				for(let i=0; i < score_cache_media.resources.length; i++){
					if (e.request.url.indexOf(score_cache_media.resources[i]) != -1){
						//console.log('SCORE SW CACHE MEDIA RESSOURCE ' + e.request.url);
						nf_score_cache_media();
						return;
					}
				}

				//GENERAL RESSOURCES
				//console.log('SCORE SW CACHE DESTINATION ' + e.request.destination);

				switch(e.request.destination){
					case 'manifest':
					case 'style':
					case 'script':
					case 'worker':
					case 'serviceworker':
					case 'sharedworker':
					case 'audioworklet':
					case 'paintworklet':
						nf_score_cache_app();
						return;
					
					case 'object':
					case 'embed':
					case 'iframe':
					case 'font':
					case 'audio':
					case 'image':
					case 'video':
					case 'track':
						nf_score_cache_media();
						return;

					case 'document':
					case 'frame':
					case 'report':
					case 'xslt':
					default:
						nf_score_cache_content();
						return;
				}
			});

			/*
			self.addEventListener('push', (e) => {
				//if (!(self.Notification && self.Notification.permission === 'granted')) {
				//	return;
				//}
				
				let sendNotification = body => {
					let str = body;
					let message_array = str.split('<br>');
					let notificationOptions = {
						body: message_array[1],
						icon: message_array[2],
						badge: message_array[2],
						tag: message_array[2],
						data: {
							url: message_array[3]
						}
					};
					return self.registration.showNotification(message_array[0],
						notificationOptions);
				};

				if (e.data) {
					let message = e.data.text();
					e.waitUntil(sendNotification(message));
				}
			});
			*/

			/*
			self.addEventListener('notificationclick', (e) => {
				
				e.notification.close();
				// console.log('notification click');
				Promise.resolve();
				if (e.notification.data && e.notification.data.url) {
					clients.openWindow(e.notification.data.url);
				}
			});
			*/

			/*
			self.addEventListener('notificationclose', (e) => {
				e.waitUntil(
					Promise.all([
					])
				);
			});
			*/

			/*
			//SERVICE WORKER BACKGROUND SYNC
			self.addEventListener('sync', (e) => {
				if (e.id == 'update-leaderboard') {
					e.waitUntil(async function () {
						let cache = await caches.open('mygame-dynamic');
						await cache.add('/leaderboard.json');
					}());
				}
			});
			*/
		