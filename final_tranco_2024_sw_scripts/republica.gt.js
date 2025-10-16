(function(){'use strict';self.addEventListener('install',event=>{self.skipWaiting();});importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-app.js');importScripts('https://www.gstatic.com/firebasejs/6.2.0/firebase-messaging.js');var messagingSenderId=get_sw_url_parameters('messagingSenderId');function get_sw_url_parameters(param){var vars={};self.location.href.replace(self.location.hash,'').replace(/[?&]+([^=&]+)=?([^&]*)?/gi,function(m,key,value){vars[key]=value!==undefined?value:'';});if(param){return vars[param]?vars[param]:null;}
return vars;}
firebase.initializeApp({'messagingSenderId':messagingSenderId});var messaging=firebase.messaging();messaging.setBackgroundMessageHandler(function(payload){console.log("setBackgroundMessageHandler",payload)
var notificationTitle=payload.data.title;var notificationOptions={icon:'img/push/notification3.png',badge:'img/push/badge.png',vibrate:[100,50,100],data:{dateOfArrival:Date.now(),nota:payload.data.nota,id_notificacion:payload.data.id_notificacion}};if(payload.data&&payload.data.body){if(payload.data.body.indexOf("...")!=-1)
notificationOptions["body"]=payload.data.body.replace("...","")
else
notificationTitle=payload.data.body}
if(payload.data.image)
notificationOptions.image=payload.data.image
return self.registration.showNotification(notificationTitle,notificationOptions);});self.addEventListener('notificationclick',function(e){var notification=e.notification;if(notification.data){var nota=notification.data.nota;if(nota){e.waitUntil(clients.matchAll().then(function(clis){var client=clis.find(function(c){return c.visibilityState==='visible';});if(client!==undefined){client.navigate(nota);client.focus();}else{clients.openWindow(nota);notification.close();}}));}}
self.registration.getNotifications().then(function(notifications){notifications.forEach(function(notification){notification.close();});});});})();