

self.serverPreparedData = {"offlineUrl":"/on/demandware.static/Sites-hobbycraft-uk-Site/-/default/dw20bcab43/offline.html","cachedParts":[{"url":"/on/demandware.store/Sites-hobbycraft-uk-Site/en_GB/Cart-MiniCart?sw=true","placeholder":"$swminicarticon$","skipParameter":null,"cacheSuffix":"MiniCartIcon","cacheCleanTriggerUrls":["/on/demandware.store/Cart-AddProduct","/cart/","/on/demandware.store/Cart-UpdateQuantity","/on/demandware.store/Cart-RemoveProductLineItem","/on/demandware.store/Cart-ChangeShipping","/on/demandware.store/Cart-AddCoupon","/on/demandware.store/Cart-RemoveCouponLineItem","/on/demandware.store/Cart-EditProductLineItem","/on/demandware.store/CSRF-AjaxFail","/session-expired/","/on/demandware.store/CheckoutServices-SubmitPayment","/on/demandware.store/CheckoutServices-PlaceOrder","/order-confirmation/","/on/demandware.store/COPlaceOrder-Submit","/on/demandware.store/Account-Login","/on/demandware.store/Account-Header","/login/","/on/demandware.store/Login-Logout","/on/demandware.store/Globale-GetSiteRedirectUrl","/on/demandware.store/Globale-CountryCurrencyChange","/on/demandware.store/Globale-OrderCreate","/on/demandware.store/Globale-OrderConfirmation","/on/demandware.store/CSRF-FailPage"]},{"url":"/on/demandware.store/Sites-hobbycraft-uk-Site/en_GB/Globale-Cache?remoteIncludeUrl=Page-IncludeFooter&sw=true","placeholder":"$swfooter$","skipParameter":"sw_skipfooter","cacheSuffix":"footer","cacheCleanTriggerUrls":["/on/demandware.store/EmailSubscribe-Subscribe","/on/demandware.store/Globale-GetSiteRedirectUrl","/on/demandware.store/Globale-CountryCurrencyChange","/on/demandware.store/Globale-OrderCreate","/on/demandware.store/Globale-OrderConfirmation","/on/demandware.store/Globale-CloseCountrySwitcher","/on/demandware.store/CSRF-FailPage"]}],"cachedUrls":[{"url":"/on/demandware.store/Sites-hobbycraft-uk-Site/en_GB/Cart-MiniCartShow","cacheSuffix":"MiniCartShow","cacheCleanTriggerUrls":["/on/demandware.store/Cart-AddProduct","/cart/","/on/demandware.store/Cart-UpdateQuantity","/on/demandware.store/Cart-RemoveProductLineItem","/on/demandware.store/Cart-ChangeShipping","/on/demandware.store/Cart-AddCoupon","/on/demandware.store/Cart-RemoveCouponLineItem","/on/demandware.store/Cart-EditProductLineItem","/on/demandware.store/CSRF-AjaxFail","/session-expired/","/on/demandware.store/CheckoutServices-SubmitPayment","/on/demandware.store/CheckoutServices-PlaceOrder","/order-confirmation/","/on/demandware.store/COPlaceOrder-Submit","/on/demandware.store/Account-Login","/on/demandware.store/Account-Header","/login/","/on/demandware.store/Login-Logout","/on/demandware.store/Globale-GetSiteRedirectUrl","/on/demandware.store/Globale-CountryCurrencyChange","/on/demandware.store/Globale-OrderCreate","/on/demandware.store/Globale-OrderConfirmation","/on/demandware.store/CSRF-FailPage"]},{"url":"/wishlist/","cacheSuffix":"WishlistShow","cacheCleanTriggerUrls":["/on/demandware.store/Wishlist-AddProduct","/on/demandware.store/Wishlist-RemoveProduct","/on/demandware.store/Wishlist-EditProductListItem"]}],"urlSiteId":"hobbycraft-uk","urlLocale":"en_GB","cacheVersion":"v1730693398185"};
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./cartridges/plugin_serviceworker_w/cartridge/client/default/js/sw/helpers/streamHelper.ts":
/*!**************************************************************************************************!*\
  !*** ./cartridges/plugin_serviceworker_w/cartridge/client/default/js/sw/helpers/streamHelper.ts ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X_SF_CC_REQUESTLOCALE: () => (/* binding */ X_SF_CC_REQUESTLOCALE),
/* harmony export */   X_SF_CC_SITEID: () => (/* binding */ X_SF_CC_SITEID),
/* harmony export */   createStream: () => (/* binding */ createStream)
/* harmony export */ });
/* eslint-disable no-restricted-globals */
const PLACEHOLDER_PREFIX = '$sw';
const LAST_BYTES_COUNT = 20; // 20 bytes chosen because we not have placeholder longer than 20 bytes

const X_SF_CC_SITEID = 'x-sf-cc-siteid';
const X_SF_CC_REQUESTLOCALE = 'x-sf-cc-requestlocale';

/**
 * @memberof plugin_serviceworker_w
 * @category plugin_serviceworker_w
 * @module streamHelper
 * @subcategory global
 * @description Helper for generating response stream for service worker.
 */
