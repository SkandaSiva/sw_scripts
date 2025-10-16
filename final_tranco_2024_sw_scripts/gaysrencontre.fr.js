self.addEventListener('install', function (event) {
	var offlineRequest = new Request('/html/offline.html');
	event.waitUntil(
		fetch(offlineRequest).then(function (response) {
			return caches.open('offline').then(function (cache) {
				console.log('Cached offline page', response.url);
				return cache.put(offlineRequest, response);
			});
		})
	);
});

self.addEventListener('fetch', function (event) {
	var request = event.request;

	if (request.method === 'GET') {
		event.respondWith(
			fetch(request).catch(function (error) {
				console.log(error + ' Serving cached offline fallback');
				return caches.open('offline').then(function (cache) {
					return cache.match('/html/offline.html');
				});
			})
		);
	}
});

self.addEventListener('push', function (event) {
	const payload = event.data.json();
	event.waitUntil(
		fetch('/translations/json/javascript')
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				const translations = data.translations;
				return self.registration.showNotification(payload.title, {
					icon: payload.sender_avatar_url_thumb,
					body: payload.message_body != null ? payload.message_body : '',
					data: { url: payload.message_url },
					actions: [
						{
							title: translations.view_message,
							action: 'message-action',
						},
					],
				});
			})
	);
});

self.addEventListener('notificationclick', function (event) {
	fetch('/notifications/track_click')
		.then(function (response) {
			return response.json();
		})
		.then(function () {
			if (event.action === 'message-action') {
				clients.openWindow(event.notification.data.url);
			}
		});
});
