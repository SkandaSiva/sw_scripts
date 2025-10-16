/* The service worker is like an extra process or thread that your
 * application can run. It has limited capabilities and permissions.
 * See: https://developer.mozilla.org/en-US/docs/Mozilla/Projects/Social_API/Service_worker_API_reference
 */
'use strict';

function openWindow(event) {
    //console.log(event.notification.data);
    /**** START notificationOpenWindow ****/
    const promiseChain = clients.openWindow(event.notification.data);
    event.waitUntil(promiseChain);
    /**** END notificationOpenWindow ****/
}

// Register event listener for the 'push' event.
self.addEventListener('push', function(event)  {
    /* Push events arrive when a push message is received.
     They should include a .data component that is the decrypted
     content of the message.
     */
    //console.info("**** Recv'd a push message::", JSON.stringify(event));
    //console.log(JSON.stringify(event));
    if (event.data) {
        // Data is a accessor. Data may be in one of several formats.
        // See: https://w3c.github.io/push-api/#pushmessagedata-interface
        // You can use the following methods to fetch out the info:
        // event.data.text() => as a UTF-8 text string
        // event.data.arrayBuffer() => as a binary buffer
        // event.data.blob() => Rich content format
        // event.data.json() => JSON content
        //
        // Since we sent this in as text, read it out as text.
        //console.log(event.data.json());
        var content = event.data.json();
        // display a notification with the message needed
        // you can decide whether you take the user directly to the Obituary view page using its ID
        // or to a notification view page instead
        //console.log(content);

        // Desktop notifications
        var dataUrl, actions;
        const title = content.objectType;

        switch (title) {
            case 'Memorial':
                dataUrl = 'https://www.khoolood.com/memorials/' + content.objectId + '/';
                actions = [{action: 'read-article', title: 'Read article',}];
                break;

            case 'Obituary':
                dataUrl = 'https://www.khoolood.com/obituaries/' + content.objectId + '/';
                actions = [{action: 'read-article', title: 'Read article',}];
                break;

            case 'Commemoration':
                dataUrl = 'https://www.khoolood.com/obituaries/' + content.objectId + '/';
                actions = [{action: 'read-article', title: 'Read article',}];
                break;

            default:
                dataUrl = '';
                break;
        }
        const options = {
            body: content.message,
            icon: 'https://www.khoolood.com/img/obituary-512.jpg',
            badge: 'https://www.khoolood.com/img/obituary-128.jpg',
            //image: '/images/demos/unsplash-farzad-nazifi-1600x1100.jpg',
            //data: base_url + 'obituaries/950/',
            data: dataUrl,
            //tag: 'open-window',
            actions: actions
            /*actions: [
                {
                    action: 'read-article',
                    title: 'Read article',
                    //icon: icon
                }
            ]*/
        };

        self.registration.showNotification(title, options);
        //registration.showNotification('1');
    }
});
/*self.addEventListener('push', function(event) {
    if (event.data) {
        switch(event.data.text()) {
            default:
                console.warn('Unsure of how to handle push event: ', event.data);
                break;
        }
    }
});*/

/**** START notificationActionClickEvent ****/
self.addEventListener('notificationclick', function(event) {
    if (!event.action) {
        // Was a normal notification click
        //openWindow(event);
        //console.log('Notification Click.');
        return;
    }

    switch (event.action) {
        case 'read-article':
            openWindow(event);
            break;
        default:
            //console.log(`Unknown action clicked: '${event.action}'`);
            break;
    }
});
/**** END notificationActionClickEvent ****/

/**** START notificationClickEvent ****/
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    switch(event.notification.tag) {
        case 'open-window':
            //openWindow(event);
            break;
        default:
            // NOOP
            break;
    }
});
/**** END notificationClickEvent ****/

const notificationCloseAnalytics = () => {
    return Promise.resolve();
};

/**** START notificationCloseEvent ****/
self.addEventListener('notificationclose', function(event) {
    const dismissedNotification = event.notification;

    const promiseChain = notificationCloseAnalytics();
    event.waitUntil(promiseChain);
});
/**** END notificationCloseEvent ****/

/* The following are other events that this service worker could respond to.
 */

self.addEventListener('message', function(event) {
    // A message has been sent to this service worker.
    console.log("sw Handling message event:", event);
});

self.addEventListener('pushsubscriptionchange', function(event) {
    // The Push subscription ID has changed. The App should send this
    // information back to the App Server.
    console.log("sw Push Subscription Change", event);
    // resend me the new push URL

});

self.addEventListener('registration', function(event){
    // The service worker has been registered.
    //console.log("sw Registration: ", event);
});


self.addEventListener('install', function(event){
    // The serivce worker has been loaded and installed.
    // The browser aggressively caches the service worker code.
    //console.log("sw Install: ", JSON.stringify(event));
    // This replaces currently active service workers with this one
    // making this service worker a singleton.
    event.waitUntil(self.skipWaiting());
    //console.log("sw Installed: ", JSON.stringify(event));

});

self.addEventListener('activate', function(event){
    // The service worker is now Active and functioning.
    //console.log("sw Activate : ", JSON.stringify(event));
    // Again, ensure that this is the only active service worker for this
    // page.
    event.waitUntil(self.clients.claim());
    //console.log("sw Activated: ", JSON.stringify(event));
});

/*self.addEventListener('message', function(event) {
    console.log('Received message from page.', event.data);
    switch(event.data) {
        case 'must-show-notification-demo':
            self.dispatchEvent(new PushEvent('push', {
                data: 'must-show-notification'
            }));
            break;
        case 'send-message-to-page-demo':
            self.dispatchEvent(new PushEvent('push', {
                data: 'send-message-to-page'
            }));
            break;
        default:
            console.warn('Unknown message received in service-worker.js');
            break;
    }
});*/