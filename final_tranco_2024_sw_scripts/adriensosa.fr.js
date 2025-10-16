'use strict';

/**
 * Service Worker of SuperPWA
 * To learn more and add one to your website, visit - https://superpwa.com
 */
 
const cacheName = 'adriensosa.fr-superpwa-2.1.2';
const startPage = 'https://adriensosa.fr';
const offlinePage = 'https://adriensosa.fr/';
const filesToCache = [startPage, offlinePage, 'https://adriensosa.fr/wp-content/uploads/2019/11/Combined-Shape.svg', 'https://adriensosa.fr/wp-content/uploads/2019/11/XMLID_4_.svg', 'https://adriensosa.fr/wp-content/uploads/2019/11/shopify.svg', 'https://adriensosa.fr/wp-content/uploads/2019/11/Group-7.svg', 'https://adriensosa.fr/wp-content/uploads/2019/11/Group-6.svg', 'https://adriensosa.fr/wp-content/uploads/2019/11/Group-9.svg', 'https://adriensosa.fr/wp-content/uploads/2019/11/Group-8.svg', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-be-ethnic-2019-11-16-09_32_05.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-be-ethnic-2019-11-16-09_32_05.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-leventalafrancaise-fr-nos-produits-2019-11-16-09_23_11.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-vufbikes-epizy-2019-11-16-12_11_00.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-vaahnora-2019-11-17-07_59_56.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/desktop-glissées.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-laboratoires-cap-ferret-2019-11-16-09_13_11.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-vaahnora-2019-11-17-07_59_56.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-kwik-delivery-2019-11-16-09_26_16.png', 'https://adriensosa.fr/wp-content/uploads/2020/05/foreach.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-revendeurs-leventalafrancaise-wp-login-php-2019-11-17-07_47_52.png', 'https://adriensosa.fr/wp-content/uploads/2020/05/smartinteractive.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-leventalafrancaise-fr-nos-produits-2019-11-16-09_23_11-e1573974508685.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-vufbikes-epizy-2019-11-16-12_11_00.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-vaahnora-2019-11-17-07_59_56.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-anthonyparent-coaching-fr-2019-11-16-11_29_05.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-vaahnora-2019-11-17-07_59_56.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-anthonyparent-coaching-fr-2019-11-16-11_29_05.png', 'https://adriensosa.fr/wp-content/uploads/2019/11/screencapture-vufbikes-epizy-2019-11-16-12_11_00.png', 'https://adriensosa.fr/wp-content/uploads/2020/05/foreach.png'];
const neverCacheUrls = [/\/wp-admin/,/\/wp-login/,/preview=true/];

// Install
self.addEventListener('install', function(e) {
	console.log('SuperPWA service worker installation');
	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log('SuperPWA service worker caching dependencies');
			filesToCache.map(function(url) {
				return cache.add(url).catch(function (reason) {
					return console.log('SuperPWA: ' + String(reason) + ' ' + url);
				});
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
				if ( key !== cacheName ) {
					console.log('SuperPWA old cache removed', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', function(e) {
	
	// Return if the current request url is in the never cache list
	if ( ! neverCacheUrls.every(checkNeverCacheList, e.request.url) ) {
	  console.log( 'SuperPWA: Current request is excluded from cache.' );
	  return;
	}
	
	// Return if request url protocal isn't http or https
	if ( ! e.request.url.match(/^(http|https):\/\//i) )
		return;
	
	// Return if request url is from an external domain.
	if ( new URL(e.request.url).origin !== location.origin )
		return;
	
	// For POST requests, do not use the cache. Serve offline page if offline.
	if ( e.request.method !== 'GET' ) {
		e.respondWith(
			fetch(e.request).catch( function() {
				return caches.match(offlinePage);
			})
		);
		return;
	}
	
	// Revving strategy
	if ( e.request.mode === 'navigate' && navigator.onLine ) {
		e.respondWith(
			fetch(e.request).then(function(response) {
				return caches.open(cacheName).then(function(cache) {
					cache.put(e.request, response.clone());
					return response;
				});  
			})
		);
		return;
	}

	e.respondWith(
		caches.match(e.request).then(function(response) {
			return response || fetch(e.request).then(function(response) {
				return caches.open(cacheName).then(function(cache) {
					cache.put(e.request, response.clone());
					return response;
				});  
			});
		}).catch(function() {
			return caches.match(offlinePage);
		})
	);
});

// Check if current url is in the neverCacheUrls list
function checkNeverCacheList(url) {
	if ( this.match(url) ) {
		return false;
	}
	return true;
}
