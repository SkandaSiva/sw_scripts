importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyA1QszRqPZNGYQluG5h69Bhq1EcWvNHbIk",
    authDomain: "corban-ee446.firebaseapp.com",
    projectId: "corban-ee446",
    storageBucket: "corban-ee446.appspot.com",
    messagingSenderId: "1092991484541",
    appId: "1:1092991484541:web:f11b415f0ff11545a6a714",
    measurementId: "G-1DTSVDRBML"
});

const messaging = firebase.messaging();

// Recebendo mensagens em segundo plano
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Seu código para lidar com a mensagem recebida vai aqui. 
    // Por exemplo, você pode armazenar os dados da mensagem para uso posterior
    // ou realizar algum processamento com base nos dados da mensagem.
});
