

const APEX_CACHE_MATCHER = '\u002Fi\u002F';
const APEX_CACHE_PREFIX = "APEX-CORE-";
const APEX_CACHE_NAME = APEX_CACHE_PREFIX + '21.2.4';

const APP_CACHE_MATCHER = "134/files/static/v";
const APP_CACHE_PREFIX = "APEX-APP-134-v";

let appCacheNeedsCleanup = true;
 
// The install event is fired when the Service Worker is installing
// We use this event to download and cache resources for the offline page
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Delete old APEX cache that we no longer use or need
const cleanAPEXCaches = () => {
  caches.keys().then(cacheNames => Promise.all(
    cacheNames.map(cacheName => {
      if (cacheName.startsWith(APEX_CACHE_PREFIX) && cacheName !== APEX_CACHE_NAME) {
        return caches.delete(cacheName);
      }
    })
  ));
};

// Delete old app cache that we no longer use or need
const cleanAppCaches = (appCacheName) => {
  if (appCacheNeedsCleanup) {
    appCacheNeedsCleanup = false;
    caches.keys().then(cacheNames => Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName.startsWith(APP_CACHE_PREFIX) && cacheName !== appCacheName) {
          return caches.delete(cacheName);
        }
      })
    ));
  }
};
 
// Once a new Service Worker has installed and a previous version is not being used,
// the new one activates, and you get an activate event. Because the old version is out of the way,
// it is a good time to handle schema migrations in IndexedDB and also delete unused caches.
self.addEventListener("activate", (event) => {
  cleanAPEXCaches();
  return self.clients.claim();
});
 
