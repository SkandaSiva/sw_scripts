/*global self, caches */

// This is the service worker code that lives at the root (sw.js)
'use strict';

// You have to supply a name for your cache, this will
// allow us to remove an old one to avoid hitting disk
// space limits and displaying old resources
var cacheName = 'v1';

// Change for your sitemap's path if that's what
// you'll use to get your blog's pages
var sitemapUrl = '';

// Assets to cache
// The items to cache at this point should be something you don't forsee
// changing often, such as base styles, scripts, fonts, logos, etc.
var assetsToCache = [
	'/assets/styles/css/style.css',
	'/assets/scripts/min/fatkit.min.js'
	// Add any image files you might need here too
];

self.addEventListener('install', function(event)
{

	// waitUntil() ensures that the Service Worker will not
	// install until the code inside has successfully occurred
	event.waitUntil(
		// Create cache with the name supplied above and
		// return a promise for it
		caches.open(cacheName).then(function(cache)
		{

			if(sitemapUrl !== '')
			{

				// Add all assets to cache
				cache.addAll(assetsToCache);

				// Get your blog's pages and add them to cache
	      		cachePages(cache);

	      	} else {

				// Important to `return` the promise here to have `skipWaiting()`
				// fire after the cache has been updated.
	      		return cache.addAll(assetsToCache);

	      	}

		})
		.then(function ()
		{

			// `skipWaiting()` forces the waiting ServiceWorker to become the
			// active ServiceWorker, triggering the `onactivate` event.
			// Together with `Clients.claim()` this allows a worker to take effect
			// immediately in the client(s).
			return self.skipWaiting();

		})
		.catch(function(e)
		{

			console.error('[FatKit] Service worker error occured when trying to add files to cache. Do the files specified in the assetsToCache array (in sw.js) exist? Error:', e);

		})
	);

});

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', function(event)
{

	// `claim()` sets this worker as the active worker for all clients that
	// match the workers scope and triggers an `oncontrollerchange` event for
	// the clients.
	return self.clients.claim();

});

function cachePages(cache)
{

	// Get sitemap and return the text response
	fetch(sitemapUrl).then(function(response)
	{

		return response.text();

	}).then(function(text)
	{

		// Regex to match xml locations (URLs)
		var pattern = /<loc>(.+?)</g;
		// Get all matches within the text
		var urls = getMatches(text, pattern);
		// Add them to the previously opened cache
		cache.addAll(urls);

	});

}

// Simple function to get multiple matched groups
function getMatches(string, regex)
{

	var matches = [];
	var match;
	while(match = regex.exec(string))
	{

		matches.push(match[1]);

	}
	return matches;

}

self.addEventListener('fetch', function(event)
{

	// Get current path
	var requestUrl = new URL(event.request.url);

	// Ignore non-get request like when accessing the admin panel
	if(event.request.method !== 'GET')
	{
		return;
	}

	// Don't try to handle non-secure assets because fetch will fail
	if(/http:/.test(event.request.url))
	{
		return;
	}

	// Ignore certain file types
	// Necessary for PDFs (and maybe others), as service workers won't fetch files in an <embed> or <object> tag,
	// but browsers may use these tags with their native file viewers (eg, Chrome's PDF viewer uses embed)
	// Reference: https://www.chromestatus.com/feature/6313531834105856
	var ignoreFileExtensions = [ 'pdf' ];

	var fileExtRegex = /\.([A-z]*)$/gm;
	var fileExtMatch = fileExtRegex.exec(requestUrl.pathname);

	if (fileExtMatch && ignoreFileExtensions.includes(fileExtMatch[1]))
	{
		console.log(`[FatKit] Service worker ignored this ${fileExtMatch[1].toUpperCase()} file: `, requestUrl.href);
		return;
	}

	// Save all resources on origin path only
	if(requestUrl.origin === location.origin)
	{

		// To cache specific page check it here
		// if(requestUrl.pathname === '/')
		// {

		// Here's where we cache all the things!
		event.respondWith(
			// Open the cache created when install
			caches.open(cacheName).then(function(cache)
			{

				// Go to the network to ask for that resource
				return fetch(event.request).then(function(networkResponse)
				{

					// Add a copy of the response to the cache (updating the old version)
					cache.put(event.request, networkResponse.clone());

					// Respond with it
					return networkResponse;

				}).catch(function()
				{

					// If there is no internet connection, try to match the request
					// to some of our cached resources
					return cache.match(event.request);

				});

			})
		);

	// }

	}

});
