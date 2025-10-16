(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  self.addEventListener("fetch", function(evt) {
    const event = evt;
    if (event.request.method !== "GET" || !event.request.url.startsWith("http"))
      return;
    const url = event.request.url.split("?")[0];
    const isHome = url.includes(".htm") || url === "/";
    if (/sw\.js/.test(url))
      return;
    if (/\/pwa\/$/.test(url))
      return;
    if (!/\.(js|jpeg|webp|png|css|json|gif|ttf|mp3|mp4|txt|atlas|webm|ogg|apng|avif|jfif|pjpeg|pjp|svg|ico|tif|tiff|woff|otf|woff2|m3u8|ts)$/.test(url) && !isHome)
      return;
    event.respondWith(
      function() {
        return __async(this, null, function* () {
          const cache = yield caches.open("dp-pwa-v1");
          if (isHome) {
            try {
              const response = yield fetch(event.request);
              cache.put(event.request, response.clone());
              return response;
            } catch (error) {
              const cachedResponse = yield cache.match(event.request);
              if (cachedResponse)
                return cachedResponse;
              return fetch(event.request);
            }
          }
          try {
            const cachedResponse = yield cache.match(event.request);
            if (cachedResponse) {
              cache.add(event.request);
              return cachedResponse;
            }
            const response = yield fetch(event.request);
            cache.put(event.request, response.clone());
            return response;
          } catch (error) {
            return fetch(event.request);
          }
        });
      }()
    );
  });
  self.addEventListener("install", function(evt) {
    console.log("install");
  });
  self.addEventListener("activate", function() {
    console.log("activated");
  });

}));
//# sourceMappingURL=sw.js.map
