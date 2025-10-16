var errorCount=0,errorTimeout=0;self.addEventListener("error",function(e){try{
if(3<=errorCount)return e.preventDefault(),!0;errorCount++,
errorTimeout=errorTimeout||setTimeout(function(){errorCount=errorTimeout=0},3e4)
,fetch("/_/je?m="+encodeURIComponent((e.message+"\n"+e.error.stack).substr(0,800
))+"&l="+e.lineno+"&c="+e.colno+"&u=sw&p=sw"),e.preventDefault()}catch(e){}
return!0});var serviceWorkerVersion=39,waVersion=2,swCacheName="v1",env={
mobile:!!self.navigator.userAgent.match(/Android|Mobile|iPhone|iPad|iPod/)}
;function isClientFocused(){return clients.matchAll({type:"window",
includeUncontrolled:!0}).then(function(e){for(var t=!1,n=0;n<e.length;n++){
var i=e[n];if(i.focused&&"visible"==i.visibilityState){t=!0;break}}return t})}
function notifShow(i){return self.registration.getNotifications().then(function(
e){if(e)for(var t=0;t<e.length;t++)e[t].tag!=i.g&&""!=e[t].tag||e[t].close()
;i.d._t=Math.round((new Date).getTime()/1e3);var n={body:i.m,icon:i.i,
badge:"https://i.quotev.com/q/qb-72.png",tag:i.g,data:i.d,renotify:!0}
;return i.ts&&(n.timestamp=i.ts),self.registration.showNotification(
i.t||"New notifications",n)})}function offlineResponse(e){return e?new Response(
'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,interactive-widget=resizes-content"><title>Quotev</title><script>var onlineTimeout;if (!document.body) window.addEventListener("online", function() { if (onlineTimeout) clearTimeout(onlineTimeout); onlineTimeout = setTimeout(function() { location.reload(); }, 3000); });function ck(id) {id += "=";var c = document.cookie.split(/; ?/);for (var x = 0; x < c.length; x++) {if (c[x].slice(0, id.length) == id) {var v = c[x].slice(id.length);return v;}}}function sl(id) {var c = ck("sl");if (!c) return 0;c = c.split(":");var l = c.length - c.length % 2;for (var x = 0; x < l; x += 2) {if (c[x] == id) {return c[x+1];}}return 0;}var mm = window.matchMedia, d = 0;if (mm) {var m = mm("all and (prefers-color-scheme: dark)");if (m && m.matches) {d=1;}}if (!document.body && (d || sl(1)&(1<<3))) {var s = document.createElement("style");s.innerHTML = "body{background-color:#333;color:#ddd} a{color:#9ba7bd!important}";document.head.insertBefore(s, document.head.firstChild);}<\/script></head><body style="padding:10px;padding-top:80px;font-size:15px;font-family:system-ui, -apple-system, Segoe UI, Roboto, Lucida Grande, Tahoma, Helvetica, sans-serif"><div style="text-align:center;padding:10px"><h3 style="opacity:.7">Problem loading</h3><div style="margin-top:16px;margin-bottom:36px;opacity:0.5">Your internet connection may be unavailable</div><a href="javascript:void(0)" onclick="if(window.reloading)return false;window.reloading=true;location.reload();return false" style="font-weight:bold;text-decoration:none;color:#777">Try again</a></div></body></html>'
,{headers:{"Content-Type":"text/html;charset=utf-8"}}):Response.error()}
self.addEventListener("install",function(e){
"function"==typeof self.skipWaiting&&self.skipWaiting()}),self.addEventListener(
"activate",function(e){
self.clients&&"function"==typeof self.clients.claim&&e.waitUntil(
self.clients.claim()),
self.registration&&self.registration.navigationPreload&&e.waitUntil(
self.registration.navigationPreload.enable())}),self.addEventListener("message",
function(e){
1==e.data.cmd&&serviceWorkerVersion<e.data.v&&self.registration.update()}),
self.addEventListener("push",function(t){var n={body:" ",
icon:"https://i.quotev.com/q/qn144.png",
badge:"https://i.quotev.com/q/qb-72.png",tag:"nn",data:{
u:"https://www.quotev.com/notifications",_t:Math.round((new Date).getTime()/1e3)
},renotify:!0},e=isClientFocused().then(function(e){if(!e){if(t.data)try{
return notifShow(t.data.json())}catch(e){
return self.registration.showNotification("New notifications",n)}e=new Headers
;return e.append("X-Ajax","1"),fetch("/ajax/nbd",{credentials:"include",
headers:e}).then(function(e){return e.json().then(function(e){return notifShow(e
)}).catch(function(e){return self.registration.showNotification(
"New notifications",n)})}).catch(function(e){
return self.registration.showNotification("New notifications",n)})}})
;t.waitUntil(e)}),self.addEventListener("notificationclick",function(e){var c
;setTimeout(function(){e.notification.close()},40),e.notification.data&&(
c=e.notification.data.u),c=c||"https://www.quotev.com/",e.waitUntil(
clients.matchAll({type:"window",includeUncontrolled:!0}).then(function(e){for(
var t,n,i,o,r,a=e.length-1;0<=a;a--)(t=e[a]).focus&&"nested"!=t.frameType&&(
t.url.match(/[?&](hs=1|_slfl)([&#]|$)/)&&(n=t),t.focused&&(o=t),
"visible"==t.visibilityState&&(r=t),0==c.indexOf(t.url)&&(i=t));if(
n?t=n:o?t=o:r?t=r:i&&(t=i),!t||!t.navigate){if(clients.openWindow
)return clients.openWindow(c);if(!t)return}return t.focus().then(function(e){if(
e.navigate)return e.navigate(c)}).catch(function(e){if(clients.openWindow
)return clients.openWindow(c)})}))}),self.addEventListener("fetch",function(e){
var t,n=e.request;n.headers.has("range")||(t="navigate"===n.mode||(
"GET"===n.method||"POST"===n.method)&&n.headers.has("accept")&&-1<n.headers.get(
"accept").indexOf("text/html"),e.respondWith(Promise.resolve(e.preloadResponse
).then(function(e){return e||(n.url&&-1<n.url.indexOf(".quotev.com/wa:"
)?caches.match(n).then(function(e){return void 0!==e?e:fetch(n).catch(function(e
){return offlineResponse(t)})}):fetch(n).catch(function(e){
return offlineResponse(t)}))}).catch(function(){return offlineResponse(t)})))});