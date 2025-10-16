
const cacheName = "ft-pr-website-1731506579810";
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/', '/docs','/explore','/widgets','whitelabel-for-agencies','/login','/signup'
      ])
        .then(() => self.skipWaiting());
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

function emptyResponse(cache){
    let str = `<!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width,initial-scale=1.0">
        <link rel="icon" type="image/png" sizes="196x196" href="/_icons/favicon-196.png">
        <script type="module">
            import Fouita from 'https://cdn.fouita.com/assets/fouita/fouita-ed-v1.js'
            Fouita({key: "FT-0x617c-0x617e"})
        </script>
        <script>
            if('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js', { scope: '/' })
            }
        </script>
    </head>
    <body class="ft">
        
    </body>
    </html>`
    let blb = new Blob([str], {type : 'text/html'})
    let init = { "status" : 200 , "statusText" : "" };

    return new Response(blb,init);
}

function cacheFirst(cache,event){
    return cache.match(event.request).then(function (response) {
        return response || fetch(event.request);
    });
}

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {

      const key_pf_cache = '/save/pf/63CAF78FC1B/'
      if(event.request.url?.includes(key_pf_cache)){
            pgEmpty = !event.request.url.includes('/pub/')
            
            let resp = emptyResponse(cache)

            if(pgEmpty){
                cache.put(key_pf_cache, resp.clone())
            }else{
                cache.delete(key_pf_cache)
            }
            return resp
            
      }
      if(event.request.destination == "document" && event.request.url.includes(location.origin)){
          return cache.match(key_pf_cache).then((resp) => {
              return resp || cacheFirst(cache, event)
          })
      }
      
      return cacheFirst(cache,event)
    })
  );
});
