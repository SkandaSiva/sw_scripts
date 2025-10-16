/**
Import the Workbox library from the Google CDN.
It is possible to serve this locally should we want to remove the dependency on Google
See here for more info: https://developers.google.com/web/tools/workbox/modules/workbox-sw
**/
importScripts('https://www.jeans-meile.de/workbox/workbox-v7.1.0/workbox-sw.js');

// SETTINGS // Set the local path if not using Google CDN
workbox.setConfig({
  modulePathPrefix: '/workbox/workbox-v7.1.0/',  
});

// SETTINGS // Setze die Logstufe auf "silent", um Debugging-Informationen zu unterdrücken
//workbox.setConfig({
//debug: true, // Use 'dev' builds
//});

// Verwende eine "NetworkOnly"-Strategie für alle Anfragen von der Subdomain tag.jeans-meile.de
const networkOnlyStrategy = new workbox.strategies.NetworkOnly({
    cacheName: 'network-only-cache',
    plugins: [
        {
            requestWillFetch: async ({ request }) => {
                // Modifiziere die Anfrage, um CORS-Probleme zu vermeiden
                const modifiedHeaders = new Headers(request.headers);
                modifiedHeaders.delete('Referrer-Policy'); // Entferne problematische Header
                return new Request(request.url, {
                    headers: modifiedHeaders,
                    mode: 'no-cors', // Setze den Modus auf 'no-cors'
                    credentials: 'same-origin', // Schließe Anmeldeinformationen aus // omit
                });
            },
        },
    ],
});
//workbox.routing.registerRoute(
//    new RegExp('https://tag\\.jeans-meile\\.de/.*'),
//    networkOnlyStrategy
//);
workbox.routing.registerRoute(
    new RegExp('https://www\\.facebook\\.com/tr/.*'),
    networkOnlyStrategy
);
workbox.routing.registerRoute(
    new RegExp('https://consent\\.cookiebot\\.com/logconsent\\.ashx.*'),
    networkOnlyStrategy
);
workbox.routing.registerRoute(
    new RegExp('https://googleads\\.g\\.doubleclick\\.net/pagead/viewthroughconversion/980203391/.*'),
    networkOnlyStrategy
);
workbox.routing.registerRoute(
    new RegExp('https://www\\.google\\.com/pagead/1p-user-list/.*'),
    networkOnlyStrategy
);
//ENDE Verwende eine "NetworkOnly"-Strategie für bestimmte Anfragen

// Skip the 'waiting' phase and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  clients.claim();
});

// Ensure `self.__WB_MANIFEST` is defined as an array
const manifest = self.__WB_MANIFEST || [];

// Cache settings
workbox.core.setCacheNameDetails({
  // Set the default cache name prefix. Each domain should be unique to stop clashes
  // This is used for runtime and precaching only
  prefix: 'jm'
});

// Precaching of local files
workbox.precaching.precacheAndRoute(manifest);
// Precaching der externen Ressourcen
//const externalResources = [
//  { url: 'https://tag.jeans-meile.de', revision: null },
//];
// workbox.precaching.precacheAndRoute(externalResources);


// Runtime caching for scripts from https://www.jeans-meile.de/* and https://cdn.jeans-meile.de/
workbox.routing.registerRoute(
  ({url, request}) => (url.origin === 'https://www.jeans-meile.de' || url.origin === 'https://cdn.jeans-meile.de') && request.destination === 'script',
  new workbox.strategies.CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Maximum number of entries in the cache
        maxAgeSeconds: 365 * 24 * 60 * 60, // Cache for a maximum of 1 year
      }),
    ],
  })
);

// Runtime caching for stylesheets from https://www.jeans-meile.de/* and https://cdn.jeans-meile.de/
workbox.routing.registerRoute(
  ({url, request}) => (url.origin === 'https://www.jeans-meile.de' || url.origin === 'https://cdn.jeans-meile.de') && request.destination === 'style',
  new workbox.strategies.CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Maximum number of entries in the cache
        maxAgeSeconds: 365 * 24 * 60 * 60, // Cache for a maximum of 1 year
      }),
    ],
  })
);

// Runtime caching for fonts from all origins
workbox.routing.registerRoute(
  ({request}) => request.destination === 'font',
  new workbox.strategies.CacheFirst({
    cacheName: 'jm-fonts',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 200, // Maximum number of entries in the cache
        maxAgeSeconds: 365 * 24 * 60 * 60, // Cache for a maximum of 1 year
      }),
    ],
  })
);

// Verwende eine "CacheFirst"-Strategie für Bilder von cdn.jeans-meile.de
workbox.routing.registerRoute(
    new RegExp('https://cdn\\.jeans-meile\\.de/media/product/.*\\.(?:png|jpg|jpeg|svg|gif)'),
    new workbox.strategies.CacheFirst({
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 250,
                maxAgeSeconds: 100 * 24 * 60 * 60, // 100 Tage
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

// Verwende eine "CacheFirst"-Strategie für Dokumente (HTML)
workbox.routing.registerRoute(
    ({request}) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({
        cacheName: 'html-cache',
    })
);