const version = '3.6.0' ;
const cacheName = 'pwa-conf-v1';
const OFFLINE_URL = 'hors-ligne.html';
const cachedFiles = [
  '/images/Offline-icon.svg',
  'images/Offline-icon.png',
  '/images/MenuRetour.png ',
  '/css/frontend/all.min.css?v='+version,
  '/css/frontend/modules/calendar/calendar.min.css',
  '/js/frontend/modules/calendar/calendar.min.js',


  '/images/icons/Home-icon-default.svg',
  '/images/icons/Home-icon-selected-Automn.svg',
  '/images/icons/Home-icon-selected-Spring.svg',
  '/images/icons/Home-icon-selected-Summer.svg',
  '/images/icons/Home-icon-selected-Winter.svg',

  '/images/icons/Icon-feather-calendar.svg',
  '/images/icons/News-icon-automne.svg',
  '/images/icons/News-icon-default.svg',
  '/images/icons/News-icon-ete.svg',
  '/images/icons/News-icon-hiver.svg',
  '/images/icons/News-icon-printemps.svg',
  '/images/icons/Picking-icon-automne.svg',
  '/images/icons/Picking-icon-default.svg',
  '/images/icons/Picking-icon-ete.svg',
  '/images/icons/Picking-icon-hiver.svg',
  '/images/icons/Picking-icon-printemps.svg',
  '/images/icons/stores-icon-automne.svg',
  '/images/icons/stores-icon-default.svg',
  '/images/icons/stores-icon-ete.svg',
  '/images/icons/stores-icon-hiver.svg',
  '/images/icons/stores-icon-printemps.svg',
  '/images/icons/Symbol.svg',
  '/images/Icon-close.svg',
  '/images/icons/Calendar-icon-winter.svg',
  '/images/icons/Calendar-icon-automn.svg',
  '/images/icons/Calendar-icon-summer.svg',
  'images/icons/Calendar-icon-spring.svg',
  '/images/icons/Calendar-icon-default.svg', 


  '/css/frontend/modules/map/map.min.css',
 
  '/uploads/cueillettes/chapeau-de-paille/presentation-chapeau-de-paille_807x400.jpg',
  '/uploads/presentation/cueilleurs.jpg',
  '/uploads/presentation/fleurs.jpg',
  '/uploads/presentation/tomates.jpg',
  '/uploads/presentation/pommes.jpg',
  '/uploads/presentation/citrouilles.jpg',
  '/uploads/presentation/arbres.jpg',

  '/uploads/cueillettes/default/enfant_brouette_article.jpg',
  '/css/frontend/modules/actuality/custom.actuality.min.css',
  '/css/frontend/modules/recette/custom.recette.min.css',
  '/images/Close-icon.svg',

  '/images/Image-off-line.svg'

];
self.addEventListener('install', async event => {
  console.log('install event');
  event.waitUntil(
      caches.open(cacheName).then(async function (cache) {
        await cache.add(new Request(OFFLINE_URL, {cache: 'reload'}));
        return cache.addAll(
            cachedFiles
        );
      })
      );

});



  self.addEventListener('fetch', async event => {
    const req = event.request;
    if(!req.url.includes('backend'))
    {
      event.respondWith(networkFirst(req));
    }
  });
  
  async function cacheFirst(req) {
    try{
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(req);
      return cachedResponse || networkFirst(req);
    }
    catch (e) { 
      console.log('Fetch failed; returning offline page instead.', error);

      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(OFFLINE_URL);
      return cachedResponse;
    }
    
  }

  

  async function networkFirst(req) {
   
      const cache = await caches.open(cacheName);
      try { 
        const fresh = await fetch(req);
        if(req.method == 'GET')
        {
          cache.put(req, fresh.clone());
        }
        return fresh;
      } catch (e) { 
        const cachedResponse = await cache.match(req);
        if(cachedResponse)
        {
          return cachedResponse;
        }
        else{
          console.log('Fetch failed; returning offline page instead.');

          const cache = await caches.open(cacheName);
          const cachedResponseOffline = await cache.match(OFFLINE_URL);
          return cachedResponseOffline;
        }
        
      }
    
    
  }


//caching other pages
self.addEventListener('message', event => {
  fetchURL(event);
  });
  async function fetchURL(event)
  {
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(
          cachedFiles
      );
    })
    const cache = await caches.open(cacheName);
    if (event.data) { 
      let data = JSON.parse(event.data); // parse the message back to JSON
      if (data.action == "precache") { // check the action
        data.url.forEach(link=>{
          fetch(link).then(function(response) {
            if (!response.ok) {
              throw new TypeError('Bad response status');
            }
        
             cache.put(link, response);
          })
        })
       
         // self.toolbox.precache([data.url]); // here you can use sw-toolbox or anything to cache your stuff.
      }
    }
  }
  
