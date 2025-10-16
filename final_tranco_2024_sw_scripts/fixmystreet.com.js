
importScripts('/static/vendor/idb-keyval-iife.min.3904ab3a122d.js');

const requiredOffline = [
  "/static/cobrands/fixmystreet.com/base.4f2f9ee81a20.css",
  "/static/cobrands/fixmystreet.com/layout.4c65e106b156.css",
  "/static/vendor/OpenLayers/theme/default/style.836778f74ad9.css",
  "/static/vendor/fancybox/jquery.fancybox-1.3.4.092f10bf08a0.css",
  "/static/js/translation_strings.en-gb.9c2ab75be368.js",
  "/static/js/geolocation.auto.min.d469e342a22b.js",
  "/static/vendor/jquery-3.6.0.min.8fb8fee4fcc3.js",
  "/static/vendor/idb-keyval-iife.min.3904ab3a122d.js",
  "/static/vendor/dropzone.min.1c52d40bf872.js",
  "/static/cobrands/fixmystreet/offline_report.auto.min.8ae3e17511ba.js",
  "/static/cobrands/fixmystreet/prefetch-polyfill.auto.min.2da37c91514a.js",
  "/static/js/lazyload.auto.min.57c03e777d2f.js",
  "/static/cobrands/fixmystreet.com/js.auto.min.ef0ee19cd0a0.js",
  
  "/offline/fallback?4fd021df73ae"
];

const staticCache = 'static';
// const pageCache = 'pages';

addEventListener('install', function(evt) {
  evt.waitUntil(precache());
});

async function precache() {
  const cache = await caches.open(staticCache);
  return cache.addAll(requiredOffline);
}

addEventListener('fetch',  fetchEvent => {
  const request = fetchEvent.request;
  const url = new URL(request.url);

  if (url.origin !== location.origin) {
      return;
  }

  // Handle inspection form submission if offline...
  if (request.method === 'POST' && RegExp('/report/\\d+$').test(url)) {
    fetchEvent.respondWith(async function() {
      const fetchPromise = fetch(request.clone());
      try {
        return await fetchPromise;
      }
      catch {
        fetchEvent.waitUntil(async function() {
          var request_buffer = await request.arrayBuffer();
          var headers = request.headers;
          let formData = {};
          formData.contentType = headers.get('Content-Type');
          let boundary_re = /.*boundary=(.*)/;
          let bound = formData.contentType.match(boundary_re);

          let saved = '--' + bound[1] + "\r\nContent-Disposition: form-data; name=\"saved_at\"\r\n\r\n" + Math.floor(+new Date() / 1000) + "\r\n";
          var savedBuffer = new ArrayBuffer(saved.length);
          var bufView = new Uint8Array(savedBuffer);
          for (var i=0; i<saved.length; i++) {
            bufView[i] = saved.charCodeAt(i);
          }

          var tmp = new Uint8Array(request_buffer.byteLength + savedBuffer.byteLength);
          tmp.set(new Uint8Array(request_buffer), 0);
          tmp.set(bufView, 0);
          tmp.set(new Uint8Array(request_buffer), savedBuffer.byteLength);

          formData.text = tmp.buffer;

          var data = await idbKeyval.get('offlineData') || { cachedReports: {}, forms: [] };
          var forms = data.forms;
          if (!forms.length || tmp.toString() != new Uint8Array(forms[forms.length - 1][1].text).toString()) {
            forms.push([request.url, formData]);
          }
          return idbKeyval.set('offlineData', data);
        }());

        return Response.redirect('/my/planned?saved=1');
      };
    }());
  }

  if (request.method === "POST" && RegExp('/photo/upload/offline').test(url)) {
    // Pretend that the upload worked, to keep Dropzone happy.
    // XXX could maybe actually cache photo here and upload automatically when
    // online? But how to calculate same ID as server and give that to Dropzone...
    fetchEvent.respondWith(new Response("OK"));
  }

  if (request.method !== "GET") {
      return;
  }

  fetchEvent.respondWith(async function() {
    if (request.mode === 'navigate') {
      const fetchPromise = fetch(request);

// For now, only save pages manually for inspectors
//      fetchEvent.waitUntil(async function() {
//        const responseCopy = (await fetchPromise).clone();
//        const cache = await caches.open(pageCache);
//        await responseCopy.ok ? cache.put(request, responseCopy) : cache.delete(request);
//      }());

      try {
        return await fetchPromise;
      }
      catch {
        let cached = await caches.match(request) || await caches.match("/offline/fallback?4fd021df73ae");
        return cached || offlineResponse();
      }
    } else {
      const responseFromCache = await caches.match(request);
      return responseFromCache || fetch(request);
    }
  }());
});

var offlineResponse = () =>
    new Response('Service Unavailable', { status: 503, statusText: 'Service Unavailable', headers: { 'Content-Type': 'text/html' }});
