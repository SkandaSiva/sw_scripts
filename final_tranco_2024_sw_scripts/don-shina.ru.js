let _dt = new Date(),
	_day = Array.from([_dt.getFullYear(), (_dt.getMonth() + 1), _dt.getDate()], el => el.toString().padStart(2, '0')).join('-'),
	_hour = [_day, _dt.getHours()].join('_');

// Конфигурация воркера
const DEBUG = false,
	RELEASE_VERSION = 7,
	CACHE_VERSION = 1,
	TEMPLATE_PATH = '/local/templates/donshina2022/',
	CURRENT_CACHES = {
		prefetch: 'prefetch_cache-r' + RELEASE_VERSION + '-v' + CACHE_VERSION,
		runtime: 'runtime_cache-r' + RELEASE_VERSION + '-v_' + _day,
		short: 'short_cache-r' + RELEASE_VERSION + '-v_' + _hour,
		short_auto: 'auto_cache-r' + RELEASE_VERSION + '-v_' + _hour,
	};

let _prefetchUrls = [ // Список ресурсов для предзагрузки
		TEMPLATE_PATH + 'fonts/NotoSans.woff2',
		TEMPLATE_PATH + 'fonts/NotoSans-Bold.woff2',
		TEMPLATE_PATH + 'fonts/NotoSans-SemiBold.woff2',
		TEMPLATE_PATH + 'fonts/donshina.woff2',
		TEMPLATE_PATH + 'css/style.min.css',
		TEMPLATE_PATH + 'img/bg-tire-tracks.svg',
		TEMPLATE_PATH + 'img/icons/icons.svg',
		'/apple-touch-icon.png',
		'/favicon-32x32.png',
		'/favicon-16x16.png',
		'/favicon_120x120.svg',
		'/site.webmanifest',
		'/safari-pinned-tab.svg',
		'https://bitrix.info/ba.js',
	],
	_cached = { // Список динамически кэшируемых страниц, см.: local/templates/donshina2022/js/api.js: request(), addToCache == true
		'short_auto': [
			'/local/templates/donshina2022/js/',
			'/bitrix/cache/css/s1/',
			'/bitrix/cache/js/s1/',
			'/bitrix/js/main/',
			'/bitrix/js/ui/',
			'/bitrix/js/fileman/',
			'/bitrix/cache/css/',
			'/bitrix/cache/css/',
			/*'/bitrix/panel/',
			'/bitrix/themes/',
			'/img/product/small/',
			'/img/brand/preview/',
			'/img/brand/small/',
			'/img/brand/svg/',*/
			'https://yastatic.net/share2/share.js',
		]
	};

// Пробрасываем события через все табы, добавляем и удаляем адреса в кэш
self.addEventListener('message', async (event) => {
	if ('data' in event && typeof event.data === 'object') {
		if ('broadcast' in event.data && event.data.broadcast === true && 'eventType' in event.data) {
			const _clients = await clients.matchAll();
			if (_clients) _clients.forEach(client => client.postMessage(event.data));
		}
		// Добавление url в динамический кэш
		else if ('addToCache' in event.data && event.data.addToCache.length) {
			let type = event.data.cacheType ? event.data.cacheType : 'runtime';

			if (!_cached[type]) _cached[type] = [];
			if (_cached[type].indexOf(event.data.addToCache) === -1) _cached[type].push(event.data.addToCache);
		}
		// Удаление url из динамического кэша
		else if ('removeFromCache' in event.data && event.data.removeFromCache.length) {
			for (let type in CURRENT_CACHES) {
				if (type === 'prefetch') continue;

				if (_cached[type]) {
					let index = _cached[type].indexOf(event.data.removeFromCache);
					if (index !== -1) _cached[type].splice(event.data.removeFromCache, 1);
				}

				caches.open(CURRENT_CACHES[type]).then((cache) => {
					cache.match(event.data.removeFromCache).then(function (response) {
						if (response) cache.delete(event.data.removeFromCache).then(() => {
							console.log('sw.js: cache[' + type + '] deleted:', event.data.removeFromCache);
						});
					});
				});
			}
		}
	}
});

