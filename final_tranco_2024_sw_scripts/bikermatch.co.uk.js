importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
workbox.googleAnalytics.initialize({
	  parameterOverrides: {
		cd1: 'offline',
	  },
	});


  const version = '20170731::';
  const BMJpgs = version + '-Jpgs';
  const BMOffline = version + '-Offline';
  const BMPages = version + '-Offline';



this.addEventListener('install', function(event) {
	self.skipWaiting();
	
 console.log('Creating cache: ' + BMOffline);

//event.waitUntil(
caches.open(BMOffline).then(function(cache) {
  return cache.addAll([
'/images/bm_header_logo.jpg',
'/images/uk.svg?v3',
'/images/bg_sidebar.png',
'/fonts/fontawesome-webfont.ttf?v=4.7.0',
'/fonts/fontawesome-webfont.woff?v=4.7.0',
'/fonts/fontawesome-webfont.woff2?v=4.7.0',
'/fonts/raleway/v11/PKCRbVvRfd5n7BTjtGiFZPk_vArhqVIZ0nv9q090hN8.woff2',
'/fonts/roboto/v15/CWB0XYA8bzo0kSThX0UTuA.woff2',
'/fonts/roboto/v15/d-6IYplOFocCacKzxwXSOFtXRa8TVwTICgirnJhmVJw.woff2',
'/fonts/roboto/v15/RxZJdnzeo3R5zSexge8UUVtXRa8TVwTICgirnJhmVJw.woff2',
'/images/bm_sidebar_logo.png',
'/images/howitworksgrey.jpg',
'/images/backgrounds/advertorial-clip.jpg',
'/images/backgrounds/strips/1.jpg',
'/images/backgrounds/strips/1mini.jpg',
'/images/backgrounds/strips/2.jpg',
'/images/backgrounds/strips/3.jpg',
'/images/backgrounds/strips/4.jpg',
'/images/backgrounds/strips/4mini.jpg',
'/images/backgrounds/strips/5.jpg',
'/images/backgrounds/strips/5mini.jpg',
'/images/backgrounds/strips/6.jpg',
'/images/backgrounds/strips/6mini.jpg',
'/images/backgrounds/strips/7.jpg',
'/cgi-bin/uploaders/styles.css',
'/forum/forum.css',
'/profiles/search.css',
'/styles/siteframeworkMIN.css',
'/styles/fontsiconsMIN.css',
'/styles/uploadpages.css',
'/cgi-bin/uploaders/filedrag.js',
'/events/calendar.js',
'/events/event.js',
'/forum/index.js',
'/forum/posts.js',
'/myaccount/edit-photos.js',
'/myaccount/forgot_pw.js',
'/myaccount/inbox.js',
'/myaccount/register.js',
'/profiles/Ajax_UsernameLookup.js',
'/profiles/searchProfiles_Ajax.js',
'/profiles/view-profile.js',
'/scripts/javascriptMIN.js',
'/offline.htm',
'/?launcher=true'
      ])
    })
.then( function () { console.log('Offline site cached: ' + BMOffline)} )


});

/*
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // If already cached
        if (response) {
          return response;
        }
        // If not, fetch request, and then cache response
        return fetch(event.request).then(
          function(response) {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Stash copy of response
            var cachedResponse = response.clone();
            caches.open(BMJpgs)
              .then(function(cache) {
                cache.put(event.request, cachedResponse);
              });

            return response;
          }
        );
      })
  );
});
*/

function addToCache(cacheName, request, response) {
  caches.open(cacheName)
    .then( cache => cache.put(request, response) );
}


// this is the service worker which intercepts all IMAGE requests
self.addEventListener('fetch', function fetcher (event) {
	  var request = event.request;
	  // check if request
	  if (request.url.toLowerCase().indexOf('https://www.bikermatch.co.uk') == 0
			&& request.url.toLowerCase().indexOf('.jpg') > -1 
			//&& request.referrer.indexOf('bikermatch.co.uk/myaccount/edit-photos.asp') == -1 
			&& request.method === 'GET') 
			{
		// contentful asset detected
		//console.log('handling: ' + request.url.toLowerCase().replace('https://www.bikermatch.co.uk/',''))
		event.respondWith(
		  caches.match(event.request).then(function(response) {
			
			
			//fetch a new copy anyhow
			fetch(request.url.toLowerCase(), {credentials: 'same-origin', redirect: 'follow'})
			            .then( response => {
						  addToCache(BMJpgs, request, response.clone());
						  return response;
						})
			
			//...and return from cache if available, otherwise fetch from network (and make error img if offline)
			return response || fetch(request.url.toLowerCase(), {credentials: 'same-origin', redirect: 'follow'})
			            .then( response => {
						  addToCache(BMJpgs, request, response.clone());
						  return response;
						})
						.catch( () => { //catch if unable to fetch new copy
						return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
				  })

		  })
		  .catch( () => { //catch if not in cache
					//console.log('NOT in cache: ' + request.url.toLowerCase().replace('https://www.bikermatch.co.uk/',''));
					return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
				  })
		);
	  }
  // otherwise: ignore event
});




