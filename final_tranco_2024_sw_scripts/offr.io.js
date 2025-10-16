self.addEventListener('install', event => {
	// console.log('Xinstalled');

});

self.addEventListener('activate', event => {
	// console.log('xactivate');
});

self.addEventListener('push', function(event) {
	// console.log('xpush');
	console.log(event);
	let payload = event.data ? event.data.text() : 'no payload';
	payload = JSON.parse(payload);
	console.log(payload);
	let title = payload.title || "Offr";
	let options = payload.options;
	event.waitUntil(
		self.registration.showNotification(title, options)
	);
});

self.addEventListener("notificationclick", (event) => {
	console.log("On notification click: ", event);
	event.notification.close();
	let action = event.action || event.notification.data.goto || null;
	if (action) {
		if (clients.openWindow) return clients.openWindow(action);
	}
});
