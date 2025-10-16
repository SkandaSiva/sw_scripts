const CACHE_NAME = 'cocoon_20190523_20241110192912';
const urlsToCache = [
  'https://parugyon.com/',
  'https://parugyon.com/wp-content/uploads/2021/04/cropped-パルギョン-192x192.png',
  'https://parugyon.com/wp-content/uploads/2021/04/cropped-パルギョン.png',
  'https://parugyon.com/wp-content/themes/cocoon-master/javascript.js',
  'https://parugyon.com/wp-content/themes/cocoon-master/webfonts/fontawesome/css/font-awesome.min.css',
  'https://parugyon.com/wp-content/themes/cocoon-master/webfonts/icomoon/style.css'
];

self.addEventListener('install', function(event) {
  // インストール処理
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('PWA cache opened');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate
self.addEventListener('activate', function(e) {
	console.log('PWA service worker activation');
	e.waitUntil(
		caches.keys().then(function(keyList) {
			return Promise.all(keyList.map(function(key) {
				if ( key !== CACHE_NAME ) {
					console.log('PWA old cache removed', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

// Fetch
self.addEventListener('fetch', function(e) {

  // 管理画面はキャッシュを使用しない
  if (/\/wp-admin|\/wp-login|preview=true/.test(e.request.url)) {
    return;
  }

  // POSTの場合はキャッシュを使用しない
  if ('POST' === e.request.method) {
    return;
  }

	// URLプロトコルがhttpもしくはHTTPSでないときはキャッシュを使用しない
	if ( ! e.request.url.match(/^(http|https):\/\//i) )
		return;

  // リクエストURLが外部ドメインだったときはキャッシュを使用しない
	if ( new URL(e.request.url).origin !== location.origin )
		return;

    // POSTリクエストのとき、Cacheを使用しないときオフラインキャッシュを返す（上にPOST用の処理があるので不要かも）
	if ( e.request.method !== 'GET' ) {
		e.respondWith(
			fetch(e.request).catch( function() {
				return caches.match('https://parugyon.com/');
			})
		);
		return;
	}

	// Revving strategy
	if ( e.request.mode === 'navigate' && navigator.onLine ) {
		e.respondWith(
			fetch(e.request).then(function(response) {
				return caches.open(CACHE_NAME).then(function(cache) {
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
				return caches.open(CACHE_NAME).then(function(cache) {
					cache.put(e.request, response.clone());
					return response;
				});
			});
		}).catch(function() {
			return caches.match('https://parugyon.com/');
		})
	);
});
