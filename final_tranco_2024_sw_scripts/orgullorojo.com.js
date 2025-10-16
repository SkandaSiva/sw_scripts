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



const version = "0.6.15";

const cacheName = 'cdh-${version}';

self.addEventListener('install', e => {

  const timeStamp = Date.now();

  e.waitUntil(

    caches.open(cacheName).then(cache => {

      return cache.addAll([

        'css/bootstrap.min.css'

      ])

      .then(() => self.skipWaiting());

    })

  );

});



self.addEventListener('activate', event => {

  event.waitUntil(self.clients.claim());

});



self.addEventListener('fetch', event => {

  event.respondWith(

    caches.open(cacheName)

      .then(cache => cache.match(event.request, {ignoreSearch: true}))

      .then(response => {

      return response || fetch(event.request);

    })

  );

});





if ('serviceWorker' in navigator && 'PushManager' in window) {

  //console.log('Service Worker and Push is supported');



  navigator.serviceWorker.register('service-worker.js')

  .then(function(swReg) {

    //console.log('Service Worker is registered', swReg);



    swRegistration = swReg;

  })

  .catch(function(error) {

    //console.error('Service Worker Error', error);

  });

} else {

  //console.warn('Push messaging is not supported');

  //pushButton.textContent = 'Push Not Supported';

}



self.addEventListener('push', function(event) {

  //console.log('[Service Worker] Push Received.');

  //console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);



  var mensaje=event.data.text();



  var json=JSON.parse(mensaje);



  const title = json.titulo;

  const options = {

    body: json.copete,

    icon: 'img/logo.png',

    badge: 'img/logo.png',

    image: 'contenido/noticias/original/'+json.nombre_foto,

    data: {

     url: 'nota-amplia.php?id='+json.id

    }

  };



  event.waitUntil(self.registration.showNotification(title, options));

});



self.addEventListener('notificationclick', function(event) {

  //console.log('[Service Worker] Notification click Received.');



  event.notification.close();



  event.waitUntil(

    clients.openWindow(event.notification.data.url)

  );

});