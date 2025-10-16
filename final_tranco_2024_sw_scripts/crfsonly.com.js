/*
	https://codelabs.developers.google.com/codelabs/your-first-pwapp/#4
	https://www.codementor.io/@malimirkeccita/how-i-built-my-first-progressive-web-app-pwa-sb-10w3un6bpo?utm_swu=3470
*/

/**
 * https://developers.google.com/codelabs/pwa-training/pwa03--going-offline#3
 * */

const CACHE_NAME = 'offline-cache-v2.22';
const FILES_TO_CACHE = [
	'https://www.crfsonly.com/offline.html'
];
const OFFLINE_EXCLUDE = [
	'https://www.crfsonly.com/mm5/admin.mvc',
	'https://www.crfsonly.com/mm5/json.mvc'
]

self.addEventListener('install', (event) => {
  /* Skips the update cycle https://developer.chrome.com/docs/workbox/service-worker-lifecycle*/
  self.skipWaiting();
  
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log('[ServiceWorker] Install Event! V', CACHE_NAME);
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener('activate', (event) => {
	/* console.log('[ServiceWorker] Activate Event!'); */
	event.waitUntil(
		caches.keys().then(keyList => Promise.all(keyList.map((key) => {
			if (key !== CACHE_NAME) {
				console.log('[ServiceWorker] Removing Old Cache', key);
				return caches.delete(key);
			}
		})))
	);
});

self.addEventListener('fetch', (event) => {
	/* console.log('[ServiceWorker] Fetch Event in Progress!'); */

	for (let i = 0; i < OFFLINE_EXCLUDE.length; i++) {
		if ( (event.request.url.indexOf(OFFLINE_EXCLUDE[i]) !== -1) || (event.request.referrer.indexOf(OFFLINE_EXCLUDE[i]) !== -1)) {
			//console.log('[ServiceWorker] Fetch Event Ignored. URL in Exclude List.', event.request.url);
			return false;
		}
	}

	if (event.request.mode === 'navigate') {
		let page_to_load; 
		event.respondWith(
			( async () =>{
				/* This specif error was happening when pressing the "go forward" arrow, to a page that needs a form to be sumbmitted, like going from OCST to OSEL */
				if (event.request.cache === 'only-if-cached') {
					/* Instead of showing error, just load the same page you came from */
					page_to_load = await(fetch(event.request.referrer));
				}
				else{
					/* Check to see if you can connect to the page requested, otherwise load cache */
					try{
						page_to_load = await( fetch(event.request) );
					}
					catch(error){
						page_to_load = caches.open(CACHE_NAME).then(cache => cache.match('offline.html'))
					}
				}
				return page_to_load
			})(),
		);
	}
});
