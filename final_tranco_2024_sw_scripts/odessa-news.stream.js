var CACHE_NAME = 'v7';
var urlsToCache = [
// '/manifest.json',
'/min.css',
'/min.js',
// additional assets
'/a/onedark.css',
'/a/disqus.js',
'/a/pogoda.css',
'/a/xregexp-all.js',
// fonts
'/_fonts/roboto/roboto.woff2',
'/_fonts/icons.woff2',
// favicon
'/favicon.ico',
'/favicon.png',
'/_img/favicon/favicon32.png',
'/_img/favicon/favicon48.png',
'/_img/favicon/favicon62.png',
'/_img/favicon/favicon72.png',
'/_img/favicon/favicon96.png',
'/_img/favicon/favicon144.png',
'/_img/favicon/favicon152.png',
'/_img/favicon/favicon167.png',
'/_img/favicon/favicon180.png',
'/_img/favicon/favicon192.png',
'/_img/favicon/favicon512.png',
// images
'/_img/textures/square.png',
'/_img/logo_city.svg',
'/_img/logo.svg',
'/_img/logo_oblast.svg',
'/_img/logos/khersonskie-novosti.svg',
'/_img/logos/nikolaevskie-novosti.svg',
'/_img/logos/odesskie-novosti.svg',
'/_img/logos/gp-news-app.png',
'/images/cats/novosti.jpg',
'/images/cats/novosti-450.jpg',
// images/default
'/images/default/economika.jpg',
'/images/default/economika-300.jpg',
'/images/default/ekologiya.jpg',
'/images/default/ekologiya-300.jpg',
'/images/default/kriminal.jpg',
'/images/default/kriminal-300.jpg',
'/images/default/kultura.jpg',
'/images/default/kultura-300.jpg',
'/images/default/obrazovanie.jpg',
'/images/default/obrazovanie-300.jpg',
'/images/default/obshchestvo.jpg',
'/images/default/obshchestvo-300.jpg',
'/images/default/politycs.jpg',
'/images/default/politics-300.jpg',
'/images/default/proisshestviya.jpg',
'/images/default/proisshestviya-300.jpg',
'/images/default/sport.png',
'/images/default/sport-300.jpg',
'/images/default/turizm.jpg',
'/images/default/turizm-300.jpg',
'/images/default/zdorove.jpg',
'/images/default/zdorove-300.jpg',
//
'/images/default/herson.jpg',
'/images/default/herson-300.jpg',
'/images/default/nikolaev.jpg',
'/images/default/nikolaev-300.jpg',
'/images/default/odessa.jpg',
'/images/default/odessa-300.jpg'
];
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			return cache.addAll(urlsToCache);
		})
		);
});

// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
const deleteCache = async (key) => {
  await caches.delete(key);
};

const deleteOldCaches = async () => {
  const cacheKeepList = [CACHE_NAME];
  const keyList = await caches.keys();
  const cachesToDelete = keyList.filter((key) => !cacheKeepList.includes(key));
  await Promise.all(cachesToDelete.map(deleteCache));
};

self.addEventListener("activate", (event) => {
  event.waitUntil(deleteOldCaches());
});





var siteurl = self.location.hostname;
// function addToCache(cacheName, request, response) {
// caches.open(cacheName)
// .then( cache => cache.put(request, response) );
// }
self.addEventListener('fetch', function(event) {
	if (event.request.url.indexOf(siteurl) !== -1) {
		event.respondWith(
			caches.match(event.request).then(function(response) {
				if (response) {
					return response;
				}
				return fetch(event.request).then(function(response) {
					// @todo: addToCache default cats images + make 2 caches: for assets and images
					// if (event.request.url.indexOf(siteurl+'/images/default/') !== -1) {
					// console.log(event.request.url);
					// addToCache('img', event.request, response.clone());
					// }
					return response;
				}).catch(function(error) {
					console.error('Fetching failed: ', error);
					throw error;
				});
			})
			);
	}
});
