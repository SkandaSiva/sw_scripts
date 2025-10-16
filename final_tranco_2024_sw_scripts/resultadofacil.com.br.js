// 2024-07-02T10:37:00-03:00
print('load... service work !!! go - ' + Date());
const version = '4.3.39';
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

if (workbox){
  print(`Yay! Workbox is loaded 🎉`);
  
  workbox.setConfig({
    debug: false
  });
  

  workbox.routing.setDefaultHandler(
    new workbox.strategies.NetworkOnly()
  );

  /*workbox.routing.registerRoute(
    new RegExp('\https://fcm.googleapis.com/fcm/connect/*$'),
    new workbox.strategies.NetworkOnly()
  );

  workbox.routing.registerRoute(
    new RegExp('\https://*.googleapis.com/*$'),
    new workbox.strategies.NetworkOnly()
  );

  workbox.routing.registerRoute(
    new RegExp('/cadastrar-notificacoes'),
    new workbox.strategies.NetworkOnly()
  );

  workbox.routing.registerRoute(
    new RegExp('/admin*'),
    new workbox.strategies.NetworkOnly()
  );

  workbox.routing.registerRoute(
    new RegExp('/rest/*'),
    new workbox.strategies.NetworkOnly()
  );*/

 // new workbox.strategies.StaleWhileRevalidate()
  
  //workbox.googleAnalytics.initialize();
  
  workbox.precaching.precacheAndRoute([
      { url:`./images/logo.ico`, revision: version},
      { url:`./images/logo.png`, revision: version},
      { url:`./images/erros/warning_2.png`, revision: version},
      { url:`./offline`, revision: version},
      { url:`./seminternet`, revision: version},
      { url:`./css/dist/gen/mo.css`, revision: version},
    ],{
      // Ignore all URL parameters.
      ignoreURLParametersMatching: [/.*/],
    }
  );
  
  workbox.precaching.addRoute();

  // runtime cache
  // 1. stylesheet
  const precacheStylesName = 'resultadofacil-cache-Stylesheets-';
  workbox.routing.registerRoute(
    new RegExp(`\.(css|css?v=${version})`),
    new workbox.strategies.CacheFirst({
        cacheName: `${precacheStylesName}${version}`,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 7, // cache for one week
                maxEntries: 20, // only cache 20 request
                purgeOnQuotaError: true
            })
        ]
    })
  );

  const notFoundFallbackHandler = async ({event}) => {
    console.log(event)
    return Response.error()
  };

  workbox.routing.registerRoute(
    new RegExp('\(mraid.js)$'),
    notFoundFallbackHandler
  );

  const precacheScriptsName = 'resultadofacil-cache-scripts-';
  workbox.routing.registerRoute(
    new RegExp(`\.(js|js?v=${version})$`),
    new workbox.strategies.CacheFirst({
        cacheName: `${precacheScriptsName}${version}`,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 1 * 7, // cache for one week
                maxEntries: 20, // only cache 20 request
                purgeOnQuotaError: true
            })
        ]
    })
  );

  const precacheImagesName = 'resultadofacil-cache-Images-';
  // 2. images
  workbox.routing.registerRoute(
    new RegExp('\.(png|svg|jpg|jpeg|ico)$'),
    new workbox.strategies.CacheFirst({
        cacheName: `${precacheImagesName}${version}`,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 7,
                maxEntries: 50,
                purgeOnQuotaError: true
            })
        ]
    })
  );

  workbox.routing.setCatchHandler(({ event }) => {
    switch (event.request.destination) {
        case 'document':
          print(`falha ao buscar '${event.request.destination}': ${event.request.url}`, 'error');
          return caches.match(`/offline?__WB_REVISION__=${version}`);
        default:
          print(`houve uma falha ao carregar '${event.request.destination}': ${event.request.url}`, 'error');
          return Response.error();
    }
  });

  self.addEventListener('install', function(event) {
    // For Develop Only 
    if (location.hostname.startsWith('localhost')){
      //self.skipWaiting();
    }
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(name => {
            print('cache name: ' + name, 'debug')
            if (name.startsWith('resultadofacil-cache-') && !name.endsWith(version)){
              print('apagar cache de : ' + name, 'debug')
              return true
            } else {
              return false
            }
          }).map(cacheName => caches.delete(cacheName))
        );
      })
    );
  });
} else {
  print(`Boo ! Workbox didn't load 😬`);
}

function print(mensage, level = 'debug'){
  if (location.hostname.startsWith('localhost')){
    switch (level) {
      case 'debug':
        console.debug(mensage)
        break;
      case 'error': 
        console.error(mensage)
        break
      default:
        console.info(mensage)
        break;
    }
  } else {
    if (level=='error'){
      console.error(mensage)
    }
  }
}