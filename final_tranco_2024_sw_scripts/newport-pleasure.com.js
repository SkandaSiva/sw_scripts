/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 137:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   I: () => (/* binding */ cacheKeyGenerationFactory)
/* harmony export */ });
function decodeConfig(cfgStr) {
  // assumes key value pairs comma delimited
  const result = {};

  const kvPairs = cfgStr.split(",");

  for (const kv of kvPairs) {
    //
    const parts = kv.split("=");

    if (parts.length == 2) {
      //
      result[parts[0].trim()] = parts[1].trim();
    }
  }

  return result;
}

function cacheParams(configMap, url) {
  //
  let result = "";

  if (configMap.params) {
    //
    const idx = url.indexOf("?");

    if (idx !== -1) {
      //
      const up = new URLSearchParams(url.substring(idx));
      up.sort();

      const pList = configMap.params.split("|");

      for (let i = 0; i < pList.length; i++) {
        pList[i] = pList[i].trim();
      }

      const allParams = pList.includes("*");

      const up2 = new URLSearchParams();

      for (const k of up.keys()) {
        const inc = pList.includes(k);
        const noinc = pList.includes(`!${k}`);

        if ((allParams && !noinc) || (!allParams && inc)) {
          up2.set(k, up.get(k));
        }
      }

      up2.sort();

      result += `?${up2.toString()}`;
    }
  }

  return result;
}

function aliasCacheKeyGenerate(url, method, genConfig) {
  // name, params
  let key;

  // split up the gen config
  const configMap = decodeConfig(genConfig);

  if (configMap.name) {
    //
    key = `https://cache/${configMap.name}`;

    key += cacheParams(configMap, url);

    key += "~~" + method;
  } else {
    throw new Error("Missing required name parameter on alias");
  }

  return key;
}

function chopProtocolOff(url) {
  let result = url;

  const idx = url.indexOf("://");

  if (idx != -1) {
    result = url.substring(idx + 3);
  }

  return result;
}

function urlCacheKeyGenerate(url, method, genConfig) {
  // lastNPath, params
  let key = "https://cache/";

  // split up the gen config
  const configMap = decodeConfig(genConfig);

  const idx = url.indexOf("?");
  let u = idx != -1 ? url.substring(0, idx) : url;

  u = chopProtocolOff(u);

  if (configMap.lastNPath) {
    //
    if (idx !== -1) {
      const parts = u.split("/");

      let start = parts.length - configMap.lastNPath;
      if (start < 0) {
        start = 0;
      }

      let first = true;
      for (let i = start; i < parts.length; i++) {
        //
        if (!first) {
          key += "/";
        }

        first = false;

        key += parts[i];
      }
    } else {
      key += u;
    }
  } else {
    key += u;
  }

  key += cacheParams(configMap, url);

  key += "~~" + method;

  return key;
}

function customCacheKeyGenerate(url, method, genConfig) {
  let key;

  eval(`key = ${genConfig}('${url}', '${method}')`);

  return key + "~~" + method;
}

const genTypeGeneratorMap = {
  alias: aliasCacheKeyGenerate,
  url: urlCacheKeyGenerate,
  custom: customCacheKeyGenerate,
};

