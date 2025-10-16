console.log("iniciando sw.js")
var GLOBALversion
var dominio
var esChrome
var urlsNoSW

function iniciaVariablesGlobales() { // Pasarlo a promesa x
    if (GLOBALversion)
        return true
    GLOBALversion = "1.20241022.319"
    urlsNoSW = [
        "toteat.app/srv",
        "toteat.app/rest",
        "toteat.app/pay",
        "toteat.app/search",
        "gurmi.app/srv",
        "gurmi.app/rest",
        "gurmi.app/pay",
        "gurmi.app/search",
        ".intercom.io",
        ".hot-update.json",
        "/sockjs-node/",
        ".firebaseio.com",
        '/images/upload',
        '/sapi/ajax-upload',
        "/mw/payments/paypayment",
        "https://toteatglobal.appspot.com",
        "https://toteatdev.appspot.com",
        "https://storage.googleapis.com/data",
        ".nubox.",
        ".bsale.",
        ".facturacion.",
        "mercadolibre",
        "mercadolivre",
        "apis.google.com"
    ]
    dominio = location.origin
    if (navigator.userAgent.indexOf("Chrome") > 0)
        esChrome = true
    else
        esChrome = false
}


self.addEventListener('install', function (event) {
    console.log("Service Worker Event: install")
    iniciaVariablesGlobales()
    var arrayCaches = [
        '/img/btn_google_signin_dark_normal_web@2x.png',
        '/img/btn_google_signin_dark_normal_web@2xes.png',
        '/img/LogoToteat600x160.png',
        '/img/logoNuevo_250.png',
        '/img/isotipo-toteat-250.png',
        '/img/GCP_CustomerAwardWinner_CrossIndustry240.png',
        '/img/BotonIniciarFacebooken.png',
        '/img/BotonIniciarFacebookes.png',
        '/img/LinkedinWhite92x110.png',
        '/img/LogoToteatApp200x66.png',
        '/img/toteat-iconos2.png',
        '/img/loader.gif',
        '/img/loading_menu.gif',
        '/img/loading-orange.gif',
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js",
        "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/es_ES/appleid.auth.js"
    ]

    event.waitUntil(
        caches.open(GLOBALversion).then(function (cache) {
            return cache.addAll(
                arrayCaches
            );
        })
    );
    event.waitUntil(self.skipWaiting());
    var temp = GLOBALversion.split(".")
    sendNotif({ "body": "Se actualizó aplicación a versión " + temp[temp.length - 1], "vibrate": false, "tipo": "toteat" })
});

self.addEventListener('activate', function (event) {

    console.log("Service Worker Event: activate")
    console.log("ServiceWorker va a activar IDB...")
    iniciaVariablesGlobales()
    caches.keys().then(function (cacheNames) {
        return Promise.all(
            cacheNames.filter(function (cacheName) {
                // Return true if you want to remove this cache,
                // but remember that caches are shared across
                // the whole origin
                if (cacheName != "assets" && cacheName != GLOBALversion)
                    return true
            }).map(function (cacheName) {
                console.log("Se eliminara cache antiguo " + cacheName)
                return caches.delete(cacheName);
            })
        );
    })
});

self.addEventListener('fetch', function(event) {
  iniciaVariablesGlobales()
  if (dominio && (dominio.indexOf("dev.toteat.app")>=0 || dominio.indexOf("test.toteat.app">=0) || dominio.indexOf("qa.toteat.app" >= 0) || dominio.indexOf("app.toteat.net">=0) || dominio.indexOf("coliseolive.toteat.net">=0)))
        console.log("Service Worker Event: fetch "+event.request.url)
  var tempurl=event.request.url
  for (var urltemp in urlsNoSW){
      if (tempurl.indexOf(urlsNoSW[urltemp])>=0){
           console.log("en ServiceWorker, se descarta fetch cache de upload:  "+tempurl)
          return;
      }
  }
  if (["POST","PUT","PATCH","DELETE"].indexOf(event.request.clone().method)>=0){
      console.log("en ServiceWorker, se descarta fetch cache de POST o metodo invalido...")
      return;
  }
  if (tempurl.indexOf("https://maps.googleapis.com")>=0 || tempurl.indexOf("https://maps.gstatic.com")>=0)
      var esGoogleMaps="Mapas"
  else
      esGoogleMaps=""
  if (tempurl.indexOf("https://storage.googleapis.com/idata")>=0 && tempurl.indexOf(".toteat.com/r/")>=0)
      var esImagenToteat=true
  else
      esImagenToteat=false
  var esImagenCDN=""
  if (tempurl.indexOf(".googleusercontent.com")>=0)
      esImagenCDN="imagenes"
  else
      esImagenToteat=false
  var CACHES_TRY_NUBE_FIRST= [dominio, dominio+"/", dominio+"/index.js", dominio+"/index", dominio+"/sw.js", dominio+"/manifest.json", dominio+"/r/",  dominio+"/rd/", dominio+"/rt/"]
  if (((event.request.url.includes("https://app.toteat.net/") || event.request.url.includes("https://coliseolive.toteat.net/") || event.request.url.includes("https://gurmi.toteat.net/"))&&!(event.request.url.includes("/styles/fonts/") || event.request.url.includes("/img/")))
      || (CACHES_TRY_NUBE_FIRST.indexOf(event.request.url)>=0)
  ){
      console.log("No se debe cargar de cache, prueba primero si hay internet..."+event.request.url )
       event.respondWith(
        fetch(event.request).then(function(response){
            var clonacion=response.clone()
            var evrq=event.request
            caches.open(esGoogleMaps || esImagenCDN || GLOBALversion).then(function(cache){
                cache.put(evrq, clonacion);
                //console.log("Se guardo version de home")
            })
           // console.log("Se devuelve version de network de home")
            return response

            }).catch(function () {
                console.log("Se devuelve version en cache de respuesta " + event.request.url)
                return caches.match(event.request);

            })
        );
        return true

    }

    if (!event.request.url.includes("/datasw")) {
        if (event.request.url.includes(dominio) || esGoogleMaps || esImagenCDN) {
            event.respondWith(
                caches.open(esGoogleMaps || esImagenCDN || GLOBALversion).then(function (cache) {
                    return cache.match(event.request).then(function (response) {
                        return response || fetch(event.request).then(function (response2) {
                            if (response2.status < 400)
                                cache.put(event.request, response2.clone());
                            return response2;
                        });
                    });
                })
            );
        } else {
            if (esImagenToteat || event.request.url.includes("#userPicture") || (event.request.url.includes(".fbcdn.")) || (event.request.url.includes("graph.facebook.com"))) {
                event.respondWith(
                    caches.open("assets").then(function (cache) { // Se usa otro cache para que no lo borre al cambiar de version
                        return fetch(event.request).then(function (response) {
                            cache.put(event.request, response.clone());
                            return response;
                        })
                            .catch(function () {
                                return cache.match(event.request);
                            })
                    })
                );
            }
            else {
                if (event.request.url.includes(".toteat.net") && !esChrome) // EN safari no falla, en Chrome da error
                    event.request.headers.delete("If-None-Match")
                event.respondWith(fetch(event.request));
            }

        }

    } else {
        event.respondWith(procesaEventoUrl(event));
    }

});

