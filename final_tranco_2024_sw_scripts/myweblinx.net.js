/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/workbox-core/_private/DBWrapper.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/workbox-core/_private/DBWrapper.mjs ***!
  \**********************************************************/
/*! exports provided: DBWrapper */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DBWrapper", function() { return DBWrapper; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * A class that wraps common IndexedDB functionality in a promise-based API.
 * It exposes all the underlying power and functionality of IndexedDB, but
 * wraps the most commonly used features in a way that's much simpler to use.
 *
 * @private
 */
class DBWrapper {
  /**
   * @param {string} name
   * @param {number} version
   * @param {Object=} [callback]
   * @param {!Function} [callbacks.onupgradeneeded]
   * @param {!Function} [callbacks.onversionchange] Defaults to
   *     DBWrapper.prototype._onversionchange when not specified.
   * @private
   */
  constructor(name, version, {
    onupgradeneeded,
    onversionchange = this._onversionchange,
  } = {}) {
    this._name = name;
    this._version = version;
    this._onupgradeneeded = onupgradeneeded;
    this._onversionchange = onversionchange;

    // If this is null, it means the database isn't open.
    this._db = null;
  }

  /**
   * Returns the IDBDatabase instance (not normally needed).
   *
   * @private
   */
  get db() {
    return this._db;
  }

  /**
   * Opens a connected to an IDBDatabase, invokes any onupgradedneeded
   * callback, and added an onversionchange callback to the database.
   *
   * @return {IDBDatabase}
   * @private
   */
  async open() {
    if (this._db) return;

    this._db = await new Promise((resolve, reject) => {
      // This flag is flipped to true if the timeout callback runs prior
      // to the request failing or succeeding. Note: we use a timeout instead
      // of an onblocked handler since there are cases where onblocked will
      // never never run. A timeout better handles all possible scenarios:
      // https://github.com/w3c/IndexedDB/issues/223
      let openRequestTimedOut = false;
      setTimeout(() => {
        openRequestTimedOut = true;
        reject(new Error('The open request was blocked and timed out'));
      }, this.OPEN_TIMEOUT);

      const openRequest = indexedDB.open(this._name, this._version);
      openRequest.onerror = () => reject(openRequest.error);
      openRequest.onupgradeneeded = (evt) => {
        if (openRequestTimedOut) {
          openRequest.transaction.abort();
          evt.target.result.close();
        } else if (this._onupgradeneeded) {
          this._onupgradeneeded(evt);
        }
      };
      openRequest.onsuccess = ({target}) => {
        const db = target.result;
        if (openRequestTimedOut) {
          db.close();
        } else {
          db.onversionchange = this._onversionchange.bind(this);
          resolve(db);
        }
      };
    });

    return this;
  }

  /**
   * Polyfills the native `getKey()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @return {Array}
   * @private
   */
  async getKey(storeName, query) {
    return (await this.getAllKeys(storeName, query, 1))[0];
  }

  /**
   * Polyfills the native `getAll()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @param {number} count
   * @return {Array}
   * @private
   */
  async getAll(storeName, query, count) {
    return await this.getAllMatching(storeName, {query, count});
  }


  /**
   * Polyfills the native `getAllKeys()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @param {number} count
   * @return {Array}
   * @private
   */
  async getAllKeys(storeName, query, count) {
    return (await this.getAllMatching(
        storeName, {query, count, includeKeys: true})).map(({key}) => key);
  }

  /**
   * Supports flexible lookup in an object store by specifying an index,
   * query, direction, and count. This method returns an array of objects
   * with the signature .
   *
   * @param {string} storeName
   * @param {Object} [opts]
   * @param {string} [opts.index] The index to use (if specified).
   * @param {*} [opts.query]
   * @param {IDBCursorDirection} [opts.direction]
   * @param {number} [opts.count] The max number of results to return.
   * @param {boolean} [opts.includeKeys] When true, the structure of the
   *     returned objects is changed from an array of values to an array of
   *     objects in the form {key, primaryKey, value}.
   * @return {Array}
   * @private
   */
  async getAllMatching(storeName, {
    index,
    query = null, // IE errors if query === `undefined`.
    direction = 'next',
    count,
    includeKeys,
  } = {}) {
    return await this.transaction([storeName], 'readonly', (txn, done) => {
      const store = txn.objectStore(storeName);
      const target = index ? store.index(index) : store;
      const results = [];

      target.openCursor(query, direction).onsuccess = ({target}) => {
        const cursor = target.result;
        if (cursor) {
          const {primaryKey, key, value} = cursor;
          results.push(includeKeys ? {primaryKey, key, value} : value);
          if (count && results.length >= count) {
            done(results);
          } else {
            cursor.continue();
          }
        } else {
          done(results);
        }
      };
    });
  }

  /**
   * Accepts a list of stores, a transaction type, and a callback and
   * performs a transaction. A promise is returned that resolves to whatever
   * value the callback chooses. The callback holds all the transaction logic
   * and is invoked with two arguments:
   *   1. The IDBTransaction object
   *   2. A `done` function, that's used to resolve the promise when
   *      when the transaction is done, if passed a value, the promise is
   *      resolved to that value.
   *
   * @param {Array<string>} storeNames An array of object store names
   *     involved in the transaction.
   * @param {string} type Can be `readonly` or `readwrite`.
   * @param {!Function} callback
   * @return {*} The result of the transaction ran by the callback.
   * @private
   */
  async transaction(storeNames, type, callback) {
    await this.open();
    return await new Promise((resolve, reject) => {
      const txn = this._db.transaction(storeNames, type);
      txn.onabort = ({target}) => reject(target.error);
      txn.oncomplete = () => resolve();

      callback(txn, (value) => resolve(value));
    });
  }

  /**
   * Delegates async to a native IDBObjectStore method.
   *
   * @param {string} method The method name.
   * @param {string} storeName The object store name.
   * @param {string} type Can be `readonly` or `readwrite`.
   * @param {...*} args The list of args to pass to the native method.
   * @return {*} The result of the transaction.
   * @private
   */
  async _call(method, storeName, type, ...args) {
    const callback = (txn, done) => {
      txn.objectStore(storeName)[method](...args).onsuccess = ({target}) => {
        done(target.result);
      };
    };

    return await this.transaction([storeName], type, callback);
  }

  /**
   * The default onversionchange handler, which closes the database so other
   * connections can open without being blocked.
   *
   * @private
   */
  _onversionchange() {
    this.close();
  }

  /**
   * Closes the connection opened by `DBWrapper.open()`. Generally this method
   * doesn't need to be called since:
   *   1. It's usually better to keep a connection open since opening
   *      a new connection is somewhat slow.
   *   2. Connections are automatically closed when the reference is
   *      garbage collected.
   * The primary use case for needing to close a connection is when another
   * reference (typically in another tab) needs to upgrade it and would be
   * blocked by the current, open connection.
   *
   * @private
   */
  close() {
    if (this._db) {
      this._db.close();
      this._db = null;
    }
  }
}

// Exposed to let users modify the default timeout on a per-instance
// or global basis.
DBWrapper.prototype.OPEN_TIMEOUT = 2000;

// Wrap native IDBObjectStore methods according to their mode.
const methodsToWrap = {
  'readonly': ['get', 'count', 'getKey', 'getAll', 'getAllKeys'],
  'readwrite': ['add', 'put', 'clear', 'delete'],
};
for (const [mode, methods] of Object.entries(methodsToWrap)) {
  for (const method of methods) {
    if (method in IDBObjectStore.prototype) {
      // Don't use arrow functions here since we're outside of the class.
      DBWrapper.prototype[method] = async function(storeName, ...args) {
        return await this._call(method, storeName, mode, ...args);
      };
    }
  }
}


/***/ }),

/***/ "./node_modules/workbox-core/_private/WorkboxError.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/workbox-core/_private/WorkboxError.mjs ***!
  \*************************************************************/
/*! exports provided: WorkboxError */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WorkboxError", function() { return WorkboxError; });
/* harmony import */ var _models_messages_messageGenerator_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/messages/messageGenerator.mjs */ "./node_modules/workbox-core/models/messages/messageGenerator.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * Workbox errors should be thrown with this class.
 * This allows use to ensure the type easily in tests,
 * helps developers identify errors from workbox
 * easily and allows use to optimise error
 * messages correctly.
 *
 * @private
 */
class WorkboxError extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    let message = Object(_models_messages_messageGenerator_mjs__WEBPACK_IMPORTED_MODULE_0__["messageGenerator"])(errorCode, details);

    super(message);

    this.name = errorCode;
    this.details = details;
  }
}




/***/ }),

/***/ "./node_modules/workbox-core/_private/assert.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/workbox-core/_private/assert.mjs ***!
  \*******************************************************/
/*! exports provided: assert */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assert", function() { return finalAssertExports; });
/* harmony import */ var _private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/*
 * This method returns true if the current context is a service worker.
 */
const isSWEnv = (moduleName) => {
  if (!('ServiceWorkerGlobalScope' in self)) {
    throw new _private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('not-in-sw', {moduleName});
  }
};

/*
 * This method throws if the supplied value is not an array.
 * The destructed values are required to produce a meaningful error for users.
 * The destructed and restructured object is so it's clear what is
 * needed.
 */
const isArray = (value, {moduleName, className, funcName, paramName}) => {
  if (!Array.isArray(value)) {
    throw new _private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('not-an-array', {
      moduleName,
      className,
      funcName,
      paramName,
    });
  }
};

const hasMethod = (object, expectedMethod,
    {moduleName, className, funcName, paramName}) => {
  const type = typeof object[expectedMethod];
  if (type !== 'function') {
    throw new _private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('missing-a-method', {paramName, expectedMethod,
      moduleName, className, funcName});
  }
};

const isType = (object, expectedType,
    {moduleName, className, funcName, paramName}) => {
  if (typeof object !== expectedType) {
    throw new _private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('incorrect-type', {paramName, expectedType,
      moduleName, className, funcName});
  }
};

const isInstance = (object, expectedClass,
    {moduleName, className, funcName,
      paramName, isReturnValueProblem}) => {
  if (!(object instanceof expectedClass)) {
    throw new _private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('incorrect-class', {paramName, expectedClass,
      moduleName, className, funcName, isReturnValueProblem});
  }
};

const isOneOf = (value, validValues, {paramName}) => {
  if (!validValues.includes(value)) {
    throw new _private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('invalid-value', {
      paramName,
      value,
      validValueDescription: `Valid values are ${JSON.stringify(validValues)}.`,
    });
  }
};

const isArrayOfClass = (value, expectedClass,
    {moduleName, className, funcName, paramName}) => {
  const error = new _private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('not-array-of-class', {
    value, expectedClass,
    moduleName, className, funcName, paramName,
  });
  if (!Array.isArray(value)) {
    throw error;
  }

  for (let item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};

const finalAssertExports =  false ? undefined : {
  hasMethod,
  isArray,
  isInstance,
  isOneOf,
  isSWEnv,
  isType,
  isArrayOfClass,
};




/***/ }),

/***/ "./node_modules/workbox-core/_private/cacheNames.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/workbox-core/_private/cacheNames.mjs ***!
  \***********************************************************/
/*! exports provided: cacheNames */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cacheNames", function() { return cacheNames; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




const _cacheNameDetails = {
  googleAnalytics: 'googleAnalytics',
  precache: 'precache-v2',
  prefix: 'workbox',
  runtime: 'runtime',
  suffix: self.registration.scope,
};

const _createCacheName = (cacheName) => {
  return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix]
      .filter((value) => value.length > 0)
      .join('-');
};

const cacheNames = {
  updateDetails: (details) => {
    Object.keys(_cacheNameDetails).forEach((key) => {
      if (typeof details[key] !== 'undefined') {
        _cacheNameDetails[key] = details[key];
      }
    });
  },
  getGoogleAnalyticsName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
  },
  getPrecacheName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.precache);
  },
  getPrefix: () => {
    return _cacheNameDetails.prefix;
  },
  getRuntimeName: (userCacheName) => {
    return userCacheName || _createCacheName(_cacheNameDetails.runtime);
  },
  getSuffix: () => {
    return _cacheNameDetails.suffix;
  },
};


/***/ }),

/***/ "./node_modules/workbox-core/_private/cacheWrapper.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/workbox-core/_private/cacheWrapper.mjs ***!
  \*************************************************************/
/*! exports provided: cacheWrapper */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cacheWrapper", function() { return cacheWrapper; });
/* harmony import */ var _WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _assert_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var _getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getFriendlyURL.mjs */ "./node_modules/workbox-core/_private/getFriendlyURL.mjs");
/* harmony import */ var _logger_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _executeQuotaErrorCallbacks_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./executeQuotaErrorCallbacks.mjs */ "./node_modules/workbox-core/_private/executeQuotaErrorCallbacks.mjs");
/* harmony import */ var _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../models/pluginEvents.mjs */ "./node_modules/workbox-core/models/pluginEvents.mjs");
/* harmony import */ var _utils_pluginUtils_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/pluginUtils.mjs */ "./node_modules/workbox-core/utils/pluginUtils.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/











/**
 * Wrapper around cache.put().
 *
 * Will call `cacheDidUpdate` on plugins if the cache was updated, using
 * `matchOptions` when determining what the old entry is.
 *
 * @param {Object} options
 * @param {string} options.cacheName
 * @param {Request} options.request
 * @param {Response} options.response
 * @param {Event} [options.event]
 * @param {Array<Object>} [options.plugins=[]]
 * @param {Object} [options.matchOptions]
 *
 * @private
 * @memberof module:workbox-core
 */
const putWrapper = async ({
  cacheName,
  request,
  response,
  event,
  plugins = [],
  matchOptions,
} = {}) => {
  if (true) {
    if (request.method && request.method !== 'GET') {
      throw new _WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('attempt-to-cache-non-get-request', {
        url: Object(_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_2__["getFriendlyURL"])(request.url),
        method: request.method,
      });
    }
  }

  const effectiveRequest = await _getEffectiveRequest({
    plugins, request, mode: 'write'});

  if (!response) {
    if (true) {
      _logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].error(`Cannot cache non-existent response for ` +
        `'${Object(_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_2__["getFriendlyURL"])(effectiveRequest.url)}'.`);
    }

    throw new _WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('cache-put-with-no-response', {
      url: Object(_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_2__["getFriendlyURL"])(effectiveRequest.url),
    });
  }

  let responseToCache = await _isResponseSafeToCache({
    event,
    plugins,
    response,
    request: effectiveRequest,
  });

  if (!responseToCache) {
    if (true) {
      _logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].debug(`Response '${Object(_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_2__["getFriendlyURL"])(effectiveRequest.url)}' will ` +
      `not be cached.`, responseToCache);
    }
    return;
  }

  const cache = await caches.open(cacheName);

  const updatePlugins = _utils_pluginUtils_mjs__WEBPACK_IMPORTED_MODULE_6__["pluginUtils"].filter(
      plugins, _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHE_DID_UPDATE);

  let oldResponse = updatePlugins.length > 0 ?
      await matchWrapper({cacheName, matchOptions, request: effectiveRequest}) :
      null;

  if (true) {
    _logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].debug(`Updating the '${cacheName}' cache with a new Response for ` +
      `${Object(_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_2__["getFriendlyURL"])(effectiveRequest.url)}.`);
  }

  try {
    await cache.put(effectiveRequest, responseToCache);
  } catch (error) {
    // See https://developer.mozilla.org/en-US/docs/Web/API/DOMException#exception-QuotaExceededError
    if (error.name === 'QuotaExceededError') {
      await Object(_executeQuotaErrorCallbacks_mjs__WEBPACK_IMPORTED_MODULE_4__["executeQuotaErrorCallbacks"])();
    }
    throw error;
  }

  for (let plugin of updatePlugins) {
    await plugin[_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHE_DID_UPDATE].call(plugin, {
      cacheName,
      event,
      oldResponse,
      newResponse: responseToCache,
      request: effectiveRequest,
    });
  }
};

/**
 * This is a wrapper around cache.match().
 *
 * @param {Object} options
 * @param {string} options.cacheName Name of the cache to match against.
 * @param {Request} options.request The Request that will be used to look up
 *     cache entries.
 * @param {Event} [options.event] The event that propted the action.
 * @param {Object} [options.matchOptions] Options passed to cache.match().
 * @param {Array<Object>} [options.plugins=[]] Array of plugins.
 * @return {Response} A cached response if available.
 *
 * @private
 * @memberof module:workbox-core
 */
const matchWrapper = async ({
  cacheName,
  request,
  event,
  matchOptions,
  plugins = [],
}) => {
  const cache = await caches.open(cacheName);

  const effectiveRequest = await _getEffectiveRequest({
    plugins, request, mode: 'read'});

  let cachedResponse = await cache.match(effectiveRequest, matchOptions);
  if (true) {
    if (cachedResponse) {
      _logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].debug(`Found a cached response in '${cacheName}'.`);
    } else {
      _logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].debug(`No cached response found in '${cacheName}'.`);
    }
  }

  for (const plugin of plugins) {
    if (_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHED_RESPONSE_WILL_BE_USED in plugin) {
      cachedResponse = await plugin[_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHED_RESPONSE_WILL_BE_USED]
          .call(plugin, {
            cacheName,
            event,
            matchOptions,
            cachedResponse,
            request: effectiveRequest,
          });
      if (true) {
        if (cachedResponse) {
          _assert_mjs__WEBPACK_IMPORTED_MODULE_1__["assert"].isInstance(cachedResponse, Response, {
            moduleName: 'Plugin',
            funcName: _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHED_RESPONSE_WILL_BE_USED,
            isReturnValueProblem: true,
          });
        }
      }
    }
  }

  return cachedResponse;
};

/**
 * This method will call cacheWillUpdate on the available plugins (or use
 * status === 200) to determine if the Response is safe and valid to cache.
 *
 * @param {Object} options
 * @param {Request} options.request
 * @param {Response} options.response
 * @param {Event} [options.event]
 * @param {Array<Object>} [options.plugins=[]]
 * @return {Promise<Response>}
 *
 * @private
 * @memberof module:workbox-core
 */
const _isResponseSafeToCache = async ({request, response, event, plugins}) => {
  let responseToCache = response;
  let pluginsUsed = false;
  for (let plugin of plugins) {
    if (_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHE_WILL_UPDATE in plugin) {
      pluginsUsed = true;
      responseToCache = await plugin[_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHE_WILL_UPDATE]
          .call(plugin, {
            request,
            response: responseToCache,
            event,
          });

      if (true) {
        if (responseToCache) {
          _assert_mjs__WEBPACK_IMPORTED_MODULE_1__["assert"].isInstance(responseToCache, Response, {
            moduleName: 'Plugin',
            funcName: _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHE_WILL_UPDATE,
            isReturnValueProblem: true,
          });
        }
      }

      if (!responseToCache) {
        break;
      }
    }
  }

  if (!pluginsUsed) {
    if (true) {
      if (!responseToCache.status === 200) {
        if (responseToCache.status === 0) {
          _logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].warn(`The response for '${request.url}' is an opaque ` +
            `response. The caching strategy that you're using will not ` +
            `cache opaque responses by default.`);
        } else {
          _logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].debug(`The response for '${request.url}' returned ` +
          `a status code of '${response.status}' and won't be cached as a ` +
          `result.`);
        }
      }
    }
    responseToCache = responseToCache.status === 200 ? responseToCache : null;
  }

  return responseToCache ? responseToCache : null;
};

/**
 * Checks the list of plugins for the cacheKeyWillBeUsed callback, and
 * executes any of those callbacks found in sequence. The final `Request` object
 * returned by the last plugin is treated as the cache key for cache reads
 * and/or writes.
 *
 * @param {Object} options
 * @param {Request} options.request
 * @param {string} options.mode
 * @param {Array<Object>} [options.plugins=[]]
 * @return {Promise<Request>}
 *
 * @private
 * @memberof module:workbox-core
 */
