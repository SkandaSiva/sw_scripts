/**
 * This service worker file is meant to be executed in production mode only.
 * When running the app in developer mode, different chunks are being generated which leads to unexpected behaviors.
 * ----
 * Text wrapped in ## ## will be replaced during build time by fe/scripts/build-service-worker.mjs
 */

// @dev: This version changes on every build
const SW_VERSION = '1728646688639'
// Names of the different caches
const DICTIONARY_CACHE = `dictionary-${SW_VERSION}`
const STATIC_CACHE = `static-${SW_VERSION}`
const NAVIGATION_CACHE = `jss-navigation-${SW_VERSION}`
const LAYOUT_CACHE = `jss-layout-${SW_VERSION}`
const IMAGES_CACHE = `images-${SW_VERSION}`

// This remains a string until it is replaced during the build. Then it will be an array of strings
const STATIC_FILES = ['_next/static/chunks/pages/404-6f46c815296b25da.js', '_next/static/chunks/pages/[[...path]]-cfbb357fa1fb9502.js', '_next/static/chunks/pages/_app-fd9b3a4b93a6d30a.js', '_next/static/chunks/pages/_error-7724f7646b8c82bd.js']

self.addEventListener('install', (event) => {
	// Cache Next.js pages
	if (typeof STATIC_FILES !== 'string') {
		event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_FILES)))
	}
	self.skipWaiting()
})

self.addEventListener('activate', (event) => {
	// Clears old caches when a new service worker activates
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.filter((cacheName) => !cacheName.includes(SW_VERSION)).map((cacheName) => caches.delete(cacheName))
			)
		})
	)

	// Makes sure that the service worker starts work directly (not only at the second hit)
	self.clients.claim()
})

self.addEventListener('message', (event) => {
	if (event.data === 'clear-cache') {
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.filter((cacheName) => cacheName === LAYOUT_CACHE).map((cacheName) => caches.delete(cacheName))
			)
		})
	}
})

const handleFetchCaching = (event, cacheName) => {
	event.respondWith(
		// here we implement stale-while-revalidate strategy.
		// we first return cached version and after that update cache with newest one.
		// read more here: https://developer.chrome.com/docs/workbox/caching-strategies-overview
		caches.open(cacheName).then((cache) => {
			return cache.match(event.request).then((cachedResponse) => {
				const fetchedResponse = fetch(event.request)
					.then((networkResponse) => {
						if (
							networkResponse.headers.get('content-type')?.includes('application/json') &&
							// * @dev: Filtering out requests with the header { purpose: 'prefetch' } (from Next.js) is necessary because the service worker otherwise would end up caching and returning the wrong layout data.
							// * Next.js prefetches and CACHES certain data that in our case is empty (e.g. _next/.../data/de/main-area.json)
							// * When we want to navigate to a route (e.g. /de/main-area), the empty prefetched file "_next/.../data/de/main-area.json" will be returned from the cache.
							// * This empty layout data leads to an error in building the page, and finally ends up on the 404 page.
							!event.request.headers.get('purpose')?.includes('prefetch')
						) {
							cache.put(event.request, networkResponse.clone())
						}

						return networkResponse
					})
					.catch(() => {
						// if network call failes, return already cached version, if there is no cached version, return error page
						return (
							cachedResponse ||
							caches.open(STATIC_CACHE).then((cache) => {
								const errorPage = STATIC_FILES.find((path) => path.includes('pages/_error')) // Get _error file path
								return cache.match(errorPage)
							})
						)
					})

				return cachedResponse || fetchedResponse
			})
		})
	)
}

const LAYOUT_ROUTE_INDICATOR = 'path'
const NAVIGATION_ROUTE_INDICATOR = 'sitecore/api/layout/'

self.addEventListener('fetch', (event) => {
	if (event.request.url.includes(NAVIGATION_ROUTE_INDICATOR)) {
		handleFetchCaching(event, NAVIGATION_CACHE)
	} else if (event.request.url.includes(LAYOUT_ROUTE_INDICATOR)) {
		handleFetchCaching(event, LAYOUT_CACHE)
	}
})

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js')

if (workbox) {
	workbox.setConfig({
		skipWaiting: true,
	})

	// Image caching
	workbox.routing.registerRoute(
		/\.(?:png|gif|jpg|jpeg|svg|ico)/,
		new workbox.strategies.NetworkFirst({
			cacheName: IMAGES_CACHE,
			plugins: [
				new workbox.expiration.ExpirationPlugin({
					maxEntries: 60,
					maxAgeSeconds: 24 * 60 * 60, // 1 Day
				}),
			],
		})
	)

	// Sitecore Layout API-Caching
	workbox.routing.registerRoute(
		/path/,
		new workbox.strategies.NetworkFirst({
			cacheName: LAYOUT_CACHE,
			plugins: [
				new workbox.expiration.ExpirationPlugin({
					maxEntries: 50,
					purgeOnQuotaError: true,
				}),
			],
		}),
		'GET'
	)
	// Sitecore Navigation API-Caching
	workbox.routing.registerRoute(
		/sitecore\/api\/layout/,
		new workbox.strategies.NetworkFirst({
			cacheName: NAVIGATION_CACHE,
			plugins: [
				new workbox.expiration.ExpirationPlugin({
					maxEntries: 50,
					purgeOnQuotaError: true,
				}),
			],
		}),
		'GET'
	)

	// Sitecore-Dictionary
	workbox.routing.registerRoute(
		/\/jss\/dictionary/,
		new workbox.strategies.NetworkFirst({
			cacheName: DICTIONARY_CACHE,
			plugins: [
				new workbox.expiration.ExpirationPlugin({
					maxEntries: 50,
					purgeOnQuotaError: true,
				}),
			],
		}),
		'GET'
	)
} else {
	console.error('Workbox could not be loaded. No offline support')
}
