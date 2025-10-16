
const date = new Date(), v2 = "v" + date.getDate(), CACHE_NAME = 'pwa-cache-wallpapers-v1';

date.setDate(date.getDate() - 1);

const v1 = "v" + date.getDate();

console.log(v1, v2);

const addResourcesToCache = async (resources) => {
	const cache = await caches.open(v2);
	await cache.addAll(resources);
};

const putInCache = async (request, response) => {
	
	const url = request.url, uri = new URL(request.url), is_wallpaper = new RegExp("^/(wallpapers|tb_images)/").test(uri.pathname);
	
	if(request.method!='POST' && uri.hostname == self.location.hostname && self.location.pathname!=uri.pathname/* && !is_wallpaper*/){
		const cache = await caches.open(v2);
		await cache.put(is_wallpaper ? uri.pathname : url, response);
		//console.log("putInCache", url);
	}
};

const cacheFirst = async ({
	request,
	preloadResponsePromise,
	fallbackUrl
}) => {
	
	const url = request.url, uri = new URL(request.url), is_wallpaper = new RegExp("^/(wallpapers|tb_images)/").test(uri.pathname), isConstUrl = new RegExp("^/wallpapers/").test(uri.pathname);

	// First try to get the resource from the cache
	const responseFromCache = await caches.match(is_wallpaper ? uri.pathname : url);
	if (responseFromCache && request.method!='POST') {
		const dateAsString = responseFromCache.headers.get('Date');
		const dateAsMillis = Date.parse(dateAsString);
		if(isConstUrl || Date.now() - dateAsMillis < 1000*60*60){
			//console.log("responseFromCache = ", url);
			return responseFromCache;
		}
	}

/*
	// Next try to use (and cache) the preloaded response, if it's there
	const preloadResponse = await preloadResponsePromise;
	if (preloadResponse) {
		console.info("using preload response", preloadResponse);
		putInCache(request, preloadResponse.clone());
		return preloadResponse;
	}
*/

	// Next try to get the resource from the network
	try {
		const responseFromNetwork = await fetch(request);
		// response may be used only once
		// we need to save clone to put one copy in cache
		// and serve second one
		putInCache(request, responseFromNetwork.clone());
		//console.log("responseFromNetwork = ", url);
		return responseFromNetwork;
	} catch (error) {
		const fallbackResponse = await caches.match(is_wallpaper ? uri.pathname : url);
		//const fallbackResponse = await caches.match(fallbackUrl);
		if (fallbackResponse) {
			//console.log("fallbackResponse = ", url);
			return fallbackResponse;
		}
		// when even the fallback response is not available,
		// there is nothing we can do, but we must always
		// return a Response object
		return new Response("The network is unavailable. Check the Wi-Fi and internet connection...", {
			status: 408,
			headers: {
				"Content-Type": "text/plain"
			},
		});
	}
};

const deleteCache = async (key) => {
	await caches.delete(key);
};

const deleteOldCaches = async () => {
	const cacheKeepList = [v2, v1, CACHE_NAME];
	const keyList = await caches.keys();
	const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
	await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
	if(navigator.onLine){
		event.waitUntil(deleteOldCaches());
	}
});

/*
addEventListener("activate", (event) => {
	
	event.waitUntil(
		(async () => {
			if (self.registration.navigationPreload) {
				// Enable navigation preloads!
				await self.registration.navigationPreload.enable();
			}
		})(),
	);
});
*/

self.addEventListener("install", function(event){
	
	self.skipWaiting();
	
	/*
	event.waitUntil(
		addResourcesToCache([
			"/",
			"/index.html",
			"/style.css",
			"/app.js",
			"/image-list.js",
			"/star-wars-logo.jpg",
			"/gallery/bountyHunters.jpg",
			"/gallery/myLittleVader.jpg",
			"/gallery/snowTroopers.jpg",
		]),
	);
	*/
});