/**
 * @description Method to check if some of placeholders defined in placeholderConfigs
 * exist in array of bytes starting from position startIndex.
 * The function iterates over bytes and compare each byte with placeholders in current position
 * If placeholder does not match it is removed from array of placeholders and will no longer checked in current run.
 *
 * If placeholder was found - returns matched placeholder and it start and end position of bytes array.
 * @param {UInt8Array} bytes - array of bytes to lookup
 * @param {int} startIndex - start position
 * @param {UInt8Array} placeholderPrefixBytes - array with prefix '$sw' converted to bytes. Used to properly calculate start index.
 * @param {Array} placeholderConfigs - array of all placeholders
 * @returns {null|object} found placeholder or null
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function matchPlaceholderConfig(bytes, startIndex, placeholderPrefixBytes, placeholderConfigs) {
  const bytesLength = bytes.length;
  let i = startIndex;
  let placeholderIndex = 0;
  let checkFinished = false;
  let sequenceFound = false;
  let foundPlaceholder = null;
  // Found placeholder prefix sequence in array
  // Checking if next bytes match with some of placeholders
  const placeholdersMatches = placeholderConfigs.map(config => {
    return {
      config: config,
      placeholderBytes: config.placeholderBytes,
      length: config.placeholderBytes.length,
      match: config.placeholderBytes[placeholderIndex] === bytes[i],
      finished: config.placeholderBytes.length === 1
    };
  });
  i++;
  placeholderIndex++;
  while (i < bytesLength && placeholdersMatches.length > 0 && !checkFinished && !sequenceFound) {
    checkFinished = true;
    for (let k = placeholdersMatches.length - 1; k >= 0; k--) {
      const placeholdersMatch = placeholdersMatches[k];
      if (placeholderIndex < placeholdersMatch.length) {
        placeholdersMatch.match = placeholdersMatch.match && placeholdersMatch.placeholderBytes[placeholderIndex] === bytes[i];
      }
      if (placeholderIndex === placeholdersMatch.length - 1) {
        placeholdersMatch.finished = true;
      }
      checkFinished = checkFinished && placeholdersMatch.finished;
      sequenceFound = sequenceFound || placeholdersMatch.finished && placeholdersMatch.match;
      if (!placeholdersMatch.match) {
        // Remove configs that already not match to not check them further
        placeholdersMatches.splice(k, 1);
      }
    }
    i++;
    placeholderIndex++;
  }
  if (sequenceFound) {
    foundPlaceholder = placeholdersMatches[0];

    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    foundPlaceholder.endIndex = i - 1;

    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    foundPlaceholder.beginIndex = foundPlaceholder.endIndex

    // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
    - foundPlaceholder.length - placeholderPrefixBytes.length + 1;
  }
  return foundPlaceholder;
}

/**
 * @description Method to find placeholder in array of bytes.
 * It first of all try to find sequence of placeholder prefix '$sw' in array of bytes.
 * Only when prefix will be found - then will be executed method matchPlaceholderConfig to find
 * whether next bytes match with some of placeholders.
 * In case match found - bytes array will be split per chunks before placeholder and chunk after placeholder.
 *
 * If placeholders will be not found - last LAST_BYTES_COUNT bytes will be split from bytes array, in order to verify it again with next chunk.
 * It is required because there is possibility of issue when one piece of placeholder will be in first chunk and remaining piece in next chunk.
 * @param {UInt8Array} bytes - array of bytes to lookup
 * @param {UInt8Array} placeholderPrefixBytes - prefix '$sw' converted to bytes
 * @param {Array} placeholderConfigs - config of all placeholders
 * @param {boolean} isLastPart - flag to indetify that it is last part of response to process. Used to not populate lastBytes
 * @returns {object} object with foundPlaceholder, chunkBeforePlaceholder, chunkAfterPlaceholder, and lastBytes
 */
function findPlaceholderInBytes(bytes, placeholderPrefixBytes, placeholderConfigs, isLastPart) {
  const bytesLength = bytes.length;
  let i = 0;
  let prefixIndex = 0;
  let foundPlaceholder = null;
  let chunkBeforePlaceholder = bytes;
  let chunkAfterPlaceholder = null;
  let lastBytes = null;
  while (i < bytesLength && !foundPlaceholder) {
    while (bytes[i] === placeholderPrefixBytes[prefixIndex] && prefixIndex < placeholderPrefixBytes.length && i < bytesLength) {
      prefixIndex++;
      i++;
    }
    if (prefixIndex === placeholderPrefixBytes.length && i < bytesLength) {
      foundPlaceholder = matchPlaceholderConfig(bytes, i, placeholderPrefixBytes, placeholderConfigs);
    }
    prefixIndex = 0;
    i++;
  }
  if (foundPlaceholder) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'beginIndex' does not exist on type 'neve... Remove this comment to see the full error message
    chunkBeforePlaceholder = bytes.slice(0, foundPlaceholder.beginIndex);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'endIndex' does not exist on type 'never'... Remove this comment to see the full error message
    chunkAfterPlaceholder = bytes.slice(foundPlaceholder.endIndex + 1);
  } else if (!isLastPart) {
    if (chunkBeforePlaceholder.length > LAST_BYTES_COUNT) {
      lastBytes = chunkBeforePlaceholder.slice(chunkBeforePlaceholder.length - LAST_BYTES_COUNT);
      chunkBeforePlaceholder = chunkBeforePlaceholder.slice(0, chunkBeforePlaceholder.length - LAST_BYTES_COUNT);
    } else {
      lastBytes = chunkBeforePlaceholder;
      chunkBeforePlaceholder = null;
    }
  }
  return {
    foundPlaceholder,
    chunkBeforePlaceholder,
    chunkAfterPlaceholder,
    lastBytes
  };
}

/**
 * @description Method to prepare placeholders data to be matched with bytes array.
 * Converts placeholders to array of bytes.
 * @param {Array} cachedParts - original cache parts config that was passed into service worker initialization
 * @returns {object} object with placeholder prefix bytes array and converted placeholder configs
 */
