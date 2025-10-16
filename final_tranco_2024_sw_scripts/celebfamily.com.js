(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports;}
var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports;}
__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.i=function(value){return value;};__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{configurable:false,enumerable:true,get:getter});}};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module['default'];}:function getModuleExports(){return module;};__webpack_require__.d(getter,'a',getter);return getter;};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property);};__webpack_require__.p="/js";return __webpack_require__(__webpack_require__.s=17);})
([(function(module,exports,__webpack_require__){"use strict";var globalOptions=__webpack_require__(1);var idbCacheExpiration=__webpack_require__(8);function debug(message,options){options=options||{};var flag=options.debug||globalOptions.debug;if(flag){console.log('[sw-toolbox] '+message);}}
function openCache(options){var cacheName;if(options&&options.cache){cacheName=options.cache.name;}
cacheName=cacheName||globalOptions.cache.name;return caches.open(cacheName);}
function fetchAndCache(request,options){options=options||{};var successResponses=options.successResponses||globalOptions.successResponses;return fetch(request.clone()).then(function(response){if(request.method==='GET'&&successResponses.test(response.status)){openCache(options).then(function(cache){cache.put(request,response).then(function(){var cacheOptions=options.cache||globalOptions.cache;if((cacheOptions.maxEntries||cacheOptions.maxAgeSeconds)&&cacheOptions.name){queueCacheExpiration(request,cache,cacheOptions);}});});}
return response.clone();});}
var cleanupQueue;function queueCacheExpiration(request,cache,cacheOptions){var cleanup=cleanupCache.bind(null,request,cache,cacheOptions);if(cleanupQueue){cleanupQueue=cleanupQueue.then(cleanup);}else{cleanupQueue=cleanup();}}
function cleanupCache(request,cache,cacheOptions){var requestUrl=request.url;var maxAgeSeconds=cacheOptions.maxAgeSeconds;var maxEntries=cacheOptions.maxEntries;var cacheName=cacheOptions.name;var now=Date.now();debug('Updating LRU order for '+requestUrl+'. Max entries is '+
maxEntries+', max age is '+maxAgeSeconds);return idbCacheExpiration.getDb(cacheName).then(function(db){return idbCacheExpiration.setTimestampForUrl(db,requestUrl,now);}).then(function(db){return idbCacheExpiration.expireEntries(db,maxEntries,maxAgeSeconds,now);}).then(function(urlsToDelete){debug('Successfully updated IDB.');var deletionPromises=urlsToDelete.map(function(urlToDelete){return cache.delete(urlToDelete);});return Promise.all(deletionPromises).then(function(){debug('Done with cache cleanup.');});}).catch(function(error){debug(error);});}
function renameCache(source,destination,options){debug('Renaming cache: ['+source+'] to ['+destination+']',options);return caches.delete(destination).then(function(){return Promise.all([caches.open(source),caches.open(destination)]).then(function(results){var sourceCache=results[0];var destCache=results[1];return sourceCache.keys().then(function(requests){return Promise.all(requests.map(function(request){return sourceCache.match(request).then(function(response){return destCache.put(request,response);});}));}).then(function(){return caches.delete(source);});});});}
function cache(url,options){return openCache(options).then(function(cache){return cache.add(url);});}
function uncache(url,options){return openCache(options).then(function(cache){return cache.delete(url);});}
function precache(items){if(!(items instanceof Promise)){validatePrecacheInput(items);}
globalOptions.preCacheItems=globalOptions.preCacheItems.concat(items);}
function validatePrecacheInput(items){var isValid=Array.isArray(items);if(isValid){items.forEach(function(item){if(!(typeof item==='string'||(item instanceof Request))){isValid=false;}});}
if(!isValid){throw new TypeError('The precache method expects either an array of '+
'strings and/or Requests or a Promise that resolves to an array of '+
'strings and/or Requests.');}
return items;}
function isResponseFresh(response,maxAgeSeconds,now){if(!response){return false;}
if(maxAgeSeconds){var dateHeader=response.headers.get('date');if(dateHeader){var parsedDate=new Date(dateHeader);if((parsedDate.getTime()+(maxAgeSeconds*1000))<now){return false;}}}
return true;}
module.exports={debug:debug,fetchAndCache:fetchAndCache,openCache:openCache,renameCache:renameCache,cache:cache,uncache:uncache,precache:precache,validatePrecacheInput:validatePrecacheInput,isResponseFresh:isResponseFresh};}),(function(module,exports,__webpack_require__){"use strict";var scope;if(self.registration){scope=self.registration.scope;}else{scope=self.scope||new URL('./',self.location).href;}
module.exports={cache:{name:'$$$toolbox-cache$$$'+scope+'$$$',maxAgeSeconds:null,maxEntries:null},debug:false,networkTimeoutSeconds:null,preCacheItems:[],successResponses:/^0|([123]\d\d)|(40[14567])|410$/};}),(function(module,exports,__webpack_require__){"use strict";var Route=__webpack_require__(10);var helpers=__webpack_require__(0);function regexEscape(s){return s.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');}
var keyMatch=function(map,string){var entriesIterator=map.entries();var item=entriesIterator.next();var matches=[];while(!item.done){var pattern=new RegExp(item.value[0]);if(pattern.test(string)){matches.push(item.value[1]);}
item=entriesIterator.next();}
return matches;};var Router=function(){this.routes=new Map();this.routes.set(RegExp,new Map());this.default=null;};['get','post','put','delete','head','any'].forEach(function(method){Router.prototype[method]=function(path,handler,options){return this.add(method,path,handler,options);};});Router.prototype.add=function(method,path,handler,options){options=options||{};var origin;if(path instanceof RegExp){origin=RegExp;}else{origin=options.origin||self.location.origin;if(origin instanceof RegExp){origin=origin.source;}else{origin=regexEscape(origin);}}
method=method.toLowerCase();var route=new Route(method,path,handler,options);if(!this.routes.has(origin)){this.routes.set(origin,new Map());}
var methodMap=this.routes.get(origin);if(!methodMap.has(method)){methodMap.set(method,new Map());}
var routeMap=methodMap.get(method);var regExp=route.regexp||route.fullUrlRegExp;if(routeMap.has(regExp.source)){helpers.debug('"'+path+'" resolves to same regex as existing route.');}
routeMap.set(regExp.source,route);};Router.prototype.matchMethod=function(method,url){var urlObject=new URL(url);var origin=urlObject.origin;var path=urlObject.pathname;return this._match(method,keyMatch(this.routes,origin),path)||this._match(method,[this.routes.get(RegExp)],url);};Router.prototype._match=function(method,methodMaps,pathOrUrl){if(methodMaps.length===0){return null;}
for(var i=0;i<methodMaps.length;i++){var methodMap=methodMaps[i];var routeMap=methodMap&&methodMap.get(method.toLowerCase());if(routeMap){var routes=keyMatch(routeMap,pathOrUrl);if(routes.length>0){return routes[0].makeHandler(pathOrUrl);}}}
return null;};Router.prototype.match=function(request){return this.matchMethod(request.method,request.url)||this.matchMethod('any',request.url);};module.exports=new Router();}),(function(module,exports,__webpack_require__){"use strict";var globalOptions=__webpack_require__(1);var helpers=__webpack_require__(0);function cacheOnly(request,values,options){options=options||{};helpers.debug('Strategy: cache only ['+request.url+']',options);return helpers.openCache(options).then(function(cache){return cache.match(request).then(function(response){var cacheOptions=options.cache||globalOptions.cache;var now=Date.now();if(helpers.isResponseFresh(response,cacheOptions.maxAgeSeconds,now)){return response;}
return undefined;});});}
module.exports=cacheOnly;}),(function(module,exports,__webpack_require__){"use strict";var _swToolbox=__webpack_require__(16);var _swToolbox2=_interopRequireDefault(_swToolbox);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}
self.addEventListener('install',function(event){return event.waitUntil(self.skipWaiting());});self.addEventListener('activate',function(event){return event.waitUntil(self.clients.claim());});_swToolbox2.default.router.get('/js/ads.js',_swToolbox2.default.networkOnly);_swToolbox2.default.router.get('/css/main.css',_swToolbox2.default.networkFirst);_swToolbox2.default.router.get('https://d33wubrfki0l68.cloudfront.net/a978f759fa0230c1e590d1bdb5a1c03ceb538cec/fed6b/fonts/elenawebregular/elenawebregular.woff2',_swToolbox2.default.cacheFirst);_swToolbox2.default.router.get('https://d33wubrfki0l68.cloudfront.net/b324ee03d5048d2d1831100e323b0b6336ffce68/0445e/fonts/mijaregular/mija_regular-webfont.woff2',_swToolbox2.default.cacheFirst);_swToolbox2.default.router.get('https://d33wubrfki0l68.cloudfront.net/8c51ad0e547205de88c325df7b74f43f95b15723/3f3e6/fonts/mijabold/mija_bold-webfont.woff2',_swToolbox2.default.cacheFirst);_swToolbox2.default.router.get('https://d33wubrfki0l68.cloudfront.net/151446eb4ad2f20af89f3132f66d03cc92c856f4/74612/fonts/elenawebregularitalic/elenawebregularitalic.woff2',_swToolbox2.default.cacheFirst);_swToolbox2.default.router.get('https://d33wubrfki0l68.cloudfront.net/a7cc92a2d6ae8ea43370e14b53d2ce89a2b2b5ab/7cca9/fonts/elenawebbold/elenawebbold.woff2',_swToolbox2.default.cacheFirst);_swToolbox2.default.router.get('/(.*)',_swToolbox2.default.cacheFirst,{origin:'https://secure.gravatar.com'});_swToolbox2.default.router.get('/(.*)',_swToolbox2.default.cacheFirst,{origin:'https://d33wubrfki0l68.cloudfront.net'});_swToolbox2.default.router.default=_swToolbox2.default.networkFirst;}),(function(module,exports){module.exports=Array.isArray||function(arr){return Object.prototype.toString.call(arr)=='[object Array]';};}),(function(module,exports,__webpack_require__){var isarray=__webpack_require__(5)
module.exports=pathToRegexp
module.exports.parse=parse
module.exports.compile=compile
module.exports.tokensToFunction=tokensToFunction
module.exports.tokensToRegExp=tokensToRegExp
var PATH_REGEXP=new RegExp(['(\\\\.)','([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'].join('|'),'g')
function parse(str,options){var tokens=[]
var key=0
var index=0
var path=''
var defaultDelimiter=options&&options.delimiter||'/'
var res
while((res=PATH_REGEXP.exec(str))!=null){var m=res[0]
var escaped=res[1]
var offset=res.index
path+=str.slice(index,offset)
index=offset+m.length
if(escaped){path+=escaped[1]
continue}
var next=str[index]
var prefix=res[2]
var name=res[3]
var capture=res[4]
var group=res[5]
var modifier=res[6]
var asterisk=res[7]
if(path){tokens.push(path)
path=''}
var partial=prefix!=null&&next!=null&&next!==prefix
var repeat=modifier==='+'||modifier==='*'
var optional=modifier==='?'||modifier==='*'
var delimiter=res[2]||defaultDelimiter
var pattern=capture||group
tokens.push({name:name||key++,prefix:prefix||'',delimiter:delimiter,optional:optional,repeat:repeat,partial:partial,asterisk:!!asterisk,pattern:pattern?escapeGroup(pattern):(asterisk?'.*':'[^'+escapeString(delimiter)+']+?')})}
if(index<str.length){path+=str.substr(index)}
if(path){tokens.push(path)}
return tokens}
function compile(str,options){return tokensToFunction(parse(str,options))}
function encodeURIComponentPretty(str){return encodeURI(str).replace(/[\/?#]/g,function(c){return '%'+c.charCodeAt(0).toString(16).toUpperCase()})}
function encodeAsterisk(str){return encodeURI(str).replace(/[?#]/g,function(c){return '%'+c.charCodeAt(0).toString(16).toUpperCase()})}
function tokensToFunction(tokens){var matches=new Array(tokens.length)
for(var i=0;i<tokens.length;i++){if(typeof tokens[i]==='object'){matches[i]=new RegExp('^(?:'+tokens[i].pattern+')$')}}
return function(obj,opts){var path=''
var data=obj||{}
var options=opts||{}
var encode=options.pretty?encodeURIComponentPretty:encodeURIComponent
for(var i=0;i<tokens.length;i++){var token=tokens[i]
if(typeof token==='string'){path+=token
continue}
var value=data[token.name]
var segment
if(value==null){if(token.optional){if(token.partial){path+=token.prefix}
continue}else{throw new TypeError('Expected "'+token.name+'" to be defined')}}
if(isarray(value)){if(!token.repeat){throw new TypeError('Expected "'+token.name+'" to not repeat, but received `'+JSON.stringify(value)+'`')}
if(value.length===0){if(token.optional){continue}else{throw new TypeError('Expected "'+token.name+'" to not be empty')}}
for(var j=0;j<value.length;j++){segment=encode(value[j])
if(!matches[i].test(segment)){throw new TypeError('Expected all "'+token.name+'" to match "'+token.pattern+'", but received `'+JSON.stringify(segment)+'`')}
path+=(j===0?token.prefix:token.delimiter)+segment}
continue}
segment=token.asterisk?encodeAsterisk(value):encode(value)
if(!matches[i].test(segment)){throw new TypeError('Expected "'+token.name+'" to match "'+token.pattern+'", but received "'+segment+'"')}
path+=token.prefix+segment}
return path}}
function escapeString(str){return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g,'\\$1')}
function escapeGroup(group){return group.replace(/([=!:$\/()])/g,'\\$1')}
function attachKeys(re,keys){re.keys=keys
return re}
function flags(options){return options.sensitive?'':'i'}
function regexpToRegexp(path,keys){var groups=path.source.match(/\((?!\?)/g)
if(groups){for(var i=0;i<groups.length;i++){keys.push({name:i,prefix:null,delimiter:null,optional:false,repeat:false,partial:false,asterisk:false,pattern:null})}}
return attachKeys(path,keys)}
function arrayToRegexp(path,keys,options){var parts=[]
for(var i=0;i<path.length;i++){parts.push(pathToRegexp(path[i],keys,options).source)}
var regexp=new RegExp('(?:'+parts.join('|')+')',flags(options))
return attachKeys(regexp,keys)}
function stringToRegexp(path,keys,options){return tokensToRegExp(parse(path,options),keys,options)}
function tokensToRegExp(tokens,keys,options){if(!isarray(keys)){options=(keys||options)
keys=[]}
options=options||{}
var strict=options.strict
var end=options.end!==false
var route=''
for(var i=0;i<tokens.length;i++){var token=tokens[i]
if(typeof token==='string'){route+=escapeString(token)}else{var prefix=escapeString(token.prefix)
var capture='(?:'+token.pattern+')'
keys.push(token)
if(token.repeat){capture+='(?:'+prefix+capture+')*'}
if(token.optional){if(!token.partial){capture='(?:'+prefix+'('+capture+'))?'}else{capture=prefix+'('+capture+')?'}}else{capture=prefix+'('+capture+')'}
route+=capture}}
var delimiter=escapeString(options.delimiter||'/')
var endsWithDelimiter=route.slice(-delimiter.length)===delimiter
if(!strict){route=(endsWithDelimiter?route.slice(0,-delimiter.length):route)+'(?:'+delimiter+'(?=$))?'}
if(end){route+='$'}else{route+=strict&&endsWithDelimiter?'':'(?='+delimiter+'|$)'}
return attachKeys(new RegExp('^'+route,flags(options)),keys)}
function pathToRegexp(path,keys,options){if(!isarray(keys)){options=(keys||options)
keys=[]}
options=options||{}
if(path instanceof RegExp){return regexpToRegexp(path,(keys))}
if(isarray(path)){return arrayToRegexp((path),(keys),options)}
return stringToRegexp((path),(keys),options)}}),(function(module,exports){(function(){var nativeAddAll=Cache.prototype.addAll;var userAgent=navigator.userAgent.match(/(Firefox|Chrome)\/(\d+\.)/);if(userAgent){var agent=userAgent[1];var version=parseInt(userAgent[2]);}
if(nativeAddAll&&(!userAgent||(agent==='Firefox'&&version>=46)||(agent==='Chrome'&&version>=50))){return;}
Cache.prototype.addAll=function addAll(requests){var cache=this;function NetworkError(message){this.name='NetworkError';this.code=19;this.message=message;}
NetworkError.prototype=Object.create(Error.prototype);return Promise.resolve().then(function(){if(arguments.length<1)throw new TypeError();var sequence=[];requests=requests.map(function(request){if(request instanceof Request){return request;}
else{return String(request);}});return Promise.all(requests.map(function(request){if(typeof request==='string'){request=new Request(request);}
var scheme=new URL(request.url).protocol;if(scheme!=='http:'&&scheme!=='https:'){throw new NetworkError("Invalid scheme");}
return fetch(request.clone());}));}).then(function(responses){if(responses.some(function(response){return!response.ok;})){throw new NetworkError('Incorrect response status');}
return Promise.all(responses.map(function(response,i){return cache.put(requests[i],response);}));}).then(function(){return undefined;});};Cache.prototype.add=function add(request){return this.addAll([request]);};}());}),(function(module,exports,__webpack_require__){"use strict";var DB_PREFIX='sw-toolbox-';var DB_VERSION=1;var STORE_NAME='store';var URL_PROPERTY='url';var TIMESTAMP_PROPERTY='timestamp';var cacheNameToDbPromise={};function openDb(cacheName){return new Promise(function(resolve,reject){var request=indexedDB.open(DB_PREFIX+cacheName,DB_VERSION);request.onupgradeneeded=function(){var objectStore=request.result.createObjectStore(STORE_NAME,{keyPath:URL_PROPERTY});objectStore.createIndex(TIMESTAMP_PROPERTY,TIMESTAMP_PROPERTY,{unique:false});};request.onsuccess=function(){resolve(request.result);};request.onerror=function(){reject(request.error);};});}
function getDb(cacheName){if(!(cacheName in cacheNameToDbPromise)){cacheNameToDbPromise[cacheName]=openDb(cacheName);}
return cacheNameToDbPromise[cacheName];}
function setTimestampForUrl(db,url,now){return new Promise(function(resolve,reject){var transaction=db.transaction(STORE_NAME,'readwrite');var objectStore=transaction.objectStore(STORE_NAME);objectStore.put({url:url,timestamp:now});transaction.oncomplete=function(){resolve(db);};transaction.onabort=function(){reject(transaction.error);};});}
function expireOldEntries(db,maxAgeSeconds,now){if(!maxAgeSeconds){return Promise.resolve([]);}
return new Promise(function(resolve,reject){var maxAgeMillis=maxAgeSeconds*1000;var urls=[];var transaction=db.transaction(STORE_NAME,'readwrite');var objectStore=transaction.objectStore(STORE_NAME);var index=objectStore.index(TIMESTAMP_PROPERTY);index.openCursor().onsuccess=function(cursorEvent){var cursor=cursorEvent.target.result;if(cursor){if(now-maxAgeMillis>cursor.value[TIMESTAMP_PROPERTY]){var url=cursor.value[URL_PROPERTY];urls.push(url);objectStore.delete(url);cursor.continue();}}};transaction.oncomplete=function(){resolve(urls);};transaction.onabort=reject;});}
function expireExtraEntries(db,maxEntries){if(!maxEntries){return Promise.resolve([]);}
return new Promise(function(resolve,reject){var urls=[];var transaction=db.transaction(STORE_NAME,'readwrite');var objectStore=transaction.objectStore(STORE_NAME);var index=objectStore.index(TIMESTAMP_PROPERTY);var countRequest=index.count();index.count().onsuccess=function(){var initialCount=countRequest.result;if(initialCount>maxEntries){index.openCursor().onsuccess=function(cursorEvent){var cursor=cursorEvent.target.result;if(cursor){var url=cursor.value[URL_PROPERTY];urls.push(url);objectStore.delete(url);if(initialCount-urls.length>maxEntries){cursor.continue();}}};}};transaction.oncomplete=function(){resolve(urls);};transaction.onabort=reject;});}
function expireEntries(db,maxEntries,maxAgeSeconds,now){return expireOldEntries(db,maxAgeSeconds,now).then(function(oldUrls){return expireExtraEntries(db,maxEntries).then(function(extraUrls){return oldUrls.concat(extraUrls);});});}
module.exports={getDb:getDb,setTimestampForUrl:setTimestampForUrl,expireEntries:expireEntries};}),(function(module,exports,__webpack_require__){"use strict";__webpack_require__(7);var helpers=__webpack_require__(0);var router=__webpack_require__(2);var options=__webpack_require__(1);function fetchListener(event){var handler=router.match(event.request);if(handler){event.respondWith(handler(event.request));}else if(router.default&&event.request.method==='GET'&&event.request.url.indexOf('http')===0){event.respondWith(router.default(event.request));}}
function activateListener(event){helpers.debug('activate event fired');var inactiveCache=options.cache.name+'$$$inactive$$$';event.waitUntil(helpers.renameCache(inactiveCache,options.cache.name));}
function flatten(items){return items.reduce(function(a,b){return a.concat(b);},[]);}
function installListener(event){var inactiveCache=options.cache.name+'$$$inactive$$$';helpers.debug('install event fired');helpers.debug('creating cache ['+inactiveCache+']');event.waitUntil(helpers.openCache({cache:{name:inactiveCache}}).then(function(cache){return Promise.all(options.preCacheItems).then(flatten).then(helpers.validatePrecacheInput).then(function(preCacheItems){helpers.debug('preCache list: '+
(preCacheItems.join(', ')||'(none)'));return cache.addAll(preCacheItems);});}));}
module.exports={fetchListener:fetchListener,activateListener:activateListener,installListener:installListener};}),(function(module,exports,__webpack_require__){"use strict";var url=new URL('./',self.location);var basePath=url.pathname;var pathRegexp=__webpack_require__(6);var Route=function(method,path,handler,options){if(path instanceof RegExp){this.fullUrlRegExp=path;}else{if(path.indexOf('/')!==0){path=basePath+path;}
this.keys=[];this.regexp=pathRegexp(path,this.keys);}
this.method=method;this.options=options;this.handler=handler;};Route.prototype.makeHandler=function(url){var values;if(this.regexp){var match=this.regexp.exec(url);values={};this.keys.forEach(function(key,index){values[key.name]=match[index+1];});}
return function(request){return this.handler(request,values,this.options);}.bind(this);};module.exports=Route;}),(function(module,exports,__webpack_require__){"use strict";var globalOptions=__webpack_require__(1);var helpers=__webpack_require__(0);function cacheFirst(request,values,options){options=options||{};helpers.debug('Strategy: cache first ['+request.url+']',options);return helpers.openCache(options).then(function(cache){return cache.match(request).then(function(response){var cacheOptions=options.cache||globalOptions.cache;var now=Date.now();if(helpers.isResponseFresh(response,cacheOptions.maxAgeSeconds,now)){return response;}
return helpers.fetchAndCache(request,options);});});}
module.exports=cacheFirst;}),(function(module,exports,__webpack_require__){"use strict";var helpers=__webpack_require__(0);var cacheOnly=__webpack_require__(3);function fastest(request,values,options){helpers.debug('Strategy: fastest ['+request.url+']',options);return new Promise(function(resolve,reject){var rejected=false;var reasons=[];var maybeReject=function(reason){reasons.push(reason.toString());if(rejected){reject(new Error('Both cache and network failed: "'+
reasons.join('", "')+'"'));}else{rejected=true;}};var maybeResolve=function(result){if(result instanceof Response){resolve(result);}else{maybeReject('No result returned');}};helpers.fetchAndCache(request.clone(),options).then(maybeResolve,maybeReject);cacheOnly(request,values,options).then(maybeResolve,maybeReject);});}
module.exports=fastest;}),(function(module,exports,__webpack_require__){module.exports={networkOnly:__webpack_require__(15),networkFirst:__webpack_require__(14),cacheOnly:__webpack_require__(3),cacheFirst:__webpack_require__(11),fastest:__webpack_require__(12)};}),(function(module,exports,__webpack_require__){"use strict";var globalOptions=__webpack_require__(1);var helpers=__webpack_require__(0);function networkFirst(request,values,options){options=options||{};var successResponses=options.successResponses||globalOptions.successResponses;var networkTimeoutSeconds=options.networkTimeoutSeconds||globalOptions.networkTimeoutSeconds;helpers.debug('Strategy: network first ['+request.url+']',options);return helpers.openCache(options).then(function(cache){var timeoutId;var promises=[];var originalResponse;if(networkTimeoutSeconds){var cacheWhenTimedOutPromise=new Promise(function(resolve){timeoutId=setTimeout(function(){cache.match(request).then(function(response){var cacheOptions=options.cache||globalOptions.cache;var now=Date.now();var maxAgeSeconds=cacheOptions.maxAgeSeconds;if(helpers.isResponseFresh(response,maxAgeSeconds,now)){resolve(response);}});},networkTimeoutSeconds*1000);});promises.push(cacheWhenTimedOutPromise);}
var networkPromise=helpers.fetchAndCache(request,options).then(function(response){if(timeoutId){clearTimeout(timeoutId);}
if(successResponses.test(response.status)){return response;}
helpers.debug('Response was an HTTP error: '+response.statusText,options);originalResponse=response;throw new Error('Bad response');}).catch(function(error){helpers.debug('Network or response error, fallback to cache ['+
request.url+']',options);return cache.match(request).then(function(response){if(response){return response;}
if(originalResponse){return originalResponse;}
throw error;});});promises.push(networkPromise);return Promise.race(promises);});}
module.exports=networkFirst;}),(function(module,exports,__webpack_require__){"use strict";var helpers=__webpack_require__(0);function networkOnly(request,values,options){helpers.debug('Strategy: network only ['+request.url+']',options);return fetch(request);}
module.exports=networkOnly;}),(function(module,exports,__webpack_require__){"use strict";var options=__webpack_require__(1);var router=__webpack_require__(2);var helpers=__webpack_require__(0);var strategies=__webpack_require__(13);var listeners=__webpack_require__(9);helpers.debug('Service Worker Toolbox is loading');self.addEventListener('install',listeners.installListener);self.addEventListener('activate',listeners.activateListener);self.addEventListener('fetch',listeners.fetchListener);module.exports={networkOnly:strategies.networkOnly,networkFirst:strategies.networkFirst,cacheOnly:strategies.cacheOnly,cacheFirst:strategies.cacheFirst,fastest:strategies.fastest,router:router,options:options,cache:helpers.cache,uncache:helpers.uncache,precache:helpers.precache};}),(function(module,exports,__webpack_require__){module.exports=__webpack_require__(4);})]);