
// Service Worker

const pwacache = "pwa-cache-v11.4"
self.addEventListener('install', (e) => {
  console.log('install Activated =====');

  // create new cache
  /*let cacheReady = caches.open(pwacache).then((cache) => {
    return cache.add('/')
  });*/

  let cacheReady = caches.open(pwacache).then((cache) => {
    cache.addAll([
      '/static/ctn/commons/js/colombia_v11.js'      
    ])
  })

  e.waitUntil(cacheReady);

});

self.addEventListener('activate', (e) => {
  /*let cacheReady = caches.open(pwacache).then((cache) => {
    cache.match('/').then((res) => {
      return res.text().then(console.log)
    })  });

  e.waitUntil(cacheReady);
*/
  let cacheCleaned = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if (key !== pwacache) return caches.delete(key);
    });
  });
  e.waitUntil(cacheCleaned);
});

self.addEventListener('fetch', (e) => {
  // serve from cache
  if(!e.request.url.match(location.origin) || e.request.url.match('v5.htm') || e.request.url.match('feed.htm') || e.request.url.match('mnotify.htm') || e.request.url.match('notify.htm') || e.request.url.match('stats?')) return;

  // cache with Network Fallback
  let newRes =  caches.open(pwacache).then((cache) => {
    if(!e.request.url.match('static/c1e')){
         return fetch(e.request).then((fetchres)=>{
              if(fetchres){
                   // Cache Fetched Response
               if(e.request.url.indexOf('v5.htm')== -1 && e.request.url.indexOf('feed.htm')== -1 ){
                    cache.put(e.request, fetchres.clone())
                }
                return fetchres;
              }
              return cache.match(e.request).then((res)=>{
                  // check cache response
                  if(res){
                    console.log(`Serving ${res.url} from cache`);
                    return res;
                  }
              })
            })
      }
	return cache.match(e.request).then((res)=>{
      // check cache response
      if(res){
        console.log(`Serving ${res.url} from cache`);
        return res;
      }
      // Fallback to Network
      return fetch(e.request).then((fetchres)=>{
        // Cache Fetched Response
       if(e.request.url.indexOf('v5.htm')== -1 && e.request.url.indexOf('feed.htm')== -1 ){ 
            cache.put(e.request, fetchres.clone())
        }
        return fetchres;
      })
    })
  
  })
  e.respondWith(newRes); 
})