const _getEffectiveRequest = async ({request, mode, plugins}) => {
  const cacheKeyWillBeUsedPlugins = _utils_pluginUtils_mjs__WEBPACK_IMPORTED_MODULE_6__["pluginUtils"].filter(
      plugins, _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHE_KEY_WILL_BE_USED);

  let effectiveRequest = request;
  for (const plugin of cacheKeyWillBeUsedPlugins) {
    effectiveRequest = await plugin[_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHE_KEY_WILL_BE_USED].call(
        plugin, {mode, request: effectiveRequest});

    if (typeof effectiveRequest === 'string') {
      effectiveRequest = new Request(effectiveRequest);
    }

    if (true) {
      _assert_mjs__WEBPACK_IMPORTED_MODULE_1__["assert"].isInstance(effectiveRequest, Request, {
        moduleName: 'Plugin',
        funcName: _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginEvents"].CACHE_KEY_WILL_BE_USED,
        isReturnValueProblem: true,
      });
    }
  }

  return effectiveRequest;
};

const cacheWrapper = {
  put: putWrapper,
  match: matchWrapper,
};


/***/ }),

/***/ "./node_modules/workbox-core/_private/deleteDatabase.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/workbox-core/_private/deleteDatabase.mjs ***!
  \***************************************************************/
/*! exports provided: deleteDatabase */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteDatabase", function() { return deleteDatabase; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * Deletes the database.
 * Note: this is exported separately from the DBWrapper module because most
 * usages of IndexedDB in workbox dont need deleting, and this way it can be
 * reused in tests to delete databases without creating DBWrapper instances.
 *
 * @param {string} name The database name.
 * @private
 */
const deleteDatabase = async (name) => {
  await new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);
    request.onerror = ({target}) => {
      reject(target.error);
    };
    request.onblocked = () => {
      reject(new Error('Delete blocked'));
    };
    request.onsuccess = () => {
      resolve();
    };
  });
};


/***/ }),

/***/ "./node_modules/workbox-core/_private/executeQuotaErrorCallbacks.mjs":
/*!***************************************************************************!*\
  !*** ./node_modules/workbox-core/_private/executeQuotaErrorCallbacks.mjs ***!
  \***************************************************************************/
/*! exports provided: executeQuotaErrorCallbacks */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "executeQuotaErrorCallbacks", function() { return executeQuotaErrorCallbacks; });
/* harmony import */ var _private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _models_quotaErrorCallbacks_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/quotaErrorCallbacks.mjs */ "./node_modules/workbox-core/models/quotaErrorCallbacks.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * Runs all of the callback functions, one at a time sequentially, in the order
 * in which they were registered.
 *
 * @memberof workbox.core
 * @private
 */
async function executeQuotaErrorCallbacks() {
  if (true) {
    _private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].log(`About to run ${_models_quotaErrorCallbacks_mjs__WEBPACK_IMPORTED_MODULE_1__["quotaErrorCallbacks"].size} ` +
        `callbacks to clean up caches.`);
  }

  for (const callback of _models_quotaErrorCallbacks_mjs__WEBPACK_IMPORTED_MODULE_1__["quotaErrorCallbacks"]) {
    await callback();
    if (true) {
      _private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].log(callback, 'is complete.');
    }
  }

  if (true) {
    _private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].log('Finished running callbacks.');
  }
}




/***/ }),

/***/ "./node_modules/workbox-core/_private/fetchWrapper.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/workbox-core/_private/fetchWrapper.mjs ***!
  \*************************************************************/
/*! exports provided: fetchWrapper */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchWrapper", function() { return fetchWrapper; });
/* harmony import */ var _WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _logger_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _assert_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var _private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_private/getFriendlyURL.mjs */ "./node_modules/workbox-core/_private/getFriendlyURL.mjs");
/* harmony import */ var _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../models/pluginEvents.mjs */ "./node_modules/workbox-core/models/pluginEvents.mjs");
/* harmony import */ var _utils_pluginUtils_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/pluginUtils.mjs */ "./node_modules/workbox-core/utils/pluginUtils.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/









/**
 * Wrapper around the fetch API.
 *
 * Will call requestWillFetch on available plugins.
 *
 * @param {Object} options
 * @param {Request|string} options.request
 * @param {Object} [options.fetchOptions]
 * @param {Event} [options.event]
 * @param {Array<Object>} [options.plugins=[]]
 * @return {Promise<Response>}
 *
 * @private
 * @memberof module:workbox-core
 */
const wrappedFetch = async ({
  request,
  fetchOptions,
  event,
  plugins = []}) => {
  // We *should* be able to call `await event.preloadResponse` even if it's
  // undefined, but for some reason, doing so leads to errors in our Node unit
  // tests. To work around that, explicitly check preloadResponse's value first.
  if (event && event.preloadResponse) {
    const possiblePreloadResponse = await event.preloadResponse;
    if (possiblePreloadResponse) {
      if (true) {
        _logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].log(`Using a preloaded navigation response for ` +
          `'${Object(_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_3__["getFriendlyURL"])(request.url)}'`);
      }
      return possiblePreloadResponse;
    }
  }

  if (typeof request === 'string') {
    request = new Request(request);
  }

  if (true) {
    _assert_mjs__WEBPACK_IMPORTED_MODULE_2__["assert"].isInstance(request, Request, {
      paramName: request,
      expectedClass: 'Request',
      moduleName: 'workbox-core',
      className: 'fetchWrapper',
      funcName: 'wrappedFetch',
    });
  }

  const failedFetchPlugins = _utils_pluginUtils_mjs__WEBPACK_IMPORTED_MODULE_5__["pluginUtils"].filter(
      plugins, _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__["pluginEvents"].FETCH_DID_FAIL);

  // If there is a fetchDidFail plugin, we need to save a clone of the
  // original request before it's either modified by a requestWillFetch
  // plugin or before the original request's body is consumed via fetch().
  const originalRequest = failedFetchPlugins.length > 0 ?
    request.clone() : null;

  try {
    for (let plugin of plugins) {
      if (_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__["pluginEvents"].REQUEST_WILL_FETCH in plugin) {
        request = await plugin[_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__["pluginEvents"].REQUEST_WILL_FETCH].call(plugin, {
          request: request.clone(),
          event,
        });

        if (true) {
          if (request) {
            _assert_mjs__WEBPACK_IMPORTED_MODULE_2__["assert"].isInstance(request, Request, {
              moduleName: 'Plugin',
              funcName: _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__["pluginEvents"].CACHED_RESPONSE_WILL_BE_USED,
              isReturnValueProblem: true,
            });
          }
        }
      }
    }
  } catch (err) {
    throw new _WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('plugin-error-request-will-fetch', {
      thrownError: err,
    });
  }

  // The request can be altered by plugins with `requestWillFetch` making
  // the original request (Most likely from a `fetch` event) to be different
  // to the Request we make. Pass both to `fetchDidFail` to aid debugging.
  let pluginFilteredRequest = request.clone();

  try {
    let fetchResponse;

    // See https://github.com/GoogleChrome/workbox/issues/1796
    if (request.mode === 'navigate') {
      fetchResponse = await fetch(request);
    } else {
      fetchResponse = await fetch(request, fetchOptions);
    }

    if (true) {
      _logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(`Network request for `+
      `'${Object(_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_3__["getFriendlyURL"])(request.url)}' returned a response with ` +
      `status '${fetchResponse.status}'.`);
    }

    for (const plugin of plugins) {
      if (_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__["pluginEvents"].FETCH_DID_SUCCEED in plugin) {
        fetchResponse = await plugin[_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__["pluginEvents"].FETCH_DID_SUCCEED]
            .call(plugin, {
              event,
              request: pluginFilteredRequest,
              response: fetchResponse,
            });

        if (true) {
          if (fetchResponse) {
            _assert_mjs__WEBPACK_IMPORTED_MODULE_2__["assert"].isInstance(fetchResponse, Response, {
              moduleName: 'Plugin',
              funcName: _models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__["pluginEvents"].FETCH_DID_SUCCEED,
              isReturnValueProblem: true,
            });
          }
        }
      }
    }

    return fetchResponse;
  } catch (error) {
    if (true) {
      _logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].error(`Network request for `+
      `'${Object(_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_3__["getFriendlyURL"])(request.url)}' threw an error.`, error);
    }

    for (const plugin of failedFetchPlugins) {
      await plugin[_models_pluginEvents_mjs__WEBPACK_IMPORTED_MODULE_4__["pluginEvents"].FETCH_DID_FAIL].call(plugin, {
        error,
        event,
        originalRequest: originalRequest.clone(),
        request: pluginFilteredRequest.clone(),
      });
    }

    throw error;
  }
};

const fetchWrapper = {
  fetch: wrappedFetch,
};




/***/ }),

/***/ "./node_modules/workbox-core/_private/getFriendlyURL.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/workbox-core/_private/getFriendlyURL.mjs ***!
  \***************************************************************/
/*! exports provided: getFriendlyURL */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFriendlyURL", function() { return getFriendlyURL; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



const getFriendlyURL = (url) => {
  const urlObj = new URL(url, location);
  if (urlObj.origin === location.origin) {
    return urlObj.pathname;
  }
  return urlObj.href;
};




/***/ }),

/***/ "./node_modules/workbox-core/_private/logger.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/workbox-core/_private/logger.mjs ***!
  \*******************************************************/
/*! exports provided: logger */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "logger", function() { return logger; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




const logger =  false ? undefined : (() => {
  let inGroup = false;

  const methodToColorMap = {
    debug: `#7f8c8d`, // Gray
    log: `#2ecc71`, // Green
    warn: `#f39c12`, // Yellow
    error: `#c0392b`, // Red
    groupCollapsed: `#3498db`, // Blue
    groupEnd: null, // No colored prefix on groupEnd
  };

  const print = function(method, args) {
    if (method === 'groupCollapsed') {
      // Safari doesn't print all console.groupCollapsed() arguments:
      // https://bugs.webkit.org/show_bug.cgi?id=182754
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }

    const styles = [
      `background: ${methodToColorMap[method]}`,
      `border-radius: 0.5em`,
      `color: white`,
      `font-weight: bold`,
      `padding: 2px 0.5em`,
    ];

    // When in a group, the workbox prefix is not displayed.
    const logPrefix = inGroup ? [] : ['%cworkbox', styles.join(';')];

    console[method](...logPrefix, ...args);

    if (method === 'groupCollapsed') {
      inGroup = true;
    }
    if (method === 'groupEnd') {
      inGroup = false;
    }
  };

  const api = {};
  for (const method of Object.keys(methodToColorMap)) {
    api[method] = (...args) => {
      print(method, args);
    };
  }

  return api;
})();




/***/ }),

/***/ "./node_modules/workbox-core/_version.mjs":
/*!************************************************!*\
  !*** ./node_modules/workbox-core/_version.mjs ***!
  \************************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
try{self['workbox:core:4.3.1']&&_()}catch(e){}// eslint-disable-line

/***/ }),

/***/ "./node_modules/workbox-core/models/messages/messageGenerator.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/workbox-core/models/messages/messageGenerator.mjs ***!
  \************************************************************************/
/*! exports provided: messageGenerator */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "messageGenerator", function() { return messageGenerator; });
/* harmony import */ var _messages_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./messages.mjs */ "./node_modules/workbox-core/models/messages/messages.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




const fallback = (code, ...args) => {
  let msg = code;
  if (args.length > 0) {
    msg += ` :: ${JSON.stringify(args)}`;
  }
  return msg;
};

const generatorFunction = (code, ...args) => {
  const message = _messages_mjs__WEBPACK_IMPORTED_MODULE_0__["messages"][code];
  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }

  return message(...args);
};

const messageGenerator = ( false) ?
    undefined : generatorFunction;


/***/ }),

/***/ "./node_modules/workbox-core/models/messages/messages.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/workbox-core/models/messages/messages.mjs ***!
  \****************************************************************/
/*! exports provided: messages */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "messages", function() { return messages; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




const messages = {
  'invalid-value': ({paramName, validValueDescription, value}) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }
    return `The '${paramName}' parameter was given a value with an ` +
      `unexpected value. ${validValueDescription} Received a value of ` +
      `${JSON.stringify(value)}.`;
  },

  'not-in-sw': ({moduleName}) => {
    if (!moduleName) {
      throw new Error(`Unexpected input to 'not-in-sw' error.`);
    }
    return `The '${moduleName}' must be used in a service worker.`;
  },

  'not-an-array': ({moduleName, className, funcName, paramName}) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }
    return `The parameter '${paramName}' passed into ` +
      `'${moduleName}.${className}.${funcName}()' must be an array.`;
  },

  'incorrect-type': ({expectedType, paramName, moduleName, className,
    funcName}) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }
    return `The parameter '${paramName}' passed into ` +
      `'${moduleName}.${className ? (className + '.') : ''}` +
      `${funcName}()' must be of type ${expectedType}.`;
  },

  'incorrect-class': ({expectedClass, paramName, moduleName, className,
    funcName, isReturnValueProblem}) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }

    if (isReturnValueProblem) {
      return `The return value from ` +
        `'${moduleName}.${className ? (className + '.') : ''}${funcName}()' ` +
        `must be an instance of class ${expectedClass.name}.`;
    }

    return `The parameter '${paramName}' passed into ` +
      `'${moduleName}.${className ? (className + '.') : ''}${funcName}()' ` +
      `must be an instance of class ${expectedClass.name}.`;
  },

  'missing-a-method': ({expectedMethod, paramName, moduleName, className,
    funcName}) => {
    if (!expectedMethod || !paramName || !moduleName || !className
        || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }
    return `${moduleName}.${className}.${funcName}() expected the ` +
      `'${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },

  'add-to-cache-list-unexpected-type': ({entry}) => {
    return `An unexpected entry was passed to ` +
    `'workbox-precaching.PrecacheController.addToCacheList()' The entry ` +
    `'${JSON.stringify(entry)}' isn't supported. You must supply an array of ` +
    `strings with one or more characters, objects with a url property or ` +
    `Request objects.`;
  },

  'add-to-cache-list-conflicting-entries': ({firstEntry, secondEntry}) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to ` +
        `'add-to-cache-list-duplicate-entries' error.`);
    }

    return `Two of the entries passed to ` +
      `'workbox-precaching.PrecacheController.addToCacheList()' had the URL ` +
      `${firstEntry._entryId} but different revision details. Workbox is ` +
      `is unable to cache and version the asset correctly. Please remove one ` +
      `of the entries.`;
  },

  'plugin-error-request-will-fetch': ({thrownError}) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to ` +
        `'plugin-error-request-will-fetch', error.`);
    }

    return `An error was thrown by a plugins 'requestWillFetch()' method. ` +
      `The thrown error message was: '${thrownError.message}'.`;
  },

  'invalid-cache-name': ({cacheNameId, value}) => {
    if (!cacheNameId) {
      throw new Error(
          `Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }

    return `You must provide a name containing at least one character for ` +
      `setCacheDeatils({${cacheNameId}: '...'}). Received a value of ` +
      `'${JSON.stringify(value)}'`;
  },

  'unregister-route-but-not-found-with-method': ({method}) => {
    if (!method) {
      throw new Error(`Unexpected input to ` +
        `'unregister-route-but-not-found-with-method' error.`);
    }

    return `The route you're trying to unregister was not  previously ` +
      `registered for the method type '${method}'.`;
  },

  'unregister-route-route-not-registered': () => {
    return `The route you're trying to unregister was not previously ` +
      `registered.`;
  },

  'queue-replay-failed': ({name}) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },

  'duplicate-queue-name': ({name}) => {
    return `The Queue name '${name}' is already being used. ` +
        `All instances of backgroundSync.Queue must be given unique names.`;
  },

  'expired-test-without-max-age': ({methodName, paramName}) => {
    return `The '${methodName}()' method can only be used when the ` +
      `'${paramName}' is used in the constructor.`;
  },

  'unsupported-route-type': ({moduleName, className, funcName, paramName}) => {
    return `The supplied '${paramName}' parameter was an unsupported type. ` +
      `Please check the docs for ${moduleName}.${className}.${funcName} for ` +
      `valid input types.`;
  },

  'not-array-of-class': ({value, expectedClass,
    moduleName, className, funcName, paramName}) => {
    return `The supplied '${paramName}' parameter must be an array of ` +
      `'${expectedClass}' objects. Received '${JSON.stringify(value)},'. ` +
      `Please check the call to ${moduleName}.${className}.${funcName}() ` +
      `to fix the issue.`;
  },

  'max-entries-or-age-required': ({moduleName, className, funcName}) => {
    return `You must define either config.maxEntries or config.maxAgeSeconds` +
      `in ${moduleName}.${className}.${funcName}`;
  },

  'statuses-or-headers-required': ({moduleName, className, funcName}) => {
    return `You must define either config.statuses or config.headers` +
      `in ${moduleName}.${className}.${funcName}`;
  },

  'invalid-string': ({moduleName, className, funcName, paramName}) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }
    return `When using strings, the '${paramName}' parameter must start with ` +
      `'http' (for cross-origin matches) or '/' (for same-origin matches). ` +
      `Please see the docs for ${moduleName}.${funcName}() for ` +
      `more info.`;
  },

  'channel-name-required': () => {
    return `You must provide a channelName to construct a ` +
    `BroadcastCacheUpdate instance.`;
  },

  'invalid-responses-are-same-args': () => {
    return `The arguments passed into responsesAreSame() appear to be ` +
      `invalid. Please ensure valid Responses are used.`;
  },

  'expire-custom-caches-only': () => {
    return `You must provide a 'cacheName' property when using the ` +
      `expiration plugin with a runtime caching strategy.`;
  },

  'unit-must-be-bytes': ({normalizedRangeHeader}) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }
    return `The 'unit' portion of the Range header must be set to 'bytes'. ` +
      `The Range header provided was "${normalizedRangeHeader}"`;
  },

  'single-range-only': ({normalizedRangeHeader}) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }
    return `Multiple ranges are not supported. Please use a  single start ` +
      `value, and optional end value. The Range header provided was ` +
      `"${normalizedRangeHeader}"`;
  },

  'invalid-range-values': ({normalizedRangeHeader}) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }
    return `The Range header is missing both start and end values. At least ` +
      `one of those values is needed. The Range header provided was ` +
      `"${normalizedRangeHeader}"`;
  },

  'no-range-header': () => {
    return `No Range header was found in the Request provided.`;
  },

  'range-not-satisfiable': ({size, start, end}) => {
    return `The start (${start}) and end (${end}) values in the Range are ` +
      `not satisfiable by the cached response, which is ${size} bytes.`;
  },

  'attempt-to-cache-non-get-request': ({url, method}) => {
    return `Unable to cache '${url}' because it is a '${method}' request and ` +
      `only 'GET' requests can be cached.`;
  },

  'cache-put-with-no-response': ({url}) => {
    return `There was an attempt to cache '${url}' but the response was not ` +
      `defined.`;
  },

  'no-response': ({url, error}) => {
    let message = `The strategy could not generate a response for '${url}'.`;
    if (error) {
      message += ` The underlying error is ${error}.`;
    }
    return message;
  },

  'bad-precaching-response': ({url, status}) => {
    return `The precaching request for '${url}' failed with an HTTP ` +
      `status of ${status}.`;
  },
};


/***/ }),

/***/ "./node_modules/workbox-core/models/pluginEvents.mjs":
/*!***********************************************************!*\
  !*** ./node_modules/workbox-core/models/pluginEvents.mjs ***!
  \***********************************************************/
/*! exports provided: pluginEvents */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pluginEvents", function() { return pluginEvents; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




const pluginEvents = {
  CACHE_DID_UPDATE: 'cacheDidUpdate',
  CACHE_KEY_WILL_BE_USED: 'cacheKeyWillBeUsed',
  CACHE_WILL_UPDATE: 'cacheWillUpdate',
  CACHED_RESPONSE_WILL_BE_USED: 'cachedResponseWillBeUsed',
  FETCH_DID_FAIL: 'fetchDidFail',
  FETCH_DID_SUCCEED: 'fetchDidSucceed',
  REQUEST_WILL_FETCH: 'requestWillFetch',
};


/***/ }),

