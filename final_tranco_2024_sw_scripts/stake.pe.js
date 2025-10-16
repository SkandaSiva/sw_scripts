!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},t=(new Error).stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="be85c02f-c8ae-4c77-b513-dc7e736d30c4",e._sentryDebugIdIdentifier="sentry-dbid-be85c02f-c8ae-4c77-b513-dc7e736d30c4")}catch(e){}}();var _global="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};_global.SENTRY_RELEASE={id:"stake@20241120"},(()=>{var e={512:e=>{var t,n,i=e.exports={};function a(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function s(e){if(t===setTimeout)return setTimeout(e,0);if((t===a||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:a}catch(e){t=a}try{n="function"==typeof clearTimeout?clearTimeout:r}catch(e){n=r}}();var o,c=[],l=!1,h=-1;function u(){l&&o&&(l=!1,o.length?c=o.concat(c):h=-1,c.length&&d())}function d(){if(!l){var e=s(u);l=!0;for(var t=c.length;t;){for(o=c,c=[];++h<t;)o&&o[h].run();h=-1,t=c.length}o=null,l=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===r||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{return n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function f(e,t){this.fun=e,this.array=t}function p(){}i.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];c.push(new f(e,t)),1!==c.length||l||s(d)},f.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=p,i.addListener=p,i.once=p,i.off=p,i.removeListener=p,i.removeAllListeners=p,i.emit=p,i.prependListener=p,i.prependOnceListener=p,i.listeners=function(e){return[]},i.binding=function(e){throw new Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw new Error("process.chdir is not supported")},i.umask=function(){return 0}},684:()=>{"use strict";try{self["workbox:cacheable-response:7.0.0"]&&_()}catch(e){}},392:()=>{"use strict";try{self["workbox:core:7.0.0"]&&_()}catch(e){}},832:()=>{"use strict";try{self["workbox:expiration:7.0.0"]&&_()}catch(e){}},328:()=>{"use strict";try{self["workbox:precaching:7.0.0"]&&_()}catch(e){}},128:()=>{"use strict";try{self["workbox:routing:7.0.0"]&&_()}catch(e){}},920:()=>{"use strict";try{self["workbox:strategies:7.0.0"]&&_()}catch(e){}}},t={};function n(i){var a=t[i];if(void 0!==a)return a.exports;var r=t[i]={exports:{}};return e[i](r,r.exports,n),r.exports}n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),(()=>{"use strict";n(392);const e=(e,...t)=>{let n=e;return t.length>0&&(n+=` :: ${JSON.stringify(t)}`),n};class t extends Error{constructor(t,n){super(e(t,n)),this.name=t,this.details=n}}const i=new Set;const a={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},r=e=>[a.prefix,e,a.suffix].filter((e=>e&&e.length>0)).join("-"),s=e=>{(e=>{for(const t of Object.keys(a))e(t)})((t=>{"string"==typeof e[t]&&(a[t]=e[t])}))},o=e=>e||r(a.precache),c=e=>e||r(a.runtime);function l(e,t){const n=new URL(e);for(const e of t)n.searchParams.delete(e);return n.href}let h;function u(e){e.then((()=>{}))}class d{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const f=e=>new URL(String(e),location.href).href.replace(new RegExp(`^${location.origin}`),"");function p(e){return new Promise((t=>setTimeout(t,e)))}function g(e,t){const n=t();return e.waitUntil(n),n}async function m(e,n){let i=null;if(e.url){i=new URL(e.url).origin}if(i!==self.location.origin)throw new t("cross-origin-copy-response",{origin:i});const a=e.clone(),r={headers:new Headers(a.headers),status:a.status,statusText:a.statusText},s=n?n(r):r,o=function(){if(void 0===h){const e=new Response("");if("body"in e)try{new Response(e.body),h=!0}catch(e){h=!1}h=!1}return h}()?a.body:await a.blob();return new Response(o,s)}n(920);function w(e){return"string"==typeof e?new Request(e):e}class y{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new d,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:n}=this;let i=w(e);if("navigate"===i.mode&&n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const a=this.hasCallback("fetchDidFail")?i.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))i=await e({request:i.clone(),event:n})}catch(e){if(e instanceof Error)throw new t("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const r=i.clone();try{let e;e=await fetch(i,"navigate"===i.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:n,request:r,response:e});return e}catch(e){throw a&&await this.runCallbacks("fetchDidFail",{error:e,event:n,originalRequest:a.clone(),request:r.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),n=t.clone();return this.waitUntil(this.cachePut(e,n)),t}async cacheMatch(e){const t=w(e);let n;const{cacheName:i,matchOptions:a}=this._strategy,r=await this.getCacheKey(t,"read"),s=Object.assign(Object.assign({},a),{cacheName:i});n=await caches.match(r,s);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))n=await e({cacheName:i,matchOptions:a,cachedResponse:n,request:r,event:this.event})||void 0;return n}async cachePut(e,n){const a=w(e);await p(0);const r=await this.getCacheKey(a,"write");if(!n)throw new t("cache-put-with-no-response",{url:f(r.url)});const s=await this._ensureResponseSafeToCache(n);if(!s)return!1;const{cacheName:o,matchOptions:c}=this._strategy,h=await self.caches.open(o),u=this.hasCallback("cacheDidUpdate"),d=u?await async function(e,t,n,i){const a=l(t.url,n);if(t.url===a)return e.match(t,i);const r=Object.assign(Object.assign({},i),{ignoreSearch:!0}),s=await e.keys(t,r);for(const t of s)if(a===l(t.url,n))return e.match(t,i)}(h,r.clone(),["__WB_REVISION__"],c):null;try{await h.put(r,u?s.clone():s)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of i)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:o,oldResponse:d,newResponse:s.clone(),request:r,event:this.event});return!0}async getCacheKey(e,t){const n=`${e.url} | ${t}`;if(!this._cacheKeys[n]){let i=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))i=w(await e({mode:t,request:i,event:this.event,params:this.params}));this._cacheKeys[n]=i}return this._cacheKeys[n]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const n of this.iterateCallbacks(e))await n(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const n=this._pluginStateMap.get(t),i=i=>{const a=Object.assign(Object.assign({},i),{state:n});return t[e](a)};yield i}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,n=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,n=!0,!t)break;return n||t&&200!==t.status&&(t=void 0),t}}class b{constructor(e={}){this.cacheName=c(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,n="string"==typeof e.request?new Request(e.request):e.request,i="params"in e?e.params:void 0,a=new y(this,{event:t,request:n,params:i}),r=this._getResponse(a,n,t);return[r,this._awaitComplete(r,a,n,t)]}async _getResponse(e,n,i){let a;await e.runCallbacks("handlerWillStart",{event:i,request:n});try{if(a=await this._handle(n,e),!a||"error"===a.type)throw new t("no-response",{url:n.url})}catch(t){if(t instanceof Error)for(const r of e.iterateCallbacks("handlerDidError"))if(a=await r({error:t,event:i,request:n}),a)break;if(!a)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))a=await t({event:i,request:n,response:a});return a}async _awaitComplete(e,t,n,i){let a,r;try{a=await e}catch(r){}try{await t.runCallbacks("handlerDidRespond",{event:i,request:n,response:a}),await t.doneWaiting()}catch(e){e instanceof Error&&(r=e)}if(await t.runCallbacks("handlerDidComplete",{event:i,request:n,response:a,error:r}),t.destroy(),r)throw r}}n(128);const v=e=>e&&"object"==typeof e?e:{handle:e};class _{constructor(e,t,n="GET"){this.handler=v(t),this.match=e,this.method=n}setCatchHandler(e){this.catchHandler=v(e)}}class C extends _{constructor(e,t,n){super((({url:t})=>{const n=e.exec(t.href);if(n&&(t.origin===location.origin||0===n.index))return n.slice(1)}),t,n)}}class S{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,n=this.handleRequest({request:t,event:e});n&&e.respondWith(n)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data;0;const n=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const n=new Request(...t);return this.handleRequest({request:n,event:e})})));e.waitUntil(n),e.ports&&e.ports[0]&&n.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const n=new URL(e.url,location.href);if(!n.protocol.startsWith("http"))return void 0;const i=n.origin===location.origin,{params:a,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:i,url:n});let s=r&&r.handler;const o=e.method;if(!s&&this._defaultHandlerMap.has(o)&&(s=this._defaultHandlerMap.get(o)),!s)return void 0;let c;try{c=s.handle({url:n,request:e,event:t,params:a})}catch(e){c=Promise.reject(e)}const l=r&&r.catchHandler;return c instanceof Promise&&(this._catchHandler||l)&&(c=c.catch((async i=>{if(l){0;try{return await l.handle({url:n,request:e,event:t,params:a})}catch(e){e instanceof Error&&(i=e)}}if(this._catchHandler)return this._catchHandler.handle({url:n,request:e,event:t});throw i}))),c}findMatchingRoute({url:e,sameOrigin:t,request:n,event:i}){const a=this._routes.get(n.method)||[];for(const r of a){let a;const s=r.match({url:e,sameOrigin:t,request:n,event:i});if(s)return a=s,(Array.isArray(a)&&0===a.length||s.constructor===Object&&0===Object.keys(s).length||"boolean"==typeof s)&&(a=void 0),{route:r,params:a}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,v(e))}setCatchHandler(e){this._catchHandler=v(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const n=this._routes.get(e.method).indexOf(e);if(!(n>-1))throw new t("unregister-route-route-not-registered");this._routes.get(e.method).splice(n,1)}}let E;const I=()=>(E||(E=new S,E.addFetchListener(),E.addCacheListener()),E);function T(e,n,i){let a;if("string"==typeof e){const t=new URL(e,location.href);0;a=new _((({url:e})=>e.href===t.href),n,i)}else if(e instanceof RegExp)a=new C(e,n,i);else if("function"==typeof e)a=new _(e,n,i);else{if(!(e instanceof _))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});a=e}return I().registerRoute(a),a}n(684);class k{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some((t=>e.headers.get(t)===this._headers[t]))),t}}let D,O;const A=new WeakMap,R=new WeakMap,L=new WeakMap,N=new WeakMap,x=new WeakMap;let M={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return R.get(e);if("objectStoreNames"===t)return e.objectStoreNames||L.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return U(e[t])},set:(e,t,n)=>(e[t]=n,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function P(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(O||(O=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(B(this),t),U(A.get(this))}:function(...t){return U(e.apply(B(this),t))}:function(t,...n){const i=e.call(B(this),t,...n);return L.set(i,t.sort?t.sort():[t]),U(i)}}function j(e){return"function"==typeof e?P(e):(e instanceof IDBTransaction&&function(e){if(R.has(e))return;const t=new Promise(((t,n)=>{const i=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",r),e.removeEventListener("abort",r)},a=()=>{t(),i()},r=()=>{n(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",a),e.addEventListener("error",r),e.addEventListener("abort",r)}));R.set(e,t)}(e),t=e,(D||(D=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((e=>t instanceof e))?new Proxy(e,M):e);var t}function U(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,n)=>{const i=()=>{e.removeEventListener("success",a),e.removeEventListener("error",r)},a=()=>{t(U(e.result)),i()},r=()=>{n(e.error),i()};e.addEventListener("success",a),e.addEventListener("error",r)}));return t.then((t=>{t instanceof IDBCursor&&A.set(t,e)})).catch((()=>{})),x.set(t,e),t}(e);if(N.has(e))return N.get(e);const t=j(e);return t!==e&&(N.set(e,t),x.set(t,e)),t}const B=e=>x.get(e);function q(e,t,{blocked:n,upgrade:i,blocking:a,terminated:r}={}){const s=indexedDB.open(e,t),o=U(s);return i&&s.addEventListener("upgradeneeded",(e=>{i(U(s.result),e.oldVersion,e.newVersion,U(s.transaction),e)})),n&&s.addEventListener("blocked",(e=>n(e.oldVersion,e.newVersion,e))),o.then((e=>{r&&e.addEventListener("close",(()=>r())),a&&e.addEventListener("versionchange",(e=>a(e.oldVersion,e.newVersion,e)))})).catch((()=>{})),o}function K(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",(e=>t(e.oldVersion,e))),U(n).then((()=>{}))}const F=["get","getKey","getAll","getAllKeys","count"],H=["put","add","delete","clear"],$=new Map;function W(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if($.get(t))return $.get(t);const n=t.replace(/FromIndex$/,""),i=t!==n,a=H.includes(n);if(!(n in(i?IDBIndex:IDBObjectStore).prototype)||!a&&!F.includes(n))return;const r=async function(e,...t){const r=this.transaction(e,a?"readwrite":"readonly");let s=r.store;return i&&(s=s.index(t.shift())),(await Promise.all([s[n](...t),a&&r.done]))[0]};return $.set(t,r),r}M=(e=>({...e,get:(t,n,i)=>W(t,n)||e.get(t,n,i),has:(t,n)=>!!W(t,n)||e.has(t,n)}))(M);n(832);const V="cache-entries",z=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class G{constructor(e){this._db=null,this._cacheName=e}_upgradeDb(e){const t=e.createObjectStore(V,{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&K(this._cacheName)}async setTimestamp(e,t){const n={url:e=z(e),timestamp:t,cacheName:this._cacheName,id:this._getId(e)},i=(await this.getDb()).transaction(V,"readwrite",{durability:"relaxed"});await i.store.put(n),await i.done}async getTimestamp(e){const t=await this.getDb(),n=await t.get(V,this._getId(e));return null==n?void 0:n.timestamp}async expireEntries(e,t){const n=await this.getDb();let i=await n.transaction(V).store.index("timestamp").openCursor(null,"prev");const a=[];let r=0;for(;i;){const n=i.value;n.cacheName===this._cacheName&&(e&&n.timestamp<e||t&&r>=t?a.push(i.value):r++),i=await i.continue()}const s=[];for(const e of a)await n.delete(V,e.id),s.push(e.url);return s}_getId(e){return this._cacheName+"|"+z(e)}async getDb(){return this._db||(this._db=await q("workbox-expiration",1,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}}class J{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new G(e)}async expireEntries(){if(this._isRunning)return void(this._rerunRequested=!0);this._isRunning=!0;const e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),n=await self.caches.open(this._cacheName);for(const e of t)await n.delete(e,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,u(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(this._maxAgeSeconds){const t=await this._timestampModel.getTimestamp(e),n=Date.now()-1e3*this._maxAgeSeconds;return void 0===t||t<n}return!1}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}var Y=n(512);
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q=function(e){const t=[];let n=0;for(let i=0;i<e.length;i++){let a=e.charCodeAt(i);a<128?t[n++]=a:a<2048?(t[n++]=a>>6|192,t[n++]=63&a|128):55296==(64512&a)&&i+1<e.length&&56320==(64512&e.charCodeAt(i+1))?(a=65536+((1023&a)<<10)+(1023&e.charCodeAt(++i)),t[n++]=a>>18|240,t[n++]=a>>12&63|128,t[n++]=a>>6&63|128,t[n++]=63&a|128):(t[n++]=a>>12|224,t[n++]=a>>6&63|128,t[n++]=63&a|128)}return t},X={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let t=0;t<e.length;t+=3){const a=e[t],r=t+1<e.length,s=r?e[t+1]:0,o=t+2<e.length,c=o?e[t+2]:0,l=a>>2,h=(3&a)<<4|s>>4;let u=(15&s)<<2|c>>6,d=63&c;o||(d=64,r||(u=64)),i.push(n[l],n[h],n[u],n[d])}return i.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Q(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,i=0;for(;n<e.length;){const a=e[n++];if(a<128)t[i++]=String.fromCharCode(a);else if(a>191&&a<224){const r=e[n++];t[i++]=String.fromCharCode((31&a)<<6|63&r)}else if(a>239&&a<365){const r=((7&a)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[i++]=String.fromCharCode(55296+(r>>10)),t[i++]=String.fromCharCode(56320+(1023&r))}else{const r=e[n++],s=e[n++];t[i++]=String.fromCharCode((15&a)<<12|(63&r)<<6|63&s)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let t=0;t<e.length;){const a=n[e.charAt(t++)],r=t<e.length?n[e.charAt(t)]:0;++t;const s=t<e.length?n[e.charAt(t)]:64;++t;const o=t<e.length?n[e.charAt(t)]:64;if(++t,null==a||null==r||null==s||null==o)throw new Z;const c=a<<2|r>>4;if(i.push(c),64!==s){const e=r<<4&240|s>>2;if(i.push(e),64!==o){const e=s<<6&192|o;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const ee=function(e){return function(e){const t=Q(e);return X.encodeByteArray(t,!0)}(e).replace(/\./g,"")},te=function(e){try{return X.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ne=()=>
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n.g)return n.g;throw new Error("Unable to locate global object.")}().__FIREBASE_DEFAULTS__,ie=()=>{try{return ne()||(()=>{if(void 0===Y||void 0===Y.env)return;const e=Y.env.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}const t=e&&te(e[1]);return t&&JSON.parse(t)})()}catch(e){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`)}},ae=()=>{var e;return null===(e=ie())||void 0===e?void 0:e.config};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class re{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch((()=>{})),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function se(){try{return"object"==typeof indexedDB}catch(e){return!1}}function oe(){return new Promise(((e,t)=>{try{let n=!0;const i="validate-browser-context-for-indexeddb-analytics-module",a=self.indexedDB.open(i);a.onsuccess=()=>{a.result.close(),n||self.indexedDB.deleteDatabase(i),e(!0)},a.onupgradeneeded=()=>{n=!1},a.onerror=()=>{var e;t((null===(e=a.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}}))}class ce extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,ce.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,le.prototype.create)}}class le{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,a=this.errors[e],r=a?function(e,t){return e.replace(he,((e,n)=>{const i=t[n];return null!=i?String(i):`<${n}?>`}))}(a,n):"Error",s=`${this.serviceName}: ${r} (${i}).`;return new ce(i,s,n)}}const he=/\{\$([^}]+)}/g;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ue(e,t){if(e===t)return!0;const n=Object.keys(e),i=Object.keys(t);for(const a of n){if(!i.includes(a))return!1;const n=e[a],r=t[a];if(de(n)&&de(r)){if(!ue(n,r))return!1}else if(n!==r)return!1}for(const e of i)if(!n.includes(e))return!1;return!0}function de(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function fe(e){return e&&e._delegate?e._delegate:e}class pe{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new re;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),i=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(i)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(e){if(i)return null;throw e}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:ge})}catch(e){}for(const[e,t]of this.instancesDeferred.entries()){const n=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:n});t.resolve(e)}catch(e){}}}}clearInstance(e=ge){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter((e=>"INTERNAL"in e)).map((e=>e.INTERNAL.delete())),...e.filter((e=>"_delete"in e)).map((e=>e._delete()))])}isComponentSet(){return null!=this.component}isInitialized(e=ge){return this.instances.has(e)}getOptions(e=ge){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[e,t]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(e)&&t.resolve(i)}return i}onInit(e,t){var n;const i=this.normalizeInstanceIdentifier(t),a=null!==(n=this.onInitCallbacks.get(i))&&void 0!==n?n:new Set;a.add(e),this.onInitCallbacks.set(i,a);const r=this.instances.get(i);return r&&e(r,i),()=>{a.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(i=e,i===ge?void 0:i),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(e){}var i;return n||null}normalizeInstanceIdentifier(e=ge){return this.component?this.component.multipleInstances?e:ge:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class we{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new me(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ye=[];var be;!function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"}(be||(be={}));const ve={debug:be.DEBUG,verbose:be.VERBOSE,info:be.INFO,warn:be.WARN,error:be.ERROR,silent:be.SILENT},_e=be.INFO,Ce={[be.DEBUG]:"log",[be.VERBOSE]:"log",[be.INFO]:"info",[be.WARN]:"warn",[be.ERROR]:"error"},Se=(e,t,...n)=>{if(t<e.logLevel)return;const i=(new Date).toISOString(),a=Ce[t];if(!a)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[a](`[${i}]  ${e.name}:`,...n)};
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ee{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map((e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null})).filter((e=>e)).join(" ")}}const Ie="@firebase/app",Te="0.10.5",ke=new class{constructor(e){this.name=e,this._logLevel=_e,this._logHandler=Se,this._userLogHandler=null,ye.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in be))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?ve[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,be.DEBUG,...e),this._logHandler(this,be.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,be.VERBOSE,...e),this._logHandler(this,be.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,be.INFO,...e),this._logHandler(this,be.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,be.WARN,...e),this._logHandler(this,be.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,be.ERROR,...e),this._logHandler(this,be.ERROR,...e)}}("@firebase/app"),De="@firebase/app-compat",Oe="@firebase/analytics-compat",Ae="@firebase/analytics",Re="@firebase/app-check-compat",Le="@firebase/app-check",Ne="@firebase/auth",xe="@firebase/auth-compat",Me="@firebase/database",Pe="@firebase/database-compat",je="@firebase/functions",Ue="@firebase/functions-compat",Be="@firebase/installations",qe="@firebase/installations-compat",Ke="@firebase/messaging",Fe="@firebase/messaging-compat",He="@firebase/performance",$e="@firebase/performance-compat",We="@firebase/remote-config",Ve="@firebase/remote-config-compat",ze="@firebase/storage",Ge="@firebase/storage-compat",Je="@firebase/firestore",Ye="@firebase/vertexai-preview",Qe="@firebase/firestore-compat",Xe="firebase",Ze="[DEFAULT]",et={[Ie]:"fire-core",[De]:"fire-core-compat",[Ae]:"fire-analytics",[Oe]:"fire-analytics-compat",[Le]:"fire-app-check",[Re]:"fire-app-check-compat",[Ne]:"fire-auth",[xe]:"fire-auth-compat",[Me]:"fire-rtdb",[Pe]:"fire-rtdb-compat",[je]:"fire-fn",[Ue]:"fire-fn-compat",[Be]:"fire-iid",[qe]:"fire-iid-compat",[Ke]:"fire-fcm",[Fe]:"fire-fcm-compat",[He]:"fire-perf",[$e]:"fire-perf-compat",[We]:"fire-rc",[Ve]:"fire-rc-compat",[ze]:"fire-gcs",[Ge]:"fire-gcs-compat",[Je]:"fire-fst",[Qe]:"fire-fst-compat",[Ye]:"fire-vertex","fire-js":"fire-js",[Xe]:"fire-js-all"},tt=new Map,nt=new Map,it=new Map;function at(e,t){try{e.container.addComponent(t)}catch(n){ke.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function rt(e){const t=e.name;if(it.has(t))return ke.debug(`There were multiple attempts to register component ${t}.`),!1;it.set(t,e);for(const t of tt.values())at(t,e);for(const t of nt.values())at(t,e);return!0}function st(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ot=new le("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ct{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new pe("app",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ot.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lt(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const i=Object.assign({name:Ze,automaticDataCollectionEnabled:!1},t),a=i.name;if("string"!=typeof a||!a)throw ot.create("bad-app-name",{appName:String(a)});if(n||(n=ae()),!n)throw ot.create("no-options");const r=tt.get(a);if(r){if(ue(n,r.options)&&ue(i,r.config))return r;throw ot.create("duplicate-app",{appName:a})}const s=new we(a);for(const e of it.values())s.addComponent(e);const o=new ct(n,i,s);return tt.set(a,o),o}function ht(e,t,n){var i;let a=null!==(i=et[e])&&void 0!==i?i:e;n&&(a+=`-${n}`);const r=a.match(/\s|\//),s=t.match(/\s|\//);if(r||s){const e=[`Unable to register library "${a}" with version "${t}":`];return r&&e.push(`library name "${a}" contains illegal characters (whitespace or "/")`),r&&s&&e.push("and"),s&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void ke.warn(e.join(" "))}rt(new pe(`${a}-version`,(()=>({library:a,version:t})),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const ut="firebase-heartbeat-store";let dt=null;function ft(){return dt||(dt=q("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(ut)}catch(e){console.warn(e)}}}).catch((e=>{throw ot.create("idb-open",{originalErrorMessage:e.message})}))),dt}async function pt(e,t){try{const n=(await ft()).transaction(ut,"readwrite"),i=n.objectStore(ut);await i.put(t,gt(e)),await n.done}catch(e){if(e instanceof ce)ke.warn(e.message);else{const t=ot.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});ke.warn(t.message)}}}function gt(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new yt(t),this._heartbeatsCachePromise=this._storage.read().then((e=>(this._heartbeatsCache=e,e)))}async triggerHeartbeat(){var e,t;const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=wt();if((null!=(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||(this._heartbeatsCache=await this._heartbeatsCachePromise,null!=(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)))&&this._heartbeatsCache.lastSentHeartbeatDate!==i&&!this._heartbeatsCache.heartbeats.some((e=>e.date===i)))return this._heartbeatsCache.heartbeats.push({date:i,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter((e=>{const t=new Date(e.date).valueOf();return Date.now()-t<=2592e6})),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var e;if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=wt(),{heartbeatsToSend:n,unsentEntries:i}=function(e,t=1024){const n=[];let i=e.slice();for(const a of e){const e=n.find((e=>e.agent===a.agent));if(e){if(e.dates.push(a.date),bt(n)>t){e.dates.pop();break}}else if(n.push({agent:a.agent,dates:[a.date]}),bt(n)>t){n.pop();break}i=i.slice(1)}return{heartbeatsToSend:n,unsentEntries:i}}(this._heartbeatsCache.heartbeats),a=ee(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),a}}function wt(){return(new Date).toISOString().substring(0,10)}class yt{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!se()&&oe().then((()=>!0)).catch((()=>!1))}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await ft()).transaction(ut),n=await t.objectStore(ut).get(gt(e));return await t.done,n}catch(e){if(e instanceof ce)ke.warn(e.message);else{const t=ot.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});ke.warn(t.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return pt(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return pt(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}}function bt(e){return ee(JSON.stringify({version:2,heartbeats:e})).length}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var vt;vt="",rt(new pe("platform-logger",(e=>new Ee(e)),"PRIVATE")),rt(new pe("heartbeat",(e=>new mt(e)),"PRIVATE")),ht(Ie,Te,vt),ht(Ie,Te,"esm2017"),ht("fire-js","");
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
ht("firebase","10.12.2","app");const _t="@firebase/installations",Ct="0.6.7",St=1e4,Et=`w:${Ct}`,It="FIS_v2",Tt=36e5,kt=new le("installations","Installations",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."});function Dt(e){return e instanceof ce&&e.code.includes("request-failed")}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ot({projectId:e}){return`https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`}function At(e){return{token:e.token,requestStatus:2,expiresIn:(t=e.expiresIn,Number(t.replace("s","000"))),creationTime:Date.now()};var t}async function Rt(e,t){const n=(await t.json()).error;return kt.create("request-failed",{requestName:e,serverCode:n.code,serverMessage:n.message,serverStatus:n.status})}function Lt({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function Nt(e,{refreshToken:t}){const n=Lt(e);return n.append("Authorization",function(e){return`${It} ${e}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t)),n}async function xt(e){const t=await e();return t.status>=500&&t.status<600?e():t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Mt(e){return new Promise((t=>{setTimeout(t,e)}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Pt=/^[cdef][\w-]{21}$/;function jt(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const t=function(e){const t=(n=e,btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_"));var n;return t.substr(0,22)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e);return Pt.test(t)?t:""}catch(e){return""}}function Ut(e){return`${e.appName}!${e.appId}`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bt=new Map;function qt(e,t){const n=Ut(e);Kt(n,t),function(e,t){const n=Ht();n&&n.postMessage({key:e,fid:t});$t()}(n,t)}function Kt(e,t){const n=Bt.get(e);if(n)for(const e of n)e(t)}let Ft=null;function Ht(){return!Ft&&"BroadcastChannel"in self&&(Ft=new BroadcastChannel("[Firebase] FID Change"),Ft.onmessage=e=>{Kt(e.data.key,e.data.fid)}),Ft}function $t(){0===Bt.size&&Ft&&(Ft.close(),Ft=null)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wt="firebase-installations-store";let Vt=null;function zt(){return Vt||(Vt=q("firebase-installations-database",1,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(Wt)}})),Vt}async function Gt(e,t){const n=Ut(e),i=(await zt()).transaction(Wt,"readwrite"),a=i.objectStore(Wt),r=await a.get(n);return await a.put(t,n),await i.done,r&&r.fid===t.fid||qt(e,t.fid),t}async function Jt(e){const t=Ut(e),n=(await zt()).transaction(Wt,"readwrite");await n.objectStore(Wt).delete(t),await n.done}async function Yt(e,t){const n=Ut(e),i=(await zt()).transaction(Wt,"readwrite"),a=i.objectStore(Wt),r=await a.get(n),s=t(r);return void 0===s?await a.delete(n):await a.put(s,n),await i.done,!s||r&&r.fid===s.fid||qt(e,s.fid),s}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qt(e){let t;const n=await Yt(e.appConfig,(n=>{const i=function(e){const t=e||{fid:jt(),registrationStatus:0};return en(t)}(n),a=function(e,t){if(0===t.registrationStatus){if(!navigator.onLine){return{installationEntry:t,registrationPromise:Promise.reject(kt.create("app-offline"))}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},i=async function(e,t){try{const n=await async function({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const i=Ot(e),a=Lt(e),r=t.getImmediate({optional:!0});if(r){const e=await r.getHeartbeatsHeader();e&&a.append("x-firebase-client",e)}const s={fid:n,authVersion:It,appId:e.appId,sdkVersion:Et},o={method:"POST",headers:a,body:JSON.stringify(s)},c=await xt((()=>fetch(i,o)));if(c.ok){const e=await c.json();return{fid:e.fid||n,registrationStatus:2,refreshToken:e.refreshToken,authToken:At(e.authToken)}}throw await Rt("Create Installation",c)}(e,t);return Gt(e.appConfig,n)}catch(n){throw Dt(n)&&409===n.customData.serverCode?await Jt(e.appConfig):await Gt(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}(e,n);return{installationEntry:n,registrationPromise:i}}return 1===t.registrationStatus?{installationEntry:t,registrationPromise:Xt(e)}:{installationEntry:t}}(e,i);return t=a.registrationPromise,a.installationEntry}));return""===n.fid?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}async function Xt(e){let t=await Zt(e.appConfig);for(;1===t.registrationStatus;)await Mt(100),t=await Zt(e.appConfig);if(0===t.registrationStatus){const{installationEntry:t,registrationPromise:n}=await Qt(e);return n||t}return t}function Zt(e){return Yt(e,(e=>{if(!e)throw kt.create("installation-not-found");return en(e)}))}function en(e){return 1===(t=e).registrationStatus&&t.registrationTime+St<Date.now()?{fid:e.fid,registrationStatus:0}:e;var t;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}async function tn({appConfig:e,heartbeatServiceProvider:t},n){const i=function(e,{fid:t}){return`${Ot(e)}/${t}/authTokens:generate`}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,n),a=Nt(e,n),r=t.getImmediate({optional:!0});if(r){const e=await r.getHeartbeatsHeader();e&&a.append("x-firebase-client",e)}const s={installation:{sdkVersion:Et,appId:e.appId}},o={method:"POST",headers:a,body:JSON.stringify(s)},c=await xt((()=>fetch(i,o)));if(c.ok){return At(await c.json())}throw await Rt("Generate Auth Token",c)}async function nn(e,t=!1){let n;const i=await Yt(e.appConfig,(i=>{if(!rn(i))throw kt.create("not-registered");const a=i.authToken;if(!t&&function(e){return 2===e.requestStatus&&!function(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+Tt}(e)}(a))return i;if(1===a.requestStatus)return n=async function(e,t){let n=await an(e.appConfig);for(;1===n.authToken.requestStatus;)await Mt(100),n=await an(e.appConfig);const i=n.authToken;return 0===i.requestStatus?nn(e,t):i}(e,t),i;{if(!navigator.onLine)throw kt.create("app-offline");const t=function(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}(i);return n=async function(e,t){try{const n=await tn(e,t),i=Object.assign(Object.assign({},t),{authToken:n});return await Gt(e.appConfig,i),n}catch(n){if(!Dt(n)||401!==n.customData.serverCode&&404!==n.customData.serverCode){const n=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await Gt(e.appConfig,n)}else await Jt(e.appConfig);throw n}}(e,t),t}}));return n?await n:i.authToken}function an(e){return Yt(e,(e=>{if(!rn(e))throw kt.create("not-registered");const t=e.authToken;return 1===(n=t).requestStatus&&n.requestTime+St<Date.now()?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e;var n;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}))}function rn(e){return void 0!==e&&2===e.registrationStatus}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function sn(e,t=!1){const n=e;await async function(e){const{registrationPromise:t}=await Qt(e);t&&await t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n);return(await nn(n,t)).token}function on(e){return kt.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cn="installations",ln=e=>{const t=st(e.getProvider("app").getImmediate(),cn).getImmediate();return{getId:()=>async function(e){const t=e,{installationEntry:n,registrationPromise:i}=await Qt(t);return i?i.catch(console.error):nn(t).catch(console.error),n.fid}(t),getToken:e=>sn(t,e)}};rt(new pe(cn,(e=>{const t=e.getProvider("app").getImmediate(),n=
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e){if(!e||!e.options)throw on("App Configuration");if(!e.name)throw on("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw on(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}(t);return{app:t,appConfig:n,heartbeatServiceProvider:st(t,"heartbeat"),_delete:()=>Promise.resolve()}}),"PUBLIC")),rt(new pe("installations-internal",ln,"PRIVATE")),ht(_t,Ct),ht(_t,Ct,"esm2017");
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const hn="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",un="FCM_MSG";var dn,fn;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function pn(e){const t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function gn(e){const t=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),n=atob(t),i=new Uint8Array(n.length);for(let e=0;e<n.length;++e)i[e]=n.charCodeAt(e);return i}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */!function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"}(dn||(dn={})),function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked"}(fn||(fn={}));const mn="fcm_token_details_db",wn="fcm_token_object_Store";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const yn="firebase-messaging-store";let bn=null;function vn(){return bn||(bn=q("firebase-messaging-database",1,{upgrade:(e,t)=>{if(0===t)e.createObjectStore(yn)}})),bn}async function _n(e){const t=Sn(e),n=await vn(),i=await n.transaction(yn).objectStore(yn).get(t);if(i)return i;{const t=await async function(e){if("databases"in indexedDB){const e=(await indexedDB.databases()).map((e=>e.name));if(!e.includes(mn))return null}let t=null;const n=await q(mn,5,{upgrade:async(n,i,a,r)=>{var s;if(i<2)return;if(!n.objectStoreNames.contains(wn))return;const o=r.objectStore(wn),c=await o.index("fcmSenderId").get(e);if(await o.clear(),c)if(2===i){const e=c;if(!e.auth||!e.p256dh||!e.endpoint)return;t={token:e.fcmToken,createTime:null!==(s=e.createTime)&&void 0!==s?s:Date.now(),subscriptionOptions:{auth:e.auth,p256dh:e.p256dh,endpoint:e.endpoint,swScope:e.swScope,vapidKey:"string"==typeof e.vapidKey?e.vapidKey:pn(e.vapidKey)}}}else if(3===i){const e=c;t={token:e.fcmToken,createTime:e.createTime,subscriptionOptions:{auth:pn(e.auth),p256dh:pn(e.p256dh),endpoint:e.endpoint,swScope:e.swScope,vapidKey:pn(e.vapidKey)}}}else if(4===i){const e=c;t={token:e.fcmToken,createTime:e.createTime,subscriptionOptions:{auth:pn(e.auth),p256dh:pn(e.p256dh),endpoint:e.endpoint,swScope:e.swScope,vapidKey:pn(e.vapidKey)}}}}});return n.close(),await K(mn),await K("fcm_vapid_details_db"),await K("undefined"),function(e){if(!e||!e.subscriptionOptions)return!1;const{subscriptionOptions:t}=e;return"number"==typeof e.createTime&&e.createTime>0&&"string"==typeof e.token&&e.token.length>0&&"string"==typeof t.auth&&t.auth.length>0&&"string"==typeof t.p256dh&&t.p256dh.length>0&&"string"==typeof t.endpoint&&t.endpoint.length>0&&"string"==typeof t.swScope&&t.swScope.length>0&&"string"==typeof t.vapidKey&&t.vapidKey.length>0}(t)?t:null}(e.appConfig.senderId);if(t)return await Cn(e,t),t}}async function Cn(e,t){const n=Sn(e),i=(await vn()).transaction(yn,"readwrite");return await i.objectStore(yn).put(t,n),await i.done,t}function Sn({appConfig:e}){return e.appId}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const En=new le("messaging","Messaging",{"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."});async function In(e,t){const n={method:"DELETE",headers:await kn(e)};try{const i=await fetch(`${Tn(e.appConfig)}/${t}`,n),a=await i.json();if(a.error){const e=a.error.message;throw En.create("token-unsubscribe-failed",{errorInfo:e})}}catch(e){throw En.create("token-unsubscribe-failed",{errorInfo:null==e?void 0:e.toString()})}}function Tn({projectId:e}){return`https://fcmregistrations.googleapis.com/v1/projects/${e}/registrations`}async function kn({appConfig:e,installations:t}){const n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function Dn({p256dh:e,auth:t,endpoint:n,vapidKey:i}){const a={web:{endpoint:n,auth:t,p256dh:e}};return i!==hn&&(a.web.applicationPubKey=i),a}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function On(e){const t=await async function(e,t){const n=await e.pushManager.getSubscription();if(n)return n;return e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:gn(t)})}(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:pn(t.getKey("auth")),p256dh:pn(t.getKey("p256dh"))},i=await _n(e.firebaseDependencies);if(i){if(function(e,t){const n=t.vapidKey===e.vapidKey,i=t.endpoint===e.endpoint,a=t.auth===e.auth,r=t.p256dh===e.p256dh;return n&&i&&a&&r}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(i.subscriptionOptions,n))return Date.now()>=i.createTime+6048e5?async function(e,t){try{const n=await async function(e,t){const n=await kn(e),i=Dn(t.subscriptionOptions),a={method:"PATCH",headers:n,body:JSON.stringify(i)};let r;try{const n=await fetch(`${Tn(e.appConfig)}/${t.token}`,a);r=await n.json()}catch(e){throw En.create("token-update-failed",{errorInfo:null==e?void 0:e.toString()})}if(r.error){const e=r.error.message;throw En.create("token-update-failed",{errorInfo:e})}if(!r.token)throw En.create("token-update-no-token");return r.token}(e.firebaseDependencies,t),i=Object.assign(Object.assign({},t),{token:n,createTime:Date.now()});return await Cn(e.firebaseDependencies,i),n}catch(e){throw e}}(e,{token:i.token,createTime:Date.now(),subscriptionOptions:n}):i.token;try{await In(e.firebaseDependencies,i.token)}catch(e){console.warn(e)}return Rn(e.firebaseDependencies,n)}return Rn(e.firebaseDependencies,n)}async function An(e){const t=await _n(e.firebaseDependencies);t&&(await In(e.firebaseDependencies,t.token),await async function(e){const t=Sn(e),n=(await vn()).transaction(yn,"readwrite");await n.objectStore(yn).delete(t),await n.done}(e.firebaseDependencies));const n=await e.swRegistration.pushManager.getSubscription();return!n||n.unsubscribe()}async function Rn(e,t){const n=
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */await async function(e,t){const n=await kn(e),i=Dn(t),a={method:"POST",headers:n,body:JSON.stringify(i)};let r;try{const t=await fetch(Tn(e.appConfig),a);r=await t.json()}catch(e){throw En.create("token-subscribe-failed",{errorInfo:null==e?void 0:e.toString()})}if(r.error){const e=r.error.message;throw En.create("token-subscribe-failed",{errorInfo:e})}if(!r.token)throw En.create("token-subscribe-no-token");return r.token}(e,t),i={token:n,createTime:Date.now(),subscriptionOptions:t};return await Cn(e,i),i.token}async function Ln(e,t){const n=function(e,t){var n,i;const a={};e.from&&(a.project_number=e.from);e.fcmMessageId&&(a.message_id=e.fcmMessageId);a.instance_id=t,e.notification?a.message_type=dn.DISPLAY_NOTIFICATION.toString():a.message_type=dn.DATA_MESSAGE.toString();a.sdk_platform=3..toString(),a.package_name=self.origin.replace(/(^\w+:|^)\/\//,""),!e.collapse_key||(a.collapse_key=e.collapse_key);a.event=1..toString(),!(null===(n=e.fcmOptions)||void 0===n?void 0:n.analytics_label)||(a.analytics_label=null===(i=e.fcmOptions)||void 0===i?void 0:i.analytics_label);return a}(t,await e.firebaseDependencies.installations.getId());!function(e,t,n){const i={};i.event_time_ms=Math.floor(Date.now()).toString(),i.source_extension_json_proto3=JSON.stringify(t),!n||(i.compliance_data=function(e){const t={privacy_context:{prequest:{origin_associated_product_id:e}}};return t}(n));e.logEvents.push(i)}(e,n,t.productId)}function Nn(e,t){const n=[];for(let i=0;i<e.length;i++)n.push(e.charAt(i)),i<t.length&&n.push(t.charAt(i));return n.join("")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xn(e,t){const n=function({data:e}){if(!e)return null;try{return e.json()}catch(e){return null}}(e);if(!n)return;t.deliveryMetricsExportedToBigQueryEnabled&&await Ln(t,n);const i=await Pn();if(function(e){return e.some((e=>"visible"===e.visibilityState&&!e.url.startsWith("chrome-extension://")))}(i))return function(e,t){t.isFirebaseMessaging=!0,t.messageType=fn.PUSH_RECEIVED;for(const n of e)n.postMessage(t)}(i,n);if(n.notification&&await function(e){var t;const{actions:n}=e,{maxActions:i}=Notification;n&&i&&n.length>i&&console.warn(`This browser only supports ${i} actions. The remaining actions will not be displayed.`);return self.registration.showNotification(null!==(t=e.title)&&void 0!==t?t:"",e)}(function(e){const t=Object.assign({},e.notification);return t.data={[un]:e},t}(n)),t&&t.onBackgroundMessageHandler){const e=function(e){const t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return function(e,t){if(!t.notification)return;e.notification={};const n=t.notification.title;n&&(e.notification.title=n);const i=t.notification.body;i&&(e.notification.body=i);const a=t.notification.image;a&&(e.notification.image=a);const r=t.notification.icon;r&&(e.notification.icon=r)}(t,e),function(e,t){t.data&&(e.data=t.data)}(t,e),function(e,t){var n,i,a,r,s;if(!t.fcmOptions&&!(null===(n=t.notification)||void 0===n?void 0:n.click_action))return;e.fcmOptions={};const o=null!==(a=null===(i=t.fcmOptions)||void 0===i?void 0:i.link)&&void 0!==a?a:null===(r=t.notification)||void 0===r?void 0:r.click_action;o&&(e.fcmOptions.link=o);const c=null===(s=t.fcmOptions)||void 0===s?void 0:s.analytics_label;c&&(e.fcmOptions.analyticsLabel=c)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t,e),t}(n);"function"==typeof t.onBackgroundMessageHandler?await t.onBackgroundMessageHandler(e):t.onBackgroundMessageHandler.next(e)}}async function Mn(e){var t,n;const i=null===(n=null===(t=e.notification)||void 0===t?void 0:t.data)||void 0===n?void 0:n[un];if(!i)return;if(e.action)return;e.stopImmediatePropagation(),e.notification.close();const a=function(e){var t,n,i;const a=null!==(n=null===(t=e.fcmOptions)||void 0===t?void 0:t.link)&&void 0!==n?n:null===(i=e.notification)||void 0===i?void 0:i.click_action;if(a)return a;return r=e.data,"object"==typeof r&&r&&"google.c.a.c_id"in r?self.location.origin:null;var r;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(i);if(!a)return;const r=new URL(a,self.location.href),s=new URL(self.location.origin);if(r.host!==s.host)return;let o=await async function(e){const t=await Pn();for(const n of t){const t=new URL(n.url,self.location.href);if(e.host===t.host)return n}return null}(r);var c;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */return o?o=await o.focus():(o=await self.clients.openWindow(a),await(c=3e3,new Promise((e=>{setTimeout(e,c)})))),o?(i.messageType=fn.NOTIFICATION_CLICKED,i.isFirebaseMessaging=!0,o.postMessage(i)):void 0}function Pn(){return self.clients.matchAll({type:"window",includeUncontrolled:!0})}function jn(e){return En.create("missing-app-config-values",{valueName:e})}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Nn("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o"),Nn("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");class Un{constructor(e,t,n){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const i=function(e){if(!e||!e.options)throw jn("App Configuration Object");if(!e.name)throw jn("App Name");const t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(const e of t)if(!n[e])throw jn(e);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}(e);this.firebaseDependencies={app:e,appConfig:i,installations:t,analyticsProvider:n}}_delete(){return Promise.resolve()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn=e=>{const t=new Un(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return self.addEventListener("push",(e=>{e.waitUntil(xn(e,t))})),self.addEventListener("pushsubscriptionchange",(e=>{e.waitUntil(async function(e,t){var n,i;const{newSubscription:a}=e;if(!a)return void await An(t);const r=await _n(t.firebaseDependencies);await An(t),t.vapidKey=null!==(i=null===(n=null==r?void 0:r.subscriptionOptions)||void 0===n?void 0:n.vapidKey)&&void 0!==i?i:hn,await On(t)}(e,t))})),self.addEventListener("notificationclick",(e=>{e.waitUntil(Mn(e))})),t};rt(new pe("messaging-sw",Bn,"PUBLIC"));n(328);function qn(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:n,url:i}=e;if(!i)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!n){const e=new URL(i,location.href);return{cacheKey:e.href,url:e.href}}const a=new URL(i,location.href),r=new URL(i,location.href);return a.searchParams.set("__WB_REVISION__",n),{cacheKey:a.href,url:r.href}}class Kn{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:n})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;n?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return n}}}class Fn{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const n=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return n?new Request(n,{headers:e.headers}):e},this._precacheController=e}}class Hn extends b{constructor(e={}){e.cacheName=o(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(Hn.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const n=await t.cacheMatch(e);return n||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,n){let i;const a=n.params||{};if(!this._fallbackToNetwork)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{0;const t=a.integrity,r=e.integrity,s=!r||r===t;if(i=await n.fetch(new Request(e,{integrity:"no-cors"!==e.mode?r||t:void 0})),t&&s&&"no-cors"!==e.mode){this._useDefaultCacheabilityPluginIfNeeded();await n.cachePut(e,i.clone());0}}return i}async _handleInstall(e,n){this._useDefaultCacheabilityPluginIfNeeded();const i=await n.fetch(e);if(!await n.cachePut(e,i.clone()))throw new t("bad-precaching-response",{url:e.url,status:i.status});return i}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[n,i]of this.plugins.entries())i!==Hn.copyRedirectedCacheableResponsesPlugin&&(i===Hn.defaultPrecacheCacheabilityPlugin&&(e=n),i.cacheWillUpdate&&t++);0===t?this.plugins.push(Hn.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}Hn.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},Hn.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await m(e):e};class $n{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:n=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new Hn({cacheName:o(e),plugins:[...t,new Fn({precacheController:this})],fallbackToNetwork:n}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const n=[];for(const i of e){"string"==typeof i?n.push(i):i&&void 0===i.revision&&n.push(i.url);const{cacheKey:e,url:a}=qn(i),r="string"!=typeof i&&i.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:e});if("string"!=typeof i&&i.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==i.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(e,i.integrity)}if(this._urlsToCacheKeys.set(a,e),this._urlsToCacheModes.set(a,r),n.length>0){const e=`Workbox is precaching URLs without revision info: ${n.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return g(e,(async()=>{const t=new Kn;this.strategy.plugins.push(t);for(const[t,n]of this._urlsToCacheKeys){const i=this._cacheKeysToIntegrities.get(n),a=this._urlsToCacheModes.get(t),r=new Request(t,{integrity:i,cache:a,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:n},request:r,event:e}))}const{updatedURLs:n,notUpdatedURLs:i}=t;return{updatedURLs:n,notUpdatedURLs:i}}))}activate(e){return g(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),n=new Set(this._urlsToCacheKeys.values()),i=[];for(const a of t)n.has(a.url)||(await e.delete(a),i.push(a.url));return{deletedURLs:i}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,n=this.getCacheKeyForURL(t);if(n){return(await self.caches.open(this.strategy.cacheName)).match(n)}}createHandlerBoundToURL(e){const n=this.getCacheKeyForURL(e);if(!n)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=Object.assign({cacheKey:n},t.params),this.strategy.handle(t))}}let Wn;const Vn=()=>(Wn||(Wn=new $n),Wn);class zn extends _{constructor(e,t){super((({request:n})=>{const i=e.getURLsToCacheKeys();for(const a of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:n="index.html",cleanURLs:i=!0,urlManipulation:a}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const s=function(e,t=[]){for(const n of[...e.searchParams.keys()])t.some((e=>e.test(n)))&&e.searchParams.delete(n);return e}(r,t);if(yield s.href,n&&s.pathname.endsWith("/")){const e=new URL(s.href);e.pathname+=n,yield e.href}if(i){const e=new URL(s.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:r});for(const t of e)yield t.href}}(n.url,t)){const t=i.get(a);if(t){return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}}),e.strategy)}}var Gn,Jn=function(e,t,n,i){return new(n||(n=Promise))((function(a,r){function s(e){try{c(i.next(e))}catch(e){r(e)}}function o(e){try{c(i.throw(e))}catch(e){r(e)}}function c(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}c((i=i.apply(e,t||[])).next())}))};self.__WB_DISABLE_DEV_LOGS=!0;const Yn=[{'revision':null,'url':'assets/1020.2600cf5d0199bac55bf7.chunk.js'},{'revision':'e198e9bb5a7ecf0c7570a7c48668132d','url':'assets/1020.2600cf5d0199bac55bf7.chunk.js.map'},{'revision':null,'url':'assets/1288.70b9b1bd9e73e3db5ea5.chunk.js'},{'revision':'025112cc6541ff3da962ebc407e047f9','url':'assets/1288.70b9b1bd9e73e3db5ea5.chunk.js.map'},{'revision':null,'url':'assets/152.8076c3d492433fd61fe4.chunk.js'},{'revision':'7da934c25750a167d27bb720752c881f','url':'assets/152.8076c3d492433fd61fe4.chunk.js.map'},{'revision':null,'url':'assets/1660.73a6af3ccbf4cc3b717a.chunk.js'},{'revision':'35dad48f15d640f704743528be3454b5','url':'assets/1660.73a6af3ccbf4cc3b717a.chunk.js.map'},{'revision':null,'url':'assets/1684.d2f8384fff350aae965b.chunk.js'},{'revision':'3250a6b5c4f0be232b9e437c935c525a','url':'assets/1684.d2f8384fff350aae965b.chunk.js.map'},{'revision':null,'url':'assets/1692.789798a6ff50f8bc4aa0.chunk.js'},{'revision':'452d16067b71ed0983339597c4d12021','url':'assets/1692.789798a6ff50f8bc4aa0.chunk.js.map'},{'revision':null,'url':'assets/1744.a561d1e888265e169190.chunk.js'},{'revision':'ac388293e29331c2a337831ca8e43748','url':'assets/1744.a561d1e888265e169190.chunk.js.map'},{'revision':null,'url':'assets/184.2a64e4c7a16df151f189.chunk.js'},{'revision':'63784f6193cb72439e8a0b86eb91c6dc','url':'assets/184.2a64e4c7a16df151f189.chunk.js.map'},{'revision':null,'url':'assets/1942.53e7c96c81e5b7227447.chunk.js'},{'revision':'2576d99e2e3fc3a32a91bc4958b8c1b2','url':'assets/1942.53e7c96c81e5b7227447.chunk.js.map'},{'revision':null,'url':'assets/2192.3ad98914f7038d2a437e.chunk.js'},{'revision':'461b767477886b7cc9005f1199d0be02','url':'assets/2192.3ad98914f7038d2a437e.chunk.js.map'},{'revision':null,'url':'assets/2216.192ec8637f40a77cfc94.chunk.js'},{'revision':'f962fe43c4b64295a43ce74b89f9474e','url':'assets/2216.192ec8637f40a77cfc94.chunk.js.map'},{'revision':null,'url':'assets/2288.278c3673448a0dbc1953.chunk.js'},{'revision':'c5454a53ef5f3561bab757bf000569e0','url':'assets/2288.278c3673448a0dbc1953.chunk.js.map'},{'revision':null,'url':'assets/2292.b90a1b9ebb80e38a6977.chunk.js'},{'revision':'a82ef7c5b16ea3e8fc36c7bb377728e3','url':'assets/2292.b90a1b9ebb80e38a6977.chunk.js.map'},{'revision':null,'url':'assets/2376.b47890da973f0d28f6e1.chunk.js'},{'revision':'3bc10e75a8adc509b5728954d6822393','url':'assets/2376.b47890da973f0d28f6e1.chunk.js.map'},{'revision':null,'url':'assets/2444.4bacb0cf5492dd28d05a.chunk.js'},{'revision':'4e11d14d0738c7ae67b775847c87b431','url':'assets/2444.4bacb0cf5492dd28d05a.chunk.js.map'},{'revision':null,'url':'assets/248.6ac6ee6b9a643695246c.chunk.js'},{'revision':'d9d4979f0dc222318e78e1a01e31ed2e','url':'assets/248.6ac6ee6b9a643695246c.chunk.js.map'},{'revision':null,'url':'assets/2484.ba385e8341f0168aca7f.chunk.js'},{'revision':'ed78a2eedd40ffcce50f8ed113523b87','url':'assets/2484.ba385e8341f0168aca7f.chunk.js.map'},{'revision':null,'url':'assets/2508.bb4e36133682ea778414.chunk.js'},{'revision':'ca188c5bc98a95ec9759ea993951f3fb','url':'assets/2508.bb4e36133682ea778414.chunk.js.map'},{'revision':null,'url':'assets/2524.2fc6249bfa2954390d54.chunk.js'},{'revision':'19e4a52074a2ea0d61704f987763108d','url':'assets/2524.2fc6249bfa2954390d54.chunk.js.map'},{'revision':null,'url':'assets/2532.97278c3a45553f9ac0af.chunk.js'},{'revision':'369f7d7203ad15a1b8ed83cbeb8cd29d','url':'assets/2532.97278c3a45553f9ac0af.chunk.js.map'},{'revision':null,'url':'assets/268.912d9ad4431ba6c05460.chunk.js'},{'revision':'8ee2f843e1c6ea92384e2d27ddd77d6e','url':'assets/268.912d9ad4431ba6c05460.chunk.js.map'},{'revision':null,'url':'assets/2680.9eac73bf8169725ffbd2.chunk.js'},{'revision':'f037310c38b96883afc96148a9db5800','url':'assets/2680.9eac73bf8169725ffbd2.chunk.js.map'},{'revision':null,'url':'assets/2752.cb3f5ce89bb7533740a3.chunk.js'},{'revision':'2a05321166e30cc44ea875bb128588b2','url':'assets/2752.cb3f5ce89bb7533740a3.chunk.js.map'},{'revision':null,'url':'assets/2864.0fb992e23c9317502cbd.chunk.js'},{'revision':'528ea863ba9c98a9e9c4bd19bd172ea9','url':'assets/2864.0fb992e23c9317502cbd.chunk.js.map'},{'revision':null,'url':'assets/2924.7491c2a300fb33cd8d13.chunk.js'},{'revision':'78a2cf3eadc9dcef5999d5b512783397','url':'assets/2924.7491c2a300fb33cd8d13.chunk.js.map'},{'revision':null,'url':'assets/2928.9019c92a6ef0787da2a6.chunk.js'},{'revision':'52fa3b5dcd9d40199d9e041b981bfa91','url':'assets/2928.9019c92a6ef0787da2a6.chunk.js.map'},{'revision':null,'url':'assets/3064.1ed720bf287f033eb1f0.chunk.js'},{'revision':'a512d8719fa3dc2525209201dbddfc89','url':'assets/3064.1ed720bf287f033eb1f0.chunk.js.map'},{'revision':null,'url':'assets/3116.1b5887dc239e14457602.chunk.js'},{'revision':'9ebf473fe89c211393ae1f5ec147e8e5','url':'assets/3116.1b5887dc239e14457602.chunk.js.map'},{'revision':null,'url':'assets/3192.dc571497008331cc159f.chunk.js'},{'revision':'71b44771e4f920d8f37d1e42b01bd4f7','url':'assets/3192.dc571497008331cc159f.chunk.js.map'},{'revision':null,'url':'assets/3204.cc5dbd313f06d643e1b7.chunk.js'},{'revision':'986de6b4f5d152f460bcc7015e8a5bf5','url':'assets/3204.cc5dbd313f06d643e1b7.chunk.js.map'},{'revision':null,'url':'assets/3224.fa64eb574ae00044840c.chunk.js'},{'revision':'8ebcc9c279cdc196a0a5e35209e8d550','url':'assets/3224.fa64eb574ae00044840c.chunk.js.map'},{'revision':null,'url':'assets/3272.1abc925542829fe9eebc.chunk.js'},{'revision':'e0765edf5f870f4436cc5f8b4b675f8e','url':'assets/3272.1abc925542829fe9eebc.chunk.js.map'},{'revision':null,'url':'assets/3332.d41becc2b33a06c1487b.chunk.js'},{'revision':'1b52828a435faa005254aa939e7ce842','url':'assets/3332.d41becc2b33a06c1487b.chunk.js.map'},{'revision':null,'url':'assets/3380.1874e33af6fe17f6246e.chunk.js'},{'revision':'b45ad2a086919c9cee8cf7e9cf52b4bd','url':'assets/3380.1874e33af6fe17f6246e.chunk.js.map'},{'revision':null,'url':'assets/3396.5e40093ced01a67dcf00.chunk.js'},{'revision':'ffb9b56c81dbd73cfffe4dd0141ba462','url':'assets/3396.5e40093ced01a67dcf00.chunk.js.map'},{'revision':null,'url':'assets/3400.d0ca8547e5096c5c79b5.chunk.js'},{'revision':'e5b2602694d9ce1a59e9f3761b2a0920','url':'assets/3400.d0ca8547e5096c5c79b5.chunk.js.map'},{'revision':null,'url':'assets/344.650f49871cba2df2406d.chunk.js'},{'revision':'e728b370560b99e71f45305717e51114','url':'assets/344.650f49871cba2df2406d.chunk.js.map'},{'revision':null,'url':'assets/3456.e484dbf3a84439ea4b1c.chunk.js'},{'revision':'c4812d75538907c4f940445a2603ab57','url':'assets/3456.e484dbf3a84439ea4b1c.chunk.js.map'},{'revision':null,'url':'assets/3472.45d280446e66aec99689.chunk.js'},{'revision':'5576af19d83c33e454e5143df4dd8b47','url':'assets/3472.45d280446e66aec99689.chunk.js.map'},{'revision':null,'url':'assets/348.4d7fd768d5d0d05aafe5.chunk.js'},{'revision':'e6bcec5c25033a684155849f4f8174b4','url':'assets/348.4d7fd768d5d0d05aafe5.chunk.js.map'},{'revision':null,'url':'assets/3692.e07615b5812ea37dd18e.chunk.js'},{'revision':'f96e01e4369aec1530f9e2c5b06d3d49','url':'assets/3692.e07615b5812ea37dd18e.chunk.js.map'},{'revision':null,'url':'assets/3706.79aab7bda8edbaf377cc.chunk.js'},{'revision':'1042712ebd9f1915c66d97be457c6587','url':'assets/3706.79aab7bda8edbaf377cc.chunk.js.map'},{'revision':null,'url':'assets/3848.2fefd0792f23d0399173.chunk.js'},{'revision':'89a994e451148105d5a73b8730a71ff6','url':'assets/3848.2fefd0792f23d0399173.chunk.js.map'},{'revision':null,'url':'assets/3852.9d6cc6edda4130fc8adb.chunk.js'},{'revision':'0d247cc08f369948d7db625d5eaa69a0','url':'assets/3852.9d6cc6edda4130fc8adb.chunk.js.map'},{'revision':null,'url':'assets/3936.e405dff32673894f1fce.chunk.js'},{'revision':'ba25cdb7b6862e39c8ad50896b541e47','url':'assets/3936.e405dff32673894f1fce.chunk.js.map'},{'revision':null,'url':'assets/4020.90d591fe9c0fea972b93.chunk.js'},{'revision':'0e5df7bc1c90e70443d9792c604f8987','url':'assets/4020.90d591fe9c0fea972b93.chunk.js.map'},{'revision':null,'url':'assets/408.942de55bbc09debb091f.chunk.js'},{'revision':'5303c92e270034efc51781a36c88917f','url':'assets/408.942de55bbc09debb091f.chunk.js.map'},{'revision':null,'url':'assets/4196.51c2836006ce17a8398d.chunk.js'},{'revision':'697174b31018ccb782ec661cce26d485','url':'assets/4196.51c2836006ce17a8398d.chunk.js.map'},{'revision':null,'url':'assets/4456.5e1b8c93b9e0f0ff1ac7.chunk.js'},{'revision':'3b3a6cff777f4650282b7e900c221c96','url':'assets/4456.5e1b8c93b9e0f0ff1ac7.chunk.js.map'},{'revision':null,'url':'assets/448.543f1c321545867575df.chunk.js'},{'revision':'02e5770c921d136ac9e06f9e2dfd9d52','url':'assets/448.543f1c321545867575df.chunk.js.map'},{'revision':null,'url':'assets/4480.1479a26b52942b793631.chunk.js'},{'revision':'140b9567d59ed91a04f5749bf408bdd3','url':'assets/4480.1479a26b52942b793631.chunk.js.map'},{'revision':null,'url':'assets/4672.569a33eb8cc474a1c9b6.chunk.js'},{'revision':'bd607d02a93f8c03452edf43ee094988','url':'assets/4672.569a33eb8cc474a1c9b6.chunk.js.map'},{'revision':null,'url':'assets/4792.ede5c045afb0d7d6e85c.chunk.js'},{'revision':'a117eb2d2b556f36a67867fafb2a9226','url':'assets/4792.ede5c045afb0d7d6e85c.chunk.js.map'},{'revision':null,'url':'assets/4904.255b3b0f16c0b3fff787.chunk.js'},{'revision':'e85002918de6fb5f550cb9d0bd73adbc','url':'assets/4904.255b3b0f16c0b3fff787.chunk.js.map'},{'revision':null,'url':'assets/4912.d75a0fd4eab9947994ae.chunk.js'},{'revision':'2ddea5ee51ba8f95fde94ff5b6c3ab21','url':'assets/4912.d75a0fd4eab9947994ae.chunk.js.map'},{'revision':null,'url':'assets/5060.749db1826c3f30faf77a.chunk.js'},{'revision':'58d4442d62cf4fd9f163600af0d9d270','url':'assets/5060.749db1826c3f30faf77a.chunk.js.map'},{'revision':null,'url':'assets/5344.fb0a1bb03a2e9a7cb09c.chunk.js'},{'revision':'f1ec3d4e0427ce7bea3d9c080e66e4ed','url':'assets/5344.fb0a1bb03a2e9a7cb09c.chunk.js.map'},{'revision':null,'url':'assets/5368.3003a13e6c163c5710a6.chunk.js'},{'revision':'191ce7af6bb8a014d6e89f3d0f25ada2','url':'assets/5368.3003a13e6c163c5710a6.chunk.js.map'},{'revision':null,'url':'assets/5376.36ef673ed07bf0ac42c0.chunk.js'},{'revision':'cae41e427502970d3c6926a32dc63fc5','url':'assets/5376.36ef673ed07bf0ac42c0.chunk.js.map'},{'revision':null,'url':'assets/5380.ff9e68f1c01f9390dfb2.chunk.js'},{'revision':'3827cdb2366ffe970a3063773464a617','url':'assets/5380.ff9e68f1c01f9390dfb2.chunk.js.map'},{'revision':null,'url':'assets/5432.73c073ac27d7d4680cfb.chunk.js'},{'revision':'b473830b3f31dfc1a4aa5bedb70f2064','url':'assets/5432.73c073ac27d7d4680cfb.chunk.js.map'},{'revision':null,'url':'assets/5476.609115510b45dcfcc859.chunk.js'},{'revision':'8d537c2793153d109f8dc220c0f98437','url':'assets/5476.609115510b45dcfcc859.chunk.js.map'},{'revision':null,'url':'assets/5520.6d039e176b82b5f98864.chunk.js'},{'revision':'55582f731398bb54384dfc779079820a','url':'assets/5520.6d039e176b82b5f98864.chunk.js.map'},{'revision':null,'url':'assets/5600.2341562e5c7e0e4313ee.chunk.js'},{'revision':'4083752841618828efb540ed22716263','url':'assets/5600.2341562e5c7e0e4313ee.chunk.js.map'},{'revision':null,'url':'assets/5604.72acc067b75d39348cc8.chunk.css'},{'revision':'f968fe6dbf88ca3820c838b8acd46ad7','url':'assets/5604.72acc067b75d39348cc8.chunk.css.map'},{'revision':null,'url':'assets/5604.72acc067b75d39348cc8.chunk.js'},{'revision':'9422b509a905111ae2a8c9b18bb9df2e','url':'assets/5604.72acc067b75d39348cc8.chunk.js.map'},{'revision':null,'url':'assets/5696.ec6fb5548895038787f0.chunk.js'},{'revision':'9d6765b014cea7d1ddd255fc0dd655ae','url':'assets/5696.ec6fb5548895038787f0.chunk.js.map'},{'revision':null,'url':'assets/572.4c7ef97c136c19d0072a.chunk.js'},{'revision':'3231c13e1e034f3aee7c35d63bfd587a','url':'assets/572.4c7ef97c136c19d0072a.chunk.js.map'},{'revision':null,'url':'assets/5792.e204fce06319d5457ea2.chunk.js'},{'revision':'d0b266a37e2671162fd3c330c5304ec0','url':'assets/5792.e204fce06319d5457ea2.chunk.js.map'},{'revision':null,'url':'assets/5794.4d6bc192e79508dc6f37.chunk.js'},{'revision':'a9946046faceaad3ecba0beb479a655a','url':'assets/5794.4d6bc192e79508dc6f37.chunk.js.map'},{'revision':null,'url':'assets/5820.bb6af02c53c5fa943a67.chunk.js'},{'revision':'bb176ca83447d8e08a91baf121881d64','url':'assets/5820.bb6af02c53c5fa943a67.chunk.js.map'},{'revision':null,'url':'assets/5856.444253a6b38265010ef6.chunk.js'},{'revision':'05eef99ed280329ced92b0cffa91dc95','url':'assets/5856.444253a6b38265010ef6.chunk.js.map'},{'revision':null,'url':'assets/5972.c2082a432c938083d7f4.chunk.js'},{'revision':'cfd890be939dd4b886c75eb1c1bbdf03','url':'assets/5972.c2082a432c938083d7f4.chunk.js.map'},{'revision':null,'url':'assets/5996.3b508da453eba9744e1d.chunk.js'},{'revision':'6472a7b9762401aa66368c8fdb0e8ec5','url':'assets/5996.3b508da453eba9744e1d.chunk.js.map'},{'revision':null,'url':'assets/6194.550eff2d6874f8a6ee5d.chunk.js'},{'revision':'c242a46350ba9892d4a37a9f35433cd4','url':'assets/6194.550eff2d6874f8a6ee5d.chunk.js.map'},{'revision':null,'url':'assets/6312.8b6d03e7ba568e36a0f9.chunk.js'},{'revision':'62fe911248e22f26939881935478c1ad','url':'assets/6312.8b6d03e7ba568e36a0f9.chunk.js.map'},{'revision':null,'url':'assets/6344.e588484838a3d407bf38.chunk.js'},{'revision':'d8a70c1dbdc0006d9d41282f2834fe2a','url':'assets/6344.e588484838a3d407bf38.chunk.js.map'},{'revision':null,'url':'assets/6424.c64a84ca5412d93f8dab.chunk.js'},{'revision':'92eed6aaa30b807acb716368e0b8a58d','url':'assets/6424.c64a84ca5412d93f8dab.chunk.js.map'},{'revision':null,'url':'assets/6528.15f733bea0a9bcca63f8.chunk.js'},{'revision':'4631aecf53e139a8700384b760d6f829','url':'assets/6528.15f733bea0a9bcca63f8.chunk.js.map'},{'revision':null,'url':'assets/6568.95d4d1201b1993b89098.chunk.js'},{'revision':'060942886396b0baca541075fbaf0d78','url':'assets/6568.95d4d1201b1993b89098.chunk.js.map'},{'revision':null,'url':'assets/6628.282fcac5a1345480f489.chunk.js'},{'revision':'7edac4053734a5b5b13a8037a889c3de','url':'assets/6628.282fcac5a1345480f489.chunk.js.map'},{'revision':null,'url':'assets/6708.da59ae067a464b0826f8.chunk.js'},{'revision':'77e8d56d5b177f658e9c9966899a6f17','url':'assets/6708.da59ae067a464b0826f8.chunk.js.map'},{'revision':null,'url':'assets/6712.119881cb18f61648a4b4.chunk.js'},{'revision':'7a516ba8423916915499d1a7baca6d0a','url':'assets/6712.119881cb18f61648a4b4.chunk.js.map'},{'revision':null,'url':'assets/6728.822cef4d73f4b3739aae.chunk.js'},{'revision':'2601740af1710ef6b01f271ae308afe3','url':'assets/6728.822cef4d73f4b3739aae.chunk.js.map'},{'revision':null,'url':'assets/6828.577943b6a9bf58bdd805.chunk.js'},{'revision':'32c62c573badc5b295e890093feb30cd','url':'assets/6828.577943b6a9bf58bdd805.chunk.js.map'},{'revision':null,'url':'assets/6876.ba6693eb5c6a33f7a7d7.chunk.js'},{'revision':'51e2f798158c05bb3e20bbf2d312fdb2','url':'assets/6876.ba6693eb5c6a33f7a7d7.chunk.js.map'},{'revision':null,'url':'assets/6916.0414e12fecbe9e5d111b.chunk.js'},{'revision':'20760b05ac729a16c2201d51e334ed24','url':'assets/6916.0414e12fecbe9e5d111b.chunk.js.map'},{'revision':null,'url':'assets/7115.e0c4662f40b8c800c297.chunk.js'},{'revision':'0310bb2c27c6da406f72707f4cb7bbdf','url':'assets/7115.e0c4662f40b8c800c297.chunk.js.map'},{'revision':null,'url':'assets/7144.7f423b7e1d343f2b069e.chunk.js'},{'revision':'50f436dadc3e19d6b01f783581f77636','url':'assets/7144.7f423b7e1d343f2b069e.chunk.js.map'},{'revision':null,'url':'assets/7420.f76596c4ff22cbea8b9c.chunk.js'},{'revision':'1caa63279b9d0919ac9881db42954162','url':'assets/7420.f76596c4ff22cbea8b9c.chunk.js.map'},{'revision':null,'url':'assets/744.be6990514377d5082370.chunk.js'},{'revision':'8322839c6bc680be57700d26dbcf6fa4','url':'assets/744.be6990514377d5082370.chunk.js.map'},{'revision':null,'url':'assets/7464.4c4f70b4e1d9f58c4d26.chunk.js'},{'revision':'c462638d961d998b22552c3b94941a32','url':'assets/7464.4c4f70b4e1d9f58c4d26.chunk.js.map'},{'revision':null,'url':'assets/7604.7cb053ebd37f9688c0ac.chunk.js'},{'revision':'c49419553bd523879108e78e081faa49','url':'assets/7604.7cb053ebd37f9688c0ac.chunk.js.map'},{'revision':null,'url':'assets/7660.4349dd6f46134a561409.chunk.js'},{'revision':'aece00e40f1cd940c14f0da4c486b6a0','url':'assets/7660.4349dd6f46134a561409.chunk.js.map'},{'revision':null,'url':'assets/7682.7776161eb118bdbeed03.chunk.js'},{'revision':'b7ccca1faca0aa7c0bedb6c19bdbe1ec','url':'assets/7682.7776161eb118bdbeed03.chunk.js.map'},{'revision':null,'url':'assets/7760.3025b9c5c78f66c255a7.chunk.js'},{'revision':'c59e49ac69b83e4da7dbf13b11ff84b9','url':'assets/7760.3025b9c5c78f66c255a7.chunk.js.map'},{'revision':null,'url':'assets/7960.adf13a4b6721c4bb6242.chunk.js'},{'revision':'a020e5adfe9187ba13519a4c9ea4565f','url':'assets/7960.adf13a4b6721c4bb6242.chunk.js.map'},{'revision':null,'url':'assets/8028.08e80b9ea3117c0e7078.chunk.js'},{'revision':'b439d4c4631ad35e510bc9d40af96e8c','url':'assets/8028.08e80b9ea3117c0e7078.chunk.js.map'},{'revision':null,'url':'assets/8076.cc94755e5e6565fa1afe.chunk.js'},{'revision':'f025375f0c0a75d859166a18e234e259','url':'assets/8076.cc94755e5e6565fa1afe.chunk.js.map'},{'revision':null,'url':'assets/8188.2c7fb94703d369f5058b.chunk.js'},{'revision':null,'url':'assets/8204.b8b1701daa3c82c4393f.chunk.js'},{'revision':'2396ec3c2250d16619e75c9b8674dd5d','url':'assets/8204.b8b1701daa3c82c4393f.chunk.js.map'},{'revision':null,'url':'assets/8228.195302148569e2c98b4c.chunk.js'},{'revision':'84ce1a1f565fb3df068630885c60bef5','url':'assets/8228.195302148569e2c98b4c.chunk.js.map'},{'revision':null,'url':'assets/8284.54bc2e8191fecd2c558d.chunk.js'},{'revision':'91d88a62b87b7b1e990d511e4ee53294','url':'assets/8284.54bc2e8191fecd2c558d.chunk.js.map'},{'revision':null,'url':'assets/8324.d6b268683a97c15f9b0b.chunk.js'},{'revision':'613d3c676598175efd5db2fcb17a8b1c','url':'assets/8324.d6b268683a97c15f9b0b.chunk.js.map'},{'revision':null,'url':'assets/8340.0741f869b14f8d516d5c.chunk.js'},{'revision':'b7c7543578c669c088ab26ed5c07c00c','url':'assets/8340.0741f869b14f8d516d5c.chunk.js.map'},{'revision':null,'url':'assets/848.11d66d8e5050c5f96939.chunk.js'},{'revision':'29e903a21ab7ed037408a8770d9a1df7','url':'assets/848.11d66d8e5050c5f96939.chunk.js.map'},{'revision':null,'url':'assets/8620.c48a7abbb9c0ea4f5b8e.chunk.js'},{'revision':'6be33ab361a912a9f40ed6f2cad0e2b2','url':'assets/8620.c48a7abbb9c0ea4f5b8e.chunk.js.map'},{'revision':null,'url':'assets/880.a836e68722ec3218b4bf.chunk.js'},{'revision':'c281d4224eb5380b3554119b5229c703','url':'assets/880.a836e68722ec3218b4bf.chunk.js.map'},{'revision':null,'url':'assets/8812.01fb6bc7a62ee52d2c22.chunk.js'},{'revision':'999baa8c5b433078374d54bae5bb7b6d','url':'assets/8812.01fb6bc7a62ee52d2c22.chunk.js.map'},{'revision':null,'url':'assets/8836.22aa1efafca0c70b3dc1.chunk.js'},{'revision':'f958f6f78ec886129ae95c9871ba7d16','url':'assets/8836.22aa1efafca0c70b3dc1.chunk.js.map'},{'revision':null,'url':'assets/8848.6114dd74fbc6c6b56e47.chunk.js'},{'revision':'396f446d31dcbd2ffc899b85354ec5b4','url':'assets/8848.6114dd74fbc6c6b56e47.chunk.js.map'},{'revision':null,'url':'assets/8860.fd9679e0ac1dd93c7dd7.chunk.js'},{'revision':'1ffffcf7de05a777ef401d1cfc07c0ad','url':'assets/8860.fd9679e0ac1dd93c7dd7.chunk.js.map'},{'revision':null,'url':'assets/8928.158a8f5e8e9d2418b9ef.chunk.js'},{'revision':'bca131bb57041da0ae89e5d70d286de4','url':'assets/8928.158a8f5e8e9d2418b9ef.chunk.js.map'},{'revision':null,'url':'assets/9068.1707b0d113c104f3aaaa.chunk.js'},{'revision':'04697f05814e302c061e1bd1844286e7','url':'assets/9068.1707b0d113c104f3aaaa.chunk.js.map'},{'revision':null,'url':'assets/9108.5914a2e03dc5adaba48e.chunk.js'},{'revision':'3e38e51a06929d30d7c3588518e8c182','url':'assets/9108.5914a2e03dc5adaba48e.chunk.js.map'},{'revision':null,'url':'assets/9124.1db70160f5aecb10ae19.chunk.js'},{'revision':'4d7804fdc423debab2a950bfe98d25e6','url':'assets/9124.1db70160f5aecb10ae19.chunk.js.map'},{'revision':null,'url':'assets/9256.059135cf56d3136dd6c6.chunk.js'},{'revision':'15764e6cb56ad7cb932740bb5b83571d','url':'assets/9256.059135cf56d3136dd6c6.chunk.js.map'},{'revision':null,'url':'assets/9284.77bc7e65780d7a392983.chunk.js'},{'revision':'cd53b77d338f2991b8255eb0e06e06c5','url':'assets/9284.77bc7e65780d7a392983.chunk.js.map'},{'revision':null,'url':'assets/9320.09e5fb72a43bf9c62749.chunk.js'},{'revision':'ec5ab2e4dbdccaa31841831a29f074ce','url':'assets/9320.09e5fb72a43bf9c62749.chunk.js.map'},{'revision':null,'url':'assets/9388.9eac0b96c7593cbe86f7.chunk.js'},{'revision':'4623efefa84ea8826bc066d00863b064','url':'assets/9388.9eac0b96c7593cbe86f7.chunk.js.map'},{'revision':null,'url':'assets/9480.a40be051c2ef22d01ede.chunk.js'},{'revision':'adc13509f79fa0589f37dbffe8eb46c6','url':'assets/9480.a40be051c2ef22d01ede.chunk.js.map'},{'revision':null,'url':'assets/9524.f5bb5fceef41e21f1c4e.chunk.js'},{'revision':'64c722b92fc0cee74e497abef709d31a','url':'assets/9524.f5bb5fceef41e21f1c4e.chunk.js.map'},{'revision':null,'url':'assets/9704.507319215b434770f7c1.chunk.js'},{'revision':'fec788135f984ddedd8ee0dda8f759f5','url':'assets/9704.507319215b434770f7c1.chunk.js.map'},{'revision':null,'url':'assets/9844.fce88dfe71abec137b53.chunk.js'},{'revision':'efa555a536f9b42f71d0c1eda6e8b652','url':'assets/9844.fce88dfe71abec137b53.chunk.js.map'},{'revision':null,'url':'assets/9856.9d3040286689ac896bcd.chunk.js'},{'revision':'4cd97b7bae47f923214333f4eafae708','url':'assets/9856.9d3040286689ac896bcd.chunk.js.map'},{'revision':null,'url':'assets/9888.3ff3e07310149d8485b6.chunk.js'},{'revision':'27633901b20fece70a8acebffc986aac','url':'assets/9888.3ff3e07310149d8485b6.chunk.js.map'},{'revision':null,'url':'assets/9924.32eca993feabef289ae4.chunk.js'},{'revision':'81ce0b7fbacc8837f19238fa63a03128','url':'assets/9924.32eca993feabef289ae4.chunk.js.map'},{'revision':null,'url':'assets/9964.f721d4304bea5c925eeb.chunk.js'},{'revision':'8e4ea5b39411ce019b460143a90a0d2f','url':'assets/9964.f721d4304bea5c925eeb.chunk.js.map'},{'revision':null,'url':'assets/9972.9d13de8f9394c5ad911d.chunk.js'},{'revision':'66ff1b1219c3710bb1482725527aee54','url':'assets/9972.9d13de8f9394c5ad911d.chunk.js.map'},{'revision':'d54240c89ecb1ea2b5cb41fdb0ba1e5a','url':'assets/api-unavailable.html'},{'revision':null,'url':'assets/common-app.784c11e1f95ddb6f9936.js'},{'revision':null,'url':'assets/common-app.98c71e38ba6aa71f266b.css'},{'revision':'4ac47f1a1c5b96c3ea05ddc13b6cafe6','url':'assets/common-app.98c71e38ba6aa71f266b.css.map'},{'revision':'ab259585666d26614b58f472b03694df','url':'assets/favicon.ico'},{'revision':null,'url':'assets/fonts/fredoka_one_400.4aea26dd6637dfac0fac.ttf'},{'revision':null,'url':'assets/fonts/icomoon.2a1d513cc03401665f1f.woff'},{'revision':null,'url':'assets/fonts/icomoon.ca697b4798b32f5cab0a.ttf'},{'revision':null,'url':'assets/fonts/icomoon.f6fed44ed678a56bb877.eot'},{'revision':null,'url':'assets/fonts/nunito_900.a1c0bd6a53c9ade726cc.ttf'},{'revision':null,'url':'assets/fonts/proxima_nova_400.ea03f826587148b7335d.otf'},{'revision':null,'url':'assets/fonts/proxima_nova_600.815823c606e8fb5e1338.otf'},{'revision':null,'url':'assets/fonts/proxima_nova_700.fcaab2524c5baabd71f6.otf'},{'revision':null,'url':'assets/icomoon.da722b24db6c61bb49b7.svg'},{'revision':'4c283c2774713498fae7e20257d97b7a','url':'assets/icomoon.json'},{'revision':'722e0b5aa11fed3cd0a428f40fd38047','url':'assets/images/404/gary.svg'},{'revision':'da385a6b0ab7e67e68e3d08edcbbf052','url':'assets/images/404/numbers.svg'},{'revision':'5478d1f581a2d29e8fc7bea51c6e6306','url':'assets/images/404/space.svg'},{'revision':'fe865d1f4768ead49d724585b3549c20','url':'assets/images/apps/android.svg'},{'revision':'158636ac953237ccf3180323a1698c5c','url':'assets/images/apps/apple.svg'},{'revision':'ec6be7fef51e8a5d21e6890358b9c98e','url':'assets/images/blog-header.png'},{'revision':'1097b5ad4bb6e6123792d4cdbdfcbd75','url':'assets/images/footer/Everton_footer.svg'},{'revision':'586b06cfb75190c0b6d579d0fe685ea4','url':'assets/images/footer/Sello-Coljuegos_18.png'},{'revision':'f10929b0514417376edc6f7a740fc46b','url':'assets/images/footer/Watford_footer.svg'},{'revision':'80f558eb5b6fc5ebb6d28f3d5433961c','url':'assets/images/footer/alfa romeo_footer.svg'},{'revision':'cd0b3cef11f17c620ce99ac28498a782','url':'assets/images/footer/bitcoin.svg'},{'revision':'ff9ec2eebcc4405574c72b7cbab15dce','url':'assets/images/footer/cgf_footer.svg'},{'revision':'67a65cd6ffb712d45e0de8f68831b3e8','url':'assets/images/footer/ethereum.svg'},{'revision':'c943c41d818cc6c9ce766bde54f8ecdd','url':'assets/images/footer/litecoin.svg'},{'revision':'b4c22524a18345522193f5ade823fc5c','url':'assets/images/footer/peru-mincetur.png'},{'revision':'83f18a3dbbbef7730a75f4a00bdf3591','url':'assets/images/footer/ufc_footer.svg'},{'revision':'302628ae97a47d4174777c3aaf264639','url':'assets/images/icons/128px.png'},{'revision':'607ba0381d05fbc6ac0f6e138d56e869','url':'assets/images/icons/192px.png'},{'revision':'f9de2826ddaae6b3d6c4e4d7bbaf5fd1','url':'assets/images/icons/32px.png'},{'revision':'6c2180172bba0a6676ee4b005b9d562e','url':'assets/images/icons/512px.png'},{'revision':'12847019d9aa0d59b3bd5192da026445','url':'assets/images/icons/apple-touch-icon.png'},{'revision':'f4e97ba5af5b910efc0ebc4cc0619562','url':'assets/images/icons/casino-active.svg'},{'revision':'4fe39795e7911e31f2df7887f419a075','url':'assets/images/icons/casino-big-active.jpg'},{'revision':'b1beef614cceeff00101ac5047898aaa','url':'assets/images/icons/casino-big.jpg'},{'revision':'f283c339b26fdca8b059b25ac7e2a2fe','url':'assets/images/icons/casino-small-active.svg'},{'revision':'055cc5d1fa7766c0a5d7772f5cefac47','url':'assets/images/icons/casino-small.svg'},{'revision':'a18c7309657ea58f628c7f7a851fb56e','url':'assets/images/icons/casino.svg'},{'revision':'19b1bdeb0f6fdffa7fcc09c78829ea66','url':'assets/images/icons/favicon-16x16.png'},{'revision':'f1a50c5910b869f65a9ef07fb9cb1622','url':'assets/images/icons/favicon-32x32.png'},{'revision':'061eb96c9915e9010ee23b8d71a058fb','url':'assets/images/icons/favicon-48x48.png'},{'revision':'acacac774f4bc83b681c5787330252fd','url':'assets/images/icons/sports-active.svg'},{'revision':'b6d5e3930cc296c1abb49ac859dcbdbe','url':'assets/images/icons/sports-big-active.jpg'},{'revision':'3923a3e942357557264d629695a43234','url':'assets/images/icons/sports-big.jpg'},{'revision':'20ea9b96b706f455c8d58012a354ab48','url':'assets/images/icons/sports-small-active.svg'},{'revision':'e201c1559702d412373f9de766655076','url':'assets/images/icons/sports-small.svg'},{'revision':'272fd65a0de7328332cb9d5ac8cd6a6f','url':'assets/images/icons/sports.svg'},{'revision':'eda814ba18785aeba6aee93d78265b4d','url':'assets/images/logo/logo.png'},{'revision':'cc9ed0e888760a6801089755416e2def','url':'assets/images/logo/on-dark-pe.png'},{'revision':'57d56022ef17e5ba41033da54a2f7227','url':'assets/images/logo/on-dark.svg'},{'revision':'d9ee4a215e790234a937a60d0435726b','url':'assets/images/outside-country-pe.png'},{'revision':'981bd412b5e07834196c28ba0bef5139','url':'assets/images/outside-country.jpg'},{'revision':'7cd27c45947117eef7534209e77f9a97','url':'assets/images/promo-header.png'},{'revision':'13b5ad433269e4f0e84e7000395a2481','url':'assets/images/vip-club/step-1.jpg'},{'revision':'ef9f389b2c92bc7e5302aa2d39f5ca0b','url':'assets/images/vip-club/step-2.jpg'},{'revision':'c48df69915b1bb89dfb5b9575806477d','url':'assets/images/vip-club/step-3.jpg'},{'revision':'0e7caa7dd5311475cedc66ed0a0e761e','url':'assets/images/vip-club/vip-club-header-mobile.avif'},{'revision':'a1e633136c7a2c17e00b1b58669f7c53','url':'assets/images/vip-club/vip-club-header.avif'},{'revision':'ba52e7cffef127ddb253b4e4a65de0ca','url':'assets/images/vip-club/vip-club-header.png'},{'revision':'0bae42eb417d3e7f3d2c87847b35023f','url':'assets/images/vip-club/vip-header.webp'},{'revision':'43d3a8a9ca276c5163271b9a688fe6fa','url':'assets/images/welcome/casino.avif'},{'revision':'13fce667abc6abef392cc5ee89f415c3','url':'assets/images/welcome/main-welcome-bg-mob.svg'},{'revision':'13fce667abc6abef392cc5ee89f415c3','url':'assets/images/welcome/main-welcome-bg.svg'},{'revision':'a0aa8fd4e1bc404d31c4bd30635e1cd0','url':'assets/images/welcome/sport.avif'},{'revision':'b2719e029136fbe27ffc387113b031ce','url':'assets/images/welcome/welcome-main.png'},{'revision':'d3bdb9e63fd0af09683d12ebb7eddeca','url':'assets/loader.css'},{'revision':'c524bea95da510fbfa08dcee48cae001','url':'assets/loader.gif'},{'revision':'e90eb98e8f773e8874ad2f070f04c868','url':'assets/loading-spinner-pe.svg'},{'revision':'57d56022ef17e5ba41033da54a2f7227','url':'assets/loading-spinner.svg'},{'revision':null,'url':'assets/main.f01a8e87668120a762ed.css'},{'revision':'7c071bc99651a205b09f773ddb118b3b','url':'assets/main.f01a8e87668120a762ed.css.map'},{'revision':null,'url':'assets/main.f649af953de834e1645e.js'},{'revision':'5e42e1e974736a068a30703c598b6c67','url':'assets/main.f649af953de834e1645e.js.map'},{'revision':'f478693aa0d632b87d741a365005f0b8','url':'assets/manifest.json'},{'revision':'cb69382fe98a2c2cba0105f246b29311','url':'assets/restricted-access.html'},{'revision':null,'url':'assets/vendor-react.dc2bba40c0b3fc180554.js'},{'revision':'f797d9801ebe33ab8fe5f77d448ea2cc','url':'assets/vendor-react.dc2bba40c0b3fc180554.js.map'},{'revision':'9669242661e4231c6dce174f140de617','url':'service-worker.js.map'}];var Qn;"true"===new URLSearchParams(self.location.search).get("local")&&(function(e){Vn().precache(e)}(Yn||[]),function(e){const t=Vn();T(new zn(t,e))}(Qn));const Xn=null!==(Gn=new URLSearchParams(self.location.search).get("release"))&&void 0!==Gn?Gn:"unknown-release";s({suffix:Xn}),self.addEventListener("install",(e=>{e.waitUntil(Jn(void 0,void 0,void 0,(function*(){yield self.skipWaiting()})))})),self.addEventListener("activate",(e=>{e.waitUntil(Jn(void 0,void 0,void 0,(function*(){const e=[],t=(yield caches.keys()).filter((t=>!e.includes(t)));yield Promise.all(t.map((e=>Jn(void 0,void 0,void 0,(function*(){yield caches.delete(e)}))))),yield self.clients.claim()})))}));T((({url:e})=>e.pathname.includes("/assets/")||e.pathname.includes("/static/")),new class extends b{async _handle(e,n){let i,a=await n.cacheMatch(e);if(a)0;else{0;try{a=await n.fetchAndCachePut(e)}catch(e){e instanceof Error&&(i=e)}0}if(!a)throw new t("no-response",{url:e.url,error:i});return a}}({cacheName:"assets",plugins:[new class{constructor(e){this.cacheWillUpdate=async({response:e})=>this._cacheableResponse.isResponseCacheable(e)?e:null,this._cacheableResponse=new k(e)}}({statuses:[200]}),new class{constructor(e={}){this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:n,cachedResponse:i})=>{if(!i)return null;const a=this._isResponseDateFresh(i),r=this._getCacheExpiration(n);u(r.expireEntries());const s=r.updateTimestamp(t.url);if(e)try{e.waitUntil(s)}catch(e){0}return a?i:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const n=this._getCacheExpiration(e);await n.updateTimestamp(t.url),await n.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&function(e){i.add(e)}((()=>this.deleteCacheAndMetadata()))}_getCacheExpiration(e){if(e===c())throw new t("expire-custom-caches-only");let n=this._cacheExpirations.get(e);return n||(n=new J(e,this._config),this._cacheExpirations.set(e,n)),n}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;const t=this._getDateHeaderTimestamp(e);if(null===t)return!0;return t>=Date.now()-1e3*this._maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),n=new Date(t).getTime();return isNaN(n)?null:n}async deleteCacheAndMetadata(){for(const[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}}({maxAgeSeconds:31536e3,maxEntries:50})]})),self.addEventListener("fetch",(e=>{"GET"===e.request.method&&e.respondWith(fetch(e.request).catch((function(){return caches.match(e.request)})))}));const Zn=new URLSearchParams(self.location.search);if("true"===Zn.get("pushNotifications")){!function(e,t){(
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){if(void 0!==self.document)throw En.create("only-available-in-sw");e.onBackgroundMessageHandler=t}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)(e=fe(e),t)}(
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e=function(e=Ze){const t=tt.get(e);if(!t&&e===Ze&&ae())return lt();if(!t)throw ot.create("no-app",{appName:e});return t}()){
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
return async function(){return se()&&await oe()&&"PushManager"in self&&"Notification"in self&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}().then((e=>{if(!e)throw En.create("unsupported-browser")}),(e=>{throw En.create("indexed-db-unsupported")})),st(fe(e),"messaging-sw").getImmediate()}(lt(Object.fromEntries(Zn))),(e=>Jn(void 0,void 0,void 0,(function*(){const t=(e=>{var t,n,i,a,r,s;const o={};if((null===(t=e.data)||void 0===t?void 0:t.event)&&(o.event=e.data.event),o.event&&(null===(n=e.data)||void 0===n?void 0:n.action)){const t="string"==typeof e.data.action?JSON.parse(e.data.action):e.data.action;Object.entries(t).forEach((([e,t])=>{o[e]=t}))}return{title:e.data.title,body:e.data.body,icon:null!==(i=e.data.image)&&void 0!==i?i:"/assets/images/icons/196px.png",data:Object.assign(Object.assign({},Object.keys(o).length?o:void 0),{url:null!==(s=null!==(r=null===(a=e.fcmOptions)||void 0===a?void 0:a.link)&&void 0!==r?r:Object.keys(o).length?`/fcm?${new URLSearchParams(o).toString()}`:void 0)&&void 0!==s?s:"/"})}})(e);yield self.registration.showNotification(t.title,{body:t.body,icon:t.icon,data:t.data})})))),self.onnotificationclick=e=>{e.notification.close(),e.waitUntil(Jn(void 0,void 0,void 0,(function*(){const t=e.notification.data.url,n=yield self.clients.matchAll({includeUncontrolled:!0,type:"window"});for(const e of n)if(e.url===t&&"focus"in e)return e.focus();if(self.clients.openWindow)return self.clients.openWindow(t)})))}}})()})();