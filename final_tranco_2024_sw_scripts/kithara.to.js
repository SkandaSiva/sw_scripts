
// importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.5/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { NetworkFirst } = workbox.strategies;
const { ExpirationPlugin } = workbox.expiration;

registerRoute(
	/^(.*)$/,
	new NetworkFirst({
		cacheName: 'kithara-to-cache',
		plugins: [
			new ExpirationPlugin({
				maxAgeSeconds: 90 * 24 * 60 * 60,
			})
		]
	})
);
