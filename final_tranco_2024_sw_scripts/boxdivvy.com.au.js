/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, serviceworker, es6 */

'use strict';

const CACHE_NAME 	= 'static-cache-20241009a';
const CACHE_FILES 	= [
	'/images/logo.svg',
	'/images/symbol-defs.svg',
	'/offline'
];

self.addEventListener('install', (evt) => {
	// console.log('[ServiceWorker] Install');
	// Precache static resources here
	evt.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			// console.log('[ServiceWorker] Pre-caching offline page');
			return cache.addAll(CACHE_FILES);
		})
	);

	self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
	// console.log('[ServiceWorker] Activate');
	// Remove previous cached data from disk
	evt.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== CACHE_NAME) {
					// console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
	
	self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
	// console.log('[ServiceWorker] Fetch', evt.request.url);
	// Add fetch event handler here
	if (evt.request.mode !== 'navigate') {
		// Not a page navigation, bail.
		return;
	}
	evt.respondWith(
		fetch(evt.request)
			.catch(() => {
				return caches.open(CACHE_NAME)
			.then((cache) => {
				return cache.match('/offline');
			});
		})
	);
});
