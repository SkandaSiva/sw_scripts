self.addEventListener('push', (ev) => {
	ev.waitUntil((async() => {
		await self.registration.pushManager.getSubscription();
		const payload = ev.data.json().data;

		const clientList = await clients.matchAll({
			type: "window",
			includeUncontrolled: true
		});
		for (const client of clientList) {
			if (client.url === payload.link) return;
		}

		return self.registration.showNotification(payload.title, {
			body: payload.body,
			icon: payload.icon,
			data: { link: payload.link }
		});

	})());
});

self.addEventListener('notificationclick', (ev) => {
	ev.notification.close();

	ev.waitUntil((async () => {
		const clientList = await clients.matchAll({
			type: "window",
			includeUncontrolled: true
		});
		for (const client of clientList) {
			if (client.url === ev.notification.data.link && 'focus' in client)
				return client.focus();
		}

		if (clients.openWindow) return clients.openWindow(ev.notification.data.link);
	})());
});

self.addEventListener('fetch', () => '');