/***/ "./node_modules/workbox-core/models/quotaErrorCallbacks.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/workbox-core/models/quotaErrorCallbacks.mjs ***!
  \******************************************************************/
/*! exports provided: quotaErrorCallbacks */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "quotaErrorCallbacks", function() { return quotaErrorCallbacks; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




// Callbacks to be executed whenever there's a quota error.
const quotaErrorCallbacks = new Set();




/***/ }),

/***/ "./node_modules/workbox-core/registerQuotaErrorCallback.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/workbox-core/registerQuotaErrorCallback.mjs ***!
  \******************************************************************/
/*! exports provided: registerQuotaErrorCallback */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerQuotaErrorCallback", function() { return registerQuotaErrorCallback; });
/* harmony import */ var _private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _private_assert_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var _models_quotaErrorCallbacks_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./models/quotaErrorCallbacks.mjs */ "./node_modules/workbox-core/models/quotaErrorCallbacks.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







/**
 * Adds a function to the set of quotaErrorCallbacks that will be executed if
 * there's a quota error.
 *
 * @param {Function} callback
 * @memberof workbox.core
 */
function registerQuotaErrorCallback(callback) {
  if (true) {
    _private_assert_mjs__WEBPACK_IMPORTED_MODULE_1__["assert"].isType(callback, 'function', {
      moduleName: 'workbox-core',
      funcName: 'register',
      paramName: 'callback',
    });
  }

  _models_quotaErrorCallbacks_mjs__WEBPACK_IMPORTED_MODULE_2__["quotaErrorCallbacks"].add(callback);

  if (true) {
    _private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].log('Registered a callback to respond to quota errors.', callback);
  }
}




/***/ }),

/***/ "./node_modules/workbox-core/utils/pluginUtils.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/workbox-core/utils/pluginUtils.mjs ***!
  \*********************************************************/
/*! exports provided: pluginUtils */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pluginUtils", function() { return pluginUtils; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-core/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



const pluginUtils = {
  filter: (plugins, callbackName) => {
    return plugins.filter((plugin) => callbackName in plugin);
  },
};


/***/ }),

/***/ "./node_modules/workbox-expiration/CacheExpiration.mjs":
/*!*************************************************************!*\
  !*** ./node_modules/workbox-expiration/CacheExpiration.mjs ***!
  \*************************************************************/
/*! exports provided: CacheExpiration */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CacheExpiration", function() { return CacheExpiration; });
/* harmony import */ var _models_CacheTimestampsModel_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models/CacheTimestampsModel.mjs */ "./node_modules/workbox-expiration/models/CacheTimestampsModel.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-expiration/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/








/**
 * The `CacheExpiration` class allows you define an expiration and / or
 * limit on the number of responses stored in a
 * [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache).
 *
 * @memberof workbox.expiration
 */
class CacheExpiration {
  /**
   * To construct a new CacheExpiration instance you must provide at least
   * one of the `config` properties.
   *
   * @param {string} cacheName Name of the cache to apply restrictions to.
   * @param {Object} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   */
  constructor(cacheName, config = {}) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_2__["assert"].isType(cacheName, 'string', {
        moduleName: 'workbox-expiration',
        className: 'CacheExpiration',
        funcName: 'constructor',
        paramName: 'cacheName',
      });

      if (!(config.maxEntries || config.maxAgeSeconds)) {
        throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_1__["WorkboxError"]('max-entries-or-age-required', {
          moduleName: 'workbox-expiration',
          className: 'CacheExpiration',
          funcName: 'constructor',
        });
      }

      if (config.maxEntries) {
        workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_2__["assert"].isType(config.maxEntries, 'number', {
          moduleName: 'workbox-expiration',
          className: 'CacheExpiration',
          funcName: 'constructor',
          paramName: 'config.maxEntries',
        });

        // TODO: Assert is positive
      }

      if (config.maxAgeSeconds) {
        workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_2__["assert"].isType(config.maxAgeSeconds, 'number', {
          moduleName: 'workbox-expiration',
          className: 'CacheExpiration',
          funcName: 'constructor',
          paramName: 'config.maxAgeSeconds',
        });

        // TODO: Assert is positive
      }
    }

    this._isRunning = false;
    this._rerunRequested = false;
    this._maxEntries = config.maxEntries;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._cacheName = cacheName;
    this._timestampModel = new _models_CacheTimestampsModel_mjs__WEBPACK_IMPORTED_MODULE_0__["CacheTimestampsModel"](cacheName);
  }

  /**
   * Expires entries for the given cache and given criteria.
   */
  async expireEntries() {
    if (this._isRunning) {
      this._rerunRequested = true;
      return;
    }
    this._isRunning = true;

    const minTimestamp = this._maxAgeSeconds ?
        Date.now() - (this._maxAgeSeconds * 1000) : undefined;

    const urlsExpired = await this._timestampModel.expireEntries(
        minTimestamp, this._maxEntries);

    // Delete URLs from the cache
    const cache = await caches.open(this._cacheName);
    for (const url of urlsExpired) {
      await cache.delete(url);
    }

    if (true) {
      if (urlsExpired.length > 0) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].groupCollapsed(
            `Expired ${urlsExpired.length} ` +
          `${urlsExpired.length === 1 ? 'entry' : 'entries'} and removed ` +
          `${urlsExpired.length === 1 ? 'it' : 'them'} from the ` +
          `'${this._cacheName}' cache.`);
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].log(`Expired the following ${urlsExpired.length === 1 ?
            'URL' : 'URLs'}:`);
        urlsExpired.forEach((url) => workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].log(`    ${url}`));
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].groupEnd();
      } else {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].debug(`Cache expiration ran and found no entries to remove.`);
      }
    }

    this._isRunning = false;
    if (this._rerunRequested) {
      this._rerunRequested = false;
      this.expireEntries();
    }
  }

  /**
   * Update the timestamp for the given URL. This ensures the when
   * removing entries based on maximum entries, most recently used
   * is accurate or when expiring, the timestamp is up-to-date.
   *
   * @param {string} url
   */
  async updateTimestamp(url) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_2__["assert"].isType(url, 'string', {
        moduleName: 'workbox-expiration',
        className: 'CacheExpiration',
        funcName: 'updateTimestamp',
        paramName: 'url',
      });
    }

    await this._timestampModel.setTimestamp(url, Date.now());
  }

  /**
   * Can be used to check if a URL has expired or not before it's used.
   *
   * This requires a look up from IndexedDB, so can be slow.
   *
   * Note: This method will not remove the cached entry, call
   * `expireEntries()` to remove indexedDB and Cache entries.
   *
   * @param {string} url
   * @return {boolean}
   */
  async isURLExpired(url) {
    if (true) {
      if (!this._maxAgeSeconds) {
        throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_1__["WorkboxError"](`expired-test-without-max-age`, {
          methodName: 'isURLExpired',
          paramName: 'maxAgeSeconds',
        });
      }
    }

    const timestamp = await this._timestampModel.getTimestamp(url);
    const expireOlderThan = Date.now() - (this._maxAgeSeconds * 1000);
    return (timestamp < expireOlderThan);
  }

  /**
   * Removes the IndexedDB object store used to keep track of cache expiration
   * metadata.
   */
  async delete() {
    // Make sure we don't attempt another rerun if we're called in the middle of
    // a cache expiration.
    this._rerunRequested = false;
    await this._timestampModel.expireEntries(Infinity); // Expires all.
  }
}




/***/ }),

/***/ "./node_modules/workbox-expiration/Plugin.mjs":
/*!****************************************************!*\
  !*** ./node_modules/workbox-expiration/Plugin.mjs ***!
  \****************************************************/
/*! exports provided: Plugin */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Plugin", function() { return Plugin; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/getFriendlyURL.mjs */ "./node_modules/workbox-core/_private/getFriendlyURL.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var workbox_core_registerQuotaErrorCallback_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! workbox-core/registerQuotaErrorCallback.mjs */ "./node_modules/workbox-core/registerQuotaErrorCallback.mjs");
/* harmony import */ var _CacheExpiration_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CacheExpiration.mjs */ "./node_modules/workbox-expiration/CacheExpiration.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-expiration/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/











/**
 * This plugin can be used in the Workbox APIs to regularly enforce a
 * limit on the age and / or the number of cached requests.
 *
 * Whenever a cached request is used or updated, this plugin will look
 * at the used Cache and remove any old or extra requests.
 *
 * When using `maxAgeSeconds`, requests may be used *once* after expiring
 * because the expiration clean up will not have occurred until *after* the
 * cached request has been used. If the request has a "Date" header, then
 * a light weight expiration check is performed and the request will not be
 * used immediately.
 *
 * When using `maxEntries`, the entry least-recently requested will be removed from the cache first.
 *
 * @memberof workbox.expiration
 */
class Plugin {
  /**
   * @param {Object} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
   * automatic deletion if the available storage quota has been exceeded.
   */
  constructor(config = {}) {
    if (true) {
      if (!(config.maxEntries || config.maxAgeSeconds)) {
        throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__["WorkboxError"]('max-entries-or-age-required', {
          moduleName: 'workbox-expiration',
          className: 'Plugin',
          funcName: 'constructor',
        });
      }

      if (config.maxEntries) {
        workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(config.maxEntries, 'number', {
          moduleName: 'workbox-expiration',
          className: 'Plugin',
          funcName: 'constructor',
          paramName: 'config.maxEntries',
        });
      }

      if (config.maxAgeSeconds) {
        workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(config.maxAgeSeconds, 'number', {
          moduleName: 'workbox-expiration',
          className: 'Plugin',
          funcName: 'constructor',
          paramName: 'config.maxAgeSeconds',
        });
      }
    }

    this._config = config;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._cacheExpirations = new Map();

    if (config.purgeOnQuotaError) {
      Object(workbox_core_registerQuotaErrorCallback_mjs__WEBPACK_IMPORTED_MODULE_5__["registerQuotaErrorCallback"])(() => this.deleteCacheAndMetadata());
    }
  }

  /**
   * A simple helper method to return a CacheExpiration instance for a given
   * cache name.
   *
   * @param {string} cacheName
   * @return {CacheExpiration}
   *
   * @private
   */
  _getCacheExpiration(cacheName) {
    if (cacheName === workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__["cacheNames"].getRuntimeName()) {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__["WorkboxError"]('expire-custom-caches-only');
    }

    let cacheExpiration = this._cacheExpirations.get(cacheName);
    if (!cacheExpiration) {
      cacheExpiration = new _CacheExpiration_mjs__WEBPACK_IMPORTED_MODULE_6__["CacheExpiration"](cacheName, this._config);
      this._cacheExpirations.set(cacheName, cacheExpiration);
    }
    return cacheExpiration;
  }

  /**
   * A "lifecycle" callback that will be triggered automatically by the
   * `workbox.strategies` handlers when a `Response` is about to be returned
   * from a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to
   * the handler. It allows the `Response` to be inspected for freshness and
   * prevents it from being used if the `Response`'s `Date` header value is
   * older than the configured `maxAgeSeconds`.
   *
   * @param {Object} options
   * @param {string} options.cacheName Name of the cache the response is in.
   * @param {Response} options.cachedResponse The `Response` object that's been
   *     read from a cache and whose freshness should be checked.
   * @return {Response} Either the `cachedResponse`, if it's
   *     fresh, or `null` if the `Response` is older than `maxAgeSeconds`.
   *
   * @private
   */
  cachedResponseWillBeUsed({event, request, cacheName, cachedResponse}) {
    if (!cachedResponse) {
      return null;
    }

    let isFresh = this._isResponseDateFresh(cachedResponse);

    // Expire entries to ensure that even if the expiration date has
    // expired, it'll only be used once.
    const cacheExpiration = this._getCacheExpiration(cacheName);
    cacheExpiration.expireEntries();

    // Update the metadata for the request URL to the current timestamp,
    // but don't `await` it as we don't want to block the response.
    const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
    if (event) {
      try {
        event.waitUntil(updateTimestampDone);
      } catch (error) {
        if (true) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].warn(`Unable to ensure service worker stays alive when ` +
            `updating cache entry for '${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_2__["getFriendlyURL"])(event.request.url)}'.`);
        }
      }
    }

    return isFresh ? cachedResponse : null;
  }

  /**
   * @param {Response} cachedResponse
   * @return {boolean}
   *
   * @private
   */
  _isResponseDateFresh(cachedResponse) {
    if (!this._maxAgeSeconds) {
      // We aren't expiring by age, so return true, it's fresh
      return true;
    }

    // Check if the 'date' header will suffice a quick expiration check.
    // See https://github.com/GoogleChromeLabs/sw-toolbox/issues/164 for
    // discussion.
    const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
    if (dateHeaderTimestamp === null) {
      // Unable to parse date, so assume it's fresh.
      return true;
    }

    // If we have a valid headerTime, then our response is fresh iff the
    // headerTime plus maxAgeSeconds is greater than the current time.
    const now = Date.now();
    return dateHeaderTimestamp >= now - (this._maxAgeSeconds * 1000);
  }

  /**
   * This method will extract the data header and parse it into a useful
   * value.
   *
   * @param {Response} cachedResponse
   * @return {number}
   *
   * @private
   */
  _getDateHeaderTimestamp(cachedResponse) {
    if (!cachedResponse.headers.has('date')) {
      return null;
    }

    const dateHeader = cachedResponse.headers.get('date');
    const parsedDate = new Date(dateHeader);
    const headerTime = parsedDate.getTime();

    // If the Date header was invalid for some reason, parsedDate.getTime()
    // will return NaN.
    if (isNaN(headerTime)) {
      return null;
    }

    return headerTime;
  }

  /**
   * A "lifecycle" callback that will be triggered automatically by the
   * `workbox.strategies` handlers when an entry is added to a cache.
   *
   * @param {Object} options
   * @param {string} options.cacheName Name of the cache that was updated.
   * @param {string} options.request The Request for the cached entry.
   *
   * @private
   */
  async cacheDidUpdate({cacheName, request}) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(cacheName, 'string', {
        moduleName: 'workbox-expiration',
        className: 'Plugin',
        funcName: 'cacheDidUpdate',
        paramName: 'cacheName',
      });
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(request, Request, {
        moduleName: 'workbox-expiration',
        className: 'Plugin',
        funcName: 'cacheDidUpdate',
        paramName: 'request',
      });
    }

    const cacheExpiration = this._getCacheExpiration(cacheName);
    await cacheExpiration.updateTimestamp(request.url);
    await cacheExpiration.expireEntries();
  }


  /**
   * This is a helper method that performs two operations:
   *
   * - Deletes *all* the underlying Cache instances associated with this plugin
   * instance, by calling caches.delete() on your behalf.
   * - Deletes the metadata from IndexedDB used to keep track of expiration
   * details for each Cache instance.
   *
   * When using cache expiration, calling this method is preferable to calling
   * `caches.delete()` directly, since this will ensure that the IndexedDB
   * metadata is also cleanly removed and open IndexedDB instances are deleted.
   *
   * Note that if you're *not* using cache expiration for a given cache, calling
   * `caches.delete()` and passing in the cache's name should be sufficient.
   * There is no Workbox-specific method needed for cleanup in that case.
   */
  async deleteCacheAndMetadata() {
    // Do this one at a time instead of all at once via `Promise.all()` to
    // reduce the chance of inconsistency if a promise rejects.
    for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
      await caches.delete(cacheName);
      await cacheExpiration.delete();
    }

    // Reset this._cacheExpirations to its initial state.
    this._cacheExpirations = new Map();
  }
}




/***/ }),

/***/ "./node_modules/workbox-expiration/_version.mjs":
/*!******************************************************!*\
  !*** ./node_modules/workbox-expiration/_version.mjs ***!
  \******************************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
try{self['workbox:expiration:4.3.1']&&_()}catch(e){}// eslint-disable-line

/***/ }),

/***/ "./node_modules/workbox-expiration/index.mjs":
/*!***************************************************!*\
  !*** ./node_modules/workbox-expiration/index.mjs ***!
  \***************************************************/
/*! exports provided: CacheExpiration, Plugin */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CacheExpiration_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CacheExpiration.mjs */ "./node_modules/workbox-expiration/CacheExpiration.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CacheExpiration", function() { return _CacheExpiration_mjs__WEBPACK_IMPORTED_MODULE_0__["CacheExpiration"]; });

/* harmony import */ var _Plugin_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Plugin.mjs */ "./node_modules/workbox-expiration/Plugin.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Plugin", function() { return _Plugin_mjs__WEBPACK_IMPORTED_MODULE_1__["Plugin"]; });

/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-expiration/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * @namespace workbox.expiration
 */




/***/ }),

/***/ "./node_modules/workbox-expiration/models/CacheTimestampsModel.mjs":
/*!*************************************************************************!*\
  !*** ./node_modules/workbox-expiration/models/CacheTimestampsModel.mjs ***!
  \*************************************************************************/
/*! exports provided: CacheTimestampsModel */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CacheTimestampsModel", function() { return CacheTimestampsModel; });
/* harmony import */ var workbox_core_private_DBWrapper_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/DBWrapper.mjs */ "./node_modules/workbox-core/_private/DBWrapper.mjs");
/* harmony import */ var workbox_core_private_deleteDatabase_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/deleteDatabase.mjs */ "./node_modules/workbox-core/_private/deleteDatabase.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-expiration/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






const DB_NAME = 'workbox-expiration';
const OBJECT_STORE_NAME = 'cache-entries';

const normalizeURL = (unNormalizedUrl) => {
  const url = new URL(unNormalizedUrl, location);
  url.hash = '';

  return url.href;
};


/**
 * Returns the timestamp model.
 *
 * @private
 */
class CacheTimestampsModel {
  /**
   *
   * @param {string} cacheName
   *
   * @private
   */
  constructor(cacheName) {
    this._cacheName = cacheName;

    this._db = new workbox_core_private_DBWrapper_mjs__WEBPACK_IMPORTED_MODULE_0__["DBWrapper"](DB_NAME, 1, {
      onupgradeneeded: (event) => this._handleUpgrade(event),
    });
  }

  /**
   * Should perform an upgrade of indexedDB.
   *
   * @param {Event} event
   *
   * @private
   */
  _handleUpgrade(event) {
    const db = event.target.result;

    // TODO(philipwalton): EdgeHTML doesn't support arrays as a keyPath, so we
    // have to use the `id` keyPath here and create our own values (a
    // concatenation of `url + cacheName`) instead of simply using
    // `keyPath: ['url', 'cacheName']`, which is supported in other browsers.
    const objStore = db.createObjectStore(OBJECT_STORE_NAME, {keyPath: 'id'});

    // TODO(philipwalton): once we don't have to support EdgeHTML, we can
    // create a single index with the keyPath `['cacheName', 'timestamp']`
    // instead of doing both these indexes.
    objStore.createIndex('cacheName', 'cacheName', {unique: false});
    objStore.createIndex('timestamp', 'timestamp', {unique: false});

    // Previous versions of `workbox-expiration` used `this._cacheName`
    // as the IDBDatabase name.
    Object(workbox_core_private_deleteDatabase_mjs__WEBPACK_IMPORTED_MODULE_1__["deleteDatabase"])(this._cacheName);
  }

  /**
   * @param {string} url
   * @param {number} timestamp
   *
   * @private
   */
  async setTimestamp(url, timestamp) {
    url = normalizeURL(url);

    await this._db.put(OBJECT_STORE_NAME, {
      url,
      timestamp,
      cacheName: this._cacheName,
      // Creating an ID from the URL and cache name won't be necessary once
      // Edge switches to Chromium and all browsers we support work with
      // array keyPaths.
      id: this._getId(url),
    });
  }

  /**
   * Returns the timestamp stored for a given URL.
   *
   * @param {string} url
   * @return {number}
   *
   * @private
   */
  async getTimestamp(url) {
    const entry = await this._db.get(OBJECT_STORE_NAME, this._getId(url));
    return entry.timestamp;
  }

