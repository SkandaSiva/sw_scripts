
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');


// Configuración de Firebase para el Service Worker
const firebaseConfig = {
  apiKey: "AIzaSyDZfbaKlKosSJmNm9U8bGL8bySFmcDQIpg",
  authDomain: "notificaciones-web-push-439618.firebaseapp.com",
  projectId: "notificaciones-web-push-439618",
  storageBucket: "notificaciones-web-push-439618.appspot.com",
  messagingSenderId: "721897208053",
  appId: "1:721897208053:web:f9e113f16b79b5b95c2dbc"
};

// Inicializar Firebase en el Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Manejar notificaciones en segundo plano
messaging.onBackgroundMessage((payload) => {
  console.log("Notificación recibida en segundo plano:", payload);
  
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data: {url: payload.data.url }
  };

  // Muestra la notificación
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Este evento se activa cuando se hace clic en la notificación
self.addEventListener('notificationclick', (event) => {
  console.log('Notificación clickeada:', event);

  // Cierra la notificación
  event.notification.close();
  const urlToOpen = event.notification.data.url;
  // Maneja la acción a tomar al hacer clic en la notificación
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
                return client.focus();
            }
        }
        return clients.openWindow(urlToOpen);
    })
);
});