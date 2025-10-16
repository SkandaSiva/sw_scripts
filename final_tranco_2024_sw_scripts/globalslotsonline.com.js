'use strict';

const CACHE_NAME = 'static-cache-v2';

const FILES_TO_CACHE = [
	'/pwa/pwa/offline.html',
	'/pwa/pwa/offline.png'
];

self.addEventListener('install', (evt) => {
	// console.log('[GS-ServiceWorker] Install');
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			// console.log('[GS-ServiceWorker] Pre-caching offline page');
			return cache.addAll(FILES_TO_CACHE);
		})
	);
	self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
	// console.log('[GS-ServiceWorker] Activate');
	// Remove previous cached data from disk.
	evt.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== CACHE_NAME) {
					// console.log('[GS-ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);

	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	//console.log('[ServiceWorker] Fetch', event.request.url);
	const furl = new URL(event.request.url);
	//console.log(event.request);
	let req = event.request;
	if ( req.url.match("SW_INJECT_RANDOM") ) {
		//console.log('[ServiceWorker] FOUND SW_INJECT_RANDOM in URL: ' + req.url);
		req = new Request(req.url.replace("SW_INJECT_RANDOM", ("" + Math.random()).split(".").pop()));
	}
	if ( req.url.match(/module\.js$/) ) {
		//console.log('[ServiceWorker] auto anti-cash for: ' + req.url);
		req = new Request(req.url.replace("module.js", ("module.js?" + Math.floor(Date.now() / 3600000))));
	}
	event.respondWith(async function(){
		return (await caches.match(req.url))
			|| fetch(req).then((resp) => {
				if ( (req.url.split("?").length < 3) && req.url.match(/\.(json|png|jpeg|jpg|js)\?\d/gi) && !req.url.match(/\.data\.json\?/gi) ) {
					let respClone = resp.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(req, respClone);
					});
				}
				return resp;
			}).catch(error => {
				return caches.match(FILES_TO_CACHE[0]);
			});
	}());
});
