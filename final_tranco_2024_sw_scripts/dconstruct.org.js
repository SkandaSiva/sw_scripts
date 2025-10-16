'use strict';

// Import Jake's polyfill for async waitUntil
importScripts('/j/async-waituntil.js');

const versionNumber = '0.4';
const staticCacheName = 'static' + versionNumber;
const archiveCacheName = 'archive';
const cacheList = [
	staticCacheName,
	archiveCacheName
];

addEventListener('install', installEvent => {
  skipWaiting();
	installEvent.waitUntil(
		caches.open(staticCacheName)
		.then( staticCache => {
			// must have
			return staticCache.addAll([
        '/offline.php',
				'/c/main.css',
				'/j/main.js',
        '/j/offline.js',
        '/i/logo.png',
        '/i/sprite.png'
			]); // end return addAll
		}) // end open then
	); // end waitUntil
}); // end addEventListener

addEventListener('activate', activateEvent => {
	activateEvent.waitUntil(
		caches.keys()
		.then( cacheNames => {
			return Promise.all(
				cacheNames.filter( cacheName => {
					if (!cacheList.includes(cacheName)) {
						return caches.delete(cacheName);
					} // end if
				}) // end filter
			); // end return Promise.all
		}) // end keys then
		.then( () => {
			return clients.claim();
		}) // end then
	); // end waitUntil
});	// end addEventListener

addEventListener('fetch', fetchEvent => {
	const request = fetchEvent.request;
	// don't do anything with audio files
	if (request.headers.get('Accept').includes('audio')) {
		return;
	} // end if
  fetchEvent.respondWith(
		// fetch the resource
		fetch(request)
		.then( responseFromFetch => {
			// and put a copy in the cache.
			let copy = responseFromFetch.clone();
			fetchEvent.waitUntil(
				caches.open(archiveCacheName)
				.then( archiveCache => {
					archiveCache.put(request, copy);
				}) // end open then
			); // end waitUntil
			return responseFromFetch;
		}) // end fetch then
		.catch( error => {
			// otherwise look for a cached copy
			caches.match(request)
			.then( responseFromCache => {
				if (responseFromCache) {
					return responseFromCache;
				} // end if
				// fallback for offline web pages
				if (request.headers.get('Accept').includes('text/html')) {
					return caches.match('/offline.php');
				} // end if
				// fallback for offline images
				if (request.headers.get('Accept').includes('image')) {
					return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', {headers: {'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store'}});
				} // end if
			}) // end caches then
		}) // end fetch catch
	); // end respondWith
	return; // go no further
}); // end addEventListener
