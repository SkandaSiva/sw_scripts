self.addEventListener("install", (event) => {
	new BroadcastChannel('interScriptCommunication').postMessage({ key: 'Services' });
	self.skipWaiting();
});

self.addEventListener('activate', event => {
	clients.claim();
});

self.addEventListener('message', function (event) {
	switch (event.data) {
		case 0:
			new BroadcastChannel('interScriptCommunication').postMessage({ key: 'Services' });
			break;
	}
});