/*
self.addEventListener("push", function(event) {
  var message = event.data.text();
  self.registration.showNotification("Mensaje recibo PUSH", {
    body: message
  });
});
*/

self.addEventListener('online', function (event) {
    console.log("Service Worker Event: online")
});

self.addEventListener('offline', function (event) {
    console.log("Service Worker Event: offline")
});
self.addEventListener('start', function (event) {
    console.log("Service Worker Event: start")
});
self.addEventListener('stop', function (event) {
    console.log("Service Worker Event: stop")
});
self.addEventListener('close', function (event) {
    console.log("Service Worker Event: close")
});


self.addEventListener("message", function (event) {
    //console.log(event)

    console.log("Message received:", event.data);
    if (event.data.msg) {


        if ((event.data.msg == "notif") && event.data.body) {
            sendNotif(event.data)
            return
        }
        if (event.data.msg == "deletecache") {
            caches.keys().then(function (cacheNames) {
                return Promise.all(
                    cacheNames.filter(function (cacheName) {
                        return true
                    }).map(function (cacheName) {
                        console.log("Se eliminara cache " + cacheName)
                        return caches.delete(cacheName);
                    })
                );
            }).then(function () {
                console.log("Va a unregister sw...")
                self.registration.unregister()
                    .then(function () {

                        return self.clients.matchAll();

                    })
                    .then(function (clients) {
                        clients.forEach(client => client.navigate("/")); //antes a client.url

                    });
            })

        }
    }

});



function sendNotif(msg) {
    return true // Por ahora desactivado
    if (!self.registration || !self.registration.active)
        return
    var config = {
        body: msg.body,
        icon: "/shared/img/ok.ico",
        tag: msg.tag || new Date().toISOString(),
        "showOnPageHidden": true
    }
    var titulo = "Toteat Restaurant Manager"
    if (msg.vibrate)
        config.vibrate = [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]
    if (msg.requireInteraction)
        config.requireInteraction = true

    if (msg.tipo == "warning")
        config.icon = "/shared/img/warning.ico"
    if (msg.tipo == "error") {
        config.icon = "/shared/img/error.ico"
        if (msg.requireInteraction !== false)
            config.requireInteraction = true
    }

    if (msg.tipo == "toteat")
        config.icon = "/shared/img/icon/ios/LogoColorToteat72x72Resto.png"
    if (msg.tipo == "orange")
        config.icon = "/shared/img/icon/ios/LogoColorToteat72x72.png"
    if (msg.icon)
        config.icon = msg.icon
    if (msg.titulo)
        titulo = msg.titulo

    self.registration.showNotification(titulo, config);
}


function procesaEventoUrl(event) {
    console.log("En ServiceWorker procesaEventoUrl " + event.request.url)
    var respuesta = new Promise(function (resolver, rechazar) {
        //console.log("En ServiceWorker creacio de promesa procesaEventoUrl " + event.request.url)
        loopUrls(event, resolver, rechazar)

    })
    return respuesta
}



function loopUrls(event, resolver, rechazar) {
    //console.log("En ServiceWorker loopUrls procesaEventoUrl " + event.request.url)
    if (event.request.url.includes("/datasw")) {
        //console.log("En ServiceWorker procesaEventoUrl /datasw")
        event.request.json().then(function (resp) {

            console.log(resp)


        })

        return false
    }

    // Si no llega a ninguno
    var temp = new Response(JSON.stringify({
        "data": [],
        "ok": false,
        "msg": { "texto": "Invalid url", "tipo": 2 }
    }), { headers: { "Content-Type": "application/json; charset=utf-8" } })
    resolver(temp)


}



function finalizaRespuesta(resolver, servicio) {
    return function (resp) {
        var temp = new Response(JSON.stringify({
            "data": resp,
            "ok": true
        }), { headers: { "Content-Type": "application/json; charset=utf-8" } })
        if (resp === null)
            temp["ok"] = false
        console.log("Finalizando respuesta ServiceWorker " + servicio)
        console.log(temp)
        resolver(temp)
    }

}










