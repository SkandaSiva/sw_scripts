'use strict';var CACHE_VERSION='v2';var CURRENT_CACHES={prefetch:'prefetch-cache-v'+CACHE_VERSION};var sitemapUrl='';var assetsToCache=['/assets/styles/css/style.css','/assets/scripts/min/fatkit.min.js'];self.addEventListener('install',function(event)
{event.waitUntil(caches.open(CACHE_VERSION).then(function(cache)
{if(sitemapUrl!=='')
{cache.addAll(assetsToCache);cachePages(cache);}else{return cache.addAll(assetsToCache);}}).then(function()
{return self.skipWaiting();}).catch(function(e)
{console.error('[FatKit] Service worker error occured when trying to add files to cache. Do the files specified in the assetsToCache array (in sw.js) exist? Error:',e);}));});self.addEventListener('activate',function()
{return self.clients.claim();});function cachePages(cache)
{fetch(sitemapUrl).then(function(response)
{return response.text();}).then(function(text)
{var pattern=/<loc>(.+?)</g;var urls=getMatches(text,pattern);cache.addAll(urls);});}
function getMatches(string,regex)
{var matches=[];var match;while(match=regex.exec(string))
{matches.push(match[1]);}
return matches;}
self.addEventListener('fetch',function(event)
{var requestUrl=new URL(event.request.url);if(event.request.method!=='GET')
{return;}
if(/http:/.test(event.request.url))
{return;}
var ignoreFileExtensions=['pdf','mp4'];var fileExtRegex=/\.([A-z]*)$/gm;var fileExtMatch=fileExtRegex.exec(requestUrl.pathname);if(fileExtMatch&&ignoreFileExtensions.includes(fileExtMatch[1]))
{console.log(`[FatKit] Service worker ignored this ${fileExtMatch[1].toUpperCase()} file: `,requestUrl.href);return;}
if(requestUrl.origin===location.origin)
{if(event.request.headers.get('range'))
{var rangeHeader=event.request.headers.get('range');var rangeMatch=rangeHeader.match(/^bytes\=(\d+)\-(\d+)?/);var pos=Number(rangeMatch[1]);var pos2=rangeMatch[2];if(pos2){pos2=Number(pos2);}
event.respondWith(caches.open(CURRENT_CACHES.prefetch).then(function(cache){return cache.match(event.request.url);}).then(function(res){if(!res)
{return fetch(event.request).then(res=>res.arrayBuffer());}
return res.arrayBuffer();}).then(function(ab){let responseHeaders={status:206,statusText:'Partial Content',headers:[['Content-Type','video/mp4'],['Content-Range','bytes '+pos+'-'+(pos2||(ab.byteLength-1))+'/'+ab.byteLength]]};var abSliced={};if(pos2>0)
{abSliced=ab.slice(pos,pos2+1);}else{abSliced=ab.slice(pos);}
return new Response(abSliced,responseHeaders);}));}else{event.respondWith(caches.open(CACHE_VERSION).then(function(cache)
{return fetch(event.request).then(function(networkResponse)
{cache.put(event.request,networkResponse.clone());return networkResponse;}).catch(function()
{return cache.match(event.request);});}));}}});