function convertPlaceholdersToBytes(cachedParts) {
  const encoder = new TextEncoder();
  const placeholderPrefixBytes = encoder.encode(PLACEHOLDER_PREFIX);
  const placeholderConfigs = cachedParts.map(config => {
    if (config.placeholder.indexOf(PLACEHOLDER_PREFIX) !== 0) {
      throw Error(`All placeholders should start from ${PLACEHOLDER_PREFIX}. Please fix configuration!`);
    }
    return {
      ...config,
      placeholderBytes: encoder.encode(config.placeholder.replace(PLACEHOLDER_PREFIX, ''))
    };
  });
  return {
    placeholderPrefixBytes,
    placeholderConfigs
  };
}

/**
 * @description Prepare init response object based on passed fromResponse
 * @param {Response} fromResponse source response object
 * @returns {object} result object containing init object for Response constructor
 */
function getInitResponseObj(fromResponse) {
  const newResponseHeaders = {
    status: fromResponse.status,
    statusText: fromResponse.statusText,
    headers: {
      'X-ServedByServiceWorker': 'true'
    }
  };
  fromResponse.headers.forEach(function (v, k) {
    newResponseHeaders.headers[k] = v;
  });
  return newResponseHeaders;
}

/**
 * @description Get cached part from cache based on passed parameter or request it from server if not found.
 * @param {object} partsConfig - cache part config
 * @param {string} siteId - current site ID
 * @param {string} locale - current locale
 * @param {string} cacheId - global cache id
 * @returns {object} object where property value is array of bytes of cached part
 */
async function getCachePart(partsConfig, siteId, locale, cacheId) {
  const cacheKey = siteId + '.' + locale + '.' + partsConfig.cacheSuffix;
  let cachedPartResponse = await caches.match(cacheKey);
  if (!cachedPartResponse) {
    // if site or locale changed - need to reload all cached
    let partLoadUrl = partsConfig.url;

    // ensure we load proper siteId and locale
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
    partLoadUrl = partLoadUrl.replace(`-${self.serverPreparedData.urlSiteId}-`, `-${siteId}-`);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
    partLoadUrl = partLoadUrl.replace(`/${self.serverPreparedData.urlLocale}/`, `/${locale}/`);
    // load part of document
    cachedPartResponse = await fetch(new Request(partLoadUrl));
    const cache = await caches.open(cacheId);
    await cache.put(cacheKey, cachedPartResponse.clone());
  }
  const responseBytes = new Uint8Array(await cachedPartResponse.arrayBuffer());
  return {
    value: responseBytes
  };
}

/**
 * @description Merge Uint8Arrays arrays into one array
 * @param  {...Uint8Arrays} arrays to merge
 * @returns {Uint8Arrays} merged array
 */
function mergeUint8Arrays(...arrays) {
  let totalLength = 0;
  for (let i = 0; i < arrays.length; i++) {
    totalLength += arrays[i].length;
  }
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (let i = 0; i < arrays.length; i++) {
    result.set(arrays[i], offset);
    offset += arrays[i].length;
  }
  return result;
}

/**
 * @description Create stream based on baseResponse.
 * Base response is processed by looking for placeholders and replacing them based on cache parts config.
 * @param {Response} baseResponse - base response from server.
 * @param {Array} cachedParts - cache parts configs
 * @param {string} cacheId - global cache id for looking of cached parts
 * @returns {Response} response inited with stream
 */
function createStream(baseResponse, cachedParts, cacheId) {
  const initResponseObj = getInitResponseObj(baseResponse);
  const siteId = initResponseObj.headers[X_SF_CC_SITEID];
  const locale = initResponseObj.headers[X_SF_CC_REQUESTLOCALE];
  const responseStream = new ReadableStream({
    /**
     * @description Initialize stream by getting reader and transform placeholders to bytes.
     */
    async start() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'reader' does not exist on type 'Underlyi... Remove this comment to see the full error message
      this.reader = await baseResponse.body.getReader();
      const {
        placeholderPrefixBytes,
        placeholderConfigs
      } = convertPlaceholdersToBytes(cachedParts);

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'placeholderPrefixBytes' does not exist o... Remove this comment to see the full error message
      this.placeholderPrefixBytes = placeholderPrefixBytes;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'placeholderConfigs' does not exist on ty... Remove this comment to see the full error message
      this.placeholderConfigs = placeholderConfigs;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
      this.promisesQueue = [this.getNextChunkFromBaseResponse()];
    },
    /**
     * @description get next chunk from base response
     * @returns {object} object with next chunk result
     */
    async getNextChunkFromBaseResponse() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'reader' does not exist on type 'Underlyi... Remove this comment to see the full error message
      const result = await this.reader.read();
      return {
        ...result,
        isBaseResponse: true
      };
    },
    /**
     * @description Get next chunk from queue.
     * If it has flag mergeWithNext it will merge it with next chunk in queue
     * @returns {object} chunk result
     */
    async getFromQueue() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
      const result = await this.promisesQueue.shift();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
      while (result.mergeWithNext && this.promisesQueue.length > 0) {
        const {
          done,
          value,
          mergeWithNext,
          isBaseResponse
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
          // eslint-disable-next-line no-await-in-loop
        } = await this.promisesQueue.shift();
        result.done = result.done || done;
        result.mergeWithNext = mergeWithNext;
        result.isBaseResponse = isBaseResponse;
        if (value) {
          result.value = mergeUint8Arrays(result.value || [], value);
        }
      }
      return result;
    },
    /**
     * @description Pull from stream.
     * Take queue chunks and process it one by one. If will found placeholder chunks will be split and putted into queue.
     * @param {ReadableStreamDefaultController} controller - Stream Controller
     * @returns {null|Promise} result of execution. null if end.
     */

    // @ts-expect-error ts-migrate(2322) FIXME: Type '(controller: ReadableStreamController<any>) ... Remove this comment to see the full error message
    async pull(controller) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
      if (!this.promisesQueue.length) {
        controller.close();
        return null;
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'getFromQueue' does not exist on type 'Un... Remove this comment to see the full error message
      const {
        done,
        value,
        isBaseResponse
      } = await this.getFromQueue();

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'done' does not exist on type 'Underlying... Remove this comment to see the full error message
      this.done = this.done || done;

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'done' does not exist on type 'Underlying... Remove this comment to see the full error message
      if (this.done && !value) {
        controller.close();
        return null;
      }
      const {
        foundPlaceholder,
        chunkBeforePlaceholder,
        chunkAfterPlaceholder,
        lastBytes
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'placeholderPrefixBytes' does not exist o... Remove this comment to see the full error message
      } = findPlaceholderInBytes(value, this.placeholderPrefixBytes, this.placeholderConfigs, this.done);
      if (chunkBeforePlaceholder) {
        // eslint-disable-next-line spellcheck/spell-checker
        controller.enqueue(chunkBeforePlaceholder);
      }
      if (lastBytes) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
        this.promisesQueue.unshift(Promise.resolve({
          value: lastBytes,
          mergeWithNext: true
        }));
      }
      if (chunkAfterPlaceholder) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
        this.promisesQueue.unshift(Promise.resolve({
          value: chunkAfterPlaceholder,
          mergeWithNext: true
        }));
      }
      if (foundPlaceholder) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
        this.promisesQueue.unshift(getCachePart(foundPlaceholder.config, siteId, locale, cacheId));
      }

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'done' does not exist on type 'Underlying... Remove this comment to see the full error message
      if (!this.done && isBaseResponse) {
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
        this.promisesQueue.push(this.getNextChunkFromBaseResponse());
      }

      // @ts-expect-error ts-migrate(2722) FIXME: Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      return this.pull(controller);
    },
    cancel() {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'done' does not exist on type 'Underlying... Remove this comment to see the full error message
      this.done = true;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'promisesQueue' does not exist on type 'U... Remove this comment to see the full error message
      this.promisesQueue = [];
    }
  });
  return new Response(responseStream, initResponseObj);
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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************************************************************!*\
  !*** ./cartridges/plugin_serviceworker_w/cartridge/client/default/js/sw/service-worker.ts ***!
  \********************************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_streamHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/streamHelper */ "./cartridges/plugin_serviceworker_w/cartridge/client/default/js/sw/helpers/streamHelper.ts");