  /**
   * Iterates through all the entries in the object store (from newest to
   * oldest) and removes entries once either `maxCount` is reached or the
   * entry's timestamp is less than `minTimestamp`.
   *
   * @param {number} minTimestamp
   * @param {number} maxCount
   *
   * @private
   */
  async expireEntries(minTimestamp, maxCount) {
    const entriesToDelete = await this._db.transaction(
        OBJECT_STORE_NAME, 'readwrite', (txn, done) => {
          const store = txn.objectStore(OBJECT_STORE_NAME);
          const entriesToDelete = [];
          let entriesNotDeletedCount = 0;

          store.index('timestamp')
              .openCursor(null, 'prev')
              .onsuccess = ({target}) => {
                const cursor = target.result;
                if (cursor) {
                  const result = cursor.value;
                  // TODO(philipwalton): once we can use a multi-key index, we
                  // won't have to check `cacheName` here.
                  if (result.cacheName === this._cacheName) {
                    // Delete an entry if it's older than the max age or
                    // if we already have the max number allowed.
                    if ((minTimestamp && result.timestamp < minTimestamp) ||
                        (maxCount && entriesNotDeletedCount >= maxCount)) {
                      // TODO(philipwalton): we should be able to delete the
                      // entry right here, but doing so causes an iteration
                      // bug in Safari stable (fixed in TP). Instead we can
                      // store the keys of the entries to delete, and then
                      // delete the separate transactions.
                      // https://github.com/GoogleChrome/workbox/issues/1978
                      // cursor.delete();

                      // We only need to return the URL, not the whole entry.
                      entriesToDelete.push(cursor.value);
                    } else {
                      entriesNotDeletedCount++;
                    }
                  }
                  cursor.continue();
                } else {
                  done(entriesToDelete);
                }
              };
        });

    // TODO(philipwalton): once the Safari bug in the following issue is fixed,
    // we should be able to remove this loop and do the entry deletion in the
    // cursor loop above:
    // https://github.com/GoogleChrome/workbox/issues/1978
    const urlsDeleted = [];
    for (const entry of entriesToDelete) {
      await this._db.delete(OBJECT_STORE_NAME, entry.id);
      urlsDeleted.push(entry.url);
    }

    return urlsDeleted;
  }

  /**
   * Takes a URL and returns an ID that will be unique in the object store.
   *
   * @param {string} url
   * @return {string}
   *
   * @private
   */
  _getId(url) {
    // Creating an ID from the URL and cache name won't be necessary once
    // Edge switches to Chromium and all browsers we support work with
    // array keyPaths.
    return this._cacheName + '|' + normalizeURL(url);
  }
}




/***/ }),

/***/ "./node_modules/workbox-precaching/PrecacheController.mjs":
/*!****************************************************************!*\
  !*** ./node_modules/workbox-precaching/PrecacheController.mjs ***!
  \****************************************************************/
/*! exports provided: PrecacheController */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrecacheController", function() { return PrecacheController; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/cacheWrapper.mjs */ "./node_modules/workbox-core/_private/cacheWrapper.mjs");
/* harmony import */ var workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/fetchWrapper.mjs */ "./node_modules/workbox-core/_private/fetchWrapper.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _utils_cleanRedirect_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/cleanRedirect.mjs */ "./node_modules/workbox-precaching/utils/cleanRedirect.mjs");
/* harmony import */ var _utils_createCacheKey_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/createCacheKey.mjs */ "./node_modules/workbox-precaching/utils/createCacheKey.mjs");
/* harmony import */ var _utils_printCleanupDetails_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/printCleanupDetails.mjs */ "./node_modules/workbox-precaching/utils/printCleanupDetails.mjs");
/* harmony import */ var _utils_printInstallDetails_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/printInstallDetails.mjs */ "./node_modules/workbox-precaching/utils/printInstallDetails.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/















/**
 * Performs efficient precaching of assets.
 *
 * @memberof module:workbox-precaching
 */
class PrecacheController {
  /**
   * Create a new PrecacheController.
   *
   * @param {string} [cacheName] An optional name for the cache, to override
   * the default precache name.
   */
  constructor(cacheName) {
    this._cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__["cacheNames"].getPrecacheName(cacheName);
    this._urlsToCacheKeys = new Map();
  }

