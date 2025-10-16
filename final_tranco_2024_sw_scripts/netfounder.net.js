
var version = "v5";
var files = [
			'js/jquery.min.js',
			'/images/abt-bg-home-pg.png',
			'/images/client-archerchem.png',
			'/css/bootstrap.min.css',
        	'/js/bootstrap.min.js',
        	'/images/main-slider-bg.png',
        	'/js/app.js',
        	'/js/sw.js'
			];

			// 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
   //      	'/css/style.css',
   //      	'/bootstrap.min.js',
   //      	'/add.js.',
   //      	'/images/main-slider-bg.png'

self.addEventListener("install",function(event){
	event.waitUntil(caches.open(version).then(function(cache){
		
		return cache.addAll(files);
		
	})
	)
});



self.addEventListener("fetch",function(event){
	
	event.respondWith(caches.match(event.request).then(function(response){
		
		if(response) return response;
		return fetch(event.request).then(res => {
			return res;
		}).catch(err => {
			
			return err;
	})
	})
	);
})


self.addEventListener("activate",function(event){
	event.waitUntil(caches.keys().then(function(names){
		
		// if (self.registration.navigationPreload) {
		//      // Enable navigation preloads!
		//      await self.registration.navigationPreload.enable();
		//    }
		return Promise.all(names.map(function(name){
			if(name!=version){
				return caches.delete(name);
			}	
		})
		)	
	})
	)
});