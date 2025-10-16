const CACHE_NAME = 'page-cache-v5';
const ASSETS = [
	//'/',
	//'/nhacai',
	//'/wp-content/uploads/2024/10/',
	'/wp-content/themes/altitude-pro/style.css',
	'/wp-content/themes/altitude-pro/js/global.js',
];

// Sự kiện cài đặt Service Worker
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				return cache.addAll(ASSETS);
			})
	);
	self.skipWaiting();
});

// Kích hoạt và xóa bỏ cache cũ
self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheName !== CACHE_NAME) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	return self.clients.claim();
});

// Xử lý fetch request
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) {
				fetchAndUpdateCache(event.request);
				return response;
			}

			return fetchAndUpdateCache(event.request);
		})
	);
});

function fetchAndUpdateCache(request) {
    return fetch(request)
        .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            const responseToCache = response.clone();

            try {
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseToCache);
                });
            } catch (cacheError) {
                console.error('Failed to update cache:', cacheError);
            }

            return response;
        })
        .catch((fetchError) => {
            console.error('Fetch failed:', fetchError);
            throw fetchError; // Rethrow if you want the caller to handle the error
        });
}

