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


try{
	self.addEventListener('push', function(event) {
	
	  //console.log('[Service Worker] Push Received.');
	
	  
	
	  var dados = event.data.text().split("|");
	
	  const title = (dados.length > 1) ? dados[0] : 'CONVITER - Crie seu convite online';
	
	  var url = (dados.length > 1) ? dados[2] : 'https://notificacao.naloja.net/web-push/jobs_conviter.php?link_job=1';
	
	  
	
	  const options = {
	
		body: (dados.length > 1) ? dados[1] : event.data.text(),
	
		data: url,
	
		icon: 'icon-push-512.png',
	
		badge: 'icon-push-128.png'
	
	  };
	
		const notificationPromise = self.registration.showNotification(title, options);
	
		event.waitUntil(notificationPromise);
	
	});
} catch (e) {
}

try{
	self.addEventListener('notificationclick', function(event) {
	
	  //console.log('[Service Worker] Notification click Received.');
	
	
	
	  event.notification.close();
	
	  
	
	  event.waitUntil(
	
		clients.openWindow(event.notification.data)
	
	  );
	
	});
} catch (e) {
}