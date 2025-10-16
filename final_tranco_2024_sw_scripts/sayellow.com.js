//https://firebase.google.com/docs/cloud-messaging/js/client
//https://medium.com/izettle-engineering/beginners-guide-to-web-push-notifications-using-service-workers-cb3474a17679

importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/7.23.0/firebase-messaging.js')

firebase.initializeApp({
   apiKey:            "AIzaSyBp01w5aBqMnTJqzVBBPg7uE0QlF5D5h1A",
   authDomain:        "sayellow-216911.firebaseapp.com",
   databaseURL:       "https://sayellow-216911.firebaseio.com",
   projectId:         "sayellow-216911",
   storageBucket:     "sayellow-216911.appspot.com",
   messagingSenderId: "1009404262549",
   appId:             "1:1009404262549:web:ad9cdfe73070daff86039c"
})

const messaging    = firebase.messaging()


self.addEventListener('push', function(pEvent) {
   const promiseChain = isClientFocused()
      .then((clientIsFocused) => {
         if (clientIsFocused == false) {
            var tData = JSON.parse(pEvent.data.text())

            if (tData.data.hasOwnProperty('json-msg')) {                                  //Display Custom Message
               tMsg = JSON.parse(tData.data['json-msg'])

               if (tMsg.options.hasOwnProperty('data') && tMsg.options.data.hasOwnProperty('userID')) {                         //Check if you set an userID
                  const userID       = tMsg.options.data.userID
                  const userMessage  = tMsg.options.body
                  const userName     = tMsg.options.data.userName
                  const promiseChain = registration.getNotifications()
                     .then(notifications => {
                        let currentNotification

                        for(let i = 0; i < notifications.length; i++) {
                           if (notifications[i].data && notifications[i].data.userID === userID) {
                              currentNotification = notifications[i];
                           }
                        }

                        return currentNotification;
                  })               
                  .then((currentNotification) => {
                     let notificationTitle
                     const options = { 
                        actions:            tMsg.options.actions,
                        badge:              tMsg.options.badge,
                        icon:               tMsg.options.icon,
                        requireInteraction: tMsg.options.requireInteraction
                     }

                     if (currentNotification) {                                           // We have an open notification, let's do something with it.
                        const messageCount = currentNotification.data.newMessageCount + 1

                        options.body      = `You have ${messageCount} new messages from ${userName}.`
                        options.data      = { userID: userID, userName: userName, newMessageCount: messageCount }
                        notificationTitle = `New Messages from ${userName}`
                        currentNotification.close()                                       // Remember to close the old notification.
                     } else {
                        options.body      = `"${userMessage}"`;
                        options.data      = { userID: userID, userName: userName, newMessageCount: 1 }
                        notificationTitle = `New Message from ${userName}`;
                     }

                     return registration.showNotification(notificationTitle, options)
                  })
               } else {
                  pEvent.waitUntil( self.registration.showNotification(tMsg.title, tMsg.options) )
               }
            }   
         }
      })

   pEvent.waitUntil(promiseChain)
})


self.addEventListener('notificationclick', function(pEvent) {
   var tURL = ''

   pEvent.notification.close()
  
   if (!pEvent.action) {                                                                  //Clicked on a notification...
      if (pEvent.notification.data.hasOwnProperty('clickURL')) {                          //This value is set in your sendMsg.php
         tURL = pEvent.notification.data.clickURL
      } else {
         tURL = '/'                                                                       //If you did not send the above URL it will default to your home page
      }
   } else {
      if (pEvent.action != 'close') { var tURL = pEvent.action }                          //Set a URL in the action field of buttons, when the user click the button it will call that URL
   }  

   if (tURL != '') { pEvent.waitUntil( openWindow(pEvent, tURL) ) }
})


function isClientFocused() {
   return clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
         let clientIsFocused = false

         for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i]

            if (windowClient.visibilityState == 'visible' || windowClient.focused) {
               clientIsFocused = true
               break
            }
         }

         return clientIsFocused
      })
}


function  openWindow(pEvent, pURL) {                                                      //Check if the requested URL is already open, if so it focus on it else it opens a new tab for the URL
   const urlToOpen    = new URL(pURL, self.location.origin).href
   const promiseChain = clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
         let matchingClient = null;

         for (let i = 0; i < windowClients.length; i++) {
            const windowClient = windowClients[i];
            if (windowClient.url === urlToOpen) {
               matchingClient = windowClient;
               break;
            }
         }

         if (matchingClient) {
            return matchingClient.focus();
         } else {
            return clients.openWindow(urlToOpen);
         }
      });

   pEvent.waitUntil( promiseChain );   
}


