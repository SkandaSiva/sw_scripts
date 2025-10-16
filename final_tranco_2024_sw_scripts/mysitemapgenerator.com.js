const offline_url = '/offline/0.html'; var core_cache_path = 'core'; /*caches.has("private").then((hasCache) => { if ( !hasCache ){ core_cache_path = "core"; } else { core_cache_path = "private"; }}).catch(() => { core_cache_path = "core"; });*/
self.addEventListener('message', function (event){ if ( parseInt(event.data.resync_cache) === 1 ){ caches.delete('core'); event.waitUntil( caches.keys().then(function (cacheNames){ return Promise.all( cacheNames.filter(function (cacheName){ return cacheName.startsWith('ipinfo'); }
).map(function(cacheName){ return caches.delete(cacheName); })
); })
); }}); self.addEventListener('install', function (event){ event.waitUntil( self.skipWaiting() ); event.waitUntil(caches.open('assets').then(function (cache){ cache.addAll([
'/offline/0.html', '/favicon.ico', '/img/XML-generator.jpg', '/img/mysitemapgenerator.jpg', '/images/offline.svg', '/applauncher'
]); })); event.waitUntil(caches.open('core').then(function (cache){ cache.addAll([
'/', '/info/pricing.html'
]); })); }); self.addEventListener('activate', function (event){ event.waitUntil( self.clients.claim() ); }); self.addEventListener('fetch', function (event){ if ( event.request.method === 'GET' && event.request.url.startsWith(self.location.origin) && event.request.url.search(/(click|ACP|\?url=|file\=|\.(php|xml|rss))/) === -1 ){ let destination = event.request.destination; if ( !destination ){ if ( event.request.url.search(/\.(html)$/) !== -1 ){ destination = 'document'; }
else if ( event.request.url.search(/\.(png|svg|jpg)$/) !== -1 ){ destination = 'image'; }}
var cachepath = destination === 'document' ? core_cache_path : 'assets'; var searchvars = destination === 'document' ? true : false; switch (destination){ case 'style':
case 'font':
case 'script':
case 'document':
case 'image': { event.respondWith( caches.match(event.request, {'cacheName': cachepath, ignoreVary: true, ignoreSearch: searchvars}).then(function (response){ if (response){ const newHeaders = new Headers(response.headers); newHeaders.append('x-cache-stale', '1'); return new Response(response.body, { status: response.status, statusText: response.statusText, headers: newHeaders
}); }
return fetch(event.request).then(function (response){ if ( !response.ok && response.type !== 'opaqueredirect' ){ throw Error('response status ' + response.status); }
if ( response.ok && ( parseInt(response.headers.get('x-app-sync')) === 1 || destination !== 'document' ) ){ var copy = response.clone(); event.waitUntil(caches.open(cachepath).then(function (cache){ return cache.put(event.request, copy); })); }
return response; }).catch(function (error){ if ( destination === 'document' )
return caches.match(offline_url, {ignoreVary: true, ignoreSearch: searchvars}); }); })
); }}
}});