  /**
   * This method will add items to the precache list, removing duplicates
   * and ensuring the information is valid.
   *
   * @param {
   * Array<module:workbox-precaching.PrecacheController.PrecacheEntry|string>
   * } entries Array of entries to precache.
   */
  addToCacheList(entries) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isArray(entries, {
        moduleName: 'workbox-precaching',
        className: 'PrecacheController',
        funcName: 'addToCacheList',
        paramName: 'entries',
      });
    }

    for (const entry of entries) {
      const {cacheKey, url} = Object(_utils_createCacheKey_mjs__WEBPACK_IMPORTED_MODULE_6__["createCacheKey"])(entry);
      if (this._urlsToCacheKeys.has(url) &&
          this._urlsToCacheKeys.get(url) !== cacheKey) {
        throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__["WorkboxError"]('add-to-cache-list-conflicting-entries', {
          firstEntry: this._urlsToCacheKeys.get(url),
          secondEntry: cacheKey,
        });
      }
      this._urlsToCacheKeys.set(url, cacheKey);
    }
  }

  /**
   * Precaches new and updated assets. Call this method from the service worker
   * install event.
   *
   * @param {Object} options
   * @param {Event} [options.event] The install event (if needed).
   * @param {Array<Object>} [options.plugins] Plugins to be used for fetching
   * and caching during install.
   * @return {Promise<workbox.precaching.InstallResult>}
   */
  async install({event, plugins} = {}) {
    if (true) {
      if (plugins) {
        workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isArray(plugins, {
          moduleName: 'workbox-precaching',
          className: 'PrecacheController',
          funcName: 'install',
          paramName: 'plugins',
        });
      }
    }

    const urlsToPrecache = [];
    const urlsAlreadyPrecached = [];

    const cache = await caches.open(this._cacheName);
    const alreadyCachedRequests = await cache.keys();
    const alreadyCachedURLs = new Set(alreadyCachedRequests.map(
        (request) => request.url));

    for (const cacheKey of this._urlsToCacheKeys.values()) {
      if (alreadyCachedURLs.has(cacheKey)) {
        urlsAlreadyPrecached.push(cacheKey);
      } else {
        urlsToPrecache.push(cacheKey);
      }
    }

    const precacheRequests = urlsToPrecache.map((url) => {
      return this._addURLToCache({event, plugins, url});
    });
    await Promise.all(precacheRequests);

    if (true) {
      Object(_utils_printInstallDetails_mjs__WEBPACK_IMPORTED_MODULE_8__["printInstallDetails"])(urlsToPrecache, urlsAlreadyPrecached);
    }

    return {
      updatedURLs: urlsToPrecache,
      notUpdatedURLs: urlsAlreadyPrecached,
    };
  }

  /**
   * Deletes assets that are no longer present in the current precache manifest.
   * Call this method from the service worker activate event.
   *
   * @return {Promise<workbox.precaching.CleanupResult>}
   */
  async activate() {
    const cache = await caches.open(this._cacheName);
    const currentlyCachedRequests = await cache.keys();
    const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());

    const deletedURLs = [];
    for (const request of currentlyCachedRequests) {
      if (!expectedCacheKeys.has(request.url)) {
        await cache.delete(request);
        deletedURLs.push(request.url);
      }
    }

    if (true) {
      Object(_utils_printCleanupDetails_mjs__WEBPACK_IMPORTED_MODULE_7__["printCleanupDetails"])(deletedURLs);
    }

    return {deletedURLs};
  }

  /**
   * Requests the entry and saves it to the cache if the response is valid.
   * By default, any response with a status code of less than 400 (including
   * opaque responses) is considered valid.
   *
   * If you need to use custom criteria to determine what's valid and what
   * isn't, then pass in an item in `options.plugins` that implements the
   * `cacheWillUpdate()` lifecycle event.
   *
   * @private
   * @param {Object} options
   * @param {string} options.url The URL to fetch and cache.
   * @param {Event} [options.event] The install event (if passed).
   * @param {Array<Object>} [options.plugins] An array of plugins to apply to
   * fetch and caching.
   */
  async _addURLToCache({url, event, plugins}) {
    const request = new Request(url, {credentials: 'same-origin'});
    let response = await workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_3__["fetchWrapper"].fetch({
      event,
      plugins,
      request,
    });

    // Allow developers to override the default logic about what is and isn't
    // valid by passing in a plugin implementing cacheWillUpdate(), e.g.
    // a workbox.cacheableResponse.Plugin instance.
    let cacheWillUpdateCallback;
    for (const plugin of (plugins || [])) {
      if ('cacheWillUpdate' in plugin) {
        cacheWillUpdateCallback = plugin.cacheWillUpdate.bind(plugin);
      }
    }

    const isValidResponse = cacheWillUpdateCallback ?
      // Use a callback if provided. It returns a truthy value if valid.
      cacheWillUpdateCallback({event, request, response}) :
      // Otherwise, default to considering any response status under 400 valid.
      // This includes, by default, considering opaque responses valid.
      response.status < 400;

    // Consider this a failure, leading to the `install` handler failing, if
    // we get back an invalid response.
    if (!isValidResponse) {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__["WorkboxError"]('bad-precaching-response', {
        url,
        status: response.status,
      });
    }

    if (response.redirected) {
      response = await Object(_utils_cleanRedirect_mjs__WEBPACK_IMPORTED_MODULE_5__["cleanRedirect"])(response);
    }

    await workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["cacheWrapper"].put({
      event,
      plugins,
      request,
      response,
      cacheName: this._cacheName,
      matchOptions: {
        ignoreSearch: true,
      },
    });
  }

  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @return {Map<string, string>} A URL to cache key mapping.
   */
  getURLsToCacheKeys() {
    return this._urlsToCacheKeys;
  }

  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @return {Array<string>} The precached URLs.
   */
  getCachedURLs() {
    return [...this._urlsToCacheKeys.keys()];
  }

  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like `/index.html', then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param {string} url A URL whose cache key you want to look up.
   * @return {string} The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */
  getCacheKeyForURL(url) {
    const urlObject = new URL(url, location);
    return this._urlsToCacheKeys.get(urlObject.href);
  }
}




/***/ }),

/***/ "./node_modules/workbox-precaching/_version.mjs":
/*!******************************************************!*\
  !*** ./node_modules/workbox-precaching/_version.mjs ***!
  \******************************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
try{self['workbox:precaching:4.3.1']&&_()}catch(e){}// eslint-disable-line

/***/ }),

/***/ "./node_modules/workbox-precaching/addPlugins.mjs":
/*!********************************************************!*\
  !*** ./node_modules/workbox-precaching/addPlugins.mjs ***!
  \********************************************************/
/*! exports provided: addPlugins */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addPlugins", function() { return addPlugins; });
/* harmony import */ var _utils_precachePlugins_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/precachePlugins.mjs */ "./node_modules/workbox-precaching/utils/precachePlugins.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





/**
 * Adds plugins to precaching.
 *
 * @param {Array<Object>} newPlugins
 *
 * @alias workbox.precaching.addPlugins
 */
const addPlugins = (newPlugins) => {
  _utils_precachePlugins_mjs__WEBPACK_IMPORTED_MODULE_0__["precachePlugins"].add(newPlugins);
};




/***/ }),

/***/ "./node_modules/workbox-precaching/addRoute.mjs":
/*!******************************************************!*\
  !*** ./node_modules/workbox-precaching/addRoute.mjs ***!
  \******************************************************/
/*! exports provided: addRoute */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addRoute", function() { return addRoute; });
/* harmony import */ var _utils_addFetchListener_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/addFetchListener.mjs */ "./node_modules/workbox-precaching/utils/addFetchListener.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");

/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





let listenerAdded = false;

/**
 * Add a `fetch` listener to the service worker that will
 * respond to
 * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
 * with precached assets.
 *
 * Requests for assets that aren't precached, the `FetchEvent` will not be
 * responded to, allowing the event to fall through to other `fetch` event
 * listeners.
 *
 * @param {Object} options
 * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
 * check cache entries for a URLs ending with '/' to see if there is a hit when
 * appending the `directoryIndex` value.
 * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/]] An
 * array of regex's to remove search params when looking for a cache match.
 * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
 * check the cache for the URL with a `.html` added to the end of the end.
 * @param {workbox.precaching~urlManipulation} [options.urlManipulation]
 * This is a function that should take a URL and return an array of
 * alternative URL's that should be checked for precache matches.
 *
 * @alias workbox.precaching.addRoute
 */
const addRoute = (options) => {
  if (!listenerAdded) {
    Object(_utils_addFetchListener_mjs__WEBPACK_IMPORTED_MODULE_0__["addFetchListener"])(options);
    listenerAdded = true;
  }
};


/***/ }),

/***/ "./node_modules/workbox-precaching/cleanupOutdatedCaches.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/workbox-precaching/cleanupOutdatedCaches.mjs ***!
  \*******************************************************************/
/*! exports provided: cleanupOutdatedCaches */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cleanupOutdatedCaches", function() { return cleanupOutdatedCaches; });
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _utils_deleteOutdatedCaches_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/deleteOutdatedCaches.mjs */ "./node_modules/workbox-precaching/utils/deleteOutdatedCaches.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







/**
 * Adds an `activate` event listener which will clean up incompatible
 * precaches that were created by older versions of Workbox.
 *
 * @alias workbox.precaching.cleanupOutdatedCaches
 */
const cleanupOutdatedCaches = () => {
  addEventListener('activate', (event) => {
    const cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_0__["cacheNames"].getPrecacheName();

    event.waitUntil(Object(_utils_deleteOutdatedCaches_mjs__WEBPACK_IMPORTED_MODULE_2__["deleteOutdatedCaches"])(cacheName).then((cachesDeleted) => {
      if (true) {
        if (cachesDeleted.length > 0) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].log(`The following out-of-date precaches were cleaned up ` +
              `automatically:`, cachesDeleted);
        }
      }
    }));
  });
};


/***/ }),

/***/ "./node_modules/workbox-precaching/getCacheKeyForURL.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/workbox-precaching/getCacheKeyForURL.mjs ***!
  \***************************************************************/
/*! exports provided: getCacheKeyForURL */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCacheKeyForURL", function() { return getCacheKeyForURL; });
/* harmony import */ var _utils_getOrCreatePrecacheController_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/getOrCreatePrecacheController.mjs */ "./node_modules/workbox-precaching/utils/getOrCreatePrecacheController.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





/**
 * Takes in a URL, and returns the corresponding URL that could be used to
 * lookup the entry in the precache.
 *
 * If a relative URL is provided, the location of the service worker file will
 * be used as the base.
 *
 * For precached entries without revision information, the cache key will be the
 * same as the original URL.
 *
 * For precached entries with revision information, the cache key will be the
 * original URL with the addition of a query parameter used for keeping track of
 * the revision info.
 *
 * @param {string} url The URL whose cache key to look up.
 * @return {string} The cache key that corresponds to that URL.
 *
 * @alias workbox.precaching.getCacheKeyForURL
 */
const getCacheKeyForURL = (url) => {
  const precacheController = Object(_utils_getOrCreatePrecacheController_mjs__WEBPACK_IMPORTED_MODULE_0__["getOrCreatePrecacheController"])();
  return precacheController.getCacheKeyForURL(url);
};


/***/ }),

/***/ "./node_modules/workbox-precaching/index.mjs":
/*!***************************************************!*\
  !*** ./node_modules/workbox-precaching/index.mjs ***!
  \***************************************************/
/*! exports provided: addPlugins, addRoute, cleanupOutdatedCaches, getCacheKeyForURL, precache, precacheAndRoute, PrecacheController */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var _addPlugins_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./addPlugins.mjs */ "./node_modules/workbox-precaching/addPlugins.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addPlugins", function() { return _addPlugins_mjs__WEBPACK_IMPORTED_MODULE_1__["addPlugins"]; });

/* harmony import */ var _addRoute_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./addRoute.mjs */ "./node_modules/workbox-precaching/addRoute.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addRoute", function() { return _addRoute_mjs__WEBPACK_IMPORTED_MODULE_2__["addRoute"]; });

/* harmony import */ var _cleanupOutdatedCaches_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cleanupOutdatedCaches.mjs */ "./node_modules/workbox-precaching/cleanupOutdatedCaches.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "cleanupOutdatedCaches", function() { return _cleanupOutdatedCaches_mjs__WEBPACK_IMPORTED_MODULE_3__["cleanupOutdatedCaches"]; });

/* harmony import */ var _getCacheKeyForURL_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./getCacheKeyForURL.mjs */ "./node_modules/workbox-precaching/getCacheKeyForURL.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCacheKeyForURL", function() { return _getCacheKeyForURL_mjs__WEBPACK_IMPORTED_MODULE_4__["getCacheKeyForURL"]; });

/* harmony import */ var _precache_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./precache.mjs */ "./node_modules/workbox-precaching/precache.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "precache", function() { return _precache_mjs__WEBPACK_IMPORTED_MODULE_5__["precache"]; });

/* harmony import */ var _precacheAndRoute_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./precacheAndRoute.mjs */ "./node_modules/workbox-precaching/precacheAndRoute.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "precacheAndRoute", function() { return _precacheAndRoute_mjs__WEBPACK_IMPORTED_MODULE_6__["precacheAndRoute"]; });

/* harmony import */ var _PrecacheController_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./PrecacheController.mjs */ "./node_modules/workbox-precaching/PrecacheController.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "PrecacheController", function() { return _PrecacheController_mjs__WEBPACK_IMPORTED_MODULE_7__["PrecacheController"]; });

/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/












if (true) {
  workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isSWEnv('workbox-precaching');
}

/**
 * Most consumers of this module will want to use the
 * [precacheAndRoute()]{@link workbox.precaching.precacheAndRoute}
 * method to add assets to the Cache and respond to network requests with these
 * cached assets.
 *
 * If you require finer grained control, you can use the
 * [PrecacheController]{@link workbox.precaching.PrecacheController}
 * to determine when performed.
 *
 * @namespace workbox.precaching
 */




/***/ }),

/***/ "./node_modules/workbox-precaching/precache.mjs":
/*!******************************************************!*\
  !*** ./node_modules/workbox-precaching/precache.mjs ***!
  \******************************************************/
/*! exports provided: precache */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "precache", function() { return precache; });
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _utils_getOrCreatePrecacheController_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getOrCreatePrecacheController.mjs */ "./node_modules/workbox-precaching/utils/getOrCreatePrecacheController.mjs");
/* harmony import */ var _utils_precachePlugins_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/precachePlugins.mjs */ "./node_modules/workbox-precaching/utils/precachePlugins.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







const installListener = (event) => {
  const precacheController = Object(_utils_getOrCreatePrecacheController_mjs__WEBPACK_IMPORTED_MODULE_1__["getOrCreatePrecacheController"])();
  const plugins = _utils_precachePlugins_mjs__WEBPACK_IMPORTED_MODULE_2__["precachePlugins"].get();

  event.waitUntil(
      precacheController.install({event, plugins})
          .catch((error) => {
            if (true) {
              workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].error(`Service worker installation failed. It will ` +
              `be retried automatically during the next navigation.`);
            }
            // Re-throw the error to ensure installation fails.
            throw error;
          })
  );
};

const activateListener = (event) => {
  const precacheController = Object(_utils_getOrCreatePrecacheController_mjs__WEBPACK_IMPORTED_MODULE_1__["getOrCreatePrecacheController"])();
  const plugins = _utils_precachePlugins_mjs__WEBPACK_IMPORTED_MODULE_2__["precachePlugins"].get();

  event.waitUntil(precacheController.activate({event, plugins}));
};

/**
 * Adds items to the precache list, removing any duplicates and
 * stores the files in the
 * ["precache cache"]{@link module:workbox-core.cacheNames} when the service
 * worker installs.
 *
 * This method can be called multiple times.
 *
 * Please note: This method **will not** serve any of the cached files for you.
 * It only precaches files. To respond to a network request you call
 * [addRoute()]{@link module:workbox-precaching.addRoute}.
 *
 * If you have a single array of files to precache, you can just call
 * [precacheAndRoute()]{@link module:workbox-precaching.precacheAndRoute}.
 *
 * @param {Array<Object|string>} entries Array of entries to precache.
 *
 * @alias workbox.precaching.precache
 */
const precache = (entries) => {
  const precacheController = Object(_utils_getOrCreatePrecacheController_mjs__WEBPACK_IMPORTED_MODULE_1__["getOrCreatePrecacheController"])();
  precacheController.addToCacheList(entries);

  if (entries.length > 0) {
    // NOTE: these listeners will only be added once (even if the `precache()`
    // method is called multiple times) because event listeners are implemented
    // as a set, where each listener must be unique.
    addEventListener('install', installListener);
    addEventListener('activate', activateListener);
  }
};


/***/ }),

/***/ "./node_modules/workbox-precaching/precacheAndRoute.mjs":
/*!**************************************************************!*\
  !*** ./node_modules/workbox-precaching/precacheAndRoute.mjs ***!
  \**************************************************************/
/*! exports provided: precacheAndRoute */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "precacheAndRoute", function() { return precacheAndRoute; });
/* harmony import */ var _addRoute_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addRoute.mjs */ "./node_modules/workbox-precaching/addRoute.mjs");
/* harmony import */ var _precache_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./precache.mjs */ "./node_modules/workbox-precaching/precache.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * This method will add entries to the precache list and add a route to
 * respond to fetch events.
 *
 * This is a convenience method that will call
 * [precache()]{@link module:workbox-precaching.precache} and
 * [addRoute()]{@link module:workbox-precaching.addRoute} in a single call.
 *
 * @param {Array<Object|string>} entries Array of entries to precache.
 * @param {Object} options See
 * [addRoute() options]{@link module:workbox-precaching.addRoute}.
 *
 * @alias workbox.precaching.precacheAndRoute
 */
const precacheAndRoute = (entries, options) => {
  Object(_precache_mjs__WEBPACK_IMPORTED_MODULE_1__["precache"])(entries);
  Object(_addRoute_mjs__WEBPACK_IMPORTED_MODULE_0__["addRoute"])(options);
};


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/addFetchListener.mjs":
/*!********************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/addFetchListener.mjs ***!
  \********************************************************************/
/*! exports provided: addFetchListener */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addFetchListener", function() { return addFetchListener; });
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/getFriendlyURL.mjs */ "./node_modules/workbox-core/_private/getFriendlyURL.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _getCacheKeyForURL_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./getCacheKeyForURL.mjs */ "./node_modules/workbox-precaching/utils/getCacheKeyForURL.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/








/**
 * Adds a `fetch` listener to the service worker that will
 * respond to
 * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
 * with precached assets.
 *
 * Requests for assets that aren't precached, the `FetchEvent` will not be
 * responded to, allowing the event to fall through to other `fetch` event
 * listeners.
 *
 * NOTE: when called more than once this method will replace the previously set
 * configuration options. Calling it more than once is not recommended outside
 * of tests.
 *
 * @private
 * @param {Object} options
 * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
 * check cache entries for a URLs ending with '/' to see if there is a hit when
 * appending the `directoryIndex` value.
 * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/]] An
 * array of regex's to remove search params when looking for a cache match.
 * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
 * check the cache for the URL with a `.html` added to the end of the end.
 * @param {workbox.precaching~urlManipulation} [options.urlManipulation]
 * This is a function that should take a URL and return an array of
 * alternative URL's that should be checked for precache matches.
 */
const addFetchListener = ({
  ignoreURLParametersMatching = [/^utm_/],
  directoryIndex = 'index.html',
  cleanURLs = true,
  urlManipulation = null,
} = {}) => {
  const cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_0__["cacheNames"].getPrecacheName();

  addEventListener('fetch', (event) => {
    const precachedURL = Object(_getCacheKeyForURL_mjs__WEBPACK_IMPORTED_MODULE_3__["getCacheKeyForURL"])(event.request.url, {
      cleanURLs,
      directoryIndex,
      ignoreURLParametersMatching,
      urlManipulation,
    });
    if (!precachedURL) {
      if (true) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].debug(`Precaching did not find a match for ` +
          Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_1__["getFriendlyURL"])(event.request.url));
      }
      return;
    }

    let responsePromise = caches.open(cacheName).then((cache) => {
      return cache.match(precachedURL);
    }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fall back to the network if we don't have a cached response
      // (perhaps due to manual cache cleanup).
      if (true) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].warn(`The precached response for ` +
        `${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_1__["getFriendlyURL"])(precachedURL)} in ${cacheName} was not found. ` +
        `Falling back to the network instead.`);
      }

      return fetch(precachedURL);
    });

    if (true) {
      responsePromise = responsePromise.then((response) => {
        // Workbox is going to handle the route.
        // print the routing details to the console.
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].groupCollapsed(`Precaching is responding to: ` +
          Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_1__["getFriendlyURL"])(event.request.url));
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].log(`Serving the precached url: ${precachedURL}`);

        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].groupCollapsed(`View request details here.`);
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].log(event.request);
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].groupEnd();

        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].groupCollapsed(`View response details here.`);
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].log(response);
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].groupEnd();

        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].groupEnd();
        return response;
      });
    }

    event.respondWith(responsePromise);
  });
};


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/cleanRedirect.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/cleanRedirect.mjs ***!
  \*****************************************************************/
/*! exports provided: cleanRedirect */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cleanRedirect", function() { return cleanRedirect; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



/**
 * @param {Response} response
 * @return {Response}
 *
 * @private
 * @memberof module:workbox-precaching
 */
async function cleanRedirect(response) {
  const clonedResponse = response.clone();

  // Not all browsers support the Response.body stream, so fall back
  // to reading the entire body into memory as a blob.
  const bodyPromise = 'body' in clonedResponse ?
    Promise.resolve(clonedResponse.body) :
    clonedResponse.blob();

  const body = await bodyPromise;

  // new Response() is happy when passed either a stream or a Blob.
  return new Response(body, {
    headers: clonedResponse.headers,
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
  });
}


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/createCacheKey.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/createCacheKey.mjs ***!
  \******************************************************************/
/*! exports provided: createCacheKey */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCacheKey", function() { return createCacheKey; });
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





// Name of the search parameter used to store revision info.
const REVISION_SEARCH_PARAM = '__WB_REVISION__';

/**
 * Converts a manifest entry into a versioned URL suitable for precaching.
 *
 * @param {Object} entry
 * @return {string} A URL with versioning info.
 *
 * @private
 * @memberof module:workbox-precaching
 */
function createCacheKey(entry) {
  if (!entry) {
    throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('add-to-cache-list-unexpected-type', {entry});
  }

  // If a precache manifest entry is a string, it's assumed to be a versioned
  // URL, like '/app.abcd1234.js'. Return as-is.
  if (typeof entry === 'string') {
    const urlObject = new URL(entry, location);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href,
    };
  }

  const {revision, url} = entry;
  if (!url) {
    throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_0__["WorkboxError"]('add-to-cache-list-unexpected-type', {entry});
  }

  // If there's just a URL and no revision, then it's also assumed to be a
  // versioned URL.
  if (!revision) {
    const urlObject = new URL(url, location);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href,
    };
  }

  // Otherwise, construct a properly versioned URL using the custom Workbox
  // search parameter along with the revision info.
  const originalURL = new URL(url, location);
  const cacheKeyURL = new URL(url, location);
  cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
  return {
    cacheKey: cacheKeyURL.href,
    url: originalURL.href,
  };
}


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/deleteOutdatedCaches.mjs":
/*!************************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/deleteOutdatedCaches.mjs ***!
  \************************************************************************/
/*! exports provided: deleteOutdatedCaches */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteOutdatedCaches", function() { return deleteOutdatedCaches; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



const SUBSTRING_TO_FIND = '-precache-';

/**
 * Cleans up incompatible precaches that were created by older versions of
 * Workbox, by a service worker registered under the current scope.
 *
 * This is meant to be called as part of the `activate` event.
 *
 * This should be safe to use as long as you don't include `substringToFind`
 * (defaulting to `-precache-`) in your non-precache cache names.
 *
 * @param {string} currentPrecacheName The cache name currently in use for
 * precaching. This cache won't be deleted.
 * @param {string} [substringToFind='-precache-'] Cache names which include this
 * substring will be deleted (excluding `currentPrecacheName`).
 * @return {Array<string>} A list of all the cache names that were deleted.
 *
 * @private
 * @memberof module:workbox-precaching
 */
const deleteOutdatedCaches = async (
  currentPrecacheName,
  substringToFind = SUBSTRING_TO_FIND) => {
  const cacheNames = await caches.keys();

  const cacheNamesToDelete = cacheNames.filter((cacheName) => {
    return cacheName.includes(substringToFind) &&
           cacheName.includes(self.registration.scope) &&
           cacheName !== currentPrecacheName;
  });

  await Promise.all(
      cacheNamesToDelete.map((cacheName) => caches.delete(cacheName)));

  return cacheNamesToDelete;
};





/***/ }),

/***/ "./node_modules/workbox-precaching/utils/generateURLVariations.mjs":
/*!*************************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/generateURLVariations.mjs ***!
  \*************************************************************************/
/*! exports provided: generateURLVariations */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateURLVariations", function() { return generateURLVariations; });
/* harmony import */ var _removeIgnoredSearchParams_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./removeIgnoredSearchParams.mjs */ "./node_modules/workbox-precaching/utils/removeIgnoredSearchParams.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





/**
 * Generator function that yields possible variations on the original URL to
 * check, one at a time.
 *
 * @param {string} url
 * @param {Object} options
 *
 * @private
 * @memberof module:workbox-precaching
 */
function* generateURLVariations(url, {
  ignoreURLParametersMatching,
  directoryIndex,
  cleanURLs,
  urlManipulation,
} = {}) {
  const urlObject = new URL(url, location);
  urlObject.hash = '';
  yield urlObject.href;

  const urlWithoutIgnoredParams = Object(_removeIgnoredSearchParams_mjs__WEBPACK_IMPORTED_MODULE_0__["removeIgnoredSearchParams"])(
      urlObject, ignoreURLParametersMatching);
  yield urlWithoutIgnoredParams.href;

  if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith('/')) {
    const directoryURL = new URL(urlWithoutIgnoredParams);
    directoryURL.pathname += directoryIndex;
    yield directoryURL.href;
  }

  if (cleanURLs) {
    const cleanURL = new URL(urlWithoutIgnoredParams);
    cleanURL.pathname += '.html';
    yield cleanURL.href;
  }

  if (urlManipulation) {
    const additionalURLs = urlManipulation({url: urlObject});
    for (const urlToAttempt of additionalURLs) {
      yield urlToAttempt.href;
    }
  }
}


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/getCacheKeyForURL.mjs":
/*!*********************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/getCacheKeyForURL.mjs ***!
  \*********************************************************************/
/*! exports provided: getCacheKeyForURL */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCacheKeyForURL", function() { return getCacheKeyForURL; });
/* harmony import */ var _getOrCreatePrecacheController_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getOrCreatePrecacheController.mjs */ "./node_modules/workbox-precaching/utils/getOrCreatePrecacheController.mjs");
/* harmony import */ var _generateURLVariations_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./generateURLVariations.mjs */ "./node_modules/workbox-precaching/utils/generateURLVariations.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





/**
 * This function will take the request URL and manipulate it based on the
 * configuration options.
 *
 * @param {string} url
 * @param {Object} options
 * @return {string} Returns the URL in the cache that matches the request,
 * if possible.
 *
 * @private
 */
const getCacheKeyForURL = (url, options) => {
  const precacheController = Object(_getOrCreatePrecacheController_mjs__WEBPACK_IMPORTED_MODULE_0__["getOrCreatePrecacheController"])();

  const urlsToCacheKeys = precacheController.getURLsToCacheKeys();
  for (const possibleURL of Object(_generateURLVariations_mjs__WEBPACK_IMPORTED_MODULE_1__["generateURLVariations"])(url, options)) {
    const possibleCacheKey = urlsToCacheKeys.get(possibleURL);
    if (possibleCacheKey) {
      return possibleCacheKey;
    }
  }
};


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/getOrCreatePrecacheController.mjs":
/*!*********************************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/getOrCreatePrecacheController.mjs ***!
  \*********************************************************************************/
/*! exports provided: getOrCreatePrecacheController */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOrCreatePrecacheController", function() { return getOrCreatePrecacheController; });
/* harmony import */ var _PrecacheController_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../PrecacheController.mjs */ "./node_modules/workbox-precaching/PrecacheController.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





let precacheController;

/**
 * @return {PrecacheController}
 * @private
 */
const getOrCreatePrecacheController = () => {
  if (!precacheController) {
    precacheController = new _PrecacheController_mjs__WEBPACK_IMPORTED_MODULE_0__["PrecacheController"]();
  }
  return precacheController;
};


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/precachePlugins.mjs":
/*!*******************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/precachePlugins.mjs ***!
  \*******************************************************************/
/*! exports provided: precachePlugins */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "precachePlugins", function() { return precachePlugins; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




const plugins = [];

const precachePlugins = {
  /*
   * @return {Array}
   * @private
   */
  get() {
    return plugins;
  },

  /*
   * @param {Array} newPlugins
   * @private
   */
  add(newPlugins) {
    plugins.push(...newPlugins);
  },
};


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/printCleanupDetails.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/printCleanupDetails.mjs ***!
  \***********************************************************************/
/*! exports provided: printCleanupDetails */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printCleanupDetails", function() { return printCleanupDetails; });
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





const logGroup = (groupTitle, deletedURLs) => {
  workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupCollapsed(groupTitle);

  for (const url of deletedURLs) {
    workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].log(url);
  }

  workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupEnd();
};

/**
 * @param {Array<string>} deletedURLs
 *
 * @private
 * @memberof module:workbox-precaching
 */
function printCleanupDetails(deletedURLs) {
  const deletionCount = deletedURLs.length;
  if (deletionCount > 0) {
    workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupCollapsed(`During precaching cleanup, ` +
        `${deletionCount} cached ` +
        `request${deletionCount === 1 ? ' was' : 's were'} deleted.`);
    logGroup('Deleted Cache Requests', deletedURLs);
    workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupEnd();
  }
}


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/printInstallDetails.mjs":
/*!***********************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/printInstallDetails.mjs ***!
  \***********************************************************************/
/*! exports provided: printInstallDetails */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "printInstallDetails", function() { return printInstallDetails; });
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





/**
 * @param {string} groupTitle
 * @param {Array<string>} urls
 *
 * @private
 */
function _nestedGroup(groupTitle, urls) {
  if (urls.length === 0) {
    return;
  }

  workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupCollapsed(groupTitle);

  for (const url of urls) {
    workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].log(url);
  }

  workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupEnd();
}

/**
 * @param {Array<string>} urlsToPrecache
 * @param {Array<string>} urlsAlreadyPrecached
 *
 * @private
 * @memberof module:workbox-precaching
 */
function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
  const precachedCount = urlsToPrecache.length;
  const alreadyPrecachedCount = urlsAlreadyPrecached.length;

  if (precachedCount || alreadyPrecachedCount) {
    let message =
        `Precaching ${precachedCount} file${precachedCount === 1 ? '' : 's'}.`;

    if (alreadyPrecachedCount > 0) {
      message += ` ${alreadyPrecachedCount} ` +
        `file${alreadyPrecachedCount === 1 ? ' is' : 's are'} already cached.`;
    }

    workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupCollapsed(message);

    _nestedGroup(`View newly precached URLs.`, urlsToPrecache);
    _nestedGroup(`View previously precached URLs.`, urlsAlreadyPrecached);
    workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupEnd();
  }
}


/***/ }),

/***/ "./node_modules/workbox-precaching/utils/removeIgnoredSearchParams.mjs":
/*!*****************************************************************************!*\
  !*** ./node_modules/workbox-precaching/utils/removeIgnoredSearchParams.mjs ***!
  \*****************************************************************************/
/*! exports provided: removeIgnoredSearchParams */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeIgnoredSearchParams", function() { return removeIgnoredSearchParams; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-precaching/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



/**
 * Removes any URL search parameters that should be ignored.
 *
 * @param {URL} urlObject The original URL.
 * @param {Array<RegExp>} ignoreURLParametersMatching RegExps to test against
 * each search parameter name. Matches mean that the search parameter should be
 * ignored.
 * @return {URL} The URL with any ignored search parameters removed.
 *
 * @private
 * @memberof module:workbox-precaching
 */
function removeIgnoredSearchParams(urlObject,
    ignoreURLParametersMatching) {
  // Convert the iterable into an array at the start of the loop to make sure
  // deletion doesn't mess up iteration.
  for (const paramName of [...urlObject.searchParams.keys()]) {
    if (ignoreURLParametersMatching.some((regExp) => regExp.test(paramName))) {
      urlObject.searchParams.delete(paramName);
    }
  }

  return urlObject;
}


/***/ }),

/***/ "./node_modules/workbox-routing/NavigationRoute.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/workbox-routing/NavigationRoute.mjs ***!
  \**********************************************************/
/*! exports provided: NavigationRoute */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavigationRoute", function() { return NavigationRoute; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _Route_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Route.mjs */ "./node_modules/workbox-routing/Route.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * NavigationRoute makes it easy to create a [Route]{@link
 * workbox.routing.Route} that matches for browser
 * [navigation requests]{@link https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests}.
 *
 * It will only match incoming Requests whose
 * [`mode`]{@link https://fetch.spec.whatwg.org/#concept-request-mode}
 * is set to `navigate`.
 *
 * You can optionally only apply this route to a subset of navigation requests
 * by using one or both of the `blacklist` and `whitelist` parameters.
 *
 * @memberof workbox.routing
 * @extends workbox.routing.Route
 */
class NavigationRoute extends _Route_mjs__WEBPACK_IMPORTED_MODULE_2__["Route"] {
  /**
   * If both `blacklist` and `whiltelist` are provided, the `blacklist` will
   * take precedence and the request will not match this route.
   *
   * The regular expressions in `whitelist` and `blacklist`
   * are matched against the concatenated
   * [`pathname`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname}
   * and [`search`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search}
   * portions of the requested URL.
   *
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {Object} options
   * @param {Array<RegExp>} [options.blacklist] If any of these patterns match,
   * the route will not handle the request (even if a whitelist RegExp matches).
   * @param {Array<RegExp>} [options.whitelist=[/./]] If any of these patterns
   * match the URL's pathname and search parameter, the route will handle the
   * request (assuming the blacklist doesn't match).
   */
  constructor(handler, {whitelist = [/./], blacklist = []} = {}) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isArrayOfClass(whitelist, RegExp, {
        moduleName: 'workbox-routing',
        className: 'NavigationRoute',
        funcName: 'constructor',
        paramName: 'options.whitelist',
      });
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isArrayOfClass(blacklist, RegExp, {
        moduleName: 'workbox-routing',
        className: 'NavigationRoute',
        funcName: 'constructor',
        paramName: 'options.blacklist',
      });
    }

    super((options) => this._match(options), handler);

    this._whitelist = whitelist;
    this._blacklist = blacklist;
  }

  /**
   * Routes match handler.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {Request} options.request
   * @return {boolean}
   *
   * @private
   */
  _match({url, request}) {
    if (request.mode !== 'navigate') {
      return false;
    }

    const pathnameAndSearch = url.pathname + url.search;

    for (const regExp of this._blacklist) {
      if (regExp.test(pathnameAndSearch)) {
        if (true) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].log(`The navigation route is not being used, since the ` +
              `URL matches this blacklist pattern: ${regExp}`);
        }
        return false;
      }
    }

    if (this._whitelist.some((regExp) => regExp.test(pathnameAndSearch))) {
      if (true) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(`The navigation route is being used.`);
      }
      return true;
    }

    if (true) {
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].log(`The navigation route is not being used, since the URL ` +
          `being navigated to doesn't match the whitelist.`);
    }
    return false;
  }
}




/***/ }),

/***/ "./node_modules/workbox-routing/RegExpRoute.mjs":
/*!******************************************************!*\
  !*** ./node_modules/workbox-routing/RegExpRoute.mjs ***!
  \******************************************************/
