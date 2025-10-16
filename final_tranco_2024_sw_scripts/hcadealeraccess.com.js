let swVersion = "20230915";

let precacheName = 'sw-precache';
let filesToPreCache = [
	//'/index.html',
	//'/css/style.css',
	//'/Themes/Portal/Scripts/pwa/main.js'
];

/* Start the service worker and cache all of the app's content */
if (filesToPreCache.length > 0) {
	self.addEventListener('install', function (e) {
		e.waitUntil(
			caches.open(precacheName).then(function (cache) {
				return cache.addAll(filesToPreCache);
			})
		);
	});
}

function allowCachingForRequest(pageUrl) {
	let url = new URL(pageUrl);
	let protocol = url.protocol.toLowerCase();
	if (!protocol.startsWith("http")) return false;
	let parts = url.hostname.split('.');
	if (parts.length < 2) return false;
	let top2 = parts.slice(-2).join('.');
	return self.location.origin.endsWith(top2);
}
function allowCachingForResponse(response) {
	let url = new URL(response.url);
	let protocol = url.protocol.toLowerCase();
	if (!protocol.startsWith("http")) return false;
	let parts = url.hostname.split('.');
	if (parts.length < 2) return false;
	if (response.status == 302) return false;
	if (response.status >= 400 && response.status <= 600) return false;
	if (response.status !== 0) // || response.type === "opaque" || response.type === "opaqueredirect")
		return true;
	return false;
}

function clearCaches(preserveContentCaches) {
	if (preserveContentCaches) {
		let staticCacheName = swVersion + ":sw-cache:static";
		let contentCacheName = swVersion + ":sw-cache:swr-content";
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames
					.map(function (cacheName) {
						if (!cacheName.startsWith(staticCacheName) && !cacheName.startsWith(contentCacheName)) {
							// delete the whole cache
							caches.delete(cacheName);
						} else {
							// delete old items within the cache, giving more time to cached content than static items
							let daysThreshold = cacheName.startsWith(contentCacheName) ? 14 : 1;
							let purgeThreshold = 1000 * 60 * 60 * 24 * daysThreshold;
							let current = new Date().getTime();
							caches.open(cacheName).then(function (cache) {
								cache.keys().then(function (keys) {
									return Promise.all(keys.map(async function (k) {
										let cachedResponse = await cache.match(k.url);
										if (cachedResponse && cachedResponse.headers) {
											let fetched = cachedResponse.headers.get('sw-fetched-on');
											if (fetched) {
												let target = parseFloat(fetched) + purgeThreshold;
												if (target < current)
													cache.delete(k.url);
											}
										}
									}));
								});
							});
						}
					})
			);
		})
	} else {
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => caches.delete(cacheName))
			);
		})
	}
}

let _isBroadcastChannelSupported = null;
function isBroadcastChannelSupported() {
	if (_isBroadcastChannelSupported !== null) return _isBroadcastChannelSupported;

	if (!("BroadcastChannel" in self)) {
		_isBroadcastChannelSupported = false;
		return false;
	}

	// When running in a sandboxed iframe, the BroadcastChannel API
	// is not actually available and throws an exception
	try {
		const channel = new BroadcastChannel("feature_test");
		channel.close();
		_isBroadcastChannelSupported = true;
	} catch (err) {
		_isBroadcastChannelSupported = false;
	}
	return _isBroadcastChannelSupported;
};

