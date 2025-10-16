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

/* eslint-env browser, serviceworker, es6 */

'use strict';
let notificationUrl = '';
// console.log('aa');
self.addEventListener('push', function(event) {
  console.log(event);
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  let _data = event.data ? JSON.parse(event.data.text()) : {};
  notificationUrl = _data.url;
  console.log(notificationUrl);
  console.log(_data);
  const title = _data.title;
  const options = {
    body: _data.message,
    icon: _data.icon,
    // badge: 'favicon.ico',
    requireInteraction: true,
    data: notificationUrl,
    vibrate:[300,100,400]
  };


  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
	// console.log(notificationUrl);
  event.notification.close(); 
  console.log('[Service Worker] Notification click Received.');
  console.log('On notification click: ', event.notification);
  var redirectUrl = null;
  if(event.notification.data) { //seems that background notification shown by system sends data this way
    redirectUrl = event.notification.data ? event.notification.data : null;
  } else {  //show manually using showNotification
    redirectUrl = 'https://www.tonesbeat.com';
  }
  console.log(redirectUrl);
  
  event.waitUntil(
    clients.openWindow(redirectUrl)
  );

});

self.addEventListener('fetch', function(event) {
  
});

