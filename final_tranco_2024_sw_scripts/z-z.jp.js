var CACHE_NAME = 'zz';
var urlsToCache = ['css/top4.css','img/sky.jpg','svg/zzboard.svg','svg/new.svg','svg/sample.svg','svg/manual.svg','svg/more.svg','svg/zzboard_w.svg','svg/zz.svg','svg/accessnetwork_w.svg','js/header_nav.js','svg/badge2.svg','font/zzlogo.woff2'];

self.addEventListener('install',function(event){
event.waitUntil(
caches.open(CACHE_NAME)
.then(function(cache){
console.log('Opened cache');
return cache.addAll(urlsToCache);
})
);
});


self.addEventListener('fetch',function(event){
event.respondWith(
caches.match(event.request)
.then(function(response){
if (response){
return response;
}
return fetch(event.request);
}
)
);
});