function refreshCache(e, cacheOptions) {
	const { request } = e;

	e.respondWith(async function () {
		let cacheName = swVersion + ":" + cacheOptions.cacheName;
		const cache = await caches.open(cacheName);

		const networkResponsePromise = fetch(request);
		const networkResponse = await networkResponsePromise;

		if (allowCachingForResponse(networkResponse)) {
			// response needs to be cloned if going to be used more than once
			const clonedResponse = networkResponse.clone();
			let headers = new Headers(clonedResponse.headers);
			headers.append('sw-fetched-on', new Date().getTime());
			cache.put(request, new Response(clonedResponse.body, { status: clonedResponse.status, statusText: clonedResponse.statusText, headers: headers }));
		}

		return networkResponse;
	}());
}
function strategyCacheFirst(e, cacheOptions) {
	const { request } = e;

	e.respondWith(async function () {
		let cacheName = swVersion + ":" + cacheOptions.cacheName;
		const cache = await caches.open(cacheName);

		const cachedResponse = await cache.match(request);
		// if the cached request is newer than set threshold, return from cache
		if (cacheOptions.refreshThreshold > 0 && cachedResponse) {
			let fetched = cachedResponse.headers.get('sw-fetched-on');
			if (fetched) {
				let target = parseFloat(fetched) + cacheOptions.refreshThreshold;
				let current = new Date().getTime();
				if (target > current)
					return cachedResponse;
				else
					cache.delete(cachedResponse);
			}
		}

		const networkResponsePromise = fetch(request);
		const networkResponse = await networkResponsePromise;

		if (allowCachingForResponse(networkResponse)) {
			// response needs to be cloned if going to be used more than once
			const clonedResponse = networkResponse.clone();
			let headers = new Headers(clonedResponse.headers);
			headers.append('sw-fetched-on', new Date().getTime());
			cache.put(request, new Response(clonedResponse.body, { status: clonedResponse.status, statusText: clonedResponse.statusText, headers: headers }));
		}

		return networkResponse;
	}());
}
function strategyCacheOnly(e, cacheOptions) {
	const { request } = e;
	e.respondWith(async function () {
		let cacheName = swVersion + ":" + cacheOptions.cacheName;
		const cache = await caches.open(cacheName);
		const cachedResponse = await cache.match(request);
		if (cachedResponse)
			return cachedResponse;
	}());
}
function strategyStaleWhileRevalidate(e, cacheOptions) {
	// this allows us to response almost instantly with cached data while we're calling the server for more current data
	// adapted from https://gist.github.com/fibo/4a1df242b900d4caa217dfc305266847
	const { request } = e;

	e.respondWith(async function () {
		let cacheName = swVersion + ":" + cacheOptions.cacheName;
		const cache = await caches.open(cacheName);

		const cachedResponse = await cache.match(request);

		// if the cached request is newer than set threshold, return from cache without refreshing from network
		if (cacheOptions.refreshThreshold > 0 && cachedResponse) {
			let fetched = cachedResponse.headers.get('sw-fetched-on');
			if (fetched) {
				let target = parseFloat(fetched) + cacheOptions.refreshThreshold;
				let current = new Date().getTime();
				if (target > current)
					return cachedResponse;
			}
		}

		const networkResponsePromise = fetch(request);

		e.waitUntil(async function () {
			const networkResponse = await networkResponsePromise;
			if (allowCachingForResponse(networkResponse)) {
				let clonedResponse = networkResponse.clone();
				let headers = new Headers(clonedResponse.headers);
				headers.append('sw-fetched-on', new Date().getTime());
				await cache.put(request, new Response(clonedResponse.body, { status: clonedResponse.status, statusText: clonedResponse.statusText, headers: headers }));
				// if the front-end is configured to handle updates via broadcast, send the update once the data is refreshed
				if (cacheOptions.refreshChannel && cacheOptions.refreshChannel !== "none") {
					let validator = cacheOptions.refreshValidator;
					if (cachedResponse) {
						const cachedHeader = cachedResponse.headers.has(validator) ? cachedResponse.headers.get(validator) : null;
						let requestTimestamp = new Date().getTime();
						if (cachedHeader && cachedHeader.length > 0) {
							const networkHeader = networkResponse.headers.get(validator);
							if (cachedHeader != networkHeader) {
								const broadcast = new BroadcastChannel(cacheOptions.refreshChannel);
								if (networkResponse.headers.get('Content-Type') == 'application/json') {
									broadcast.postMessage({ responseData: await networkResponse.json(), url: request.url, requestTimestamp: requestTimestamp });
								} else {
									broadcast.postMessage({ responseData: await networkResponse.text(), url: request.url, requestTimestamp: requestTimestamp });
								}
								broadcast.close();
							}
						}
					}
				}
			}
		}());

		return cachedResponse || networkResponsePromise;
	}());
}

self.addEventListener('activate', event => {
	clearCaches(true);
})

