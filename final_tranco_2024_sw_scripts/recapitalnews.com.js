	'use strict';

	importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js');

	/**
	* Custom Service Worker for PEI
	*/

	var hUrl = location.hostname;
    const startPage = (hUrl == 'www.pehub.com') ? 'www.pehub.com' : '.';

	const offlinePage = '/you-are-offline/';


	const cacheDeleteRegEx = /(.*)-superpwa-2.0.2/g;

	// Install and precache
	self.addEventListener('install', function(e) {
		console.log('--- SuperPWA service worker installation ---');
		e.waitUntil(
			caches.open('page-cache').then(function(cache) {
				console.log('Caching start page');
				return cache.add(startPage).catch(function (reason) {
					return console.log(String(reason) + ' ' + startPage);
				});
			}),
			caches.open('page-cache').then(function(cache) {
				console.log('Caching offline page');
				return cache.add(offlinePage).catch(function (reason) {
					return console.log(String(reason) + ' ' + offlinePage);
				});
			})
		);
	});

	// Activate
    self.addEventListener('activate', function(e) {
        console.log('SuperPWA service worker activation');
        e.waitUntil(
			caches.keys().then(function(keyList) {
				return Promise.all(keyList.map(function(key) {
					console.log('Existing Key: ', key);
					// remove all cached keys left by 'superpwa' plugin
					if(key.match(cacheDeleteRegEx)) {
						console.log('SuperPWA old cache removed', key);
						return caches.delete(key);
					}
				}));
			})
		);
        return self.clients.claim();
    });



	/**
	* Handle the precache requests
	*/
	async function handlePrecacheRequest(event) {

		// Configure the strategy in advance.
		const strategy = new workbox.strategies.StaleWhileRevalidate({cacheName: 'page-cache'});

		// Create a new url without the url param.
		const url = event.request.url;
		const urlWithoutPrecache = url.replace('&?precache=true', '');

		// Create a new request but retain all original request args.
		const requestWithoutPrecache =  new Request(urlWithoutPrecache, {
			method: event.request.method,
			headers: event.request.headers,
			referrer: event.request.referrer,
			referrerPolicy: event.request.referrerPolicy,
			mode: event.request.mode,
			credentials: event.request.credentials,
			cache: event.request.cache,
			redirect: event.request.redirect,
			integrity: event.request.integrity,
		});

		// Make a new and return the response.
		const response = await strategy.makeRequest({ event , request: requestWithoutPrecache });
		return response
	}


	// Event listener for all fetch requests
	self.addEventListener("fetch", event => {
		// Only intercept urls ending with &?precache=true.
		if (event.request.url.endsWith('&?precache=true')) {
			event.respondWith(handlePrecacheRequest(event));
		}
	});


	workbox.setConfig({
		debug: false,
		skipWaiting: true,
		clientsClaim: true
	})

	/**
	* Enabled Analytics Module
	*/
	workbox.googleAnalytics.initialize();

	workbox.routing.registerRoute(
		new RegExp('.*(?:googleapis|gstatic)\.com.*$'),
		new workbox.strategies.StaleWhileRevalidate(),
	)

	workbox.routing.registerRoute(
		new RegExp('.*(?:twimg|twitter)\.com.*$'),
		new workbox.strategies.StaleWhileRevalidate(),
	)

	workbox.routing.registerRoute(
		new RegExp('.*(?:gravatar)\.com.*$'),
		new workbox.strategies.StaleWhileRevalidate(),
	)

	workbox.routing.registerRoute(
		new RegExp('.*\.js'),
		new workbox.strategies.StaleWhileRevalidate({
			cacheName: 'js-cache',
		})
	)

	workbox.routing.registerRoute(
		new RegExp('.*\.css'),
		new workbox.strategies.StaleWhileRevalidate({
			cacheName: 'css-cache',
		})
	)

	workbox.routing.registerRoute(
		new RegExp('.*(?:woff|woff2|otf|ttf|eot)$'),
		new workbox.strategies.StaleWhileRevalidate({
			cacheName: 'font-cache',
		})
	)

	workbox.routing.registerRoute(
		new RegExp('.*(?:png|gif|jpg|jpeg|svg|ico)$'),
		new workbox.strategies.StaleWhileRevalidate({
			cacheName: 'image-cache',
		})
	)

	workbox.routing.registerRoute(
		new RegExp('\/(?:blaize).*$'),
		new workbox.strategies.NetworkOnly(),
	)

	workbox.routing.registerRoute(
		new RegExp('\/(?=my-si|my-agri|my-pei|my-pere|my-pdi|my-ii|my-pfm|my-rec|my-rcw|my-buyouts|my-pehub|my-vcj).*'),
		new workbox.strategies.NetworkFirst({
			cacheName: 'my-cache',
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 100,
					maxAgeSeconds: 168 * 60 * 60
				}),
			]
		})
	)

	workbox.routing.registerRoute(
		new RegExp('\/((?!wp-admin|wp-login).)*$'),
		new workbox.strategies.NetworkFirst({
			cacheName: 'page-cache',
			plugins: [
				new workbox.expiration.Plugin({
					maxEntries: 200,
					maxAgeSeconds: 168 * 60 * 60
				})
			]
		})
	)

	// This "catch" handler is triggered when any of the other routes fail to
	// generate a response.
	workbox.routing.setCatchHandler(({event}) => {
		// Use event, request, and url to figure out how to respond.
		// One approach would be to use request.destination, see
		// https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
		switch (event.request.destination) {
			case 'document':
				return caches.match(offlinePage);
				break;

			default:
				// If we don't have a fallback, just return the offline page.
				return caches.match(offlinePage);
		}
	})

	