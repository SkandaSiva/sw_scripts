importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts('/javax.faces.resource/analytics-helper.js.xhtml?ln=javascript');

const cacheSufixString = 'onv-cache-v';
const cacheSufixNumber = 3;
const cacheSufix = cacheSufixString + cacheSufixNumber;
const oneDayInSeconds = 24 * 60 * 60;

//production
workbox.setConfig({
  debug: false,
});

workbox.googleAnalytics.initialize({
  parameterOverrides: {
    cd1: 'offline',
  },
  hitFilter: (params) => {
    const queueTimeInSeconds = Math.round(params.get('qt') / 1000);
    params.set('cm1', queueTimeInSeconds);
  },
});

workbox.precaching.precacheAndRoute([
	{url: '/javax.faces.resource/offline.svg.xhtml?ln=images', revision: null },
	{url: '/javax.faces.resource/logoSlogan.svg.xhtml?ln=images', revision: null }
]);

//images
workbox.routing.registerRoute(
  new RegExp('(\/images|png|gif|jpg|jpeg|svg)'),
  new workbox.strategies.CacheFirst({
    cacheName: `images-${cacheSufix}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

//Caching css
workbox.routing.registerRoute(
  new RegExp('.*\\.css'),
  // Updates css files in the background
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `css-${cacheSufix}`,
  })
);

// Caching scripts
workbox.routing.registerRoute(
  new RegExp('.*\\.js'),
  // Updates script files in the background
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `scripts-${cacheSufix}`,
  })
);

// Home
workbox.routing.registerRoute(
  '/',
  new workbox.strategies.NetworkFirst({
    cacheName: `pages-${cacheSufix}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1,
        // Cache for a maximum of three days, then get from network
        maxAgeSeconds: 3 * oneDayInSeconds,
      }),
    ],
  })
);

// PWA Home
workbox.routing.registerRoute(
  '/minhaConta?utm_source=app&utm_medium=pwa',
  new workbox.strategies.NetworkFirst({
    cacheName: `pages-${cacheSufix}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1,
        // Cache for a maximum of three days, then get from network
        maxAgeSeconds: 3 * oneDayInSeconds,
      }),
    ],
  })
);

//PWA Home2
workbox.routing.registerRoute(
  '/?utm_source=app&utm_medium=pwa',
  new workbox.strategies.NetworkFirst({
    cacheName: `pages-${cacheSufix}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 1,
        // Cache for a maximum of three days, then get from network
        maxAgeSeconds: 3 * oneDayInSeconds,
      }),
    ],
  })
);


//// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#offline_page_only ////
const CACHE_NAME = `offline-${cacheSufix}`;
//This assumes /offline is a URL for your self-contained (no external images or styles) offline page.
const FALLBACK_OFFLINE_URL = '/offline';
//Populate the cache with the offline page when the service worker is installed.
self.addEventListener('install', async (event) => {
	self.skipWaiting();
	
	event.waitUntil(
	 caches.open(CACHE_NAME)
	   .then((cache) => cache.add(FALLBACK_OFFLINE_URL))
	);
});

//workbox.navigationPreload.enable();

const networkOnly = new workbox.strategies.NetworkOnly();
const navigationHandler = async (params) => {
try {
 // Attempt a network request.
 return await networkOnly.handle(params);
} catch (error) {
 // If it fails, return the cached page.
	return caches.match(FALLBACK_OFFLINE_URL, {
		cacheName: CACHE_NAME,
	});
	}
};

//Register this strategy to handle all navigations.
workbox.routing.registerRoute(
new workbox.routing.NavigationRoute(navigationHandler)
);


//completely clearing the cache, wipe any caches that currently exist
self.addEventListener('activate', (event) => {
  self.clients.claim();
  
  const promiseChain = caches.keys()
  .then((cacheNames) => {
    // Step through each cache name and delete it 
    return Promise.all(
      cacheNames.map((cacheName) => {
    	  if(cacheName.includes(`${cacheSufixString}`) && 
    			  cacheName.substring(cacheName.indexOf(`${cacheSufixString}`) + `${cacheSufixString}`.length) < `${cacheSufixNumber}`){
    		  caches.delete(cacheName)
    	  }
      })
    );
  });

  // Keep the service worker alive until all caches are deleted.
  event.waitUntil(promiseChain);
});


self.addEventListener('notificationclose', function(e) {
	var notification = e.notification;
	var primaryKey = notification.data.primaryKey;

	e.waitUntil(sendAnalyticsEvent('close', 'notification'));
//	console.log('Closed notification: ' + primaryKey);
});


self.addEventListener('notificationclick', function(e) {
	var notification = e.notification;
	var primaryKey = notification.data.primaryKey;
	var action = e.action;

	if (action === 'close') {
		notification.close();
		
		e.waitUntil(sendAnalyticsEvent('close', 'notification'));
//		console.log('Closed notification: ' + primaryKey);
	} else {
		e.waitUntil(clients.openWindow(notification.data.url));
		notification.close();
		
		e.waitUntil(sendAnalyticsEvent('click', 'notification'));
	}
});


self.addEventListener('push', function(e) {
	
	 var data = {};
	  if (e.data) {
	    data = e.data.json();
	  }
	  
	  var options = {
			body: data.body,
			icon: '/javax.faces.resource/webPushIcon.png.xhtml?ln=images',
			badge: '/javax.faces.resource/webPushBadge.png.xhtml?ln=images',
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				url: data.url,
				primaryKey: '2'
			}
//			actions: [
//				{action: 'close', title: 'Close',
//					icon: 'images/xmark.png'},
//				{action: 'explore', title: 'Explore this new world',
//					icon: 'images/checkmark.png'},
//					]
	};
	e.waitUntil(self.registration.showNotification(data.title, options));
	e.waitUntil(sendAnalyticsEvent('received', 'push'));
});


let reloadInitiated = false;

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'cors' &&
        event.request.headers.get('X-Requested-With') === 'XMLHttpRequest') {
        event.respondWith(
            // Try to fetch the request from the network.
            fetch(event.request)
            .catch((error) => {
                if (!reloadInitiated) {
                    reloadInitiated = true;
                    // Use the clients API to get all the active clients (pages).
                    self.clients
                        .matchAll({
                            includeUncontrolled: true,
                            type: 'window',
                        })
                        .then((clients) => {
                            clients.forEach((client) => {
                                // Use the navigate method to reload the page.
                                client.navigate(client.url).then((response) => {
                                    if (response) {
                                        client.postMessage({
                                            action: 'reload'
                                        });

                                        // Reset the flag after a delay (e.g., 5 seconds).
                                        setTimeout(() => {
                                            reloadInitiated = false;
                                        }, 5000);
                                    }
                                });
                            });
                        });
                }

            })
        );
    }
});