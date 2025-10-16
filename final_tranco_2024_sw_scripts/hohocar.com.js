let dataCacheName='new-data-v1'
let cacheName='first-pwa-app-1'
let filesToCache=['/','/static/favicon.ico','/static/font/iconfont.css','/static/css/main.css','/static/css/Montserrat-Regular.ttf','/static/css/Montserrat-Bold.otf','/static/css/Montserrat-SemiBold.otf','/static/js/fastclick.js','/static/js/lazyload.min.js','/static/js/main.js']
self.addEventListener('install',async e=>{const cache=await caches.open(cacheName);await cache.addAll(filesToCache)
return self.skipWaiting()})
self.addEventListener('activate',async e=>{const keys=await caches.keys();keys.forEach(key=>{if(key!==cacheName&&key!==dataCacheName){caches.delete(key)}})
return self.clients.claim()})
self.addEventListener('fetch',e=>{if(/\/(static)|(uploads)\//.test(e.request.url)){e.respondWith(caches.open(dataCacheName).then(function(cache){return fetch(e.request).then(function(response){cache.put(e.request.url,response.clone())
return response}).catch(function(){return caches.match(e.request)})}))}else{e.respondWith(caches.match(e.request).then(function(response){return response||fetch(e.request)}))}})