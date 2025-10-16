// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object

/*
Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

// Choose a cache name
const cacheName = 'cache-v1'

const url = new URL(location)
const prefix = url.pathname.indexOf('mobile') ? '/mobile' : ''
// List the files to precache
const precacheResources = ['/', './index.html', `${prefix}/static/pwa-config/offline.html`]

// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', event => {
    console.log('Service worker install event!')
    // event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(precacheResources)))
})

self.addEventListener('activate', event => {
    console.log('Service worker activate event!')
})

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', event => {
    // console.log('Fetch intercepted for:', event.request.url)
    // event.respondWith(
    //     caches
    //         .match(event.request)
    //         .then(cachedResponse => {
    //             if (cachedResponse) {
    //                 return cachedResponse
    //             }
    //             return fetch(event.request)
    //         })
    //         .catch(() => {
    //             return caches.match('/pwa-config/offline.html')
    //         })
    // )
    // event.respondWith(
    //     fetch(event.request).catch(() => {
    //         return caches.match(`${prefix}/static/pwa-config/offline.html`)
    //     })
    // )
})

self.addEventListener('message', event => {
    if (event.data.eventType === 'initFirebase') {
        console.log('开启firebase')
        let firebaseConfig = event.data.payload
        if (!firebaseConfig) {
            console.log('没有firebase配置')
        } else {
            if (firebase.apps.length > 0) {
                console.log('Firebase已开启，关闭重新开启')
                firebase
                    .app()
                    .delete()
                    .then(() => {
                        firebase.initializeApp(firebaseConfig)
                    })
            } else {
                firebase.initializeApp(firebaseConfig)
            }
            // const messaging = firebase.messaging()
            // messaging.onBackgroundMessage(payload => {
            //     console.log('[firebase-messaging-sw.js] Received background message ', payload)
            //     // Customize notification here
            //     // const notificationTitle = payload.notification.title
            //     // const notificationOptions = {
            //     //     body: payload.notification.title.body,
            //     //     icon: '/firebase-logo.png' // TODO: Add icon
            //     // }
            //     // self.registration.showNotification(notificationTitle, notificationOptions)
            // })
        }
    } else if (event.data.eventType === 'closeFirebase') {
        console.log('关闭firebase')
        firebase.messaging().deleteToken()
    }
})
