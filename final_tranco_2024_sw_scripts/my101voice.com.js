const CACHE_VERSION = 'new-web-v4.0-build-1730365285';
const BUILD_TIMESTAMP = /-(\d+)$/.exec(CACHE_VERSION)[1];
//const OFFLINE_IMAGE = 'src/app/components/common/offline.png';
//const OFFLINE_PAGE = 'src/app/components/common/offline.html';

const addBuildTimestamp = (url) => url + '?v=' + BUILD_TIMESTAMP;

const configFileRegex = /\.(conf|ini)(\?v=\d+)?$/;
const localFileRegex = /^\/?local\//;
const localizedTemplatesRegex = /^\/?local\/templates\//;

const shouldCache = (request) => {
	const url = request.url;
	return !configFileRegex.test(url)
		&& (!localFileRegex.test(url) || localizedTemplatesRegex.test(url))
		&& url != 'index.html';
};

// Requests fail over service worker when using POST instead of GET in Firefox when they
// have body larger than 16kb. This bypasses ServiceWorker fetch and let's browser handle it
const shouldBypassSW = (request) => request.method !== 'GET';

const cacheDefaultFiles = (cache) =>
	cache
		.addAll(
			[
				// index.html??
				'styles/vendor.css',
				'styles/app.css',
				'scripts/vendor.js',
				'scripts/app.js',
				'app/components/common/404.html',
				'app/components/common/content.html',
				'app/components/common/destinationSelect.html',
				'app/components/common/footer.html',
				'app/components/common/ibox_tools.html',
				'app/components/common/navigation.html',
				'app/components/common/textDestinationSelect.html',
				// 'app/components/common/topnavbar.html',
			].map(addBuildTimestamp)
		)
		.catch(() => {
			return 1;
		});

self.addEventListener('install', (event) => {
	self.skipWaiting();
	event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cacheDefaultFiles(cache)));
});

self.addEventListener('activate', function(event) {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys.map((key) => {
					if (key != CACHE_VERSION) {
						return caches.delete(key);
					}
				})
			);
		})
	);
});

const fetchAndCache = (request) =>
	caches.open(CACHE_VERSION).then((cache) =>
		fetch(request).then((response) => {
			cache.put(request, response.clone());
			return response;
		})
	);

self.addEventListener('fetch', (event) => {
	if (shouldBypassSW(event.request)) return;
	if (!shouldCache(event.request)) return;
	event.respondWith(caches.match(event.request).then((data) => data || fetchAndCache(event.request)));
});
