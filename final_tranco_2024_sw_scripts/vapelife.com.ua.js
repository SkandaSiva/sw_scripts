const CACHE_NAME  = 'Vapelife-5';
let resourcesToCache = ['/catalog/view/javascript/live_search/live_search1.js', '/catalog/view/javascript/popupcart.js','/image/catalog/logo/', '/catalog/view/theme/fiji/css/style2.css?v=72', '/catalog/view/theme/fiji/fonts/fontawesome-webfont.woff2?v=4.7.0'];

self.addEventListener("install", e=>{
	e.waitUntil(
		caches.open(CACHE_NAME).then(cache =>{
			return cache.addAll(resourcesToCache);
		})
	);
});

// Cache and return requests
const cacheOptions = {
	ignoreMethod: true,
	ignoreSearch: true,
	ignoreVary: true,
	method: ["GET", "POST"],
	headers: {
		'Content-Type': 'text/plain; charset=utf-8'
	}
};

self.addEventListener('fetch', event => {
	const url = new URL(event.request.url);
	/*const decodedUrl = decodeURIComponent(url.pathname + url.search);*/
	const decodedUrl = decodeURIComponent(url.search);
	const newUrl = new URL(decodedUrl , self.origin);
	return response || fetch(newUrl.href);
	event.respondWith(
		caches.match(newUrl.href, cacheOptions).then(response=>{
		})
	);
});
// Update a service worker
const cacheWhitelist = ['Vapelife-5'];
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.map(cacheName => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

// Decode URL encoded UTF-8 string
function decodeURIComponent(str) {
	try {
		return decodeURIComponent(str);
	} catch (e) {
		return str;
	}
}
