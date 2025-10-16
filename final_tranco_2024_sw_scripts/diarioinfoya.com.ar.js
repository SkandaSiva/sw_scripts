var vsm={};
importScripts('/lib/web-push/notifications.js');

var swconfig=null,clicked={};



self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));



self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    

    const sendNotification = options => {
        // If is windows 10 and is chrome, send double notification to get the link working on the "action center"
        if (self.navigator &&  self.navigator.userAgent && self.navigator.userAgent.indexOf('Chrome') != -1 && self.navigator.userAgent.indexOf('Windows NT 10') != -1) setTimeout(function(){if (!clicked[options.tag])self.registration.showNotification(options.title, options )},10000);
        idbKeyval.get('swconfig').then(swconfig=>{gaHit(swconfig,options)});
        return self.registration.showNotification(options.title, options );
    };
    
    dbconfig = 'swconfig';
    if (event.data) dbconfig = event.data.text();
    event.waitUntil(
        idbKeyval.get(dbconfig)
        .then(swconfig => fetch(( (swconfig.notificationurl.indexOf('?')==-1) ? swconfig.notificationurl+'?'+Math.random():swconfig.notificationurl+'?'+Math.random()  )  ) )
        .then(response => response.json())
        .then(json => {
                    return idbKeyval.get('notifications').then(DBnotifications => {
                        if (!DBnotifications)DBnotifications={};
                        var notifications = json["notifications"];
                        notified =false;
                        for (var notificationID in notifications ) {
                          if (!DBnotifications["idx"+notificationID]){
                              DBnotifications["idx"+notificationID] = 1;                               
                              idbKeyval.set('notifications',DBnotifications) 
                              notified = sendNotification(notifications[notificationID]); 
                          }
                      }
                      if (!notified) notified = sendNotification(notifications[notificationID])
                      return notified;
                 })
        })  
    );

});

self.addEventListener('notificationclick', function(event) {
  var url = event.notification.data.url;
  clicked[event.notification.tag]=1;
  event.notification.close();    
  event.waitUntil(clients.openWindow(url));
});

const gaHit=(swconfig,options)=>{
    if (!swconfig.googleanalytics) return;
    var trackingId=swconfig.googleanalytics;
    self.registration.pushManager.getSubscription()
        .then(function(subscription) {
            const aPayload = {
                v: 1,
                t:'pageview',
                dl:options.data.url,
                dt:options.title,
                cid: subscription.endpoint,
                tid: trackingId,
                cs: 'Vincolo CMS',
                cm: 'Notification show'
                
            };
            const payload = Object.keys(aPayload).filter(analyticsKey => aPayload[analyticsKey]).map(analyticsKey => analyticsKey + '=' + encodeURIComponent(aPayload[analyticsKey])).join('&');
            fetch('https://www.google-analytics.com/collect', {method: 'post',body: payload});
        });
};

function isSameOrigin(urlString) {
  const urlOrigin = (new URL(urlString)).origin;
  return urlOrigin === self.location.origin;
}


//Offline support
self.addEventListener('fetch', function(event) {
 /*if(!event.request.url.startsWith('http') || !isSameOrigin(event.request.url))  return;
 event.respondWith(async function() {
    try{
      var res = await fetch(event.request);
      var cache = await caches.open('cache');
      cache.put(event.request.url, res.clone());
      return res;
    }
    catch(error){
      if (error.name === 'QuotaExceededError') cache.de
      
      return caches.match(event.request);
     }
   }());*/
});


/*AMP*/
const WorkerMessengerCommand = {
  AMP_SUBSCRIPTION_STATE: 'amp-web-push-subscription-state',
  AMP_SUBSCRIBE: 'amp-web-push-subscribe',
  AMP_UNSUBSCRIBE: 'amp-web-push-unsubscribe',
};

self.addEventListener('message', event => {
  const {command} = event.data;

  switch (command) {
    case WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE:
      onMessageReceivedSubscriptionState();
      break;
    case WorkerMessengerCommand.AMP_SUBSCRIBE:
      onMessageReceivedSubscribe();
      break;
    case WorkerMessengerCommand.AMP_UNSUBSCRIBE:
      onMessageReceivedUnsubscribe();
      break;
  }
});

function onMessageReceivedSubscribe() {
    idbKeyval.get('sw_amp_config')
    .then(sw_amp_config =>{  
      vsm.webpush.subscribe(self.registration,sw_amp_config.ot,sw_amp_config.oid,sw_amp_config.applicationServerKey)
      .then(() => {
        broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIBE, null);
      });


    });
}

function onMessageReceivedSubscriptionState() {
  let retrievedPushSubscription = null;
  self.registration.pushManager
    .getSubscription()
    .then(pushSubscription => {
      retrievedPushSubscription = pushSubscription;
      if (!pushSubscription) {
        return null;
      } else {

        return self.registration.pushManager.permissionState(
          pushSubscription.options
        );
      }
    })
    .then(permissionStateOrNull => {

      if (permissionStateOrNull == null) {
      
        broadcastReply(WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE, false);
      } else {
        const isSubscribed =
          !!retrievedPushSubscription && permissionStateOrNull === 'granted';

        broadcastReply(
          WorkerMessengerCommand.AMP_SUBSCRIPTION_STATE,
          isSubscribed
        );
      }
    });
}

/**
 * Sends a postMessage() to all window frames the service worker controls.
 * @param {string} command
 * @param {!JsonObject} payload
 */
function broadcastReply(command, payload) {
  self.clients.matchAll().then(clients => {
    for (let i = 0; i < clients.length; i++) {
      const client = clients[i];
      client./*OK*/ postMessage({
        command,
        payload,
      });
    }
  });
}