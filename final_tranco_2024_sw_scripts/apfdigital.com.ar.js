self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(async function () {
  
    try {
      const url =  new URL(event.notification.data.FCM_MSG.data.link).toString();
      if (url) {
        c = await clients.openWindow(url);    
      }
    } catch(e) {
      try {
        let data = JSON.parse(event.notification.data);
        const url = new URL(data.link).toString();
        if (url) {
          c = await clients.openWindow(url);    
        }
      } catch(e) {
        console.error('Error al manejar el evento de clic en la notificación:', e);
      }
    }

   
  }());
});

importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js')

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig =  {"apiKey":"AIzaSyAyjd05GJJfI-RXudJSzZtlW0n950xNP_o","authDomain":"apfdigital-ecc9d.firebaseapp.com","projectId":"apfdigital-ecc9d","storageBucket":"apfdigital-ecc9d.appspot.com","messagingSenderId":"834888897064","appId":"1:834888897064:web:21c5a778c30c169c45db1d","measurementId":"G-KXZ373ZFVE"};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Configuración opcional de mensajería de Firebase
messaging.onBackgroundMessage(function(payload) {
  
  // Personaliza el manejo del mensaje recibido en segundo plano aquí

  const notificationTitle = payload.data.title;
  const notificationOptions = payload.data;

});



/* version: v3-21 */