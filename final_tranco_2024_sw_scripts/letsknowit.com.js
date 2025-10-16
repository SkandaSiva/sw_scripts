/*
 *
 *  Air Horner
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

const version = "1.0.7";
const cacheName = `letsknowit-${version}`;
self.addEventListener('install', e => {
  const timeStamp = Date.now();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        'common/css/bootstrap.min.css',
        'common/css/owl.carousel.css',
        'common/dist/jquery.fancybox.min.css?v=1.0',
        'common/css/owl.theme.default.min.css',
        'common/js/bootstrap.min.js',
        'common/js/jquery-ui.min.js',
        'common/js/owl.carousel.min.js',
        'common/lib/jquery.min.js',
        'common/dist/jquery.fancybox.min.js?v=2.1.5',
      ])
          .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
  return;
  }
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
      return response || fetch(event.request);
    })
  );
});

/*self.addEventListener('push', function(event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = 'Letsknowit Notify';
  const options = {
    body: 'Yay it works.',
    icon: 'common/images/icon_48.png',
    badge: 'common/images/icon_48.png'
  };

  //event.waitUntil(self.registration.showNotification(title, options));
  const sendNotification = body => {
        // you could refresh a notification badge here with postMessage API
        const title = "Web Push example";

        return self.registration.showNotification(title, {
            body,
        });
    };

    if (event.data) {
        const message = event.data.text();
        event.waitUntil(sendNotification(message));
    }
}); */

