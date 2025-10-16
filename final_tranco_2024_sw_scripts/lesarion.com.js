
importScripts('/js/firebase-compat.php');

const userId = 0;

const dataform = new URLSearchParams();
dataform.append('givenuserid', userId);

fetch('https://de.lesarion.com/firebase_logging.php', {
    method: 'POST',
    body: dataform,
}).catch(error => {
    console.error(error)
});


const firebaseConfig = {
    apiKey: "AIzaSyAg2EmAoxln8MZ6K-BJdsaeqbfiJHGzEqE",
    authDomain: "lesarion-cefa7.firebaseapp.com",
    databaseURL: "https://lesarion-cefa7.firebaseio.com",
    projectId: "lesarion-cefa7",
    storageBucket: "lesarion-cefa7.appspot.com",
    messagingSenderId: "672881077947",
    appId: "1:672881077947:web:e293c80e7b202a9531039e"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js.php] Received background message ',payload);
  
  // Customize notification here
  
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    tag:  payload.data.tag,
    data: {
            url: payload.notification.click_action
    }
  };

  self.registration.showNotification(payload.notification.title, notificationOptions);
  console.log('[firebase-messaging-sw.js.php] show background otification: ' + payload.notification.title + ' -- ' + notificationOptions);
  
})

self.addEventListener('notificationclick', function(event) {
   console.log('notificationclick:' + event);
   console.log('notificationclick url:' + event.notification.data.url);
   event.notification.close();
   event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});


self.addEventListener('push', function(event) {
    console.log('Received a push message' + event.data);

    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    let data = {};
    if (event.data) {
        data = event.data.json();
    }
    
    console.log('notification wait until url2: ' + data.notification.click_action);

    event.waitUntil(
        clients.matchAll({
            type: 'window',
            includeUncontrolled: true
        })
        .then(function(windowClients) {
            let clientIsVisible = false;

            for (const windowClient of windowClients) {
                console.log('iterate client: ' + windowClient);
                if (windowClient.visibilityState === "visible") {
                    clientIsVisible = true;
                    console.log('iterate client true');
                    
                    // Creating notification options
                    const options = {
                        body: data.notification.body,
                        icon: data.notification.icon,
                        tag: data.data.tag,
                        data: {
                            url: data.notification.click_action
                        }
                    };
                    
                    // Show notification
                    console.log('[firebase-messaging-sw.js.php] will show background notification2:' + data.notification.click_action);
                    return self.registration.showNotification(data.notification.title, options).then(() => {
                        console.log('Notification displayed successfully: ' + data.notification.title);
                    })
                    .catch((error) => {
                        console.error('Failed to display notification: ', error);
                    });
         
                }
            }
            
            // If no visible client was found, return a resolved promise
            if (!clientIsVisible) {
                return Promise.resolve();
            }
        })
        .catch(function(error) {
            console.error('Error matching clients:', error);
        })
    );
});

