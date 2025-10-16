importScripts(`/_assets/4de72178a3b85217d04af3f59484249d/JavaScripts/vendor/workbox-sw.js`);

if (workbox) {

    self.addEventListener('push', function(event) {
        const data = event.data;
        const message = data.json();
        const promiseChain = self.registration.showNotification(
            message.title,
            {
                body: message.body,
                icon: message.icon,
                tag: message.tag,
                data: message.link,
                requireInteraction: true
            }
        );
        event.waitUntil(promiseChain);
    });

    self.addEventListener('notificationclick', function(event) {
        const link = event.notification.data;
        clients.openWindow(link);
    }, false);

    workbox.core.setCacheNameDetails({
        prefix: 'waldwissen',
        suffix: 'v2',
        precache: 'precache',
        runtime: 'runtime'
    });

    workbox.precaching.precacheAndRoute([
        `/_assets/4de72178a3b85217d04af3f59484249d/Images/waldwissen_logo.png`,
        `/_assets/4de72178a3b85217d04af3f59484249d/Images/Favicons/favicon.ico`
    ]);

    workbox.routing.registerRoute(
        /(\/de|\/en|\/fr|\/it)/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'articles'
        })
    );

    workbox.routing.registerRoute(
        /\/typo3temp\/assets\/compressed\/.*/,
        new workbox.strategies.CacheFirst({
            cacheName: 'assets'
        })
    );

    workbox.routing.registerRoute(
        /\/assets\/4de72178a3b85217d04af3f59484249d\/Fonts.*\.(woff|woff2|ttf|svg)$/,
        new workbox.strategies.CacheFirst({
            cacheName: 'fonts'
        })
    );

} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
