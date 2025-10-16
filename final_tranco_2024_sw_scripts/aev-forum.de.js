/*
 *
 *  Push Notifications codelab
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */

// Version 0.1

'use strict';

importScripts('/custom/node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.0.3.js');

const workboxSW = new WorkboxSW();
const networkFirst = workboxSW.strategies.networkFirst();
workboxSW.router.registerRoute('/', networkFirst);

console.log('Started', self);

self.addEventListener('install', function(event) {
    self.skipWaiting();
    console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
    console.log('Activated', event);
});

self.addEventListener('push', function(event) {
    console.log('Push message', event);

    var data = {};
    if (event.data) {
        data = event.data.json();
    }
    console.log('push data', data);

    var title = data.title || "AEV Forum";
    var message = data.message || "Es gibt Neuigkeiten";
    var icon = data.icon || "/apple-touch-icon.png";
    var uri = data.uri || "/?utm_source=webpush";
    var tagId = data.tagId || "new-thread";

    event.waitUntil(
        self.registration.showNotification(title, {
            'body': message,
            'icon': icon,
            'tag' : tagId,
            'data': {uri: uri},
            'actions' : [{action: "overview", title: "Was ist neu?"}, {action: "show", title: "Beitrag anzeigen"}]
        }))
});

self.addEventListener('notificationclick', function(event) {
    //console.log('Notification click: tag', event.notification.tag);
    console.log('Notification data: tag', event.notification);
    // Android doesn't close the notification when you click it
    // See http://crbug.com/463146
    event.notification.close();
    var url = 'https://www.aev-forum.de/'+event.notification.data.uri;
    if (event.action === 'overview') {
        url = 'https://www.aev-forum.de/search.php?do=getnew&contenttype=vBForum_Post';
    }
    // Check if there's already a tab open with this URL.
    // If yes: focus on the tab.
    // If no: open a tab with the URL.
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then(function(windowClients) {
                console.log('WindowClients', windowClients);
                for (var i = 0; i < windowClients.length; i++) {
                    var client = windowClients[i];
                    console.log('WindowClient', client);
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});