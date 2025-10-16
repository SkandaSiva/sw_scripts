self.addEventListener('install', function(event) {
    console.log("Chat Service Worker installed");

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                return caches.delete(key);
            }));
        })
    );
    
    self.skipWaiting();
});

self.addEventListener("fetch", function(event){{}
    //event.respondWith(fetch(event.request));
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                return caches.delete(key);
            }));
        })
    );
});

self.addEventListener('push', function (event) {
    const msg = event.data.text();

    let wasForwarded = false;
    event.waitUntil(self.clients.matchAll().then(function(clients) {
        clients.forEach(function(client) {
            
            const url = new URL(client.url);

            if (url.pathname === '/chat/') {
                //found a chat window
                
            }else{
                //found a main window
                
            }
            
            client.postMessage({
                "type"      :   "servermessage",
                "message"   :   msg
            });
            
            //console.log(client.visibilityState);
            if(client.visibilityState !== "hidden"){
                wasForwarded = true;
            }
        })

        if (!(self.Notification && self.Notification.permission === 'granted')) {
            return;
        }

        let messageObj = JSON.parse(msg);

        if(!wasForwarded){
            const sendNotification = (body,title,image,tag) => {
                return self.registration.showNotification(title, {
                    body: body,
                    icon: image,
                    badge:'images/chat_badge.png',
                    actions: [
                        {action: 'open', title: 'Öffnen'}
                    ],
                    data: messageObj,
                    tag: tag
                });
            };

            if (event.data) {
                //const message = event.data.text();
                event.waitUntil(sendNotification(messageObj.data.sendername + ' hat dir im Chat geschrieben!', "Neue Chatnachricht", '/profilephoto/show/'+messageObj.data.sender+'/1/64/0/029d699d75cbfb6c','chat-' + messageObj.data.msgId));
            }
        }
    }));
});

self.addEventListener('notificationclick', function(event) {
    let senderId = event.notification.data.sender;
    let originalmessage = event.notification.data;
    event.notification.close();

    event.waitUntil(async function() {
        const allClients = await clients.matchAll({
            includeUncontrolled: true
        });

        let chatClient;

        // Let's see if we already have a chat window open:
        for (const client of allClients) {
            const url = new URL(client.url);

            if (url.pathname === '/chat/') {
                // Excellent, let's use it!
                client.focus();
                chatClient = client;
                break;
            }
        }

        // If we didn't find an existing chat window,
        // open a new one:

        if (!chatClient) {
            chatClient = await clients.openWindow("./#/conversation/" + senderId);
        }else{
            chatClient.postMessage({type:'showconversation', conversation: senderId, originalmessage: originalmessage.data});
        }


    }());
}, false);

self.addEventListener('message', function(event){
    const msg = event.data;
    if(msg.type === "main_site_update"){
        clients.matchAll({
            includeUncontrolled: true
        }).then(function(allClients){

            for (const client of allClients) {
                const url = new URL(client.url);

                if (url.pathname !== '/chat/') {
                    client.postMessage(msg);
                }
            }
        });
    }
    
    if(msg.type === "chat_focus"){
        clients.matchAll({
            includeUncontrolled: true
        }).then(function(allClients){
            for (const client of allClients) {
                const url = new URL(client.url);
                if (url.pathname === '/chat/') {
                    client.focus();
                }
            }
        });
    }
});
