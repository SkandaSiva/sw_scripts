const CACHE_NAME = 'v1.1.24'
const busting = '4e25f312'

const urlsToCache = [
  `https://cdn.polyfill.io/v2/polyfill.js?features=default,fetch`,
  `https://fonts.googleapis.com/css?family=PT+Serif:400,400i,700,700i`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRSQgYoZZY2vCFuvAnt66qfVyvVp8NAyIw.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRSQgYoZZY2vCFuvAnt66qWVyvVp8NAyIw.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRSQgYoZZY2vCFuvAnt66qcVyvVp8NAyIw.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRSQgYoZZY2vCFuvAnt66qSVyvVp8NA.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRTQgYoZZY2vCFuvAFT_rC1cgT9rct48Q.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRTQgYoZZY2vCFuvAFT_rm1cgT9rct48Q.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRTQgYoZZY2vCFuvAFT_rO1cgT9rct48Q.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRTQgYoZZY2vCFuvAFT_r21cgT9rcs.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRQQgYoZZY2vCFuvAFT9gaQZyTfoOFC-I2irw.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRQQgYoZZY2vCFuvAFT9gaQZy3foOFC-I2irw.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRQQgYoZZY2vCFuvAFT9gaQZyffoOFC-I2irw.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRQQgYoZZY2vCFuvAFT9gaQZynfoOFC-I0.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRVQgYoZZY2vCFuvAFbzr-_dSb_nco.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRVQgYoZZY2vCFuvAFSzr-_dSb_nco.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRVQgYoZZY2vCFuvAFYzr-_dSb_nco.woff2`,
  `https://fonts.gstatic.com/s/ptserif/v11/EJRVQgYoZZY2vCFuvAFWzr-_dSb_.woff2`,
  `/impresa/wp-content/themes/papel-digital-2019-movil/assets/fonts/fontawesome-webfont.woff2`,
  `/impresa/wp-content/themes/papel-digital-2019-movil/assets/images/diarios/7.svg`,
  `/impresa/wp-content/themes/papel-digital-2019-movil/assets/vendor.css?${busting}`,
  `/impresa/wp-content/themes/papel-digital-2019-movil/assets/main.css?${busting}`,
  `/impresa/wp-content/themes/papel-digital-2019-movil/assets/vendor.js?${busting}`,
  `/impresa/wp-content/themes/papel-digital-2019-movil/assets/main.js?${busting}`
];

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(error => console.log('Falló registro de cache', error))
  );
});

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME, 'offlineReading'];
  e.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

//cuando el navegador recupera una url
self.addEventListener('fetch', event => {
  if (
    event.request.url.match('/pram.elmercurio.com/') ||
    event.request.url.match('pa1.adxion.com') ||
    event.request.url.match('suscripciones.pasedigital.cl') ||
    event.request.url.match('pram.pasedigital.cl') ||
    event.request.url.match('mercuriovalpo.cl/autos/')
  ) {
    return false;
  }

  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  event.respondWith(
    caches
      .match(event.request)
      .then(cached => {
        var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve)
        return cached || networked;

        function fetchedFromNetwork(response) {
          // var cacheCopy = response.clone();
          // console.log('WORKER: fetch response from network.', event.request.url);
          // caches
          //   .open('offlineReading')
          //   .then(function add(cache) {
          //     cache.put(event.request, cacheCopy);
          //   })
          //   .then(function () {
          //     // console.log('WORKER: fetch response stored in cache.', event.request.url);
          //   });
          return response;
        }

        function unableToResolve() {
          const html = `
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width" />
              </head>
              <body>
                <h2>Hola, parece que estás desconectado de internet, prueba revisando tu conexión o inténtalo nuevamente en unos minutos.</h2>
              </body>
            </html>
          `
          // console.log('WORKER: fetch request failed in both cache and network.');
          return new Response(html, {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/html'
            })
          });
        }
      })
  );
});
