self.__WB_OFFLINE_FALLBACK_URL = './offline.html';
	self.__WB_OFFLINE_FALLBACK_REVISION = '1585252768050';



importScripts('https://www.kassel.de/WEB-IES/sitekit-module/thirdparty/workbox-3.6.3/workbox-sw.js');

if (workbox) {
	workbox.setConfig({
		modulePathPrefix: '/WEB-IES/sitekit-module/thirdparty/workbox-3.6.3/'
	});

	workbox.skipWaiting();
	workbox.clientsClaim();

	
	if (self.__WB_OFFLINE_FALLBACK_URL) {
		workbox.precaching.precacheAndRoute([
			{ url: self.__WB_OFFLINE_FALLBACK_URL, revision: self.__WB_OFFLINE_FALLBACK_REVISION },
		]);
		workbox.routing.registerRoute(new workbox.routing.NavigationRoute(async ({ event }) => {
			try {
				return await workbox.strategies.networkOnly().handle({event});
			} catch (error) {
				return caches.match(self.__WB_OFFLINE_FALLBACK_URL);
			}
		}));
	}
	

	workbox.routing.registerRoute(
		/\.(?:js|css)(\?b=\d*)?$/,
		workbox.strategies.staleWhileRevalidate({
			cacheName: 'js-css',
			plugins: [
				new workbox.cacheableResponse.Plugin({
					statuses: [0, 200]
				})
			]
		})
	);

	workbox.routing.registerRoute(
		/\.(?:png|gif|jpg|jpeg|webp)$/,
		workbox.strategies.cacheFirst({
			cacheName: 'images',
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 120,
					maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days,
					// Automatically cleanup if quota is exceeded.
					purgeOnQuotaError: true
				}),
				new workbox.cacheableResponse.Plugin({
					statuses: [0, 200]
				})
			],
		})
	);

	workbox.routing.registerRoute(
		/\.(?:woff2|woff|ttf)$/,
		workbox.strategies.cacheFirst({
			cacheName: 'fonts',
			plugins: [
				new workbox.expiration.Plugin({
					maxAgeSeconds: 360 * 24 * 60 * 60, // 360 Days,
					// Automatically cleanup if quota is exceeded.
					purgeOnQuotaError: true
				}),
				new workbox.cacheableResponse.Plugin({
					statuses: [0, 200]
				})
			],
		})
	);
} else {
	console.log(`Boo! Workbox didn't load ??`);
}



		
	
		

			
importScripts('/WEB-IES/kassel-module/3.15.0/js/sw.js');