// Кэшируем ресурсы
self.addEventListener('install', function (event) {
	event.waitUntil(self.skipWaiting());

	let now = Date.now();

	if (DEBUG) console.log('sw.js: Handling install event. Resources to prefetch:', _prefetchUrls);

	event.waitUntil(
		caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
			let cachePromises = _prefetchUrls.map(function (urlToPrefetch) {
				let url = new URL(urlToPrefetch, location.href);
				url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;

				let request = new Request(url, {
					mode: 'no-cors'
				});
				return fetch(request).then(function (response) {
					if (response.status >= 400) throw new Error('request for ' + urlToPrefetch + ' failed with status ' + response.statusText);

					return cache.put(urlToPrefetch, response);
				}).catch(function (error) {
					//if (DEBUG) console.error('sw.js: Not caching ' + urlToPrefetch + ' due to ' + error);
				});
			});

			return Promise.all(cachePromises).then(function () {
				if (DEBUG) console.log('sw.js: Pre-fetching complete.');
			});
		}).catch(function (error) {
			//if (DEBUG) console.error('sw.js: Pre-fetching failed:', error);
		})
	);
});

// Удаляем лишнее из кэша
self.addEventListener('activate', function (event) {
	event.waitUntil(self.clients.claim());

	let expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
		return CURRENT_CACHES[key];
	});
	event.waitUntil(
		caches.keys().then(function (cacheNames) {
			return Promise.all(
				cacheNames.map(function (cacheName) {
					if (expectedCacheNames.indexOf(cacheName) === -1) {
						if (DEBUG) console.log('sw.js: Deleting out of date cache:', cacheName);
						console.log('sw.js: Delete cache ' + cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// Получаем данные из кэша, или прямым запросом, если кэша нет
self.addEventListener('fetch', function (event) {
	//if (DEBUG) console.log('sw.js: Handling fetch event for:', event.request.url);

	event.respondWith(
		caches.match(event.request).then(function (response) {
			if (response) {
				//if (DEBUG) console.log('sw.js: Found response in cache:', response);
				return response;
			}

			//if (DEBUG) console.log('sw.js: No response found in cache. About to fetch from network...');

			let request = event.request;
			if (event.request.url.indexOf('http://') === 0 || event.request.url.indexOf('https://')) {
				request = new Request(event.request.url, {
					mode: 'no-cors'
				});
			}

			return fetch(request).then(function (response) {
				//if (DEBUG) console.log('sw.js: Response from network is:', response);

				// Динамический кэш
				if (_cached) {
					let url = new URL(request.url);
					if (url) for (let type in _cached) if (_cached.hasOwnProperty(type) && _cached[type]) {
						if ((type !== 'short_auto' && (_cached[type].includes(url.pathname) || _cached[type].includes(url.href))) || // Кэш, добавляемый вручную
							(type === 'short_auto' && ['style', 'script', 'image'].includes(request.destination) && _cached[type].some(path => {
								return url.pathname.indexOf(path) === 0
							})) // Автодобавляемый кэш
						) {
							//if (DEBUG) console.log('sw.js: URL in _cached[' + type + ']:', request.url);

							return caches.open(CURRENT_CACHES[type]).then(function (cache) {
								if (DEBUG) console.log('sw.js: Аdd to dinamic cache[' + type + ']:', request.url);
								cache.put(request.url, response.clone());
								return response;
							});
						}
					}
				}

				return response;
			}).catch(function (error) {
				//if (DEBUG) console.error('sw.js: Fetching failed:', error);
				throw error;
			});
		})
	);
});

// Смотрим оставшееся место
if (DEBUG && 'storage' in navigator && 'estimate' in navigator.storage) {
	formatBytes = (bytes, decimals = 2) => {
		if (!+bytes) return '0 Bytes'

		const k = 1024,
			dm = decimals < 0 ? 0 : decimals,
			sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(bytes) / Math.log(k))

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
	}

	navigator.storage.estimate().then(estimate => console.log(`sw.js: Using ${formatBytes(estimate.usage)} out of ${formatBytes(estimate.quota)} bytes.`));
}

// Регистрируем воркера
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.addEventListener('controllerchange', () => navigator.serviceWorker.controller = navigator.serviceWorker.controller);
	navigator.serviceWorker.register('/sw.js')
		.then(event => {
			//if (!navigator.serviceWorker.controller) window.location.reload();
			if (DEBUG) console.log('sw.js: end: initServiceWorker', event);
		}, error => {
			if (DEBUG) console.log('sw.js: failture: initServiceWorker', error);
		});
}