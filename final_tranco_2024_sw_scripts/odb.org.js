importScripts("/precache-manifest.25e73b49f17028d8dae9d965f8c15fda.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/* eslint-disable */
// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
// workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
// Service Worker Tips:
// If the service worker matches a request to multiple routes it will apply
// the FIRST route matched. This means you must configure routes in the correct
// order so they apply to your desired patternglobal.fetch = require('node-fetch');
// When configuring an API consider putting the Network Only routes first, as they
// are more specific.
/*
	Change version to cause service worker to update
	Version: 1.0.0
 */
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event =>
	event.waitUntil(self.clients.claim())
);

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
// workbox.precaching.precacheAndRoute(self.__precachManifest);
workbox.precaching.precacheAndRoute([]);

// app-shell
workbox.routing.registerRoute('/', new workbox.strategies.NetworkFirst());

workbox.routing.registerRoute(
	'/index.html',
	new workbox.strategies.NetworkFirst()
);

// Cache devotional images
workbox.routing.registerRoute(
	new RegExp('https://d626yq9e83zk1\\.cloudfront\\.net/files/*'),
	new workbox.strategies.CacheFirst()
);

// Cache devotional images
workbox.routing.registerRoute(
	new RegExp('https://d1k7cnoc6ailay\\.cloudfront\\.net/files/*'),
	new workbox.strategies.CacheFirst()
);

// Cache logo
workbox.routing.registerRoute(
	new RegExp(
		'https://odb.org/wp-content/themes/odbm-base-ourdailybread/images/odb_logo.svg'
	),
	new workbox.strategies.CacheFirst()
);

// Layouts & widgets
// workbox.routing.registerRoute(
// 	new RegExp(
// 		'https://w8ng8gn2c5\\.execute-api\\.us-east-1\\.amazonaws\\.com/*'
// 	),
// 	new workbox.strategies.NetworkFirst()
// );

// // more Layouts & widgets
// workbox.routing.registerRoute(
// 	new RegExp(
// 		'https://3662w03kbi\\.execute-api\\.us-east-1\\.amazonaws\\.com/*'
// 	),
// 	new workbox.strategies.NetworkFirst()
// );

// // translations
// workbox.routing.registerRoute(
// 	'https://3662w03kbi.execute-api.us-east-1.amazonaws.com/beta/translation/language',
// 	new workbox.strategies.StaleWhileRevalidate()
// );

/******************************************
 * Begin Pages Microservice Routes
 *****************************************/
// Pages2020 Microservice - DEV route without /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/pages2020-dev/(?!admin)*'),
	new workbox.strategies.NetworkOnly()
);

// Pages2020 Microservice - DEV route with /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/pages2020-dev/admin*'),
	new workbox.strategies.NetworkOnly()
);

// Pages2020 Microservice - PROD route with /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/pages2020-prod/admin*'),
	new workbox.strategies.NetworkOnly()
);

// Pages2020 Microservice - PROD route without /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/pages2020-prod/(?!admin)*'),
	new workbox.strategies.CacheFirst()
);

// Pages Microservice - Admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/pages(?!-dev)/admin*'),
	new workbox.strategies.NetworkOnly()
);

// Pages Microservice - dev route with /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/pages-dev/admin*'),
	new workbox.strategies.NetworkOnly()
);

// Pages Microservice - dev route without /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/pages-dev/(?!admin)*'),
	new workbox.strategies.CacheFirst()
);

// Pages Microservice - prod route without /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/pages/(?!admin)*'),
	new workbox.strategies.CacheFirst()
);
/*****************************************
 * END Pages Microservice Routes
 *****************************************/

/*********************************************
 * Begin Layouts & Widgets Microservice Routes
 *********************************************/

// Layouts - PROD & DEV route with /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/widgets/layouts/admin*'),
	new workbox.strategies.NetworkFirst()
);

// Layouts - PROD & DEV route without /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/widgets/layouts/(?!admin)*'),
	new workbox.strategies.StaleWhileRevalidate()
);

