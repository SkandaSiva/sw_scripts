// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (installEvent) => {
    installEvent.waitUntil(() => {
        // eslint-disable-next-line no-console
        console.log('installed');
    });
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // eslint-disable-next-line @v3group/no-fetch
        fetch(event.request)
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('[pwa] ', error);

                throw new Response('Fetch failed! Check your network connection.');
            }),
    );
});
