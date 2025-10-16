var CACHE_NAME = 'dt-cache-v1';
var urlsToCache = [
  '/',
  '/favicon.ico',
  '/css/mobile.app.css',
  '/css/lightslider.app.css',
  '/js/lightslider.app.js',
  '/js/mobile_assets.app.js',
  '/js/bootstrap.app.js',
  '/js/mobile.app.js',
  '/img/new/clipboard-icon.svg',
  '/img/new/clipboard-icon-dark.svg',
  '/images/dreamtours.svg',
  '/fonts/common/roboto-regular-webfont.woff2',
  '/fonts/common/roboto-medium-webfont.woff2',
  '/fonts/common/roboto-bold-webfont.woff2',
  '/fonts/mobile/dreamtours-icons.woff2',
  'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'
];
responseContent = "<html><head></head><body>" +
  "<h1>Dreamtours</h1>" +
  "<p>Wygląda, że masz problem z połączeniem. Sprawdź swoje podłączenie do internetu " +
  " albo zadzwoń do nas tel. +48 58 741 59 20</p>" +
  "</body></html>";


self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(function (err) {
        console.log(err);
      })
  );
});
// self.addEventListener("activate", event => {
// console.log('[ServiceWorker] Activate');
// event.waitUntil(
// 	caches.keys().then(function (keyList) {
// 		return Promise.all(keyList.map(function (key) {
// 			if (key !== CACHE_NAME) {
// 				console.log('[ServiceWorker] Removing old cache', key);
// 				return caches.delete(key);
// 			}
// 		}));
// 	})
// );
// return self.clients.claim();
// });
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        } else if (event.request.headers.get('accept').includes('text/html')) {
          return new Response(responseContent, { headers: { "Content-Type": "text/html; charset=utf-8" } });
        }
      })
    })
  );
});
