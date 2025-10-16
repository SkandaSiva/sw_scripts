function handlePushEvent(event) {
	const DEFAULT_TAG = 'bas';
	return Promise.resolve()
		.then(() => {
			return event.data.json();
		})
		.then((data) => {
			const title = data.notification.title;
			const options = data.notification;
			if (!options.tag) {
				options.tag = DEFAULT_TAG;
			}
			return registration.showNotification(title, options);
		})
		.catch((err) => {
			console.error('Push event caused an error: ', err);

			const title = 'Message Received';
			const options = {
				body: event.data.text(),
				tag: DEFAULT_TAG
			};
			return registration.showNotification(title, options);
		});
}

self.addEventListener('push', function(event) {
	event.waitUntil(handlePushEvent(event));
});

self.addEventListener('notificationclick', function(event) {
	let url = event.notification.data.url;
	event.notification.close();
	event.waitUntil(
		clients.matchAll({type: 'window'}).then( clientList => {
			// Check if there is already a window/tab open with the target URL
			if (typeof url === 'undefined') {
				return null;
			}

			for (let i = 0; i < clientList.length; i++) {
				let client = clientList[i];
				// If so, just focus it.
				if (client.url === url && 'focus' in client) {
					return client.focus();
				}
			}
			// If not, then open the target URL in a new window/tab.
			if (clients.openWindow) {
				return clients.openWindow(url);
			}
		})
	);
});
