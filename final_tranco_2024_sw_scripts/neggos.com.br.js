'use strict';



self.addEventListener('push', function(event){

  console.log('[Service Worker] Push Received.');


  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  var mensagemcompleta = `${event.data.text()}`;
  mensagemcompleta = JSON.parse(mensagemcompleta);

  // console.log(mensagemcompleta.titulo);
  // console.log(mensagemcompleta.mensagem);

  var titulo = mensagemcompleta.titulo;
  var mensagem = mensagemcompleta.mensagem;
  var url = mensagemcompleta.url;
  var icon = mensagemcompleta.icon;

  const title = titulo;

  const options = {

    body: mensagem,

    url: url,

    data: url,

    icon: icon,

    badge: 'images/badge.png'

  };



  event.waitUntil(self.registration.showNotification(title,options));

});





self.addEventListener('notificationclick', function(event){

  var url = event.notification.data;

  console.log('[Service Worker] Notification click Received.');



  event.notification.close();



  event.waitUntil(

    clients.openWindow(url)

  );

});