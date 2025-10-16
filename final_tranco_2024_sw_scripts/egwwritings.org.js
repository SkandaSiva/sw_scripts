const testJson = {
  body: "American Standard Version",
  title: "EGW Writings",
  timestamp: "2020-06-02T17:01:21.8598649+00:00",
  lang: "en",
  icon: "https://alpha.egwhite.net/favicon.ico",
  image: "https://media2.egwwritings.org/covers/11139_s.jpg",
  actions: [{ action: "action=read&date=2020-06-02&book=11139", title: "Read" }]
};

const receivePushNotification = (event) => {
  console.log("[Service Worker] PUSH RECEIVED", event.data.json());

  if (event.data) {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => client.postMessage("PUSH_RECEIVED"));
    });

    const {
      title,
      lang = "en",
      body,
      tag,
      timestamp,
      requireInteraction,
      actions,
      image
    } = event.data.json();
    const promiseChain = self.registration.showNotification(title, {
      lang,
      body,
      requireInteraction,
      tag: tag || undefined,
      timestamp: timestamp ? Date.parse(timestamp) : undefined,
      actions: actions || [],
      image: image || undefined,
      badge: "/images/favicon96.png",
      icon: "/images/toast-image.jpg"
    });
    // Ensure the toast notification is displayed before exiting this function
    event.waitUntil(promiseChain);
  }
};

const getQueryByName = (name, url) => {
  if (!url) {
    return undefined;
  }
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) {
    return undefined;
  }
  if (!results[2]) {
    return "";
  }
  return results[2].replace(/\+/g, " ");
};

const onNotificationClick = (event) => {
  event.notification.close();
  if (event.notification && event.notification.actions[0]) {
    const paramAction = event.notification.actions[0].action;
    if (paramAction) {
      const date = getQueryByName("date", paramAction);
      const book = getQueryByName("book", paramAction);
      if (date && book) {
        console.log("PUSH onNotificationClick ok", event.action);
        // must be same url as formed in SubscriptionsUtils#makeReadUrl
        const selfRegScope = self.registration?.scope;

        let originWithSlash;
        if (selfRegScope) {
          originWithSlash = selfRegScope;
        } else {
          // sometimes doesn't equal the origin SW was registered on
          originWithSlash = self.location.origin + "/";
        }

        event.waitUntil(
          self.clients.openWindow(`${originWithSlash}subscription/read/${date}/${book}?fromPush=1`)
        );
      }
    }
  } else {
    console.log("PUSH onNotificationClick errors", event.action);
  }
};

self.addEventListener("push", receivePushNotification);
self.addEventListener("notificationclick", onNotificationClick);

const version = "0.2";

const urlSubstringStatic = "/static/";
const urlSubstringStaticDevelopment = "/static/development";
const urlSubstringStyles = "/styles/";
const urlSubstringFonts = "/fonts/";
const urlSubstringLocales = "/locales/";
const urlSubstringImages = "/images/";


const NAME_CACHE_WEBSITE = {
  STATIC: "static",
  STATIC_DEVELOPMENT: "static/development",
  STYLES: "styles",
  FONTS: "fonts",
  IMAGES: "images",
  LOCALES: "locales",
};

const SW_EVENTS_TYPES_TO = {
  CLEAR_WEBSITE_DATA: "clearWebsiteData",
};

const MAP_CACHE_WEBSITE_TO_CACHE_NAME = {
  [NAME_CACHE_WEBSITE.STATIC]: NAME_CACHE_WEBSITE.STATIC + version,
  [NAME_CACHE_WEBSITE.STATIC_DEVELOPMENT]: NAME_CACHE_WEBSITE.STATIC_DEVELOPMENT + version,
  [NAME_CACHE_WEBSITE.STYLES]: NAME_CACHE_WEBSITE.STYLES + version,
  [NAME_CACHE_WEBSITE.FONTS]: NAME_CACHE_WEBSITE.FONTS + version,
  [NAME_CACHE_WEBSITE.IMAGES]: NAME_CACHE_WEBSITE.IMAGES + version,
  [NAME_CACHE_WEBSITE.LOCALES]: NAME_CACHE_WEBSITE.LOCALES + version,
};

const selfRegistrationScope = self.registration.scope || (self.location.origin + "/");
const selfRegistrationOrigin = selfRegistrationScope.slice(0, -1);


const addUrlOrigin = (url) => {
  let urlFinal = url;
  if (url && url.indexOf(selfRegistrationOrigin) === -1) {
    urlFinal = selfRegistrationOrigin + url;
  }
  return urlFinal;
};

const removeUrlOrigin = (url) => {
  let urlFinal = url;
  if (url && url.indexOf(selfRegistrationOrigin) === 0) {
    urlFinal = url.replace(selfRegistrationOrigin, "");
  }
  return urlFinal;
};

// e.g. remove "?ts=[timestamp]" of next js DEV mode part
const getOriginAndPathnameOnly = (url) => {
  try {
    const { origin, pathname } = new URL(addUrlOrigin(url));
    return origin + pathname;
  } catch (e) {
    return selfRegistrationOrigin + url;
  }
};

const removeLastLetterIfSlash = (url) => {
  if (url && url[url.length - 1] === "/") {
    return url.slice(0, -1);
  }
  return url;
};