self.addEventListener("fetch", function(event){
	
	const url = new URL(event.request.url);

	if(event.request.method === 'POST' && url.pathname.indexOf('/_share-target/')==0) {
		
		event.respondWith((async () => {
			
			const formData = await event.request.formData();
			const mediaFiles = formData.getAll('media');
			const cache = await caches.open(CACHE_NAME);

			for (const mediaFile of mediaFiles) {
				if (!mediaFile.name) {
					console.log('Sorry! No name found on incoming media.');
					continue;
				}

				const cacheKey = new URL('/_share-target/image_' + Date.now() + '_' + mediaFile.name, self.location).href;
				
				let iStore = servers.db.transaction(["images_from_share"], "readwrite").objectStore("images_from_share"), request = iStore.put({media_url: cacheKey, type: mediaFile.type, name: mediaFile.name, timestamp: Date.now()});
				
				await cache.put(
					cacheKey,
					new Response(mediaFile, {
						headers: {
						'content-length': mediaFile.size,
						'content-type': mediaFile.type,
						},
					})
				);
			}

			return Response.redirect('/editor/?from=share-target', 303);
			
		})());		
	}
	
	if(event.request.method === 'GET' && url.pathname.indexOf('/_share-target/image_')==0) {
		event.respondWith(
			caches.match(event.request).then(function(response) {
				return response || fetch(event.request);
			})
		);		
	}
	
	event.respondWith(
		cacheFirst({
			request: event.request,
			preloadResponsePromise: event.preloadResponse,
			fallbackUrl: "/gallery/myLittleVader.jpg"
		}),
	);
});

const cardsRegExp = typeof(Response.redirect)=="function" ? new RegExp('https?://((?:[a-z]+\\.)?million-wallpapers.ru)(/(?:wallpapers|tb_images)/.+\\.(?:jpg|png))') : new RegExp('^/fake_url/');

let servers = {
	content_type: ["video", "image"],
	test_time: 0,
	check_interval: 7*60*1000,
	units: [
		'million-wallpapers.ru', 'million-wallpapers.com'
	],
	time: {},
	fetch: function(domain){
		fetch('https://' + domain + '/img/service-worker-test.jpg', {method: "GET", cache: "reload"}).then(function(response){			
			if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);			
			return response.blob();
		}).then(function(myBlob){
			servers.setTime(domain, new Date().getTime() - servers.test_time);
			console.log(domain + ' -> ' + servers.time[domain]);
		}).catch(function(error){
			servers.setTime(domain, 60*60*1000);
			console.error(domain + ' origin error', error);
		});
	},
	setTime: function(domain, time){
		
		//if(domain=='i.million-wallpapers.com') time = time/100;
		
		servers.time[domain] = time;
		
		setTimeout(servers.insertIntoDB, 3000, domain, time);
	},
	insertIntoDB: function(domain, time){
		
		let dStore = servers.db.transaction(["domains"], "readwrite").objectStore("domains"), request = dStore.put({domain: domain, time: time, info: new Date().toUTCString()});
	},
	checkSpeed: function(){
		
		this.test_time = new Date().getTime();
		
		for(let i=0; i<this.units.length; i++){
			this.fetch(this.units[i]);
		}
	},
	unit: function(){

		for(let i=0, domain; i<this.units.length; i++){
			domain = this.units[i];
			this.time[domain] = 60*1000;
		}

		let request = indexedDB.open("SW_editor_DB", 1);

		request.addEventListener("error", function(event) {
			console.log("Database error: " + event.target.errorCode);
		});

		request.addEventListener("success", function(event) {
			
			console.log('DB success');
			
			servers.db = event.target.result;
			
			let dStore = servers.db.transaction(["domains"], "readwrite").objectStore("domains");
			
			dStore.openCursor().addEventListener("success", function(event) {
				let cursor = event.target.result;
				if(cursor){
					if(servers.units.indexOf(cursor.value.domain)!=-1){
						if(!servers.time[cursor.value.domain]){
							servers.time[cursor.value.domain] = cursor.value.time;						
						}
					}
					else{
						cursor.delete();
					}
					
					cursor.continue();
				}
			});
			
			caches.open(CACHE_NAME).then(function(cache){
				
				let iStore = servers.db.transaction(["images_from_share"], "readwrite").objectStore("images_from_share");
			
				iStore.index("timestamp").openCursor(IDBKeyRange.only(0)).addEventListener("success", function(event) {
					
					let cursor = event.target.result;
					
					if(cursor){
						cache.delete(cursor.value.media_url);
						cursor.delete();
						cursor.continue();
					}
				});
			});
		});

		request.addEventListener("upgradeneeded", function(event) {
			
			console.log('DB upgradeneeded');
			
			servers.db = event.target.result;
			
			servers.db.createObjectStore("domains", {
				keyPath: "domain"
			});
			
			let objectStore = servers.db.createObjectStore("images_from_share", {
				keyPath: "media_url"
			});
			
			objectStore.createIndex("timestamp", "timestamp", {
				unique: false
			});
		});
	}
};

servers.unit();