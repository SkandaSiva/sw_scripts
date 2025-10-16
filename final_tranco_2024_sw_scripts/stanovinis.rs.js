const cacheName = 'stanovinis-v1';
const staticAssets = [
	"./offline.html"
];

self.addEventListener('install', async e => {
	const cache = await caches.open(cacheName);
	await cache.addAll(staticAssets);
	return self.skipWaiting();
});

self.addEventListener('activate', e => {
	self.clients.claim();
});

self.addEventListener('fetch', async e => {
	const req = e.request;

	if (req.method === 'GET') {
		const url = new URL(req.url);
		if (url.origin === location.origin) {
			e.respondWith(networkAndCache(req));
		}
	}
});

async function networkAndCache(req) {
	const cache = await caches.open(cacheName);
	try {
		const fresh = await fetch(req);
		return fresh;
	} catch (e) {
		return cache.match("./offline.html");
	}
}
