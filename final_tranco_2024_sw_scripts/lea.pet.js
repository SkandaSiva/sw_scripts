var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// <define:_LANGS_>
var init_define_LANGS = __esm({
  "<define:_LANGS_>"() {
  }
});

// ../../node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "../../node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    init_define_LANGS();
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// src/sw.ts
init_define_LANGS();

// ../../node_modules/.pnpm/idb-keyval@6.2.1/node_modules/idb-keyval/dist/index.js
init_define_LANGS();
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
var defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}

// ../misskey-js/built/index.js
init_define_LANGS();

// ../misskey-js/built/streaming.js
init_define_LANGS();

// ../../node_modules/.pnpm/eventemitter3@5.0.1/node_modules/eventemitter3/index.mjs
init_define_LANGS();
var import_index = __toESM(require_eventemitter3(), 1);

// ../../node_modules/.pnpm/reconnecting-websocket@4.4.0/node_modules/reconnecting-websocket/dist/reconnecting-websocket-mjs.js
init_define_LANGS();
var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
    d2.__proto__ = b2;
  } || function(d2, b2) {
    for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __values(o) {
  var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
  if (m) return m.call(o);
  return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
var Event = (
  /** @class */
  /* @__PURE__ */ function() {
    function Event2(type, target) {
      this.target = target;
      this.type = type;
    }
    return Event2;
  }()
);
var ErrorEvent = (
  /** @class */
  function(_super) {
    __extends(ErrorEvent2, _super);
    function ErrorEvent2(error, target) {
      var _this = _super.call(this, "error", target) || this;
      _this.message = error.message;
      _this.error = error;
      return _this;
    }
    return ErrorEvent2;
  }(Event)
);
var CloseEvent = (
  /** @class */
  function(_super) {
    __extends(CloseEvent2, _super);
    function CloseEvent2(code, reason, target) {
      if (code === void 0) {
        code = 1e3;
      }
      if (reason === void 0) {
        reason = "";
      }
      var _this = _super.call(this, "close", target) || this;
      _this.wasClean = true;
      _this.code = code;
      _this.reason = reason;
      return _this;
    }
    return CloseEvent2;
  }(Event)
);
var getGlobalWebSocket = function() {
  if (typeof WebSocket !== "undefined") {
    return WebSocket;
  }
};
var isWebSocket = function(w) {
  return typeof w !== "undefined" && !!w && w.CLOSING === 2;
};
var DEFAULT = {
  maxReconnectionDelay: 1e4,
  minReconnectionDelay: 1e3 + Math.random() * 4e3,
  minUptime: 5e3,
  reconnectionDelayGrowFactor: 1.3,
  connectionTimeout: 4e3,
  maxRetries: Infinity,
  maxEnqueuedMessages: Infinity,
  startClosed: false,
  debug: false
};
var ReconnectingWebSocket = (
  /** @class */
  function() {
    function ReconnectingWebSocket2(url, protocols, options) {
      var _this = this;
      if (options === void 0) {
        options = {};
      }
      this._listeners = {
        error: [],
        message: [],
        open: [],
        close: []
      };
      this._retryCount = -1;
      this._shouldReconnect = true;
      this._connectLock = false;
      this._binaryType = "blob";
      this._closeCalled = false;
      this._messageQueue = [];
      this.onclose = null;
      this.onerror = null;
      this.onmessage = null;
      this.onopen = null;
      this._handleOpen = function(event) {
        _this._debug("open event");
        var _a = _this._options.minUptime, minUptime = _a === void 0 ? DEFAULT.minUptime : _a;
        clearTimeout(_this._connectTimeout);
        _this._uptimeTimeout = setTimeout(function() {
          return _this._acceptOpen();
        }, minUptime);
        _this._ws.binaryType = _this._binaryType;
        _this._messageQueue.forEach(function(message) {
          return _this._ws.send(message);
        });
        _this._messageQueue = [];
        if (_this.onopen) {
          _this.onopen(event);
        }
        _this._listeners.open.forEach(function(listener) {
          return _this._callEventListener(event, listener);
        });
      };
      this._handleMessage = function(event) {
        _this._debug("message event");
        if (_this.onmessage) {
          _this.onmessage(event);
        }
        _this._listeners.message.forEach(function(listener) {
          return _this._callEventListener(event, listener);
        });
      };
      this._handleError = function(event) {
        _this._debug("error event", event.message);
        _this._disconnect(void 0, event.message === "TIMEOUT" ? "timeout" : void 0);
        if (_this.onerror) {
          _this.onerror(event);
        }
        _this._debug("exec error listeners");
        _this._listeners.error.forEach(function(listener) {
          return _this._callEventListener(event, listener);
        });
        _this._connect();
      };
      this._handleClose = function(event) {
        _this._debug("close event");
        _this._clearTimeouts();
        if (_this._shouldReconnect) {
          _this._connect();
        }
        if (_this.onclose) {
          _this.onclose(event);
        }
        _this._listeners.close.forEach(function(listener) {
          return _this._callEventListener(event, listener);
        });
      };
      this._url = url;
      this._protocols = protocols;
      this._options = options;
      if (this._options.startClosed) {
        this._shouldReconnect = false;
      }
      this._connect();
    }
    Object.defineProperty(ReconnectingWebSocket2, "CONNECTING", {
      get: function() {
        return 0;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2, "OPEN", {
      get: function() {
        return 1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2, "CLOSING", {
      get: function() {
        return 2;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2, "CLOSED", {
      get: function() {
        return 3;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "CONNECTING", {
      get: function() {
        return ReconnectingWebSocket2.CONNECTING;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "OPEN", {
      get: function() {
        return ReconnectingWebSocket2.OPEN;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "CLOSING", {
      get: function() {
        return ReconnectingWebSocket2.CLOSING;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "CLOSED", {
      get: function() {
        return ReconnectingWebSocket2.CLOSED;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "binaryType", {
      get: function() {
        return this._ws ? this._ws.binaryType : this._binaryType;
      },
      set: function(value) {
        this._binaryType = value;
        if (this._ws) {
          this._ws.binaryType = value;
        }
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "retryCount", {
      /**
       * Returns the number or connection retries
       */
      get: function() {
        return Math.max(this._retryCount, 0);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "bufferedAmount", {
      /**
       * The number of bytes of data that have been queued using calls to send() but not yet
       * transmitted to the network. This value resets to zero once all queued data has been sent.
       * This value does not reset to zero when the connection is closed; if you keep calling send(),
       * this will continue to climb. Read only
       */
      get: function() {
        var bytes = this._messageQueue.reduce(function(acc, message) {
          if (typeof message === "string") {
            acc += message.length;
          } else if (message instanceof Blob) {
            acc += message.size;
          } else {
            acc += message.byteLength;
          }
          return acc;
        }, 0);
        return bytes + (this._ws ? this._ws.bufferedAmount : 0);
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "extensions", {
      /**
       * The extensions selected by the server. This is currently only the empty string or a list of
       * extensions as negotiated by the connection
       */
      get: function() {
        return this._ws ? this._ws.extensions : "";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "protocol", {
      /**
       * A string indicating the name of the sub-protocol the server selected;
       * this will be one of the strings specified in the protocols parameter when creating the
       * WebSocket object
       */
      get: function() {
        return this._ws ? this._ws.protocol : "";
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "readyState", {
      /**
       * The current state of the connection; this is one of the Ready state constants
       */
      get: function() {
        if (this._ws) {
          return this._ws.readyState;
        }
        return this._options.startClosed ? ReconnectingWebSocket2.CLOSED : ReconnectingWebSocket2.CONNECTING;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(ReconnectingWebSocket2.prototype, "url", {
      /**
       * The URL as resolved by the constructor
       */
      get: function() {
        return this._ws ? this._ws.url : "";
      },
      enumerable: true,
      configurable: true
    });
    ReconnectingWebSocket2.prototype.close = function(code, reason) {
      if (code === void 0) {
        code = 1e3;
      }
      this._closeCalled = true;
      this._shouldReconnect = false;
      this._clearTimeouts();
      if (!this._ws) {
        this._debug("close enqueued: no ws instance");
        return;
      }
      if (this._ws.readyState === this.CLOSED) {
        this._debug("close: already closed");
        return;
      }
      this._ws.close(code, reason);
    };
    ReconnectingWebSocket2.prototype.reconnect = function(code, reason) {
      this._shouldReconnect = true;
      this._closeCalled = false;
      this._retryCount = -1;
      if (!this._ws || this._ws.readyState === this.CLOSED) {
        this._connect();
      } else {
        this._disconnect(code, reason);
        this._connect();
      }
    };
    ReconnectingWebSocket2.prototype.send = function(data) {
      if (this._ws && this._ws.readyState === this.OPEN) {
        this._debug("send", data);
        this._ws.send(data);
      } else {
        var _a = this._options.maxEnqueuedMessages, maxEnqueuedMessages = _a === void 0 ? DEFAULT.maxEnqueuedMessages : _a;
        if (this._messageQueue.length < maxEnqueuedMessages) {
          this._debug("enqueue", data);
          this._messageQueue.push(data);
        }
      }
    };
    ReconnectingWebSocket2.prototype.addEventListener = function(type, listener) {
      if (this._listeners[type]) {
        this._listeners[type].push(listener);
      }
    };
    ReconnectingWebSocket2.prototype.dispatchEvent = function(event) {
      var e_1, _a;
      var listeners = this._listeners[event.type];
      if (listeners) {
        try {
          for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
            var listener = listeners_1_1.value;
            this._callEventListener(event, listener);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }
      return true;
    };
    ReconnectingWebSocket2.prototype.removeEventListener = function(type, listener) {
      if (this._listeners[type]) {
        this._listeners[type] = this._listeners[type].filter(function(l) {
          return l !== listener;
        });
      }
    };
    ReconnectingWebSocket2.prototype._debug = function() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      if (this._options.debug) {
        console.log.apply(console, __spread(["RWS>"], args));
      }
    };
    ReconnectingWebSocket2.prototype._getNextDelay = function() {
      var _a = this._options, _b = _a.reconnectionDelayGrowFactor, reconnectionDelayGrowFactor = _b === void 0 ? DEFAULT.reconnectionDelayGrowFactor : _b, _c = _a.minReconnectionDelay, minReconnectionDelay = _c === void 0 ? DEFAULT.minReconnectionDelay : _c, _d = _a.maxReconnectionDelay, maxReconnectionDelay = _d === void 0 ? DEFAULT.maxReconnectionDelay : _d;
      var delay = 0;
      if (this._retryCount > 0) {
        delay = minReconnectionDelay * Math.pow(reconnectionDelayGrowFactor, this._retryCount - 1);
        if (delay > maxReconnectionDelay) {
          delay = maxReconnectionDelay;
        }
      }
      this._debug("next delay", delay);
      return delay;
    };
    ReconnectingWebSocket2.prototype._wait = function() {
      var _this = this;
      return new Promise(function(resolve) {
        setTimeout(resolve, _this._getNextDelay());
      });
    };
    ReconnectingWebSocket2.prototype._getNextUrl = function(urlProvider) {
      if (typeof urlProvider === "string") {
        return Promise.resolve(urlProvider);
      }
      if (typeof urlProvider === "function") {
        var url = urlProvider();
        if (typeof url === "string") {
          return Promise.resolve(url);
        }
        if (!!url.then) {
          return url;
        }
      }
      throw Error("Invalid URL");
    };
    ReconnectingWebSocket2.prototype._connect = function() {
      var _this = this;
      if (this._connectLock || !this._shouldReconnect) {
        return;
      }
      this._connectLock = true;
      var _a = this._options, _b = _a.maxRetries, maxRetries = _b === void 0 ? DEFAULT.maxRetries : _b, _c = _a.connectionTimeout, connectionTimeout = _c === void 0 ? DEFAULT.connectionTimeout : _c, _d = _a.WebSocket, WebSocket2 = _d === void 0 ? getGlobalWebSocket() : _d;
      if (this._retryCount >= maxRetries) {
        this._debug("max retries reached", this._retryCount, ">=", maxRetries);
        return;
      }
      this._retryCount++;
      this._debug("connect", this._retryCount);
      this._removeListeners();
      if (!isWebSocket(WebSocket2)) {
        throw Error("No valid WebSocket class provided");
      }
      this._wait().then(function() {
        return _this._getNextUrl(_this._url);
      }).then(function(url) {
        if (_this._closeCalled) {
          return;
        }
        _this._debug("connect", { url, protocols: _this._protocols });
        _this._ws = _this._protocols ? new WebSocket2(url, _this._protocols) : new WebSocket2(url);
        _this._ws.binaryType = _this._binaryType;
        _this._connectLock = false;
        _this._addListeners();
        _this._connectTimeout = setTimeout(function() {
          return _this._handleTimeout();
        }, connectionTimeout);
      });
    };
    ReconnectingWebSocket2.prototype._handleTimeout = function() {
      this._debug("timeout event");
      this._handleError(new ErrorEvent(Error("TIMEOUT"), this));
    };
    ReconnectingWebSocket2.prototype._disconnect = function(code, reason) {
      if (code === void 0) {
        code = 1e3;
      }
      this._clearTimeouts();
      if (!this._ws) {
        return;
      }
      this._removeListeners();
      try {
        this._ws.close(code, reason);
        this._handleClose(new CloseEvent(code, reason, this));
      } catch (error) {
      }
    };
    ReconnectingWebSocket2.prototype._acceptOpen = function() {
      this._debug("accept open");
      this._retryCount = 0;
    };
    ReconnectingWebSocket2.prototype._callEventListener = function(event, listener) {
      if ("handleEvent" in listener) {
        listener.handleEvent(event);
      } else {
        listener(event);
      }
    };
    ReconnectingWebSocket2.prototype._removeListeners = function() {
      if (!this._ws) {
        return;
      }
      this._debug("removeListeners");
      this._ws.removeEventListener("open", this._handleOpen);
      this._ws.removeEventListener("close", this._handleClose);
      this._ws.removeEventListener("message", this._handleMessage);
      this._ws.removeEventListener("error", this._handleError);
    };
    ReconnectingWebSocket2.prototype._addListeners = function() {
      if (!this._ws) {
        return;
      }
      this._debug("addListeners");
      this._ws.addEventListener("open", this._handleOpen);
      this._ws.addEventListener("close", this._handleClose);
      this._ws.addEventListener("message", this._handleMessage);
      this._ws.addEventListener("error", this._handleError);
    };
    ReconnectingWebSocket2.prototype._clearTimeouts = function() {
      clearTimeout(this._connectTimeout);
      clearTimeout(this._uptimeTimeout);
    };
    return ReconnectingWebSocket2;
  }()
);

// ../misskey-js/built/consts.js
init_define_LANGS();

// ../misskey-js/built/api.js
var api_exports = {};
__export(api_exports, {
  APIClient: () => APIClient,
  isAPIError: () => isAPIError
});
init_define_LANGS();

// ../misskey-js/built/autogen/apiClientJSDoc.js
init_define_LANGS();

// ../misskey-js/built/autogen/endpoint.js
init_define_LANGS();
var endpointReqTypes = {
  "drive/files/create": "multipart/form-data"
};

// ../misskey-js/built/api.js
var MK_API_ERROR = Symbol();
function isAPIError(reason) {
  return reason[MK_API_ERROR] === true;
}
var APIClient = class {
  origin;
  credential;
  fetch;
  constructor(opts) {
    this.origin = opts.origin;
    this.credential = opts.credential;
    this.fetch = opts.fetch ?? ((...args) => fetch(...args));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assertIsRecord(obj) {
    return obj !== null && typeof obj === "object" && !Array.isArray(obj);
  }
  assertSpecialEpReqType(ep) {
    return ep in endpointReqTypes;
  }
  request(endpoint, params = {}, credential) {
    return new Promise((resolve, reject) => {
      let mediaType = "application/json";
      if (this.assertSpecialEpReqType(endpoint) && endpointReqTypes[endpoint] != null) {
        mediaType = endpointReqTypes[endpoint];
      }
      let payload = "{}";
      if (mediaType === "application/json") {
        payload = JSON.stringify({
          ...params,
          i: credential !== void 0 ? credential : this.credential
        });
      } else if (mediaType === "multipart/form-data") {
        payload = new FormData();
        const i = credential !== void 0 ? credential : this.credential;
        if (i != null) {
          payload.append("i", i);
        }
        if (this.assertIsRecord(params)) {
          for (const key in params) {
            const value = params[key];
            if (value == null) continue;
            if (value instanceof File || value instanceof Blob) {
              payload.append(key, value);
            } else if (typeof value === "object") {
              payload.append(key, JSON.stringify(value));
            } else {
              payload.append(key, value);
            }
          }
        }
      }
      this.fetch(`${this.origin}/api/${endpoint}`, {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": mediaType
        },
        credentials: "omit",
        cache: "no-cache"
      }).then(async (res) => {
        const body = res.status === 204 ? null : await res.json();
        if (res.status === 200 || res.status === 204) {
          resolve(body);
        } else {
          reject({
            [MK_API_ERROR]: true,
            ...body.error
          });
        }
      }).catch(reject);
    });
  }
};

// ../misskey-js/built/entities.js
init_define_LANGS();

// ../misskey-js/built/autogen/entities.js
init_define_LANGS();

// ../misskey-js/built/autogen/models.js
init_define_LANGS();

// ../misskey-js/built/acct.js
var acct_exports = {};
__export(acct_exports, {
  parse: () => parse,
  toString: () => toString
});
init_define_LANGS();
function parse(_acct) {
  let acct = _acct;
  if (acct.startsWith("@")) acct = acct.substring(1);
  const split = acct.split("@", 2);
  return { username: split[0], host: split[1] || null };
}
function toString(acct) {
  return acct.host == null ? acct.username : `${acct.username}@${acct.host}`;
}

// ../misskey-js/built/note.js
init_define_LANGS();

// ../misskey-js/built/nyaize.js
init_define_LANGS();

// src/scripts/create-notification.ts
init_define_LANGS();

// src/scripts/twemoji-base.ts
init_define_LANGS();
function char2fileName(char) {
  let codes = Array.from(char).map((x) => x.codePointAt(0)?.toString(16)).filter((x) => x !== void 0);
  if (!codes.includes("200d")) codes = codes.filter((x) => x !== "fe0f");
  codes = codes.filter((x) => x.length !== 0);
  return codes.join("-");
}

// src/scripts/operations.ts
init_define_LANGS();

// src/scripts/get-account-from-id.ts
init_define_LANGS();
async function getAccountFromId(id) {
  const accounts = await get("accounts");
  if (!accounts) {
    console.log("Accounts are not recorded");
    return;
  }
  return accounts.find((e) => e.id === id);
}

// src/scripts/login-id.ts
init_define_LANGS();
function getUrlWithLoginId(url, loginId) {
  const u = new URL(url, origin);
  u.searchParams.set("loginId", loginId);
  return u.toString();
}

// src/scripts/operations.ts
var cli = new api_exports.APIClient({ origin, fetch: (...args) => fetch(...args) });
async function api(endpoint, userId, params) {
  let account;
  if (userId) {
    account = await getAccountFromId(userId);
    if (!account) return;
  }
  return cli.request(endpoint, params, account?.token);
}
var readBlockingStatus = /* @__PURE__ */ new Map();
function sendMarkAllAsRead(userId) {
  if (readBlockingStatus.get(userId)) return Promise.resolve();
  readBlockingStatus.set(userId, true);
  return new Promise((resolve) => {
    setTimeout(() => {
      readBlockingStatus.set(userId, false);
      api("notifications/mark-all-as-read", userId).then(resolve, resolve);
    }, 1e3);
  });
}
function openUser(acct, loginId) {
  return openClient("push", `/@${acct}`, loginId, { acct });
}
function openNote(noteId, loginId) {
  return openClient("push", `/notes/${noteId}`, loginId, { noteId });
}
function openAntenna(antennaId, loginId) {
  return openClient("push", `/timeline/antenna/${antennaId}`, loginId, { antennaId });
}
async function openPost(options, loginId) {
  const url = "/share";
  const query = new URLSearchParams();
  if (options.initialText) query.set("text", options.initialText);
  if (options.reply) query.set("replyId", options.reply.id);
  if (options.renote) query.set("renoteId", options.renote.id);
  return openClient("post", `${url}?${query}`, loginId, { options });
}
async function openClient(order, url, loginId, query = {}) {
  const client = await findClient();
  if (client) {
    client.postMessage({ type: "order", ...query, order, loginId, url });
    return client;
  }
  return globalThis.clients.openWindow(loginId ? getUrlWithLoginId(url, loginId) : url);
}
async function findClient() {
  const clients = await globalThis.clients.matchAll({
    type: "window"
  });
  return clients.find((c) => !new URL(c.url).searchParams.has("zen")) ?? null;
}

// src/scripts/lang.ts
init_define_LANGS();

// ../frontend-shared/js/i18n.ts
init_define_LANGS();
var I18n = class {
  constructor(locale, devMode = false) {
    this.locale = locale;
    this.devMode = devMode;
    this.t = this.t.bind(this);
  }
  tsxCache;
  devMode;
  get ts() {
    if (this.devMode) {
      class Handler {
        get(target, p) {
          const value = target[p];
          if (typeof value === "object") {
            return new Proxy(value, new Handler());
          }
          if (typeof value === "string") {
            const parameters = Array.from(value.matchAll(/\{(\w+)\}/g), ([, parameter]) => parameter);
            if (parameters.length) {
              console.error(`Missing locale parameters: ${parameters.join(", ")} at ${String(p)}`);
            }
            return value;
          }
          console.error(`Unexpected locale key: ${String(p)}`);
          return p;
        }
      }
      return new Proxy(this.locale, new Handler());
    }
    return this.locale;
  }
  get tsx() {
    if (this.devMode) {
      if (this.tsxCache) {
        return this.tsxCache;
      }
      class Handler {
        get(target, p) {
          const value = target[p];
          if (typeof value === "object") {
            return new Proxy(value, new Handler());
          }
          if (typeof value === "string") {
            const quasis = [];
            const expressions = [];
            let cursor = 0;
            while (~cursor) {
              const start = value.indexOf("{", cursor);
              if (!~start) {
                quasis.push(value.slice(cursor));
                break;
              }
              quasis.push(value.slice(cursor, start));
              const end = value.indexOf("}", start);
              expressions.push(value.slice(start + 1, end));
              cursor = end + 1;
            }
            if (!expressions.length) {
              console.error(`Unexpected locale key: ${String(p)}`);
              return () => value;
            }
            return (arg) => {
              let str = quasis[0];
              for (let i = 0; i < expressions.length; i++) {
                if (!Object.hasOwn(arg, expressions[i])) {
                  console.error(`Missing locale parameters: ${expressions[i]} at ${String(p)}`);
                }
                str += arg[expressions[i]] + quasis[i + 1];
              }
              return str;
            };
          }
          console.error(`Unexpected locale key: ${String(p)}`);
          return p;
        }
      }
      return this.tsxCache = new Proxy(this.locale, new Handler());
    }
    if (this.tsxCache) {
      return this.tsxCache;
    }
    function build(target) {
      const result = {};
      for (const k in target) {
        if (!Object.hasOwn(target, k)) {
          continue;
        }
        const value = target[k];
        if (typeof value === "object") {
          result[k] = build(value);
        } else if (typeof value === "string") {
          const quasis = [];
          const expressions = [];
          let cursor = 0;
          while (~cursor) {
            const start = value.indexOf("{", cursor);
            if (!~start) {
              quasis.push(value.slice(cursor));
              break;
            }
            quasis.push(value.slice(cursor, start));
            const end = value.indexOf("}", start);
            expressions.push(value.slice(start + 1, end));
            cursor = end + 1;
          }
          if (!expressions.length) {
            continue;
          }
          result[k] = (arg) => {
            let str = quasis[0];
            for (let i = 0; i < expressions.length; i++) {
              str += arg[expressions[i]] + quasis[i + 1];
            }
            return str;
          };
        }
      }
      return result;
    }
    return this.tsxCache = build(this.locale);
  }
  t(key, args) {
    let str = this.locale;
    for (const k of key.split(".")) {
      str = str[k];
      if (this.devMode) {
        if (typeof str === "undefined") {
          console.error(`Unexpected locale key: ${key}`);
          return key;
        }
      }
    }
    if (args) {
      if (this.devMode) {
        const missing = Array.from(str.matchAll(/\{(\w+)\}/g), ([, parameter]) => parameter).filter((parameter) => !Object.hasOwn(args, parameter));
        if (missing.length) {
          console.error(`Missing locale parameters: ${missing.join(", ")} at ${key}`);
        }
      }
      for (const [k, v] of Object.entries(args)) {
        const search = `{${k}}`;
        if (this.devMode) {
          if (!str.includes(search)) {
            console.error(`Unexpected locale parameter: ${k} at ${key}`);
          }
        }
        str = str.replace(search, v.toString());
      }
    }
    return str;
  }
};

// src/scripts/lang.ts
var SwLang = class {
  cacheName = `mk-cache-${"qX0DaL0BqPpjNDya_KUE8w"}`;
  lang = get("lang").then(async (prelang) => {
    if (!prelang) return "en-US";
    return prelang;
  });
  setLang(newLang) {
    this.lang = Promise.resolve(newLang);
    set("lang", newLang);
    return this.fetchLocale();
  }
  i18n = null;
  fetchLocale() {
    return this.i18n = this._fetch();
  }
  async _fetch() {
    const localeUrl = `/assets/locales/${await this.lang}.${"qX0DaL0BqPpjNDya_KUE8w"}.json`;
    let localeRes = await caches.match(localeUrl);
    if (!localeRes || true) {
      localeRes = await fetch(localeUrl);
      const clone = localeRes.clone();
      if (!clone.clone().ok) throw new Error("locale fetching error");
      caches.open(this.cacheName).then((cache) => cache.put(localeUrl, clone));
    }
    return new I18n(await localeRes.json());
  }
};
var swLang = new SwLang();

// src/scripts/get-user-name.ts
init_define_LANGS();
function getUserName(user) {
  return user.name === "" ? user.username : user.name ?? user.username;
}

// src/scripts/create-notification.ts
var closeNotificationsByTags = async (tags) => {
  for (const n of (await Promise.all(tags.map((tag) => globalThis.registration.getNotifications({ tag })))).flat()) {
    n.close();
  }
};
var iconUrl = (name) => `/static-assets/tabler-badges/${name}.png`;
async function createNotification(data) {
  const n = await composeNotification(data);
  if (n) {
    return globalThis.registration.showNotification(...n);
  } else {
    console.error("Could not compose notification", data);
    return createEmptyNotification();
  }
}
async function composeNotification(data) {
  const i18n = await (swLang.i18n ?? swLang.fetchLocale());
  switch (data.type) {
    /*
    case 'driveFileCreated': // TODO (Server Side)
    	return [i18n.ts._notification.fileUploaded, {
    		body: body.name,
    		icon: body.url,
    		data
    	}];
    */
    case "notification":
      switch (data.body.type) {
        case "follow": {
          const account = await getAccountFromId(data.userId);
          if (!account) return null;
          const userDetail = await cli.request("users/show", { userId: data.body.userId }, account.token);
          return [i18n.ts._notification.youWereFollowed, {
            body: getUserName(data.body.user),
            icon: data.body.user.avatarUrl ?? void 0,
            badge: iconUrl("user-plus"),
            data,
            actions: userDetail.isFollowing ? [] : [
              {
                action: "follow",
                title: i18n.ts._notification._actions.followBack
              }
            ]
          }];
        }
        case "mention":
          return [i18n.tsx._notification.youGotMention({ name: getUserName(data.body.user) }), {
            body: data.body.note.text ?? "",
            icon: data.body.user.avatarUrl ?? void 0,
            badge: iconUrl("at"),
            data,
            actions: [
              {
                action: "reply",
                title: i18n.ts._notification._actions.reply
              }
            ]
          }];
        case "reply":
          return [i18n.tsx._notification.youGotReply({ name: getUserName(data.body.user) }), {
            body: data.body.note.text ?? "",
            icon: data.body.user.avatarUrl ?? void 0,
            badge: iconUrl("arrow-back-up"),
            data,
            actions: [
              {
                action: "reply",
                title: i18n.ts._notification._actions.reply
              }
            ]
          }];
        case "renote":
          return [i18n.tsx._notification.youRenoted({ name: getUserName(data.body.user) }), {
            body: data.body.note.text ?? "",
            icon: data.body.user.avatarUrl ?? void 0,
            badge: iconUrl("repeat"),
            data,
            actions: [
              {
                action: "showUser",
                title: getUserName(data.body.user)
              }
            ]
          }];
        case "quote":
          return [i18n.tsx._notification.youGotQuote({ name: getUserName(data.body.user) }), {
            body: data.body.note.text ?? "",
            icon: data.body.user.avatarUrl ?? void 0,
            badge: iconUrl("quote"),
            data,
            actions: [
              {
                action: "reply",
                title: i18n.ts._notification._actions.reply
              },
              ...data.body.note.visibility === "public" || data.body.note.visibility === "home" ? [
                {
                  action: "renote",
                  title: i18n.ts._notification._actions.renote
                }
              ] : []
            ]
          }];
        case "note":
          return [i18n.ts._notification.newNote + ": " + getUserName(data.body.user), {
            body: data.body.note.text ?? "",
            icon: data.body.user.avatarUrl ?? void 0,
            data
          }];
        case "reaction": {
          let reaction = data.body.reaction;
          let badge;
          if (reaction.startsWith(":")) {
            const name = reaction.substring(1, reaction.length - 1);
            const badgeUrl = new URL(`/emoji/${name}.webp`, origin);
            badgeUrl.searchParams.set("badge", "1");
            badge = badgeUrl.href;
            reaction = name.split("@")[0];
          } else {
            badge = `/twemoji-badge/${char2fileName(reaction)}.png`;
          }
          if (await fetch(badge).then((res) => res.status !== 200).catch(() => true)) {
            badge = iconUrl("plus");
          }
          const tag = `reaction:${data.body.note.id}`;
          return [`${reaction} ${getUserName(data.body.user)}`, {
            body: data.body.note.text ?? "",
            icon: data.body.user.avatarUrl ?? void 0,
            tag,
            badge,
            data,
            actions: [
              {
                action: "showUser",
                title: getUserName(data.body.user)
              }
            ]
          }];
        }
        case "receiveFollowRequest":
          return [i18n.ts._notification.youReceivedFollowRequest, {
            body: getUserName(data.body.user),
            icon: data.body.user.avatarUrl ?? void 0,
            badge: iconUrl("user-plus"),
            data,
            actions: [
              {
                action: "accept",
                title: i18n.ts.accept
              },
              {
                action: "reject",
                title: i18n.ts.reject
              }
            ]
          }];
        case "followRequestAccepted":
          return [i18n.ts._notification.yourFollowRequestAccepted, {
            body: getUserName(data.body.user),
            icon: data.body.user.avatarUrl ?? void 0,
            badge: iconUrl("circle-check"),
            data
          }];
        case "achievementEarned":
          return [i18n.ts._notification.achievementEarned, {
            body: i18n.ts._achievements._types[`_${data.body.achievement}`].title,
            badge: iconUrl("medal"),
            data,
            tag: `achievement:${data.body.achievement}`
          }];
        case "exportCompleted": {
          const entityName = {
            antenna: i18n.ts.antennas,
            blocking: i18n.ts.blockedUsers,
            clip: i18n.ts.clips,
            customEmoji: i18n.ts.customEmojis,
            favorite: i18n.ts.favorites,
            following: i18n.ts.following,
            muting: i18n.ts.mutedUsers,
            note: i18n.ts.notes,
            userList: i18n.ts.lists
          };
          return [i18n.tsx._notification.exportOfXCompleted({ x: entityName[data.body.exportedEntity] }), {
            badge: iconUrl("circle-check"),
            data
          }];
        }
        case "pollEnded":
          return [i18n.ts._notification.pollEnded, {
            body: data.body.note.text ?? "",
            badge: iconUrl("chart-arrows"),
            data
          }];
        case "app":
          return [data.body.header ?? data.body.body, {
            body: data.body.header ? data.body.body : "",
            icon: data.body.icon ?? void 0,
            data
          }];
        case "test":
          return [i18n.ts._notification.testNotification, {
            body: i18n.ts._notification.notificationWillBeDisplayedLikeThis,
            badge: iconUrl("bell"),
            data
          }];
        case "edited":
          return [i18n.ts._notification.edited, {
            body: data.body.note.text ?? "",
            icon: data.body.user.avatarUrl ?? void 0,
            badge: iconUrl("messages"),
            data
          }];
        default:
          return null;
      }
    case "unreadAntennaNote":
      return [i18n.tsx._notification.unreadAntennaNote({ name: data.body.antenna.name }), {
        body: `${getUserName(data.body.note.user)}: ${data.body.note.text ?? ""}`,
        icon: data.body.note.user.avatarUrl ?? void 0,
        badge: iconUrl("antenna"),
        tag: `antenna:${data.body.antenna.id}`,
        data,
        renotify: true
      }];
    default:
      return null;
  }
}
async function createEmptyNotification() {
  return new Promise(async (res) => {
    const i18n = await (swLang.i18n ?? swLang.fetchLocale());
    await globalThis.registration.showNotification(
      new URL(origin).host,
      {
        body: `Sharkey v${"2024.9.3"}`,
        silent: true,
        badge: iconUrl("null"),
        tag: "read_notification",
        actions: [
          {
            action: "markAllAsRead",
            title: i18n.ts.markAllAsRead
          },
          {
            action: "settings",
            title: i18n.ts.notificationSettings
          }
        ],
        data: {}
      }
    );
    setTimeout(async () => {
      try {
        await closeNotificationsByTags(["user_visible_auto_notification"]);
      } finally {
        res();
      }
    }, 1e3);
  });
}

// src/sw.ts
globalThis.addEventListener("install", () => {
});
globalThis.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.filter((v) => v !== swLang.cacheName).map((name) => caches.delete(name))
    )).then(() => globalThis.clients.claim())
  );
});
async function offlineContentHTML() {
  const i18n = await (swLang.i18n ?? swLang.fetchLocale());
  const messages = {
    title: i18n.ts?._offlineScreen.title ?? "Offline - Could not connect to server",
    header: i18n.ts?._offlineScreen.header ?? "Could not connect to server",
    reload: i18n.ts?.reload ?? "Reload"
  };
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><title>${messages.title}</title><style>body{background-color:#0c1210;color:#dee7e4;font-family:Hiragino Maru Gothic Pro,BIZ UDGothic,Roboto,HelveticaNeue,Arial,sans-serif;line-height:1.35;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;box-sizing:border-box}.icon{max-width:120px;width:100%;height:auto;margin-bottom:20px;}.message{text-align:center;font-size:20px;font-weight:700;margin-bottom:20px}.version{text-align:center;font-size:90%;margin-bottom:20px}button{padding:7px 14px;min-width:100px;font-weight:700;font-family:Hiragino Maru Gothic Pro,BIZ UDGothic,Roboto,HelveticaNeue,Arial,sans-serif;line-height:1.35;border-radius:99rem;background-color:#b4e900;color:#192320;border:none;cursor:pointer;-webkit-tap-highlight-color:transparent}button:hover{background-color:#c6ff03}</style></head><body><svg class="icon"fill="none"height="24"stroke="currentColor"stroke-linecap="round"stroke-linejoin="round"stroke-width="2"viewBox="0 0 24 24"width="24"xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z"fill="none"stroke="none"/><path d="M9.58 5.548c.24 -.11 .492 -.207 .752 -.286c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 .957 -.383 1.824 -1.003 2.454m-2.997 1.033h-11.343c-2.572 -.004 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.13 -.582 .37 -1.128 .7 -1.62"/><path d="M3 3l18 18"/></svg><div class="message">${messages.header}</div><div class="version">v${"2024.9.3"}</div><button onclick="reloadPage()">${messages.reload}</button><script>function reloadPage(){location.reload(!0)}<\/script></body></html>`;
}
globalThis.addEventListener("fetch", (ev) => {
  let isHTMLRequest = false;
  if (ev.request.headers.get("sec-fetch-dest") === "document") {
    isHTMLRequest = true;
  } else if (ev.request.headers.get("accept")?.includes("/html")) {
    isHTMLRequest = true;
  } else if (ev.request.url.endsWith("/")) {
    isHTMLRequest = true;
  }
  if (!isHTMLRequest) return;
  ev.respondWith(
    fetch(ev.request).catch(async () => {
      const html = await offlineContentHTML();
      return new Response(html, {
        status: 200,
        headers: {
          "content-type": "text/html"
        }
      });
    })
  );
});
globalThis.addEventListener("push", (ev) => {
  ev.waitUntil(globalThis.clients.matchAll({
    includeUncontrolled: true,
    type: "window"
  }).then(async () => {
    const data = ev.data?.json();
    switch (data.type) {
      // case 'driveFileCreated':
      case "notification":
      case "unreadAntennaNote":
        if (Date.now() - data.dateTime > 1e3 * 60 * 60 * 24) break;
        return createNotification(data);
      case "readAllNotifications":
        await globalThis.registration.getNotifications().then((notifications) => notifications.forEach((n) => n.tag !== "read_notification" && n.close()));
        break;
    }
    await createEmptyNotification();
    return;
  }));
});
globalThis.addEventListener("notificationclick", (ev) => {
  ev.waitUntil((async () => {
    if (true) {
      console.log("notificationclick", ev.action, ev.notification.data);
    }
    const { action, notification } = ev;
    const data = notification.data ?? {};
    const { userId: loginId } = data;
    let client = null;
    switch (data.type) {
      case "notification":
        switch (action) {
          case "follow":
            if ("userId" in data.body) await api("following/create", loginId, { userId: data.body.userId });
            break;
          case "showUser":
            if ("user" in data.body) client = await openUser(acct_exports.toString(data.body.user), loginId);
            break;
          case "reply":
            if ("note" in data.body) client = await openPost({ reply: data.body.note }, loginId);
            break;
          case "renote":
            if ("note" in data.body) await api("notes/create", loginId, { renoteId: data.body.note.id });
            break;
          case "accept":
            switch (data.body.type) {
              case "receiveFollowRequest":
                await api("following/requests/accept", loginId, { userId: data.body.userId });
                break;
            }
            break;
          case "reject":
            switch (data.body.type) {
              case "receiveFollowRequest":
                await api("following/requests/reject", loginId, { userId: data.body.userId });
                break;
            }
            break;
          case "showFollowRequests":
            client = await openClient("push", "/my/follow-requests", loginId);
            break;
          case "edited":
            if ("note" in data.body) client = await openPost({ reply: data.body.note }, loginId);
            break;
          default:
            switch (data.body.type) {
              case "receiveFollowRequest":
                client = await openClient("push", "/my/follow-requests", loginId);
                break;
              case "reaction":
                client = await openNote(data.body.note.id, loginId);
                break;
              default:
                if ("note" in data.body) {
                  client = await openNote(data.body.note.id, loginId);
                } else if ("user" in data.body) {
                  client = await openUser(acct_exports.toString(data.body.user), loginId);
                }
                break;
            }
        }
        break;
      case "unreadAntennaNote":
        client = await openAntenna(data.body.antenna.id, loginId);
        break;
      default:
        switch (action) {
          case "markAllAsRead":
            await globalThis.registration.getNotifications().then((notifications) => notifications.forEach((n) => n.tag !== "read_notification" && n.close()));
            await get("accounts").then((accounts) => {
              return Promise.all((accounts ?? []).map(async (account) => {
                await sendMarkAllAsRead(account.id);
              }));
            });
            break;
          case "settings":
            client = await openClient("push", "/settings/notifications", loginId);
            break;
        }
    }
    if (client) {
      client.focus();
    }
    if (data.type === "notification") {
      await sendMarkAllAsRead(loginId);
    }
    notification.close();
  })());
});
globalThis.addEventListener("notificationclose", (ev) => {
  const data = ev.notification.data;
  ev.waitUntil((async () => {
    if (data.type === "notification") {
      await sendMarkAllAsRead(data.userId);
    }
    return;
  })());
});
globalThis.addEventListener("message", (ev) => {
  ev.waitUntil((async () => {
    switch (ev.data) {
      case "clear":
        await caches.keys().then((cacheNames) => Promise.all(
          cacheNames.map((name) => caches.delete(name))
        ));
        return;
    }
    if (typeof ev.data === "object") {
      const otype = Object.prototype.toString.call(ev.data).slice(8, -1).toLowerCase();
      if (otype === "object") {
        if (ev.data.msg === "initialize") {
          swLang.setLang(ev.data.lang);
        }
      }
    }
  })());
});
/*! Bundled license information:

reconnecting-websocket/dist/reconnecting-websocket-mjs.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** *)
  (*!
   * Reconnecting WebSocket
   * by Pedro Ladaria <pedro.ladaria@gmail.com>
   * https://github.com/pladaria/reconnecting-websocket
   * License MIT
   *)
*/
