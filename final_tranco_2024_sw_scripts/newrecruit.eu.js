const version = "v265.28";

const debug = false;
const modes = [
  "Cache/Save",
  "Cache/No",
  "Network/Save",
  "Network/No",
  "Cache Only",
  "Network Only/Save",
  "Network Only/No",
];

function removeDateParameter(url) {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.delete("date");
  return parsedUrl.toString();
}

function extractDateValue(url) {
  const parsedUrl = new URL(url);
  const dateValue = parsedUrl.searchParams.get("date");
  return dateValue;
}

async function findClosestBook(request) {
  const url = removeDateParameter(request.url) + "&";
  const date = new Date(extractDateValue(request.url));

  const cache = await caches.open("books_folder");
  const found = await cache.keys();
  const foundBooks = [];

  for (let req of found) {
    if (req.url.includes(url)) {
      const cdate = new Date(extractDateValue(request.url));
      foundBooks.push({
        url: req.url,
        date: new Date(cdate),
      });
      foundBooks.sort((b1, b2) => {
        if (b1.nrversion >= b2.nrversion) {
          return 1;
        }
        return -1;
      });
    }
  }

  if (!foundBooks || !foundBooks.length) {
    return null;
  }

  let i = 0;
  for (let elt of foundBooks) {
    if (date.getTime() > elt.date.getTime()) {
      break;
    }
    i++;
  }

  if (i >= foundBooks.length) {
    i = foundBooks.length - 1;
  }
  return foundBooks[i];
}

function isHtmlPage(request) {
  const res = request.url.includes("/app/") && request.url.endsWith(".js") == false;
  return res;
}

async function cleanTranslations() {
  let res = [];
  const books_folder = await caches.open("books_folder");
  const keys = await books_folder.keys();
  for (const request of keys) {
    if (request.url.includes("translation")) {
      res.push(books_folder.delete(request));
    }
  }
  return res;
}

async function mFetch(request, strat) {
  if (debug) {
    console.log("Fetching (" + modes[strat - 1] + ") " + request.url);
  }
  try {
    let mode = "same-origin";
    if (request.url.includes("newrecruit") || request.url.includes("github")) {
      mode = "cors";
    }
    return await fetch(request, { mode: mode });
  } catch (e) {
    return null;
  }
}

async function fCache(request) {
  if (isHtmlPage(request)) {
    return await caches.match(new Request("/app/"));
  }
  const res = await caches.match(request);
  return res;
}

function openCacheTab(request) {
  if (request.url.includes("books_")) {
    return caches.open("books_folder");
  }

  if (request.url.includes("user_")) {
    return caches.open("user_folder");
  }

  if (request.url.includes("tourny_")) {
    return caches.open("tourny_folder");
  }

  if (request.url.includes("report_get")) {
    return caches.open("report_folder");
  }

  if (request.url.includes("get_library")) {
    return caches.open("lib_folder");
  }

  if (request.url.includes("/settings/")) {
    return caches.open("settings_folder");
  }

  return caches.open("newrecruit");
}

async function fetchAndCache(request, strat) {
  const resp = await mFetch(request, strat);
  if (resp == null) return null;

  const cacheTab = await openCacheTab(request);

  // We do not want to put messages resulting in json errors in cache
  let noCache = false;
  try {
    if (request.url.includes("/api/")) {
      const json = await resp.clone().json();
      if (json.error) {
        noCache = true;
      }
    }
  } catch (e) {
    noCache = false;
  }

  // Only cache if resp is ok (200-299)
  if (resp.ok == false) {
    noCache = true;
  }

  if (noCache == false) {
    try {
      if (isHtmlPage(request)) {
        await cacheTab.put("/app/", resp.clone());
      } else {
        await cacheTab.put(request, resp.clone());
      }
    } catch {
      console.log("Error: " + request.url);
    }
  }

  return resp;
}

async function networkFirst(request, save, strat) {
  let res;
  if (save) {
    res = await fetchAndCache(request, strat);
  } else {
    res = mFetch(request, strat);
  }
  // If res is null, look into cache
  if (res == null || !res.ok) {
    return fCache(request);
  }
  return res;
}

async function cacheFirst(request, save, onlyCache, strat) {
  const reponse = await fCache(request);
  // reponse is null if we found no cache
  if (reponse == null || !reponse.ok) {
    if (onlyCache) return null;
    if (save) {
      return fetchAndCache(request, strat);
    }
    return mFetch(request, strat);
  } else {
    // We found something in cache
    return reponse;
  }
}

