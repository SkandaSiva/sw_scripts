// INSTALL - Sets up the index page (home page) in the cache and opens a new cache
self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open("batterx-offline").then(function(cache) {
            return cache.addAll(["error_offline.html"]);
        })
    );
});

// FETCH - If any fetch fails, show error_offline.html
self.addEventListener("fetch", function(event) {
	// Fetch only GET requests
	if(event.request.method === "GET") {
        event.respondWith(
            fetch(event.request).catch(function() {
                // Return Error Page
                return caches.open("batterx-offline").then(function(cache) {
                    return cache.match("error_offline.html");
                });
            })
        );
    }
});
