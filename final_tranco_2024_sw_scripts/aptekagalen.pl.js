importScripts("/public/js/workbox/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/public/js/workbox"});

workbox.routing.registerRoute(
	new RegExp('/public/'),
	workbox.strategies.staleWhileRevalidate()
);
workbox.routing.registerRoute(
	new RegExp('/[a-zA-Z0-9\-\.]+\.jpg$'),
	workbox.strategies.cacheFirst({
		cacheName: 'image-cache',
		plugins: [
			new workbox.expiration.Plugin({
				maxAgeSeconds: 7 * 24 * 60 * 60,
				maxEntries: 50,
			}),
		]
	})
);
workbox.routing.registerRoute(
	new RegExp('/admin/'),
	workbox.strategies.networkOnly()
);
