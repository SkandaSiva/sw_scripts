self.addEventListener('fetch', function(event) {});

self.addEventListener('push', function(event) {
	const payload = event.data.json();
	let options = {
	    body: payload.data.body,
	    icon: '/resources/imagens/favicon.ico',
		image: payload.data.image,
		data: {
			url: payload.data.click_action
		},
		actions: [{action: "open_url", title: "Leia agora"}]
    };
	event.waitUntil(self.registration.showNotification(payload.data.title, options));
});
self.onnotificationclick = function(event) {
	event.notification.close();
	clients.openWindow(event.notification.data.url);
};