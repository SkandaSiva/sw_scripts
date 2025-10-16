const latestJsVersion='v1'
const staticCacheName=`site-static-${latestJsVersion}`
const assets=['/offline','/offline.js','/offline.png','/offline-w.png',]
self.addEventListener('install',evt=>{evt.waitUntil(caches.open(staticCacheName).then(cache=>{cache.addAll(assets)}))})
self.addEventListener('activate',evt=>{const re=new RegExp(`${latestJsVersion}$`)
evt.waitUntil(caches.keys().then(keys=>{return Promise.all(keys.filter(key=>!key.match(re)).map(key=>caches.delete(key)))}))})
const limitCacheSize=(name,size)=>{caches.open(name).then(cache=>{cache.keys().then(keys=>{if(keys.length>size){cache.delete(keys[0]).then(limitCacheSize(name,size))}})})}
self.addEventListener('fetch',evt=>{if(evt.request.method!=='GET'||isExternalSource(evt.request.url)||evt.request.url.match('sw-loader.js')||requestShouldBeFresh(evt.request)){return}
evt.respondWith(caches.match(evt.request).then(cacheRes=>{return cacheRes||fetch(evt.request).then(fetchRes=>{const cacheName=`site-${evt.request.destination}-${latestJsVersion}`
return caches.open(cacheName).then(cache=>{cache.put(evt.request.url,fetchRes.clone())
limitCacheSize(cacheName,50)
return fetchRes})})}).catch(()=>caches.match('/offline')))})
function isAPIRequest(url){return url.match('api.dilar.tube')||url.match('/api/')}
function apiRequestShouldBeFresh(url){return true
return isAPIRequest(url)&&!getPathName(url).match(/mangas\/\d+$/)}
function requestShouldBeFresh(request){if(isAPIRequest(request.url)){return true}
const pathName=getPathName(request.url)
if(pathName.match(/^assets\//)){return false}
if((request.destination=='image'||request.destination=='empty')&&pathName.match('uploads/manga/')){return false}
return true}
function isExternalSource(url){const domain=getDomainName(url)
return!(domain.match('dilar.tube')||domain.match('localhost'))}
function jsAssets(name){return `/assets/javascripts/${name}_v${latestJsVersion}.js`}
function getDomainName(url){const matches=url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)
return matches&&matches[1]||''}
function getPathName(url){const matches=url.match(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/i)
return matches&&matches.length>=3&&matches[3]||''}