let coreAssets = [
    '/assets/img/bg_icon.png',
    '/assets/fonts/Poppins-Regular.ttf',
    '/assets/fonts/fontawesome-webfont3e6e.woff2?v=4.7.0',
    '/assets/v2/dist/fonts/fontawesome-webfont.woff2',
    '/assets/v2/dist/slick/fonts/slick.woff',
    '/assets/img/happy_travellers.png',
    '/assets/img/verified_agents.png',
    '/assets/img/destinations.png',
    '/assets/img/verified.png',
    '/assets/img/quantity_control.png',
    '/assets/img/support.png',
    '/assets/admin/images/3.png',
    '/assets/admin/images/2.png',
    '/assets/admin/images/1.png',
    '/assets/admin/images/call.png',
];

const cacheName = "appv7";

// On install, cache core assets
self.addEventListener('install', function (event) {

	// Cache core assets
	event.waitUntil(caches.open('app').then(function (cache) {
		for (let asset of coreAssets) {
			cache.add(new Request(asset));
		}
		return cache;
	}));
    self.skipWaiting();
});

self.addEventListener('notificationclick', event => {
    const notification = event.notification;
    notification.close();
    const link = notification.data.link;
    clients.openWindow(link);
});


self.addEventListener("push", e => {
    const payload = e.data.json();
    self.registration.showNotification(
        payload.title, // title of the notification
        {
            body: payload.body, 
            image: payload.image,
            icon: payload.icon,
            badge : payload.badge,
            data : {
              link : payload.link
            }
        }
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

