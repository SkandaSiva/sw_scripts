const CACHE_NAME = 'gs_cache_v19';

const EXCLUDED_DOMAINS = [
    'sw.js',
    'test',
    'admin.php'
];

self.addEventListener('install', event => self.skipWaiting());

self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    const isOwnDomain = requestUrl.origin === self.location.origin;

    // Если не наш домен или URL входит в список исключений, пропускаем кэширование
    if (!isOwnDomain || EXCLUDED_DOMAINS.some(excluded => requestUrl.pathname.includes(excluded))) {
        event.respondWith(fetch(event.request));
        return;
    }

    // Если HTML-страница, обрабатываем с кэшированием для страниц с `index, follow`
    const isHTMLPage = requestUrl.pathname.endsWith('/') || requestUrl.pathname.endsWith('.html');
    if (isHTMLPage) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request).then(networkResponse => {
                    return networkResponse.clone().text().then(bodyText => {
                        const hasMetaRobots = bodyText.includes('index, follow');
                        if (hasMetaRobots) {
                            return caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, networkResponse.clone());
                                return networkResponse;
                            });
                        }
                        return networkResponse; // Пропускаем кэширование, если `index, follow` нет
                    });
                }).catch(() => caches.match(event.request));
            })
        );
    } else {
        // Для остальных ресурсов кэшируем, если они не в исключениях
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                .map(cacheName => caches.delete(cacheName))
            );
        })
    );
    self.clients.claim();
});
