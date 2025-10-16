// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBpBFuJG62eQqpPyF-pk0YzXvNfyXyEryo",
  authDomain: "outgo-225414.firebaseapp.com",
  databaseURL: "https://outgo-225414.firebaseio.com",
  projectId: "outgo-225414",
  storageBucket: "outgo-225414.appspot.com",
  messagingSenderId: "49652384191",
  appId: "1:49652384191:web:ddeac083876fac0382e10a",
  measurementId: "G-VZBRC62QNR"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically 
// and you should use data messages for custom notifications.
// For more info see: 
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/assets/images/favicon/favicon-32x32.png',
    data: payload.data
  };

  self.registration.showNotification(payload.notification.title,
    notificationOptions);
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(clients.matchAll({
    includeUncontrolled: true,
    type: "window"
  }).then(clientList => {
    let url;

    console.log(event.notification);
    if (event.notification.data?.id) {
      switch (event.notification.data.id) {
        case "1": //Compra finalizada
          url = "/compra_finalizada/" + event.notification.data.purchase_id;
          break;

        case "2": //Ingresso compartilhado
        case "3": //Check-in realizado
        case "4": //Adicionado em equipe de evento
        case "5": //Responderam seu comentário
        case "7": //Lote de ingressos esgotado
        case "8": //Primeira venda online em evento. TODO: Ir para tela de transações
          url = "/evento/" + event.notification.data.event_id;
          break;

        case "6": //Adicionado em tela de perfil comercial
          url = "/perfil/" + event.notification.data.company_id;
          break;

        default:
          url = "/";
          break;
      }
    } else {
      console.log("Notificação recebida sem push_type");
      return;
    }

    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];

      if (client.url == url && 'focus' in client) {
        return client.focus();
      }
    }
    if (clients.openWindow) {
      return clients.openWindow(url);
    }

  }))
})