/*! exports provided: RegExpRoute */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegExpRoute", function() { return RegExpRoute; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _Route_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Route.mjs */ "./node_modules/workbox-routing/Route.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/






/**
 * RegExpRoute makes it easy to create a regular expression based
 * [Route]{@link workbox.routing.Route}.
 *
 * For same-origin requests the RegExp only needs to match part of the URL. For
 * requests against third-party servers, you must define a RegExp that matches
 * the start of the URL.
 *
 * [See the module docs for info.]{@link https://developers.google.com/web/tools/workbox/modules/workbox-routing}
 *
 * @memberof workbox.routing
 * @extends workbox.routing.Route
 */
class RegExpRoute extends _Route_mjs__WEBPACK_IMPORTED_MODULE_2__["Route"] {
  /**
   * If the regulard expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * th ecaptured values will be passed to the
   * [handler's]{@link workbox.routing.Route~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(regExp, handler, method) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(regExp, RegExp, {
        moduleName: 'workbox-routing',
        className: 'RegExpRoute',
        funcName: 'constructor',
        paramName: 'pattern',
      });
    }

    const match = ({url}) => {
      const result = regExp.exec(url.href);

      // Return null immediately if there's no match.
      if (!result) {
        return null;
      }

      // Require that the match start at the first character in the URL string
      // if it's a cross-origin request.
      // See https://github.com/GoogleChrome/workbox/issues/281 for the context
      // behind this behavior.
      if ((url.origin !== location.origin) && (result.index !== 0)) {
        if (true) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(
              `The regular expression '${regExp}' only partially matched ` +
            `against the cross-origin URL '${url}'. RegExpRoute's will only ` +
            `handle cross-origin requests if they match the entire URL.`
          );
        }

        return null;
      }

      // If the route matches, but there aren't any capture groups defined, then
      // this will return [], which is truthy and therefore sufficient to
      // indicate a match.
      // If there are capture groups, then it will return their values.
      return result.slice(1);
    };

    super(match, handler, method);
  }
}




/***/ }),

/***/ "./node_modules/workbox-routing/Route.mjs":
/*!************************************************!*\
  !*** ./node_modules/workbox-routing/Route.mjs ***!
  \************************************************/
/*! exports provided: Route */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Route", function() { return Route; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var _utils_constants_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/constants.mjs */ "./node_modules/workbox-routing/utils/constants.mjs");
/* harmony import */ var _utils_normalizeHandler_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/normalizeHandler.mjs */ "./node_modules/workbox-routing/utils/normalizeHandler.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/







/**
 * A `Route` consists of a pair of callback functions, "match" and "handler".
 * The "match" callback determine if a route should be used to "handle" a
 * request by returning a non-falsy value if it can. The "handler" callback
 * is called when there is a match and should return a Promise that resolves
 * to a `Response`.
 *
 * @memberof workbox.routing
 */
class Route {
  /**
   * Constructor for Route class.
   *
   * @param {workbox.routing.Route~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(match, handler, method) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(match, 'function', {
        moduleName: 'workbox-routing',
        className: 'Route',
        funcName: 'constructor',
        paramName: 'match',
      });

      if (method) {
        workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isOneOf(method, _utils_constants_mjs__WEBPACK_IMPORTED_MODULE_1__["validMethods"], {paramName: 'method'});
      }
    }

    // These values are referenced directly by Router so cannot be
    // altered by minifification.
    this.handler = Object(_utils_normalizeHandler_mjs__WEBPACK_IMPORTED_MODULE_2__["normalizeHandler"])(handler);
    this.match = match;
    this.method = method || _utils_constants_mjs__WEBPACK_IMPORTED_MODULE_1__["defaultMethod"];
  }
}




/***/ }),

/***/ "./node_modules/workbox-routing/Router.mjs":
/*!*************************************************!*\
  !*** ./node_modules/workbox-routing/Router.mjs ***!
  \*************************************************/
/*! exports provided: Router */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return Router; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/getFriendlyURL.mjs */ "./node_modules/workbox-core/_private/getFriendlyURL.mjs");
/* harmony import */ var _utils_normalizeHandler_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/normalizeHandler.mjs */ "./node_modules/workbox-routing/utils/normalizeHandler.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/









/**
 * The Router can be used to process a FetchEvent through one or more
 * [Routes]{@link workbox.routing.Route} responding  with a Request if
 * a matching route exists.
 *
 * If no route matches a given a request, the Router will use a "default"
 * handler if one is defined.
 *
 * Should the matching Route throw an error, the Router will use a "catch"
 * handler if one is defined to gracefully deal with issues and respond with a
 * Request.
 *
 * If a request matches multiple routes, the **earliest** registered route will
 * be used to respond to the request.
 *
 * @memberof workbox.routing
 */
class Router {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = new Map();
  }

  /**
   * @return {Map<string, Array<workbox.routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */
  get routes() {
    return this._routes;
  }

  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */
  addFetchListener() {
    self.addEventListener('fetch', (event) => {
      const {request} = event;
      const responsePromise = this.handleRequest({request, event});
      if (responsePromise) {
        event.respondWith(responsePromise);
      }
    });
  }

  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */
  addCacheListener() {
    self.addEventListener('message', async (event) => {
      if (event.data && event.data.type === 'CACHE_URLS') {
        const {payload} = event.data;

        if (true) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(`Caching URLs from the window`, payload.urlsToCache);
        }

        const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
          if (typeof entry === 'string') {
            entry = [entry];
          }

          const request = new Request(...entry);
          return this.handleRequest({request});
        }));

        event.waitUntil(requestPromises);

        // If a MessageChannel was used, reply to the message on success.
        if (event.ports && event.ports[0]) {
          await requestPromises;
          event.ports[0].postMessage(true);
        }
      }
    });
  }

  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle (this is usually
   *     from a fetch event, but it does not have to be).
   * @param {FetchEvent} [options.event] The event that triggered the request,
   *     if applicable.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({request, event}) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(request, Request, {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'handleRequest',
        paramName: 'options.request',
      });
    }

    const url = new URL(request.url, location);
    if (!url.protocol.startsWith('http')) {
      if (true) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(
            `Workbox Router only supports URLs that start with 'http'.`);
      }
      return;
    }

    let {params, route} = this.findMatchingRoute({url, request, event});
    let handler = route && route.handler;

    let debugMessages = [];
    if (true) {
      if (handler) {
        debugMessages.push([
          `Found a route to handle this request:`, route,
        ]);

        if (params) {
          debugMessages.push([
            `Passing the following params to the route's handler:`, params,
          ]);
        }
      }
    }

    // If we don't have a handler because there was no matching route, then
    // fall back to defaultHandler if that's defined.
    if (!handler && this._defaultHandler) {
      if (true) {
        debugMessages.push(`Failed to find a matching route. Falling ` +
          `back to the default handler.`);

        // This is used for debugging in logs in the case of an error.
        route = '[Default Handler]';
      }
      handler = this._defaultHandler;
    }

    if (!handler) {
      if (true) {
        // No handler so Workbox will do nothing. If logs is set of debug
        // i.e. verbose, we should print out this information.
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].debug(`No route found for: ${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_3__["getFriendlyURL"])(url)}`);
      }
      return;
    }

    if (true) {
      // We have a handler, meaning Workbox is going to handle the route.
      // print the routing details to the console.
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].groupCollapsed(`Router is responding to: ${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_3__["getFriendlyURL"])(url)}`);
      debugMessages.forEach((msg) => {
        if (Array.isArray(msg)) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].log(...msg);
        } else {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].log(msg);
        }
      });

      // The Request and Response objects contains a great deal of information,
      // hide it under a group in case developers want to see it.
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].groupCollapsed(`View request details here.`);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].log(request);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].groupEnd();

      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].groupEnd();
    }

    // Wrap in try and catch in case the handle method throws a synchronous
    // error. It should still callback to the catch handler.
    let responsePromise;
    try {
      responsePromise = handler.handle({url, request, event, params});
    } catch (err) {
      responsePromise = Promise.reject(err);
    }

    if (responsePromise && this._catchHandler) {
      responsePromise = responsePromise.catch((err) => {
        if (true) {
          // Still include URL here as it will be async from the console group
          // and may not make sense without the URL
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].groupCollapsed(`Error thrown when responding to: ` +
            ` ${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_3__["getFriendlyURL"])(url)}. Falling back to Catch Handler.`);
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].error(`Error thrown by:`, route);
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].error(err);
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_1__["logger"].groupEnd();
        }
        return this._catchHandler.handle({url, event, err});
      });
    }

    return responsePromise;
  }

  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {Request} options.request The request to match.
   * @param {FetchEvent} [options.event] The corresponding event (unless N/A).
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({url, request, event}) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(url, URL, {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'findMatchingRoute',
        paramName: 'options.url',
      });
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(request, Request, {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'findMatchingRoute',
        paramName: 'options.request',
      });
    }

    const routes = this._routes.get(request.method) || [];
    for (const route of routes) {
      let params;
      let matchResult = route.match({url, request, event});
      if (matchResult) {
        if (Array.isArray(matchResult) && matchResult.length > 0) {
          // Instead of passing an empty array in as params, use undefined.
          params = matchResult;
        } else if ((matchResult.constructor === Object &&
            Object.keys(matchResult).length > 0)) {
          // Instead of passing an empty object in as params, use undefined.
          params = matchResult;
        }

        // Return early if have a match.
        return {route, params};
      }
    }
    // If no match was found above, return and empty object.
    return {};
  }

  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setDefaultHandler(handler) {
    this._defaultHandler = Object(_utils_normalizeHandler_mjs__WEBPACK_IMPORTED_MODULE_4__["normalizeHandler"])(handler);
  }

  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(handler) {
    this._catchHandler = Object(_utils_normalizeHandler_mjs__WEBPACK_IMPORTED_MODULE_4__["normalizeHandler"])(handler);
  }

  /**
   * Registers a route with the router.
   *
   * @param {workbox.routing.Route} route The route to register.
   */
  registerRoute(route) {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(route, 'object', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route',
      });

      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].hasMethod(route, 'match', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route',
      });

      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(route.handler, 'object', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route',
      });

      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].hasMethod(route.handler, 'handle', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route.handler',
      });

      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(route.method, 'string', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route.method',
      });
    }

    if (!this._routes.has(route.method)) {
      this._routes.set(route.method, []);
    }

    // Give precedence to all of the earlier routes by adding this additional
    // route to the end of the array.
    this._routes.get(route.method).push(route);
  }

  /**
   * Unregisters a route with the router.
   *
   * @param {workbox.routing.Route} route The route to unregister.
   */
  unregisterRoute(route) {
    if (!this._routes.has(route.method)) {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_2__["WorkboxError"](
          'unregister-route-but-not-found-with-method', {
            method: route.method,
          }
      );
    }

    const routeIndex = this._routes.get(route.method).indexOf(route);
    if (routeIndex > -1) {
      this._routes.get(route.method).splice(routeIndex, 1);
    } else {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_2__["WorkboxError"]('unregister-route-route-not-registered');
    }
  }
}




/***/ }),

/***/ "./node_modules/workbox-routing/_version.mjs":
/*!***************************************************!*\
  !*** ./node_modules/workbox-routing/_version.mjs ***!
  \***************************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
try{self['workbox:routing:4.3.1']&&_()}catch(e){}// eslint-disable-line

/***/ }),

/***/ "./node_modules/workbox-routing/index.mjs":
/*!************************************************!*\
  !*** ./node_modules/workbox-routing/index.mjs ***!
  \************************************************/
/*! exports provided: NavigationRoute, RegExpRoute, registerNavigationRoute, registerRoute, Route, Router, setCatchHandler, setDefaultHandler */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var _NavigationRoute_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NavigationRoute.mjs */ "./node_modules/workbox-routing/NavigationRoute.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NavigationRoute", function() { return _NavigationRoute_mjs__WEBPACK_IMPORTED_MODULE_1__["NavigationRoute"]; });

/* harmony import */ var _RegExpRoute_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./RegExpRoute.mjs */ "./node_modules/workbox-routing/RegExpRoute.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RegExpRoute", function() { return _RegExpRoute_mjs__WEBPACK_IMPORTED_MODULE_2__["RegExpRoute"]; });

/* harmony import */ var _registerNavigationRoute_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./registerNavigationRoute.mjs */ "./node_modules/workbox-routing/registerNavigationRoute.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerNavigationRoute", function() { return _registerNavigationRoute_mjs__WEBPACK_IMPORTED_MODULE_3__["registerNavigationRoute"]; });

/* harmony import */ var _registerRoute_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./registerRoute.mjs */ "./node_modules/workbox-routing/registerRoute.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "registerRoute", function() { return _registerRoute_mjs__WEBPACK_IMPORTED_MODULE_4__["registerRoute"]; });

/* harmony import */ var _Route_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Route.mjs */ "./node_modules/workbox-routing/Route.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Route", function() { return _Route_mjs__WEBPACK_IMPORTED_MODULE_5__["Route"]; });

/* harmony import */ var _Router_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Router.mjs */ "./node_modules/workbox-routing/Router.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return _Router_mjs__WEBPACK_IMPORTED_MODULE_6__["Router"]; });

/* harmony import */ var _setCatchHandler_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./setCatchHandler.mjs */ "./node_modules/workbox-routing/setCatchHandler.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setCatchHandler", function() { return _setCatchHandler_mjs__WEBPACK_IMPORTED_MODULE_7__["setCatchHandler"]; });

/* harmony import */ var _setDefaultHandler_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./setDefaultHandler.mjs */ "./node_modules/workbox-routing/setDefaultHandler.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "setDefaultHandler", function() { return _setDefaultHandler_mjs__WEBPACK_IMPORTED_MODULE_8__["setDefaultHandler"]; });

/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/














if (true) {
  workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isSWEnv('workbox-routing');
}

/**
 * @namespace workbox.routing
 */




/***/ }),

/***/ "./node_modules/workbox-routing/registerNavigationRoute.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/workbox-routing/registerNavigationRoute.mjs ***!
  \******************************************************************/
/*! exports provided: registerNavigationRoute */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerNavigationRoute", function() { return registerNavigationRoute; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _NavigationRoute_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NavigationRoute.mjs */ "./node_modules/workbox-routing/NavigationRoute.mjs");
/* harmony import */ var _utils_getOrCreateDefaultRouter_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/getOrCreateDefaultRouter.mjs */ "./node_modules/workbox-routing/utils/getOrCreateDefaultRouter.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/









/**
 * Registers a route that will return a precached file for a navigation
 * request. This is useful for the
 * [application shell pattern]{@link https://developers.google.com/web/fundamentals/architecture/app-shell}.
 *
 * When determining the URL of the precached HTML document, you will likely need
 * to call `workbox.precaching.getCacheKeyForURL(originalUrl)`, to account for
 * the fact that Workbox's precaching naming conventions often results in URL
 * cache keys that contain extra revisioning info.
 *
 * This method will generate a
 * [NavigationRoute]{@link workbox.routing.NavigationRoute}
 * and call
 * [Router.registerRoute()]{@link workbox.routing.Router#registerRoute} on a
 * singleton Router instance.
 *
 * @param {string} cachedAssetUrl The cache key to use for the HTML file.
 * @param {Object} [options]
 * @param {string} [options.cacheName] Cache name to store and retrieve
 * requests. Defaults to precache cache name provided by
 * [workbox-core.cacheNames]{@link workbox.core.cacheNames}.
 * @param {Array<RegExp>} [options.blacklist=[]] If any of these patterns
 * match, the route will not handle the request (even if a whitelist entry
 * matches).
 * @param {Array<RegExp>} [options.whitelist=[/./]] If any of these patterns
 * match the URL's pathname and search parameter, the route will handle the
 * request (assuming the blacklist doesn't match).
 * @return {workbox.routing.NavigationRoute} Returns the generated
 * Route.
 *
 * @alias workbox.routing.registerNavigationRoute
 */
const registerNavigationRoute = (cachedAssetUrl, options = {}) => {
  if (true) {
    workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(cachedAssetUrl, 'string', {
      moduleName: 'workbox-routing',
      funcName: 'registerNavigationRoute',
      paramName: 'cachedAssetUrl',
    });
  }

  const cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__["cacheNames"].getPrecacheName(options.cacheName);
  const handler = async () => {
    try {
      const response = await caches.match(cachedAssetUrl, {cacheName});

      if (response) {
        return response;
      }

      // This shouldn't normally happen, but there are edge cases:
      // https://github.com/GoogleChrome/workbox/issues/1441
      throw new Error(`The cache ${cacheName} did not have an entry for ` +
          `${cachedAssetUrl}.`);
    } catch (error) {
      // If there's either a cache miss, or the caches.match() call threw
      // an exception, then attempt to fulfill the navigation request with
      // a response from the network rather than leaving the user with a
      // failed navigation.
      if (true) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_2__["logger"].debug(`Unable to respond to navigation request with ` +
            `cached response. Falling back to network.`, error);
      }

      // This might still fail if the browser is offline...
      return fetch(cachedAssetUrl);
    }
  };

  const route = new _NavigationRoute_mjs__WEBPACK_IMPORTED_MODULE_3__["NavigationRoute"](handler, {
    whitelist: options.whitelist,
    blacklist: options.blacklist,
  });

  const defaultRouter = Object(_utils_getOrCreateDefaultRouter_mjs__WEBPACK_IMPORTED_MODULE_4__["getOrCreateDefaultRouter"])();
  defaultRouter.registerRoute(route);

  return route;
};


/***/ }),

/***/ "./node_modules/workbox-routing/registerRoute.mjs":
/*!********************************************************!*\
  !*** ./node_modules/workbox-routing/registerRoute.mjs ***!
  \********************************************************/
/*! exports provided: registerRoute */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "registerRoute", function() { return registerRoute; });
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _Route_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Route.mjs */ "./node_modules/workbox-routing/Route.mjs");
/* harmony import */ var _RegExpRoute_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./RegExpRoute.mjs */ "./node_modules/workbox-routing/RegExpRoute.mjs");
/* harmony import */ var _utils_getOrCreateDefaultRouter_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/getOrCreateDefaultRouter.mjs */ "./node_modules/workbox-routing/utils/getOrCreateDefaultRouter.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/









/**
 * Easily register a RegExp, string, or function with a caching
 * strategy to a singleton Router instance.
 *
 * This method will generate a Route for you if needed and
 * call [Router.registerRoute()]{@link
 * workbox.routing.Router#registerRoute}.
 *
 * @param {
 * RegExp|
 * string|
 * workbox.routing.Route~matchCallback|
 * workbox.routing.Route
 * } capture
 * If the capture param is a `Route`, all other arguments will be ignored.
 * @param {workbox.routing.Route~handlerCallback} handler A callback
 * function that returns a Promise resulting in a Response.
 * @param {string} [method='GET'] The HTTP method to match the Route
 * against.
 * @return {workbox.routing.Route} The generated `Route`(Useful for
 * unregistering).
 *
 * @alias workbox.routing.registerRoute
 */
