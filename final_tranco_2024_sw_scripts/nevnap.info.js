var filesToCache = []; //Pre cache
var staticCacheName = 'pages-cache-vs';

/**
 * Ha még nincs regisztrálva
 * Előre be lehet állítani cachelendő fájlokat
 * @type type
 */
self.addEventListener('install', function (event) {
	
	var info = location.href.match(/\d*$/);
	if(info){
		info = info[0];
	}else{
		info = '0';
	}
	console.log('SW INFO', info);
	staticCacheName += info;
	
	//Ha nincs cachebe, akkor új cachet kell nyitni és a régit törölni
	caches.has(staticCacheName).then(function(hasCache) {
		if(!hasCache){ //Régi cache törlése
			removeOldCaches(staticCacheName);
		}
	});
	
});

/**
 * Első oldaltöltéskor
 */
self.addEventListener('activate', function (event) {
	console.log('SW ACTIVE');
	//clearSWCache();
});

self.addEventListener('fetch', function (event) {
		
	domainRegexp = new RegExp("^" + self.registration.scope);
	if (event.request.method === 'GET' && domainRegexp.test(event.request.url) && !/(admin|welcome.gif|.php)/.test(event.request.url)) {
				
		//Egyelőre a disk cacheből hamarabb előhozza mint a service worker azért network aztán cache
		if (/(.jpg|.png|.jpeg|.svg|.ico|.eot|.svg|.ttf|.woff)(\?[a-z=0-9]*)?$/.test(event.request.url)) {	//|.html
			cacheAndUpdate(event);
		} else if(/(.js|.css)$/.test(event.request.url)) {
			networkOrCache(event);
		}else{	//Nincs cache
			networkOrCache(event);
		}

	}
});

function cacheAndUpdate(event) {
	event.respondWith(fromCache(event.request));
}

function networkOrCache(event) {

	//Ha network nincs, akkor cacheből szedi
	event.respondWith(
		fromNetwork(event.request, 100).then(function (response) {
			update(event.request, response.clone());	//cache refresh
			return response;
		}).catch(function (err) {
			//console.log("START LOAD FROM CACHE", event.request.url, err);
			return fromCache(event.request);
		})
	);

}

function fromCache(request) {

	var hasQuery = request.url.indexOf('?') != -1;

	return caches.open(staticCacheName).then(function (cache) {
		return cache.match(request, { ignoreSearch: hasQuery }).then(function (response) {
			return response || fetch(request).then(function (response) {
				cache.put(request, response.clone());
				return response;
			});
		});
	}, function (reason) {
		console.log("REJECTED CACHE", reason);
	});
}

function update(request, response) {

	if (response) {
		caches.open(staticCacheName).then(function (cache) {
			cache.put(request, response);
		});
	} else {
		return caches.open(staticCacheName).then(function (cache) {
			return fetch(request).then(function (response) {
				return cache.put(request, response);
			});
		});
	}
}

function fromNetwork(request, timeout) {
	return new Promise(function (fulfill, reject) {
		fetch(request).then(function (response) {
			fulfill(response);
		}, reject);
	});
}

function removeOldCaches(noDelete){
	
	caches.keys().then(function(cacheNames) {
		return Promise.all(
			cacheNames.filter(function(cacheName) {
				if(noDelete != cacheName){
					return true;
				}else{
					return false;
				}
			}).map(function(cacheName) {
				console.log("REMOVE CACHE: " + cacheName);
				return caches.delete(cacheName);
			})
		);
	});
	
}