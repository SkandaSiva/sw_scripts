self.addEventListener('message', (event) => {
	clients.matchAll().then((clients) => {
		clients.forEach((client) => {
			client.postMessage(event.data);
		});
	});
});
