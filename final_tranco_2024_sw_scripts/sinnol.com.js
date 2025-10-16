
        importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js')
        self.addEventListener('install', (e) => {
          self.skipWaiting()
          e.waitUntil(caches.open('a2hs'))
        })
        