// this is the service worker which intercepts all PAGES
self.addEventListener('fetch', function fetcher (event) {
	  var request = event.request;
	  // check if request
	  if (request.url.toLowerCase().indexOf('https://www.bikermatch.co.uk') == 0 && request.method === 'GET'
		//EXCLUDE THESE
		&& request.url.toLowerCase().indexOf('chat-messages.asp') == -1
		&& request.url.toLowerCase().indexOf('/myaccount/') == -1
		&& request.url.toLowerCase().indexOf('/admin/') == -1
		&& request.url.toLowerCase().indexOf('.aspx') == -1
		&& request.url.toLowerCase().indexOf('edit-photos-rotate') == -1
		&& request.url.toLowerCase().indexOf('gettoken.asp') == -1
		&& request.url.toLowerCase().indexOf('sid=') == -1
		&& request.url.toLowerCase().indexOf('logout.asp') == -1
		&& request.url.toLowerCase().indexOf('activate.asp') == -1
		&& request.url.toLowerCase().indexOf('reactivate.asp') == -1
		&& request.url.toLowerCase().indexOf('login.asp') == -1
		&& request.url.toLowerCase().indexOf('attend-add.asp') == -1
		&& request.url.toLowerCase().indexOf('attend-remove.asp') == -1
		&& request.url.toLowerCase().indexOf('events/index.asp') == -1
		&& request.url.toLowerCase().indexOf('events/lift-') == -1
		&& request.url.toLowerCase().indexOf('/cgi-bin/') == -1
		&& request.url.toLowerCase().indexOf('edit-photos-del-album.asp') == -1
		&& request.url.toLowerCase().indexOf('/misc/links') == -1
		&& request.url.toLowerCase().indexOf('SearchProfiles_Ajax.asp') == -1
		&& request.url.toLowerCase().indexOf('search.asp') == -1
		&& request.url.toLowerCase().indexOf('/save/') == -1
		&& request.url.toLowerCase().indexOf('/save/') == -1
		&& (
		//INCLUDE THESE
		request.url.toLowerCase().indexOf('.asp') > -1 
		|| request.url.toLowerCase()=='https://www.bikermatch.co.uk/' 
		|| request.url.toLowerCase()=='https://www.bikermatch.co.uk/?launcher=true' 		
		|| request.url.toLowerCase()=='https://www.bikermatch.co.uk/forum/' 
		|| request.url.toLowerCase()=='https://www.bikermatch.co.uk/events/' 
		|| request.url.toLowerCase()=='https://www.bikermatch.co.uk/profiles/' 
		) ) {
		// contentful asset detected
		console.log('handling: ' + request.url.toLowerCase().replace('https://www.bikermatch.co.uk/',''))
		
		event.respondWith(

		 fetch(request.url, {credentials: 'same-origin', redirect: 'manual'})
		 
			.then(response => {
			   
			   if(response.status == 301 || response.status == 302)
			   {//console.log('status was 301 or 302!')		   
					var responseInit = {
					status: 200,
					statusText: 'Found',
						headers: {
						Location: response.location
						}
					}
				  var redirectResponse = new Response('', responseInit);	
				  return redirectResponse
			   }
			   else 
			   {//console.log('status was 200')		   
		   		addToCache(BMOffline, request, response.clone());
				//console.log('testtest');
				return response;
			   }
				 
			})


		  .catch( () => {
			return caches.match(request).then( response => { 
				return response || caches.match('/offline.htm'); 
						})
				})
		
		
		);
	  }
  // otherwise: ignore event
});















self.addEventListener('push', function(event) {
	//console.log("Push event!! ", event.data.text());
	const payload=event.data.json()
	var title = payload.title;
	var message = payload.message;
	var image = payload.image;
	var link = payload.link;
	var tag=payload.title

	if (payload.tag.length>0) {tag=payload.tag}


	if (tag.indexOf('cancel:') >-1)
	{	
		console.log('Cancelling notifications for tag: ' + tag.replace('cancel:',''))		
		var options = { tag : tag.replace('cancel:','') };
		return self.registration.getNotifications(options).then(function(notifications) {
			Array.prototype.forEach.call(notifications, function(notification){
				notification.close()
			} )

	
		});
	}


	else
	{


	
	  if (image.length <5) {image='/images/BM-Icon-Iconified/square-192.png'}
	  if (link.length < 2) {link='/'}
	  return self.registration.showNotification(
			title, 
			{body: message,
			requireInteraction: true,			
			tag: tag,
			icon: image,
			icon: image,
			sound: '/app/notification.mp3',
			badge: '/images/BM-Icon-Iconified/square-192-bw.png',
			data: {
				link: link
			},
			actions: [
					   {action: 'open', title: 'Open', icon: 'https://www.bikermatch.co.uk/images/icons/desktop-monitor.png'},
					   {action: 'close', title: 'Close', icon: 'https://www.bikermatch.co.uk/images/icons/remove-symbol.png'}
					   ]
					}
			);
			
	}
});


self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  console.log('Clicked notification. Navigating to: ' + event.notification.data.link);


  if (event.action !== 'close') {
      // This looks to see if the current is already open and
	  // focuses if it is
	  event.waitUntil(clients.matchAll({
		type: "window"
	  }).then(function(clientList) {
		for (var i = 0; i < clientList.length; i++) {
		  var client = clientList[i];
		  if (client.url == '/' && 'focus' in client)
			return client.focus();
		}
		if (clients.openWindow)
		  return clients.openWindow(event.notification.data.link);
	  }));
  }
  
  

});