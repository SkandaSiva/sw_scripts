function notificationClickActions(actionName) {
    switch ( actionName ) {
        case 'goto_homepage':
			clients.openWindow('/');
            break;
        case 'goto_blog':
			clients.openWindow('/blog');
            break;
        default:
            break;
    }
}

// Service Worker
self.addEventListener('activate', (event) => {
	console.log('[ServiceWorker] Activate');
	event.waitUntil((async () => {
		if ( 'navigationPreload' in self.registration ) {
			await self.registration.navigationPreload.enable();
		}
	})());
	self.clients.claim();
});
self.addEventListener('fetch', function (event) {
	if ( event.request.mode === 'navigate' ) {
		event.respondWith((async () => {
			try {
				const preloadResponse = await event.preloadResponse;
				if ( preloadResponse ) {
					return preloadResponse;
				}

				const networkResponse = await fetch(event.request);
				return networkResponse;
			} catch (error) {
				console.log('[Service Worker] Fetch failed', error);
				throw error;
			}
		})());
	}
});

// Push Notification
self.addEventListener('push', function (e) {
    if ( !(self.Notification && self.Notification.permission === 'granted') ) {
        //notifications aren't supported or permission not granted!
        return;
    }

    if (e.data) {
        var msg = e.data.json();
		var message = {
			body: msg.body,
			icon: msg.icon,
			badge: msg.badge,
			image: msg.image,
			dir: 'rtl',
			lang: 'fa-IR',
			data: msg.data,
			actions: msg.actions
		};
        e.waitUntil(self.registration.showNotification(msg.title, message));
    }
});

self.addEventListener('notificationclick', function (event) {
	const clickedNotification = event.notification;
	const actionName = !event.action ? 'goto_data' : event.action;
	clickedNotification.close();
	var promiseChain = null;
	if ( actionName == 'goto_data' ) {
		const urlToOpen = new URL(clickedNotification.data, self.location.origin).href;
		promiseChain = clients.matchAll({
			type: 'window',
			includeUncontrolled: true,
		}).then((windowClients) => {
			let matchingClient = null;
			for ( let i = 0; i < windowClients.length; i++ ) {
				const windowClient = windowClients[i];
				if ( windowClient.url === urlToOpen ) {
					matchingClient = windowClient;
					break;
				}
			}
	
			if ( matchingClient ) {
				return matchingClient.focus();
			} else {
				return clients.openWindow(urlToOpen);
			}
		});
	} else {
		promiseChain = notificationClickActions(actionName);
	}
	event.waitUntil(promiseChain);
});