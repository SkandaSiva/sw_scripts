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

var version=1.1;

self.addEventListener('notificationclick', function(event) {
    let url = 'https://www.google.com';
    event.notification.close(); // Android needs explicit close.
	
	if (event.action) {
			url=event.action;
	}

    event.waitUntil(
        clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
  var title = 'Aviso';
  const options = {
    body: 'Test',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  
/*
  var title = 'Aviso';
  const options = {
    body: 'Test',
    icon: 'images/icon.png',
    badge: 'images/badge.png'
  };

  var num_lines=event.data.text().split('\n').length;
  console.log("num_lines = "+num_lines);
  if (num_lines>1){
	  title= event.data.text().split('\n',1)[0];
	  var lineas =event.data.text().split('\n');
	  console.log("Lineas = "+lineas);
	  lineas.shift();
	  console.log("Lineas menos primera = "+lineas);
	  console.log(lineas);
	  var resto=lineas.join("\n");;
	  options["body"]=resto;
  } else {
	  options["body"]=event.data.text();
  }
  */
  
  try{
  var data = JSON.parse(event.data.text());
  event.waitUntil(self.registration.showNotification(data.title, data.options));
  } catch (err){
	console.log("No JSON");
	var num_lines=event.data.text().split('\n').length;
	console.log("num_lines = "+num_lines);
	if (num_lines>1){
	  title= event.data.text().split('\n',1)[0];
	  var lineas =event.data.text().split('\n');
	  console.log("Lineas = "+lineas);
	  lineas.shift();
	  console.log("Lineas menos primera = "+lineas);
	  console.log(lineas);
	  var resto=lineas.join("\n");;
	  options["body"]=resto;
	} else {
	  options["body"]=event.data.text();
	}
    event.waitUntil(self.registration.showNotification(title,options));
  }

  
});
