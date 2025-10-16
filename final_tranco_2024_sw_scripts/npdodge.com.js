//This is the "Offline copy of pages" service worker

//Install stage sets up the index page (home page) in the cache and opens a new cache

var _skipFetch=[
    '/shared/autocompleter/autocompleter.v2.php'
];

self.addEventListener('install', function(event) {
    var indexPage = new Request('');
    event.waitUntil(
        fetch(indexPage).then(function(response) {
            return caches.open('pwa-offline').then(function(cache) {
                return cache.put(indexPage, response);
            });
        })
    );
});


self.addEventListener('push', function (event) {
    //  console.log('Received push');
    var notificationTitle = '';
    var notificationOptions = {
        body: '',
        icon: '/shared/pwa/img-icon-192x192.png',
        badge: '/shared/pwa/img-icon-72x72.png',
        tag: 'my-next-home-notification',
        data: {
            url: '/?utm_source=push'
        }
    };

    if (event.data) {
        //console.log(event.data);
        var eventData = {};
		try {
			eventData = event.data.json();
		} catch (error) {
			eventData.data={
				"twi_title":"Notice",
				"twi_body":event.data.text(),
				"url":false
			};
		}
        notificationTitle = eventData.data.twi_title || 'Notice';
        notificationOptions.body = eventData.data.twi_body || 'You have received a new notice';
        notificationOptions.data.url=eventData.data.url || notificationOptions.data.url;
    }

    event.waitUntil(Promise.all([self.registration.showNotification(notificationTitle, notificationOptions)]));
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    var clickResponsePromise = Promise.resolve();
    if (event.notification.data && event.notification.data.url) {
        clickResponsePromise = clients.openWindow(event.notification.data.url);
    }

    event.waitUntil(Promise.all([clickResponsePromise]));
});

self.addEventListener('notificationclose', function (event) {
    //event.waitUntil(Promise.all([self.analytics.trackEvent('notification-close')]));
});


// If there's a cached version available, use it, but fetch an update for next time.
self.addEventListener('fetch', function(event) {
	//return; // BGP-85988-287 - disabled cache for now do to public user login issues.

	
	var request = event.request;

	if (request.method.toLowerCase() !== 'get') {
		return;
	}
	if (!request.url.startsWith(self.location.origin)) { //external requests like from a cdn
		return;
	}

	var localUrl = request.url.replace(self.location.origin, '');
	for (i=0;i<_skipFetch.length;i++){
		if (localUrl.startsWith(_skipFetch[i])) { // make SW skip these requests
			return;
		}
	}

	const destination = request.destination;

	//https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
	switch (destination) {
		case 'style':
		case 'script':
		case 'font':
		case 'image': {
			event.respondWith(
				caches.open('pwa-offline').then(function(cache) {
					 return cache.match(event.request).then(function(response) {
						var fetchPromise = fetch(event.request).then(function(networkResponse) {
							 cache.put(event.request, networkResponse.clone());
							 return networkResponse;
						 });
						 return response || fetchPromise;
					 });
				 })
			);
			return;
		}
		case 'document': {
			return;
		}
		// All `XMLHttpRequest` or `fetch()` calls where
		// `Request.destination` is the empty string default value
		default: {
			return;
		}
	}

});

/*
// If there's a cached version available, use it, but fetch an update for next time.
self.addEventListener('fetch', function(event) {
    return; // BGP-85988-287 - disabled cache for now do to public user login issues.
    // var request = event.request;

    // if (request.method.toLowerCase() !== 'get') {
    //     return;
    // }
    // if (!request.url.startsWith(self.location.origin)) { //external requests like from a cdn
    //     return;
    // }

    // var localUrl = request.url.replace(self.location.origin, '');
    // for (i=0;i<_skipFetch.length;i++){
    //     if (localUrl.startsWith(_skipFetch[i])) { // make SW skip these requests
    //         return;
    //     }
    // }

    // event.respondWith(
    //     caches.open('pwa-offline').then(function(cache) {
    //         return cache.match(event.request).then(function(response) {
    //             var fetchPromise = fetch(event.request).then(function(networkResponse) {
    //                 cache.put(event.request, networkResponse.clone());
    //                 return networkResponse;
    //             });
    //             return response || fetchPromise;
    //         });
    //     })
    // );
});
*/