/* eslint-disable no-await-in-loop */
/**
 * @memberof plugin_serviceworker_w
 * @category plugin_serviceworker_w
 * @module service-worker
 * @subcategory global
 * @description This is the main service worker for the site.
 *
 * Service worker (SW) is a kind of Web Worker designed to run with the associated web-page. It runs
 * in separate thread and scope. SW has access to Browser low-level I/O APIs like Fetch, Cache;
 * Push notifications, Sync API, and Web Storage.
 *
 * It has a separate life-cycle that not interfering with tabs and running web-page.
 * SW instantiated by client-side JS (Please see service-worker-registration.js),
 * but could not access DOM or window scope. Please see [basic info](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
 *
 * SW mostly used as proxy servers between web-app and network, for push notification or message relay
 * between the opened tabs. Please see more [service worker capabilities](https://serviceworke.rs).
 *
 * This SW supports:
 * * cache Ajax responses, specified in config `serviceWorkerConfig.js`
 * * cache parts of page response(ie header/footer of page document), specified in config `serviceWorkerConfig.js`
 * * cleanup of Ajax response and page parts caches by pre-defined (in config `serviceWorkerConfig.js`) set of URL's that user browser called
 * * show offline page when network not available
 * * cache images, fonts, js and css files in a custom cache
 * * install site as a standalone page
 *
 * ## Installing SW
 *
 * SW installed with `service-worker-registration.js`. If we have trouble during installation
 * we unregister broken service worker.
 *
 * ## Replacing SW
 *
 * This service worker replaced automatically when:
 * 1. File changed on each build, by injecting into compiled script variable with current build version, or timestamp in case build version not available.
 * 2. Part of the file that rendered via ISML (see serviceWorker.js.isml it includes configuration data for SW) changed due to static cache invalidation
 *
 * Therefore deploying a new code version or static cache invalidation will trigger replacing of Service Worker.
 * We are not waiting when the last SW client (web page, tab) will be inactive to update unregister and replace old SW (default lifecycle).
 * Due to `self.skipWaiting()` we are replacing old SW as soon as possible and take control of
 * the page immediately due to `self.clients.claim()`.
 *
 * **Gotchas**: Always ensure that you have capabilities to replace server worker with a new one
 * without any user interaction. Broken and not replaceable SW that work with fetch could down the
 * production site without any rescues for end-user!
 *
 * ## Caches and caching
 * ### Overview
 * SW caching works via intercepting all of the `fetch` events fired by Browser.
 * You will find the different conditions in the event handler `self.addEventListener('fetch', (event) => {}` in this module.
 * All the conditions have their handlers for specific requests and situations, they will be described at own sections below
 *
 * ### Caching scope
 * * Offline page - it is requested and cached by SW once it is installed with this first site visit
 * * Ajax response - fully cached response, cleared by URL triggers (when the user reached any of them)
 * * Page parts - parts of the document that available to load via Controller-Action, cleared by URL triggers (when the user reached any of them)
 * * Static files - static files located in instance - JS, CSS, Fonts, Images. Cleared with general cache cleanup (see below cleanup strategy)
 *
 * ### Cache versioning and cleanup strategy
 * To let cache work correctly - it should be properly invalidated. In this SW we use a unique cache id for each version of the build or
 * once SFCC cache invalidation triggered. Cache id consists of 2 parts - build version +
 * SFCC cache version taken from static URL - 1.4.0.10_v1613403297975. So once any of it changed - the SW
 * will be replaced, the old cache will be invalid and removed during new SW activation.
 * Please see `invalidateCache` function.
 *
 * ### Configuration for SW
 * In order to make SW flexible for projects, we introduce `serviceWorkerConfig.js`. Typically it is dynamically generated JSON.
 * It holds the following data:
 * * Offline page (`offlineUrl`) - simple page URL, OOTB Boilerplate - static page URL from library
 * * Cache version (`cacheVersion`) - cache ID stamp. It is unique per SFCC instance cache version
 * * Identificator of current Site and Locale (`urlSiteId`, `urlLocale`) - necessary to proper work caching with other locales and sites under single domain
 * * Cached parts of document page's (`cachedParts`):
 * * * `url` - URL (generated by URLUtils) path to document part, that available to be retrieved individually
 * * * `placeholder` - placeholder in document that will be replaced with cached version(ie '$swheader$'), please note it should start with `$sw`
 * * * `skipParameter` - GET paramenter (ie 'sw_skipheader'), used by back-end to return instead of document part the placeholder
 * * * `cacheSuffix` - it is unique value per cache config, used to build cache key ((ie 'header'))
 * * * `cacheCleanTriggerUrls` - array of URL's (generated by URLUtils), when user browser reach it by navigating - triggers cleanup of cache for this part
 * * Cached Ajax requests (`cachedUrls`)
 * * * `url` - URL path (generated by URLUtils), that is called by storefront JS
 * * * `cacheSuffix` - it is unique value per cache config, used to build cache key ((ie 'MiniCartShow'))
 * * * `cacheCleanTriggerUrls` - array of URL's (generated by URLUtils), when user browser reach it by navigating OR AJAX - triggers cleanup of cache for this request
 *
 * ### Page parts caching strategy
 * In the `fetch` event listener we intercept all of the `navigate` request mode's(it is refresh page and going by site URL's by user browser)
 * We return our own result of Response by `handleNavigation` method.
 *
 * #### The order of steps is the following:
 * * We check if we need to clear any `parts` cache by current request URL (calling `handleCacheCleanup` method)
 * Please note that we cut from the current request URL the locale and siteId. Also, cache cleaned up for all locales under this cache `parts`,
 * for instance when user is logged in - we clear the header cache, so the icon title will be updated.
 * * We prepare a new URL to request a document without `parts` that is not necessary from back-end anymore.
 * We add GET parameters to the current page URL from `skipParameter` config attribute.
 * * Performing a fetch call to back-end into prepared URL(`modifiedRequestUrl`).
 * * From the received response, we copy headers (we will insert them into the resulting response) and use part of them - SiteId and Locale,
 * therefore SW knows to which site & locale customer did navigate.
 * * Received response will contain placeholders (back-end determine's which version to return by `skipParameter` submitted by GET),
 * which SW will replace with cached `parts`. Cached `parts` of the document saved/retrieved from the cache by cache key which generated in format
 * `<siteId>.<locale>.<cacheSuffix>`. In case cache record absent - SW fetching it by `url` defined in config (please note they will
 * be retrieved in parallel, due to wrapping these requests into `Promise.all`)
 * * Finally we build a new instance of Response object and return it to the browser (with headers that we copied from the original response)
 *
 * ### Ajax caching
 * In the `fetch` event listener we intercept all of the `same-origin` request mode's(it is all ajax requests to the same domain)
 * We return our own result of Response by `handleAjax` method.
 *
 * #### The order of steps is the following:
 * * Check if the requested URL match the present records in config attribute `cachedUrls` and object value of `url`. In case it does not
 * match - we do not intercept such `fetch` event (do not slow down the response by additional logic).
 * * If Request URL matched configuration - we work with it. Please note, that we did adjusted `ajax.js` module, so it includes
 * additional request headers - SiteId and Locale, therefore SW know which site and locale customer requested.
 * * SW builds a cache key in format `<siteId>.<locale>.<cacheSuffix>`. In case their cache record exists for this parameter -
 * SW uses it and makes a Response from cache to current Request, in case not - it executes `fetch`, stores the Response in case and
 * finally Response with network data received.
 * * As a next step - all of the `same-origin` request mode's compared with `cacheCleanTriggerUrls` of Cached Ajax requests config (`cachedUrls`).
 * When it matched - SW clears the cache for all `cacheSuffix` cache records (all siteId's and locales)
 *
 * ### Static resources caching
 * On the production builds (controlled by `self.buildSuitePreparedData.isProductionBuild`, which populated by Webpack) SW caching
 * static files, the criteria is the following for these files:
 * * it is static file (URL contains `demandware.static`, determined by function `isSiteStaticResource`)
 * * it is request.destination one of (determined by function `isCachableStaticResource`): script, font, style, image OR
 * file have extension .js/.css (because "pre-fetched" files request will not contain destination attribute)
 * * file retrieved from cache in case Request url present in `caches` or retrieved from network and placed into cache - if not
 *
 * **Gotchas**: If you include some parts that are related to customer groups, slots schedules, promotions etc. You need
 * to implement more complex cache invalidation strategies.
 *
 * ## Service worker under password protection
 *
 * On sandboxes and dev instances should be enabled basic authentication. Unfortunately Chrome browser
 * does not handle correctly 401 status, when it was intercepted by service worker - it does not show login popup
 * for basic authentication (See https://bugs.chromium.org/p/chromium/issues/detail?id=1055253 )
 * To handle this issue in current service worker implemented a workaround that returns into request-response
 * piece of JavaScript code that unregisters all service workers and reload the page without them.
 * It let the customer enter basic authentication credentials. After providing them - credentials will be cached in the current session,
 * and 401 status will not appear anymore
 *
 * ## Debugging on Safari, FF
 *
 * In case if you need debug SW on specific devices. You could organize post messages like this:
 *
 * ```
 * <script>
 *   navigator.serviceWorker.addEventListener('message', event => console.log(event.data.message));
 * </script>
 * ```
 *
 * ```
 * self.addEventListener('activate', (event) => {
 *   const sendPostMessage = messageStr => self.clients.matchAll()
 *     .then(clientList => clientList.forEach(client =>
 *            client.postMessage({ message: messageStr })));
 *
 *   event.waitUntil(sendPostMessage(CACHE_ID));
 * }
 * ```
 */

