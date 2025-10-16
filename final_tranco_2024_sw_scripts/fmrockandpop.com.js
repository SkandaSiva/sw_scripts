var url='';var wkPwaVersion='v1.0';var staticCacheName='wk-joomla-pwa-static-'+wkPwaVersion;var dynamicCacheName='wk-joomla-pwa-dynamic-'+wkPwaVersion;self.addEventListener('install',function(e){e.waitUntil(self.skipWaiting());});self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(keyList){return Promise.all(keyList.map(function(key){if(key!==staticCacheName&&key!==dynamicCacheName){return caches.delete(key);}}));}));return self.clients.claim();});self.addEventListener('fetch',function(event){if(event.request.method=='POST'){return;}
var requestUrl=new URL(event.request.url);if(requestUrl.pathname=='https://fmrockandpop.com/pwa_sw.js'||(requestUrl.pathname.indexOf('.mp4')>-1)||(requestUrl.pathname.indexOf('.aac')>-1)||(requestUrl.pathname.indexOf('.m3u8')>-1)){return;}
if(event.request.url.indexOf('doubleclick')!==-1){return false;}
if(event.request.url.indexOf('googlesyndication')!==-1){return false;}
if(event.request.url.indexOf('ip-api')!==-1){return false;}
if(event.request.url.indexOf('vi_webp')!==-1){return false;}
if(event.request.url.indexOf('googleadservices')!==-1){return false;}
if(event.request.url.indexOf('twitter')!==-1){return false;}
if(event.request.url.indexOf('facebook')!==-1){return false;}
if(event.request.url.indexOf('analytics')!==-1){return false;}
if(event.request.url.indexOf('google')!==-1){return false;}
if(event.request.url.indexOf('.aac')!==-1){return false;}
if(event.request.url.indexOf('hotjar')!==-1){return false;}
if(event.request.url.indexOf('hotjar')!==-1){return false;}
if(event.request.url.indexOf('lsdeye')!==-1){return false;}
if(event.request.url.indexOf('lsdeye')!==-1){return false;}
event.respondWith(caches.match(event.request).then(function(resp){return fetch(event.request).then(function(response){return caches.open(dynamicCacheName).then(function(cache){if((event.request.url.indexOf('http')===0)){cache.put(event.request,response.clone());}
return response;});}).catch(function(rejectMsg){return resp||function(){};});}).catch(function(){return caches.match('Error');}));});