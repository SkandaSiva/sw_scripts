importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js');

workbox.routing.registerRoute(
	({ request }) => request.destination === 'image',
	new workbox.strategies.CacheFirst()
);


const cacheName = 'static-cache-v2';

// disable workbox debug logging in development, remove when debugging the service worker
// self.__WB_DISABLE_DEV_LOGS = true;

// see https://developer.mozilla.org/en-US/docs/Web/API/RequestDestination for possible values
const cachedDestinations = new Set([
	'font',
	'manifest',
	'paintworklet',
	'script',
	'sharedworker',
	'style',
	'worker',
]);

workbox.routing.registerRoute(
	({ request }) => cachedDestinations.has(request.destination),
	new workbox.strategies.CacheFirst({ cacheName }),
);
