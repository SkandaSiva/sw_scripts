importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');
 
if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
 
workbox.clientsClaim();
workbox.skipWaiting();
 
workbox.routing.registerRoute(
    // Cache asset files
    /\.(?:css|js|woff|woff2|ttf)$/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
        // Use a custom cache name
        cacheName: 'asset-cache',
    })
);
 
workbox.routing.registerRoute(
    // Cache image files
    /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available
    workbox.strategies.cacheFirst({
        // Use a custom cache name
        cacheName: 'image-cache',
        plugins: [
            new workbox.expiration.Plugin({
                // Cache only 20 images
                maxEntries: 20,
                // Cache for a maximum of a week
                maxAgeSeconds: 7 * 24 * 60 * 60,
            })
        ],
    })
);
 
/*workbox.routing.registerRoute(
    'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js',
    workbox.strategies.staleWhileRevalidate()
);*/
 
// Pages we want to work offline
workbox.precaching.precache([
    { url: '/offline', revision: '20190320' },
]);
 
workbox.routing.registerRoute(
    ({url, event}) => {
        const pages = [
            '/offline',
        ];
 
        for (let i in pages) {
            if (new RegExp(pages[i]).test(url)) {
                return true;
            }
        }
 
        return false;
    },
    async ({url, event}) => {
        try {
            return await fetch(event.request);
        } catch (error) {
            return caches.match(url.pathname);
        }
    }
);
 
const offlinePage = '/offline';
 
// Pages we want to display an offline page when
// offline i.e. not be available offline
workbox.routing.registerRoute(
    ({url, event}) => {
        const pages = [
            '/',
        ];
 
        for (let i in pages) {
            if (new RegExp(pages[i]).test(url)) {
                return true;
            }
        }
 
        return false;
    },
    async ({event}) => {
        try {
            return await fetch(event.request);
        } catch (error) {
            return caches.match(offlinePage);
        }
    }
);