/*
 Copyright 2015, 2019, 2020 Google LLC. All Rights Reserved.
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

// Inport firebase libraries
//importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js');
//importScripts('https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js');

// Incrementing OFFLINE_VERSION will kick off the install event and force
// previously cached resources to be updated from the network.
const OFFLINE_VERSION = 1;
const CACHE_NAME = "offline";
const OFFLINE_URL = atob((new URL(location)).searchParams.get('offlinepage'));

self.addEventListener("install", (event) => {
    event.waitUntil(
            (async () => {
                const cache = await caches.open(CACHE_NAME);
                // Setting {cache: 'reload'} in the new request will ensure that the
                // response isn't fulfilled from the HTTP cache; i.e., it will be from
                // the network.
                await cache.add(new Request(OFFLINE_URL, {cache: "reload"}));
            })()
            );
    // Force the waiting service worker to become the active service worker.
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
            (async () => {
                // Enable navigation preload if it's supported.
                // See https://developers.google.com/web/updates/2017/02/navigation-preload
                if ("navigationPreload" in self.registration) {
                    await self.registration.navigationPreload.enable();
                }
            })()
            );

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // We only want to call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === "navigate") {
        event.respondWith(
                (async () => {
                    try {
                        // First, try to use the navigation preload response if it's supported.
                        const preloadResponse = await event.preloadResponse;
                        if (preloadResponse) {
                            return preloadResponse;
                        }

                        // Always try the network first.
                        const networkResponse = await fetch(event.request);
                        return networkResponse;
                    } catch (error) {
                        // catch is only triggered if an exception is thrown, which is likely
                        // due to a network error.
                        // If fetch() returns a valid HTTP response with a response code in
                        // the 4xx or 5xx range, the catch() will NOT be called.
                        console.log("Fetch failed; returning offline page instead.", error);

                        const cache = await caches.open(CACHE_NAME);
                        const cachedResponse = await cache.match(OFFLINE_URL);
                        return cachedResponse;
                    }
                })()
                );
    }
});


self.addEventListener('notificationclick', function (event) {
    console.log(event);
    event.notification.close();
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == event.notification.data.actionUrl && 'focus' in client){
                return client.focus();
            }
        }
        if (clients.openWindow){
            return clients.openWindow(event.notification.data.actionUrl);
        }
            
    }));

});

self.addEventListener('pushsubscriptionchange', function (event) {
    console.log(event);
    event.waitUntil(self.registration.pushManager.subscribe(event.oldSubscription.options).then(function (subscription) {
        // TODO: Send new subscription to application server
        console.log(subscription);
    }));
});

self.addEventListener('push', function (event) {

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    var notification = {};
    if (event.data) {
        var data = event.data.json();
        if (!data.data){
            return;
        }
        notification = data.data;
    }
    
    console.log(notification);
    
    var title = notification.title;
    var body = notification.body;
    var badge = notification.badge;
    var icon = notification.icon;
    var image = notification.image;
    var tag = notification.tag;
    var silent = notification.silent;
    var renotify = notification.renotify;
    var vibrate = notification.vibrate;
    

    const notificationOptions = {
        body: body,
        badge: badge,
        icon: icon,
        silent: silent == 0 ? false : true,
        renotify: renotify == 0 ? false : true,
        data: notification,
    };
    
    if (image){
        notificationOptions.image = image;
    }
    
    if (tag){
        notificationOptions.tag = tag;
    }
    
    if (vibrate){
        notificationOptions.vibrate = JSON.parse(vibrate);
    }

    self.registration.showNotification(title, notificationOptions);
    
    // if (repeat && tag){

    //     self.registration.getNotifications({tag: tag}).then(notifications => {
    //         for (var num = 0; num < notifications.length; num++) {
    //             if (notifications[num].tag == tag){
    //                 notifications[num].close();
    //             }
    //         }
    //         self.registration.showNotification(title, notificationOptions);
    //     });
    // }else{
    //     self.registration.showNotification(title, notificationOptions);
    // }
    

});