/**
  * These attributes prefilled by WebPack plugin "DefinePlugin" and the values replaced with dynamically generated values
  */
/* eslint-disable no-restricted-globals */
// @ts-expect-error ts-migrate(2339) FIXME: Property 'buildSuitePreparedData' does not exist o... Remove this comment to see the full error message
self.buildSuitePreparedData = {
  // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CODE_VERSION'.
  // eslint-disable-next-line no-undef
  codeVersion: "DEV-1730113121523",
  isProductionBuild: false
};
// Generate cache name as code version + BE cache version. We need it to properly invalidate it on each build or Demandware cache reset.
// @ts-expect-error ts-migrate(2339) FIXME: Property 'buildSuitePreparedData' does not exist o... Remove this comment to see the full error message
const CACHE_ID = self.buildSuitePreparedData.codeVersion + '_' + self.serverPreparedData.cacheVersion;
// @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
const OFFLINE_URL = self.serverPreparedData.offlineUrl;

/**
 * @description Prepares an object with key(url)->value(cache key name) pairs.
 * They will be used during determining necessity to clean some cache keys when reaching some URL by browser
 * @returns {object} result object key->value pairs
 */
function prepareCacheCleanUrls() {
  const cacheCleanUrls = [];

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
  // eslint-disable-next-line no-restricted-syntax
  for (const partsConfig of self.serverPreparedData.cachedParts) {
    // eslint-disable-next-line no-restricted-syntax
    for (const urlCleaner of partsConfig.cacheCleanTriggerUrls) {
      // eslint-disable-next-line no-useless-escape
      cacheCleanUrls[urlCleaner] = cacheCleanUrls[urlCleaner] || [];
      cacheCleanUrls[urlCleaner].push(partsConfig.cacheSuffix);
    }
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
  // eslint-disable-next-line no-restricted-syntax
  for (const requestCacheConfig of self.serverPreparedData.cachedUrls) {
    // eslint-disable-next-line no-restricted-syntax
    for (const urlCleaner of requestCacheConfig.cacheCleanTriggerUrls) {
      // eslint-disable-next-line no-useless-escape
      cacheCleanUrls[urlCleaner] = cacheCleanUrls[urlCleaner] || [];
      cacheCleanUrls[urlCleaner].push(requestCacheConfig.cacheSuffix);
    }
  }
  return cacheCleanUrls;
}

// @ts-expect-error ts-migrate(2339) FIXME: Property 'cacheCleanUrls' does not exist on type '... Remove this comment to see the full error message
self.cacheCleanUrls = prepareCacheCleanUrls();

/**
 * @description Check if the resource is served under Library or Static folders.
 * This needs to filter resources for cache or requests intercept.
 * @param {string} url - url of resource
 * @returns {boolean} - whether url is match Library or Static folders
 */
function isSiteStaticResource(url) {
  return /\/demandware.static\//g.test(url) && !/\/demandware.static\/-\/Sites-[^/]+/g.test(url);
}

/**
 * @description Check if resource file extension allowed
 * We doing this check because not all files have the proper "destination" attribute
 * @param {string} url - url of resource
 * @returns {boolean} - whether url is match set of allowed file extensions
 */
function isAllowedStaticResource(url) {
  return /.*\.(js|css)/.test(url);
}

/**
 * @description Function determines if globally caching static files allowed (production mode)
 * And as the second condition - if the file type is allowed to be cached
 * @param {Request} request Fetch event request object
 * @returns {boolean} - boolean value that tells to cache or not the request
 */
function isCachableStaticResource(request) {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'buildSuitePreparedData' does not exist o... Remove this comment to see the full error message
  if (!self.buildSuitePreparedData.isProductionBuild) {
    // Skip static resource caching when code built using non-production build mode.
    // In case developers need to verify the use case with caching static resources -
    // they should compile code in production build mode by using `npm run build:release` task
    return false;
  }
  if (isSiteStaticResource(request.url)) {
    return ['image', 'script', 'style', 'font'].indexOf(request.destination) !== -1 || isAllowedStaticResource(request.url);
  }
  return false;
}

/**
 * @description Prepare the request with modified URL parameters in order to load document without cached parts
 * @param {Request} originalRequest - original url from fetch event
 * @returns {Request} - modified Request enriched with necessary GET parameters in URL
 */
async function getModifiedRequest(originalRequest) {
  const url = new URL(originalRequest.url);

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
  if (self.serverPreparedData.cachedParts) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
    self.serverPreparedData.cachedParts.forEach(function (partsConfig) {
      if (partsConfig.skipParameter) {
        url.searchParams.append(partsConfig.skipParameter, 'true');
      }
    });
  }
  const modifiedRequestInit = {
    cache: originalRequest.cache,
    credentials: originalRequest.credentials,
    headers: originalRequest.headers,
    method: originalRequest.method,
    referrer: originalRequest.referrer,
    redirect: 'manual'
  };
  const bodyBuffer = await originalRequest.arrayBuffer();
  if (bodyBuffer && bodyBuffer.byteLength > 0) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'body' does not exist on type '{ cache: a... Remove this comment to see the full error message
    modifiedRequestInit.body = bodyBuffer;
  }

  // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'URL' is not assignable to parame... Remove this comment to see the full error message
  return new Request(url, modifiedRequestInit);
}

