if( registration.scope.includes('m.shemalestube.com') ) {

	var CACHE_NAME = 'mobileCache-1.1.0';
	
	var cacheUrls = [
		//	CSS / Fonts
		'https://fonts.googleapis.com/css?family=Oswald',
		'https://fonts.googleapis.com/css?family=Roboto',
		'https://cdn4.shemalestube.com/templates/mobile/css/style.min.css',
		'https://cdn4.shemalestube.com/templates/mobile/css/fontawesome-all.min.css',
		//	Javascript
		'https://cdn4.shemalestube.com/templates/mobile/js/main.js',
		//	Images
		'https://cdn4.shemalestube.com/templates/mobile/images/logo.png'
	];
	
} else if( registration.scope.includes('www.shemalestube.com') || registration.scope.includes('dev.shemalestube.com') ) {
	
	var CACHE_NAME = 'desktopCache-1.1.0';
	
	var cacheUrls = [
		//	CSS / Fonts
		'https://fonts.googleapis.com/css?family=Oswald',
		'https://fonts.googleapis.com/css?family=Roboto',
		'https://cdn4.shemalestube.com/templates/dark/css/style.min.css',
		'https://cdn4.shemalestube.com/templates/dark/css/fontawesome-all.min.css',
		//	Javascript
		'https://cdn4.shemalestube.com/templates/dark/js/main.js',
		'https://cdn4.shemalestube.com/templates/dark/js/jquery.hoverIntent.min.js',
		//	Images
		'https://cdn4.shemalestube.com/templates/dark/images/logo.png'
	];

}

//console.log( registration.scope )


//
//	Install action
//
self.addEventListener('install', function(event) {
	
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(cacheUrls);
		})
	);
	
});



//
//	Get the cached file
//
self.addEventListener('fetch', function(event) {

	event.respondWith( caches.match(event.request).then(function(response) {
		
		// Cache hit found
		if (response) {
			console.log( event.request.url );
			//	Check if request of full page ( /videos/, /video/temp/ )
			if( event.request.url.endsWith('/')  || event.request.url.startsWith('https://www.gstatic.com') || event.request.url.startsWith('https://www.google.com') ){ 
				
				//	For full pages only want to use cached version if offline
				if( navigator.onLine ) {
					// do nothing get fresh responce.
				} else {
					return response;
				}
				
			} else {
				
				return response;
				
			}
		}
		
		// IMPORTANT: Clone the request. A request is a stream and
		// can only be consumed once. Since we are consuming this
		// once by cache and once by the browser for fetch, we need
		// to clone the response.
		var fetchRequest = event.request.clone();
			
		return fetch(fetchRequest).then( function(response) {
			
			//
			// If we don't want to cache a file catch it here
			// See if we can get 	|| response.type !== 'basic'
			//
			if(!response || ( response.status !== 200 && response.status !== 0 ) ) {
				return response;
			}
			
			//	Don't cache google analytics.
			if( event.request.url.startsWith('https://www.google-analytics.com') ) {
				return response;
			}
			
			//	Don't cache api responces - webmasters - admin
			if( event.request.url.includes('/api/') || event.request.url.includes('/webmasters/') || event.request.url.includes('/admin/') || event.request.url.includes('/member/') ) {
				return response;
			}
			
			//	Don't cache video files
			if( response.type == 'cors' && !event.request.url.includes('fonts') ) {
				return response;
			}
			
			
			// IMPORTANT: Clone the response. A response is a stream
			// and because we want the browser to consume the response
			// as well as the cache consuming the response, we need
			// to clone it so we have two streams.
			var responseToCache = response.clone();
			
			//	Cache and return it
			caches.open(CACHE_NAME).then(function(cache) {
				cache.put(event.request, responseToCache);
			});
			
			return response;
			
		});
		
	}));
	
});


//
//	Called when push notifications are sent from server.
//
self.addEventListener('push', function(e) {
	
	if (e.data) {
		
		data = e.data.json();
		
	} else {
		
		//	Do data received don't do any thing
		return false;
		
	}
	
	var options = {
		body: data.body,
		icon: data.icon,
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			url: data.url
		},
		badge: data.badge
	};
	
	e.waitUntil(
		self.registration.showNotification(data.title, options)
	);
  
});

//
//	When notification is clicked
//
self.addEventListener('notificationclick', function(e) {
	
	e.notification.close();
	
	e.waitUntil(
		clients.openWindow(e.notification.data.url)
	);

});

