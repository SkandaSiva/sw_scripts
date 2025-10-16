importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");workbox.core.setCacheNameDetails({prefix:"gatsby-plugin-offline"});workbox.core.skipWaiting();workbox.core.clientsClaim();self.__precacheManifest=[{"url":"webpack-runtime-7c5116f63d4cf43b516c.js"},{"url":"framework-35eb64f0e3f477cea97b.js"},{"url":"styles.9593acf2f02eea61f732.css"},{"url":"app-2dfde279437ca5d05d2d.js"},{"url":"offline-plugin-app-shell-fallback/index.html","revision":"959db9389512ef1fa94e92f80c3bfa9a"},{"url":"manifest.webmanifest","revision":"33e6016c4cc398118bb0838fe0b8c36b"}].concat(self.__precacheManifest||[]);workbox.precaching.precacheAndRoute(self.__precacheManifest,{});workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/,new workbox.strategies.CacheFirst(),'GET');workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/,new workbox.strategies.StaleWhileRevalidate(),'GET');workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|avif|svg|gif|tiff|js|woff|woff2|json|css)$/,new workbox.strategies.StaleWhileRevalidate(),'GET');workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/,new workbox.strategies.StaleWhileRevalidate(),'GET');importScripts(`idb-keyval-3.2.0-iife.min.js`)
const{NavigationRoute}=workbox.routing
let lastNavigationRequest=null
let offlineShellEnabled=true
const MessageAPI={setPathResources:(event,{path,resources})=>{event.waitUntil(idbKeyval.set(`resources:${path}`,resources))},clearPathResources:event=>{event.waitUntil(idbKeyval.clear())
event.waitUntil(caches.keys().then(function(keyList){return Promise.all(keyList.map(function(key){if(key&&key.includes(`runtime`)){return caches.delete(key)}
return Promise.resolve()}))}))},enableOfflineShell:()=>{offlineShellEnabled=true},disableOfflineShell:()=>{offlineShellEnabled=false},}
self.addEventListener(`message`,event=>{const{gatsbyApi:api}=event.data
if(api)MessageAPI[api](event,event.data)})
function handleAPIRequest({event}){const{pathname}=new URL(event.request.url)
const params=pathname.match(/:(.+)/)[1]
const data={}
if(params.includes(`=`)){params.split(`&`).forEach(param=>{const[key,val]=param.split(`=`)
data[key]=val})}else{data.api=params}
if(MessageAPI[data.api]!==undefined){MessageAPI[data.api]()}
if(!data.redirect){return new Response()}
return new Response(null,{status:302,headers:{Location:lastNavigationRequest,},})}
const navigationRoute=new NavigationRoute(async({event})=>{if(event.request.url.match(/\/.gatsby-plugin-offline:.+/)){return handleAPIRequest({event})}
if(!offlineShellEnabled){return await fetch(event.request)}
lastNavigationRequest=event.request.url
let{pathname}=new URL(event.request.url)
pathname=pathname.replace(new RegExp(`^`),``)
const resources=await idbKeyval.get(`resources:${pathname}`)
if(!resources||!(await caches.match(`/app-2dfde279437ca5d05d2d.js`))){return await fetch(event.request)}
for(const resource of resources){if(!(await caches.match(resource))){return await fetch(event.request)}}
const offlineShell=`/offline-plugin-app-shell-fallback/index.html`
const offlineShellWithKey=workbox.precaching.getCacheKeyForURL(offlineShell)
return await caches.match(offlineShellWithKey)})
workbox.routing.registerRoute(navigationRoute)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/,handleAPIRequest)