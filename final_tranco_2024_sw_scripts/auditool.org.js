// PWA Extension - service worker file
	var url = "https://www.auditool.org/",
	
	pwaExtensionVersion = "2.0.4",
	staticCacheName = "pwaExtension_static-Auditool-"+pwaExtensionVersion,
	dynamicCacheName = "pwaExtension_dynamic-Auditool-"+pwaExtensionVersion;
	console.log("PWA for "+url+" Started");
	self.addEventListener("install", function (e) {
		e.waitUntil(self.skipWaiting());
	}),

	self.addEventListener("activate", function (e) {
		return (
			e.waitUntil(
			caches.keys().then(function (e) {
			return Promise.all(
				e.map(function (e) {
					if (e !== staticCacheName && e !== dynamicCacheName) return caches.delete(e);
				})
			);
			})
		),
		self.clients.claim()
		);
	}),
		
	self.addEventListener("fetch", function (e) {
		if ("POST" != e.request.method) {
		var t = new URL(e.request.url);
		console.log(t.pathname);"/pwaextension-service-worker.js" == t.pathname ||
			t.pathname.indexOf(".mp4") > -1 ||
			e.respondWith(
				caches
					.match(e.request)
					.then(function (t) {
						return fetch(e.request)
							.then(function (t) {
								return caches.open(dynamicCacheName).then(function (a) {
									return 0 === e.request.url.indexOf("http") && a.put(e.request, t.clone()), t;
								});
							})
							.catch(function (e) {
								return t || function () {};
							});
					})
					.catch(function () {
						return caches.match("Error");
					})
			);
		}
	});
	
	// Write your custom JS
	
	