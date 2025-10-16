console.log('registred')
self.addEventListener('push', async function (event) {
    console.log(event)
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
console.log(event.data)

let state;
    await event.waitUntil(
        clients.matchAll({includeUncontrolled: true, type: 'window'}).then( allclient => {
           
            if (allclient.length)
            allclient.forEach(client => {
                client.postMessage(event.data.json());
                state = client.visibilityState;
                console.log(state)
            });
            console.log(state)
            if (state !='visible')
            {
                var payload = event.data.json();
                var notificationTitle = payload.data.title; //or payload.notification or whatever your payload is
                var notificationOptions = {
                  body: payload.data.msg,
                  icon: '/build/images/web_hi_res_512.png',
                  data: { url:payload.data.url }, //the url which we gonna use later
                  actions: [{action: "open_url", title: "Afficher"}]
                };
                console.log(notificationOptions)
                return self.registration.showNotification(notificationTitle,
                    notificationOptions)
            }
               
              }));
          
        
    
});


self.addEventListener('notificationclick', function(event) {
console.log('notificationclick')
console.log(event)
  event.waitUntil(clients.matchAll({
    type: "window",
    includeUncontrolled: true
}).then(function (clientList) {
    if (event.notification.data.url) {
        let client = null;

        for (let i = 0; i < clientList.length; i++) {
            let item = clientList[i];

            if (item.url) {
                client = item;
                break;
            }
        }

        if (client && 'navigate' in client) {
            client.focus();
            event.notification.close();
            if ('navigate' in client) {
              return client.navigate(event.notification.data.url);
            }else
            clients.openWindow(event.notification.data.url);
        }
        else {
            event.notification.close();
            // if client doesn't have navigate function, try to open a new browser window
            return clients.openWindow(event.notification.data.url);
        }
    }
}));

});