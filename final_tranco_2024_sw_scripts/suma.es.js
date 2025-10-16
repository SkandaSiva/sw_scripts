var organismoGestor = new URL(location).searchParams.get('organismoGestor');
organismoGestor = organismoGestor ? organismoGestor : 'suma';
const staticCacheName = organismoGestor + "-pwa";
const filesToCache = [
    '/pwa-inicio',
    '/pwa-pagar',
    '/pwa.js',
    '/pwa/pwa_perfil.js',
    '/pwa_perfil.xhtml',
    '/ContenedorComun/javascript/jquery.1.11.min.js',
    '/ContenedorComun/javascript/linkify.min.js',
    '/ContenedorComun/javascript/linkify-string.min.js',
    '/ContenedorComun/javascript/linkify-html.min.js',
    '/ContenedorComun/javascript/jquery.smartmenus.min.js',
    '/ContenedorComun/javascript/jquery.smartmenus.bootstrap-4.min.js',
    '/ContenedorComun/javascript/popper.min.js',
    '/ContenedorComun/javascript/bootstrap-4.1.3.min.js',
    '/ContenedorComun/javascript/funciones_web.js',
    '/ContenedorComun/javascript/funciones_jquery.js',
    '/ContenedorComun/javascript/bootstrap-web.js',
    '/ContenedorComun/temas/web_2019/jquery.smartmenus.bootstrap-4.css',
    '/ContenedorComun/temas/web_2019/bootstrap4.min.css',
    '/ContenedorComun/temas/web_2019/fontawesome/css/all.min.css',
    '/ContenedorComun/temas/web_2019/comunes.css',
    '/ContenedorComun/temas/web_2019/header-escritorio.css',
    '/ContenedorComun/temas/web_2019/header-movil.css',
    '/ContenedorComun/temas/web_2019/fontawesome/webfonts/fa-brands-400.woff2',
    '/ContenedorComun/temas/web_2019/fontawesome/webfonts/fa-regular-400.woff2',
    '/ContenedorComun/temas/web_2019/fontawesome/webfonts/fa-solid-900.woff2',
    '/ContenedorComun/temas/web_2019/fontCairo.woff2',
    '/javax.faces.resource/messages.js.xhtml?ln=javascript',
    '/javax.faces.resource/messages.css.xhtml?ln=css',
    '/javax.faces.resource/lightbox.js.xhtml?ln=javascript',
    '/javax.faces.resource/lightbox.css.xhtml?ln=css',
    '/javax.faces.resource/close.png.xhtml?ln=images',
    '/javax.faces.resource/next.png.xhtml?ln=images',
    '/javax.faces.resource/prev.png.xhtml?ln=images',
    '/javax.faces.resource/loading.gif.xhtml?ln=images',
    '/javax.faces.resource/down.png.xhtml?ln=images',
    '/javax.faces.resource/bootstrap.min.js.xhtml?ln=javascript',
    '/javax.faces.resource/jquery.min.js.xhtml?ln=javascript',
    '/ContenedorComun/html/ES/MuestraCodigoQR.png'
];

self.addEventListener('beforeinstallprompt', function(event) {
    window.deferredPrompt = event;
});

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function(cache) {
            return cache.addAll(filesToCache);
        })
        .then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('appinstalled', function(event) {
    window.deferredPrompt = null;
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function(cache) {
            return cache.keys()
                .then(function(cacheNames) {
                    return Promise.all(
                        cacheNames.filter(function(cacheName) {
                            return filesToCache.indexOf(cacheName) === -1;
                        }).map(function(cacheName) {
                            return caches.delete(cacheName);
                        })
                    );
                })
                .then(function() {
                    return self.clients.claim();
                });
        })
    );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async function () {
      try {
        return await fetch(event.request);
      } catch (err) {
        return caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request).then(function(response) {
                if (response.status === 404) {
                    return caches.match('/pwa/' + organismoGestor + '/pwa-404.html');
                }
                return response;
            });
        }).catch(function() {
            // If both fail, show a generic fallback:
            return caches.match('/pwa/' + organismoGestor + '/pwa-offline.html');
        })
      }
    })(),
  );
});

self.addEventListener('message', function (event) {
  if (event.data.action === 'borrar_cache') {
    // Código para borrar la caché
    caches.keys().then(function (cacheNames) {
      cacheNames.forEach(function (cacheName) {
        caches.delete(cacheName);
      });
    });
  }
});