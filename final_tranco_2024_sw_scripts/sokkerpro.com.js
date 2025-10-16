importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyASOuIrP9qrRun4PCHwd1Ers2P-7oGtMOk",
  authDomain: "sokkerpro-v12.firebaseapp.com",
  databaseURL: "https://sokkerpro-v12.firebaseio.com",
  projectId: "sokkerpro-v12",
  storageBucket: "sokkerpro-v12.appspot.com",
  messagingSenderId: "233158179083",
  appId: "1:233158179083:web:e8fa14812d787093ef4a0e",
  measurementId: "G-KYSZFLHTFN"
});

const messaging = firebase.messaging();

// Função para verificar se o jogo está nos favoritos
async function isMatchInFavorites(matchId) {
  try {
    const client = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });
    
    if (client.length > 0) {
      // Tenta obter os favoritos do localStorage através da janela do cliente
      const response = await client[0].evaluate((matchId) => {
        return localStorage.getItem('favorites') ? 
          JSON.parse(localStorage.getItem('favorites')).includes(matchId.toString()) : 
          false;
      }, matchId);
      
      return response;
    }
    return false;
  } catch (error) {
    console.error('Erro ao verificar favoritos:', error);
    return true; // Em caso de erro, mostra a notificação por segurança
  }
}

// Manipula as notificações em segundo plano
messaging.setBackgroundMessageHandler(async function(payload) {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  
  // Verifica se é uma notificação de gol e tem match_id
  if (payload.data && payload.data.type === 'goal' && payload.data.match_id) {
    const matchId = payload.data.match_id;
    const isInFavorites = await isMatchInFavorites(matchId);
    
    // Se não estiver nos favoritos, não mostra a notificação
    if (!isInFavorites) {
      console.log(`Match ${matchId} não está nos favoritos, ignorando notificação`);
      return;
    }
  }

  // Configurações da notificação
  const notificationTitle = payload.notification.title || "Notificação do SokkerPro";
  const notificationOptions = {
    body: payload.notification.body || "Você tem uma nova mensagem.",
    icon: payload.notification.icon || "/favicon.ico",
    data: {
      click_action: payload.notification.click_action || "https://sokkerpro.com",
      match_id: payload.data ? payload.data.match_id : null
    }
  };

  // Exibir a notificação
  return self.registration.showNotification(notificationTitle, notificationOptions).then(function() {
    // Reproduzir o som personalizado
    const audio = new Audio('https://sokkerpro.com/notification.mp3');
    audio.play();
  });
});

// Manipula o clique na notificação
self.addEventListener('notificationclick', function(event) {
  const clickAction = event.notification.data.click_action || 'https://sokkerpro.com';
  const matchId = event.notification.data.match_id;
  
  event.notification.close();  // Fecha a notificação ao clicar
  
  // Se tiver match_id, abre a página específica do jogo
  const urlToOpen = matchId ? 
    `${clickAction}/match/${matchId}` : 
    clickAction;
    
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});