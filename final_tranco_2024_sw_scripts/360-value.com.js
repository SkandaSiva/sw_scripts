const CACHE_VERSION = "v1";

self.addEventListener('install', event => {
	event.waitUntil(setup());
});

self.addEventListener('activate', event => {
	event.waitUntil(handleActivate());
});

self.addEventListener('fetch', handleFetch);

const pathRegex = /^\/apps\/iv\/(ui|start|login)\/?$/i;
const swResourceRegex = /^\/apps\/iv\/sw-resources\//i;

async function handleFetch(event) {
	const url = new URL(event.request.url);

	if (swResourceRegex.test(url.pathname)) {
		let cache = await self.caches.open(CACHE_VERSION);
		return event.respondWith(cache.match(event.request));
	}

	// /apps/iv/ui/
	if (pathRegex.test(url.pathname)) {
		let success = true;
		try {
			// Check if the server is alive
			const response = await fetch("/apps/iv/rest/versions/tracked");
			if (response.status === 503) {
				success = false;
				let cache = await self.caches.open(CACHE_VERSION);
				return event.respondWith(cache.match(MAINTENANCE_PATH));
			}
		}
		catch (error) {
			success = false;
			let cache = await self.caches.open(CACHE_VERSION);
			return event.respondWith(cache.match(OFFLINE_PATH));
		}
		finally {
			// If the request succeeded, reset the timeout values.
			if (success === true) {
				timeout = 0;
				prevTimeout = 0;
			}
		}
	}
}

self.addEventListener('message', event => {
	if (event.data && event.data.type === 'GET_TIMEOUT') {
		event.source.postMessage({
			type: 'REPLY_GET_TIMEOUT',
			timeout: getNextTimeoutSeconds() * 1000,
		});
	}
});

let timeout = 0;
let prevTimeout = 0;
function getNextTimeoutSeconds() {
	// Cap at 5 min
	if (timeout > 300) {
		return 300;
	}

	if (timeout === 0) {
		timeout = 1;
		return 0;
	}

	let nextTimeout = prevTimeout + timeout;

	prevTimeout = timeout;
	timeout = nextTimeout;

	return nextTimeout;
}

const BASE_URL = "/apps/iv/sw-resources";
const OFFLINE_PATH = `${BASE_URL}/offline.html`;
const MAINTENANCE_PATH = `${BASE_URL}/maintenance.html`;
const CSS_PATH = `${BASE_URL}/styles.css`;
const JS_PATH = `${BASE_URL}/refresher.js`;

async function setup() {
	const cache = await self.caches.open(CACHE_VERSION);
	await cache.addAll([OFFLINE_PATH, MAINTENANCE_PATH, CSS_PATH, JS_PATH]);
	await self.skipWaiting();
}

async function handleActivate() {
	await deleteOldCaches();
	await self.clients.claim();
}

async function deleteCache(key){
	await caches.delete(key);
};

async function deleteOldCaches() {
	const cacheKeepList = [CACHE_VERSION];
	const keyList = await caches.keys();
	const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
	await Promise.all(cachesToDelete.map(deleteCache));
};
