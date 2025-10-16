const CACHE_NAME = "v1";
let workobj = {};

self.addEventListener("install", event => {
	/*
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll([]))
	);
	*/
});

self.addEventListener('activate', () =>  clients.claim());

const broadcastChannel = new BroadcastChannel("visitor_channel");
broadcastChannel.addEventListener("message", ({data, origin}) => {	
  if (origin == location.origin && data && (typeof (data=JSON.parse(data)) == "object"))
	  workobj = Object.assign(workobj, data);
});

self.addEventListener('fetch', event => {
	
	const requestURL = new URL(event.request.url);
	
	if (requestURL.origin == location.origin && event.request.mode == 'navigate' && event.request.method == 'GET') {
		
		const baseURL = requestURL.pathname.split('/').pop();
		const [fURL, exURL] = baseURL.split(/\.(?=[^\.]+$)/);

		
			let modHeaders, modRequest;
			if (workobj?.pwa) {				
				modHeaders = new Headers(event.request.headers);
				modHeaders.set('pwa', '1');
				modRequest = new Request(event.request, {headers: modHeaders});
			}			
			modRequest = modRequest ? modRequest: event.request;

			event.respondWith(isReachable().then(r => r ? fetch(modRequest).then(response => {	
															let clone = response.clone();
															caches.open(CACHE_NAME).then(cache => cache.put(modRequest, clone));
															return response;
														})
														:caches.open(CACHE_NAME).then(cache => cache.match(modRequest))));			
	}


});

function isReachable() {
  return fetch(location.origin+"/robots.txt", {method: 'HEAD', mode: 'no-cors'})
	.then(resp =>  resp && (resp.ok || resp.type === 'opaque'))
	.catch(e => {});
}
