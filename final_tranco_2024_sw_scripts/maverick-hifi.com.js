self.addEventListener('fetch', function(event) {
	
});

self.addEventListener('install', event => {
	self.skipWaiting();
});
self.addEventListener('notificationclick', function(event) {
	event.notification.close();

	if(event.notification.data.url){
		event.waitUntil(
			clients.openWindow(event.notification.data.url)
		);
	}
});

self.addEventListener('push', function (event) {
	if (!(self.Notification && self.Notification.permission === 'granted')) {
		return;
	}
	var webPushData = event.data.json();
	const title = webPushData.notification.title;
	const options = {
		body: webPushData.notification.body,
		icon: webPushData.data.iconURL,
		data: {"url": webPushData.data.click_action}
	};
	if (event.data) {
		event.waitUntil(self.registration.showNotification(title, options));
	}
});