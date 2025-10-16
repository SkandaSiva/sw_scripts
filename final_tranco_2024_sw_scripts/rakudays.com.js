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
let host = self.location.host;
let site = 'movie_rakudays';

function getQueryVariable(variable,url){
    var query = url.split("?")[1];
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}
  
// console.log('aa');
self.addEventListener('push', function(event) {
  console.log(event);
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  let _data = event.data ? JSON.parse(event.data.text()) : {};
  let _badge = _data.badge ? ('https://myappcdn.com/push_pic/' + _data.badge) : '';
  let _image = _data.image ? ('https://myappcdn.com/push_pic/' + _data.image) : '';
  notificationUrl = _data.url;
  console.log(notificationUrl);
  console.log(_data);
  const title = _data.title;
  const options = {
    body: _data.message,
    icon: _data.icon,
    badge: _badge,
    image: _image,
    // badge: 'favicon.ico',
    requireInteraction: true,
    data: notificationUrl,
    vibrate:[300,100,400]
  };

    event.waitUntil(self.registration.showNotification(title, options).then(function() {
        var utm_source = getQueryVariable("utm_source",notificationUrl);
        let e = {site : site,u_s : utm_source};
        fetch("https://www.silvergloria.com/showimpression", {
            mode: "no-cors",
            body: JSON.stringify(e),
            method: "POST",
            headers: {
                    'content-type': 'application/json'
                }
        }).then(function(e) {
            return;
        })
    
    }));
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
    redirectUrl = 'https://movie.rakudays.com/';
  }
  console.log(redirectUrl);
  
  event.waitUntil(
    clients.openWindow(redirectUrl)
  );
  
    self.registration.pushManager.getSubscription()
      .then(function(subscription) {
         var end_point = subscription.endpoint;
         var utm_source = getQueryVariable("utm_source",redirectUrl);
         let e = {site : site,url : redirectUrl ,endpoint : end_point,utm_source : utm_source};
         fetch("https://www.silvergloria.com/click-action", {
             mode: "no-cors",
             body: JSON.stringify(e),
             method: "POST",
             headers: {
                     'content-type': 'application/json'
                 }
         }).then(function(e) {
             return;
         })

    });

});

self.addEventListener('fetch', function(event) {
  
});

