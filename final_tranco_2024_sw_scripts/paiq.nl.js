'use strict';if(typeof scriptParsing=='function')scriptParsing('serviceWorker');!function(){var n=function(){return self.registration.pushManager.getSubscription().then(function(t){if(t)return t.endpoint
throw new Error("User not subscribed")})}
self.addEventListener("push",function(t){console.log("SW push event:",t)
t.waitUntil(n().then(function(t){return fetch("/WebPushServer/?endpoint="+encodeURIComponent(t))}).then(function(t){return t.text()}).then(function(t){var n,e
if((t=JSON.parse(t)).discardTag)return self.registration.getNotifications({tag:t.discardTag}).then(function(t){for(var n,e=0,i=t.length;e<i;e++){n=t[e]
console.log("SW closing notification")
n.close()}})
n=null!=(e=t.title)?e:"Paiq";(e=t.payload).tag=null!=(t=t.tag)?t:"paiq"
e.requireInteraction=!0
e.renotify=!0
return self.registration.showNotification(n,e)}))})
self.addEventListener("notificationclick",function(a){console.log("SW notification click: tag ",a.notification.tag)
a.notification.close()
a.waitUntil(clients.matchAll({includeUncontrolled:!0,type:"window"}).then(function(t){for(var n,e,i="https://paiq.nl"+(null!=(e=null!=(e=a.notification.data)?e.url:void 0)?e:""),o=0,r=t.length;o<r;o++)if((n=t[o]).url.startsWith("https://paiq.nl")){n.url.startsWith(i)||n.navigate(i)
return"function"==typeof n.focus?n.focus():void 0}return"function"==typeof clients.openWindow?clients.openWindow(i):void 0}))})
self.addEventListener("activate",function(t){console.log("SW activate")
t.waitUntil(self.skipWaiting())
t.waitUntil(self.clients.claim())
t.waitUntil(caches.open("paiq").then(function(t){return t.addAll(["/d/2/offline.html","/d/2/i/topbar-logo.png"])}))})
self.addEventListener("fetch",function(e){var t
"navigate"===e.request.mode||"get"===e.request.method&&e.request.headers.get("accept").includes("text/html")?e.respondWith(fetch(e.request).catch(function(t){return caches.match("/d/2/offline.html")})):(t=new URL(e.request.url)).origin!==location.origin||!/^\/d\/[0-9]+\//.test(t.pathname)&&!/^\/px\//.test(t.pathname)||e.request.headers.has("range")?e.respondWith(fetch(e.request)):e.respondWith(caches.open("paiq").then(function(n){return n.match(e.request).then(function(t){return t||fetch(e.request).then(function(t){t.ok&&n.put(e.request,t.clone())
return t})})}))})}()
if(typeof scriptReady=='function')scriptReady('serviceWorker');
//# sourceMappingURL=serviceWorker.map