const domainFilter = /\/web\/ePortal\/ctrl/;
let csrfToken = null;

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data.type === 'SET_CSRF_TOKEN') {
        if (event.data.token == null) {
            return;
        } else {
            csrfToken = event.data.token;
        }
    }
});

self.addEventListener('fetch', (event) => {
    if (!csrfToken || !event.request.url.match(domainFilter)) return;

    const headers = new Headers(event.request.headers);
    headers.set('X-CSRF-TOKEN', csrfToken);

    const modifiedRequest = new Request(event.request, { headers });
    
    event.respondWith(
        fetch(modifiedRequest).then(response => {
            if (response.status >= 400 && response.status < 500) {
                self.clients.matchAll().then(clients => {
                    clients.forEach(client => client.postMessage({ type: 'RELOAD_PAGE' }));
                });
            }
            return response;
        }).catch(error => {
            console.error('Fetch failed:', error);

            return fetch(event.request);
        })
    );
});