const registerRoute = (capture, handler, method = 'GET') => {
  let route;

  if (typeof capture === 'string') {
    const captureUrl = new URL(capture, location);

    if (true) {
      if (!(capture.startsWith('/') || capture.startsWith('http'))) {
        throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_1__["WorkboxError"]('invalid-string', {
          moduleName: 'workbox-routing',
          funcName: 'registerRoute',
          paramName: 'capture',
        });
      }

      // We want to check if Express-style wildcards are in the pathname only.
      // TODO: Remove this log message in v4.
      const valueToCheck = capture.startsWith('http') ?
          captureUrl.pathname : capture;

      // See https://github.com/pillarjs/path-to-regexp#parameters
      const wildcards = '[*:?+]';
      if (valueToCheck.match(new RegExp(`${wildcards}`))) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].debug(
            `The '$capture' parameter contains an Express-style wildcard ` +
          `character (${wildcards}). Strings are now always interpreted as ` +
          `exact matches; use a RegExp for partial or wildcard matches.`
        );
      }
    }

    const matchCallback = ({url}) => {
      if (true) {
        if ((url.pathname === captureUrl.pathname) &&
            (url.origin !== captureUrl.origin)) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].debug(
              `${capture} only partially matches the cross-origin URL ` +
              `${url}. This route will only handle cross-origin requests ` +
              `if they match the entire URL.`);
        }
      }

      return url.href === captureUrl.href;
    };

    route = new _Route_mjs__WEBPACK_IMPORTED_MODULE_2__["Route"](matchCallback, handler, method);
  } else if (capture instanceof RegExp) {
    route = new _RegExpRoute_mjs__WEBPACK_IMPORTED_MODULE_3__["RegExpRoute"](capture, handler, method);
  } else if (typeof capture === 'function') {
    route = new _Route_mjs__WEBPACK_IMPORTED_MODULE_2__["Route"](capture, handler, method);
  } else if (capture instanceof _Route_mjs__WEBPACK_IMPORTED_MODULE_2__["Route"]) {
    route = capture;
  } else {
    throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_1__["WorkboxError"]('unsupported-route-type', {
      moduleName: 'workbox-routing',
      funcName: 'registerRoute',
      paramName: 'capture',
    });
  }

  const defaultRouter = Object(_utils_getOrCreateDefaultRouter_mjs__WEBPACK_IMPORTED_MODULE_4__["getOrCreateDefaultRouter"])();
  defaultRouter.registerRoute(route);

  return route;
};


/***/ }),

/***/ "./node_modules/workbox-routing/setCatchHandler.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/workbox-routing/setCatchHandler.mjs ***!
  \**********************************************************/
/*! exports provided: setCatchHandler */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setCatchHandler", function() { return setCatchHandler; });
/* harmony import */ var _utils_getOrCreateDefaultRouter_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/getOrCreateDefaultRouter.mjs */ "./node_modules/workbox-routing/utils/getOrCreateDefaultRouter.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





/**
 * If a Route throws an error while handling a request, this `handler`
 * will be called and given a chance to provide a response.
 *
 * @param {workbox.routing.Route~handlerCallback} handler A callback
 * function that returns a Promise resulting in a Response.
 *
 * @alias workbox.routing.setCatchHandler
 */
const setCatchHandler = (handler) => {
  const defaultRouter = Object(_utils_getOrCreateDefaultRouter_mjs__WEBPACK_IMPORTED_MODULE_0__["getOrCreateDefaultRouter"])();
  defaultRouter.setCatchHandler(handler);
};


/***/ }),

/***/ "./node_modules/workbox-routing/setDefaultHandler.mjs":
/*!************************************************************!*\
  !*** ./node_modules/workbox-routing/setDefaultHandler.mjs ***!
  \************************************************************/
/*! exports provided: setDefaultHandler */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setDefaultHandler", function() { return setDefaultHandler; });
/* harmony import */ var _utils_getOrCreateDefaultRouter_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/getOrCreateDefaultRouter.mjs */ "./node_modules/workbox-routing/utils/getOrCreateDefaultRouter.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/





/**
 * Define a default `handler` that's called when no routes explicitly
 * match the incoming request.
 *
 * Without a default handler, unmatched requests will go against the
 * network as if there were no service worker present.
 *
 * @param {workbox.routing.Route~handlerCallback} handler A callback
 * function that returns a Promise resulting in a Response.
 *
 * @alias workbox.routing.setDefaultHandler
 */
const setDefaultHandler = (handler) => {
  const defaultRouter = Object(_utils_getOrCreateDefaultRouter_mjs__WEBPACK_IMPORTED_MODULE_0__["getOrCreateDefaultRouter"])();
  defaultRouter.setDefaultHandler(handler);
};


/***/ }),

/***/ "./node_modules/workbox-routing/utils/constants.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/workbox-routing/utils/constants.mjs ***!
  \**********************************************************/
/*! exports provided: defaultMethod, validMethods */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultMethod", function() { return defaultMethod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "validMethods", function() { return validMethods; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



/**
 * The default HTTP method, 'GET', used when there's no specific method
 * configured for a route.
 *
 * @type {string}
 *
 * @private
 */
const defaultMethod = 'GET';

/**
 * The list of valid HTTP methods associated with requests that could be routed.
 *
 * @type {Array<string>}
 *
 * @private
 */
const validMethods = [
  'DELETE',
  'GET',
  'HEAD',
  'PATCH',
  'POST',
  'PUT',
];


/***/ }),

/***/ "./node_modules/workbox-routing/utils/getOrCreateDefaultRouter.mjs":
/*!*************************************************************************!*\
  !*** ./node_modules/workbox-routing/utils/getOrCreateDefaultRouter.mjs ***!
  \*************************************************************************/
/*! exports provided: getOrCreateDefaultRouter */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getOrCreateDefaultRouter", function() { return getOrCreateDefaultRouter; });
/* harmony import */ var _Router_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Router.mjs */ "./node_modules/workbox-routing/Router.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




let defaultRouter;

/**
 * Creates a new, singleton Router instance if one does not exist. If one
 * does already exist, that instance is returned.
 *
 * @private
 * @return {Router}
 */
const getOrCreateDefaultRouter = () => {
  if (!defaultRouter) {
    defaultRouter = new _Router_mjs__WEBPACK_IMPORTED_MODULE_0__["Router"]();

    // The helpers that use the default Router assume these listeners exist.
    defaultRouter.addFetchListener();
    defaultRouter.addCacheListener();
  }
  return defaultRouter;
};


/***/ }),

/***/ "./node_modules/workbox-routing/utils/normalizeHandler.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/workbox-routing/utils/normalizeHandler.mjs ***!
  \*****************************************************************/
/*! exports provided: normalizeHandler */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeHandler", function() { return normalizeHandler; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-routing/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




/**
 * @param {function()|Object} handler Either a function, or an object with a
 * 'handle' method.
 * @return {Object} An object with a handle method.
 *
 * @private
 */
const normalizeHandler = (handler) => {
  if (handler && typeof handler === 'object') {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].hasMethod(handler, 'handle', {
        moduleName: 'workbox-routing',
        className: 'Route',
        funcName: 'constructor',
        paramName: 'handler',
      });
    }
    return handler;
  } else {
    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(handler, 'function', {
        moduleName: 'workbox-routing',
        className: 'Route',
        funcName: 'constructor',
        paramName: 'handler',
      });
    }
    return {handle: handler};
  }
};


/***/ }),

/***/ "./node_modules/workbox-strategies/CacheFirst.mjs":
/*!********************************************************!*\
  !*** ./node_modules/workbox-strategies/CacheFirst.mjs ***!
  \********************************************************/
/*! exports provided: CacheFirst */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CacheFirst", function() { return CacheFirst; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/cacheWrapper.mjs */ "./node_modules/workbox-core/_private/cacheWrapper.mjs");
/* harmony import */ var workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/fetchWrapper.mjs */ "./node_modules/workbox-core/_private/fetchWrapper.mjs");
/* harmony import */ var workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! workbox-core/_private/getFriendlyURL.mjs */ "./node_modules/workbox-core/_private/getFriendlyURL.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/messages.mjs */ "./node_modules/workbox-strategies/utils/messages.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-strategies/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/












/**
 * An implementation of a [cache-first]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network}
 * request strategy.
 *
 * A cache first strategy is useful for assets that have been revisioned,
 * such as URLs like `/styles/example.a8f5f1.css`, since they
 * can be cached for long periods of time.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @memberof workbox.strategies
 */
class CacheFirst {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  constructor(options = {}) {
    this._cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__["cacheNames"].getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
    this._fetchOptions = options.fetchOptions || null;
    this._matchOptions = options.matchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} options
   * @param {Request} options.request The request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */
  async handle({event, request}) {
    return this.makeRequest({
      event,
      request: request || event.request,
    });
  }

  /**
   * This method can be used to perform a make a standalone request outside the
   * context of the [Workbox Router]{@link workbox.routing.Router}.
   *
   * See "[Advanced Recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#make-requests)"
   * for more usage information.
   *
   * @param {Object} options
   * @param {Request|string} options.request Either a
   *     [`Request`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request}
   *     object, or a string URL, corresponding to the request to be made.
   * @param {FetchEvent} [options.event] If provided, `event.waitUntil()` will
         be called automatically to extend the service worker's lifetime.
   * @return {Promise<Response>}
   */
  async makeRequest({event, request}) {
    const logs = [];

    if (typeof request === 'string') {
      request = new Request(request);
    }

    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(request, Request, {
        moduleName: 'workbox-strategies',
        className: 'CacheFirst',
        funcName: 'makeRequest',
        paramName: 'request',
      });
    }

    let response = await workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["cacheWrapper"].match({
      cacheName: this._cacheName,
      request,
      event,
      matchOptions: this._matchOptions,
      plugins: this._plugins,
    });

    let error;
    if (!response) {
      if (true) {
        logs.push(
            `No response found in the '${this._cacheName}' cache. ` +
          `Will respond with a network request.`);
      }
      try {
        response = await this._getFromNetwork(request, event);
      } catch (err) {
        error = err;
      }

      if (true) {
        if (response) {
          logs.push(`Got response from network.`);
        } else {
          logs.push(`Unable to get a response from the network.`);
        }
      }
    } else {
      if (true) {
        logs.push(
            `Found a cached response in the '${this._cacheName}' cache.`);
      }
    }

    if (true) {
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].groupCollapsed(
          _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__["messages"].strategyStart('CacheFirst', request));
      for (let log of logs) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].log(log);
      }
      _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__["messages"].printFinalResponse(response);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].groupEnd();
    }

    if (!response) {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_6__["WorkboxError"]('no-response', {url: request.url, error});
    }
    return response;
  }

  /**
   * Handles the network and cache part of CacheFirst.
   *
   * @param {Request} request
   * @param {FetchEvent} [event]
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getFromNetwork(request, event) {
    const response = await workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_3__["fetchWrapper"].fetch({
      request,
      event,
      fetchOptions: this._fetchOptions,
      plugins: this._plugins,
    });

    // Keep the service worker while we put the request to the cache
    const responseClone = response.clone();
    const cachePutPromise = workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["cacheWrapper"].put({
      cacheName: this._cacheName,
      request,
      response: responseClone,
      event,
      plugins: this._plugins,
    });

    if (event) {
      try {
        event.waitUntil(cachePutPromise);
      } catch (error) {
        if (true) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].warn(`Unable to ensure service worker stays alive when ` +
            `updating cache for '${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_4__["getFriendlyURL"])(request.url)}'.`);
        }
      }
    }

    return response;
  }
}




/***/ }),

/***/ "./node_modules/workbox-strategies/CacheOnly.mjs":
/*!*******************************************************!*\
  !*** ./node_modules/workbox-strategies/CacheOnly.mjs ***!
  \*******************************************************/
/*! exports provided: CacheOnly */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CacheOnly", function() { return CacheOnly; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/cacheWrapper.mjs */ "./node_modules/workbox-core/_private/cacheWrapper.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/messages.mjs */ "./node_modules/workbox-strategies/utils/messages.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-strategies/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/











/**
 * An implementation of a
 * [cache-only]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-only}
 * request strategy.
 *
 * This class is useful if you want to take advantage of any
 * [Workbox plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}.
 *
 * If there is no cache match, this will throw a `WorkboxError` exception.
 *
 * @memberof workbox.strategies
 */
class CacheOnly {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  constructor(options = {}) {
    this._cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__["cacheNames"].getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
    this._matchOptions = options.matchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} options
   * @param {Request} options.request The request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */
  async handle({event, request}) {
    return this.makeRequest({
      event,
      request: request || event.request,
    });
  }

  /**
   * This method can be used to perform a make a standalone request outside the
   * context of the [Workbox Router]{@link workbox.routing.Router}.
   *
   * See "[Advanced Recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#make-requests)"
   * for more usage information.
   *
   * @param {Object} options
   * @param {Request|string} options.request Either a
   *     [`Request`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request}
   *     object, or a string URL, corresponding to the request to be made.
   * @param {FetchEvent} [options.event] If provided, `event.waitUntil()` will
   *     be called automatically to extend the service worker's lifetime.
   * @return {Promise<Response>}
   */
  async makeRequest({event, request}) {
    if (typeof request === 'string') {
      request = new Request(request);
    }

    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(request, Request, {
        moduleName: 'workbox-strategies',
        className: 'CacheOnly',
        funcName: 'makeRequest',
        paramName: 'request',
      });
    }

    const response = await workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["cacheWrapper"].match({
      cacheName: this._cacheName,
      request,
      event,
      matchOptions: this._matchOptions,
      plugins: this._plugins,
    });

    if (true) {
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].groupCollapsed(
          _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_5__["messages"].strategyStart('CacheOnly', request));
      if (response) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].log(`Found a cached response in the '${this._cacheName}'` +
          ` cache.`);
        _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_5__["messages"].printFinalResponse(response);
      } else {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].log(`No response found in the '${this._cacheName}' cache.`);
      }
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].groupEnd();
    }

    if (!response) {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__["WorkboxError"]('no-response', {url: request.url});
    }
    return response;
  }
}




/***/ }),

/***/ "./node_modules/workbox-strategies/NetworkFirst.mjs":
/*!**********************************************************!*\
  !*** ./node_modules/workbox-strategies/NetworkFirst.mjs ***!
  \**********************************************************/
/*! exports provided: NetworkFirst */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkFirst", function() { return NetworkFirst; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/cacheWrapper.mjs */ "./node_modules/workbox-core/_private/cacheWrapper.mjs");
/* harmony import */ var workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/fetchWrapper.mjs */ "./node_modules/workbox-core/_private/fetchWrapper.mjs");
/* harmony import */ var workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! workbox-core/_private/getFriendlyURL.mjs */ "./node_modules/workbox-core/_private/getFriendlyURL.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/messages.mjs */ "./node_modules/workbox-strategies/utils/messages.mjs");
/* harmony import */ var _plugins_cacheOkAndOpaquePlugin_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./plugins/cacheOkAndOpaquePlugin.mjs */ "./node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-strategies/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/













/**
 * An implementation of a
 * [network first]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-falling-back-to-cache}
 * request strategy.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses]{@link https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests}.
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS]{@link https://enable-cors.org/}.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @memberof workbox.strategies
 */
class NetworkFirst {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   * @param {number} options.networkTimeoutSeconds If set, any network requests
   * that fail to respond within the timeout will fallback to the cache.
   *
   * This option can be used to combat
   * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
   * scenarios.
   */
  constructor(options = {}) {
    this._cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__["cacheNames"].getRuntimeName(options.cacheName);

    if (options.plugins) {
      let isUsingCacheWillUpdate =
        options.plugins.some((plugin) => !!plugin.cacheWillUpdate);
      this._plugins = isUsingCacheWillUpdate ?
        options.plugins : [_plugins_cacheOkAndOpaquePlugin_mjs__WEBPACK_IMPORTED_MODULE_8__["cacheOkAndOpaquePlugin"], ...options.plugins];
    } else {
      // No plugins passed in, use the default plugin.
      this._plugins = [_plugins_cacheOkAndOpaquePlugin_mjs__WEBPACK_IMPORTED_MODULE_8__["cacheOkAndOpaquePlugin"]];
    }

    this._networkTimeoutSeconds = options.networkTimeoutSeconds;
    if (true) {
      if (this._networkTimeoutSeconds) {
        workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isType(this._networkTimeoutSeconds, 'number', {
          moduleName: 'workbox-strategies',
          className: 'NetworkFirst',
          funcName: 'constructor',
          paramName: 'networkTimeoutSeconds',
        });
      }
    }

    this._fetchOptions = options.fetchOptions || null;
    this._matchOptions = options.matchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} options
   * @param {Request} options.request The request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */
  async handle({event, request}) {
    return this.makeRequest({
      event,
      request: request || event.request,
    });
  }

  /**
   * This method can be used to perform a make a standalone request outside the
   * context of the [Workbox Router]{@link workbox.routing.Router}.
   *
   * See "[Advanced Recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#make-requests)"
   * for more usage information.
   *
   * @param {Object} options
   * @param {Request|string} options.request Either a
   *     [`Request`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request}
   *     object, or a string URL, corresponding to the request to be made.
   * @param {FetchEvent} [options.event] If provided, `event.waitUntil()` will
   *     be called automatically to extend the service worker's lifetime.
   * @return {Promise<Response>}
   */
  async makeRequest({event, request}) {
    const logs = [];

    if (typeof request === 'string') {
      request = new Request(request);
    }

    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(request, Request, {
        moduleName: 'workbox-strategies',
        className: 'NetworkFirst',
        funcName: 'handle',
        paramName: 'makeRequest',
      });
    }

    const promises = [];
    let timeoutId;

    if (this._networkTimeoutSeconds) {
      const {id, promise} = this._getTimeoutPromise({request, event, logs});
      timeoutId = id;
      promises.push(promise);
    }

    const networkPromise =
        this._getNetworkPromise({timeoutId, request, event, logs});
    promises.push(networkPromise);

    // Promise.race() will resolve as soon as the first promise resolves.
    let response = await Promise.race(promises);
    // If Promise.race() resolved with null, it might be due to a network
    // timeout + a cache miss. If that were to happen, we'd rather wait until
    // the networkPromise resolves instead of returning null.
    // Note that it's fine to await an already-resolved promise, so we don't
    // have to check to see if it's still "in flight".
    if (!response) {
      response = await networkPromise;
    }

    if (true) {
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].groupCollapsed(
          _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__["messages"].strategyStart('NetworkFirst', request));
      for (let log of logs) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].log(log);
      }
      _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__["messages"].printFinalResponse(response);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].groupEnd();
    }

    if (!response) {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_6__["WorkboxError"]('no-response', {url: request.url});
    }
    return response;
  }

  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs array
   * @param {Event} [options.event]
   * @return {Promise<Response>}
   *
   * @private
   */
  _getTimeoutPromise({request, logs, event}) {
    let timeoutId;
    const timeoutPromise = new Promise((resolve) => {
      const onNetworkTimeout = async () => {
        if (true) {
          logs.push(`Timing out the network response at ` +
            `${this._networkTimeoutSeconds} seconds.`);
        }

        resolve(await this._respondFromCache({request, event}));
      };

      timeoutId = setTimeout(
          onNetworkTimeout,
          this._networkTimeoutSeconds * 1000,
      );
    });

    return {
      promise: timeoutPromise,
      id: timeoutId,
    };
  }

  /**
   * @param {Object} options
   * @param {number|undefined} options.timeoutId
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs Array.
   * @param {Event} [options.event]
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getNetworkPromise({timeoutId, request, logs, event}) {
    let error;
    let response;
    try {
      response = await workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_3__["fetchWrapper"].fetch({
        request,
        event,
        fetchOptions: this._fetchOptions,
        plugins: this._plugins,
      });
    } catch (err) {
      error = err;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (true) {
      if (response) {
        logs.push(`Got response from network.`);
      } else {
        logs.push(`Unable to get a response from the network. Will respond ` +
          `with a cached response.`);
      }
    }

    if (error || !response) {
      response = await this._respondFromCache({request, event});
      if (true) {
        if (response) {
          logs.push(`Found a cached response in the '${this._cacheName}'` +
            ` cache.`);
        } else {
          logs.push(`No response found in the '${this._cacheName}' cache.`);
        }
      }
    } else {
      // Keep the service worker alive while we put the request in the cache
      const responseClone = response.clone();
      const cachePut = workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["cacheWrapper"].put({
        cacheName: this._cacheName,
        request,
        response: responseClone,
        event,
        plugins: this._plugins,
      });

      if (event) {
        try {
          // The event has been responded to so we can keep the SW alive to
          // respond to the request
          event.waitUntil(cachePut);
        } catch (err) {
          if (true) {
            workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].warn(`Unable to ensure service worker stays alive when ` +
              `updating cache for '${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_4__["getFriendlyURL"])(request.url)}'.`);
          }
        }
      }
    }

    return response;
  }

  /**
   * Used if the network timeouts or fails to make the request.
   *
   * @param {Object} options
   * @param {Request} request The request to match in the cache
   * @param {Event} [options.event]
   * @return {Promise<Object>}
   *
   * @private
   */
  _respondFromCache({event, request}) {
    return workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["cacheWrapper"].match({
      cacheName: this._cacheName,
      request,
      event,
      matchOptions: this._matchOptions,
      plugins: this._plugins,
    });
  }
}