async function cacheAll(requests, folder) {
  try {
    cache.addAll(requests);
  } catch {
    console.error("Could not cache: ", requests);
  }
}

this.addEventListener("install", async function (event) {
  event.waitUntil(self.skipWaiting());
});

async function onActivate() {
  console.log("Activating Service Worker...");
  await cleanTranslations();
}

/*
 ** Caching strategies
 ** 1 : Cache first and save to cache
 ** 2 : Cache first and don't save to cache
 ** 3 : Network first and save to cache
 ** 4 : Network first and don't save to cache
 ** 5 : Cache only
 ** 6 : Network only and save to cache
 ** 7 : Network only and don't save to cache
 */

async function handleRequest(event) {
  let cacheStrategy = 1;

  if (event.request.headers.get("SW-Cache-Strategy") != undefined) {
    cacheStrategy = parseInt(event.request.headers.get("SW-Cache-Strategy"));
  }

  if (isHtmlPage(event.request)) {
    cacheStrategy = 3;
  }

  let res = null;

  // Handle tournament lists
  // Check cache first and compare the version numbers
  // If no cache or version numbers are different, we fetch from server
  if (cacheStrategy != 5 && event.request.url.includes("versioned_")) {
    // Open what we have in cache
    res = await cacheFirst(event.request, false, true, 5);
    if (res == null || !res.ok) {
      // Nothing in cache so fetch
      res = await networkFirst(event.request, true, 6);
    } else {
      let localJson = await res.clone().json();
      if (localJson == null) {
        return res;
      }
      let localVersion = localJson.version || 0;
      let versionUrl = event.request.url.replace(/versioned_/, "get_version_").replace("obf_", "");
      let remoteVersion = await fetch(versionUrl, { method: "GET" });
      try {
        remoteVersion = await remoteVersion.json();
      } catch {
        remoteVersion = 0;
      }

      // Only fetch if we have different versions
      if (remoteVersion != localVersion) {
        res = await networkFirst(event.request, true, 6);
      }
    }
  } else {
    if (cacheStrategy === 1) {
      res = await cacheFirst(event.request, true, false, 1);
    }

    if (cacheStrategy === 2) {
      res = await cacheFirst(event.request, false, false, 2);
    }

    if (cacheStrategy === 3) {
      res = await networkFirst(event.request, true, 3);
    }

    if (cacheStrategy === 4) {
      res = await networkFirst(event.request, false, 4);
    }

    if (cacheStrategy === 5) {
      res = await cacheFirst(event.request, false, true, 5);
    }

    if (cacheStrategy === 7) {
      res = await mFetch(event.request, 7);
    }
  }

  // If we're fetching a book and all failed, try to find the closest version from cache
  if (event.request.url.includes("books_get_book") && res == null) {
    const newUrl = await findClosestBook(event.request);
    if (newUrl) {
      res = caches.match(newUrl.url);
    }
  }

  if (
    res != null &&
    event.request.url.includes("/app") === false &&
    event.request.url.includes("api/rpc") === false &&
    event.request.method === "GET" &&
    res.status >= 400
  ) {
    return Response.redirect("/app/");
  }
  if (res == null || res.status >= 400) {
    if (cacheStrategy == 5) {
      return new Response(
        JSON.stringify({ error: 2, message: "Cache only request was made and nothing found in cache" }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return res;
  }

  return res;
}

self.addEventListener("fetch", async function (event) {
  const noWorker = [
    "sockjs",
    "chrome-extension",
    "hot-update",
    "webpack",
    "hot-middleware",
    "google",
    "process-update",
    "bootstrap",
    "stripe.com",
    "hmr",
    "nuxtdev",
    "warhall",
    "firebasedatabase",
    "unityweb",
    "_loading",
    "t.paypal.com",
  ];
  let leave = false;

  if (event.request.method.toUpperCase() != "GET") {
    return false;
  }

  if (event.request.url.endsWith("/app")) {
    return false;
  }

  // Service worker should only handles request from app, assets or rpc gets
  let include = ["assets", "settings", "favicon.ico", "rpc", "app", "_nuxt"];
  let useWorker = false;
  for (let elt of include) {
    useWorker = useWorker || event.request.url.includes(elt);
  }
  if (useWorker == false) {
    return false;
  }

  for (const url of noWorker) {
    if (leave == false && event.request.url.includes(url)) {
      leave = true;
    }
  }
  if (leave) {
    return false;
  }
  event.respondWith(handleRequest(event));
});
