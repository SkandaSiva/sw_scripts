
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');
self.workerConfig = {
urlsToPreCache: '[{"url":"https://www.gall.nl/on/demandware.static/Sites-gall-nl-Site/-/nl_NL/v1731126807532/css/main.css","revision":"v1731126807532"},{"url":"https://www.gall.nl/on/demandware.static/Sites-gall-nl-Site/-/nl_NL/v1731126807532/css/pdp.css","revision":"v1731126807532"},{"url":"https://www.gall.nl/on/demandware.static/Sites-gall-nl-Site/-/nl_NL/v1731126807532/css/checkout.css","revision":"v1731126807532"},{"url":"https://www.gall.nl/on/demandware.static/Sites-gall-nl-Site/-/nl_NL/v1731126807532/js/main.js","revision":"v1731126807532"},{"url":"https://www.gall.nl/on/demandware.static/Sites-gall-nl-Site/-/nl_NL/v1731126807532/js/pdp.js","revision":"v1731126807532"},{"url":"https://www.gall.nl/on/demandware.static/Sites-gall-nl-Site/-/nl_NL/v1731126807532/js/checkout.js","revision":"v1731126807532"}]',
urlsToPrePopulatePlain: '["/on/demandware.store/Sites-gall-nl-Site/nl_NL/Error-Static"]',
excludeURLsContains: '["/login","/Login"]',
runtimeCaches: '[{"cacheName":"jscss-cache","matchRegExp":"^https://www.gall.nl/(\\\\S)+.(?:js|css|png|svg|ico|jpg|woff|gif|woff2|webp)$","strategy":"cacheFirst","expiration":{"maxAgeSeconds":2592000,"maxEntries":60}}]',
cacheKey: 'v1731126807532',
debugMode: false,
offlineURL: '/on/demandware.store/Sites-gall-nl-Site/nl_NL/Error-Static',
prepopulateCacheTime: 2592000,
enableCacheKeyRevision: true
};
importScripts('/on/demandware.static/Sites-gall-nl-Site/-/nl_NL/v1731126807532/js/service-worker.js');undefined