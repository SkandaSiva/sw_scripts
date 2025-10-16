var static = "GGR-v0.053";
// poco poker
try { 
  importScripts('https://gogoroyal.com/assets/js/dexie.min.js') 
} catch(e) { 
  console.log(e.message || e.code || e.name); 
}
self.addEventListener("install", function (event) {  
  caches.keys().then(function(names) {
    for (let name of names) {
      if(name!==static)
        caches.delete(name);
    }
  });
});
self.addEventListener("activate", async function (event) {
  try {
    fetch('sup.json').then(async function(resp) {
      resp.json().then(async function(data) {
        await cookieStore.set({name:'endpoint',value:data.endpoint??null,path:'/',secure:true,sameSite:'strict'});
      });
    });
  } catch (err) {
    console.log('Error fetching JSON', err);
  }
});
self.addEventListener('fetch', async (event) => {
    const d=Date.now();
    const n = d-(d % 3600000);
    const er=event.request;
    if (['image','style','document','font','manifest'].includes(er.destination)) {
      event.respondWith(caches.open(static).then(async (cache) => {
        return cache.match(er).then(async (cR) => {
          return cR || fetch(er.url).then(async (fR) => {
            if(fR.ok) cache.put(er, fR.clone());
            return fR;
          });
        });
      }));
    } else {
        if ( er.url.indexOf( '.sentry.io' ) !== -1 ) {
          return false;
        }
        event.respondWith(fetch(er));
        /*
        const authChannel = new BroadcastChannel('canal');
        authChannel.postMessage({msg: 'Fechando '+er.url});
        event.respondWith(
            caches.match(er).then(function (response) {
                return response || fetch(er)
            })
        );
        */
    }
});