//manual changes, usually for code changes
const CACHE_VERSION = "1";

//trigger a change daily
//const DATE_VERSION = "November 9, 2024";
const DATE_VERSION = "12";

let CURRENT_CACHES = {
  offline: "V:" + CACHE_VERSION + "-" + DATE_VERSION
};
staticPaths = [
	"/offline.html"
];

ignorePaths = [];

self.addEventListener('install', function(event) {

    console.log("installing offline service worker");

	event.waitUntil(

		caches.open(CURRENT_CACHES.offline).then(function(cache) {
			try{

				//add static assets that don't need credentials
				cache.addAll(staticPaths).then(function(){
                    console.log("cached offline static assets");
				});
			}
			catch(e){
				console.log(e);
			}
		})
	);
	event.waitUntil(self.skipWaiting());
});

function clientMessage(msgObj){
	clients.matchAll({
		includeUncontrolled: true
	 }).then(function(allClients){
		for(var i in allClients){
			clients.get(allClients[i].id).then(function(client){
				client.postMessage(msgObj);
			});
		}
	});
}

self.addEventListener('fetch', function(event) {

  // Only fall back for HTML documents.
  var request = event.request;
  // && request.headers.get('accept').includes('text/html')

  if (request.method === 'GET' && !request.url.includes("google")) {
    // `fetch()` will use the cache when possible, to this examples
    // depends on cache-busting URL parameter to avoid the cache.

    event.respondWith(
      fetch(request).catch(function(error) {
        // `fetch()` throws an exception when the server is unreachable but not
        // for valid HTTP responses, even `4xx` or `5xx` range.

		var ignoreRequest = false;

		for(var z in ignorePaths){console.log(ignorePaths[z]);
			if(request.url.includes(ignorePaths[z])){console.log("inside!");
				ignoreRequest = true;
				var skippedRequest = request.url;
				break;
			}
		}

		//don't do anything if its a url that we ignore
		if(!ignoreRequest){

            tempURL = location.protocol + "//" + location.host + "/offline.html";

			return caches.match(tempURL);

		}
		else{
			console.log("skipped request: " + skippedRequest);
		}
      })
    );
  }
  // Any other handlers come here. Without calls to `event.respondWith()` the
  // request will be handled without the ServiceWorker.
});

self.addEventListener('message', function handler (event) {
	caches.open(CURRENT_CACHES.offline).then(function(cache) {
	});
});

self.addEventListener('activate', function(event) {

	//kickstart the service worker, otherwise fetch events
	//won't catch until we do a hard refresh
	self.clients.claim();

	var cacheWhitelist = [CURRENT_CACHES.offline];

	//remove all caches except the most current one
	event.waitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
			cacheNames.map(function(cacheName) {
				if (cacheWhitelist.indexOf(cacheName) === -1) {
					return caches.delete(cacheName);
				}
				})
			);
		})
	);
});