// The fetch event intercepts all resources requested by the client
// Our strategy is to serve the cached version of our static resources first
// If the cache cannot find the requested resource, then serve from the network
// If the network resource is cachable, then store in the cache for next time
// If network is failing and the resource is a new page (html navigation)
// Then serve the offline page fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      let cacheName;
      let cache;
      let response;

      if (event.request && event.request.url && event.request.url.indexOf(APEX_CACHE_MATCHER) >= 0) {
        cacheName = APEX_CACHE_NAME;
      } else if (event.request && event.request.url && event.request.url.indexOf(APP_CACHE_MATCHER) >= 0) {
        const fileVersion = event.request.url.split(APP_CACHE_MATCHER).pop().split("/")[0];
        cacheName = APP_CACHE_PREFIX + fileVersion;
        cleanAppCaches(cacheName);
      }

      // Try to get from the cache first
      if (cacheName) {
        cache = await caches.open(cacheName);
        response = await cache.match(event.request);
        if (response) {
          return response;
        }
      }
 
      // DevTools opening will trigger these o-i-c requests, which this SW cant handle.
      // This is a Chromium bug we can ignore
      // https://github.com/paulirish/caltrainschedule.io/issues/49
      if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") {
        return new Response();
      }

      // Then get from network
      try {
        response = await fetch(event.request);

        // Clone response to put in cache
        if (response.ok && cacheName) {
          const resClone = response.clone();
          try {
            cache.put(event.request, resClone);
          } catch (error) {
            // Ignore
          }
        }

        // Return ressource from network
        return response;
      } catch (error) {
        if (event.request.mode === "navigate") {
          // Serve the offline page via a Response object
          return new Response('\u000A\u003Chtml lang=\u0022en\u0022\u003E\u000A  \u003Chead\u003E\u000A    \u003Cmeta http-equiv=\u0022Content-Type\u0022 content=\u0022text\u002Fhtml; charset=UTF-8\u0022 \u002F\u003E\u000A    \u003Cmeta name=\u0022viewport\u0022 content=\u0022width=device-width, initial-scale=1\u0022 \u002F\u003E\u000A    \u003Cmeta name=\u0022color-scheme\u0022 content=\u0022dark light\u0022 \u002F\u003E\u000A    \u003Ctitle\u003ECan\u0027t connect\u003C\u002Ftitle\u003E\u000A    \u003Cstyle\u003E\u000A      html {\u000A        font-size: 100\u0025;\u000A      }\u000A\u000A      body {\u000A        font: 1.25rem system-ui, -apple-system, system-ui, sans-serif;\u000A        display: flex;\u000A        justify-content: center;\u000A        text-align: center;\u000A        padding: 1rem;\u000A        min-width: 320px;\u000A      }\u000A\u000A      main {\u000A        align-self: center;\u000A      }\u000A\u000A      svg {\u000A        max-width: calc(100\u0025 - 2rem);\u000A        width: 20rem;\u000A        margin-bottom: 2rem;\u000A      }\u000A\u000A      h1 {\u000A        font-size: 2.5rem;\u000A        margin-block-start: 0;\u000A        margin-block-end: 1rem;\u000A      }\u000A\u000A      p {\u000A        font-size: 1.25rem;\u000A        margin-block-start: 0;\u000A        margin-block-end: 2rem;\u000A      }\u000A\u000A      button {\u000A        background-color: #006BD8;\u000A        color: #fff;\u000A        border-radius: .25rem;\u000A        font-size: 1rem;\u000A        padding: .75rem 2rem;\u000A        border: none;\u000A        cursor: pointer;\u000A        min-width: 8rem;\u000A      }\u000A    \u003C\u002Fstyle\u003E\u000A  \u003C\u002Fhead\u003E\u000A  \u003Cbody\u003E\u003Cmain\u003E\u000A    \u003Csvg xmlns=\u0022http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\u0022 viewBox=\u00220 0 400 280\u0022 role=\u0022presentation\u0022\u003E\u000A      \u003Cg fill=\u0022none\u0022\u003E\u000A        \u003Cpath d=\u0022M316.846 213.183c39.532 0 63.154-30.455 63.154-62.764 0-30.943-22.158-56.615-51.441-62.179v-1.17c0-48.123-38.947-87.07-87.07-87.07-39.044 0-72.036 25.672-83.066 61.007-8.492-3.612-17.863-5.564-27.722-5.564-34.261 0-62.764 24.11-69.694 56.322a51.007 51.007 0 0 0-9.468-.879C23.036 110.79 0 133.825 0 162.327c0 28.405 23.036 51.441 51.441 51.441l265.405-.585z\u0022 fill=\u0022currentColor\u0022 opacity=\u0022.2\u0022\u002F\u003E\u000A        \u003Ccircle fill=\u0022#D63B25\u0022 cx=\u0022336\u0022 cy=\u0022216\u0022 r=\u002264\u0022\u002F\u003E\u000A        \u003Cpath d=\u0022M367.357 198.439c-.395-.395-.947-.632-1.657-.632-.71 0-1.184.237-1.657.632L351.97 210.51l-10.494-10.493 12.072-12.072c.395-.395.71-.947.71-1.657A2.29 2.29 0 0 0 351.97 184c-.631 0-1.183.237-1.657.631l-12.071 12.072-7.496-7.496c-.394-.394-.947-.71-1.657-.71a2.29 2.29 0 0 0-2.288 2.288c0 .632.237 1.184.71 1.657l2.604 2.604-13.176 13.176a13.781 13.781 0 0 0-4.024 9.705c0 3.787 1.499 7.18 4.024 9.705l2.13 2.13-14.36 14.36c-.394.394-.71.947-.71 1.657a2.29 2.29 0 0 0 2.288 2.288c.631 0 1.184-.237 1.657-.71l14.36-14.36 1.736 1.736a13.781 13.781 0 0 0 9.704 4.024c3.787 0 7.18-1.5 9.705-4.024l13.176-13.177 2.92 2.92c.394.394.946.71 1.656.71a2.29 2.29 0 0 0 2.289-2.288c0-.632-.237-1.184-.71-1.657l-7.575-7.496 12.072-12.071c.394-.395.71-.947.71-1.657.079-.632-.237-1.184-.631-1.578zm-27.142 33.059a9.398 9.398 0 0 1-6.47 2.603c-2.525 0-4.813-.946-6.47-2.603l-7.1-7.101a9.124 9.124 0 0 1-2.683-6.47 9.124 9.124 0 0 1 2.682-6.47l13.177-13.176 3.156 3.156c.079.079.079.158.158.158l.157.157 13.413 13.413c.08.08.08.158.158.158l.158.158 2.761 2.762-13.097 13.255z\u0022 fill=\u0022#FFF\u0022\u002F\u003E\u000A      \u003C\u002Fg\u003E\u000A    \u003C\u002Fsvg\u003E\u000A    \u003Ch1\u003ECan\u0027t connect\u003C\u002Fh1\u003E\u000A    \u003Cp\u003EYou need an internet connection to use this app.\u003C\u002Fp\u003E\u000A    \u003Cbutton type=\u0022button\u0022\u003ERetry\u003C\u002Fbutton\u003E\u000A\u003C\u002Fmain\u003E\u000A\u000A\u003Cscript\u003E\u000A    document.querySelector(\u0022button\u0022).addEventListener(\u0022click\u0022, () =\u003E {\u000A        window.location.reload();\u000A    });\u000A\u003C\u002Fscript\u003E\u003C\u002Fbody\u003E\u000A\u003C\u002Fhtml\u003E', {
            headers: {"Content-Type": "text/html"}
          });
        } else {
            return new Response();
        }
      }
    })()
  );
});