/**
 * @description Compare current request URL with pre-defined list of URL's that should be cached
 * @param {FetchEvent} fetchEvent fetch event object
 * @returns {object} result object with information necessary to store/gather information into/from cache
 */
function getCachedRequestConfig(fetchEvent) {
  const networkRequestSiteId = fetchEvent.request.headers.get(_helpers_streamHelper__WEBPACK_IMPORTED_MODULE_0__.X_SF_CC_SITEID);
  const networkRequestLocale = fetchEvent.request.headers.get(_helpers_streamHelper__WEBPACK_IMPORTED_MODULE_0__.X_SF_CC_REQUESTLOCALE);
  if (!networkRequestLocale || !networkRequestSiteId) {
    return false;
  }

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
  return self.serverPreparedData.cachedUrls.find(function (cachedRequestConfig) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
    let url = cachedRequestConfig.url.replace(`-${self.serverPreparedData.urlSiteId}-`, `-${networkRequestSiteId}-`);

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
    url = url.replace(`/${self.serverPreparedData.urlLocale}/`, `/${networkRequestLocale}/`);
    return fetchEvent.request.url.indexOf(url) !== -1;
  });
}

/**
* @description Code below return Response with html/script that unregisters all service workers and reloads page
* Since Chrome have a bug with showing Basic auth popup, we force to unregister
* service workers to open site first time without service worker and enter Auth Credentials
* See https://bugs.chromium.org/p/chromium/issues/detail?id=1055253
* @returns {Response} Response HTML/Javascript markup
*/
function getAuthorizationResponse() {
  return new Response(`
        <html>
            <head>
                <script>
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {
                        var unregisterPromises = registrations.map((registration) => registration.unregister());
                        return Promise.all(unregisterPromises);
                    }).then(function () {
                        window.location.reload();
                    }).catch(function () {
                        window.location.reload();
                    });
                </script>
            </head>
            <body>
            </body>
        </html>
    `, {
    headers: new Headers({
      'Content-Type': 'text/html'
    })
  });
}

