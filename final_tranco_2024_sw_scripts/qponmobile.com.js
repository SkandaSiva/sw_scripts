try{self["workbox:core:7.0.0"]&&_()}catch(t){}const cn=(t,...e)=>{let n=t;return e.length>0&&(n+=" :: ".concat(JSON.stringify(e))),n},ln=cn;class f extends Error{constructor(e,n){const s=ln(e,n);super(s),this.name=e,this.details=n}}const w={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:typeof registration<"u"?registration.scope:""},ne=t=>[w.prefix,t,w.suffix].filter(e=>e&&e.length>0).join("-"),un=t=>{for(const e of Object.keys(w))t(e)},W={updateDetails:t=>{un(e=>{typeof t[e]=="string"&&(w[e]=t[e])})},getGoogleAnalyticsName:t=>t||ne(w.googleAnalytics),getPrecacheName:t=>t||ne(w.precache),getPrefix:()=>w.prefix,getRuntimeName:t=>t||ne(w.runtime),getSuffix:()=>w.suffix};function Fe(t,e){const n=e();return t.waitUntil(n),n}try{self["workbox:precaching:7.0.0"]&&_()}catch(t){}const hn="__WB_REVISION__";function dn(t){if(!t)throw new f("add-to-cache-list-unexpected-type",{entry:t});if(typeof t=="string"){const r=new URL(t,location.href);return{cacheKey:r.href,url:r.href}}const{revision:e,url:n}=t;if(!n)throw new f("add-to-cache-list-unexpected-type",{entry:t});if(!e){const r=new URL(n,location.href);return{cacheKey:r.href,url:r.href}}const s=new URL(n,location.href),i=new URL(n,location.href);return s.searchParams.set(hn,e),{cacheKey:s.href,url:i.href}}class fn{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:n})=>{n&&(n.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:n,cachedResponse:s})=>{if(e.type==="install"&&n&&n.originalRequest&&n.originalRequest instanceof Request){const i=n.originalRequest.url;s?this.notUpdatedURLs.push(i):this.updatedURLs.push(i)}return s}}}class pn{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:n,params:s})=>{const i=(s==null?void 0:s.cacheKey)||this._precacheController.getCacheKeyForURL(n.url);return i?new Request(i,{headers:n.headers}):n},this._precacheController=e}}let $;function gn(){if($===void 0){const t=new Response("");if("body"in t)try{new Response(t.body),$=!0}catch(e){$=!1}$=!1}return $}async function mn(t,e){let n=null;if(t.url&&(n=new URL(t.url).origin),n!==self.location.origin)throw new f("cross-origin-copy-response",{origin:n});const s=t.clone(),r={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},a=gn()?s.body:await s.blob();return new Response(a,r)}const bn=t=>new URL(String(t),location.href).href.replace(new RegExp("^".concat(location.origin)),"");function Ue(t,e){const n=new URL(t);for(const s of e)n.searchParams.delete(s);return n.href}async function wn(t,e,n,s){const i=Ue(e.url,n);if(e.url===i)return t.match(e,s);const r=Object.assign(Object.assign({},s),{ignoreSearch:!0}),a=await t.keys(e,r);for(const o of a){const c=Ue(o.url,n);if(i===c)return t.match(o,s)}}let yn=class{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}};const dt=new Set;async function _n(){for(const t of dt)await t()}function vn(t){return new Promise(e=>setTimeout(e,t))}try{self["workbox:strategies:7.0.0"]&&_()}catch(t){}function z(t){return typeof t=="string"?new Request(t):t}class En{constructor(e,n){this._cacheKeys={},Object.assign(this,n),this.event=n.event,this._strategy=e,this._handlerDeferred=new yn,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const s of this._plugins)this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:n}=this;let s=z(e);if(s.mode==="navigate"&&n instanceof FetchEvent&&n.preloadResponse){const a=await n.preloadResponse;if(a)return a}const i=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const a of this.iterateCallbacks("requestWillFetch"))s=await a({request:s.clone(),event:n})}catch(a){if(a instanceof Error)throw new f("plugin-error-request-will-fetch",{thrownErrorMessage:a.message})}const r=s.clone();try{let a;a=await fetch(s,s.mode==="navigate"?void 0:this._strategy.fetchOptions);for(const o of this.iterateCallbacks("fetchDidSucceed"))a=await o({event:n,request:r,response:a});return a}catch(a){throw i&&await this.runCallbacks("fetchDidFail",{error:a,event:n,originalRequest:i.clone(),request:r.clone()}),a}}async fetchAndCachePut(e){const n=await this.fetch(e),s=n.clone();return this.waitUntil(this.cachePut(e,s)),n}async cacheMatch(e){const n=z(e);let s;const{cacheName:i,matchOptions:r}=this._strategy,a=await this.getCacheKey(n,"read"),o=Object.assign(Object.assign({},r),{cacheName:i});s=await caches.match(a,o);for(const c of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await c({cacheName:i,matchOptions:r,cachedResponse:s,request:a,event:this.event})||void 0;return s}async cachePut(e,n){const s=z(e);await vn(0);const i=await this.getCacheKey(s,"write");if(!n)throw new f("cache-put-with-no-response",{url:bn(i.url)});const r=await this._ensureResponseSafeToCache(n);if(!r)return!1;const{cacheName:a,matchOptions:o}=this._strategy,c=await self.caches.open(a),u=this.hasCallback("cacheDidUpdate"),l=u?await wn(c,i.clone(),["__WB_REVISION__"],o):null;try{await c.put(i,u?r.clone():r)}catch(d){if(d instanceof Error)throw d.name==="QuotaExceededError"&&await _n(),d}for(const d of this.iterateCallbacks("cacheDidUpdate"))await d({cacheName:a,oldResponse:l,newResponse:r.clone(),request:i,event:this.event});return!0}async getCacheKey(e,n){const s="".concat(e.url," | ").concat(n);if(!this._cacheKeys[s]){let i=e;for(const r of this.iterateCallbacks("cacheKeyWillBeUsed"))i=z(await r({mode:n,request:i,event:this.event,params:this.params}));this._cacheKeys[s]=i}return this._cacheKeys[s]}hasCallback(e){for(const n of this._strategy.plugins)if(e in n)return!0;return!1}async runCallbacks(e,n){for(const s of this.iterateCallbacks(e))await s(n)}*iterateCallbacks(e){for(const n of this._strategy.plugins)if(typeof n[e]=="function"){const s=this._pluginStateMap.get(n);yield r=>{const a=Object.assign(Object.assign({},r),{state:s});return n[e](a)}}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let n=e,s=!1;for(const i of this.iterateCallbacks("cacheWillUpdate"))if(n=await i({request:this.request,response:n,event:this.event})||void 0,s=!0,!n)break;return s||n&&n.status!==200&&(n=void 0),n}}class ft{constructor(e={}){this.cacheName=W.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[n]=this.handleAll(e);return n}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const n=e.event,s=typeof e.request=="string"?new Request(e.request):e.request,i="params"in e?e.params:void 0,r=new En(this,{event:n,request:s,params:i}),a=this._getResponse(r,s,n),o=this._awaitComplete(a,r,s,n);return[a,o]}async _getResponse(e,n,s){await e.runCallbacks("handlerWillStart",{event:s,request:n});let i;try{if(i=await this._handle(n,e),!i||i.type==="error")throw new f("no-response",{url:n.url})}catch(r){if(r instanceof Error){for(const a of e.iterateCallbacks("handlerDidError"))if(i=await a({error:r,event:s,request:n}),i)break}if(!i)throw r}for(const r of e.iterateCallbacks("handlerWillRespond"))i=await r({event:s,request:n,response:i});return i}async _awaitComplete(e,n,s,i){let r,a;try{r=await e}catch(o){}try{await n.runCallbacks("handlerDidRespond",{event:i,request:s,response:r}),await n.doneWaiting()}catch(o){o instanceof Error&&(a=o)}if(await n.runCallbacks("handlerDidComplete",{event:i,request:s,response:r,error:a}),n.destroy(),a)throw a}}class I extends ft{constructor(e={}){e.cacheName=W.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=e.fallbackToNetwork!==!1,this.plugins.push(I.copyRedirectedCacheableResponsesPlugin)}async _handle(e,n){const s=await n.cacheMatch(e);return s||(n.event&&n.event.type==="install"?await this._handleInstall(e,n):await this._handleFetch(e,n))}async _handleFetch(e,n){let s;const i=n.params||{};if(this._fallbackToNetwork){const r=i.integrity,a=e.integrity,o=!a||a===r;s=await n.fetch(new Request(e,{integrity:e.mode!=="no-cors"?a||r:void 0})),r&&o&&e.mode!=="no-cors"&&(this._useDefaultCacheabilityPluginIfNeeded(),await n.cachePut(e,s.clone()))}else throw new f("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return s}async _handleInstall(e,n){this._useDefaultCacheabilityPluginIfNeeded();const s=await n.fetch(e);if(!await n.cachePut(e,s.clone()))throw new f("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,n=0;for(const[s,i]of this.plugins.entries())i!==I.copyRedirectedCacheableResponsesPlugin&&(i===I.defaultPrecacheCacheabilityPlugin&&(e=s),i.cacheWillUpdate&&n++);n===0?this.plugins.push(I.defaultPrecacheCacheabilityPlugin):n>1&&e!==null&&this.plugins.splice(e,1)}}I.defaultPrecacheCacheabilityPlugin={async cacheWillUpdate({response:t}){return!t||t.status>=400?null:t}};I.copyRedirectedCacheableResponsesPlugin={async cacheWillUpdate({response:t}){return t.redirected?await mn(t):t}};class In{constructor({cacheName:e,plugins:n=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new I({cacheName:W.getPrecacheName(e),plugins:[...n,new pn({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const n=[];for(const s of e){typeof s=="string"?n.push(s):s&&s.revision===void 0&&n.push(s.url);const{cacheKey:i,url:r}=dn(s),a=typeof s!="string"&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(r)&&this._urlsToCacheKeys.get(r)!==i)throw new f("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(r),secondEntry:i});if(typeof s!="string"&&s.integrity){if(this._cacheKeysToIntegrities.has(i)&&this._cacheKeysToIntegrities.get(i)!==s.integrity)throw new f("add-to-cache-list-conflicting-integrities",{url:r});this._cacheKeysToIntegrities.set(i,s.integrity)}if(this._urlsToCacheKeys.set(r,i),this._urlsToCacheModes.set(r,a),n.length>0){const o="Workbox is precaching URLs without revision info: ".concat(n.join(", "),"\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache");console.warn(o)}}}install(e){return Fe(e,async()=>{const n=new fn;this.strategy.plugins.push(n);for(const[r,a]of this._urlsToCacheKeys){const o=this._cacheKeysToIntegrities.get(a),c=this._urlsToCacheModes.get(r),u=new Request(r,{integrity:o,cache:c,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:a},request:u,event:e}))}const{updatedURLs:s,notUpdatedURLs:i}=n;return{updatedURLs:s,notUpdatedURLs:i}})}activate(e){return Fe(e,async()=>{const n=await self.caches.open(this.strategy.cacheName),s=await n.keys(),i=new Set(this._urlsToCacheKeys.values()),r=[];for(const a of s)i.has(a.url)||(await n.delete(a),r.push(a.url));return{deletedURLs:r}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const n=new URL(e,location.href);return this._urlsToCacheKeys.get(n.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const n=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(n);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(e){const n=this.getCacheKeyForURL(e);if(!n)throw new f("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:n},s.params),this.strategy.handle(s))}}let se;const pt=()=>(se||(se=new In),se);try{self["workbox:routing:7.0.0"]&&_()}catch(t){}const gt="GET",J=t=>t&&typeof t=="object"?t:{handle:t};class j{constructor(e,n,s=gt){this.handler=J(n),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=J(e)}}class Sn extends j{constructor(e,n,s){const i=({url:r})=>{const a=e.exec(r.href);if(a&&!(r.origin!==location.origin&&a.index!==0))return a.slice(1)};super(i,n,s)}}class Tn{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{const{request:n}=e,s=this.handleRequest({request:n,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&e.data.type==="CACHE_URLS"){const{payload:n}=e.data,s=Promise.all(n.urlsToCache.map(i=>{typeof i=="string"&&(i=[i]);const r=new Request(...i);return this.handleRequest({request:r,event:e})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:n}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const i=s.origin===location.origin,{params:r,route:a}=this.findMatchingRoute({event:n,request:e,sameOrigin:i,url:s});let o=a&&a.handler;const c=e.method;if(!o&&this._defaultHandlerMap.has(c)&&(o=this._defaultHandlerMap.get(c)),!o)return;let u;try{u=o.handle({url:s,request:e,event:n,params:r})}catch(d){u=Promise.reject(d)}const l=a&&a.catchHandler;return u instanceof Promise&&(this._catchHandler||l)&&(u=u.catch(async d=>{if(l)try{return await l.handle({url:s,request:e,event:n,params:r})}catch(k){k instanceof Error&&(d=k)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:n});throw d})),u}findMatchingRoute({url:e,sameOrigin:n,request:s,event:i}){const r=this._routes.get(s.method)||[];for(const a of r){let o;const c=a.match({url:e,sameOrigin:n,request:s,event:i});if(c)return o=c,(Array.isArray(o)&&o.length===0||c.constructor===Object&&Object.keys(c).length===0||typeof c=="boolean")&&(o=void 0),{route:a,params:o}}return{}}setDefaultHandler(e,n=gt){this._defaultHandlerMap.set(n,J(e))}setCatchHandler(e){this._catchHandler=J(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new f("unregister-route-but-not-found-with-method",{method:e.method});const n=this._routes.get(e.method).indexOf(e);if(n>-1)this._routes.get(e.method).splice(n,1);else throw new f("unregister-route-route-not-registered")}}let B;const Cn=()=>(B||(B=new Tn,B.addFetchListener(),B.addCacheListener()),B);function P(t,e,n){let s;if(typeof t=="string"){const r=new URL(t,location.href),a=({url:o})=>o.href===r.href;s=new j(a,e,n)}else if(t instanceof RegExp)s=new Sn(t,e,n);else if(typeof t=="function")s=new j(t,e,n);else if(t instanceof j)s=t;else throw new f("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});return Cn().registerRoute(s),s}function kn(t,e=[]){for(const n of[...t.searchParams.keys()])e.some(s=>s.test(n))&&t.searchParams.delete(n);return t}function*An(t,{ignoreURLParametersMatching:e=[/^utm_/,/^fbclid$/],directoryIndex:n="index.html",cleanURLs:s=!0,urlManipulation:i}={}){const r=new URL(t,location.href);r.hash="",yield r.href;const a=kn(r,e);if(yield a.href,n&&a.pathname.endsWith("/")){const o=new URL(a.href);o.pathname+=n,yield o.href}if(s){const o=new URL(a.href);o.pathname+=".html",yield o.href}if(i){const o=i({url:r});for(const c of o)yield c.href}}class Dn extends j{constructor(e,n){const s=({request:i})=>{const r=e.getURLsToCacheKeys();for(const a of An(i.url,n)){const o=r.get(a);if(o){const c=e.getIntegrityForCacheKey(o);return{cacheKey:o,integrity:c}}}};super(s,e.strategy)}}function Rn(t){const e=pt(),n=new Dn(e,t);P(n)}const On="-precache-",Nn=async(t,e=On)=>{const s=(await self.caches.keys()).filter(i=>i.includes(e)&&i.includes(self.registration.scope)&&i!==t);return await Promise.all(s.map(i=>self.caches.delete(i))),s};function Mn(){self.addEventListener("activate",t=>{const e=W.getPrecacheName();t.waitUntil(Nn(e).then(n=>{}))})}function Ln(t){pt().precache(t)}function Pn(t,e){Ln(t),Rn(e)}function xn(t){dt.add(t)}function mt(t){t.then(()=>{})}function $n(){self.addEventListener("activate",()=>self.clients.claim())}class F extends ft{async _handle(e,n){let s=await n.cacheMatch(e),i;if(!s)try{s=await n.fetchAndCachePut(e)}catch(r){r instanceof Error&&(i=r)}if(!s)throw new f("no-response",{url:e.url,error:i});return s}}try{self["workbox:cacheable-response:7.0.0"]&&_()}catch(t){}class Bn{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let n=!0;return this._statuses&&(n=this._statuses.includes(e.status)),this._headers&&n&&(n=Object.keys(this._headers).some(s=>e.headers.get(s)===this._headers[s])),n}}class ie{constructor(e){this.cacheWillUpdate=async({response:n})=>this._cacheableResponse.isResponseCacheable(n)?n:null,this._cacheableResponse=new Bn(e)}}const Fn=(t,e)=>e.some(n=>t instanceof n);let je,Ke;function Un(){return je||(je=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function jn(){return Ke||(Ke=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const bt=new WeakMap,be=new WeakMap,wt=new WeakMap,re=new WeakMap,Se=new WeakMap;function Kn(t){const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("success",r),t.removeEventListener("error",a)},r=()=>{n(y(t.result)),i()},a=()=>{s(t.error),i()};t.addEventListener("success",r),t.addEventListener("error",a)});return e.then(n=>{n instanceof IDBCursor&&bt.set(n,t)}).catch(()=>{}),Se.set(e,t),e}function Hn(t){if(be.has(t))return;const e=new Promise((n,s)=>{const i=()=>{t.removeEventListener("complete",r),t.removeEventListener("error",a),t.removeEventListener("abort",a)},r=()=>{n(),i()},a=()=>{s(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",r),t.addEventListener("error",a),t.addEventListener("abort",a)});be.set(t,e)}let we={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return be.get(t);if(e==="objectStoreNames")return t.objectStoreNames||wt.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return y(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function qn(t){we=t(we)}function Wn(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const s=t.call(ae(this),e,...n);return wt.set(s,e.sort?e.sort():[e]),y(s)}:jn().includes(t)?function(...e){return t.apply(ae(this),e),y(bt.get(this))}:function(...e){return y(t.apply(ae(this),e))}}function Vn(t){return typeof t=="function"?Wn(t):(t instanceof IDBTransaction&&Hn(t),Fn(t,Un())?new Proxy(t,we):t)}function y(t){if(t instanceof IDBRequest)return Kn(t);if(re.has(t))return re.get(t);const e=Vn(t);return e!==t&&(re.set(t,e),Se.set(e,t)),e}const ae=t=>Se.get(t);function L(t,e,{blocked:n,upgrade:s,blocking:i,terminated:r}={}){const a=indexedDB.open(t,e),o=y(a);return s&&a.addEventListener("upgradeneeded",c=>{s(y(a.result),c.oldVersion,c.newVersion,y(a.transaction),c)}),n&&a.addEventListener("blocked",c=>n(c.oldVersion,c.newVersion,c)),o.then(c=>{r&&c.addEventListener("close",()=>r()),i&&c.addEventListener("versionchange",u=>i(u.oldVersion,u.newVersion,u))}).catch(()=>{}),o}function R(t,{blocked:e}={}){const n=indexedDB.deleteDatabase(t);return e&&n.addEventListener("blocked",s=>e(s.oldVersion,s)),y(n).then(()=>{})}const Gn=["get","getKey","getAll","getAllKeys","count"],zn=["put","add","delete","clear"],oe=new Map;function He(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(oe.get(e))return oe.get(e);const n=e.replace(/FromIndex$/,""),s=e!==n,i=zn.includes(n);if(!(n in(s?IDBIndex:IDBObjectStore).prototype)||!(i||Gn.includes(n)))return;const r=async function(a,...o){const c=this.transaction(a,i?"readwrite":"readonly");let u=c.store;return s&&(u=u.index(o.shift())),(await Promise.all([u[n](...o),i&&c.done]))[0]};return oe.set(e,r),r}qn(t=>({...t,get:(e,n,s)=>He(e,n)||t.get(e,n,s),has:(e,n)=>!!He(e,n)||t.has(e,n)}));try{self["workbox:expiration:7.0.0"]&&_()}catch(t){}const Jn="workbox-expiration",U="cache-entries",qe=t=>{const e=new URL(t,location.href);return e.hash="",e.href};class Yn{constructor(e){this._db=null,this._cacheName=e}_upgradeDb(e){const n=e.createObjectStore(U,{keyPath:"id"});n.createIndex("cacheName","cacheName",{unique:!1}),n.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&R(this._cacheName)}async setTimestamp(e,n){e=qe(e);const s={url:e,timestamp:n,cacheName:this._cacheName,id:this._getId(e)},r=(await this.getDb()).transaction(U,"readwrite",{durability:"relaxed"});await r.store.put(s),await r.done}async getTimestamp(e){const s=await(await this.getDb()).get(U,this._getId(e));return s==null?void 0:s.timestamp}async expireEntries(e,n){const s=await this.getDb();let i=await s.transaction(U).store.index("timestamp").openCursor(null,"prev");const r=[];let a=0;for(;i;){const c=i.value;c.cacheName===this._cacheName&&(e&&c.timestamp<e||n&&a>=n?r.push(i.value):a++),i=await i.continue()}const o=[];for(const c of r)await s.delete(U,c.id),o.push(c.url);return o}_getId(e){return this._cacheName+"|"+qe(e)}async getDb(){return this._db||(this._db=await L(Jn,1,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}}class Qn{constructor(e,n={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=n.maxEntries,this._maxAgeSeconds=n.maxAgeSeconds,this._matchOptions=n.matchOptions,this._cacheName=e,this._timestampModel=new Yn(e)}async expireEntries(){if(this._isRunning){this._rerunRequested=!0;return}this._isRunning=!0;const e=this._maxAgeSeconds?Date.now()-this._maxAgeSeconds*1e3:0,n=await this._timestampModel.expireEntries(e,this._maxEntries),s=await self.caches.open(this._cacheName);for(const i of n)await s.delete(i,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,mt(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(this._maxAgeSeconds){const n=await this._timestampModel.getTimestamp(e),s=Date.now()-this._maxAgeSeconds*1e3;return n!==void 0?n<s:!0}else return!1}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}class We{constructor(e={}){this.cachedResponseWillBeUsed=async({event:n,request:s,cacheName:i,cachedResponse:r})=>{if(!r)return null;const a=this._isResponseDateFresh(r),o=this._getCacheExpiration(i);mt(o.expireEntries());const c=o.updateTimestamp(s.url);if(n)try{n.waitUntil(c)}catch(u){}return a?r:null},this.cacheDidUpdate=async({cacheName:n,request:s})=>{const i=this._getCacheExpiration(n);await i.updateTimestamp(s.url),await i.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&xn(()=>this.deleteCacheAndMetadata())}_getCacheExpiration(e){if(e===W.getRuntimeName())throw new f("expire-custom-caches-only");let n=this._cacheExpirations.get(e);return n||(n=new Qn(e,this._config),this._cacheExpirations.set(e,n)),n}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;const n=this._getDateHeaderTimestamp(e);if(n===null)return!0;const s=Date.now();return n>=s-this._maxAgeSeconds*1e3}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;const n=e.headers.get("date"),i=new Date(n).getTime();return isNaN(i)?null:i}async deleteCacheAndMetadata(){for(const[e,n]of this._cacheExpirations)await self.caches.delete(e),await n.delete();this._cacheExpirations=new Map}}const Xn={apiKey:"AIzaSyCE_QyjS8Gwygq2JFcgn2M5i_YPWglldQs",authDomain:"qpon-1c174.firebaseapp.com",databaseURL:"https://qpon-1c174-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"qpon-1c174",storageBucket:"qpon-1c174.appspot.com",messagingSenderId:"786264308667",appId:"1:786264308667:web:5dcbb8615bf09a4fefa29e",measurementId:"G-D6Q6G1LKRN"},Zn="BLt-rEyB61qVeChu9QTIoNevDvnXb_UeknPA5hscIe4n_v24-q3wbPyCUNUtSY5442cJZLhQSQaME7RP7JwkhFY",es="https://qpon-h5-id.qponmobile.com/platform/home?channel=notification",ts=5*60;function ns(t){const e=[new We({maxEntries:50,maxAgeSeconds:2592e3}),new ie({statuses:[0,200]})];P(({request:n})=>n.mode==="navigate",new F({cacheName:"workbox-runtime-navigate-pages",plugins:[new We({maxEntries:50,maxAgeSeconds:ts}),new ie({statuses:[0,200]})]})),P(/\.(svg|webp|png|jpg|jpeg|gif|ico).*/,new F,"GET"),P(/.*\.(css|scss).*/,new F,"GET"),P(/.*\.(js|tsx|ts).*/,new F({plugins:[{cachedResponseWillBeUsed:async n=>{const s=n.cachedResponse;if(!s)return;const i=s.url;return console.warn("命中运行时缓存",i),s}},new ie({statuses:[0,200]})]}),"GET"),P(/^https:\/\/dgf-bres-gl\.qponmobile\.com\/.*\.(png|jpg|jpeg|webp|svg|gif|ico).*/,new F({cacheName:"workbox-runtime-https://dgf-bres-gl.qponmobile.com/",plugins:e,fetchOptions:{credentials:"same-origin",mode:"cors"}}),"GET")}var Ve={};/**
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
 */const yt=function(t){const e=[];let n=0;for(let s=0;s<t.length;s++){let i=t.charCodeAt(s);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++s)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},ss=function(t){const e=[];let n=0,s=0;for(;n<t.length;){const i=t[n++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=t[n++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=t[n++],a=t[n++],o=t[n++],c=((i&7)<<18|(r&63)<<12|(a&63)<<6|o&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const r=t[n++],a=t[n++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|a&63)}}return e.join("")},_t={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<t.length;i+=3){const r=t[i],a=i+1<t.length,o=a?t[i+1]:0,c=i+2<t.length,u=c?t[i+2]:0,l=r>>2,d=(r&3)<<4|o>>4;let k=(o&15)<<2|u>>6,G=u&63;c||(G=64,a||(k=64)),s.push(n[l],n[d],n[k],n[G])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(yt(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):ss(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<t.length;){const r=n[t.charAt(i++)],o=i<t.length?n[t.charAt(i)]:0;++i;const u=i<t.length?n[t.charAt(i)]:64;++i;const d=i<t.length?n[t.charAt(i)]:64;if(++i,r==null||o==null||u==null||d==null)throw new is;const k=r<<2|o>>4;if(s.push(k),u!==64){const G=o<<4&240|u>>2;if(s.push(G),d!==64){const on=u<<6&192|d;s.push(on)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class is extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const rs=function(t){const e=yt(t);return _t.encodeByteArray(e,!0)},vt=function(t){return rs(t).replace(/\./g,"")},as=function(t){try{return _t.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
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
 */function os(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
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
 */const cs=()=>os().__FIREBASE_DEFAULTS__,ls=()=>{if(typeof process>"u"||typeof Ve>"u")return;const t=Ve.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},us=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const e=t&&as(t[1]);return e&&JSON.parse(e)},hs=()=>{try{return cs()||ls()||us()}catch(t){console.info("Unable to get __FIREBASE_DEFAULTS__ due to: ".concat(t));return}},Et=()=>{var t;return(t=hs())===null||t===void 0?void 0:t.config};/**
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
 */class ds{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,s)=>{n?this.reject(n):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,s))}}}function It(){try{return typeof indexedDB=="object"}catch(t){return!1}}function St(){return new Promise((t,e)=>{try{let n=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(s),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(n){e(n)}})}/**
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
 */const fs="FirebaseError";class x extends Error{constructor(e,n,s){super(n),this.code=e,this.customData=s,this.name=fs,Object.setPrototypeOf(this,x.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,V.prototype.create)}}class V{constructor(e,n,s){this.service=e,this.serviceName=n,this.errors=s}create(e,...n){const s=n[0]||{},i="".concat(this.service,"/").concat(e),r=this.errors[e],a=r?ps(r,s):"Error",o="".concat(this.serviceName,": ").concat(a," (").concat(i,").");return new x(i,o,s)}}function ps(t,e){return t.replace(gs,(n,s)=>{const i=e[s];return i!=null?String(i):"<".concat(s,"?>")})}const gs=/\{\$([^}]+)}/g;function ye(t,e){if(t===e)return!0;const n=Object.keys(t),s=Object.keys(e);for(const i of n){if(!s.includes(i))return!1;const r=t[i],a=e[i];if(Ge(r)&&Ge(a)){if(!ye(r,a))return!1}else if(r!==a)return!1}for(const i of s)if(!n.includes(i))return!1;return!0}function Ge(t){return t!==null&&typeof t=="object"}/**
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
 */function Tt(t){return t&&t._delegate?t._delegate:t}class v{constructor(e,n,s){this.name=e,this.instanceFactory=n,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
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
 */const A="[DEFAULT]";/**
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
 */class ms{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const s=new ds;if(this.instancesDeferred.set(n,s),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&s.resolve(i)}catch(i){}}return this.instancesDeferred.get(n).promise}getImmediate(e){var n;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(n=e==null?void 0:e.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error("Service ".concat(this.name," is not available"))}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error("Mismatching Component ".concat(e.name," for Provider ").concat(this.name,"."));if(this.component)throw Error("Component for ".concat(this.name," has already been provided"));if(this.component=e,!!this.shouldAutoInitialize()){if(ws(e))try{this.getOrInitializeService({instanceIdentifier:A})}catch(n){}for(const[n,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch(r){}}}}clearInstance(e=A){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=A){return this.instances.has(e)}getOptions(e=A){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error("".concat(this.name,"(").concat(s,") has already been initialized"));if(!this.isComponentSet())throw Error("Component ".concat(this.name," has not been registered yet"));const i=this.getOrInitializeService({instanceIdentifier:s,options:n});for(const[r,a]of this.instancesDeferred.entries()){const o=this.normalizeInstanceIdentifier(r);s===o&&a.resolve(i)}return i}onInit(e,n){var s;const i=this.normalizeInstanceIdentifier(n),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const a=this.instances.get(i);return a&&e(a,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,n){const s=this.onInitCallbacks.get(n);if(s)for(const i of s)try{i(e,n)}catch(r){}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:bs(e),options:n}),this.instances.set(e,s),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch(i){}return s||null}normalizeInstanceIdentifier(e=A){return this.component?this.component.multipleInstances?e:A:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function bs(t){return t===A?void 0:t}function ws(t){return t.instantiationMode==="EAGER"}/**
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
 */class ys{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error("Component ".concat(e.name," has already been registered with ").concat(this.name));n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new ms(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
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
 */var h;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(h||(h={}));const _s={debug:h.DEBUG,verbose:h.VERBOSE,info:h.INFO,warn:h.WARN,error:h.ERROR,silent:h.SILENT},vs=h.INFO,Es={[h.DEBUG]:"log",[h.VERBOSE]:"log",[h.INFO]:"info",[h.WARN]:"warn",[h.ERROR]:"error"},Is=(t,e,...n)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),i=Es[e];if(i)console[i]("[".concat(s,"]  ").concat(t.name,":"),...n);else throw new Error("Attempted to log a message with an invalid logType (value: ".concat(e,")"))};class Ss{constructor(e){this.name=e,this._logLevel=vs,this._logHandler=Is,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in h))throw new TypeError('Invalid value "'.concat(e,'" assigned to `logLevel`'));this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?_s[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,h.DEBUG,...e),this._logHandler(this,h.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,h.VERBOSE,...e),this._logHandler(this,h.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,h.INFO,...e),this._logHandler(this,h.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,h.WARN,...e),this._logHandler(this,h.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,h.ERROR,...e),this._logHandler(this,h.ERROR,...e)}}/**
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
 */class Ts{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Cs(n)){const s=n.getImmediate();return"".concat(s.library,"/").concat(s.version)}else return null}).filter(n=>n).join(" ")}}function Cs(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const _e="@firebase/app",ze="0.10.9";/**
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
 */const E=new Ss("@firebase/app"),ks="@firebase/app-compat",As="@firebase/analytics-compat",Ds="@firebase/analytics",Rs="@firebase/app-check-compat",Os="@firebase/app-check",Ns="@firebase/auth",Ms="@firebase/auth-compat",Ls="@firebase/database",Ps="@firebase/database-compat",xs="@firebase/functions",$s="@firebase/functions-compat",Bs="@firebase/installations",Fs="@firebase/installations-compat",Us="@firebase/messaging",js="@firebase/messaging-compat",Ks="@firebase/performance",Hs="@firebase/performance-compat",qs="@firebase/remote-config",Ws="@firebase/remote-config-compat",Vs="@firebase/storage",Gs="@firebase/storage-compat",zs="@firebase/firestore",Js="@firebase/vertexai-preview",Ys="@firebase/firestore-compat",Qs="firebase";/**
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
 */const ve="[DEFAULT]",Xs={[_e]:"fire-core",[ks]:"fire-core-compat",[Ds]:"fire-analytics",[As]:"fire-analytics-compat",[Os]:"fire-app-check",[Rs]:"fire-app-check-compat",[Ns]:"fire-auth",[Ms]:"fire-auth-compat",[Ls]:"fire-rtdb",[Ps]:"fire-rtdb-compat",[xs]:"fire-fn",[$s]:"fire-fn-compat",[Bs]:"fire-iid",[Fs]:"fire-iid-compat",[Us]:"fire-fcm",[js]:"fire-fcm-compat",[Ks]:"fire-perf",[Hs]:"fire-perf-compat",[qs]:"fire-rc",[Ws]:"fire-rc-compat",[Vs]:"fire-gcs",[Gs]:"fire-gcs-compat",[zs]:"fire-fst",[Ys]:"fire-fst-compat",[Js]:"fire-vertex","fire-js":"fire-js",[Qs]:"fire-js-all"};/**
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
 */const Y=new Map,Zs=new Map,Ee=new Map;function Je(t,e){try{t.container.addComponent(e)}catch(n){E.debug("Component ".concat(e.name," failed to register with FirebaseApp ").concat(t.name),n)}}function C(t){const e=t.name;if(Ee.has(e))return E.debug("There were multiple attempts to register component ".concat(e,".")),!1;Ee.set(e,t);for(const n of Y.values())Je(n,t);for(const n of Zs.values())Je(n,t);return!0}function Te(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}/**
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
 */const ei={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},S=new V("app","Firebase",ei);/**
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
 */class ti{constructor(e,n,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new v("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw S.create("app-deleted",{appName:this._name})}}function Ct(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:ve,automaticDataCollectionEnabled:!1},e),i=s.name;if(typeof i!="string"||!i)throw S.create("bad-app-name",{appName:String(i)});if(n||(n=Et()),!n)throw S.create("no-options");const r=Y.get(i);if(r){if(ye(n,r.options)&&ye(s,r.config))return r;throw S.create("duplicate-app",{appName:i})}const a=new ys(i);for(const c of Ee.values())a.addComponent(c);const o=new ti(n,s,a);return Y.set(i,o),o}function ni(t=ve){const e=Y.get(t);if(!e&&t===ve&&Et())return Ct();if(!e)throw S.create("no-app",{appName:t});return e}function T(t,e,n){var s;let i=(s=Xs[t])!==null&&s!==void 0?s:t;n&&(i+="-".concat(n));const r=i.match(/\s|\//),a=e.match(/\s|\//);if(r||a){const o=['Unable to register library "'.concat(i,'" with version "').concat(e,'":')];r&&o.push('library name "'.concat(i,'" contains illegal characters (whitespace or "/")')),r&&a&&o.push("and"),a&&o.push('version name "'.concat(e,'" contains illegal characters (whitespace or "/")')),E.warn(o.join(" "));return}C(new v("".concat(i,"-version"),()=>({library:i,version:e}),"VERSION"))}/**
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
 */const si="firebase-heartbeat-database",ii=1,K="firebase-heartbeat-store";let ce=null;function kt(){return ce||(ce=L(si,ii,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(K)}catch(n){console.warn(n)}}}}).catch(t=>{throw S.create("idb-open",{originalErrorMessage:t.message})})),ce}async function ri(t){try{const n=(await kt()).transaction(K),s=await n.objectStore(K).get(At(t));return await n.done,s}catch(e){if(e instanceof x)E.warn(e.message);else{const n=S.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});E.warn(n.message)}}}async function Ye(t,e){try{const s=(await kt()).transaction(K,"readwrite");await s.objectStore(K).put(e,At(t)),await s.done}catch(n){if(n instanceof x)E.warn(n.message);else{const s=S.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});E.warn(s.message)}}}function At(t){return"".concat(t.name,"!").concat(t.options.appId)}/**
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
 */const ai=1024,oi=30*24*60*60*1e3;class ci{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new ui(n),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,n,s;try{const r=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=Qe();return console.log("heartbeats",(e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats),((n=this._heartbeatsCache)===null||n===void 0?void 0:n.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((s=this._heartbeatsCache)===null||s===void 0?void 0:s.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(o=>o.date===a)?void 0:(this._heartbeatsCache.heartbeats.push({date:a,agent:r}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const c=new Date(o.date).valueOf();return Date.now()-c<=oi}),this._storage.overwrite(this._heartbeatsCache))}catch(i){E.warn(i)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=Qe(),{heartbeatsToSend:s,unsentEntries:i}=li(this._heartbeatsCache.heartbeats),r=vt(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(n){return E.warn(n),""}}}function Qe(){return new Date().toISOString().substring(0,10)}function li(t,e=ai){const n=[];let s=t.slice();for(const i of t){const r=n.find(a=>a.agent===i.agent);if(r){if(r.dates.push(i.date),Xe(n)>e){r.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),Xe(n)>e){n.pop();break}s=s.slice(1)}return{heartbeatsToSend:n,unsentEntries:s}}class ui{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return It()?St().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await ri(this.app);return n!=null&&n.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Ye(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return Ye(this.app,{lastSentHeartbeatDate:(n=e.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Xe(t){return vt(JSON.stringify({version:2,heartbeats:t})).length}/**
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
 */function hi(t){C(new v("platform-logger",e=>new Ts(e),"PRIVATE")),C(new v("heartbeat",e=>new ci(e),"PRIVATE")),T(_e,ze,t),T(_e,ze,"esm2017"),T("fire-js","")}hi("");var di="firebase",fi="10.13.0";/**
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
 */T(di,fi,"app");function pi(){return Ct(Xn)}const Dt="@firebase/installations",Ce="0.6.8";/**
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
 */const Rt=1e4,Ot="w:".concat(Ce),Nt="FIS_v2",gi="https://firebaseinstallations.googleapis.com/v1",mi=60*60*1e3,bi="installations",wi="Installations";/**
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
 */const yi={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},O=new V(bi,wi,yi);function Mt(t){return t instanceof x&&t.code.includes("request-failed")}/**
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
 */function Lt({projectId:t}){return"".concat(gi,"/projects/").concat(t,"/installations")}function Pt(t){return{token:t.token,requestStatus:2,expiresIn:vi(t.expiresIn),creationTime:Date.now()}}async function xt(t,e){const s=(await e.json()).error;return O.create("request-failed",{requestName:t,serverCode:s.code,serverMessage:s.message,serverStatus:s.status})}function $t({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function _i(t,{refreshToken:e}){const n=$t(t);return n.append("Authorization",Ei(e)),n}async function Bt(t){const e=await t();return e.status>=500&&e.status<600?t():e}function vi(t){return Number(t.replace("s","000"))}function Ei(t){return"".concat(Nt," ").concat(t)}/**
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
 */async function Ii({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const s=Lt(t),i=$t(t),r=e.getImmediate({optional:!0});if(r){const u=await r.getHeartbeatsHeader();u&&i.append("x-firebase-client",u)}const a={fid:n,authVersion:Nt,appId:t.appId,sdkVersion:Ot},o={method:"POST",headers:i,body:JSON.stringify(a)},c=await Bt(()=>fetch(s,o));if(c.ok){const u=await c.json();return{fid:u.fid||n,registrationStatus:2,refreshToken:u.refreshToken,authToken:Pt(u.authToken)}}else throw await xt("Create Installation",c)}/**
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
 */function Ft(t){return new Promise(e=>{setTimeout(e,t)})}/**
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
 */function Si(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const Ti=/^[cdef][\w-]{21}$/,Ie="";function Ci(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=ki(t);return Ti.test(n)?n:Ie}catch(t){return Ie}}function ki(t){return Si(t).substr(0,22)}/**
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
 */function ee(t){return"".concat(t.appName,"!").concat(t.appId)}/**
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
 */const Ut=new Map;function jt(t,e){const n=ee(t);Kt(n,e),Ai(n,e)}function Kt(t,e){const n=Ut.get(t);if(n)for(const s of n)s(e)}function Ai(t,e){const n=Di();n&&n.postMessage({key:t,fid:e}),Ri()}let D=null;function Di(){return!D&&"BroadcastChannel"in self&&(D=new BroadcastChannel("[Firebase] FID Change"),D.onmessage=t=>{Kt(t.data.key,t.data.fid)}),D}function Ri(){Ut.size===0&&D&&(D.close(),D=null)}/**
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
 */const Oi="firebase-installations-database",Ni=1,N="firebase-installations-store";let le=null;function ke(){return le||(le=L(Oi,Ni,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(N)}}})),le}async function Q(t,e){const n=ee(t),i=(await ke()).transaction(N,"readwrite"),r=i.objectStore(N),a=await r.get(n);return await r.put(e,n),await i.done,(!a||a.fid!==e.fid)&&jt(t,e.fid),e}async function Ht(t){const e=ee(t),s=(await ke()).transaction(N,"readwrite");await s.objectStore(N).delete(e),await s.done}async function te(t,e){const n=ee(t),i=(await ke()).transaction(N,"readwrite"),r=i.objectStore(N),a=await r.get(n),o=e(a);return o===void 0?await r.delete(n):await r.put(o,n),await i.done,o&&(!a||a.fid!==o.fid)&&jt(t,o.fid),o}/**
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
 */async function Ae(t){let e;const n=await te(t.appConfig,s=>{const i=Mi(s),r=Li(t,i);return e=r.registrationPromise,r.installationEntry});return n.fid===Ie?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function Mi(t){const e=t||{fid:Ci(),registrationStatus:0};return qt(e)}function Li(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(O.create("app-offline"));return{installationEntry:e,registrationPromise:i}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},s=Pi(t,n);return{installationEntry:n,registrationPromise:s}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:xi(t)}:{installationEntry:e}}async function Pi(t,e){try{const n=await Ii(t,e);return Q(t.appConfig,n)}catch(n){throw Mt(n)&&n.customData.serverCode===409?await Ht(t.appConfig):await Q(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function xi(t){let e=await Ze(t.appConfig);for(;e.registrationStatus===1;)await Ft(100),e=await Ze(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:s}=await Ae(t);return s||n}return e}function Ze(t){return te(t,e=>{if(!e)throw O.create("installation-not-found");return qt(e)})}function qt(t){return $i(t)?{fid:t.fid,registrationStatus:0}:t}function $i(t){return t.registrationStatus===1&&t.registrationTime+Rt<Date.now()}/**
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
 */async function Bi({appConfig:t,heartbeatServiceProvider:e},n){const s=Fi(t,n),i=_i(t,n),r=e.getImmediate({optional:!0});if(r){const u=await r.getHeartbeatsHeader();u&&i.append("x-firebase-client",u)}const a={installation:{sdkVersion:Ot,appId:t.appId}},o={method:"POST",headers:i,body:JSON.stringify(a)},c=await Bt(()=>fetch(s,o));if(c.ok){const u=await c.json();return Pt(u)}else throw await xt("Generate Auth Token",c)}function Fi(t,{fid:e}){return"".concat(Lt(t),"/").concat(e,"/authTokens:generate")}/**
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
 */async function De(t,e=!1){let n;const s=await te(t.appConfig,r=>{if(!Wt(r))throw O.create("not-registered");const a=r.authToken;if(!e&&Ki(a))return r;if(a.requestStatus===1)return n=Ui(t,e),r;{if(!navigator.onLine)throw O.create("app-offline");const o=qi(r);return n=ji(t,o),o}});return n?await n:s.authToken}async function Ui(t,e){let n=await et(t.appConfig);for(;n.authToken.requestStatus===1;)await Ft(100),n=await et(t.appConfig);const s=n.authToken;return s.requestStatus===0?De(t,e):s}function et(t){return te(t,e=>{if(!Wt(e))throw O.create("not-registered");const n=e.authToken;return Wi(n)?Object.assign(Object.assign({},e),{authToken:{requestStatus:0}}):e})}async function ji(t,e){try{const n=await Bi(t,e),s=Object.assign(Object.assign({},e),{authToken:n});return await Q(t.appConfig,s),n}catch(n){if(Mt(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await Ht(t.appConfig);else{const s=Object.assign(Object.assign({},e),{authToken:{requestStatus:0}});await Q(t.appConfig,s)}throw n}}function Wt(t){return t!==void 0&&t.registrationStatus===2}function Ki(t){return t.requestStatus===2&&!Hi(t)}function Hi(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+mi}function qi(t){const e={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},t),{authToken:e})}function Wi(t){return t.requestStatus===1&&t.requestTime+Rt<Date.now()}/**
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
 */async function Vi(t){const e=t,{installationEntry:n,registrationPromise:s}=await Ae(e);return s?s.catch(console.error):De(e).catch(console.error),n.fid}/**
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
 */async function Gi(t,e=!1){const n=t;return await zi(n),(await De(n,e)).token}async function zi(t){const{registrationPromise:e}=await Ae(t);e&&await e}/**
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
 */function Ji(t){if(!t||!t.options)throw ue("App Configuration");if(!t.name)throw ue("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw ue(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function ue(t){return O.create("missing-app-config-values",{valueName:t})}/**
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
 */const Vt="installations",Yi="installations-internal",Qi=t=>{const e=t.getProvider("app").getImmediate(),n=Ji(e),s=Te(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:s,_delete:()=>Promise.resolve()}},Xi=t=>{const e=t.getProvider("app").getImmediate(),n=Te(e,Vt).getImmediate();return{getId:()=>Vi(n),getToken:i=>Gi(n,i)}};function Zi(){C(new v(Vt,Qi,"PUBLIC")),C(new v(Yi,Xi,"PRIVATE"))}Zi();T(Dt,Ce);T(Dt,Ce,"esm2017");/**
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
 */const Gt="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",er="https://fcmregistrations.googleapis.com/v1",zt="FCM_MSG",tr="google.c.a.c_id",nr=3,sr=1;var X;(function(t){t[t.DATA_MESSAGE=1]="DATA_MESSAGE",t[t.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(X||(X={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var Z;(function(t){t.PUSH_RECEIVED="push-received",t.NOTIFICATION_CLICKED="notification-clicked"})(Z||(Z={}));/**
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
 */function m(t){const e=new Uint8Array(t);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function ir(t){const e="=".repeat((4-t.length%4)%4),n=(t+e).replace(/\-/g,"+").replace(/_/g,"/"),s=atob(n),i=new Uint8Array(s.length);for(let r=0;r<s.length;++r)i[r]=s.charCodeAt(r);return i}/**
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
 */const he="fcm_token_details_db",rr=5,tt="fcm_token_object_Store";async function ar(t){if("databases"in indexedDB&&!(await indexedDB.databases()).map(r=>r.name).includes(he))return null;let e=null;return(await L(he,rr,{upgrade:async(s,i,r,a)=>{var o;if(i<2||!s.objectStoreNames.contains(tt))return;const c=a.objectStore(tt),u=await c.index("fcmSenderId").get(t);if(await c.clear(),!!u){if(i===2){const l=u;if(!l.auth||!l.p256dh||!l.endpoint)return;e={token:l.fcmToken,createTime:(o=l.createTime)!==null&&o!==void 0?o:Date.now(),subscriptionOptions:{auth:l.auth,p256dh:l.p256dh,endpoint:l.endpoint,swScope:l.swScope,vapidKey:typeof l.vapidKey=="string"?l.vapidKey:m(l.vapidKey)}}}else if(i===3){const l=u;e={token:l.fcmToken,createTime:l.createTime,subscriptionOptions:{auth:m(l.auth),p256dh:m(l.p256dh),endpoint:l.endpoint,swScope:l.swScope,vapidKey:m(l.vapidKey)}}}else if(i===4){const l=u;e={token:l.fcmToken,createTime:l.createTime,subscriptionOptions:{auth:m(l.auth),p256dh:m(l.p256dh),endpoint:l.endpoint,swScope:l.swScope,vapidKey:m(l.vapidKey)}}}}}})).close(),await R(he),await R("fcm_vapid_details_db"),await R("undefined"),or(e)?e:null}function or(t){if(!t||!t.subscriptionOptions)return!1;const{subscriptionOptions:e}=t;return typeof t.createTime=="number"&&t.createTime>0&&typeof t.token=="string"&&t.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}/**
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
 */const cr="firebase-messaging-database",lr=1,M="firebase-messaging-store";let de=null;function Re(){return de||(de=L(cr,lr,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(M)}}})),de}async function Oe(t){const e=Me(t),s=await(await Re()).transaction(M).objectStore(M).get(e);if(s)return s;{const i=await ar(t.appConfig.senderId);if(i)return await Ne(t,i),i}}async function Ne(t,e){const n=Me(t),i=(await Re()).transaction(M,"readwrite");return await i.objectStore(M).put(e,n),await i.done,e}async function ur(t){const e=Me(t),s=(await Re()).transaction(M,"readwrite");await s.objectStore(M).delete(e),await s.done}function Me({appConfig:t}){return t.appId}/**
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
 */const hr={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},g=new V("messaging","Messaging",hr);/**
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
 */async function dr(t,e){const n=await Pe(t),s=Yt(e),i={method:"POST",headers:n,body:JSON.stringify(s)};let r;try{r=await(await fetch(Le(t.appConfig),i)).json()}catch(a){throw g.create("token-subscribe-failed",{errorInfo:a==null?void 0:a.toString()})}if(r.error){const a=r.error.message;throw g.create("token-subscribe-failed",{errorInfo:a})}if(!r.token)throw g.create("token-subscribe-no-token");return r.token}async function fr(t,e){const n=await Pe(t),s=Yt(e.subscriptionOptions),i={method:"PATCH",headers:n,body:JSON.stringify(s)};let r;try{r=await(await fetch("".concat(Le(t.appConfig),"/").concat(e.token),i)).json()}catch(a){throw g.create("token-update-failed",{errorInfo:a==null?void 0:a.toString()})}if(r.error){const a=r.error.message;throw g.create("token-update-failed",{errorInfo:a})}if(!r.token)throw g.create("token-update-no-token");return r.token}async function Jt(t,e){const s={method:"DELETE",headers:await Pe(t)};try{const r=await(await fetch("".concat(Le(t.appConfig),"/").concat(e),s)).json();if(r.error){const a=r.error.message;throw g.create("token-unsubscribe-failed",{errorInfo:a})}}catch(i){throw g.create("token-unsubscribe-failed",{errorInfo:i==null?void 0:i.toString()})}}function Le({projectId:t}){return"".concat(er,"/projects/").concat(t,"/registrations")}async function Pe({appConfig:t,installations:e}){const n=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t.apiKey,"x-goog-firebase-installations-auth":"FIS ".concat(n)})}function Yt({p256dh:t,auth:e,endpoint:n,vapidKey:s}){const i={web:{endpoint:n,auth:e,p256dh:t}};return s!==Gt&&(i.web.applicationPubKey=s),i}/**
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
 */const pr=7*24*60*60*1e3;async function gr(t){const e=await br(t.swRegistration,t.vapidKey),n={vapidKey:t.vapidKey,swScope:t.swRegistration.scope,endpoint:e.endpoint,auth:m(e.getKey("auth")),p256dh:m(e.getKey("p256dh"))},s=await Oe(t.firebaseDependencies);if(s){if(wr(s.subscriptionOptions,n))return Date.now()>=s.createTime+pr?mr(t,{token:s.token,createTime:Date.now(),subscriptionOptions:n}):s.token;try{await Jt(t.firebaseDependencies,s.token)}catch(i){console.warn(i)}return st(t.firebaseDependencies,n)}else return st(t.firebaseDependencies,n)}async function nt(t){const e=await Oe(t.firebaseDependencies);e&&(await Jt(t.firebaseDependencies,e.token),await ur(t.firebaseDependencies));const n=await t.swRegistration.pushManager.getSubscription();return n?n.unsubscribe():!0}async function mr(t,e){try{const n=await fr(t.firebaseDependencies,e),s=Object.assign(Object.assign({},e),{token:n,createTime:Date.now()});return await Ne(t.firebaseDependencies,s),n}catch(n){throw n}}async function st(t,e){const s={token:await dr(t,e),createTime:Date.now(),subscriptionOptions:e};return await Ne(t,s),s.token}async function br(t,e){const n=await t.pushManager.getSubscription();return n||t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:ir(e)})}function wr(t,e){const n=e.vapidKey===t.vapidKey,s=e.endpoint===t.endpoint,i=e.auth===t.auth,r=e.p256dh===t.p256dh;return n&&s&&i&&r}/**
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
 */function yr(t){const e={from:t.from,collapseKey:t.collapse_key,messageId:t.fcmMessageId};return _r(e,t),vr(e,t),Er(e,t),e}function _r(t,e){if(!e.notification)return;t.notification={};const n=e.notification.title;n&&(t.notification.title=n);const s=e.notification.body;s&&(t.notification.body=s);const i=e.notification.image;i&&(t.notification.image=i);const r=e.notification.icon;r&&(t.notification.icon=r)}function vr(t,e){e.data&&(t.data=e.data)}function Er(t,e){var n,s,i,r,a;if(!e.fcmOptions&&!(!((n=e.notification)===null||n===void 0)&&n.click_action))return;t.fcmOptions={};const o=(i=(s=e.fcmOptions)===null||s===void 0?void 0:s.link)!==null&&i!==void 0?i:(r=e.notification)===null||r===void 0?void 0:r.click_action;o&&(t.fcmOptions.link=o);const c=(a=e.fcmOptions)===null||a===void 0?void 0:a.analytics_label;c&&(t.fcmOptions.analyticsLabel=c)}/**
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
 */function Ir(t){return typeof t=="object"&&!!t&&tr in t}/**
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
 */function Sr(t){return new Promise(e=>{setTimeout(e,t)})}/**
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
 */Qt("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o");Qt("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");async function Tr(t,e){const n=Cr(e,await t.firebaseDependencies.installations.getId());kr(t,n,e.productId)}function Cr(t,e){var n,s;const i={};return t.from&&(i.project_number=t.from),t.fcmMessageId&&(i.message_id=t.fcmMessageId),i.instance_id=e,t.notification?i.message_type=X.DISPLAY_NOTIFICATION.toString():i.message_type=X.DATA_MESSAGE.toString(),i.sdk_platform=nr.toString(),i.package_name=self.origin.replace(/(^\w+:|^)\/\//,""),t.collapse_key&&(i.collapse_key=t.collapse_key),i.event=sr.toString(),!((n=t.fcmOptions)===null||n===void 0)&&n.analytics_label&&(i.analytics_label=(s=t.fcmOptions)===null||s===void 0?void 0:s.analytics_label),i}function kr(t,e,n){const s={};s.event_time_ms=Math.floor(Date.now()).toString(),s.source_extension_json_proto3=JSON.stringify(e),n&&(s.compliance_data=Ar(n)),t.logEvents.push(s)}function Ar(t){return{privacy_context:{prequest:{origin_associated_product_id:t}}}}function Qt(t,e){const n=[];for(let s=0;s<t.length;s++)n.push(t.charAt(s)),s<e.length&&n.push(e.charAt(s));return n.join("")}/**
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
 */async function Dr(t,e){var n,s;const{newSubscription:i}=t;if(!i){await nt(e);return}const r=await Oe(e.firebaseDependencies);await nt(e),e.vapidKey=(s=(n=r==null?void 0:r.subscriptionOptions)===null||n===void 0?void 0:n.vapidKey)!==null&&s!==void 0?s:Gt,await gr(e)}async function Rr(t,e){const n=Mr(t);if(!n)return;e.deliveryMetricsExportedToBigQueryEnabled&&await Tr(e,n);const s=await Xt();if(Pr(s))return xr(s,n);if(n.notification&&await $r(Nr(n)),!!e&&e.onBackgroundMessageHandler){const i=yr(n);typeof e.onBackgroundMessageHandler=="function"?await e.onBackgroundMessageHandler(i):e.onBackgroundMessageHandler.next(i)}}async function Or(t){var e,n;const s=(n=(e=t.notification)===null||e===void 0?void 0:e.data)===null||n===void 0?void 0:n[zt];if(s){if(t.action)return}else return;t.stopImmediatePropagation(),t.notification.close();const i=Br(s);if(!i)return;const r=new URL(i,self.location.href),a=new URL(self.location.origin);if(r.host!==a.host)return;let o=await Lr(r);if(o?o=await o.focus():(o=await self.clients.openWindow(i),await Sr(3e3)),!!o)return s.messageType=Z.NOTIFICATION_CLICKED,s.isFirebaseMessaging=!0,o.postMessage(s)}function Nr(t){const e=Object.assign({},t.notification);return e.data={[zt]:t},e}function Mr({data:t}){if(!t)return null;try{return t.json()}catch(e){return null}}async function Lr(t){const e=await Xt();for(const n of e){const s=new URL(n.url,self.location.href);if(t.host===s.host)return n}return null}function Pr(t){return t.some(e=>e.visibilityState==="visible"&&!e.url.startsWith("chrome-extension://"))}function xr(t,e){e.isFirebaseMessaging=!0,e.messageType=Z.PUSH_RECEIVED;for(const n of t)n.postMessage(e)}function Xt(){return self.clients.matchAll({type:"window",includeUncontrolled:!0})}function $r(t){var e;const{actions:n}=t,{maxActions:s}=Notification;return n&&s&&n.length>s&&console.warn("This browser only supports ".concat(s," actions. The remaining actions will not be displayed.")),self.registration.showNotification((e=t.title)!==null&&e!==void 0?e:"",t)}function Br(t){var e,n,s;const i=(n=(e=t.fcmOptions)===null||e===void 0?void 0:e.link)!==null&&n!==void 0?n:(s=t.notification)===null||s===void 0?void 0:s.click_action;return i||(Ir(t.data)?self.location.origin:null)}/**
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
 */function Fr(t){if(!t||!t.options)throw fe("App Configuration Object");if(!t.name)throw fe("App Name");const e=["projectId","apiKey","appId","messagingSenderId"],{options:n}=t;for(const s of e)if(!n[s])throw fe(s);return{appName:t.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function fe(t){return g.create("missing-app-config-values",{valueName:t})}/**
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
 */let Ur=class{constructor(e,n,s){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const i=Fr(e);this.firebaseDependencies={app:e,appConfig:i,installations:n,analyticsProvider:s}}_delete(){return Promise.resolve()}};/**
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
 */const jr=t=>{const e=new Ur(t.getProvider("app").getImmediate(),t.getProvider("installations-internal").getImmediate(),t.getProvider("analytics-internal"));return self.addEventListener("push",n=>{n.waitUntil(Rr(n,e))}),self.addEventListener("pushsubscriptionchange",n=>{n.waitUntil(Dr(n,e))}),self.addEventListener("notificationclick",n=>{n.waitUntil(Or(n))}),e};function Kr(){C(new v("messaging-sw",jr,"PUBLIC"))}/**
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
 */async function Hr(){return It()&&await St()&&"PushManager"in self&&"Notification"in self&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}/**
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
 */function qr(t=ni()){return Hr().then(e=>{if(!e)throw g.create("unsupported-browser")},e=>{throw g.create("indexed-db-unsupported")}),Te(Tt(t),"messaging-sw").getImmediate()}/**
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
 */Kr();/**
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
 */const Wr="/firebase-messaging-sw.js",Vr="/firebase-cloud-messaging-push-scope",Zt="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",Gr="https://fcmregistrations.googleapis.com/v1",en="google.c.a.c_id",zr="google.c.a.c_l",Jr="google.c.a.ts",Yr="google.c.a.e";var it;(function(t){t[t.DATA_MESSAGE=1]="DATA_MESSAGE",t[t.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(it||(it={}));/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */var H;(function(t){t.PUSH_RECEIVED="push-received",t.NOTIFICATION_CLICKED="notification-clicked"})(H||(H={}));/**
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
 */function b(t){const e=new Uint8Array(t);return btoa(String.fromCharCode(...e)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function Qr(t){const e="=".repeat((4-t.length%4)%4),n=(t+e).replace(/\-/g,"+").replace(/_/g,"/"),s=atob(n),i=new Uint8Array(s.length);for(let r=0;r<s.length;++r)i[r]=s.charCodeAt(r);return i}/**
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
 */const pe="fcm_token_details_db",Xr=5,rt="fcm_token_object_Store";async function Zr(t){if("databases"in indexedDB&&!(await indexedDB.databases()).map(r=>r.name).includes(pe))return null;let e=null;return(await L(pe,Xr,{upgrade:async(s,i,r,a)=>{var o;if(i<2||!s.objectStoreNames.contains(rt))return;const c=a.objectStore(rt),u=await c.index("fcmSenderId").get(t);if(await c.clear(),!!u){if(i===2){const l=u;if(!l.auth||!l.p256dh||!l.endpoint)return;e={token:l.fcmToken,createTime:(o=l.createTime)!==null&&o!==void 0?o:Date.now(),subscriptionOptions:{auth:l.auth,p256dh:l.p256dh,endpoint:l.endpoint,swScope:l.swScope,vapidKey:typeof l.vapidKey=="string"?l.vapidKey:b(l.vapidKey)}}}else if(i===3){const l=u;e={token:l.fcmToken,createTime:l.createTime,subscriptionOptions:{auth:b(l.auth),p256dh:b(l.p256dh),endpoint:l.endpoint,swScope:l.swScope,vapidKey:b(l.vapidKey)}}}else if(i===4){const l=u;e={token:l.fcmToken,createTime:l.createTime,subscriptionOptions:{auth:b(l.auth),p256dh:b(l.p256dh),endpoint:l.endpoint,swScope:l.swScope,vapidKey:b(l.vapidKey)}}}}}})).close(),await R(pe),await R("fcm_vapid_details_db"),await R("undefined"),ea(e)?e:null}function ea(t){if(!t||!t.subscriptionOptions)return!1;const{subscriptionOptions:e}=t;return typeof t.createTime=="number"&&t.createTime>0&&typeof t.token=="string"&&t.token.length>0&&typeof e.auth=="string"&&e.auth.length>0&&typeof e.p256dh=="string"&&e.p256dh.length>0&&typeof e.endpoint=="string"&&e.endpoint.length>0&&typeof e.swScope=="string"&&e.swScope.length>0&&typeof e.vapidKey=="string"&&e.vapidKey.length>0}/**
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
 */const ta="firebase-messaging-database",na=1,q="firebase-messaging-store";let ge=null;function tn(){return ge||(ge=L(ta,na,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(q)}}})),ge}async function sa(t){const e=nn(t),s=await(await tn()).transaction(q).objectStore(q).get(e);if(s)return s;{const i=await Zr(t.appConfig.senderId);if(i)return await xe(t,i),i}}async function xe(t,e){const n=nn(t),i=(await tn()).transaction(q,"readwrite");return await i.objectStore(q).put(e,n),await i.done,e}function nn({appConfig:t}){return t.appId}/**
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
 */const ia={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used."},p=new V("messaging","Messaging",ia);/**
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
 */async function ra(t,e){const n=await Be(t),s=sn(e),i={method:"POST",headers:n,body:JSON.stringify(s)};let r;try{r=await(await fetch($e(t.appConfig),i)).json()}catch(a){throw p.create("token-subscribe-failed",{errorInfo:a==null?void 0:a.toString()})}if(r.error){const a=r.error.message;throw p.create("token-subscribe-failed",{errorInfo:a})}if(!r.token)throw p.create("token-subscribe-no-token");return r.token}async function aa(t,e){const n=await Be(t),s=sn(e.subscriptionOptions),i={method:"PATCH",headers:n,body:JSON.stringify(s)};let r;try{r=await(await fetch("".concat($e(t.appConfig),"/").concat(e.token),i)).json()}catch(a){throw p.create("token-update-failed",{errorInfo:a==null?void 0:a.toString()})}if(r.error){const a=r.error.message;throw p.create("token-update-failed",{errorInfo:a})}if(!r.token)throw p.create("token-update-no-token");return r.token}async function oa(t,e){const s={method:"DELETE",headers:await Be(t)};try{const r=await(await fetch("".concat($e(t.appConfig),"/").concat(e),s)).json();if(r.error){const a=r.error.message;throw p.create("token-unsubscribe-failed",{errorInfo:a})}}catch(i){throw p.create("token-unsubscribe-failed",{errorInfo:i==null?void 0:i.toString()})}}function $e({projectId:t}){return"".concat(Gr,"/projects/").concat(t,"/registrations")}async function Be({appConfig:t,installations:e}){const n=await e.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t.apiKey,"x-goog-firebase-installations-auth":"FIS ".concat(n)})}function sn({p256dh:t,auth:e,endpoint:n,vapidKey:s}){const i={web:{endpoint:n,auth:e,p256dh:t}};return s!==Zt&&(i.web.applicationPubKey=s),i}/**
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
 */const ca=7*24*60*60*1e3;async function la(t){const e=await ha(t.swRegistration,t.vapidKey),n={vapidKey:t.vapidKey,swScope:t.swRegistration.scope,endpoint:e.endpoint,auth:b(e.getKey("auth")),p256dh:b(e.getKey("p256dh"))},s=await sa(t.firebaseDependencies);if(s){if(da(s.subscriptionOptions,n))return Date.now()>=s.createTime+ca?ua(t,{token:s.token,createTime:Date.now(),subscriptionOptions:n}):s.token;try{await oa(t.firebaseDependencies,s.token)}catch(i){console.warn(i)}return at(t.firebaseDependencies,n)}else return at(t.firebaseDependencies,n)}async function ua(t,e){try{const n=await aa(t.firebaseDependencies,e),s=Object.assign(Object.assign({},e),{token:n,createTime:Date.now()});return await xe(t.firebaseDependencies,s),n}catch(n){throw n}}async function at(t,e){const s={token:await ra(t,e),createTime:Date.now(),subscriptionOptions:e};return await xe(t,s),s.token}async function ha(t,e){const n=await t.pushManager.getSubscription();return n||t.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Qr(e)})}function da(t,e){const n=e.vapidKey===t.vapidKey,s=e.endpoint===t.endpoint,i=e.auth===t.auth,r=e.p256dh===t.p256dh;return n&&s&&i&&r}/**
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
 */function ot(t){const e={from:t.from,collapseKey:t.collapse_key,messageId:t.fcmMessageId};return fa(e,t),pa(e,t),ga(e,t),e}function fa(t,e){if(!e.notification)return;t.notification={};const n=e.notification.title;n&&(t.notification.title=n);const s=e.notification.body;s&&(t.notification.body=s);const i=e.notification.image;i&&(t.notification.image=i);const r=e.notification.icon;r&&(t.notification.icon=r)}function pa(t,e){e.data&&(t.data=e.data)}function ga(t,e){var n,s,i,r,a;if(!e.fcmOptions&&!(!((n=e.notification)===null||n===void 0)&&n.click_action))return;t.fcmOptions={};const o=(i=(s=e.fcmOptions)===null||s===void 0?void 0:s.link)!==null&&i!==void 0?i:(r=e.notification)===null||r===void 0?void 0:r.click_action;o&&(t.fcmOptions.link=o);const c=(a=e.fcmOptions)===null||a===void 0?void 0:a.analytics_label;c&&(t.fcmOptions.analyticsLabel=c)}/**
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
 */function ma(t){return typeof t=="object"&&!!t&&en in t}/**
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
 */rn("hts/frbslgigp.ogepscmv/ieo/eaylg","tp:/ieaeogn-agolai.o/1frlglgc/o");rn("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");function rn(t,e){const n=[];for(let s=0;s<t.length;s++)n.push(t.charAt(s)),s<e.length&&n.push(e.charAt(s));return n.join("")}/**
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
 */function ba(t){if(!t||!t.options)throw me("App Configuration Object");if(!t.name)throw me("App Name");const e=["projectId","apiKey","appId","messagingSenderId"],{options:n}=t;for(const s of e)if(!n[s])throw me(s);return{appName:t.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function me(t){return p.create("missing-app-config-values",{valueName:t})}/**
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
 */class wa{constructor(e,n,s){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.logEvents=[],this.isLogServiceStarted=!1;const i=ba(e);this.firebaseDependencies={app:e,appConfig:i,installations:n,analyticsProvider:s}}_delete(){return Promise.resolve()}}/**
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
 */async function ya(t){try{t.swRegistration=await navigator.serviceWorker.register(Wr,{scope:Vr}),t.swRegistration.update().catch(()=>{})}catch(e){throw p.create("failed-service-worker-registration",{browserErrorMessage:e==null?void 0:e.message})}}/**
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
 */async function _a(t,e){if(!e&&!t.swRegistration&&await ya(t),!(!e&&t.swRegistration)){if(!(e instanceof ServiceWorkerRegistration))throw p.create("invalid-sw-registration");t.swRegistration=e}}/**
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
 */async function va(t,e){e?t.vapidKey=e:t.vapidKey||(t.vapidKey=Zt)}/**
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
 */async function an(t,e){if(!navigator)throw p.create("only-available-in-window");if(Notification.permission==="default"&&await Notification.requestPermission(),Notification.permission!=="granted")throw p.create("permission-blocked");return await va(t,e==null?void 0:e.vapidKey),await _a(t,e==null?void 0:e.serviceWorkerRegistration),la(t)}/**
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
 */async function Ea(t,e,n){const s=Ia(e);(await t.firebaseDependencies.analyticsProvider.get()).logEvent(s,{message_id:n[en],message_name:n[zr],message_time:n[Jr],message_device_time:Math.floor(Date.now()/1e3)})}function Ia(t){switch(t){case H.NOTIFICATION_CLICKED:return"notification_open";case H.PUSH_RECEIVED:return"notification_foreground";default:throw new Error}}/**
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
 */async function Sa(t,e){const n=e.data;if(!n.isFirebaseMessaging)return;t.onMessageHandler&&n.messageType===H.PUSH_RECEIVED&&(typeof t.onMessageHandler=="function"?t.onMessageHandler(ot(n)):t.onMessageHandler.next(ot(n)));const s=n.data;ma(s)&&s[Yr]==="1"&&await Ea(t,n.messageType,s)}const ct="@firebase/messaging",lt="0.12.10";/**
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
 */const Ta=t=>{const e=new wa(t.getProvider("app").getImmediate(),t.getProvider("installations-internal").getImmediate(),t.getProvider("analytics-internal"));return navigator.serviceWorker.addEventListener("message",n=>Sa(e,n)),e},Ca=t=>{const e=t.getProvider("messaging").getImmediate();return{getToken:s=>an(e,s)}};function ka(){C(new v("messaging",Ta,"PUBLIC")),C(new v("messaging-internal",Ca,"PRIVATE")),T(ct,lt),T(ct,lt,"esm2017")}async function Aa(t,e){return t=Tt(t),an(t,e)}ka();function Da(t){self.addEventListener("notificationclick",function(n){console.warn("点击通知消息"),n.notification.close();const s=self.clients;n.waitUntil(s.matchAll({}).then(function(i){if(i.length<=0)return s.openWindow(es);i[0].focus()}))});const e=qr(t);return self.addEventListener("activate",async()=>{console.warn("Service Worker activate");const n=await ut(e);console.warn("activate FCM token"),console.warn(n),ht({"fcm-token":n})}),self.addEventListener("message",async n=>{if(n.data.type==="LOAD"){console.log("Received message from main thread:",n);const s=await ut(e);console.warn("load FCM token"),console.warn(s),ht({"fcm-token":s})}}),e}async function ut(t){return Aa(t,{vapidKey:Zn,serviceWorkerRegistration:self.registration}).then(e=>e||(console.warn("No registration token available. Request permission to generate one."),null)).catch(e=>(console.warn("An error occurred while retrieving token. ",e),null))}function ht(t){self.clients.matchAll().then(e=>{e.forEach(n=>{n.postMessage({type:"UPDATE_LOCAL_STORAGE",payload:t})})})}console.warn("sw的代码开始执行");Pn([{"revision":"6251d1b4c11761f759b84e794b20df1f","url":"icon-192x192.png"},{"revision":"f5b0dba5bad4c9db2a51c8c417ada26c","url":"icon-512x512.png"},{"revision":"c40816541037dc67478ae4a8c2df1db2","url":"manifest.webmanifest"}]);Mn();ns();self.skipWaiting();$n();const Ra=pi();Da(Ra);
//# sourceMappingURL=sw.js.map
