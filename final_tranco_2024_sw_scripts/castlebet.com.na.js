var applicationServerKey ="BDv6uOVlwO6jabgiFa1P96BiNM6m43khYE-IeVRf5ZTdY2bfiClzvemBg-oZRJdgbXxqWoE-FRHF2zsPuf9koy0";
 var url = "https://m.castlebet.com.na/";
var identifier="";

function urlB64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

self.addEventListener("push", function(event) {
  console.log("[Service Worker] Push Received.");
  console.log(
    '[Service Worker] Push had this data: "'.concat(event.data.text(), '"')
  );
 

  console.log("[Service Worker] Processing.");
  var data = {};

  if (event.data) {
    data = event.data.json();
  }
  var tag = data.tag || "Castlebet";
  var title = data.title.replace(/&amp;/g,"&") || "Castlebet";
  var message = data.body.replace(/&amp;/g,"&").replace(/&lt;/g, "<").replace(/&gt;/g, ">") || "Happy betting";
  var icon = data.icon || "/img/misc/cbet.jpg";
  var badge = data.badge || "/img/misc/badge.png";
  var image = data.image || null;
  var actions=data.actions || null;
  var vibrate=data.vibrate || [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500];
  
  var identifier=data.identifier || "78432";
  url = data.url.replace(/&amp;/g,"&");
  if(url==null)
  {url="https://m.castlebet.com.na/";}
  console.log("[Service Worker] "+ url);
  var requireInteraction=data.requireInteraction || true;
  var options = {
    body: message,
    icon: icon,
    badge: badge,
    image:image,
    vibrate: vibrate,
   
   
    requireInteraction: requireInteraction,
   
    tag: tag,
    renotify: true
  };
  if(actions!=null)
	  {
	  options.actions=actions;
	  }
  

  event.waitUntil(self.registration.showNotification(title, options));
  console.log("[Service Worker] reached code end.");
});
self.addEventListener("notificationclick", function(event) {
  console.log("[Service Worker] Notification click Received.");
  console.log("[Service Worker] " + url + event.action );
  event.notification.close();

   if(event.action != "" && event.action!=null) { 
	   console.log("[Service Worker] event "+ JSON.stringify(event)+event.action );
      clients.openWindow(event.action.replace(/&amp;/g,"&")); 
    }
   else if (url != null) {
	  console.log("[Service Worker] url "+url );
    clients.openWindow(url);
       }
   else
	   {
	   clients.openWindow("https://m.castlebet.com.na/");
	   }
  
   
  
  
});
self.addEventListener("pushsubscriptionchange", function(event) {
  console.log("[Service Worker]: 'pushsubscriptionchange' event fired.");
  var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
      .then(function(newSubscription) {
       
        console.log("[Service Worker] New subscription: ", newSubscription);
      })
  );
});

self.addEventListener('install', function(event) {
	  event.waitUntil(self.skipWaiting());
	});
	self.addEventListener('activate', function(event) {
	  event.waitUntil(self.clients.claim());
	});