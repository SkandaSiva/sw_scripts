"use strict";
importScripts('https://s3-eu-west-1.amazonaws.com/static.wizrocket.com/js/sw_webpush.js');
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
var VERSION = '1.0',
	allCaches = ['api-cache' + VERSION, 'js-cache' + VERSION, 'css-cache' + VERSION, 'image-cache' + VERSION, 'meta-cache' + VERSION, 'cdn' + VERSION, 'social-cache' + VERSION, 'html' + VERSION];

// workbox config starts
workbox.setConfig({
	debug: false
});
workbox.core.setCacheNameDetails({
	prefix: 'do-web',
	suffix: VERSION,
	precache: 'prefetch-cache'
});
workbox.loadModule('workbox-strategies');
workbox.core.skipWaiting();
workbox.core.clientsClaim();

// workbox prefetch ends
self.addEventListener('activate', function (e) {
	e.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (allCaches.indexOf(key) === -1) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
});
//delete old cache ends

function getCacheName(name) {
	return name + VERSION;
}

// workbox routing
function cacheResources(params) {
	workbox.routing.registerRoute(
		params.regEx,
		new workbox.strategies[params.strategy || 'StaleWhileRevalidate']({
			cacheName: getCacheName(params.cacheName),
			plugins: [
				new workbox.expiration.Plugin({
					// Only cache requests for a week
					maxAgeSeconds: params.maxAgeSeconds || (7 * 24 * 60 * 60),
					// Only cache 10 requests.
					maxEntries: params.maxEntries || 50
				})
			]
		})
	);
}
var staticAssetResources = [{
		cacheName: 'css-cache',
		regEx: /\.css$/
	},
	{
		cacheName: 'js-cache',
		regEx: /\.js$/
	},
	{
		cacheName: 'image-cache',
		regEx: /\.(?:png|gif|jpe?g|svg)$/
	},
	{
		cacheName: 'font-cache',
		regEx: /\.(?:woff|woff2|ttf|eot)$/,
		maxEntries: 10
	}
];
var cdnResources = [
	/^https:\/\/st1\.dineout-cdn\.co\.in/,
	/^https:\/\/st2\.dineout-cdn\.co\.in/,
	/^https:\/\/st3\.dineout-cdn\.co\.in/,
	/^https:\/\/st4\.dineout-cdn\.co\.in/,
	/^https:\/\/im1\.dineout\.co\.in/,
	/^https:\/\/staging01\.dineout-cdn\.co\.in/,
	/^https:\/\/dn1\.dineout-cdn\.co\.in/
];
var socialResources = [
	new RegExp('https://connect.facebook.net.*\.js'),
	new RegExp('https://cdn.branch.io.*\.js'),
	new RegExp('https://maps.googleapis.com.*\.js'),
	new RegExp('https://maps.gstatic.com.*\.js')
];
cdnResources.forEach(function (cdnPath) {
	var workBoxConfig = {
		cacheName: 'cdn',
		regEx: cdnPath,
		strategy: 'StaleWhileRevalidate'
	};
	cacheResources(workBoxConfig);
});
socialResources.forEach(function (socialPath) {
	var workBoxConfig = {
		cacheName: 'social-cache',
		regEx: socialPath,
		strategy: 'StaleWhileRevalidate'
	};
	cacheResources(workBoxConfig);
});
staticAssetResources.forEach(cacheResources);

self.addEventListener('message', (event) => {
	if (!event.data) {
		return;
	}
	switch (event.data) {
		case 'skipWaiting':
			self.skipWaiting();
			break;
		default:
			// NOOP
			break;
	}
});
//exception Handling starts
workbox.routing.setCatchHandler(({
	url,
	event,
	params
}) => {});

