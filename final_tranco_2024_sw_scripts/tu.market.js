// This is the "Offline page" service worker

const CACHE = "pwabuilder-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";

// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
	console.log("[PWA Builder] Install Event processing");

	event.waitUntil(
		caches.open(CACHE).then(function (cache) {
			console.log("[PWA Builder] Cached offline page during install");

			//if (offlineFallbackPage === "offline.html") {
			//  return cache.add(new Response("TODO: Update the value of the offlineFallbackPage constant in the serviceworker."));
			//}

			return cache.add(offlineFallbackPage);
		})
	);
});

// If any fetch fails, it will show the offline page.
self.addEventListener("fetch", function (event) {
	if (event.request.method !== "GET") return;
	var url = new URL(event.request.url.toString());
	if (url.origin.indexOf("tu.market") == -1) {
		return;
	}

	if (/img[0-9].tu.market/.test(url.origin)) {
		return;
	}

	event.respondWith(
		fetch(event.request).catch(function (error) {
			// The following validates that the request was for a navigation to a new document
			if (
				event.request.destination !== "document" ||
				event.request.mode !== "navigate" ||
				event.request.url.toString().indexOf("isPwa=1") == -1
			) {
				return;
			}

			console.error("[PWA Builder] Network request Failed. Serving offline page " + error);
			return caches.open(CACHE).then(function (cache) {
				return cache.match(offlineFallbackPage);
			});
		})
	);
});

// This is an event that can be fired from your page to tell the SW to update the offline page
self.addEventListener("refreshOffline", function () {
	const offlinePageRequest = new Request(offlineFallbackPage);

	return fetch(offlineFallbackPage).then(function (response) {
		return caches.open(CACHE).then(function (cache) {
			console.log("[PWA Builder] Offline page updated from refreshOffline event: " + response.url);
			return cache.put(offlinePageRequest, response);
		});
	});
});
