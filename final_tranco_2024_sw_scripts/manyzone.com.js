
importScripts('https://www.gstatic.com/firebasejs/9.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.0/firebase-messaging-compat.js');

const channel4Broadcast = new BroadcastChannel('channel4');

//self.addEventListener('install', (event) => {
//    console.log('Installed');
//});

//self.addEventListener('activate', (event) => {
//    console.log('Activated');
//});

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
    console.log('Fetch request');
});


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAbuZPqbyQUvPK00jNjnerwEHP2vAUaJEU",
    authDomain: "umastro-39798.firebaseapp.com",
    databaseURL: "https://umastro-39798.firebaseio.com",
    projectId: "umastro-39798",
    storageBucket: "umastro-39798.appspot.com",
    messagingSenderId: "884361479586",
    appId: "1:884361479586:web:9a7488b3b5a17091ae5efb"
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();



///This WORKS: Still "Site has been updated in background message" gets displayed
//https://web.dev/push-notifications-handling-messages/
//https://stackoverflow.com/questions/31108699/chrome-push-notification-this-site-has-been-updated-in-the-background
//https://web-push-book.gauntface.com/common-notification-patterns/
self.addEventListener('push', function (event) {
    if (event.data) { }
    else { return; }
    var data = {};
    var obeventdata = event.data.json();
    var title = obeventdata.data.title;
    const options = {
        actions: [
            {
                action: 'Decline',
                title: 'Decline',
                icon: '/images/icons/icon-72x72.png',
            },
            {
                action: 'Accept',
                title: 'Accept',
                icon: '/images/icons/icon-72x72.png',
            },
        ],
    };


    console.log(options.actions);
    // var options=new Object();
    options.body = obeventdata.data.body;
    options.tag = obeventdata.data.tag;
    options.icon = obeventdata.data.icon;
    //options.data = obtags; //https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification //https://googlechrome.github.io/samples/notifications/vibrate.html
    //options.data = obeventdata.data.randdata;
    options.data = obeventdata.data;
    options.vibrate = [200, 100, 200, 100, 200, 100, 200];
    options.renotify = true;


    console.log(JSON.parse(obeventdata.data.actions));//CORRECT

    options.actions = JSON.parse(obeventdata.data.actions);


    //event.waitUntil(
    //    self.clients.matchAll(optionsClient).then(function (clientsArr) {
    //        if (clientsArr && clientsArr.length) {
    //            self.registration.showNotification(title, options)
    //        }
    //        else {
    //            self.registration.showNotification(title, options)
    //        }
    //    }));

    var randdata = JSON.parse(obeventdata.data.randdata);
    var isRingSound = false;
    if ('playrs' in randdata) {  
        console.log('randdata.playrs' + randdata.playrs);
        isRingSound = (String(randdata.playrs).toLowerCase() === 'true');
    }

    /* var navigate_url = encodeURIComponent(randdata.noclur + "&gclient=" + gotClient);*/
    //var navigate_url;
    //if (gotClient) { navigate_url = randdata.noclur + "&gclient=true"; }
    //else { navigate_url = randdata.noclur + "&gclient=false"; }
    //navigate_url = encodeURIComponent(navigate_url);
    //var fetchurl = 'https://wpi.manyzone.com/pushnotification/onreceived/sw?noclur=' + navigate_url;
    //console.log("fetch:navigate_url: " + navigate_url);
    //event.waitUntil(
    //    fetch(fetchurl)
    //        .then(response => response.json())
    //        .then(data => { console.log(data) })
    //        .catch(error => { console.log(error) })
    //);



    console.info('Event: Push NEW');  
    var gotClient = false;
    var optionsClient = { includeUncontrolled: true, type: 'window' };
    event.waitUntil(
        self.clients.matchAll(optionsClient).then(function (clientsArr) {
            if (clientsArr && clientsArr.length) {
                gotClient = true;
                console.log("gotClient:" + gotClient);
                //Respond to last focused tab
                //console.log("Client0" + clients[0]);
                //clientsArr[0].postMessage({ type: 'Push message Recived' });
                //clients[0].focus();//DOESNOT WORK
                /*channel4Broadcast.postMessage({ type: 'Push msg Broadcast' });*/

                if (isRingSound) {
                    clientsArr[0].postMessage({ action: 'PlayRingSound' });                   
                    /*channel4Broadcast.postMessage({ type: 'PlayRingSound' });*/
                    channel4Broadcast.postMessage({ type: 'PlayRingSound' });
                }
            }
            //self.registration.showNotification(title, options);
            var navigate_url;
            if (gotClient) { navigate_url = randdata.noclur + "&gclient=true"; }
            else { navigate_url = randdata.noclur + "&gclient=false"; }
            navigate_url = encodeURIComponent(navigate_url);
            var fetchurl = 'https://wpi.manyzone.com/pushnotification/onreceived/sw?noclur=' + navigate_url;

            return fetch(fetchurl).then(function (response) {
                return response.json().then(function (data) {
                    console.log(data);                    
                    return self.registration.showNotification(title, options);
                });
            })
            
        }));


   

});







