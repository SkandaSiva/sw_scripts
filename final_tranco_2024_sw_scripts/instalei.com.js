
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCL5dV2BAnhLjOJP8nuGHm8Z4VmBup-1bI",
  authDomain: "push-notifications-99711.firebaseapp.com",
  projectId: "push-notifications-99711",
  storageBucket: "push-notifications-99711.appspot.com",
  messagingSenderId: "470757012691",
  appId: "1:470757012691:web:8bbeb76ea28d695e65d026",
  measurementId: "G-MD4HKXHLVW"
});

// const messaging = firebase.messaging();
/*
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        data: {
            link: payload.data.link,
            hash: payload.data.hash,
            hash_push_automation: payload.data.hash_push_automation,
            push_automation: payload.data.push_automation
        }	
    }
    event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});
*/

    self.addEventListener('push', function(event) {
        const payload = event.data.json();
        console.log('[firebase-messaging-sw.js] Received  message payload', payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions =
        {
            body: payload.notification.body,
            icon: payload.notification.icon,
            data:
            {
                link: payload.data.link,
                hash: payload.data.hash,
                hash_push_automation: payload.data.hash_push_automation,
                push_automation: payload.data.push_automation
            }	
        };
        self.registration.showNotification(notificationTitle, notificationOptions)
    });

self.addEventListener('notificationclick', function (event) {
    console.log('EVENTO CHEGOU');
    console.log(event);
    const clickedNotification = event.notification;
    event.notification.close();
    console.log(clickedNotification);

    // Abre a conexão com o banco de dados
    var request = indexedDB.open('firebase-messaging-database', 1);
    // Manipula o evento de sucesso
    request.onsuccess = function (event) {
        var db = event.target.result;
        var transaction = db.transaction(['firebase-messaging-store'], 'readonly');
        var objectStore = transaction.objectStore('firebase-messaging-store');
        var cursorRequest = objectStore.openCursor();
        cursorRequest.onsuccess = function (event) 
        {
            var cursor = event.target.result;
            if (cursor)
            {
                var rowData = cursor.value;
                if(clickedNotification.data.push_automation && clickedNotification.data.hash_push_automation)
                {
                    var urlPost = 'https://push.linkview.io/api/push-notifications/data/data_pushs/updateClickedPushAutomation.php';
                    var formulario  = new FormData();
                    formulario.append('clicked', true);
                    formulario.append('hash', clickedNotification.data.hash_push_automation);
                    formulario.append('token', rowData.token);

                    fetch(urlPost,{
                        method:'post',
                        body: formulario
                    }).then(function (response){
                    return response.text();
                    });
                    
                    var urlPost = 'https://push.linkview.io/api/push-notifications/data/data_pushs/updateClickedPush.php';
                    var formulario  = new FormData();
                    formulario.append('clicked', true);
                    formulario.append('hash', clickedNotification.data.hash);
                    formulario.append('token', rowData.token);

                    fetch(urlPost,{
                        method:'post',
                        body: formulario
                    }).then(function (response){
                    return response.text();
                    });
                }
                else
                {
                    var urlPost = 'https://push.linkview.io/api/push-notifications/data/data_pushs/updateClickedPush.php';
                    var formulario  = new FormData();
                    formulario.append('clicked', true);
                    formulario.append('hash', clickedNotification.data.hash);
                    formulario.append('token', rowData.token);

                    fetch(urlPost,{
                        method:'post',
                        body: formulario
                    }).then(function (response){
                    return response.text();
                    });
                }   
                    cursor.continue();
            } 
            else
            {
                console.log('Todos os registros foram recuperados');
            }
        };
    };
    console.log('URL to open:', clickedNotification);
    console.log('URL to open2:', clickedNotification.data.link);
    event.waitUntil(clients.openWindow(clickedNotification.data.link));

})