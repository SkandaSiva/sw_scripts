self.addEventListener('push', function(event) {
    //console.log('[Firebase Service Worker] Push Received.');
    console.log(`[Firebase Service Worker] Push had this data: "${event.data.text()}"`);

    let n_messageJson=event.data.text();
    let n_message=JSON.parse(n_messageJson);
    //console.log("n message is "+n_message);
    //console.log("title is "+n_message.notification.title);
    let imgUrl="";
    if (n_message.notification.image !=undefined)
    {
        imgUrl=n_message.notification.image;
    }
    else if (n_message.notification.image !=undefined)
    {
        imgUrl=n_message.data.image;
    }
    let iconUrl="https://cloud-cdn-v2.hinkhoj.com/images/apps/ne-logo.png"
    if (n_message.data.icon!=undefined)
    {
        iconUrl=n_message.data.icon;
    }
    if(imgUrl !="") {
        const options = {
            body: n_message.notification.body,
            icon: iconUrl,
            image: imgUrl,
            dir: 'ltr',
            requireInteraction: true,
            data: {url: n_message.data.url}, //the url which we gonna use later
            actions: [{action: "open_url", title: "Open Now"}]
        };
        event.waitUntil(self.registration.showNotification(n_message.notification.title, options));
    }
    else
    {
        const options = {
            body: n_message.notification.body,
            icon: iconUrl,
            dir: 'ltr',
            requireInteraction: true,
            data: {url: n_message.data.url}, //the url which we gonna use later
            actions: [{action: "open_url", title: "Open Now"}]
        };
        event.waitUntil(self.registration.showNotification(n_message.notification.title, options));
    }

});

self.addEventListener('notificationclick', function(event) {

         event.notification.close();
         if(event.notification.data.url != undefined) {
             clients.openWindow(event.notification.data.url); //which we got from above
         }

    }
    , false);

