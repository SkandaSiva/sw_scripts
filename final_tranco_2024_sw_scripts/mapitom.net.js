self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});


self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch((error) => {
            console.error('Fetch failed; reloading the page.', error);

            // Abrufen der Clients, um die Seite neu zu laden
            self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
                if (clients && clients.length > 0) {
                    clients[0].navigate(clients[0].url);
                }
            });

            // Eine leere Antwort zurückgeben, um den Fehler zu signalisieren
            return new Response('', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        })
    );
});