self.addEventListener('notificationclick', function (event) {
    channel4Broadcast.postMessage({ type: 'StopNotificationSound' });  

    //var mydata = JSON.parse(event.notification.data);
    var mydata = event.notification.data;
    console.log("mydata:" + mydata);
    console.log("mydata:" + JSON.stringify(mydata));
    var randdata = JSON.parse(mydata.randdata);

  
    //https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
    //if (!event.action) {
    //    // Was a normal notification click
    //    console.log('Normal Notification Click.');
    //    /*event.notification.close();*/
    //    // This looks to see if the current is already open and
    //    // focuses if it is
    //    event.waitUntil(clients.matchAll({
    //        type: "window"
    //    }).then(function (clientList) {
    //        //for (var i = 0; i < clientList.length; i++) {
    //        //    var client = clientList[i];
    //        //    //if (client.url == '/' && 'focus' in client)
    //        //    if (client.url == '/wbap/' && 'focus' in client)
    //        //        return client.focus();
    //        //}
    //        //if (clients.openWindow)
    //        //    return clients.openWindow('/wbap/?redirect=1');
    //       // console.log("notification click url: " + obtags.noclur);
    //        console.log("notification click url: " + randdata.noclur);
    //        if (clients.openWindow)
    //            return clients.openWindow(randdata.noclur);
    //        //return clients.openWindow('/wbap/?rdurl=' + obtags.noclur);

    //    }));
    //    return;
    //}

   
   
    //if (event.action) {
    //    /* let myaction = event.notification.actions.find(myaction => myaction.action === event.action);*/
    //    var myactions = JSON.parse(mydata.actions);
    //   // let myaction = mydata.actions.find(myaction => myaction.action === event.action);
    //    let myaction = myactions.find(myaction => myaction.action === event.action);
    //    clients.openWindow(myaction.actionurl);
    //}

    event.notification.close();


    var navigate_url = ""
    if (!event.action) {
        navigate_url = randdata.noclur;
    }
    if (event.action) {       
        var myactions = JSON.parse(mydata.actions);       
        let myaction = myactions.find(myaction => myaction.action === event.action);
        navigate_url = myaction.actionurl;
    }
    //https://stackoverflow.com/questions/70983318/focus-tab-and-change-page-with-service-worker
    //https://developer.mozilla.org/en-US/docs/Web/API/Clients/openWindow
    //https://developer.mozilla.org/en-US/docs/Web/API/WindowClient/focus
    event.waitUntil(
        clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clientsArr => {
            let found = false; 
            //clientsArr.every(client => {
            //    if (client.url.includes("manyzone.com")) {
            //        found = true;
            //        client.focus();
            //        //client.postMessage({ action: 'NOTIFICATION_CLICK', message_id: data.message_id, navigate_url: navigate_url });
            //        client.postMessage({ action: 'NOTIFICATION_CLICK',  navigate_url: navigate_url });
            //        return false;
            //    }
            //    return true;
            //});

            if (clientsArr && clientsArr.length) {               
                 found = true;
                clientsArr[0].focus();
                    //client.postMessage({ action: 'NOTIFICATION_CLICK', message_id: data.message_id, navigate_url: navigate_url });
                clientsArr[0].postMessage({ action: 'NOTIFICATION_CLICK',  navigate_url: navigate_url });
                 return true;
            }

            if (!found) {
                if (clients.openWindow)
                    return clients.openWindow(navigate_url);
               /* winClients.openWindow(navigate_url);*/
            }
        })
    );


   
}, false);

