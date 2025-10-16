const PRECACHE = 'basquetpass-83840393';
const RUNTIME = 'runtime';

var staticContentUrl = '/';

var pingLastChecked = 0;


const bpBroadcast = new BroadcastChannel('bpBroadcast');

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
	'index.html',
	'./',
	'styles.css',
	'app.js',
	'site.webmanifest',
	'/libs/jquery-3.7.0/jquery.min.js',
  '/libs/js-cookie-3.0.5/js.cookie.min.js',
  '/libs/tiny-slider-2.9.4/min/tiny-slider.js',
  '/libs/qrcode/qrcode.min.js',
  '/libs/sha512/sha512.js',
  '/libs/select2-4.1.0/js/select2.min.js',
  '/libs/star-rating.js-4.3.0/dist/star-rating.min.js',
  '/libs/datatables-1.13.8/js/jquery.dataTables.min.js',
  '/libs/fixedheader-3.4.0/js/dataTables.fixedHeader.min.js',
  '/libs/libs_async.js',
  '/libs/clappr-0.8.0/clappr.min.js',
  '/libs/clappr-airplay/clappr-airplay.js',
  '/libs/clappr-level-selector-plugin-0.3.0/level-selector.min.js',
  '/libs/clappr-pip-0.1.0/clappr-pip.min.js'
];




// Evento de instalación
self.addEventListener('install', event => {

	event.waitUntil(
		caches.keys().then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				return caches.delete(cacheToDelete);
			}));
		})
	);

	event.waitUntil(
		caches.open(PRECACHE)
			.then(cache => cache.addAll(PRECACHE_URLS))
			.then(self.skipWaiting()));

	// Enviamos un mensaje al cliente para que sepa que ya se instaló el service worker
	bpBroadcast.postMessage({
		msg: 'update'
	});

});

// Evento de activación
self.addEventListener('activate', event => {
	const currentCaches = [PRECACHE, RUNTIME];
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});


// Evento de fetch
self.addEventListener('fetch', event => {

	// Si es un json o un txt, no lo guardamos en cache
	if (event.request.url.indexOf('.json') > -1 || event.request.url.indexOf('.txt') > -1) {
		return false;
	}

	// Si el método es POST, no lo guardamos en cache
	if (event.request.method == 'POST') {
		return false;
	}

	// Skip cross-origin requests, like those for Google Analytics.
	if (event.request.url.startsWith(self.location.origin)) {
		event.respondWith(
			caches.match(event.request).then(cachedResponse => {
				if (cachedResponse) {
					return cachedResponse;
				}
				return caches.open(RUNTIME).then(cache => {
					return fetch(event.request).then(response => {

						// Si la respuesta es una redirección, no la guardamos en cache
						if (response.redirected || response.type == 'opaqueredirect') {
							return response;
						}

						// Si la respuesta no es 200, no la guardamos en cache
						if (response.status != 200) {
							return response;
						}

						return cache.put(event.request, response.clone()).then(() => {
							return response;
						});
					});
				});
			})
		);
	}
});