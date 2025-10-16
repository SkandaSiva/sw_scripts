const offlineResources = [
	"/template/offline/offline.html",
	"/template/offline/bootstrap.min.css",
	"/template/offline/signin.css",
	"/template/offline/erodium.png",
	"/template/offline/badge.png",
];


const OFFLINE_VERSION = 1;
const CACHE_NAME = "erodium-cache-v"+OFFLINE_VERSION;
// Customize this with a different URL if needed.
const OFFLINE_URL = "/template/offline/offline.html";

self.addEventListener("install", (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			// Setting {cache: 'reload'} in the new request will ensure that the
			// response isn't fulfilled from the HTTP cache; i.e., it will be from
			// the network.
			//await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
			await cache.addAll(offlineResources);
		})()
  	);
	// Force the waiting service worker to become the active service worker.
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	// Tell the active service worker to take control of the page immediately.
	self.clients.claim();
});

self.addEventListener("fetch", (event) => {
	// We only want to call event.respondWith() if this is a navigation request
	// for an HTML page.
	//console.log(event.request.url);
	if (event.request.mode === "navigate") {
	event.respondWith(
		(async () => {
			try {
				// Always try the network first.
				const networkResponse = await fetch(event.request);
				return networkResponse;
			} catch (error) {
				// catch is only triggered if an exception is thrown, which is likely
				// due to a network error.
				// If fetch() returns a valid HTTP response with a response code in
				// the 4xx or 5xx range, the catch() will NOT be called.
				//console.log("Fetch failed; returning offline page instead for "+event.request.url+".", error);

				const cache = await caches.open(CACHE_NAME);
				const cachedResponse = await cache.match(OFFLINE_URL);
				return cachedResponse;
			}
			})()
		);
	}
});

self.addEventListener('push', function(event) {
	console.log('[Service Worker] Push Received.');
	//console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    var message = event.data.json();
	console.log(message);

	const title = 'Erodium Páciens';
	const options = {
		body: message.text,
		icon: 'template/offline/erodium.png',
		badge: 'template/offline/badge.png',
        sound: 'default',
		vibrate: [300, 100, 400],
		requireInteraction: true,
		actions: [
			{
				action: message.button_url,
				title: message.button_text,
				icon: 'template/offline/erodium.png'
			}
		]
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
	console.log('[Service Worker] Notification click received.');
    console.log(event);

	event.notification.close();
	console.log(event.action);
    
    var url = event.action;
    if (url == "") {
        url = event.notification.actions[0].action;
    }
    
    console.log("Opening: "+url);
	event.waitUntil(
		clients.openWindow(url)
	);
});


self.addEventListener('pushsubscriptionchange', function(event) {
	var post_data = new FormData();
    post_data.append("endpoint", event.newSubscription.endpoint);
	post_data.append("p256dh",btoa(String.fromCharCode.apply(null, new Uint8Array(event.newSubscription.getKey('p256dh')))));
	post_data.append("auth", btoa(String.fromCharCode.apply(null, new Uint8Array(event.newSubscription.getKey('auth')))));
	post_data.append("old_endpoint",event.oldSubscription.endpoint);
	fetch(
        "/api/pwa/paciens_azonnali_ertesites_aktivalva",
        {
            method: 'POST',
            body: post_data
        }
	);
	  
    console.log(event);
});