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
const firebaseConfig =  {"apiKey":"AIzaSyCheFda0EDGrCBQoMP5MqmLzCRHMostX0E","authDomain":"noticias-9362d.firebaseapp.com","projectId":"noticias-9362d","storageBucket":"noticias-9362d.appspot.com","messagingSenderId":"394038807773","appId":"1:394038807773:web:9ff05852667e1f9a9ddf34","measurementId":"G-P84KSSYV8S"};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Configuración opcional de mensajería de Firebase
messaging.onBackgroundMessage(function(payload) {
  
  // Personaliza el manejo del mensaje recibido en segundo plano aquí

  const notificationTitle = payload.data.title;
  const notificationOptions = payload.data;

});



/* version: v3-176 */