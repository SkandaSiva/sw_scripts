self.addEventListener('push', function(event) {
    let payload = event.data ? event.data.text() : {"head": "No Content", "body": "No Content", "icon": "", "image": "", "requireInteraction": false},
	data = JSON.parse(payload),
	head = data.head,
	body = data.body,
	icon = data.icon,
	image = data.image
    requireInteraction = data.requireInteraction;
    url = data.url ? data.url: self.location.origin;
    event.waitUntil(
    self.registration.showNotification(head, {
	body: body,
	icon: icon,
	image: image,
	requireInteraction: requireInteraction,
	data: {url: url}	
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.waitUntil(
    event.preventDefault(),
    event.notification.close(),
    self.clients.openWindow(event.notification.data.url)
  );
})

