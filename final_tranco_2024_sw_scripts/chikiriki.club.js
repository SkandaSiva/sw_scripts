'use strict';

var cacheName="SW-v8";

var filesToCache = [
	'/start.html',
	'/twa.html',
	'/twa-ww.html'
//	'https://stc.chikiriki.club/js/bootstrap.js',
//	'https://stc.chikiriki.club/css/bootstrap.css',
//	'//ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js'
];

var filesToCacheUrls=[];
for( var i=0; i<filesToCache.length; i++ ) {
	var req=new Request(filesToCache[i]);
	filesToCacheUrls.push(req.url);
}

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(cacheName)
			.then(function(cache) {
				return cache.addAll(filesToCache).then(function() {
					self.skipWaiting();
				});
			})
	);
});


self.addEventListener('activate', function(e) {
	e.waitUntil(caches.keys()
		.then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if (key !== cacheName)
					return caches.delete(key);
			}));
		}));
	return self.clients.claim();
});


self.addEventListener('fetch',function (event) {
	var request=event.request;
	if (request.method=="GET") {
		if ( filesToCacheUrls.indexOf(request.url) !=-1 ) {
			event.respondWith(
				caches.open(cacheName).then(function(cache) {
					return cache.match(request).then(function (response) {
						return response || fetch(request)
							.then(function (response) {
								cache.put(request, response.clone());
								return response;
							});
					});
				})
			);
		}
/*		else
		if (request.url.match(/\.woff2$/)) {
			event.respondWith(
				caches.match(request).then(function (response) {
					return response || fetch(request)
						.then(function (response) {
							return caches.open(cacheName).then(function (cache) {
								cache.put(request, response.clone());
								return response;
							});
						});
				})
			);
		}*/
	}
});

const sendNotification = (data) => {
	return new Promise((resolve) => {
		let message_guid_param = '';

		if (data) {
			if (data.message_guid)
				message_guid_param = "&m="+data.message_guid;
			if (data.notification) {
				data.notification.data = data;
				return resolve({title: data.notification.title, notification: data.notification});
			}
		}

		const headers=new Headers();
		headers.set("x-requested-with", "XMLHttpRequest");

		fetch('/GCM/fetch?v=13'+message_guid_param,{
			credentials: 'include',
			method:'POST',
			cache:'no-store',
			headers: headers
		})
			.then(function (response) {
				if (response.status !== 200) {
					// Either show a message to the user explaining the error
					// or enter a generic message and handle the
					// onnotificationclick event to direct the user to a web page
					console.log('Looks like there was a problem. Status Code: ' + response.status);
					throw new Error();
				}

				// Examine the text in the response
				return response.json().then( (data) => {
					if (!data || data.error || !data.notification) {
						console.error('The API returned an error.', data);
						throw new Error();
					}

					const title = data.notification.title;
					const noteData={data: data};

					if (data.notification.body)
						noteData["body"]=data.notification.body;

					if (data.notification.icon)
						noteData["icon"]=data.notification.icon;

					if (data.notification.badge)
						noteData["badge"]=data.notification.badge;

					if (data.notification.image)
						noteData["image"]=data.notification.image;

					if (data.notification.requireInteraction !== undefined)
						noteData["requireInteraction"]=data.notification.requireInteraction;
					else
						noteData["requireInteraction"]=true;

					if (data.notification.actions)
						noteData["actions"]=data.notification.actions;

					if (data.notification.tag)
						noteData["tag"]=data.notification.tag;

					return resolve({title: title, notification: noteData});
				});
			})
			.catch(function (err) {})

	})
		.then((data) => {
			return self.registration.showNotification(data.title, data.notification)
		});
};

self.addEventListener('push', function (event) {
	let data;
	try {
		data = event.data.json();
	}
	catch {
		data = null;
	}
	event.waitUntil( sendNotification(data) );
});


self.addEventListener('notificationclick', function (event) {
    var actionUrl = ( event.action ? event.action : (event.notification.data.url ? event.notification.data.url : "/") );
	var scope=registration.scope;

	if (scope && scope.host) {
		let localizedActionUrl = new URL(actionUrl, scope);
		localizedActionUrl.protocol = scope.protocol;
		localizedActionUrl.host = scope.host;
		actionUrl = localizedActionUrl.toString();
	}

	// Android doesn't close the notification when you click on it
	event.notification.close();

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
		clients.matchAll({
	        type: "window",
		    includeUncontrolled: true
	    }).then(function (clientList) {
		    var bestClient;
		    if (! /(android)/i.test(navigator.userAgent)) {
			    for (var i = 0; i < clientList.length; i++) {
				    var client = clientList[i];
					var extendedActionUrl = (new URL(actionUrl, scope)).toString();
				    if ((client.url == actionUrl || client.url == extendedActionUrl) && 'focus' in client)
					    return client.focus();

				    if (bestClient) {
					    if (client.focused)
						    bestClient = client;
					    else if (bestClient.visibilityState != "visible" && client.visibilityState == "visible")
						    bestClient = client;
				    } else {
					    bestClient = client;
				    }
			    }
		    }

	        if (bestClient && bestClient.focus && bestClient.navigate) {
		        return bestClient.navigate(actionUrl).then(bestClient => bestClient.focus());
	        } else {
		        if (clients.openWindow) {
					return clients.openWindow(actionUrl);
		        }
	        }
	    })
    );
});
