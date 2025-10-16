try {
    if ('function' === typeof importScripts) {
        importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.1.0/workbox-sw.js')

        // Global workbox
        if (workbox) {
            // try {
            //     if (true) {
            //         workbox.setConfig({ debug: true })
            //     } else {
            //         workbox.setConfig({ debug: false })
            //     }
            // } catch (error) {
            //     console.error('true environment variable not found')
            //     workbox.setConfig({ debug: false })
            // }

            // manually overriding the skipWaiting();
            // skipWaiting will activate the new service worker immediately
            self.addEventListener('install', (event) => {
                self.skipWaiting()
            })

            // Delete the existing cache if any
            self.addEventListener('activate', function (event) {
                event.waitUntil(
                    caches.keys().then(function (cacheNames) {
                        return Promise.all(
                            cacheNames.map(function (cacheName) {
                                return caches.delete(cacheName)
                            }),
                        )
                    }),
                )
            })
            self.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SET_LOG_ENABLED') {
                    const logEnabled = event.data.logEnabled
                    if (logEnabled) {
                        workbox.setConfig({ debug: true })
                        console.log('Service Worker logging enabled.')
                    } else {
                        workbox.setConfig({ debug: false })
                        console.log('Service Worker logging disabled.')
                    }
                }
            })

            // Ensure that nothing is precached
            // try {
            //     workbox.precaching.precacheAndRoute([])
            // } catch (e) {
            //     console.error(e)
            // }

            // // Don't use any resource from cache.
            // // Always make a network call to load the resource
            // workbox.routing.registerRoute(new RegExp('.*'), workbox.strategies.networkOnly())
        } else {
            console.error('Workbox could not be loaded. No offline support')
        }
    }
} catch (e) {
    console.error('Unable to install service worker. Possible network error.', e)
}