/***/ }),

/***/ "./node_modules/workbox-strategies/NetworkOnly.mjs":
/*!*********************************************************!*\
  !*** ./node_modules/workbox-strategies/NetworkOnly.mjs ***!
  \*********************************************************/
/*! exports provided: NetworkOnly */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkOnly", function() { return NetworkOnly; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/fetchWrapper.mjs */ "./node_modules/workbox-core/_private/fetchWrapper.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/messages.mjs */ "./node_modules/workbox-strategies/utils/messages.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-strategies/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/










/**
 * An implementation of a
 * [network-only]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#network-only}
 * request strategy.
 *
 * This class is useful if you want to take advantage of any
 * [Workbox plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}.
 *
 * If the network request fails, this will throw a `WorkboxError` exception.
 *
 * @memberof workbox.strategies
 */
class NetworkOnly {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   */
  constructor(options = {}) {
    this._cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__["cacheNames"].getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
    this._fetchOptions = options.fetchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} options
   * @param {Request} options.request The request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */
  async handle({event, request}) {
    return this.makeRequest({
      event,
      request: request || event.request,
    });
  }

  /**
   * This method can be used to perform a make a standalone request outside the
   * context of the [Workbox Router]{@link workbox.routing.Router}.
   *
   * See "[Advanced Recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#make-requests)"
   * for more usage information.
   *
   * @param {Object} options
   * @param {Request|string} options.request Either a
   *     [`Request`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request}
   *     object, or a string URL, corresponding to the request to be made.
   * @param {FetchEvent} [options.event] If provided, `event.waitUntil()` will
   *     be called automatically to extend the service worker's lifetime.
   * @return {Promise<Response>}
   */
  async makeRequest({event, request}) {
    if (typeof request === 'string') {
      request = new Request(request);
    }

    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(request, Request, {
        moduleName: 'workbox-strategies',
        className: 'NetworkOnly',
        funcName: 'handle',
        paramName: 'request',
      });
    }

    let error;
    let response;
    try {
      response = await workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["fetchWrapper"].fetch({
        request,
        event,
        fetchOptions: this._fetchOptions,
        plugins: this._plugins,
      });
    } catch (err) {
      error = err;
    }

    if (true) {
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].groupCollapsed(
          _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_5__["messages"].strategyStart('NetworkOnly', request));
      if (response) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].log(`Got response from network.`);
      } else {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].log(`Unable to get a response from the network.`);
      }
      _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_5__["messages"].printFinalResponse(response);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_3__["logger"].groupEnd();
    }

    if (!response) {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_4__["WorkboxError"]('no-response', {url: request.url, error});
    }
    return response;
  }
}




/***/ }),

/***/ "./node_modules/workbox-strategies/StaleWhileRevalidate.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/workbox-strategies/StaleWhileRevalidate.mjs ***!
  \******************************************************************/
/*! exports provided: StaleWhileRevalidate */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StaleWhileRevalidate", function() { return StaleWhileRevalidate; });
/* harmony import */ var workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/assert.mjs */ "./node_modules/workbox-core/_private/assert.mjs");
/* harmony import */ var workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-core/_private/cacheNames.mjs */ "./node_modules/workbox-core/_private/cacheNames.mjs");
/* harmony import */ var workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-core/_private/cacheWrapper.mjs */ "./node_modules/workbox-core/_private/cacheWrapper.mjs");
/* harmony import */ var workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-core/_private/fetchWrapper.mjs */ "./node_modules/workbox-core/_private/fetchWrapper.mjs");
/* harmony import */ var workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! workbox-core/_private/getFriendlyURL.mjs */ "./node_modules/workbox-core/_private/getFriendlyURL.mjs");
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! workbox-core/_private/WorkboxError.mjs */ "./node_modules/workbox-core/_private/WorkboxError.mjs");
/* harmony import */ var _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/messages.mjs */ "./node_modules/workbox-strategies/utils/messages.mjs");
/* harmony import */ var _plugins_cacheOkAndOpaquePlugin_mjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./plugins/cacheOkAndOpaquePlugin.mjs */ "./node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-strategies/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/













/**
 * An implementation of a
 * [stale-while-revalidate]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate}
 * request strategy.
 *
 * Resources are requested from both the cache and the network in parallel.
 * The strategy will respond with the cached version if available, otherwise
 * wait for the network response. The cache is updated with the network response
 * with each successful request.
 *
 * By default, this strategy will cache responses with a 200 status code as
 * well as [opaque responses]{@link https://developers.google.com/web/tools/workbox/guides/handle-third-party-requests}.
 * Opaque responses are are cross-origin requests where the response doesn't
 * support [CORS]{@link https://enable-cors.org/}.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @memberof workbox.strategies
 */
class StaleWhileRevalidate {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  constructor(options = {}) {
    this._cacheName = workbox_core_private_cacheNames_mjs__WEBPACK_IMPORTED_MODULE_1__["cacheNames"].getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];

    if (options.plugins) {
      let isUsingCacheWillUpdate =
        options.plugins.some((plugin) => !!plugin.cacheWillUpdate);
      this._plugins = isUsingCacheWillUpdate ?
        options.plugins : [_plugins_cacheOkAndOpaquePlugin_mjs__WEBPACK_IMPORTED_MODULE_8__["cacheOkAndOpaquePlugin"], ...options.plugins];
    } else {
      // No plugins passed in, use the default plugin.
      this._plugins = [_plugins_cacheOkAndOpaquePlugin_mjs__WEBPACK_IMPORTED_MODULE_8__["cacheOkAndOpaquePlugin"]];
    }

    this._fetchOptions = options.fetchOptions || null;
    this._matchOptions = options.matchOptions || null;
  }

  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} options
   * @param {Request} options.request The request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */
  async handle({event, request}) {
    return this.makeRequest({
      event,
      request: request || event.request,
    });
  }
  /**
   * This method can be used to perform a make a standalone request outside the
   * context of the [Workbox Router]{@link workbox.routing.Router}.
   *
   * See "[Advanced Recipes](https://developers.google.com/web/tools/workbox/guides/advanced-recipes#make-requests)"
   * for more usage information.
   *
   * @param {Object} options
   * @param {Request|string} options.request Either a
   *     [`Request`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Request}
   *     object, or a string URL, corresponding to the request to be made.
   * @param {FetchEvent} [options.event] If provided, `event.waitUntil()` will
   *     be called automatically to extend the service worker's lifetime.
   * @return {Promise<Response>}
   */
  async makeRequest({event, request}) {
    const logs = [];

    if (typeof request === 'string') {
      request = new Request(request);
    }

    if (true) {
      workbox_core_private_assert_mjs__WEBPACK_IMPORTED_MODULE_0__["assert"].isInstance(request, Request, {
        moduleName: 'workbox-strategies',
        className: 'StaleWhileRevalidate',
        funcName: 'handle',
        paramName: 'request',
      });
    }

    const fetchAndCachePromise = this._getFromNetwork({request, event});

    let response = await workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["cacheWrapper"].match({
      cacheName: this._cacheName,
      request,
      event,
      matchOptions: this._matchOptions,
      plugins: this._plugins,
    });
    let error;
    if (response) {
      if (true) {
        logs.push(`Found a cached response in the '${this._cacheName}'` +
          ` cache. Will update with the network response in the background.`);
      }

      if (event) {
        try {
          event.waitUntil(fetchAndCachePromise);
        } catch (error) {
          if (true) {
            workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].warn(`Unable to ensure service worker stays alive when ` +
              `updating cache for '${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_4__["getFriendlyURL"])(request.url)}'.`);
          }
        }
      }
    } else {
      if (true) {
        logs.push(`No response found in the '${this._cacheName}' cache. ` +
          `Will wait for the network response.`);
      }
      try {
        response = await fetchAndCachePromise;
      } catch (err) {
        error = err;
      }
    }

    if (true) {
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].groupCollapsed(
          _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__["messages"].strategyStart('StaleWhileRevalidate', request));
      for (let log of logs) {
        workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].log(log);
      }
      _utils_messages_mjs__WEBPACK_IMPORTED_MODULE_7__["messages"].printFinalResponse(response);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].groupEnd();
    }

    if (!response) {
      throw new workbox_core_private_WorkboxError_mjs__WEBPACK_IMPORTED_MODULE_6__["WorkboxError"]('no-response', {url: request.url, error});
    }
    return response;
  }

  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Event} [options.event]
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getFromNetwork({request, event}) {
    const response = await workbox_core_private_fetchWrapper_mjs__WEBPACK_IMPORTED_MODULE_3__["fetchWrapper"].fetch({
      request,
      event,
      fetchOptions: this._fetchOptions,
      plugins: this._plugins,
    });

    const cachePutPromise = workbox_core_private_cacheWrapper_mjs__WEBPACK_IMPORTED_MODULE_2__["cacheWrapper"].put({
      cacheName: this._cacheName,
      request,
      response: response.clone(),
      event,
      plugins: this._plugins,
    });

    if (event) {
      try {
        event.waitUntil(cachePutPromise);
      } catch (error) {
        if (true) {
          workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_5__["logger"].warn(`Unable to ensure service worker stays alive when ` +
            `updating cache for '${Object(workbox_core_private_getFriendlyURL_mjs__WEBPACK_IMPORTED_MODULE_4__["getFriendlyURL"])(request.url)}'.`);
        }
      }
    }

    return response;
  }
}




/***/ }),

/***/ "./node_modules/workbox-strategies/_version.mjs":
/*!******************************************************!*\
  !*** ./node_modules/workbox-strategies/_version.mjs ***!
  \******************************************************/
/*! no exports provided */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
try{self['workbox:strategies:4.3.1']&&_()}catch(e){}// eslint-disable-line

/***/ }),

/***/ "./node_modules/workbox-strategies/index.mjs":
/*!***************************************************!*\
  !*** ./node_modules/workbox-strategies/index.mjs ***!
  \***************************************************/
/*! exports provided: CacheFirst, CacheOnly, NetworkFirst, NetworkOnly, StaleWhileRevalidate, cacheFirst, cacheOnly, networkFirst, networkOnly, staleWhileRevalidate */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cacheFirst", function() { return cacheFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cacheOnly", function() { return cacheOnly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "networkFirst", function() { return networkFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "networkOnly", function() { return networkOnly; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staleWhileRevalidate", function() { return staleWhileRevalidate; });
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _CacheFirst_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CacheFirst.mjs */ "./node_modules/workbox-strategies/CacheFirst.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CacheFirst", function() { return _CacheFirst_mjs__WEBPACK_IMPORTED_MODULE_1__["CacheFirst"]; });

/* harmony import */ var _CacheOnly_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CacheOnly.mjs */ "./node_modules/workbox-strategies/CacheOnly.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CacheOnly", function() { return _CacheOnly_mjs__WEBPACK_IMPORTED_MODULE_2__["CacheOnly"]; });

/* harmony import */ var _NetworkFirst_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NetworkFirst.mjs */ "./node_modules/workbox-strategies/NetworkFirst.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkFirst", function() { return _NetworkFirst_mjs__WEBPACK_IMPORTED_MODULE_3__["NetworkFirst"]; });

/* harmony import */ var _NetworkOnly_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NetworkOnly.mjs */ "./node_modules/workbox-strategies/NetworkOnly.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkOnly", function() { return _NetworkOnly_mjs__WEBPACK_IMPORTED_MODULE_4__["NetworkOnly"]; });

/* harmony import */ var _StaleWhileRevalidate_mjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./StaleWhileRevalidate.mjs */ "./node_modules/workbox-strategies/StaleWhileRevalidate.mjs");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "StaleWhileRevalidate", function() { return _StaleWhileRevalidate_mjs__WEBPACK_IMPORTED_MODULE_5__["StaleWhileRevalidate"]; });

/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./_version.mjs */ "./node_modules/workbox-strategies/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/










const mapping = {
  cacheFirst: _CacheFirst_mjs__WEBPACK_IMPORTED_MODULE_1__["CacheFirst"],
  cacheOnly: _CacheOnly_mjs__WEBPACK_IMPORTED_MODULE_2__["CacheOnly"],
  networkFirst: _NetworkFirst_mjs__WEBPACK_IMPORTED_MODULE_3__["NetworkFirst"],
  networkOnly: _NetworkOnly_mjs__WEBPACK_IMPORTED_MODULE_4__["NetworkOnly"],
  staleWhileRevalidate: _StaleWhileRevalidate_mjs__WEBPACK_IMPORTED_MODULE_5__["StaleWhileRevalidate"],
};

const deprecate = (strategy) => {
  const StrategyCtr = mapping[strategy];

  return (options) => {
    if (true) {
      const strategyCtrName = strategy[0].toUpperCase() + strategy.slice(1);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].warn(`The 'workbox.strategies.${strategy}()' function has been ` +
          `deprecated and will be removed in a future version of Workbox.\n` +
          `Please use 'new workbox.strategies.${strategyCtrName}()' instead.`);
    }
    return new StrategyCtr(options);
  };
};

/**
 * @function workbox.strategies.cacheFirst
 * @param {Object} options See the {@link workbox.strategies.CacheFirst}
 * constructor for more info.
 * @deprecated since v4.0.0
 */
const cacheFirst = deprecate('cacheFirst');

/**
 * @function workbox.strategies.cacheOnly
 * @param {Object} options See the {@link workbox.strategies.CacheOnly}
 * constructor for more info.
 * @deprecated since v4.0.0
 */
const cacheOnly = deprecate('cacheOnly');

/**
 * @function workbox.strategies.networkFirst
 * @param {Object} options See the {@link workbox.strategies.NetworkFirst}
 * constructor for more info.
 * @deprecated since v4.0.0
 */
const networkFirst = deprecate('networkFirst');

/**
 * @function workbox.strategies.networkOnly
 * @param {Object} options See the {@link workbox.strategies.NetworkOnly}
 * constructor for more info.
 * @deprecated since v4.0.0
 */
const networkOnly = deprecate('networkOnly');

/**
 * @function workbox.strategies.staleWhileRevalidate
 * @param {Object} options See the
 * {@link workbox.strategies.StaleWhileRevalidate} constructor for more info.
 * @deprecated since v4.0.0
 */
const staleWhileRevalidate = deprecate('staleWhileRevalidate');

/**
 * There are common caching strategies that most service workers will need
 * and use. This module provides simple implementations of these strategies.
 *
 * @namespace workbox.strategies
 */





/***/ }),

/***/ "./node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.mjs":
/*!****************************************************************************!*\
  !*** ./node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.mjs ***!
  \****************************************************************************/
/*! exports provided: cacheOkAndOpaquePlugin */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cacheOkAndOpaquePlugin", function() { return cacheOkAndOpaquePlugin; });
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-strategies/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/



const cacheOkAndOpaquePlugin = {
  /**
   * Returns a valid response (to allow caching) if the status is 200 (OK) or
   * 0 (opaque).
   *
   * @param {Object} options
   * @param {Response} options.response
   * @return {Response|null}
   *
   * @private
   */
  cacheWillUpdate: ({response}) => {
    if (response.status === 200 || response.status === 0) {
      return response;
    }
    return null;
  },
};


/***/ }),

/***/ "./node_modules/workbox-strategies/utils/messages.mjs":
/*!************************************************************!*\
  !*** ./node_modules/workbox-strategies/utils/messages.mjs ***!
  \************************************************************/
/*! exports provided: messages */
/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "messages", function() { return messages; });
/* harmony import */ var workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-core/_private/logger.mjs */ "./node_modules/workbox-core/_private/logger.mjs");
/* harmony import */ var _version_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_version.mjs */ "./node_modules/workbox-strategies/_version.mjs");
/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/




const getFriendlyURL = (url) => {
  const urlObj = new URL(url, location);
  if (urlObj.origin === location.origin) {
    return urlObj.pathname;
  }
  return urlObj.href;
};

const messages = {
  strategyStart: (strategyName, request) => `Using ${strategyName} to ` +
    `respond to '${getFriendlyURL(request.url)}'`,
  printFinalResponse: (response) => {
    if (response) {
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupCollapsed(`View the final response here.`);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].log(response);
      workbox_core_private_logger_mjs__WEBPACK_IMPORTED_MODULE_0__["logger"].groupEnd();
    }
  },
};


/***/ }),

/***/ "./src/assets/scripts/service-worker/service-worker.js":
/*!*************************************************************!*\
  !*** ./src/assets/scripts/service-worker/service-worker.js ***!
  \*************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var workbox_expiration__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! workbox-expiration */ "./node_modules/workbox-expiration/index.mjs");
/* harmony import */ var workbox_precaching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! workbox-precaching */ "./node_modules/workbox-precaching/index.mjs");
/* harmony import */ var workbox_routing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! workbox-routing */ "./node_modules/workbox-routing/index.mjs");
/* harmony import */ var workbox_strategies__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! workbox-strategies */ "./node_modules/workbox-strategies/index.mjs");
// JavaScript Document

// Scripts written by Jacob Bearce @ Weblinx, Inc.






/**
 * Cache WordPress content
 */
workbox_routing__WEBPACK_IMPORTED_MODULE_2__["registerRoute"](
    /^(?:(?!wp-admin|wp-content|wp-includes|wp-login)(.*)\/)?$/,
    new workbox_strategies__WEBPACK_IMPORTED_MODULE_3__["NetworkFirst"]({
        cacheName: "myweblinx-content-cache",
        plugins: [
            new workbox_expiration__WEBPACK_IMPORTED_MODULE_0__["Plugin"]({
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
        ],
    })
);

/**
 * Cache CSS files
 */
workbox_routing__WEBPACK_IMPORTED_MODULE_2__["registerRoute"](
    /\.css$/,
    new workbox_strategies__WEBPACK_IMPORTED_MODULE_3__["CacheFirst"]({
        cacheName: "myweblinx-css-cache",
    })
);

/**
 * Cache JS files
 */
workbox_routing__WEBPACK_IMPORTED_MODULE_2__["registerRoute"](
    /\.js$/,
    new workbox_strategies__WEBPACK_IMPORTED_MODULE_3__["CacheFirst"]({
        cacheName: "myweblinx-js-cache",
    })
);

/**
 * Cache image files
 */
workbox_routing__WEBPACK_IMPORTED_MODULE_2__["registerRoute"](
    /\.(gif|jpeg|jpg|png|svg|webp)$/,
    new workbox_strategies__WEBPACK_IMPORTED_MODULE_3__["CacheFirst"]({
        cacheName: "myweblinx-image-cache",
        plugins: [
            new workbox_expiration__WEBPACK_IMPORTED_MODULE_0__["Plugin"]({
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
        ],
    })
);

/**
 * Cache font files
 */
workbox_routing__WEBPACK_IMPORTED_MODULE_2__["registerRoute"](
    /\.(otf|ttf|woff|woff2)$/,
    new workbox_strategies__WEBPACK_IMPORTED_MODULE_3__["CacheFirst"]({
        cacheName: "myweblinx-font-cache",
        plugins: [
            new workbox_expiration__WEBPACK_IMPORTED_MODULE_0__["Plugin"]({
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
        ],
    })
);

/**
 * Precache "offline" page
 */
workbox_precaching__WEBPACK_IMPORTED_MODULE_1__["precacheAndRoute"]([
    "/offline/",
]);

/**
 * Return "offline" page when visiting pages offlien that haven't been cached
 */
workbox_routing__WEBPACK_IMPORTED_MODULE_2__["setCatchHandler"](() => {
    return caches.match("/offline/");
});


/***/ }),

/***/ 3:
/*!*******************************************************************!*\
  !*** multi ./src/assets/scripts/service-worker/service-worker.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/assets/scripts/service-worker/service-worker.js */"./src/assets/scripts/service-worker/service-worker.js");


/***/ })

/******/ });
//# sourceMappingURL=service-worker.js.map