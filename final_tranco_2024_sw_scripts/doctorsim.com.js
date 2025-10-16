var console = {};
console.log = function(){};
var dsim_v = "4_O788";
var pais_lang = "";
var config = {
  version: "dS_2024111000_m__"+dsim_v,
  staticCacheItems: [
    "/apple-touch-icon-512x512.png",
    "/css/dsimintlTelInput_v16.css",
    "/js/dsimintlTelInput_v16.js?"+dsim_v,
    "/js/intlTelInput.js?"+dsim_v,
    "/js/dsimTopupObj.js?"+dsim_v,
    "/js/topup.js?"+dsim_v,
    "/dist/css/main.css?"+dsim_v,
    "/dist/js/custom.js?"+dsim_v,
    "/dist/js/client.min.js",
    "/dist/fonts/font-awesome/css/font-awesome.css",
    "/dist/js/flag/css/flag-icon.min.css",
    "/dist/css/bootstrap.min.css",
    "/dist/js/jquery-3-6-0.min.js",
    "/dist/js/bootstrap.bundle.min.js",
    "/js/mobile/bootstrap-select.js",
    "/js/mobile/jquery.ui.touch-punch.min.js",
    "/js/jquery-ui-1.13.1.custom.min.js",
    "/css/fonts/qs_l.woff2",
    "/css/fonts/qs_lext.woff2",
    "/js/jquery.validate.js?"+dsim_v,
    "/js/tippy/tippy.js?"+dsim_v,
    "/js/php_js_serial.js?"+dsim_v,
    "/js/dsimDynamicClass.js?"+dsim_v,
    "/js/dsimLibObj.js?"+dsim_v,
    "/js/lib_term_2015.js?"+dsim_v,
    "/js/tp_checkout.js?"+dsim_v,
    "/js/applePay.js?"+dsim_v,
    "/js/mobile/mult_functions.js?"+dsim_v,
    "/js/utils.js"
  ],
  contentCacheItems: [
    "",
    "offline.html",
    "recargar-movil/destcountries/"
  ],
  cachePathPattern: /^\/(?:(20[0-9]{2}|font-awesome|css|fonts|img|mobile|js|dist|bootstrap_mp|proc)\/(.+)?)?$/,
  cacheFilePattern: /\b(phone|celular|movil|favicon|apple-touch|html)\b/,
  nocacheFilePattern: /\b(desconectar|logout|login|alta|recargar|topup|captcha)\b/,
  offlinePage: "offline.html"
};

function cacheName (key, opts) {
  return opts.version+"-"+key;
}

function addToCache (cacheKey, request, response) {
  console.log(request.url + " with r "+response.ok + " added to che: "+cacheKey);
  if (response.ok) {
  var copy = response.clone();
  caches.open(cacheKey).then( cache => {
    cache.put(request, copy);
  });
}
  return response;
}

function fetchFromCache (event) {

  return caches.match(event.request).then(response => {
    if (!response) {
      throw Error(`${event.request.url} not found in cache`);
    }
    console.log(event.request.url + " RETURNED from cache")
    return response;
  });
}

function offlineResponse (resourceType, opts) {
  console.log("Offline Reposne Start")
  if (resourceType === "content") {
      console.log("a devoler offline page")
    return caches.match(opts.offlinePage);
  }
  return undefined;
}

self.addEventListener("install", event => {
  function onInstall (event, opts) {
    var cacheKey = cacheName("static", opts);
    caches.open(cacheKey)
      .then(cache =>
        cache.addAll(opts.staticCacheItems)
      );
    cacheKey = cacheName("content", opts);
    return caches.open(cacheKey)
      .then(cache =>
        cache.addAll(opts.contentCacheItems)
      );
  }

  event.waitUntil(
    onInstall(event, config).then( () => self.skipWaiting() )
  );
});

self.addEventListener("activate", event => {
  function onActivate (event, opts) {
    return caches.keys()
    .then(cacheKeys => {
      var oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.version) !== 0);
      var deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
      return Promise.all(deletePromises);
    });
  }
  event.waitUntil(
    onActivate(event, config)
      .then( () => self.clients.claim() )
  );
});
self.addEventListener("fetch", event => {

  
  function shouldHandleFetch (event, opts) {

    var is_logged_in = false;
    var request            = event.request;
    var url                = new URL(request.url)
    console.log("Start Running ShouldHandle for "+url.pathname)

    if (url.pathname == "/manifest.webmanifest") return false;

    var criteria           = {
      matchesPathPattern: !!(opts.cachePathPattern.exec(url.pathname) || opts.cacheFilePattern.exec(url.pathname) || url.pathname == "/" || url.pathname == ""),
      // isGETRequest      : request.method === "GET",
      isFromMyOrigin    : url.origin === self.location.origin
    };
    var failingCriteria    = Object.keys(criteria)
      .filter(criteriaKey => !criteria[criteriaKey]);
        if (!failingCriteria.length) {
            console.log("Running ShouldHandle for "+url.pathname)
        }
        return !failingCriteria.length;
  }

  function onFetch (event, opts) {
    var request = event.request;

    // out of scope fix for clicks to / from pais-lang/ with scp
    var url = new URL(request.url);
    // var pot_bad_url = url.pathname.split("/");
    // if (url.pathname == "/") && (pais_lang != url.pathname)

    var acceptHeader = request.headers.get("Accept");

    var resourceType = "static";
    var cacheKey;

    if (acceptHeader && acceptHeader.indexOf("text/html") !== -1) {
      resourceType = "content";
    } else if (acceptHeader && acceptHeader.indexOf("image") !== -1) {
      resourceType = "static";
    }

    cacheKey = cacheName(resourceType, opts);

    console.log("Content type is "+request.method, resourceType)

    if ((request.method == "POST") || (url.pathname.includes("proc"))) {
      event.respondWith(
        fetch(request)
          .catch(function() {
            this.clients.matchAll().then(clients => {
              clients.forEach(client => client.postMessage("offline_time"));
            });
            // Respond with the page that the request originated from
            return request;
        })
      );

    } else if (opts.nocacheFilePattern.exec(url.pathname)) {
      console.log("No caching for "+url.pathname)
      return request;
    } else if (url.pathname.includes("occb3hed327h728dh728as")) {
      return request;
    } else {
      if (resourceType === "content") {
        // network, cache,
        // event.respondWith(
        //   fetch(request)
        //     .then(response => addToCache(cacheKey, request, response))
        //     .catch(() => fetchFromCache(event))
        //     .catch(() => offlineResponse(resourceType, opts))
        // );
        // network, cache,
        // cache then network
        event.respondWith(
          fetchFromCache(event)
            .catch(() => fetch(request))
            .then(response => addToCache(cacheKey, request, response))
            .catch(() => offlineResponse(resourceType, opts))
        );

      } else {
        event.respondWith(
          fetchFromCache(event)
            .catch(() => fetch(request))
            .then(response => addToCache(cacheKey, request, response))
            .catch(() => offlineResponse(resourceType, opts))
        );
      }
    }
  }

  if (shouldHandleFetch(event, config)) {
    onFetch(event, config);
  }

});
