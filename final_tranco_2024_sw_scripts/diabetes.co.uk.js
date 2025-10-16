self.addEventListener('install', event => {
	self.skipWaiting();
});

self.addEventListener('push', event => {
	const data = event.data.json();

	event.waitUntil(self.registration.showNotification(data.post_title, {
		image: data.uploads_url + '/' + data.post_img,
		body: "A new " + data.post_type_label + " has been published on " + data.app_name,
		data: {
			permalink: data.post_permalink
		},
		vibrate: [300, 100, 300, 100, 300],
		tag: data.post_type_label,
		requireInteraction: true,
		actions: [
			{
				action: "link",
				title: "View " + data.post_type_label
			}
		]
	}));
});

self.addEventListener("notificationclick", e => {
	const notification = e.notification;
	notification.close();
	e.waitUntil(clients.openWindow(notification.data.permalink));
});