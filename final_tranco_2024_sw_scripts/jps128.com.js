const OFFLINE_URL = '/offline.html';
const HEALTH_CHECK_URL = '/?healthcheck=true';
const FETCH_TIMEOUT = 5000;

self.addEventListener('install', function (event) {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open('offline-cache').then(function (cache) {
            console.log('Service Worker: Caching offline page...');
            return cache.addAll([OFFLINE_URL]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Service Worker: Activated');
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', function (event) {
    const url = new URL(event.request.url);
    const isHTMLRequest = url.pathname.endsWith('.html') || event.request.destination === 'document';
    const isHealthCheck = url.search.includes('healthcheck=true');
    let isOfflineHtml = url.pathname.endsWith('offline.html');

    if (!isHTMLRequest || isHealthCheck || isOfflineHtml) {
        //console.log(`Ignoring request: ${event.request.url}`);
        return;
    }
    console.log(`Check request: ${event.request.url}`);

    event.respondWith(
        fetch(event.request)
            .then(response => response)
            .catch(() => {
                console.log(`Request for ${event.request.url} failed. Performing health check on root domain.`);

                return timeoutPromise(FETCH_TIMEOUT, fetch(HEALTH_CHECK_URL, { redirect: 'manual' }))
                    .then(healthCheckResponse => {
                        if (healthCheckResponse.status === 302) {
                            console.log('302 redirect detected. Domain is healthy.');
                            return caches.match(OFFLINE_URL);
                        } else {
                            console.log('No 302 redirect detected. Serving offline page.');
                            return caches.match(OFFLINE_URL);
                        }
                    })
                    .catch(error => {
                        console.log(`Health check failed or timed out: ${error}. Serving offline page.`);
                        return caches.match(OFFLINE_URL);
                    });
            })
    );
});

function timeoutPromise(ms, promise) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new Error("Request timed out"));
        }, ms);

        promise
            .then((res) => {
                clearTimeout(timeoutId);
                resolve(res);
            })
            .catch((err) => {
                clearTimeout(timeoutId);
                reject(err);
            });
    });
}
