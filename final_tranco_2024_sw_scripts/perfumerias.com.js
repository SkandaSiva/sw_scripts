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

self.addEventListener('push', function(event) {
  //console.log('[Service Worker] Push Received.');
  //console.log('[Service Worker] Push had this data: "'+event.data.text()+'"');
  //console.log('[Service Worker] ', event.data);

  let texto = event.data.text();
  let content = JSON.parse(event.data.text());

  const title = content.title;
  const options = {
    body: content.body,
    icon: content.thumbnail,
    image: content.image,
    badge: 'https://perfumerias.com/static/template/perfumerias.com/img/noti.png',
    data: {url: content.url, webpush_id: content.webpush_id, customers_id: content.customers_id}
  };

  fetch("https://perfumerias.com/api/v1/webpush_actualizar.php?accion=recibido", {
    method: 'post',  
    headers: {  
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
    },  
    body: 'webpush_id='+content.webpush_id  
  })
  .then(function (data) {  
   //console.log('Request succeeded with JSON response', data);
  })  
  .catch(function (error) {  
    //console.log('Request failed', error);
  });

  //event.waitUntil(self.registration.showNotification(title, options));
  const notificationPromise = self.registration.showNotification(title, options);
  event.waitUntil(notificationPromise);
});

self.addEventListener('notificationclick', function(event) {
  //console.log('[Service Worker] Notification click Received.');
  //console.log('RECIBIDO: ', event);
  //console.log('URL: ', event.notification.data.url);
  //console.log('customers_id: ', event.notification.data.customers_id);
  //console.log('webpush_id: ', event.notification.data.webpush_id);

  fetch("https://perfumerias.com/api/v1/webpush_actualizar.php?accion=leido", {
    method: 'post',  
    headers: {  
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
    },  
    body: 'webpush_id='+event.notification.data.webpush_id  
  })
  .then(function (data) {  
   //console.log('Request succeeded with JSON response', data);
  })  
  .catch(function (error) {  
    //console.log('Request failed', error);
  });

  event.notification.close();

  //let content = JSON.parse(event.data.text());

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});