// Widgets - PROD & DEV route with /admin
workbox.routing.registerRoute(
	/^https:\/\/api\.experience\.odb\.org\/widgets\/admin.*$/i,
	new workbox.strategies.NetworkFirst()
);

// Widgets - PROD & DEV route without /admin
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/widgets/(?!admin)*'),
	new workbox.strategies.StaleWhileRevalidate()
);
/*********************************************
 * END Layouts Microservice Routes
 *********************************************/

/******************************************
 * Begin Devotional Microservice Routes
 *****************************************/

// Devotional Microservice - route with admin
workbox.routing.registerRoute(
	/^https:\/\/api\.experience\.odb\.org\/devotionals(-dev)?\/(v2\/)?admin.*$/i,
	new workbox.strategies.NetworkOnly()
);

// Devotional Microservice - route without admin
workbox.routing.registerRoute(
	/^https:\/\/api\.experience\.odb\.org\/devotionals(?!.*admin).*$/i,
	new workbox.strategies.CacheFirst()
);
/******************************************
 * END Devotional Microservice Routes
 *****************************************/

// User Interactions
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/reading-progress*'),
	new workbox.strategies.NetworkOnly()
);

// User Interactions
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/interactions/*'),
	new workbox.strategies.NetworkOnly()
);

// Crouton - generic admin route for microservices
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/admin*'),
	new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
	new RegExp('/20*'),
	new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
	new RegExp('/wp-json/*'),
	new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
	new RegExp('https://ourdailybread\\.org/wp-json/*'),
	new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
	new RegExp('https://odb\\.org/wp-json/*'),
	new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
	new RegExp('/fontello-*'),
	new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
	'/manifest.json',
	new workbox.strategies.StaleWhileRevalidate()
);
/******************************************
 * ::::BEGIN:::: ODB App Settings - Account Linker
 *****************************************/
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/account-linker*'),
	new workbox.strategies.NetworkOnly()
);

workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/odb-app-settings-*'),
	new workbox.strategies.NetworkOnly()
);
/******************************************
 * ::::END::::  ODB App Settings - An Admin Feature
 *****************************************/

/******************************************
 * ::::BEGIN:::: Image Uploader // Gallery - An Admin Feature
 *****************************************/
workbox.routing.registerRoute(
	new RegExp('https://api\\.experience\\.odb\\.org/image-uploader-*'),
	new workbox.strategies.NetworkOnly()
);
/******************************************
 * ::::END:::: Image Uploader // Gallery - An Admin Feature
 *****************************************/

/******************************************
 * ::::BEGIN:::: Catch-all for admin routes
 *****************************************/
workbox.routing.registerRoute(
	/^https:\/\/.*odb.org\/admin(\/.*)?$/i,
	new workbox.strategies.NetworkOnly()
);
/******************************************
 * ::::END:::: Catch-all for admin routes
 *****************************************/

/******************************************
 * :::: THIS SHOULD BE THE LAST ROUTE ::::
 *****************************************/
workbox.routing.registerRoute(
	/^https:\/\/api\.experience\.odb\.org\/(?!.*admin).*$/i,
	new workbox.strategies.StaleWhileRevalidate()
);
/******************************************
 * :::: THIS SHOULD BE THE LAST ROUTE ::::
 * If no other SW route applies, then cache API responses to help deliver content to our users FAST
 *****************************************/

/******************************************
 * :::: THIS SHOULD BE THE REAL LAST ROUTE ::::
 * :::: WE WANT THE PERMISSIONS TO ALWAYS BE NETWORK ONLY. SO LEAVE THIS THE LAST ROUTE. ::::
 * Begin Permissions Microservice Routes
 *****************************************/

// User Permissions - An Admin Feature
workbox.routing.registerRoute(
	/^https:\/\/api\.experience\.odb\.org\/user-permissions(-(dev|qa|uat))?(\/[\w-]+)?(\?.+)?$/i,
	new workbox.strategies.NetworkOnly()
);
/******************************************
 * END Permissions Microservice Routes
 *****************************************/

// ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

