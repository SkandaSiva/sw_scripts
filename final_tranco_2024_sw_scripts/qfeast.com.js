self.addEventListener("install",function(event){event.waitUntil(caches.open("QfeastServiceWorkerCache-4").then(function(cache){}))})
self.addEventListener("fetch",function(event){return})