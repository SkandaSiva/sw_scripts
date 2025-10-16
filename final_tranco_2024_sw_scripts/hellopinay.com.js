const filesToCache = [  
  '/img/profile-photo-background.png',
  '/img/hp-push-heart-solid.png',
  '/img/hp-push-thumbs-up-solid.png',
  '/img/hp-push-comments-solid.png',
  '/img/hp-push-plane-departure-solid.png',  
  'offline.html'
];

const staticCacheName = 'pages-cache-v2';

self.addEventListener('fetch', evt=> {
    if (evt.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    evt.respondWith(
        fetch(evt.request)
            .catch(() => {
                return caches.open(staticCacheName)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );
});

self.addEventListener('install', event => {
    caches.open(staticCacheName).then(cache => {
        return cache.addAll(filesToCache);
    })
});

self.addEventListener('activate', event => {
   
});

self.skipWaiting()

self.addEventListener('push', event => {
    var notificationData;
    var title = 'Your HelloPinay account has activity.';
    var options;
    try {
        notificationData = event.data.json();         
        if (typeof notificationData.data.title !== 'undefined') {
            title = notificationData.data.title;
        }        
    }
    catch(ex){
        console.log(ex.message);
    }   
    if (event.data) {
        options = event.data.json();
    }
    else {
        //something went wrong.
        options = {
            body: 'Click to go log in to your account.',
            icon: 'img/hpicon-pwa-192-push.png'
        }
    }
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {    
    var url = 'https://hellopinay.com/account/sign-in';
    try{
        if (typeof event.notification.data.url !== 'undefined') {
            url = event.notification.data.url;
        }       
    }
    catch(ex){
        console.log(ex.message);
    }
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
