// service-worker.js

const urlsToCache = ["/", "./pwa.html", "./styles/pwa.css", "./scripts/scriptPwa.js"];

// Установка Service Worker
self.addEventListener("install", event => {
	console.log("Service worker installing...");
});

// Активация Service Worker
self.addEventListener("activate", event => {
	console.log("Service worker activated");
});

// Слушаем push-события
self.addEventListener("push", function (event) {
	const dataJson = event.data.json();

	console.log(dataJson);

	const title = dataJson.title;
	const options = {
		body: dataJson.message,
		data: { id: dataJson.id },
		icon: "images/icon.png",
		vibrate: [100, 50, 100],
	};

	console.log(event.data.json());

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
	console.log(event);
	console.log("click push");

	// Use event.waitUntil() to extend the lifetime of the event handler until finished
	event.waitUntil(
		(async () => {
			try {
				const res = await fetch(`https://test.traffhunt.com/api/Apps/updateNotificationClick`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						id: event?.notification?.data?.id,
					}),
				});

				// Проверка статуса ответа
				if (!res.ok) {
					throw new Error('Network response was not ok');
				}

				// Найти или открыть соответствующий клиент
				const allClients = await clients.matchAll({
					type: 'window',
					includeUncontrolled: true // Включить неконтролируемые клиенты (вкладки), такие как те, которые открыты пользователем
				});

				console.log("All clients:", allClients);

				// Проверка, есть ли уже открытый клиент с нужным URL
				for (let client of allClients) {
					console.log('Checking client:', client.url);
					if (client.url.includes('/pwa.html') && 'focus' in client) {
						console.log('Focusing existing client:', client.url);
						return client.focus();
					}
				}

				// Если нет открытого клиента, открыть новое окно/вкладку
				if (clients.openWindow) {
					console.log('Opening new window');
					const newWindow = await clients.openWindow('/pwa.html');
					console.log('New window client:', newWindow);
					return newWindow;
				} else {
					console.warn('clients.openWindow is not supported');
				}
			} catch (error) {
				console.error("Failed to handle notification click:", error);
			}
		})()
	);

	event.notification.close();
});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			// Відповідь з кешу або мережі
			return response || fetch(event.request);
		}),
	);
});
