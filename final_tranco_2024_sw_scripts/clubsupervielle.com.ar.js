
 importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 firebase.initializeApp({
   'messagingSenderId': '470276866236'
 });
 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]
 var urluno = '';
 var urldos = '';
 var acciones = [];
// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]
messaging.setBackgroundMessageHandler(function(payload) {
  //console.log('[firebase-messaging-sw.js] Received background message ', payload);
  if(payload.data.image == ''){
    var imagen = '';
  }else{
      var imagen = "https://"+payload.data.image; 
  }
   if(payload.data.actions != ''){
    acciones = JSON.parse(payload.data.actions); 
   }
  
  //console.log("cantidad de objetos: " + acciones.length);
  //console.log(acciones);
  if(payload.data.actions != ''){
    urluno = acciones[0]['url'];
  }
  if(acciones.length > 1){
    urldos = acciones[1]['url'];
  }
  
  var iconurl = "https://"+payload.data.icon;
  // Customize notification here
  var notificationTitle = payload.data.title;
  var notificationOptions = {
     body: payload.data.body,
     icon: iconurl,
     image: imagen,
     actions: acciones,
     vibrate:[300,100,400],
     data: {
         url: payload.data.url
     }
  };
     
  return self.registration.showNotification(notificationTitle,
    notificationOptions);

});
// [END background_handler]

self.addEventListener('notificationclick', function(event) {  
  var url = event.notification.data.url;
  var id = event.notification.data.id;
  
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146  
  event.notification.close();

  if(event.action === "accion-uno"){
    clients.openWindow(urluno);
  }

  if(event.action === "accion-dos"){
    clients.openWindow(urldos);
  }

  // This looks to see if the current is already open and  
  // focuses if it is  
  event.waitUntil(
    clients.matchAll({  
      type: "window"  
    })
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/' && 'focus' in client) 

          return client.focus();  
      }  
      if (clients.openWindow) {
       
        return clients.openWindow(url);

      }
    })
  );
});




