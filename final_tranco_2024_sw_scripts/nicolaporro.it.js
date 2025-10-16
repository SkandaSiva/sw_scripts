importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAEGCjTQ5uk2GibS8cYiAkKxTjr8t5KoaI",
  authDomain: "nporrosupanot.firebaseapp.com",
  projectId: "nporrosupanot",
  storageBucket: "nporrosupanot.appspot.com",
  messagingSenderId: "220048732258",
  appId: "1:220048732258:web:93507a40e58a6321ef613b",
  measurementId: "G-FNCTGDZDHH"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
    console.log('Ricevuto messaggio in background:', payload);
    
    // Estrai i dati dal payload
    const notificationTitle = payload.data.title || 'Notifica';
    const notificationOptions = {
        body: payload.data.body,
        image: payload.data.image || '/path/to/default-icon.png',
        icon: 'https://www.nicolaporro.it/apple-touch-icon.png',
        badge: 'https://www.nicolaporro.it/badge.png',
        data: {
            url: payload.data?.link || '/',
            analytics_label: payload.webpush?.fcm_options?.analytics_label
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Aggiungi un event listener per gestire il click sulla notifica
self.addEventListener('notificationclick', function(event) {
    console.log('Notifica cliccata', event);

    event.notification.close();

    // Apri l'URL specificato nel payload
    const clickUrl = event.notification.data.url;
    event.waitUntil(
        clients.openWindow(clickUrl)
    );
// Log custom event with Firebase Analytics
        
    // Qui potresti anche inviare dati analytics se necessario
    if (event.notification.data.analytics_label) {
        // Implementa la logica per inviare dati analytics
        firebase.analytics().logEvent('notification_click', {
            clickUrl: clickUrl
        });
        console.log('Analytics label:', event.notification.data.analytics_label);
    }
});