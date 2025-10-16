(()=>{"use strict"
const e={}
function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}function toPropertyKey(e){var r=function toPrimitive(e,r){if("object"!=_typeof(e)||!e)return e
var t=e[Symbol.toPrimitive]
if(void 0!==t){var o=t.call(e,r||"default")
if("object"!=_typeof(o))return o
throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===r?String:Number)(e)}(e,"string")
return"symbol"==_typeof(r)?r:r+""}function _defineProperty(e,r,t){return(r=toPropertyKey(r))in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function ownKeys(e,r){var t=Object.keys(e)
if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e)
r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread2(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{}
r%2?ownKeys(Object(t),!0).forEach((function(r){_defineProperty(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}const r=["url","revision"]
!function setupWorkbox(){importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"),workbox.core.skipWaiting(),workbox.core.clientsClaim()
const e=[],t=/(\.[a-z0-9]{20}\.bundle\.(js|css)$|^(css\/)?(vendor~)?client\.[a-z0-9]{20}\.(js|css)$)/,o=e.map((e=>{let{url:o,revision:n}=e
return _objectSpread2(_objectSpread2({url:o},function _objectWithoutProperties(e,r){if(null==e)return{}
var t,o,n=function _objectWithoutPropertiesLoose(e,r){if(null==e)return{}
var t={}
for(var o in e)if({}.hasOwnProperty.call(e,o)){if(r.includes(o))continue
t[o]=e[o]}return t}(e,r)
if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e)
for(o=0;o<i.length;o++)t=i[o],r.includes(t)||{}.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}(e,r)),{},{revision:t.test(o)?null:n})}))
workbox.precaching.precacheAndRoute(o||[])}(),function registerRoutes(){new workbox.strategies.CacheFirst({cacheName:"catalog",plugins:[new workbox.expiration.Plugin({maxEntries:60,maxAgeSeconds:2592e3}),new workbox.cacheableResponse.Plugin({statuses:[0,200]})]}),workbox.routing.registerRoute(new RegExp("/adminhtml/"),new workbox.strategies.NetworkOnly),workbox.routing.registerRoute(new RegExp("(robots.txt|favicon.ico|manifest.json|translation.json)"),new workbox.strategies.StaleWhileRevalidate),workbox.routing.registerRoute(new RegExp("graphql"),new workbox.strategies.NetworkFirst({cacheName:"graphql",plugins:[new workbox.expiration.Plugin({maxEntries:30,maxAgeSeconds:3600,purgeOnQuotaError:!0})]})),workbox.routing.registerRoute(new RegExp(/\.(js|css)$/),new workbox.strategies.CacheFirst(new workbox.expiration.Plugin({maxEntries:100,maxAgeSeconds:300,purgeOnQuotaError:!0}))),workbox.routing.registerRoute((({url:e})=>(e=>(e=>"/"===e.pathname)(e)||new RegExp(".html$").test(e.pathname))(e)),new workbox.strategies.NetworkFirst({cacheName:"html_cache",plugins:[new workbox.expiration.Plugin({maxEntries:30,maxAgeSeconds:3600,purgeOnQuotaError:!0})]}))}(),self.addEventListener("message",(r=>{const{type:t,payload:o}=r.data;((r,t,o)=>{const n=e[r]
n&&n.forEach((e=>{e(t,o)}))})(t,o,r)}))})()