/* Serve cached content when offline */
self.addEventListener('fetch', function (e) {
	let method = e.request.method.toLowerCase();
	if (method !== "get")
		return;

	const cacheBusters = [
		{ url: /\?cache=regenerate/gi, preserveContent: false },
		{ url: /GetAssignedDealer\?principalNumber=/gi, preserveContent: true },
		{ url: /Login\.aspx/gi, preserveContent: true },
		{ url: /Logout\.aspx/gi, preserveContent: true },
		{ url: /Saml\/ConsumerService\.aspx/gi, preserveContent: true }
	];

	let busted = false;
	for (let i = 0; i < cacheBusters.length; i++) {
		if (e.request.url.match(cacheBusters[i].url)) {
			clearCaches(cacheBusters[i].preserveContent);
			busted = true;
		}
	}

	if (!busted) {
		let cacheKey = e.request.headers.get('sw-cache');
		let cacheStrategy = null;
		let refreshChannel = null;
		let refreshValidator = null;
		let refreshThreshold = null;
		if (!cacheKey) {
			// todo: check the sw mode to determine if we should cache static resources
			const selfUrl = new URL(self.location);
			let swMode = selfUrl.searchParams.get('mode');

			// passive allows us to cache what should be static resources
			// explicit only allows caching for requests that explicitly request caching
			if (swMode === "passive") {
				if (e.request.url.endsWith("main.js")) {
					// use strategyStaleWhileRevalidate for main.js
					if (allowCachingForRequest(e.request.url)) {
						cacheKey = "static";
						cacheStrategy = "stale-while-revalidate";
						refreshChannel = "none";
						refreshThreshold = 1000 * 60 * 1; // 1 minute
					}
				} else if (e.request.url.match(/.svg$/gi)) {
					if (allowCachingForRequest(e.request.url)) {
						cacheKey = "static";
						refreshChannel = "none";
						refreshThreshold = 1000 * 60 * 5; // 5 minutes
					}
				} else if (e.request.url.match(/\.css$|\.css\?/gi)) {
					if (allowCachingForRequest(e.request.url)) {
						cacheKey = "static";
						refreshChannel = "none";
						let hasVersion = e.request.url.match(/\.css\?v=/gi);
						if (hasVersion)
							refreshThreshold = 1000 * 60 * 60 * 4; // 4 hours
						else
							refreshThreshold = 1000 * 60 * 5; // 5 minutes
					}
				} else if (e.request.url.match(/\.js$|\.js\?/gi)) {
					if (allowCachingForRequest(e.request.url)) {
						cacheKey = "static";
						refreshChannel = "none";
						let hasVersion = e.request.url.match(/\.css\?v=/gi);
						if (hasVersion)
							refreshThreshold = 1000 * 60 * 60 * 4; // 4 hours
						else
							refreshThreshold = 1000 * 60 * 5; // 5 minutes
					}
				} else if (e.request.url.match(/\.gif\?allowcache/gi)) {
					if (allowCachingForRequest(e.request.url)) {
						cacheKey = "static";
						refreshChannel = "none";
						refreshThreshold = 1000 * 60 * 60 * 1; // 1 hour
					}
				} else if (e.request.url.match(/\.jpg\?allowcache/gi)) {
					if (allowCachingForRequest(e.request.url)) {
						cacheKey = "static";
						refreshChannel = "none";
						refreshThreshold = 1000 * 60 * 60 * 1; // 1 hour
					}
				} else if (e.request.url.match(/\.png\?allowcache/gi)) {
					if (allowCachingForRequest(e.request.url)) {
						cacheKey = "static";
						refreshChannel = "none";
						refreshThreshold = 1000 * 60 * 60 * 1; // 1 hour
					}
				}
			}
		}

		if (cacheKey && cacheKey.length > 0) {
			cacheStrategy = cacheStrategy || e.request.headers.get('sw-strategy');
			if (!cacheStrategy || cacheStrategy === '')
				cacheStrategy = 'cache-first';

			refreshChannel = refreshChannel || e.request.headers.get('sw-refresh-channel');
			if (!refreshChannel || refreshChannel === '')
				refreshChannel = 'none';

			refreshValidator = refreshValidator || e.request.headers.get('sw-refresh-validator');
			if (!refreshValidator || refreshValidator === '')
				refreshValidator = 'etag';

			refreshThreshold = refreshThreshold || e.request.headers.get('sw-refresh-threshold');
			if (refreshThreshold && !isNaN(refreshThreshold))
				refreshThreshold = parseFloat(refreshThreshold);
			else
				refreshThreshold = 0;


			// return from cache or get new data and cache it
			let cacheOptions = { cacheName: 'sw-cache:' + cacheKey, refreshChannel: refreshChannel, refreshValidator: refreshValidator, refreshThreshold: refreshThreshold };

			switch (cacheStrategy) {
				case 'refresh-cache':
					return refreshCache(e, cacheOptions);
					break;
				case 'cache-first':
					return strategyCacheFirst(e, cacheOptions);
					break;
				case 'cache-only':
					return strategyCacheOnly(e, cacheOptions);
					break;
				case 'network-first':
					//todo: implement this
					break;
				case 'network-only':
					e.respondWith(fetch(e.request));
					break;
				case 'stale-while-revalidate':
					if (isBroadcastChannelSupported())
						return strategyStaleWhileRevalidate(e, cacheOptions);
					else
						e.respondWith(fetch(e.request));
					break;
			}
		}
	}
});
