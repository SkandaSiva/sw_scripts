self.addEventListener("push", (event) => {
	const data = event.data?.json()

	if(!data || !data.tag || !data.title || !data.message || !data.icon) {
		return
	}
	
	event.waitUntil(
			self.registration.showNotification(data.title, {
			body: data.message,
			icon: data.icon,
			silent: data.silent,
			tag: data.tag,
			timestamp: data.timestamp,
			data: data.data
		}),
	)
})

self.addEventListener('notificationclick', (event) => {
	if(event.notification.data.onclickUrl) {
		clients.openWindow(event.notification.data.onclickUrl)
	}
})