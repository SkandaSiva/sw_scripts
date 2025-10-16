const cacheName="v1";const cacheFiles=[
'./offline.php',
];self.addEventListener('install', function(event){  event.waitUntil(
caches.open(cacheName)
.then(function(cache){cache.addAll(cacheFiles);})
);});async function handleRequest(event){	return fetch(event.request).then(
function(response){			if(response.status==502||response.status==500){return caches.match(event.request).then(function(response2){if(typeof(response2)!="undefined"){return response2;}else{return caches.match("./offline.php");}}).catch(function(error){					return caches.match("./offline.php");});}else{if(response.status==200&&event.request.method=="GET"&&event.request.url.substr(0,4)=='http'&&event.request.url.indexOf('bing')==-1){var resClone=response.clone();caches.open(cacheName).then(function(cache){						cache.put(event.request, resClone);});}
return response;}}).catch(function(error){return caches.match(event.request).then(function(response2){if(typeof(response2)!="undefined"){return response2;}else{return caches.match("./offline.php");}}).catch(function(error){					return caches.match("./offline.php");});});}
self.addEventListener("fetch", event=>{  event.respondWith(handleRequest(event));});