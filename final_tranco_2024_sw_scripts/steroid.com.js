importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js');

if (workbox) {
  // service worker loaded. do your job now.

	workbox.routing.registerRoute(
	  // Cache CSS files.
	  /admin|\.mp4$/,
	  // Use cache but update in the background.
	  () => {return false}
	);

  	workbox.routing.registerRoute(
	  // Cache CSS files.
	  /\.css$/,
	  // Use cache but update in the background.
	  new workbox.strategies.StaleWhileRevalidate({
	    // Use a custom cache name.
	    cacheName: 'css-cache-v2',
	  })
	);
	
	// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
	workbox.routing.registerRoute(
	  /^https:\/\/fonts\.googleapis\.com|^https:\/\/use\.fontawesome\.com|https:\/\/fonts\.gstatic\.com/,
	  new workbox.strategies.CacheFirst({
	    cacheName: 'external-css-v2',
	    plugins: [
	      new workbox.cacheableResponse.Plugin({
	        statuses: [0, 200],
	      }),
	      new workbox.expiration.Plugin({
	        maxAgeSeconds: 60 * 60 * 24 * 365,
	        maxEntries: 30,
	      }),
	    ],
	  })
	);

	workbox.routing.registerRoute(
	  // Cache CSS files.
	  /\.js$/,
	  // Use cache but update in the background.
	  new workbox.strategies.StaleWhileRevalidate({
	    // Use a custom cache name.
	    cacheName: 'js-cache-v2',
	  })
	);
	
	// cache external javascript
//	const ExternalJs = "/^https:\/\/images\.dmca\.com|^https:\/\/a\.optmnstr\.com|^https:\/\/www\.googletagmanager\.com|^https:\/\/www\.google-analytics\.com|^https:\/\/code\.jquery\.com|^https:\/\/ajax\.googleapis\.com|^https:\/\/cdn\.jsdelivr\.net/";

	//var ExternalJs = "/^https:\/\/code\.jquery\.com|^https:\/\/ajax\.googleapis\.com|^https:\/\/cdn\.jsdelivr\.net/";

	workbox.routing.registerRoute(
	  "/^https:\/\/code\.jquery\.com|^https:\/\/ajax\.googleapis\.com|^https:\/\/cdn\.jsdelivr\.net/",
	  new workbox.strategies.CacheFirst({
	    cacheName: 'external-js-v2',
	    plugins: [
	      new workbox.cacheableResponse.Plugin({
	        statuses: [0, 200],
	      }),
	      new workbox.expiration.Plugin({
	        maxAgeSeconds: 60 * 60 * 24 * 365,
	        maxEntries: 30,
	      }),
	    ],
	  })
	);

	workbox.routing.registerRoute(
	  // Cache image files.
	  /\.(?:png|jpg|jpeg|svg|gif)$/,
	  // Use the cache if it's available.
	  new workbox.strategies.CacheFirst({
	    // Use a custom cache name.
	    cacheName: 'image-cache-v2',
	    plugins: [
	      new workbox.expiration.Plugin({
	        // Cache only 20 images.
	        maxEntries: 30,
	        // Cache for a maximum of a week.
	        maxAgeSeconds: 7 * 24 * 60 * 60,
	      })
	    ],
	  })
	);


}