/**
 * @description Delete all old caches associated with the scope. We call this function async
 * since service worker works only with actual cache.
 * @returns {Promise} returns the result of promises execution, that cleaned all cache keys
 */
async function invalidateCache() {
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.filter(oldVersion => oldVersion !== CACHE_ID).map(cacheName => caches.delete(cacheName)));
}

/**
 * @description Disable Navigation Preloads for a service worker.
 * It is required because preload tries to pre-fetch response with original URL. In our custom fetch handler, we add additional parameters
 * thus preload cause additional not needed request.
 * [navigation-preload](https://developers.google.com/web/updates/2017/02/navigation-preload)
 * @returns {void}
 */
async function disablePreloadResponse() {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'registration' does not exist on type 'Wi... Remove this comment to see the full error message
  if ('navigationPreload' in self.registration) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'registration' does not exist on type 'Wi... Remove this comment to see the full error message
    await self.registration.navigationPreload.disable();
  }
}

/**
 * @description Precache offline page resources.
 * Setting {cache: 'reload'} in the new request will ensure that the
 * response isn't fulfilled from the HTTP cache; i.e., it will be from
 * the network.
 * @returns {void}
 */
async function precacheOfflinePage() {
  const cache = await caches.open(CACHE_ID);
  await cache.add(new Request(OFFLINE_URL, {
    cache: 'reload'
  }));
}

/**
 * @description The function compare current request (from fetchEvent) URL with list of URL's, that are stated
 * in cache config as trigger URL's for cleanup cache. Each cache have path that consists from SiteId.Locale.suffix.
 * When cache cleanup triggered - it is cleaned up for all SiteId's and Locales
 * @param {FetchEvent} fetchEvent fetch event object
 * @returns {object} result object key->value pairs
 */
async function handleCacheCleanup(fetchEvent) {
  // get URL without siteId and locale
  const networkUrl = fetchEvent.request.url.replace(/(Sites-[\w\-_]+-Site\/[\w]{2,7}\/)/, '');
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'cacheCleanUrls' does not exist on type '... Remove this comment to see the full error message
  const triggerUrl = Object.keys(self.cacheCleanUrls).find(url => networkUrl.indexOf(url) !== -1);

  // @ts-expect-error ts-migrate(2339) FIXME: Property 'cacheCleanUrls' does not exist on type '... Remove this comment to see the full error message
  const cacheSuffixes = self.cacheCleanUrls[triggerUrl] || [];
  const deletePromises = [];
  if (cacheSuffixes.length > 0) {
    const cache = await caches.open(CACHE_ID);
    const cachedKeys = await cache.keys();

    // eslint-disable-next-line no-restricted-syntax
    for (const cacheRecord of cachedKeys) {
      if (cacheSuffixes.find(suffix => cacheRecord.url.indexOf('.' + suffix) !== -1)) {
        // clean cache

        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Promise<boolean>' is not assigna... Remove this comment to see the full error message
        deletePromises.push(cache.delete(cacheRecord));
      }
    }
  }
  await Promise.all(deletePromises);
}

