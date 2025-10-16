'use strict';
(function () {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

  const {hostname, pathname} = self.location
  const safeFetchHandlers = new WeakMap();
  let currentOnFetch = null;

  const matches = /^\/(apps|a|community|tools)\/[^\/]+/.exec(pathname);
  const proxy = matches && matches[0];
  const hostnameRegex = hostname.replace(/\./g, '\\.');
  const ALLOWLIST = [
    // Allow only specific subroutes within a storefront
    `^https\:\/\/${hostnameRegex}+\/($|collections|products|pages|cart|search|blogs|account|recommendations)`,
    // Allow requests from the app proxy in which the service worker was served
    `^https\:\/\/${hostnameRegex}+${proxy}`,
    // Allow all 3rd party urls
    `^https?\:\/\/(?!${hostnameRegex}).+`,
  ];

  function isAllowlisted(url) {
    return ALLOWLIST.some((str) => {
      const re = new RegExp(str);
      return url.match(re)
    })
  }

  function safeAddEventListener(event, handler, options) {
    if (event !== 'fetch') return originalAddEventListener.call(this, event, handler, options);
    function safeHandler(event) {
      if (!isAllowlisted(event.request.url)) {
        return console.debug(`FETCH EVENT BLOCKED: Cannot execute fetch event handler on following request: ${event.request.url}`)
      }
      return handler.call(this, event);
    }
    safeFetchHandlers.set(handler, safeHandler);
    originalAddEventListener.call(this, event, safeHandler, options);
  };

  function safeRemoveEventListener(event, handler) {
    if (!safeFetchHandlers.has(handler)) return;
    const safeHandler = safeFetchHandlers.get(handler)
    safeFetchHandlers.delete(handler);
    originalRemoveEventListener.call(this, event, safeHandler);
  }

  Object.defineProperty(EventTarget.prototype, 'addEventListener', {
    ...Object.getOwnPropertyDescriptor(EventTarget.prototype, 'addEventListener'),
    value: safeAddEventListener
  });

  Object.defineProperty(EventTarget.prototype, 'removeEventListener', {
    ...Object.getOwnPropertyDescriptor(EventTarget.prototype, 'removeEventListener'),
    value: safeRemoveEventListener
  });

  Object.defineProperty(self, 'onfetch', {
    ...Object.getOwnPropertyDescriptor(self, 'onfetch'),
    get() { return currentOnFetch; },
    set(newOnFetch) {
      if (currentOnFetch !== null) {
        safeRemoveEventListener.call(self, 'fetch', currentOnFetch);
      }
      if (typeof newOnFetch === 'function') {
        safeAddEventListener.call(self, 'fetch', newOnFetch);
      }
      currentOnFetch = newOnFetch;
    },
  });
}());
'use strict';var milliseconds=(new Date()).getTime();var precacheConfig=[['/',milliseconds+'4353454']];var cacheName=milliseconds+'-sw-precache-v5-sw-precache-'+(self.registration?self.registration.scope:'');var ignoreUrlParametersMatching=[/^utm_/];var addDirectoryIndex=function(originalUrl,index){var url=new URL(originalUrl);if(url.pathname.slice(-1)==='/'){url.pathname+=index}
return url.toString()};var cleanResponse=function(originalResponse){if(!originalResponse.redirected){return Promise.resolve(originalResponse)}
var bodyPromise='body' in originalResponse?Promise.resolve(originalResponse.body):originalResponse.blob();return bodyPromise.then(function(body){return new Response(body,{headers:originalResponse.headers,status:originalResponse.status,statusText:originalResponse.statusText})})};var createCacheKey=function(originalUrl,paramName,paramValue,dontCacheBustUrlsMatching){var url=new URL(originalUrl);if(!dontCacheBustUrlsMatching||!(url.pathname.match(dontCacheBustUrlsMatching))){url.search+=(url.search?'&':'')+encodeURIComponent(paramName)+'='+encodeURIComponent(paramValue)}
return url.toString()};var isPathWhitelisted=function(whitelist,absoluteUrlString){if(whitelist.length===0){return!0}
var path=(new URL(absoluteUrlString)).pathname;return whitelist.some(function(whitelistedPathRegex){return path.match(whitelistedPathRegex)})};var stripIgnoredUrlParameters=function(originalUrl,ignoreUrlParametersMatching){var url=new URL(originalUrl);url.search=url.search.slice(1).split('&').map(function(kv){return kv.split('=')}).filter(function(kv){return ignoreUrlParametersMatching.every(function(ignoredRegex){return!ignoredRegex.test(kv[0])})}).map(function(kv){return kv.join('=')}).join('&');return url.toString()};var hashParamName='_sw-precache';var urlsToCacheKeys=new Map(precacheConfig.map(function(item){var relativeUrl=item[0];var hash=item[1];var absoluteUrl=new URL(relativeUrl,self.location);var cacheKey=createCacheKey(absoluteUrl,hashParamName,hash,/.w{8}./);return[absoluteUrl.toString(),cacheKey]}));function setOfCachedUrls(cache){return cache.keys().then(function(requests){return requests.map(function(request){return request.url})}).then(function(urls){return new Set(urls)})}
self.addEventListener('install',function(event){event.waitUntil(caches.open(cacheName).then(function(cache){return setOfCachedUrls(cache).then(function(cachedUrls){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(cacheKey){if(!cachedUrls.has(cacheKey)){var request=new Request(cacheKey,{credentials:'same-origin'});return fetch(request).then(function(response){if(!response.ok){throw new Error('Request for '+cacheKey+' returned a '+'response with status '+response.status)}
return cleanResponse(response).then(function(responseToCache){return cache.put(cacheKey,responseToCache)})})}}))})}).then(function(){return self.skipWaiting()}))});self.addEventListener('activate',function(event){var setOfExpectedUrls=new Set(urlsToCacheKeys.values());event.waitUntil(caches.open(cacheName).then(function(cache){return cache.keys().then(function(existingRequests){return Promise.all(existingRequests.map(function(existingRequest){if(!setOfExpectedUrls.has(existingRequest.url)){return cache.delete(existingRequest)}}))})}).then(function(){return self.clients.claim()}))});function promiseAny(promises){return new Promise((resolve,reject)=>{promises=promises.map(p=>Promise.resolve(p));promises.forEach(p=>p.then(resolve));promises.reduce((a,b)=>a.catch(()=>b)).catch(()=>reject(Error('All failed')))})};self.addEventListener('fetch',function(event){if(event.request.method==='GET'){var shouldRespond;var url=stripIgnoredUrlParameters(event.request.url,ignoreUrlParametersMatching);shouldRespond=urlsToCacheKeys.has(url);var directoryIndex='index.html';if(!shouldRespond&&directoryIndex){url=addDirectoryIndex(url,directoryIndex);shouldRespond=urlsToCacheKeys.has(url)}
var navigateFallback='';if(!shouldRespond&&navigateFallback&&(event.request.mode==='navigate')&&isPathWhitelisted([],event.request.url)){url=new URL(navigateFallback,self.location).toString();shouldRespond=urlsToCacheKeys.has(url)}
if(shouldRespond){event.respondWith(fetch(event.request).catch(function(){caches.open(cacheName).then(function(cache){return cache.match(urlsToCacheKeys.get(url)).then(function(response){if(response){return response}
throw Error('The cached response that was expected is missing.')})})}))}}})