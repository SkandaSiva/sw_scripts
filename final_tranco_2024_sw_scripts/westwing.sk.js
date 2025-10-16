/* eslint-disable-next-line no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

const ONE_MINUTE = 60;
const TEN_MINUTES = 10 * ONE_MINUTE;
const ONE_HOUR = 6 * TEN_MINUTES;
const ONE_DAY = 24 * ONE_HOUR;
const SEVEN_DAYS = 7 * ONE_DAY;
const FALLBACK_HTML_URL = '/offline-fallback.html';
const CHECK_IF_VERSION_CHANGED_MESSAGE_TYPE = 'VERSION_CHANGE';
const RELOAD_PAGE_MESSAGE_TYPE = 'RELOAD_PAGE';

const staticHostRegex = /^.*\/bella.+/;
const imagesRegex = /(?:png|gif|jpg|jpeg|svg|webp)$/;
const assetsRegex = /(?:js|css)$/;

const cacheNames = {
    assets: 'bella-assets',
    icons: 'bella-icons',
    images: 'bella-images',
    pages: 'bella-pages',
};

const reloadAppIfRequiredImpl = async config => {
    try {
        const body = {
            version: config.buildVersion,
            translationsVersion: config.translationsVersion,
        };
        const response = await fetch(`${config.bellaApiBaseUrl}/bella-api/version-check`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const responseData = await response.json();
        return responseData.shouldClientReload;
    } catch (error) {
        // Silence is gold
        return false;
    }
};

const bootstrapReload = cleanupHandler => {
    /* eslint-disable-next-line no-restricted-globals */
    addEventListener('message', async event => {
        if (event.data.type === CHECK_IF_VERSION_CHANGED_MESSAGE_TYPE) {
            const res = await reloadAppIfRequiredImpl(event.data.payload);
            if (res) {
                // https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-expiration/src/ExpirationPlugin.ts#L275
                cleanupHandler()
                    .then(() => {
                        event.ports[0].postMessage(RELOAD_PAGE_MESSAGE_TYPE);
                    })
                    .catch(() => {
                        /* eslint-disable-next-line no-console */
                        console.error('Error deleting caches');
                        event.ports[0].postMessage(RELOAD_PAGE_MESSAGE_TYPE);
                    });
            }
        }
    });
};

/* eslint-disable no-undef,no-var,no-restricted-globals,no-console */
if (workbox) {
    // Prefer immediate activation/control for the (new) worker
    // This is safe since we have a version check that reloads if a new version exists
    workbox.core.skipWaiting();
    workbox.core.clientsClaim();

    // https://developers.google.com/web/updates/2017/02/navigation-preload
    workbox.navigationPreload.enable();

    workbox.precaching.cleanupOutdatedCaches();
    workbox.precaching.precacheAndRoute([{ url: FALLBACK_HTML_URL, revision: null }]);

    const assetsExpirationPlugin = new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: SEVEN_DAYS,
        purgeOnQuotaError: true,
    });
    const imagesExpirationPlugin = new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: SEVEN_DAYS,
    });
    const apiExpirationPlugin = new workbox.expiration.ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: ONE_MINUTE,
    });

    workbox.routing.registerRoute(
        new RegExp(staticHostRegex.source + assetsRegex.source),
        new workbox.strategies.CacheFirst({
            cacheName: cacheNames.assets,
            plugins: [assetsExpirationPlugin],
        })
    );

    workbox.routing.registerRoute(
        new RegExp(staticHostRegex.source + imagesRegex.source),
        new workbox.strategies.CacheFirst({
            cacheName: cacheNames.icons,
            plugins: [imagesExpirationPlugin],
        })
    );

    // Cache strategy for server-rendered pages
    // Network first as we don't want to serve potentially stale pages
    // Might be safe since we have a version check that reloads if a new version exists
    const pagesStrategy = new workbox.strategies.NetworkFirst({
        cacheName: cacheNames.pages,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 10,
                maxAgeSeconds: SEVEN_DAYS,
            }),
        ],
    });

    const pagesHandler = args =>
        pagesStrategy
            .handle(args)
            .then(response => response || caches.match(workbox.precaching.getCacheKeyForURL(FALLBACK_HTML_URL)))
            .catch(() => caches.match(workbox.precaching.getCacheKeyForURL(FALLBACK_HTML_URL)));

    const navigationRoute = new workbox.routing.NavigationRoute(pagesHandler, {});

    workbox.routing.registerRoute(navigationRoute);

    // This "catch" handler is triggered when any of the other routes fail to generate a response.
    // we only want to provide a fallback HTML documents
    // https://developers.google.com/web/tools/workbox/guides/advanced-recipes
    workbox.routing.setCatchHandler(({ event }) => {
        if (event && event.request && event.request.destination === 'document') {
            return caches.match(workbox.precaching.getCacheKeyForURL(FALLBACK_HTML_URL));
        }

        // If we don't have a fallback, just return an error response.
        return Response.error();
    });

    bootstrapReload(() =>
        Promise.all([
            assetsExpirationPlugin.deleteCacheAndMetadata(),
            imagesExpirationPlugin.deleteCacheAndMetadata(),
            apiExpirationPlugin.deleteCacheAndMetadata(),
        ])
    );
} else {
    console.log('ServiceWorker ERROR: Unable to Load Workbox');
    bootstrapReload(() => Promise.resolve());
}
/* eslint-enable no-undef,no-var,no-console */