/**
 * @description Function prepares a new Responce instance, that returned to all navigation requests.
 * Returned Response consists from network fetch result + partial cache.
 * Back-end will return in response headers SiteId and Locale - it is used when we determine cache key,
 * since service worker installed with config that generated for first page opened by user for current domain.
 * All necessary cache parts defined in serviceWorkerConfig.js + placeholders in ISML(ie. decorator page.isml).
 * In case network is not available - offline page returned (it is cached upon installation of service worker).
 * If `fetch()` returns a valid HTTP response with a response code
 * in the 4xx or 5xx range, the `catch()` will NOT be called.
 * Please find more information about offline page fallback
 * [Offline fallback](https://web.dev/offline-fallback-page/),
 * [Offline page example](https://serviceworke.rs/offline-fallback_service-worker_doc.html)
 * @param {FetchEvent} fetchEvent - fetch event object
 * @returns {response} - response object or preloaded response object
 */
async function handleNavigation(fetchEvent) {
  let networkResponse;
  try {
    // we need to cleanup cache in case URL matched
    await handleCacheCleanup(fetchEvent);
    // add parameters to original URL, to inform back-end to not return cached parts
    const modifiedRequest = await getModifiedRequest(fetchEvent.request);

    // loading the document (cached parts excluded by back-end)
    networkResponse = await fetch(modifiedRequest);
    if (networkResponse.status === 401) {
      // since we do not need to handle anything else we return response
      return getAuthorizationResponse();
    }
    if (networkResponse.status === 301 || networkResponse.status === 302 || networkResponse.type === 'opaqueredirect') {
      // Pass redirects back to storefront
      // to properly handle URL update in navigation bar
      return networkResponse;
    }

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'serverPreparedData' does not exist on ty... Remove this comment to see the full error message
    networkResponse = (0,_helpers_streamHelper__WEBPACK_IMPORTED_MODULE_0__.createStream)(networkResponse, self.serverPreparedData.cachedParts, CACHE_ID);
  } catch (error) {
    const cache = await caches.open(CACHE_ID);

    // when error thrown - it means that network is down and we have to display cached version of offline page
    networkResponse = await cache.match(OFFLINE_URL);
  }
  return networkResponse;
}

/**
 * @description Respond to the "same-origin" requests with network OR cached version
 * @param {FetchEvent} fetchEvent - fetch event object
 * @param {object} cachedRequestConfig - object with information necessary to store/gather information into/from cache
 * @returns {response} - response object from cache or network
 */
async function handleAjax(fetchEvent, cachedRequestConfig) {
  // check first if whole request can be cached
  if (cachedRequestConfig) {
    const cache = await caches.open(CACHE_ID);
    const networkRequestSiteId = fetchEvent.request.headers.get(_helpers_streamHelper__WEBPACK_IMPORTED_MODULE_0__.X_SF_CC_SITEID);
    const networkRequestLocale = fetchEvent.request.headers.get(_helpers_streamHelper__WEBPACK_IMPORTED_MODULE_0__.X_SF_CC_REQUESTLOCALE);
    const cacheKey = networkRequestSiteId + '.' + networkRequestLocale + '.' + cachedRequestConfig.cacheSuffix;
    let newResponse = await caches.match(cacheKey);
    if (newResponse) {
      return newResponse;
    } else {
      newResponse = await fetch(fetchEvent.request);
      fetchEvent.waitUntil(cache.put(cacheKey, newResponse.clone()));
      return newResponse;
    }
  }
  return fetch(fetchEvent.request);
}

/**
 * @description Function handler for static resource requests
 * Respond to fetch event with cache (if exist) first and fetch it
 * from network (and cache) if any. See more about caching strategies
 * [Caching files](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker),
 * [Network or cache](https://serviceworke.rs/strategy-network-or-cache.html)
 * @param {Request} request - request field of fetch event
 * @returns {response} - response object
 */
async function handleStatic(request) {
  const cache = await caches.open(CACHE_ID);
  const cachedResponse = await cache.match(request);
  let response;
  if (cachedResponse) {
    response = cachedResponse;
  } else {
    const serverResponse = await fetch(request);
    cache.put(request, serverResponse.clone()); // Cache fetched resource
    response = serverResponse;
  }
  return response;
}
self.addEventListener('install', event => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'waitUntil' does not exist on type 'Event... Remove this comment to see the full error message
  event.waitUntil(precacheOfflinePage());
  // Force the waiting service worker to become the active service worker.
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'skipWaiting' does not exist on type 'Win... Remove this comment to see the full error message
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'waitUntil' does not exist on type 'Event... Remove this comment to see the full error message
  event.waitUntil(disablePreloadResponse());
  invalidateCache(); // Delete all old cache. We read/write only from current cache so we delete all old caches async
  // Tell the active service worker to take control of the page immediately.
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'clients' does not exist on type 'Window ... Remove this comment to see the full error message
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'request' does not exist on type 'Event'.
  const request = event.request;
  // if it's AJAX and URL matches list of "to be cached" URL's - we call handleAjax
  const cachedRequestConfig = getCachedRequestConfig(event);
  if (request.mode === 'same-origin' && cachedRequestConfig) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'respondWith' does not exist on type 'Eve... Remove this comment to see the full error message
    event.respondWith(handleAjax(event, cachedRequestConfig));
  } else if (request.mode === 'same-origin') {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'waitUntil' does not exist on type 'Event... Remove this comment to see the full error message
    event.waitUntil(handleCacheCleanup(event));
  } else if (request.mode === 'navigate') {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'respondWith' does not exist on type 'Eve... Remove this comment to see the full error message
    event.respondWith(handleNavigation(event));
  } else if (isCachableStaticResource(request)) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'respondWith' does not exist on type 'Eve... Remove this comment to see the full error message
    event.respondWith(handleStatic(request));
  }
});
})();

/******/ })()
;
//# sourceMappingURL=service-worker.js.map
importScripts("https://api.exponea.com/js/service-worker.min.js");