function cacheKeyGenerationFactory() {
  function _buildCacheKey(config, url, method) {
    let key;

    if (config.keyGenerator) {
      const parts = config.keyGenerator.split(":");

      if (parts.length == 2) {
        const genType = parts[0].trim();
        const genConfig = parts[1].trim();

        const keyGen = genTypeGeneratorMap[genType];

        if (keyGen) {
          key = keyGen(url, method, genConfig);
        }
      }
    } else {
      key = urlCacheKeyGenerate(url, method, "params=*");
    }

    return key;
  }

  return {
    buildCacheKey: _buildCacheKey,
  };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {

;// CONCATENATED MODULE: ./src/indexdb.js
function openDB(dbName, dbOptions, createIndexLoadFunction) {
  return new Promise((resolve, reject) => {
    let db;
    const name = dbName;

    const openRequest = indexedDB.open(dbName);

    openRequest.onerror = (event) => {
      reject(`Database could not be opened: ${dbName} due to ${event.message}`);
    };

    // eslint-disable-next-line no-unused-vars
    openRequest.onsuccess = (event) => {
      db = openRequest.result;

      resolve(impl);
    };

    openRequest.onupgradeneeded = (event) => {
      db = event.target.result;

      db.onerror = (e) => {
        reject(`Database could not be created: ${dbName} due to ${e.message}`);
      };

      // Create an objectStore for this database
      const objectStore = db.createObjectStore(dbName, dbOptions);

      // eslint-disable-next-line no-unused-vars
      objectStore.transaction.oncomplete = (event) => {
        if (createIndexLoadFunction) {
          try {
            createIndexLoadFunction(objectStore).then(() => {
              resolve(impl);
            });
          } catch (e) {
            reject(
              `Database index could not be created: ${dbName} due to ${e.message}`,
            );
          }
        } else {
          resolve(impl);
        }
      };
    };

    function _keys() {
      return new Promise((resolve, reject) => {
        const t = db.transaction([name]);

        t.onerror = (event) => {
          reject(`Failed to open transaction for keys ${event.message}`);
        };

        const objectStore = t.objectStore(name);

        const response = objectStore.getAllKeys();

        // eslint-disable-next-line no-unused-vars
        response.onerror = (event) => {
          // error or not found - always return null
          resolve(null);
        };

        response.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    }

    function _find(key) {
      return new Promise((resolve, reject) => {
        const t = db.transaction([name]);

        t.onerror = (event) => {
          reject(`Failed to open transaction for find ${event.message}`);
        };

        const objectStore = t.objectStore(name);

        const response = objectStore.get(key);

        // eslint-disable-next-line no-unused-vars
        response.onerror = (event) => {
          // error or not found - always return null
          resolve(null);
        };

        response.onsuccess = (event) => {
          resolve(event.target.result);
        };
      });
    }

    function _update(key, obj) {
      return new Promise((resolve, reject) => {
        const t = db.transaction([name], "readwrite");

        t.onerror = (event) => {
          reject(`Failed to open transaction for update ${event.message}`);
        };

        const objectStore = t.objectStore(name);

        const response = objectStore.put(obj, key);

        response.onerror = (event) => {
          // error or not found - always return null
          reject(
            `Failed to update ${key} with object ${obj} due to ${event.message}`,
          );
        };

        // eslint-disable-next-line no-unused-vars
        response.onsuccess = (event) => {
          resolve(null);
        };
      });
    }

    function _delete(key) {
      return new Promise((resolve, reject) => {
        const t = db.transaction([name], "readwrite");

        t.onerror = (event) => {
          reject(`Failed to open transaction for delete ${event.message}`);
        };

        const objectStore = t.objectStore(name);

        const response = objectStore.delete(key);

        response.onerror = (event) => {
          // error or not found - always return null
          reject(`Failed to delete ${key} due to ${event.message}`);
        };

        // eslint-disable-next-line no-unused-vars
        response.onsuccess = (event) => {
          resolve(null);
        };
      });
    }

    function _clear() {
      return new Promise((resolve, reject) => {
        const t = db.transaction([name], "readwrite");

        t.onerror = (event) => {
          reject(`Failed to open transaction for delete ${event.message}`);
        };

        const objectStore = t.objectStore(name);

        const response = objectStore.clear();

        response.onerror = (event) => {
          // error or not found - always return null
          reject(`Failed to clear due to ${event.message}`);
        };

        // eslint-disable-next-line no-unused-vars
        response.onsuccess = (event) => {
          resolve(null);
        };
      });
    }

    const impl = {
      keys: _keys,
      find: _find,
      update: _update,
      delete: _delete,
      clear: _clear,
    };
  });
}

// EXTERNAL MODULE: ./src/cache-key-generation-factory.js
var cache_key_generation_factory = __webpack_require__(137);
;// CONCATENATED MODULE: ./src/cache-stats.js


async function clearStats() {
  const statsDB = await openDB("statsDB");
  await statsDB.clear();
}

async function buildStats() {
  const statsDB = await openDB("statsDB");

  function formatPercent(val) {
    return Number(val / 100).toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 2,
    });
  }

  async function _updateStatMiss(cacheKey) {
    if (cacheKey) {
      let stat = await statsDB.find(cacheKey);

      if (!stat) {
        stat = {
          hit: 0,
          miss: 0,
          total: 0,
        };
      }

      stat.miss = stat.miss + 1;
      stat.total = stat.total + 1;

      await statsDB.update(cacheKey, stat);
    }
  }

  async function _updateStatHit(cacheKey) {
    if (cacheKey) {
      let stat = await statsDB.find(cacheKey);

      if (!stat) {
        stat = {
          hit: 0,
          miss: 0,
          total: 0,
        };
      }

      stat.hit = stat.hit + 1;
      stat.total = stat.total + 1;

      await statsDB.update(cacheKey, stat);
    }
  }

  function removePrefix(url) {
    const idx = url.indexOf("://");

    const prefix = url.substring(idx + 3);

    const idx2 = prefix.indexOf("/");

    return prefix.substring(idx2);
  }

  async function _buildStats() {
    const keys = await statsDB.keys();

    let stats = "<style> ";
    stats +=
      "table, th, td { border: 1px solid black; border-collapse: collapse; padding: 6px 8px 6px 8px } ";
    stats += "body { font-family: sans-serif; margin: 20px} ";
    stats += "table { width: 90%;} ";
    stats += "th, td { text-align: left; }";
    stats += "</style>";
    stats += "<h3 style='margin-left: 8px'>Cache Statistics</h3>";
    stats += "<table><thead><tr style='background-color: #c9d9f2'>";
    stats += "<th style='width: 65%'>Name</th>";
    stats += "<th>Method</th>";
    stats +=
      "<th style='text-align: right'>Hit</th><th style='text-align: right'>Hit %</th>";
    stats +=
      "<th style='text-align: right'>Miss</th><th style='text-align: right'>Miss %</th>";
    stats += "<th style='text-align: right'>Total</th>";
    stats += "</tr></thead><tbody>";

    let totalHit = 0;
    let totalMiss = 0;
    let total = 0;

    let idx = 0;
    for (const k of keys) {
      const v = await statsDB.find(k);

      const parts = k.split("~~");

      const url = removePrefix(parts[0]);

      const hitPer = (v.hit / v.total) * 100.0;
      const missPer = (v.miss / v.total) * 100.0;

      totalHit += v.hit;
      totalMiss += v.miss;
      total += v.total;

      stats += `<tr style='background-color: ${
        idx++ % 2 == 0 ? "white" : "#ebe2d3"
      }'><td>${url}</td><td>${parts[1]}</td><td style='text-align: right'>${
        v.hit
      }</td><td style='text-align: right'>${formatPercent(
        hitPer,
      )}</td><td style='text-align: right'>${
        v.miss
      }</td><td style='text-align: right'>${formatPercent(
        missPer,
      )}</td><td style='text-align: right'>${v.total}</td></tr>`;
    }

    const totalHitPer = (totalHit / total) * 100.0;
    const totalMissPer = (totalMiss / total) * 100.0;

    stats += `<tr style='font-weight: bold; background-color: #c3d1c2'><td style='text-align: right'>Total</td><td></td><td style='text-align: right'>${totalHit}</td><td style='text-align: right'>${formatPercent(
      totalHitPer,
    )}</td><td style='text-align: right'>${totalMiss}</td><td style='text-align: right'>${formatPercent(
      totalMissPer,
    )}</td><td style='text-align: right'>${total}</td></tr>`;

    stats += "</tbody></table>";

    return new Response(stats, {
      headers: { "Content-Type": "text/html" },
    });
  }

  return {
    updateStatHit: _updateStatHit,
    updateStatMiss: _updateStatMiss,
    buildStats: _buildStats,
  };
}

;// CONCATENATED MODULE: ./src/cache-resource-view.js


async function buildResourceView(sessionUUID) {
  const uuid = sessionUUID;

  const resourceDB = await openDB("resourceTTLEvents");

  function removePrefix(url) {
    const idx = url.indexOf("://");

    const prefix = url.substring(idx + 3);

    const idx2 = prefix.indexOf("/");

    return prefix.substring(idx2);
  }

  async function _buildView() {
    const keys = await resourceDB.keys();

    let stats = "<style> ";
    stats +=
      "table, th, td { border: 1px solid black; border-collapse: collapse; padding: 6px 8px 6px 8px } ";
    stats += "body { font-family: sans-serif; margin: 20px} ";
    stats += "table { width: 90%;} ";
    stats += "th, td { text-align: left; }";
    stats += "</style>";
    stats += "<h3 style='margin-left: 8px'>Cache Resources</h3>";
    stats += "<table><thead><tr style='background-color: #c9d9f2'>";
    stats += "<th style='width: 65%'>Name</th>";
    stats += "<th>Method</th>";
    stats +=
      "<th style='text-align: right'>Mode</th><th style='text-align: right'>Expires On</th>";
    stats += "</tr></thead><tbody>";

    let idx = 0;
    for (const k of keys) {
      const v = await resourceDB.find(k);

      const parts = k.split("~~");

      const url = removePrefix(parts[0]);

      let mode = "TTL";
      let expiresOn;

      if (v.objSessionUUID) {
        mode = "Session";
        expiresOn = v.objSessionUUID === uuid ? "-" : "expired";
      } else {
        expiresOn = new Date(v.expiresMillis).toLocaleString();
      }

      stats += `<tr style='background-color: ${
        idx++ % 2 == 0 ? "white" : "#ebe2d3"
      }'><td>${url}</td><td>${
        parts[1]
      }</td><td style='text-align: right'>${mode}</td><td style='text-align: right'>${expiresOn}</td></tr>`;
    }

    stats += "</tbody></table>";
    return new Response(stats, {
      headers: { "Content-Type": "text/html" },
    });
  }

  return {
    buildView: _buildView,
  };
}

;// CONCATENATED MODULE: ./src/cache-interval-view.js


async function buildIntervalView() {
  const intervalDB = await openDB("intervalTTL");

  function removePrefix(url) {
    const idx = url.indexOf("://");

    const prefix = url.substring(idx + 3);

    const idx2 = prefix.indexOf("/");

    return prefix.substring(idx2);
  }

  async function _buildView() {
    const keys = await intervalDB.keys();

    let stats = "<style> ";
    stats +=
      "table, th, td { border: 1px solid black; border-collapse: collapse; padding: 6px 8px 6px 8px } ";
    stats += "body { font-family: sans-serif; margin: 20px} ";
    stats += "table { width: 1024px; table-layout: fixed} ";
    stats += "th, td { text-align: left; }";
    stats += "</style>";
    stats += "<h3 style='margin-left: 8px'>Cache Interval Resources</h3>";
    stats += "<table><thead><tr style='background-color: #c9d9f2'>";
    stats += "<th style='width: 65%'>Name</th>";
    stats += "<th style='text-align: right'>Max Age</th>";
    stats += "<th style='text-align: right; width: 20%'>Re-Check On</th>";
    stats += "</tr></thead><tbody>";

    let idx = 0;
    for (const k of keys) {
      const v = await intervalDB.find(k);

      const url = removePrefix(k);

      let expiresOn = new Date(v.expiresMillis).toLocaleString();

      stats += `<tr style='background-color: ${
        idx++ % 2 == 0 ? "white" : "#ebe2d3"
      }'><td style='word-wrap: break-word'>${url}</td><td style='text-align: right'>${
        v.maxAge
      }</td><td style='text-align: right'>${expiresOn}</td></tr>`;
    }

    stats += "</tbody></table>";
    return new Response(stats, {
      headers: { "Content-Type": "text/html" },
    });
  }

  return {
    buildView: _buildView,
  };
}

;// CONCATENATED MODULE: ./src/interval-stale-check-cache.js


async function getIntervalCache() {
  let cache = await caches.open("intervalStorage");

  // need to open index db get it setup
  let intervalDB = await openDB("intervalTTL");

  async function _clear() {
    await caches.delete("intervalStorage");

    cache = await caches.open("intervalStorage");

    await intervalDB.clear();
  }

  function isType(request, ...extensions) {
    let result = false;

    let u = request.url.toLowerCase();
    const idx = u.indexOf("?");

    // if there are params, sort them to better match
    if (idx !== -1) {
      u = u.substring(0, idx);
    }

    for (const e of extensions) {
      if (u.endsWith(e)) {
        result = true;
        break;
      }
    }

    return result;
  }

  function resolveUrl(request) {
    let url = request.url;

    const idx = url.indexOf("?");

    // if there are params, sort them to better match
    if (idx !== -1) {
      const u = url.substring(0, idx);

      const q = new URLSearchParams(url.substring(idx + 1));

      q.sort();

      url = `${u}?${q.toString()}`;
    }

    return url;
  }

  async function clearCache(url, response, ttlObj) {
    // clear anything found
    if (response) {
      await cache.delete(url);
    }

    if (ttlObj) {
      await intervalDB.delete(url);
    }
  }

  function isExpired(ttlObj) {
    let result = false;

    if (ttlObj) {
      // time to live pathway
      if (new Date().getTime() >= ttlObj.expiresMillis) {
        result = true;
      }
    }

    return result;
  }

  async function handleExpired() {
    const keys = await intervalDB.keys();

    for (const url of keys) {
      const ttlObj = await intervalDB.find(url);

      if (isExpired(ttlObj)) {
        const response = await cache.match(url);

        await clearCache(url, response, ttlObj);
      }
    }
  }

  async function updateTTL(url, ttlObj) {
    if (ttlObj) {
      ttlObj.expiresMillis = new Date().getTime() + ttlObj.maxAge * 1000;

      await intervalDB.update(url, ttlObj);
    }
  }

  function toMap(str) {
    const result = {};

    if (str) {
      const p = str.split(",");

      for (const kv of p) {
        const kvp = kv.split("=");
        if (kv.length > 1) {
          result[kvp[0]] = kvp[1];
        } else {
          result[kvp[0]] = "";
        }
      }
    }

    return result;
  }

  async function put(url, response) {
    const cc = response.headers.get("cache-control");
    const ccMap = toMap(cc);
    const maxAge = ccMap["max-age"];

    //		const intervalStaleCheck = response.headers.get('interval-stale-check');

    if (maxAge) {
      let ttlObj = {
        expiresMillis: new Date().getTime() + maxAge * 1000,
        maxAge,
      };

      await intervalDB.update(url, ttlObj);

      await cache.put(url, response.clone());
    }
  }

  async function _get(request) {
    let response = null;

    if (
      request.method === "GET" &&
      isType(request, ".png", ".gif", ".jpeg", ".html")
    ) {
      const url = resolveUrl(request);

      response = await cache.match(url);

      let ttlObj = await intervalDB.find(url);

      let maxAge = null;

      if (ttlObj) {
        maxAge = ttlObj.maxAge;
      }

      if (isExpired(ttlObj)) {
        response = null;
        ttlObj = null;
      }

      // TODO - need to put If-Modified-Since, Need to get rid of no-cache
      // <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT
      // fetch options, headers

      if (!response) {
        //
        const options = {};

        if (maxAge) {
          options.headers = {};
          options.headers["cache-control"] = `max-age=${maxAge}`;
          options.headers["If-Modified-Since"] = new Date(
            new Date().getTime() - maxAge,
          ).toUTCString();
        }

        // do the fetch, no cache found
        response = await fetch(request, options);
      }

      if (
        !ttlObj &&
        response.ok &&
        !url.includes("expiredCode") &&
        !url.includes("expiredMessage")
      ) {
        // only cache the 200 & the pages which are not being travelled because of expiration
        await put(url, response);
      } else if (ttlObj && response.status === 304) {
        // update the ttl on 304
        await updateTTL(url, ttlObj);
      }
    }

    return response;
  }

  async function _flushPageResource(urlIn, search) {
    //
    let url = urlIn;

    // if there are params, sort them to better match
    if (search) {
      const q = new URLSearchParams(search);

      q.sort();

      url = `${urlIn}?${q.toString()}`;
    }

    const response = await cache.match(url);

    const ttlObj = await intervalDB.find(url);

    await clearCache(url, response, ttlObj);
  }

  await handleExpired();

  return {
    get: _get,
    clear: _clear,
    flushPageResource: _flushPageResource,
  };
}

;// CONCATENATED MODULE: ./src/resource-cache.js







async function getResourceCache(ssUid, rcc, version) {
  const sessionUUID = ssUid;
  const resourceCacheConfig = rcc;

  // need to open index db get it setup
  const resourceDB = await openDB("resourceTTLEvents");

  const intervalCache = await getIntervalCache();

  const currentVersion = await resourceDB.find("version");

  if (version && (!currentVersion || currentVersion !== version)) {
    // clear all caches & views - start from scratch
    await resourceDB.clear();

    await intervalCache.clear();

    await clearStats();

    await caches.delete("resources");

    await resourceDB.update("version", version);
  }

  const cache = await caches.open("resources");

  const stats = await buildStats();

  const resourceView = await buildResourceView(ssUid);
  const intervalView = await buildIntervalView();

  const cacheKeyGen = (0,cache_key_generation_factory/* cacheKeyGenerationFactory */.I)();

  const findConfigCache = {};
  const autoFlushConfigCache = {};

  // conditional used to clear any cached entries when json is empty
  // useful for csrf which fires but is not valid until fully logged in
  async function emptyJson(text, cacheKey) {
    try {
      const json = JSON.parse(text);

      if (!json || Object.keys(json).length === 0) {
        let response = await cache.match(cacheKey);

        const ttlEventObj = await resourceDB.find(cacheKey);

        await clearCache(cacheKey, response, ttlEventObj);
      }
    } catch (e) {
      // don't let not json blow this up
    }
  }

  // conditional used to clear any cached entries when text is not equal to logged_in
  async function notLoggedIn(text, cacheKey) {
    try {
      const cleanText = text.replaceAll('"', "");
      if (cleanText !== "logged_in" && cleanText !== "LOGGED_IN") {
        let response = await cache.match(cacheKey);

        const ttlEventObj = await resourceDB.find(cacheKey);

        await clearCache(cacheKey, response, ttlEventObj);
      }
    } catch (e) {
      // don't let not json blow this up
    }
  }

  async function autoFlush(url, response) {
    if (response) {
      let result;

      const existingConfig = autoFlushConfigCache[url];

      const parts = url.split("~~");

      let u = parts[0];
      let method = parts[1];

      if (existingConfig) {
        result = existingConfig;
      } else {
        if (resourceCacheConfig.flushCacheOn?.length) {
          for (const def of resourceCacheConfig.flushCacheOn) {
            const exp = new RegExp(def.regexPath, "i");

            if (
              u.match(exp) &&
              (def.methods.includes("*") || def.methods.includes(method))
            ) {
              result = def;
              autoFlushConfigCache[url] = def;

              break;
            }
          }
        }
      }

      if (result) {
        if (
          response.ok ||
          (result.onRedirect &&
            (response.redirected || response.type === "opaqueredirect")) ||
          result.allowedAdditionalStatusCodes?.includes(response.status)
        ) {
          if (result.sendEvents?.length) {
            for (const event of result.sendEvents) {
              await _handleEvent(event);
            }
          }
        }
      }
    }
  }

  function findConfig(url) {
    let ttl = undefined;
    let regexPath = undefined;
    let flushEvents = [];
    let cacheKey;
    let conditionalFlush;

    let result;

    const existingConfig = findConfigCache[url];

    const parts = url.split("~~");

    let u = parts[0];
    let method = parts[1];

    if (existingConfig) {
      result = existingConfig;
    } else {
      // do the never cache
      let neverCache = false;

      if (resourceCacheConfig.neverCached?.length) {
        resourceCacheConfig.neverCached.forEach((def) => {
          // for each pattern only execute if not already tripped
          if (!neverCache) {
            const exp = new RegExp(def.regexPath, "i");

            if (
              u.match(exp) &&
              (def.methods.includes("*") || def.methods.includes(method))
            ) {
              neverCache = true;
            }
          }
        });
      }

      if (!neverCache && resourceCacheConfig.cached?.length) {
        // do the cache
        let config = null;

        resourceCacheConfig.cached.forEach((def) => {
          // only do this if one has not been found
          if (!config) {
            // TODO - cache this expression??
            const exp = new RegExp(def.regexPath, "i");

            if (
              u.match(exp) &&
              (def.methods.includes("*") || def.methods.includes(method))
            ) {
              config = def;
            }
          }
        });

        if (config) {
          ttl = config.ttl;
          regexPath = config.regexPath;
          flushEvents = config.flushEvents;
          conditionalFlush = config.conditionalFlush;

          cacheKey = cacheKeyGen.buildCacheKey(config, u, method);
        }
      }

      result = {
        ttl,
        regexPath,
        flushEvents,
        cacheKey,
        conditionalFlush,
      };

      findConfigCache[url] = result;
    }

    return result;
  }

  async function clearCache(cacheKey, response, ttlEventObj) {
    // clear anything found
    if (response) {
      await cache.delete(cacheKey);
    }

    if (ttlEventObj) {
      await resourceDB.delete(cacheKey);
    }
  }

  function isExpired(ttlEventObj) {
    let result = false;

    const objSessionUUID = ttlEventObj ? ttlEventObj.objSessionUUID : null;
    const expiresMillis = ttlEventObj ? ttlEventObj.expiresMillis : null;

    // time to live pathway
    if (expiresMillis && new Date().getTime() >= expiresMillis) {
      result = true;
    }

    // session pathway
    if (objSessionUUID && objSessionUUID !== sessionUUID) {
      result = true;
    }

    return result;
  }

  async function checkExpired(cacheKey) {
    let response = await cache.match(cacheKey);

    const ttlEventObj = await resourceDB.find(cacheKey);

    if (isExpired(ttlEventObj)) {
      await clearCache(cacheKey, response, ttlEventObj);
    }
  }

  async function cleanExpired() {
    try {
      // only clean the expired on an interval
      const cacheKeys = await resourceDB.keys();

      if (cacheKeys) {
        for (const cacheKey of cacheKeys) {
          await checkExpired(cacheKey);
        }
      }
    } catch (e) {
      console.log(`Failed to clean expired entries due to ${e}`);
      console.log(e.stack);
    }
  }

  async function put(cacheKey, response, config) {
    let ttlEventObj;

    if (config.ttl) {
      ttlEventObj = {
        expiresMillis: new Date().getTime() + config.ttl * 1000,
      };
    } else {
      ttlEventObj = {
        objSessionUUID: sessionUUID,
      };
    }
    if (config.flushEvents) {
      ttlEventObj.events = [...config.flushEvents];
    }

    await resourceDB.update(cacheKey, ttlEventObj);

    await cache.put(cacheKey, response.clone());
  }

  function resolveUrl(request) {
    let url = request.url;
    const method = request.method;

    const idx = url.indexOf("?");

    // if there are params, sort them to better match
    if (idx !== -1) {
      const u = url.substring(0, idx);

      const q = new URLSearchParams(url.substring(idx + 1));

      q.sort();

      url = `${u}?${q.toString()}`;
    }

    url = `${url}~~${method}`;

    return url;
  }

  async function _get(request) {
    if (request.url.includes("/cache-stats/")) {
      return stats.buildStats();
    } else if (request.url.includes("/resource-cache/")) {
      return await resourceView.buildView();
    } else if (request.url.includes("/interval-cache/")) {
      return await intervalView.buildView();
    } else {
      // resolve the url
      const url = resolveUrl(request);

      const config = findConfig(url);

      const cacheKey = config.cacheKey;

      let response = null;
      let ttlEventObj = null;

      if (cacheKey) {
        response = await cache.match(cacheKey);

        ttlEventObj = await resourceDB.find(cacheKey);

        if (isExpired(ttlEventObj)) {
          // clear the cache for expired or not caching
          await clearCache(cacheKey, response, ttlEventObj);

          response = null;
        }
      } else {
        // handle interval cached resources
        response = await intervalCache.get(request);
      }

      const updateCache = !response;

      if (!response) {
        // do the fetch, no cache found
        response = await fetch(request);

        await stats.updateStatMiss(cacheKey);
      } else {
        // hit
        await stats.updateStatHit(cacheKey);
      }

      if (cacheKey && updateCache && response.ok) {
        // only cache the 200
        await put(cacheKey, response, config);
      }

      if (cacheKey && config.conditionalFlush) {
        if (config.conditionalFlush === "emptyJson") {
          //
          const text = await response.clone().text();

          await emptyJson(text, cacheKey);
        } else if (config.conditionalFlush === "notLoggedIn") {
          //
          const text = await response.clone().text();

          await notLoggedIn(text, cacheKey);
        }
      }

      await autoFlush(url, response);

      return response;
    }
  }

  async function handleCacheKeyEvent(cacheKey, eventName) {
    let response = await cache.match(cacheKey);

    const ttlEventObj = await resourceDB.find(cacheKey);

    if (ttlEventObj?.events?.includes(eventName)) {
      await clearCache(cacheKey, response, ttlEventObj);
    }
  }

  async function _handleEvent(eventName) {
    // get all the objects
    const cacheKeys = await resourceDB.keys();

    if (cacheKeys) {
      for (const cacheKey of cacheKeys) {
        await handleCacheKeyEvent(cacheKey, eventName);
      }
    }

    await cleanExpired();
  }

  async function _flushPageResource(urlIn, search) {
    //
    let url = urlIn;
    const method = "GET";

    if (search) {
      const q = new URLSearchParams(search);

      q.sort();

      url = `${urlIn}?${q.toString()}`;
    }

    url = `${url}~~${method}`;

    const config = findConfig(url);

    const cacheKey = config.cacheKey;

    if (cacheKey) {
      // higher cache found - clear it
      const response = await cache.match(cacheKey);

      const ttlEventObj = await resourceDB.find(cacheKey);

      console.log("expired cache clear!");

      await clearCache(cacheKey, response, ttlEventObj);
    } else {
      // no higher caching look at the interval
      await intervalCache.flushPageResource(urlIn, search);
    }
  }

  await cleanExpired();

  return {
    get: _get,
    handleEvent: _handleEvent,
    flushPageResource: _flushPageResource,
  };
}

;// CONCATENATED MODULE: ./src/load-resource-cache-config.js
function loadResourceCacheConfig(resourceCacheConfigUrl, callbackFunc) {
  fetch(resourceCacheConfigUrl)
    .then((response) => {
      return response.json();
    })
    .then((jsonObj) => {
      callbackFunc(jsonObj);
    });
}

;// CONCATENATED MODULE: ./src/service-worker.js



const searchParams = new URLSearchParams(self.location.search);
const sessionUUID = searchParams.get("sessionUUID");
const resourceCacheConfigUrl = searchParams.get("resourceCacheConfigUrl");
const configVer = searchParams.get("configVer");
const domainRoot = searchParams.get("domainRoot");
const containerEndpoint = searchParams.get("containerEndpoint");
const loginUrl = searchParams.get("loginUrl");

// when new config ver - wipe out the prior storage

console.log(
  `**** sw: setting session id: ${sessionUUID}, config version: ${configVer}, domainRoot: ${domainRoot}`,
);

let resourceCache;

async function postMessageToClient(message) {
  const clients = await self.clients.matchAll({
    type: "window",
  });

  for (const client of clients) {
    client.postMessage(message);
  }

  return message;
}

// eslint-disable-next-line no-unused-vars
self.addEventListener("install", (event) => {
  self.skipWaiting().catch((err) => console.log(err));
});

self.addEventListener("activate", async (event) => {
  event.waitUntil(self.clients.claim());
  event.waitUntil(postMessageToClient({ type: "serviceWorkerActivated" }));
});

self.addEventListener("fetch", async (event) => {
  try {
    const url = event.request.url;

    const sameDomain = url.startsWith(domainRoot);
    const containerDomain =
      !containerEndpoint ||
      (!containerEndpoint.startsWith("http://") &&
        url.startsWith(containerEndpoint));

    if (resourceCache && (sameDomain || containerDomain)) {
      if (sameDomain && url.endsWith(".logout.html")) {
        event.respondWith(Response.redirect(loginUrl));
      } else {
        const responsePromise = resourceCache.get(event.request);
        event.respondWith(responsePromise);
      }
    }
  } catch (err) {
    console.log(`Failed to fetch ${event.request.url} due to ${err.message}`);
  }
});

loadResourceCacheConfig(resourceCacheConfigUrl, (resourceCacheConfig) => {
  getResourceCache(sessionUUID, resourceCacheConfig, configVer).then(
    (cache) => {
      resourceCache = cache;
    },
  );
});

})();

/******/ })()
;