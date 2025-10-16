!function(e){var r={}
function __webpack_require__(t){if(r[t])return r[t].exports
var o=r[t]={i:t,l:!1,exports:{}},n=!0
try{e[t].call(o.exports,o,o.exports,__webpack_require__),n=!1}finally{n&&delete r[t]}return o.l=!0,o.exports}__webpack_require__.m=e,__webpack_require__.c=r,__webpack_require__.d=function(e,r,t){__webpack_require__.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},__webpack_require__.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},__webpack_require__.t=function(e,r){if(1&r&&(e=__webpack_require__(e)),8&r)return e
if(4&r&&"object"==typeof e&&e&&e.__esModule)return e
var t=Object.create(null)
if(__webpack_require__.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)__webpack_require__.d(t,o,function(r){return e[r]}.bind(null,o))
return t},__webpack_require__.n=function(e){var r=e&&e.__esModule?function getDefault(){return e.default}:function getModuleExports(){return e}
return __webpack_require__.d(r,"a",r),r},__webpack_require__.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},__webpack_require__.p="/",__webpack_require__(__webpack_require__.s=1)}([function(e,r){function asyncGeneratorStep(e,r,t,o,n,a,i){try{var s=e[a](i),c=s.value}catch(e){return void t(e)}s.done?r(c):Promise.resolve(c).then(o,n)}e.exports=function _asyncToGenerator(e){return function(){var r=this,t=arguments
return new Promise(function(o,n){var a=e.apply(r,t)
function _next(e){asyncGeneratorStep(a,o,n,_next,_throw,"next",e)}function _throw(e){asyncGeneratorStep(a,o,n,_next,_throw,"throw",e)}_next(void 0)})}}},function(e,r,t){"use strict"
t.r(r)
const o={},n=(e,r)=>{o[e]&&(o[e]=o[e].filter(e=>r!==e))}
t(0)
const a=e=>new Promise(r=>{caches.match(e).then(t=>{r(t||(e=>fetch(e).then(r=>caches.open("catalog").then(t=>t.put(e,r.clone())).then(()=>r)))(e))})}),i=(e,r)=>(()=>navigator.connection&&"4g"===navigator.connection.effectiveType)()?Promise.all(e.urls.map(a)).then(e=>(r.ports[0].postMessage({status:"done"}),e)).catch(e=>(r.ports[0].postMessage({status:"error",message:JSON.stringify(e)}),null)):(r.ports[0].postMessage({status:"error",message:`Slow Network detected. Not pre-fetching images. ${e.urls}`}),null)
importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"),workbox.core.skipWaiting(),workbox.core.clientsClaim(),workbox.precaching.precacheAndRoute(self.__precacheManifest||[]),function(){(()=>new workbox.strategies.CacheFirst({cacheName:"catalog",plugins:[new workbox.expiration.Plugin({maxEntries:60,maxAgeSeconds:2592e3}),new workbox.cacheableResponse.Plugin({statuses:[0,200]})]}))()
workbox.routing.registerRoute(new RegExp("(robots.txt|favicon.ico|manifest.json)"),new workbox.strategies.StaleWhileRevalidate),workbox.routing.registerRoute(/\.(?:png|gif|jpg|jpeg|svg)$/,new workbox.strategies.CacheFirst({cacheName:"images",plugins:[new workbox.expiration.Plugin({maxEntries:60,maxAgeSeconds:2592e3})]})),workbox.routing.registerRoute(new RegExp(/\.js$/),new workbox.strategies.CacheFirst)}(),((e,r)=>(o[e]||(o[e]=[]),o[e].push(r),()=>n(e,r)))("PREFETCH_IMAGES",i),self.addEventListener("message",e=>{const{type:r,payload:t}=e.data;((e,r,t)=>{const n=o[e]
n&&n.forEach(e=>{e(r,t)})})(r,t,e)})}])