const prepareUrlToCompare = (url) => {
  // Note: functions call order is important
  let urlFinal = removeLastLetterIfSlash(
    removeUrlOrigin(
      getOriginAndPathnameOnly(decodeURI(url))
    )
  );

  return urlFinal || "/";
};

const getCacheKeyByUrl = (url) => {
  // Used pathname only, to prevent wrong detecting,
  // because origin/search/hash may be like an url substring, that is used to detect a cache key.
  const urlFinal = removeUrlOrigin(getOriginAndPathnameOnly(url));
  let cacheKey;

  if (urlFinal.includes(urlSubstringStaticDevelopment)) {
    cacheKey = MAP_CACHE_WEBSITE_TO_CACHE_NAME[NAME_CACHE_WEBSITE.STATIC_DEVELOPMENT];
  } else if (urlFinal.includes(urlSubstringStatic)) {
    cacheKey = MAP_CACHE_WEBSITE_TO_CACHE_NAME[NAME_CACHE_WEBSITE.STATIC];
  } else if (urlFinal.includes(urlSubstringStyles)) {
    cacheKey = MAP_CACHE_WEBSITE_TO_CACHE_NAME[NAME_CACHE_WEBSITE.STYLES];
  } else if (urlFinal.includes(urlSubstringFonts)) {
    cacheKey = MAP_CACHE_WEBSITE_TO_CACHE_NAME[NAME_CACHE_WEBSITE.FONTS];
  } else if (urlFinal.includes(urlSubstringLocales)) {
    cacheKey = MAP_CACHE_WEBSITE_TO_CACHE_NAME[NAME_CACHE_WEBSITE.LOCALES];
  } else if (urlFinal.includes(urlSubstringImages)) {
    cacheKey = MAP_CACHE_WEBSITE_TO_CACHE_NAME[NAME_CACHE_WEBSITE.IMAGES];
  }

  return cacheKey;
};

const getReqSuitable = async (url) => {
  const cacheKey = getCacheKeyByUrl(url);

  if (cacheKey) {
    const cache = await caches.open(cacheKey);

    const urlFinal = prepareUrlToCompare(url);

    const req = await cache.keys().then((reqs) => {
      return reqs.find((r) => prepareUrlToCompare(r.url) === urlFinal);
    });

    return {cache, req};
  }


  return null;
};

const getResSuitable = async (url) => {
  const result = await getReqSuitable(url);
  if (result.cache && result.req) {
    return await result.cache.match(result.req);
  }
  return null;
};

const cacheReqRes = async (req, res) => {
  const result = await getReqSuitable(req.url);

  if (result.req) {
    console.log(`%c[PREVENTED]: ${req.url}`, "background: orange; color: white;", { req: result});
  } else if (result.cache) {
    await result.cache.put(req, res.clone());
    console.log(`%c[CACHED]: ${req.url}`, "background: #00BFFF; color: white;");
  }
};


self.addEventListener("activate", (event) => {
  const currentCaches = [
    ...Object.values(MAP_CACHE_WEBSITE_TO_CACHE_NAME),
  ];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", async (e) => {
  if (e.request.method === "POST") {
    return;
  }

  const reqUrl = e.request.url;
  const isSameOrigin = reqUrl.startsWith(selfRegistrationOrigin);
  const isLocalhost = selfRegistrationOrigin.startsWith("http://localhost");

  if (
    isLocalhost || (
      !isSameOrigin
      && reqUrl.indexOf("fonts.googleapis.com") === -1 // "Roboto" font is needed
    )
  ) {
    return;
  }

  if (!getCacheKeyByUrl(e.request.url)) {
    return;
  }

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(e.request).then(async (res) => {
        if (res.ok) {
          await cacheReqRes(e.request, res);
        }

        return res;
      }).catch(async (e) => {
        try {
          let resSuitable = await getResSuitable(reqUrl);

          if (resSuitable) {
            return resSuitable;
          }

          console.log(
            `%cNOT responded for: ${reqUrl}. Error:`,
            "background: red; color: white;",
            { e },
          );
          return e;
        } catch (err) {
          console.log(
            `%cError: ${reqUrl}. Error:`,
            "background: red; color: white;",
            { e, err },
          );
          return e;
        }
      });
    })
  );
});


const handleClearWebsiteData = async () => {
  const urlsStatuses = {};

  for (const cacheName of Object.values(NAME_CACHE_WEBSITE)) {
    const cache = await caches.open(MAP_CACHE_WEBSITE_TO_CACHE_NAME[cacheName]);

    for (const req of await cache.keys()) {
      await cache.delete(req);
      urlsStatuses[removeUrlOrigin(req.url)] = false;
    }
  }
};

const IS_CONSOLE_LOGS = false;

self.addEventListener("message", async (event) => {
  try {
    if (IS_CONSOLE_LOGS) {
      console.log(`%cSW GOT A MESSAGE EVENT `, "background: blue; color: white;", event.data);
    }

    if (event.data.type === SW_EVENTS_TYPES_TO.CLEAR_WEBSITE_DATA) {
      await handleClearWebsiteData();
    }
  } catch (e) {
    console.log(`%cSW: parse message body error `, "background: red; color: white;", e);
  }
});

