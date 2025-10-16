var connection = function() {
    if (navigator && navigator.connection && /\slow-2g|2g|3g/.test(navigator.connection.effectiveType)) {
            return "slow";
    } else {
        return "fast";
    }
}();
 
 var isMobile = function() {
    var ua = navigator && navigator.userAgent;
    if (/(mobile|nexus 7)/i.test(ua)) { // added nexus
        return true;
    }
    return !(true);
};

if (isMobile()) {
    importScripts('sw.54d373d0.js');
}

if(connection == "fast") {
    importScripts('https://cdn.onesignal.com/sdks/OneSignalSDK.js');
}

self.addEventListener('activate', function(event) { 
    event.waitUntil(caches.keys().then(function(cacheNames) { 
        return Promise.all( cacheNames.map(function(cacheName) { 
            return caches.delete(cacheName); 
        }) ); 
    }) ); 
});
