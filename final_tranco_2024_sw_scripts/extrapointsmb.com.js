var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function _mergeNamespaces(n, m) {
  for (var i = 0; i < m.length; i++) {
    const e = m[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k in e) {
        if (k !== "default" && !(k in n)) {
          const d = Object.getOwnPropertyDescriptor(e, k);
          if (d) {
            Object.defineProperty(n, k, d.get ? d : {
              enumerable: true,
              get: () => e[k]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
}
const _Logger = class _Logger {
  constructor(o) {
    __publicField(this, "options");
    __publicField(this, "inGroup", false);
    this.options = { ..._Logger.defaultOptions, ...o };
  }
  setLogLevel(o) {
    this.options.logLevel = o;
  }
  setStyles(o) {
    this.options.styles = { ...this.options.styles, ...o };
  }
  print(o, r) {
    const { isProductionEnv: i, styles: e } = this.options;
    if (i)
      return;
    const t = o;
    if ("groupCollapsed" === t && /^((?!chrome|android).*safari)/i.test(navigator.userAgent))
      return void console[t](...r);
    const n = Object.entries(e[o]).map(([o2, r2]) => `${o2}: ${r2}`).join("; "), s = this.inGroup ? [] : [`%c${this.options.prefix}`, n];
    console[t](...s, ...r), "groupCollapsed" === t && (this.inGroup = true), "groupEnd" === t && (this.inGroup = false);
  }
  debug(...o) {
    this.shouldLog("debug") && this.print("debug", o);
  }
  info(...o) {
    this.shouldLog("info") && this.print("info", o);
  }
  log(...o) {
    this.shouldLog("log") && this.print("log", o);
  }
  warn(...o) {
    this.shouldLog("warn") && this.print("warn", o);
  }
  error(...o) {
    this.shouldLog("error") && this.print("error", o);
  }
  groupCollapsed(...o) {
    this.print("groupCollapsed", o);
  }
  groupEnd() {
    this.print("groupEnd", []);
  }
  shouldLog(o) {
    const { logLevel: r } = this.options, i = ["debug", "info", "log", "warn", "error"];
    return i.indexOf(o) >= i.indexOf(r);
  }
};
__publicField(_Logger, "defaultOptions", { prefix: "remix-pwa", styles: { debug: { background: "#7f8c8d", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, info: { background: "#3498db", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, log: { background: "#2ecc71", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, warn: { background: "#f39c12", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, error: { background: "#c0392b", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, groupCollapsed: { background: "#3498db", color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" }, groupEnd: { background: null, color: "white", "border-radius": "0.5em", "font-weight": "bold", padding: "2px 0.5em" } }, logLevel: "debug", isProductionEnv: true });
let Logger = _Logger;
const logger = new Logger();
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        return Reflect.construct(f, arguments, this.constructor);
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
let icon = "";
self.logger = logger;
self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
  event.waitUntil(self.clients.claim());
});
self.addEventListener("message", (event) => {
  const { type, payload } = event.data;
  if (type === "update_icon") {
    icon = payload.icon;
    if (icon && icon.startsWith("/")) {
      icon = `${location.origin}${icon}`;
    }
  }
});
self.addEventListener("push", function(event) {
  var _a, _b;
  const payload = (_a = event.data) == null ? void 0 : _a.json();
  event.waitUntil(
    self.registration.showNotification(`${payload.title}`, {
      body: payload.body,
      icon,
      // @ts-ignore
      image: icon,
      badge: icon,
      data: {
        url: (_b = payload.data) == null ? void 0 : _b.url
      }
    })
  );
});
self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
  event.waitUntil(
    self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(function(windowClients) {
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          client.postMessage({ type: "navigate", url: urlToOpen });
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
const entryWorker = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$1b = Object.getOwnPropertyNames;
var __commonJS$1b = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$1b(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$1b = __commonJS$1b({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$1b = require_worker_runtime$1b();
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$1b
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$1a = Object.getOwnPropertyNames;
var __commonJS$1a = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$1a(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$1a = __commonJS$1a({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$1a = require_worker_runtime$1a();
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$1a
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$19 = Object.getOwnPropertyNames;
var __commonJS$19 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$19(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$19 = __commonJS$19({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$19 = require_worker_runtime$19();
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$19
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$18 = Object.getOwnPropertyNames;
var __commonJS$18 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$18(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$18 = __commonJS$18({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$18 = require_worker_runtime$18();
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$18
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$17 = Object.getOwnPropertyNames;
var __commonJS$17 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$17(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$17 = __commonJS$17({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$17 = require_worker_runtime$17();
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$17
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$16 = Object.getOwnPropertyNames;
var __commonJS$16 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$16(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$16 = __commonJS$16({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$16 = require_worker_runtime$16();
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$16
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$15 = Object.getOwnPropertyNames;
var __commonJS$15 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$15(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$15 = __commonJS$15({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$15 = require_worker_runtime$15();
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$15
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$14 = Object.getOwnPropertyNames;
var __commonJS$14 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$14(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$14 = __commonJS$14({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$14 = require_worker_runtime$14();
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$14
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$13 = Object.getOwnPropertyNames;
var __commonJS$13 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$13(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$13 = __commonJS$13({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$13 = require_worker_runtime$13();
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$13
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$12 = Object.getOwnPropertyNames;
var __commonJS$12 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$12(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$12 = __commonJS$12({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$12 = require_worker_runtime$12();
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$12
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$11 = Object.getOwnPropertyNames;
var __commonJS$11 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$11(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$11 = __commonJS$11({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$11 = require_worker_runtime$11();
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$11
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$10 = Object.getOwnPropertyNames;
var __commonJS$10 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$10(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$10 = __commonJS$10({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$10 = require_worker_runtime$10();
const route11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$10
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$$ = Object.getOwnPropertyNames;
var __commonJS$$ = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$$(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$$ = __commonJS$$({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$$ = require_worker_runtime$$();
const route12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$$
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$_ = Object.getOwnPropertyNames;
var __commonJS$_ = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$_(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$_ = __commonJS$_({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$_ = require_worker_runtime$_();
const route13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$_
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$Z = Object.getOwnPropertyNames;
var __commonJS$Z = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$Z(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$Z = __commonJS$Z({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$Z = require_worker_runtime$Z();
const route14 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$Z
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$Y = Object.getOwnPropertyNames;
var __commonJS$Y = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$Y(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$Y = __commonJS$Y({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$Y = require_worker_runtime$Y();
const route15 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$Y
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$X = Object.getOwnPropertyNames;
var __commonJS$X = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$X(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$X = __commonJS$X({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$X = require_worker_runtime$X();
const route16 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$X
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$W = Object.getOwnPropertyNames;
var __commonJS$W = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$W(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$W = __commonJS$W({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$W = require_worker_runtime$W();
const route17 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$W
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$V = Object.getOwnPropertyNames;
var __commonJS$V = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$V(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$V = __commonJS$V({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$V = require_worker_runtime$V();
const route18 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$V
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$U = Object.getOwnPropertyNames;
var __commonJS$U = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$U(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$U = __commonJS$U({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$U = require_worker_runtime$U();
const route19 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$U
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$T = Object.getOwnPropertyNames;
var __commonJS$T = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$T(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$T = __commonJS$T({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$T = require_worker_runtime$T();
const route20 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$T
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$S = Object.getOwnPropertyNames;
var __commonJS$S = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$S(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$S = __commonJS$S({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$S = require_worker_runtime$S();
const route21 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$S
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$R = Object.getOwnPropertyNames;
var __commonJS$R = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$R(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$R = __commonJS$R({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$R = require_worker_runtime$R();
const route22 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$R
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$Q = Object.getOwnPropertyNames;
var __commonJS$Q = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$Q(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$Q = __commonJS$Q({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$Q = require_worker_runtime$Q();
const route23 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$Q
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$P = Object.getOwnPropertyNames;
var __commonJS$P = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$P(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$P = __commonJS$P({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$P = require_worker_runtime$P();
const route24 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$P
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$O = Object.getOwnPropertyNames;
var __commonJS$O = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$O(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$O = __commonJS$O({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$O = require_worker_runtime$O();
const route25 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$O
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$N = Object.getOwnPropertyNames;
var __commonJS$N = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$N(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$N = __commonJS$N({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$N = require_worker_runtime$N();
const route26 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$N
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$M = Object.getOwnPropertyNames;
var __commonJS$M = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$M(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$M = __commonJS$M({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$M = require_worker_runtime$M();
const route27 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$M
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$L = Object.getOwnPropertyNames;
var __commonJS$L = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$L(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$L = __commonJS$L({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$L = require_worker_runtime$L();
const route28 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$L
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$K = Object.getOwnPropertyNames;
var __commonJS$K = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$K(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$K = __commonJS$K({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$K = require_worker_runtime$K();
const route29 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$K
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$J = Object.getOwnPropertyNames;
var __commonJS$J = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$J(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$J = __commonJS$J({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$J = require_worker_runtime$J();
const route30 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$J
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$I = Object.getOwnPropertyNames;
var __commonJS$I = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$I(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$I = __commonJS$I({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$I = require_worker_runtime$I();
const route31 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$I
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$H = Object.getOwnPropertyNames;
var __commonJS$H = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$H(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$H = __commonJS$H({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$H = require_worker_runtime$H();
const route32 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$H
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$G = Object.getOwnPropertyNames;
var __commonJS$G = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$G(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$G = __commonJS$G({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$G = require_worker_runtime$G();
const route33 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$G
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$F = Object.getOwnPropertyNames;
var __commonJS$F = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$F(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$F = __commonJS$F({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$F = require_worker_runtime$F();
const route34 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$F
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$E = Object.getOwnPropertyNames;
var __commonJS$E = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$E(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$E = __commonJS$E({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$E = require_worker_runtime$E();
const route35 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$E
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$D = Object.getOwnPropertyNames;
var __commonJS$D = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$D(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$D = __commonJS$D({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$D = require_worker_runtime$D();
const route36 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$D
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$C = Object.getOwnPropertyNames;
var __commonJS$C = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$C(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$C = __commonJS$C({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$C = require_worker_runtime$C();
const route37 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$C
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$B = Object.getOwnPropertyNames;
var __commonJS$B = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$B(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$B = __commonJS$B({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$B = require_worker_runtime$B();
const route38 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$B
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$A = Object.getOwnPropertyNames;
var __commonJS$A = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$A(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$A = __commonJS$A({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$A = require_worker_runtime$A();
const route39 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$A
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$z = Object.getOwnPropertyNames;
var __commonJS$z = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$z(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$z = __commonJS$z({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$z = require_worker_runtime$z();
const route40 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$z
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$y = Object.getOwnPropertyNames;
var __commonJS$y = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$y(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$y = __commonJS$y({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$y = require_worker_runtime$y();
const route41 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$y
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$x = Object.getOwnPropertyNames;
var __commonJS$x = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$x(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$x = __commonJS$x({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$x = require_worker_runtime$x();
const route42 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$x
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$w = Object.getOwnPropertyNames;
var __commonJS$w = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$w(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$w = __commonJS$w({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$w = require_worker_runtime$w();
const route43 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$w
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$v = Object.getOwnPropertyNames;
var __commonJS$v = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$v(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$v = __commonJS$v({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$v = require_worker_runtime$v();
const route44 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$v
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$u = Object.getOwnPropertyNames;
var __commonJS$u = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$u(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$u = __commonJS$u({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$u = require_worker_runtime$u();
const route45 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$u
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$t = Object.getOwnPropertyNames;
var __commonJS$t = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$t(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$t = __commonJS$t({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$t = require_worker_runtime$t();
const route46 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$t
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$s = Object.getOwnPropertyNames;
var __commonJS$s = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$s(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$s = __commonJS$s({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$s = require_worker_runtime$s();
const route47 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$s
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$r = Object.getOwnPropertyNames;
var __commonJS$r = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$r(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$r = __commonJS$r({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$r = require_worker_runtime$r();
const route48 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$r
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$q = Object.getOwnPropertyNames;
var __commonJS$q = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$q(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$q = __commonJS$q({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$q = require_worker_runtime$q();
const route49 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$q
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$p = Object.getOwnPropertyNames;
var __commonJS$p = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$p(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$p = __commonJS$p({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$p = require_worker_runtime$p();
const route50 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$p
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$o = Object.getOwnPropertyNames;
var __commonJS$o = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$o(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$o = __commonJS$o({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$o = require_worker_runtime$o();
const route51 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$o
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$n = Object.getOwnPropertyNames;
var __commonJS$n = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$n(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$n = __commonJS$n({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$n = require_worker_runtime$n();
const route52 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$n
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$m = Object.getOwnPropertyNames;
var __commonJS$m = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$m(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$m = __commonJS$m({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$m = require_worker_runtime$m();
const route53 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$m
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$l = Object.getOwnPropertyNames;
var __commonJS$l = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$l(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$l = __commonJS$l({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$l = require_worker_runtime$l();
const route54 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$l
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$k = Object.getOwnPropertyNames;
var __commonJS$k = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$k(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$k = __commonJS$k({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$k = require_worker_runtime$k();
const route55 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$k
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$j = Object.getOwnPropertyNames;
var __commonJS$j = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$j(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$j = __commonJS$j({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$j = require_worker_runtime$j();
const route56 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$j
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$i = Object.getOwnPropertyNames;
var __commonJS$i = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$i(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$i = __commonJS$i({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$i = require_worker_runtime$i();
const route57 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$i
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$h = Object.getOwnPropertyNames;
var __commonJS$h = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$h(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$h = __commonJS$h({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$h = require_worker_runtime$h();
const route58 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$h
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$g = Object.getOwnPropertyNames;
var __commonJS$g = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$g(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$g = __commonJS$g({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$g = require_worker_runtime$g();
const route59 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$g
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$f = Object.getOwnPropertyNames;
var __commonJS$f = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$f(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$f = __commonJS$f({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$f = require_worker_runtime$f();
const route60 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$f
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$e = Object.getOwnPropertyNames;
var __commonJS$e = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$e(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$e = __commonJS$e({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$e = require_worker_runtime$e();
const route61 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$e
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$d = Object.getOwnPropertyNames;
var __commonJS$d = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$d(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$d = __commonJS$d({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$d = require_worker_runtime$d();
const route62 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$d
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$c = Object.getOwnPropertyNames;
var __commonJS$c = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$c(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$c = __commonJS$c({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$c = require_worker_runtime$c();
const route63 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$c
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$b = Object.getOwnPropertyNames;
var __commonJS$b = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$b(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$b = __commonJS$b({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$b = require_worker_runtime$b();
const route64 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$b
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$a = Object.getOwnPropertyNames;
var __commonJS$a = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$a(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$a = __commonJS$a({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$a = require_worker_runtime$a();
const route65 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$a
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$9 = Object.getOwnPropertyNames;
var __commonJS$9 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$9(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$9 = __commonJS$9({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$9 = require_worker_runtime$9();
const route66 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$9
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$8 = Object.getOwnPropertyNames;
var __commonJS$8 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$8(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$8 = __commonJS$8({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$8 = require_worker_runtime$8();
const route67 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$8
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$7 = Object.getOwnPropertyNames;
var __commonJS$7 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$7(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$7 = __commonJS$7({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$7 = require_worker_runtime$7();
const route68 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$7
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$6 = Object.getOwnPropertyNames;
var __commonJS$6 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$6(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$6 = __commonJS$6({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$6 = require_worker_runtime$6();
const route69 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$6
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$5 = Object.getOwnPropertyNames;
var __commonJS$5 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$5(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$5 = __commonJS$5({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$5 = require_worker_runtime$5();
const route70 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$5
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$4 = Object.getOwnPropertyNames;
var __commonJS$4 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$4(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$4 = __commonJS$4({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$4 = require_worker_runtime$4();
const route71 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$4
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$3 = Object.getOwnPropertyNames;
var __commonJS$3 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$3(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$3 = __commonJS$3({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$3 = require_worker_runtime$3();
const route72 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$3
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$2 = Object.getOwnPropertyNames;
var __commonJS$2 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$2 = __commonJS$2({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$2 = require_worker_runtime$2();
const route73 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$2
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __commonJS$1 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames$1(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime$1 = __commonJS$1({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default$1 = require_worker_runtime$1();
const route74 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default$1
}, Symbol.toStringTag, { value: "Module" }));
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_worker_runtime = __commonJS({
  "@remix-pwa/worker-runtime"(exports, module) {
    module.exports = {};
  }
});
var worker_runtime_default = require_worker_runtime();
const route75 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: worker_runtime_default
}, Symbol.toStringTag, { value: "Module" }));
const assets = [
  "/assets/AppGlobals-2Br-8bZs.js",
  "/assets/ArrowLeftIcon-Dz9QYxn0.js",
  "/assets/AuthorIcons-C-IL0ULj.js",
  "/assets/Badge-sybBVO7s.js",
  "/assets/CheckIcon-681VH8qr.js",
  "/assets/CheckIcon-8bI9teWR.js",
  "/assets/ChevronDownIcon-CCywpT3m.js",
  "/assets/ChevronDownIcon-CJqY4lqn.js",
  "/assets/ChevronRightIcon-Dsmk2epM.js",
  "/assets/CreateAction-Dl0JjCOR.js",
  "/assets/Downgrade-DcPXqdkB.js",
  "/assets/FormSubmissionMessage-CWHpd-Mt.js",
  "/assets/FreeGatedContent-D-EWr0IZ.js",
  "/assets/HeroChatIcon-DZxH_rr3.js",
  "/assets/Image-ycA_AFLr.js",
  "/assets/Input-HUlJEznR.js",
  "/assets/LockClosedIcon-BluoCUMI.js",
  "/assets/LoginWithPasswordAction-Bs2J-Rbj.js",
  "/assets/MagnifyingGlassIcon-DyQ3eS5L.js",
  "/assets/NewsFeedPosts-DdpjCSvq.js",
  "/assets/PageProvider-uKxoiNdl.js",
  "/assets/PoweredByBeehiiv-BmLCj73J.js",
  "/assets/RecommendationsForm-DvIM60ie.js",
  "/assets/RedirectToHiddenInput-mUb4yii7.js",
  "/assets/SparklesIcon-DA4hsc2a.js",
  "/assets/StatusInputs-JkVhk_jg.js",
  "/assets/Toggle-CqH9SOb_.js",
  "/assets/TwitterEmbed-BV3-M1Zy.js",
  "/assets/WebThemeContext-DttfuZxo.js",
  "/assets/XMarkIcon-BIfmjQfr.js",
  "/assets/XMarkIcon-Y2tO3Ykg.js",
  "/assets/YoutubeIcon-DSouMQiN.js",
  "/assets/__-CCIXZX45.js",
  "/assets/_authorId-Byi-JrHh.js",
  "/assets/_category-DAJgnsbL.js",
  "/assets/_formId-CzP-SVdT.js",
  "/assets/_page-B6c5UZTu.js",
  "/assets/_slug-D2joXnXn.js",
  "/assets/_subscriber_id-l0sNRNKZ.js",
  "/assets/apple-developer-merchantid-domain-association-l0sNRNKZ.js",
  "/assets/archive-Bh6ZzQhR.js",
  "/assets/billing-CaNJQRnu.js",
  "/assets/billing_summary-l0sNRNKZ.js",
  "/assets/bugs-DVQzBh-s.js",
  "/assets/change_password-l0sNRNKZ.js",
  "/assets/clicks-l0sNRNKZ.js",
  "/assets/comment_like-CBw1aXeE.js",
  "/assets/comment_like-DIeUi235.js",
  "/assets/comment_report-l0sNRNKZ.js",
  "/assets/comments-BpdwE5l3.js",
  "/assets/comments-tgme27EI.js",
  "/assets/components-Oj2xMfGE.js",
  "/assets/context-CxfOs_9L.js",
  "/assets/create-l0sNRNKZ.js",
  "/assets/create_password-In32x35W.js",
  "/assets/dayjs.min-B8CfgAhU.js",
  "/assets/delete_comment-DP2rzg_V.js",
  "/assets/delete_comment-l0sNRNKZ.js",
  "/assets/description-BklOXbF-.js",
  "/assets/dialog-CtpHvvfD.js",
  "/assets/disclosure-OT1gpdxK.js",
  "/assets/downgrade-l0sNRNKZ.js",
  "/assets/entry.client-CuBsnk-1.js",
  "/assets/error-boundary-DIt5FAGK.js",
  "/assets/extended_feedback-l0sNRNKZ.js",
  "/assets/hidden-KuoXmiN5.js",
  "/assets/i18next-BV1g0mjb.js",
  "/assets/index-BFDoivjB.js",
  "/assets/index-B_sqgO5C.js",
  "/assets/index-BbnTzeLf.js",
  "/assets/index-BdpAPpdN.js",
  "/assets/index-BxYGUTX4.js",
  "/assets/index-C-Fm2wxC.js",
  "/assets/index-CCu-G_ty.js",
  "/assets/index-CJ5U-TSD.js",
  "/assets/index-CJHGmWl4.js",
  "/assets/index-CKKqhp3r.js",
  "/assets/index-COqk5b7U.js",
  "/assets/index-CUG6QOFP.js",
  "/assets/index-CbjHQEwM.js",
  "/assets/index-CqJN8iQq.js",
  "/assets/index-D5Hq4kiz.js",
  "/assets/index-D6da9p6-.js",
  "/assets/index-D6u8AziS.js",
  "/assets/index-DFab7GZ0.js",
  "/assets/index-DIU-Hrs1.js",
  "/assets/index-DJXzQCCT.js",
  "/assets/index-DTtuIjz-.js",
  "/assets/index-D_PiYDtJ.js",
  "/assets/index-DcpNk-OI.js",
  "/assets/index-Dj8D441i.js",
  "/assets/index-IxBbnf-Q.js",
  "/assets/index-f_GAeSht.js",
  "/assets/index-pnFxOaac.js",
  "/assets/index-x2da_zcv.js",
  "/assets/jsx-runtime-BjG_zV1W.js",
  "/assets/keyboard-CaEu2o0u.js",
  "/assets/label-CGhICcle.js",
  "/assets/likes-l0sNRNKZ.js",
  "/assets/logger-l0sNRNKZ.js",
  "/assets/login-chBivoba.js",
  "/assets/logout-l0sNRNKZ.js",
  "/assets/manage-B44xJuJw.js",
  "/assets/manifest_.webmanifest_-l0sNRNKZ.js",
  "/assets/notifications-l0sNRNKZ.js",
  "/assets/opt_in-l0sNRNKZ.js",
  "/assets/page_view-l0sNRNKZ.js",
  "/assets/paginated_author_posts-l0sNRNKZ.js",
  "/assets/paginated_comments-l0sNRNKZ.js",
  "/assets/performance-dfU_ZKaW.js",
  "/assets/popover-CV1J-FFp.js",
  "/assets/post_insights-l0sNRNKZ.js",
  "/assets/post_like-B5ctfxzi.js",
  "/assets/post_like-DLL7TKc2.js",
  "/assets/post_subscribe_form-l0sNRNKZ.js",
  "/assets/posts-BGRQc29a.js",
  "/assets/posts_insights-l0sNRNKZ.js",
  "/assets/preferences-rXQaqmyR.js",
  "/assets/profile-l0sNRNKZ.js",
  "/assets/profile_email-l0sNRNKZ.js",
  "/assets/publications-Cg2XCBY8.js",
  "/assets/push-notification-D5j6nUjq.js",
  "/assets/radio-group-CXwlWAgn.js",
  "/assets/recommended_posts-l0sNRNKZ.js",
  "/assets/referrals-DOdrYXj6.js",
  "/assets/relativeTime-tlGPeD3Q.js",
  "/assets/reset_password-ev8R121n.js",
  "/assets/response-l0sNRNKZ.js",
  "/assets/resubscribe-l0sNRNKZ.js",
  "/assets/results-NgMyr-bO.js",
  "/assets/robots_._txt-l0sNRNKZ.js",
  "/assets/root-Da6RWzMx.js",
  "/assets/root-uciXABkM.css",
  "/assets/sitemap_._xml-l0sNRNKZ.js",
  "/assets/status-CkzkzQiU.js",
  "/assets/stripe_premium_session-l0sNRNKZ.js",
  "/assets/stripe_sessions-l0sNRNKZ.js",
  "/assets/subscribe-l0sNRNKZ.js",
  "/assets/subscriptions-Bjqa4xnp.js",
  "/assets/switch-COP21Yl5.js",
  "/assets/test-error-CZIT1Agp.js",
  "/assets/tos--zMBvxgY.js",
  "/assets/transition-y-5XFFuu.js",
  "/assets/unsubscribe-DP2rzg_V.js",
  "/assets/unsubscribe-l0sNRNKZ.js",
  "/assets/unsubscribe._jwt-l0sNRNKZ.js",
  "/assets/update_password-DFLZRvXB.js",
  "/assets/update_subscriber_organization_subscription-l0sNRNKZ.js",
  "/assets/update_subscriber_preference-l0sNRNKZ.js",
  "/assets/update_subscription-l0sNRNKZ.js",
  "/assets/upgrade-DC4yyRI9.js",
  "/assets/use-is-mounted-BaHv16bB.js",
  "/assets/use-root-containers-DmyWFwuo.js",
  "/assets/use-tree-walker-Inv4mdsP.js",
  "/assets/useDebounce-BdWoeQQs.js",
  "/assets/useIsLoggedIn-BbU3-q43.js",
  "/assets/useIsMobile-onEuuMFV.js",
  "/assets/usePublication-D4hvf6u0.js",
  "/assets/useSetLastViewedResource-5hF6Tq25.js",
  "/assets/useSignupRedirects-DpD4LtfX.js",
  "/assets/useToast-DK42uF07.js",
  "/assets/useTranslation-CfKJAmGY.js",
  "/assets/useTypedLoaderData-Bk1_tu68.js",
  "/assets/useWebBuilderCommunicator-DoXoLq6Y.js",
  "/assets/visit_token-l0sNRNKZ.js",
  "/locales/de/common.json",
  "/locales/en/common.json",
  "/locales/fr/common.json",
  "/locales/it/common.json",
  "/locales/es/common.json",
  "/locales/pt/common.json"
];
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route0
  },
  "routes/__loaders/[.]well-known/apple-developer-merchantid-domain-association": {
    id: "routes/__loaders/[.]well-known/apple-developer-merchantid-domain-association",
    parentId: "root",
    path: ".well-known/apple-developer-merchantid-domain-association",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route1
  },
  "routes/__actions/update_subscriber_organization_subscription": {
    id: "routes/__actions/update_subscriber_organization_subscription",
    parentId: "root",
    path: "update_subscriber_organization_subscription",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route2
  },
  "routes/__actions/update_subscriber_preference": {
    id: "routes/__actions/update_subscriber_preference",
    parentId: "root",
    path: "update_subscriber_preference",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route3
  },
  "routes/subscribe/$subscriberId/preferences": {
    id: "routes/subscribe/$subscriberId/preferences",
    parentId: "root",
    path: "subscribe/:subscriberId/preferences",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route4
  },
  "routes/subscribe/$subscriberId/referrals": {
    id: "routes/subscribe/$subscriberId/referrals",
    parentId: "root",
    path: "subscribe/:subscriberId/referrals",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route5
  },
  "routes/__loaders/paginated_author_posts": {
    id: "routes/__loaders/paginated_author_posts",
    parentId: "root",
    path: "paginated_author_posts",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route6
  },
  "routes/__loaders/stripe_premium_session": {
    id: "routes/__loaders/stripe_premium_session",
    parentId: "root",
    path: "stripe_premium_session",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route7
  },
  "routes/__actions/admins/delete_comment": {
    id: "routes/__actions/admins/delete_comment",
    parentId: "root",
    path: "admins/delete_comment",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route8
  },
  "routes/subscribe/$subscriberId/billing": {
    id: "routes/subscribe/$subscriberId/billing",
    parentId: "root",
    path: "subscribe/:subscriberId/billing",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route9
  },
  "routes/__loaders/login/$subscriber_id": {
    id: "routes/__loaders/login/$subscriber_id",
    parentId: "root",
    path: "login/:subscriber_id",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route10
  },
  "routes/subscribe/$subscriberId/manage": {
    id: "routes/subscribe/$subscriberId/manage",
    parentId: "root",
    path: "subscribe/:subscriberId/manage",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route11
  },
  "routes/__actions/admins/comment_like": {
    id: "routes/__actions/admins/comment_like",
    parentId: "root",
    path: "admins/comment_like",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route12
  },
  "routes/__actions/post_subscribe_form": {
    id: "routes/__actions/post_subscribe_form",
    parentId: "root",
    path: "post_subscribe_form",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route13
  },
  "routes/__actions/update_subscription": {
    id: "routes/__actions/update_subscription",
    parentId: "root",
    path: "update_subscription",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route14
  },
  "routes/__loaders/paginated_comments": {
    id: "routes/__loaders/paginated_comments",
    parentId: "root",
    path: "paginated_comments",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route15
  },
  "routes/__actions/extended_feedback": {
    id: "routes/__actions/extended_feedback",
    parentId: "root",
    path: "extended_feedback",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route16
  },
  "routes/__loaders/recommended_posts": {
    id: "routes/__loaders/recommended_posts",
    parentId: "root",
    path: "recommended_posts",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route17
  },
  "routes/__actions/admins/post_like": {
    id: "routes/__actions/admins/post_like",
    parentId: "root",
    path: "admins/post_like",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route18
  },
  "routes/__actions/push/unsubscribe": {
    id: "routes/__actions/push/unsubscribe",
    parentId: "root",
    path: "push/unsubscribe",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route19
  },
  "routes/__actions/unsubscribe.$jwt": {
    id: "routes/__actions/unsubscribe.$jwt",
    parentId: "root",
    path: "unsubscribe/:jwt",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route20
  },
  "routes/__actions/admins/comments": {
    id: "routes/__actions/admins/comments",
    parentId: "root",
    path: "admins/comments",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route21
  },
  "routes/__actions/change_password": {
    id: "routes/__actions/change_password",
    parentId: "root",
    path: "change_password",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route22
  },
  "routes/__loaders/billing_summary": {
    id: "routes/__loaders/billing_summary",
    parentId: "root",
    path: "billing_summary",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route23
  },
  "routes/__loaders/stripe_sessions": {
    id: "routes/__loaders/stripe_sessions",
    parentId: "root",
    path: "stripe_sessions",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route24
  },
  "routes/__actions/comment_report": {
    id: "routes/__actions/comment_report",
    parentId: "root",
    path: "comment_report",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route25
  },
  "routes/__actions/delete_comment": {
    id: "routes/__actions/delete_comment",
    parentId: "root",
    path: "delete_comment",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route26
  },
  "routes/__actions/push/subscribe": {
    id: "routes/__actions/push/subscribe",
    parentId: "root",
    path: "push/subscribe",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route27
  },
  "routes/__loaders/posts_insights": {
    id: "routes/__loaders/posts_insights",
    parentId: "root",
    path: "posts_insights",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route28
  },
  "routes/__actions/profile_email": {
    id: "routes/__actions/profile_email",
    parentId: "root",
    path: "profile_email",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route29
  },
  "routes/__loaders/notifications": {
    id: "routes/__loaders/notifications",
    parentId: "root",
    path: "notifications",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route30
  },
  "routes/__loaders/post_insights": {
    id: "routes/__loaders/post_insights",
    parentId: "root",
    path: "post_insights",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route31
  },
  "routes/__loaders/sitemap[.]xml": {
    id: "routes/__loaders/sitemap[.]xml",
    parentId: "root",
    path: "sitemap.xml",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route32
  },
  "routes/__actions/comment_like": {
    id: "routes/__actions/comment_like",
    parentId: "root",
    path: "comment_like",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route33
  },
  "routes/__loaders/robots[.]txt": {
    id: "routes/__loaders/robots[.]txt",
    parentId: "root",
    path: "robots.txt",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route34
  },
  "routes/manifest[.webmanifest]": {
    id: "routes/manifest[.webmanifest]",
    parentId: "root",
    path: "manifest.webmanifest",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route35
  },
  "routes/polls/$pollId/response": {
    id: "routes/polls/$pollId/response",
    parentId: "root",
    path: "polls/:pollId/response",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route36
  },
  "routes/__actions/resubscribe": {
    id: "routes/__actions/resubscribe",
    parentId: "root",
    path: "resubscribe",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route37
  },
  "routes/__actions/unsubscribe": {
    id: "routes/__actions/unsubscribe",
    parentId: "root",
    path: "unsubscribe",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route38
  },
  "routes/__actions/visit_token": {
    id: "routes/__actions/visit_token",
    parentId: "root",
    path: "visit_token",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route39
  },
  "routes/polls/$pollId/results": {
    id: "routes/polls/$pollId/results",
    parentId: "root",
    path: "polls/:pollId/results",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route40
  },
  "routes/recommendations/index": {
    id: "routes/recommendations/index",
    parentId: "root",
    path: "recommendations",
    index: true,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route41
  },
  "routes/__actions/downgrade": {
    id: "routes/__actions/downgrade",
    parentId: "root",
    path: "downgrade",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route42
  },
  "routes/__actions/page_view": {
    id: "routes/__actions/page_view",
    parentId: "root",
    path: "page_view",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route43
  },
  "routes/__actions/post_like": {
    id: "routes/__actions/post_like",
    parentId: "root",
    path: "post_like",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route44
  },
  "routes/__actions/comments": {
    id: "routes/__actions/comments",
    parentId: "root",
    path: "comments",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route45
  },
  "routes/__actions/profile": {
    id: "routes/__actions/profile",
    parentId: "root",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route46
  },
  "routes/authors/$authorId": {
    id: "routes/authors/$authorId",
    parentId: "root",
    path: "authors/:authorId",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route47
  },
  "routes/__actions/clicks": {
    id: "routes/__actions/clicks",
    parentId: "root",
    path: "clicks",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route48
  },
  "routes/__actions/create": {
    id: "routes/__actions/create",
    parentId: "root",
    path: "create",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route49
  },
  "routes/__actions/logger": {
    id: "routes/__actions/logger",
    parentId: "root",
    path: "logger",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route50
  },
  "routes/__actions/logout": {
    id: "routes/__actions/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route51
  },
  "routes/__loaders/opt_in": {
    id: "routes/__loaders/opt_in",
    parentId: "root",
    path: "opt_in",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route52
  },
  "routes/__loaders/status": {
    id: "routes/__loaders/status",
    parentId: "root",
    path: "status",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route53
  },
  "routes/__loaders/posts": {
    id: "routes/__loaders/posts",
    parentId: "root",
    path: "posts",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route54
  },
  "routes/create_password": {
    id: "routes/create_password",
    parentId: "root",
    path: "create_password",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route55
  },
  "routes/subscribe/index": {
    id: "routes/subscribe/index",
    parentId: "root",
    path: "subscribe",
    index: true,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route56
  },
  "routes/update_password": {
    id: "routes/update_password",
    parentId: "root",
    path: "update_password",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route57
  },
  "routes/reset_password": {
    id: "routes/reset_password",
    parentId: "root",
    path: "reset_password",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route58
  },
  "routes/authors/index": {
    id: "routes/authors/index",
    parentId: "root",
    path: "authors",
    index: true,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route59
  },
  "routes/forms/$formId": {
    id: "routes/forms/$formId",
    parentId: "root",
    path: "forms/:formId",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route60
  },
  "routes/publications": {
    id: "routes/publications",
    parentId: "root",
    path: "publications",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route61
  },
  "routes/devtools/__": {
    id: "routes/devtools/__",
    parentId: "root",
    path: "devtools",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route62
  },
  "routes/devtools/__/push-notification": {
    id: "routes/devtools/__/push-notification",
    parentId: "routes/devtools/__",
    path: "push-notification",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: false,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route63
  },
  "routes/devtools/__/error-boundary": {
    id: "routes/devtools/__/error-boundary",
    parentId: "routes/devtools/__",
    path: "error-boundary",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route64
  },
  "routes/devtools/__/test-error": {
    id: "routes/devtools/__/test-error",
    parentId: "routes/devtools/__",
    path: "test-error",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route65
  },
  "routes/devtools/__/index": {
    id: "routes/devtools/__/index",
    parentId: "routes/devtools/__",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route66
  },
  "routes/p/$id/likes": {
    id: "routes/p/$id/likes",
    parentId: "root",
    path: "p/:id/likes",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route67
  },
  "routes/t/$category": {
    id: "routes/t/$category",
    parentId: "root",
    path: "t/:category",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route68
  },
  "routes/archive": {
    id: "routes/archive",
    parentId: "root",
    path: "archive",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route69
  },
  "routes/c/$page": {
    id: "routes/c/$page",
    parentId: "root",
    path: "c/:page",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route70
  },
  "routes/p/$slug": {
    id: "routes/p/$slug",
    parentId: "root",
    path: "p/:slug",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route71
  },
  "routes/upgrade": {
    id: "routes/upgrade",
    parentId: "root",
    path: "upgrade",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route72
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route73
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: true,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route74
  },
  "routes/tos": {
    id: "routes/tos",
    parentId: "root",
    path: "tos",
    index: void 0,
    caseSensitive: void 0,
    hasLoader: true,
    hasAction: false,
    hasWorkerLoader: false,
    hasWorkerAction: false,
    module: route75
  }
};
const entry = { module: entryWorker };
/**
 * @remix-run/router v1.17.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
var Action$1;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action$1 || (Action$1 = {}));
function warning$1(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
var ResultType$1;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType$1 || (ResultType$1 = {}));
function matchPath$1(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath$1(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match)
    return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath$1(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning$1(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else
    ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function isRouteErrorResponse$1(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr$1 = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr$1);
const validRequestMethodsArr$1 = ["get", ...validMutationMethodsArr$1];
new Set(validRequestMethodsArr$1);
var mode$2 = {};
/**
 * @remix-run/server-runtime v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
Object.defineProperty(mode$2, "__esModule", { value: true });
let ServerMode = /* @__PURE__ */ function(ServerMode2) {
  ServerMode2["Development"] = "development";
  ServerMode2["Production"] = "production";
  ServerMode2["Test"] = "test";
  return ServerMode2;
}({});
function isServerMode(value) {
  return value === ServerMode.Development || value === ServerMode.Production || value === ServerMode.Test;
}
var ServerMode_1 = mode$2.ServerMode = ServerMode;
var isServerMode_1 = mode$2.isServerMode = isServerMode;
const mode$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  ServerMode: ServerMode_1,
  default: mode$2,
  isServerMode: isServerMode_1
}, [mode$2]);
var responses = {};
/**
 * @remix-run/router v1.16.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createMemoryHistory(options) {
  if (options === void 0) {
    options = {};
  }
  let {
    initialEntries = ["/"],
    initialIndex,
    v5Compat = false
  } = options;
  let entries;
  entries = initialEntries.map((entry2, index2) => createMemoryLocation(entry2, typeof entry2 === "string" ? null : entry2.state, index2 === 0 ? "default" : void 0));
  let index = clampIndex(initialIndex == null ? entries.length - 1 : initialIndex);
  let action = Action.Pop;
  let listener = null;
  function clampIndex(n) {
    return Math.min(Math.max(n, 0), entries.length - 1);
  }
  function getCurrentLocation() {
    return entries[index];
  }
  function createMemoryLocation(to, state, key) {
    if (state === void 0) {
      state = null;
    }
    let location2 = createLocation(entries ? getCurrentLocation().pathname : "/", to, state, key);
    warning(location2.pathname.charAt(0) === "/", "relative pathnames are not supported in memory history: " + JSON.stringify(to));
    return location2;
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  let history = {
    get index() {
      return index;
    },
    get action() {
      return action;
    },
    get location() {
      return getCurrentLocation();
    },
    createHref,
    createURL(to) {
      return new URL(createHref(to), "http://localhost");
    },
    encodeLocation(to) {
      let path = typeof to === "string" ? parsePath(to) : to;
      return {
        pathname: path.pathname || "",
        search: path.search || "",
        hash: path.hash || ""
      };
    },
    push(to, state) {
      action = Action.Push;
      let nextLocation = createMemoryLocation(to, state);
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 1
        });
      }
    },
    replace(to, state) {
      action = Action.Replace;
      let nextLocation = createMemoryLocation(to, state);
      entries[index] = nextLocation;
      if (v5Compat && listener) {
        listener({
          action,
          location: nextLocation,
          delta: 0
        });
      }
    },
    go(delta) {
      action = Action.Pop;
      let nextIndex = clampIndex(index + delta);
      let nextLocation = entries[nextIndex];
      index = nextIndex;
      if (listener) {
        listener({
          action,
          location: nextLocation,
          delta
        });
      }
    },
    listen(fn) {
      listener = fn;
      return () => {
        listener = null;
      };
    }
  };
  return history;
}
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createBrowserLocation(window2, globalHistory) {
    let {
      pathname,
      search,
      hash
    } = window2.location;
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createBrowserHref(window2, to) {
    return typeof to === "string" ? to : createPath(to);
  }
  return getUrlBasedHistory(createBrowserLocation, createBrowserHref, null, options);
}
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }
  function createHashLocation(window2, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window2.location.hash.substr(1));
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createHashHref(window2, to) {
    let base = window2.document.querySelector("base");
    let href = "";
    if (base && base.getAttribute("href")) {
      let url = window2.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location2, to) {
    warning(location2.pathname.charAt(0) === "/", "relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
  }
  return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location2, index) {
  return {
    usr: location2.state,
    key: location2.key,
    idx: index
  };
}
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location2 = _extends({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location2;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location2 = createLocation(history.location, to, state);
    if (validateLocation)
      validateLocation(location2, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location2, index);
    let url = history.createHref(location2);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location2 = createLocation(history.location, to, state);
    if (validateLocation)
      validateLocation(location2, to);
    index = getIndex();
    let historyState = getHistoryState(location2, index);
    let url = history.createHref(location2);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n) {
      return globalHistory.go(n);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
const immutableRouteKeys = /* @__PURE__ */ new Set(["lazy", "caseSensitive", "path", "id", "index", "children"]);
function isIndexRoute(route) {
  return route.index === true;
}
function convertRoutesToDataRoutes(routes2, mapRouteProperties, parentPath, manifest) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  if (manifest === void 0) {
    manifest = {};
  }
  return routes2.map((route, index) => {
    let treePath = [...parentPath, index];
    let id = typeof route.id === "string" ? route.id : treePath.join("-");
    invariant(route.index !== true || !route.children, "Cannot specify children on an index route");
    invariant(!manifest[id], 'Found a route id collision on id "' + id + `".  Route id's must be globally unique within Data Router usages`);
    if (isIndexRoute(route)) {
      let indexRoute = _extends({}, route, mapRouteProperties(route), {
        id
      });
      manifest[id] = indexRoute;
      return indexRoute;
    } else {
      let pathOrLayoutRoute = _extends({}, route, mapRouteProperties(route), {
        id,
        children: void 0
      });
      manifest[id] = pathOrLayoutRoute;
      if (route.children) {
        pathOrLayoutRoute.children = convertRoutesToDataRoutes(route.children, mapRouteProperties, treePath, manifest);
      }
      return pathOrLayoutRoute;
    }
  });
}
function matchRoutes(routes2, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  let location2 = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location2.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes2);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    let decoded = decodePath(pathname);
    matches = matchRouteBranch(branches[i], decoded);
  }
  return matches;
}
function convertRouteMatchToUiMatch(match, loaderData) {
  let {
    route,
    pathname,
    params
  } = match;
  return {
    id: route.id,
    pathname,
    params,
    data: loaderData[route.id],
    handle: route.handle
  };
}
function flattenRoutes(routes2, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes2.forEach((route, index) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0)
    return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    if (!match)
      return null;
    Object.assign(matchedParams, match.params);
    let route = meta.route;
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function generatePath(originalPath, params) {
  if (params === void 0) {
    params = {};
  }
  let path = originalPath;
  if (path.endsWith("*") && path !== "*" && !path.endsWith("/*")) {
    warning(false, 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
    path = path.replace(/\*$/, "/*");
  }
  const prefix = path.startsWith("/") ? "/" : "";
  const stringify = (p) => p == null ? "" : typeof p === "string" ? p : String(p);
  const segments = path.split(/\/+/).map((segment, index, array) => {
    const isLastSegment = index === array.length - 1;
    if (isLastSegment && segment === "*") {
      const star = "*";
      return stringify(params[star]);
    }
    const keyMatch = segment.match(/^:([\w-]+)(\??)$/);
    if (keyMatch) {
      const [, key, optional] = keyMatch;
      let param = params[key];
      invariant(optional === "?" || param != null, 'Missing ":' + key + '" param');
      return stringify(param);
    }
    return segment.replace(/\?$/g, "");
  }).filter((segment) => !!segment);
  return prefix + segments.join("/");
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match)
    return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else
    ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v) => decodeURIComponent(v).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/")
    return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1)
        segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === matches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map((match) => match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
function getToPathname(to) {
  return to === "" || to.pathname === "" ? "/" : typeof to === "string" ? parsePath(to).pathname : to.pathname;
}
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
const json$1 = function json(data, init) {
  if (init === void 0) {
    init = {};
  }
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  let headers = new Headers(responseInit.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json; charset=utf-8");
  }
  return new Response(JSON.stringify(data), _extends({}, responseInit, {
    headers
  }));
};
class AbortedDeferredError extends Error {
}
class DeferredData {
  constructor(data, responseInit) {
    this.pendingKeysSet = /* @__PURE__ */ new Set();
    this.subscribers = /* @__PURE__ */ new Set();
    this.deferredKeys = [];
    invariant(data && typeof data === "object" && !Array.isArray(data), "defer() only accepts plain objects");
    let reject;
    this.abortPromise = new Promise((_, r) => reject = r);
    this.controller = new AbortController();
    let onAbort = () => reject(new AbortedDeferredError("Deferred data aborted"));
    this.unlistenAbortSignal = () => this.controller.signal.removeEventListener("abort", onAbort);
    this.controller.signal.addEventListener("abort", onAbort);
    this.data = Object.entries(data).reduce((acc, _ref2) => {
      let [key, value] = _ref2;
      return Object.assign(acc, {
        [key]: this.trackPromise(key, value)
      });
    }, {});
    if (this.done) {
      this.unlistenAbortSignal();
    }
    this.init = responseInit;
  }
  trackPromise(key, value) {
    if (!(value instanceof Promise)) {
      return value;
    }
    this.deferredKeys.push(key);
    this.pendingKeysSet.add(key);
    let promise = Promise.race([value, this.abortPromise]).then((data) => this.onSettle(promise, key, void 0, data), (error) => this.onSettle(promise, key, error));
    promise.catch(() => {
    });
    Object.defineProperty(promise, "_tracked", {
      get: () => true
    });
    return promise;
  }
  onSettle(promise, key, error, data) {
    if (this.controller.signal.aborted && error instanceof AbortedDeferredError) {
      this.unlistenAbortSignal();
      Object.defineProperty(promise, "_error", {
        get: () => error
      });
      return Promise.reject(error);
    }
    this.pendingKeysSet.delete(key);
    if (this.done) {
      this.unlistenAbortSignal();
    }
    if (error === void 0 && data === void 0) {
      let undefinedError = new Error('Deferred data for key "' + key + '" resolved/rejected with `undefined`, you must resolve/reject with a value or `null`.');
      Object.defineProperty(promise, "_error", {
        get: () => undefinedError
      });
      this.emit(false, key);
      return Promise.reject(undefinedError);
    }
    if (data === void 0) {
      Object.defineProperty(promise, "_error", {
        get: () => error
      });
      this.emit(false, key);
      return Promise.reject(error);
    }
    Object.defineProperty(promise, "_data", {
      get: () => data
    });
    this.emit(false, key);
    return data;
  }
  emit(aborted, settledKey) {
    this.subscribers.forEach((subscriber) => subscriber(aborted, settledKey));
  }
  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }
  cancel() {
    this.controller.abort();
    this.pendingKeysSet.forEach((v, k) => this.pendingKeysSet.delete(k));
    this.emit(true);
  }
  async resolveData(signal) {
    let aborted = false;
    if (!this.done) {
      let onAbort = () => this.cancel();
      signal.addEventListener("abort", onAbort);
      aborted = await new Promise((resolve) => {
        this.subscribe((aborted2) => {
          signal.removeEventListener("abort", onAbort);
          if (aborted2 || this.done) {
            resolve(aborted2);
          }
        });
      });
    }
    return aborted;
  }
  get done() {
    return this.pendingKeysSet.size === 0;
  }
  get unwrappedData() {
    invariant(this.data !== null && this.done, "Can only unwrap data on initialized and settled deferreds");
    return Object.entries(this.data).reduce((acc, _ref3) => {
      let [key, value] = _ref3;
      return Object.assign(acc, {
        [key]: unwrapTrackedPromise(value)
      });
    }, {});
  }
  get pendingKeys() {
    return Array.from(this.pendingKeysSet);
  }
}
function isTrackedPromise$1(value) {
  return value instanceof Promise && value._tracked === true;
}
function unwrapTrackedPromise(value) {
  if (!isTrackedPromise$1(value)) {
    return value;
  }
  if (value._error) {
    throw value._error;
  }
  return value._data;
}
const defer$1 = function defer(data, init) {
  if (init === void 0) {
    init = {};
  }
  let responseInit = typeof init === "number" ? {
    status: init
  } : init;
  return new DeferredData(data, responseInit);
};
const redirect$1 = function redirect(url, init) {
  if (init === void 0) {
    init = 302;
  }
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = {
      status: responseInit
    };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  let headers = new Headers(responseInit.headers);
  headers.set("Location", url);
  return new Response(null, _extends({}, responseInit, {
    headers
  }));
};
const redirectDocument$1 = (url, init) => {
  let response = redirect$1(url, init);
  response.headers.set("X-Remix-Reload-Document", "true");
  return response;
};
class ErrorResponseImpl {
  constructor(status, statusText, data, internal) {
    if (internal === void 0) {
      internal = false;
    }
    this.status = status;
    this.statusText = statusText || "";
    this.internal = internal;
    if (data instanceof Error) {
      this.data = data.toString();
      this.error = data;
    } else {
      this.data = data;
    }
  }
}
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
const validMutationMethods = new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
const validRequestMethods = new Set(validRequestMethodsArr);
const redirectStatusCodes$1 = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
const redirectPreserveMethodStatusCodes = /* @__PURE__ */ new Set([307, 308]);
const IDLE_NAVIGATION = {
  state: "idle",
  location: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
};
const IDLE_FETCHER = {
  state: "idle",
  data: void 0,
  formMethod: void 0,
  formAction: void 0,
  formEncType: void 0,
  formData: void 0,
  json: void 0,
  text: void 0
};
const IDLE_BLOCKER = {
  state: "unblocked",
  proceed: void 0,
  reset: void 0,
  location: void 0
};
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const defaultMapRouteProperties = (route) => ({
  hasErrorBoundary: Boolean(route.hasErrorBoundary)
});
const TRANSITIONS_STORAGE_KEY = "remix-router-transitions";
function createRouter(init) {
  const routerWindow = init.window ? init.window : typeof window !== "undefined" ? window : void 0;
  const isBrowser = typeof routerWindow !== "undefined" && typeof routerWindow.document !== "undefined" && typeof routerWindow.document.createElement !== "undefined";
  const isServer = !isBrowser;
  invariant(init.routes.length > 0, "You must provide a non-empty routes array to createRouter");
  let mapRouteProperties;
  if (init.mapRouteProperties) {
    mapRouteProperties = init.mapRouteProperties;
  } else if (init.detectErrorBoundary) {
    let detectErrorBoundary = init.detectErrorBoundary;
    mapRouteProperties = (route) => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  let manifest = {};
  let dataRoutes = convertRoutesToDataRoutes(init.routes, mapRouteProperties, void 0, manifest);
  let inFlightDataRoutes;
  let basename = init.basename || "/";
  let dataStrategyImpl = init.unstable_dataStrategy || defaultDataStrategy;
  let future = _extends({
    v7_fetcherPersist: false,
    v7_normalizeFormMethod: false,
    v7_partialHydration: false,
    v7_prependBasename: false,
    v7_relativeSplatPath: false,
    unstable_skipActionErrorRevalidation: false
  }, init.future);
  let unlistenHistory = null;
  let subscribers = /* @__PURE__ */ new Set();
  let savedScrollPositions = null;
  let getScrollRestorationKey = null;
  let getScrollPosition = null;
  let initialScrollRestored = init.hydrationData != null;
  let initialMatches = matchRoutes(dataRoutes, init.history.location, basename);
  let initialErrors = null;
  if (initialMatches == null) {
    let error = getInternalRouterError(404, {
      pathname: init.history.location.pathname
    });
    let {
      matches,
      route
    } = getShortCircuitMatches(dataRoutes);
    initialMatches = matches;
    initialErrors = {
      [route.id]: error
    };
  }
  let initialized;
  let hasLazyRoutes = initialMatches.some((m) => m.route.lazy);
  let hasLoaders = initialMatches.some((m) => m.route.loader);
  if (hasLazyRoutes) {
    initialized = false;
  } else if (!hasLoaders) {
    initialized = true;
  } else if (future.v7_partialHydration) {
    let loaderData = init.hydrationData ? init.hydrationData.loaderData : null;
    let errors2 = init.hydrationData ? init.hydrationData.errors : null;
    let isRouteInitialized = (m) => {
      if (!m.route.loader) {
        return true;
      }
      if (typeof m.route.loader === "function" && m.route.loader.hydrate === true) {
        return false;
      }
      return loaderData && loaderData[m.route.id] !== void 0 || errors2 && errors2[m.route.id] !== void 0;
    };
    if (errors2) {
      let idx = initialMatches.findIndex((m) => errors2[m.route.id] !== void 0);
      initialized = initialMatches.slice(0, idx + 1).every(isRouteInitialized);
    } else {
      initialized = initialMatches.every(isRouteInitialized);
    }
  } else {
    initialized = init.hydrationData != null;
  }
  let router2;
  let state = {
    historyAction: init.history.action,
    location: init.history.location,
    matches: initialMatches,
    initialized,
    navigation: IDLE_NAVIGATION,
    // Don't restore on initial updateState() if we were SSR'd
    restoreScrollPosition: init.hydrationData != null ? false : null,
    preventScrollReset: false,
    revalidation: "idle",
    loaderData: init.hydrationData && init.hydrationData.loaderData || {},
    actionData: init.hydrationData && init.hydrationData.actionData || null,
    errors: init.hydrationData && init.hydrationData.errors || initialErrors,
    fetchers: /* @__PURE__ */ new Map(),
    blockers: /* @__PURE__ */ new Map()
  };
  let pendingAction = Action.Pop;
  let pendingPreventScrollReset = false;
  let pendingNavigationController;
  let pendingViewTransitionEnabled = false;
  let appliedViewTransitions = /* @__PURE__ */ new Map();
  let removePageHideEventListener = null;
  let isUninterruptedRevalidation = false;
  let isRevalidationRequired = false;
  let cancelledDeferredRoutes = [];
  let cancelledFetcherLoads = [];
  let fetchControllers = /* @__PURE__ */ new Map();
  let incrementingLoadId = 0;
  let pendingNavigationLoadId = -1;
  let fetchReloadIds = /* @__PURE__ */ new Map();
  let fetchRedirectIds = /* @__PURE__ */ new Set();
  let fetchLoadMatches = /* @__PURE__ */ new Map();
  let activeFetchers = /* @__PURE__ */ new Map();
  let deletedFetchers = /* @__PURE__ */ new Set();
  let activeDeferreds = /* @__PURE__ */ new Map();
  let blockerFunctions = /* @__PURE__ */ new Map();
  let ignoreNextHistoryUpdate = false;
  function initialize() {
    unlistenHistory = init.history.listen((_ref) => {
      let {
        action: historyAction,
        location: location2,
        delta
      } = _ref;
      if (ignoreNextHistoryUpdate) {
        ignoreNextHistoryUpdate = false;
        return;
      }
      warning(blockerFunctions.size === 0 || delta != null, "You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.");
      let blockerKey = shouldBlockNavigation({
        currentLocation: state.location,
        nextLocation: location2,
        historyAction
      });
      if (blockerKey && delta != null) {
        ignoreNextHistoryUpdate = true;
        init.history.go(delta * -1);
        updateBlocker(blockerKey, {
          state: "blocked",
          location: location2,
          proceed() {
            updateBlocker(blockerKey, {
              state: "proceeding",
              proceed: void 0,
              reset: void 0,
              location: location2
            });
            init.history.go(delta);
          },
          reset() {
            let blockers = new Map(state.blockers);
            blockers.set(blockerKey, IDLE_BLOCKER);
            updateState({
              blockers
            });
          }
        });
        return;
      }
      return startNavigation(historyAction, location2);
    });
    if (isBrowser) {
      restoreAppliedTransitions(routerWindow, appliedViewTransitions);
      let _saveAppliedTransitions = () => persistAppliedTransitions(routerWindow, appliedViewTransitions);
      routerWindow.addEventListener("pagehide", _saveAppliedTransitions);
      removePageHideEventListener = () => routerWindow.removeEventListener("pagehide", _saveAppliedTransitions);
    }
    if (!state.initialized) {
      startNavigation(Action.Pop, state.location, {
        initialHydration: true
      });
    }
    return router2;
  }
  function dispose() {
    if (unlistenHistory) {
      unlistenHistory();
    }
    if (removePageHideEventListener) {
      removePageHideEventListener();
    }
    subscribers.clear();
    pendingNavigationController && pendingNavigationController.abort();
    state.fetchers.forEach((_, key) => deleteFetcher(key));
    state.blockers.forEach((_, key) => deleteBlocker(key));
  }
  function subscribe(fn) {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  }
  function updateState(newState, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state = _extends({}, state, newState);
    let completedFetchers = [];
    let deletedFetchersKeys = [];
    if (future.v7_fetcherPersist) {
      state.fetchers.forEach((fetcher, key) => {
        if (fetcher.state === "idle") {
          if (deletedFetchers.has(key)) {
            deletedFetchersKeys.push(key);
          } else {
            completedFetchers.push(key);
          }
        }
      });
    }
    [...subscribers].forEach((subscriber) => subscriber(state, {
      deletedFetchers: deletedFetchersKeys,
      unstable_viewTransitionOpts: opts.viewTransitionOpts,
      unstable_flushSync: opts.flushSync === true
    }));
    if (future.v7_fetcherPersist) {
      completedFetchers.forEach((key) => state.fetchers.delete(key));
      deletedFetchersKeys.forEach((key) => deleteFetcher(key));
    }
  }
  function completeNavigation(location2, newState, _temp) {
    var _location$state, _location$state2;
    let {
      flushSync
    } = _temp === void 0 ? {} : _temp;
    let isActionReload = state.actionData != null && state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && state.navigation.state === "loading" && ((_location$state = location2.state) == null ? void 0 : _location$state._isRedirect) !== true;
    let actionData;
    if (newState.actionData) {
      if (Object.keys(newState.actionData).length > 0) {
        actionData = newState.actionData;
      } else {
        actionData = null;
      }
    } else if (isActionReload) {
      actionData = state.actionData;
    } else {
      actionData = null;
    }
    let loaderData = newState.loaderData ? mergeLoaderData(state.loaderData, newState.loaderData, newState.matches || [], newState.errors) : state.loaderData;
    let blockers = state.blockers;
    if (blockers.size > 0) {
      blockers = new Map(blockers);
      blockers.forEach((_, k) => blockers.set(k, IDLE_BLOCKER));
    }
    let preventScrollReset = pendingPreventScrollReset === true || state.navigation.formMethod != null && isMutationMethod(state.navigation.formMethod) && ((_location$state2 = location2.state) == null ? void 0 : _location$state2._isRedirect) !== true;
    if (inFlightDataRoutes) {
      dataRoutes = inFlightDataRoutes;
      inFlightDataRoutes = void 0;
    }
    if (isUninterruptedRevalidation)
      ;
    else if (pendingAction === Action.Pop)
      ;
    else if (pendingAction === Action.Push) {
      init.history.push(location2, location2.state);
    } else if (pendingAction === Action.Replace) {
      init.history.replace(location2, location2.state);
    }
    let viewTransitionOpts;
    if (pendingAction === Action.Pop) {
      let priorPaths = appliedViewTransitions.get(state.location.pathname);
      if (priorPaths && priorPaths.has(location2.pathname)) {
        viewTransitionOpts = {
          currentLocation: state.location,
          nextLocation: location2
        };
      } else if (appliedViewTransitions.has(location2.pathname)) {
        viewTransitionOpts = {
          currentLocation: location2,
          nextLocation: state.location
        };
      }
    } else if (pendingViewTransitionEnabled) {
      let toPaths = appliedViewTransitions.get(state.location.pathname);
      if (toPaths) {
        toPaths.add(location2.pathname);
      } else {
        toPaths = /* @__PURE__ */ new Set([location2.pathname]);
        appliedViewTransitions.set(state.location.pathname, toPaths);
      }
      viewTransitionOpts = {
        currentLocation: state.location,
        nextLocation: location2
      };
    }
    updateState(_extends({}, newState, {
      actionData,
      loaderData,
      historyAction: pendingAction,
      location: location2,
      initialized: true,
      navigation: IDLE_NAVIGATION,
      revalidation: "idle",
      restoreScrollPosition: getSavedScrollPosition(location2, newState.matches || state.matches),
      preventScrollReset,
      blockers
    }), {
      viewTransitionOpts,
      flushSync: flushSync === true
    });
    pendingAction = Action.Pop;
    pendingPreventScrollReset = false;
    pendingViewTransitionEnabled = false;
    isUninterruptedRevalidation = false;
    isRevalidationRequired = false;
    cancelledDeferredRoutes = [];
    cancelledFetcherLoads = [];
  }
  async function navigate(to, opts) {
    if (typeof to === "number") {
      init.history.go(to);
      return;
    }
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, to, future.v7_relativeSplatPath, opts == null ? void 0 : opts.fromRouteId, opts == null ? void 0 : opts.relative);
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, false, normalizedPath, opts);
    let currentLocation = state.location;
    let nextLocation = createLocation(state.location, path, opts && opts.state);
    nextLocation = _extends({}, nextLocation, init.history.encodeLocation(nextLocation));
    let userReplace = opts && opts.replace != null ? opts.replace : void 0;
    let historyAction = Action.Push;
    if (userReplace === true) {
      historyAction = Action.Replace;
    } else if (userReplace === false)
      ;
    else if (submission != null && isMutationMethod(submission.formMethod) && submission.formAction === state.location.pathname + state.location.search) {
      historyAction = Action.Replace;
    }
    let preventScrollReset = opts && "preventScrollReset" in opts ? opts.preventScrollReset === true : void 0;
    let flushSync = (opts && opts.unstable_flushSync) === true;
    let blockerKey = shouldBlockNavigation({
      currentLocation,
      nextLocation,
      historyAction
    });
    if (blockerKey) {
      updateBlocker(blockerKey, {
        state: "blocked",
        location: nextLocation,
        proceed() {
          updateBlocker(blockerKey, {
            state: "proceeding",
            proceed: void 0,
            reset: void 0,
            location: nextLocation
          });
          navigate(to, opts);
        },
        reset() {
          let blockers = new Map(state.blockers);
          blockers.set(blockerKey, IDLE_BLOCKER);
          updateState({
            blockers
          });
        }
      });
      return;
    }
    return await startNavigation(historyAction, nextLocation, {
      submission,
      // Send through the formData serialization error if we have one so we can
      // render at the right error boundary after we match routes
      pendingError: error,
      preventScrollReset,
      replace: opts && opts.replace,
      enableViewTransition: opts && opts.unstable_viewTransition,
      flushSync
    });
  }
  function revalidate() {
    interruptActiveLoads();
    updateState({
      revalidation: "loading"
    });
    if (state.navigation.state === "submitting") {
      return;
    }
    if (state.navigation.state === "idle") {
      startNavigation(state.historyAction, state.location, {
        startUninterruptedRevalidation: true
      });
      return;
    }
    startNavigation(pendingAction || state.historyAction, state.navigation.location, {
      overrideNavigation: state.navigation
    });
  }
  async function startNavigation(historyAction, location2, opts) {
    pendingNavigationController && pendingNavigationController.abort();
    pendingNavigationController = null;
    pendingAction = historyAction;
    isUninterruptedRevalidation = (opts && opts.startUninterruptedRevalidation) === true;
    saveScrollPosition(state.location, state.matches);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    pendingViewTransitionEnabled = (opts && opts.enableViewTransition) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let loadingNavigation = opts && opts.overrideNavigation;
    let matches = matchRoutes(routesToUse, location2, basename);
    let flushSync = (opts && opts.flushSync) === true;
    if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location2.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(routesToUse);
      cancelActiveDeferreds();
      completeNavigation(location2, {
        matches: notFoundMatches,
        loaderData: {},
        errors: {
          [route.id]: error
        }
      }, {
        flushSync
      });
      return;
    }
    if (state.initialized && !isRevalidationRequired && isHashChangeOnly(state.location, location2) && !(opts && opts.submission && isMutationMethod(opts.submission.formMethod))) {
      completeNavigation(location2, {
        matches
      }, {
        flushSync
      });
      return;
    }
    pendingNavigationController = new AbortController();
    let request = createClientSideRequest(init.history, location2, pendingNavigationController.signal, opts && opts.submission);
    let pendingActionResult;
    if (opts && opts.pendingError) {
      pendingActionResult = [findNearestBoundary(matches).route.id, {
        type: ResultType.error,
        error: opts.pendingError
      }];
    } else if (opts && opts.submission && isMutationMethod(opts.submission.formMethod)) {
      let actionResult = await handleAction2(request, location2, opts.submission, matches, {
        replace: opts.replace,
        flushSync
      });
      if (actionResult.shortCircuited) {
        return;
      }
      pendingActionResult = actionResult.pendingActionResult;
      loadingNavigation = getLoadingNavigation(location2, opts.submission);
      flushSync = false;
      request = createClientSideRequest(init.history, request.url, request.signal);
    }
    let {
      shortCircuited,
      loaderData,
      errors: errors2
    } = await handleLoaders(request, location2, matches, loadingNavigation, opts && opts.submission, opts && opts.fetcherSubmission, opts && opts.replace, opts && opts.initialHydration === true, flushSync, pendingActionResult);
    if (shortCircuited) {
      return;
    }
    pendingNavigationController = null;
    completeNavigation(location2, _extends({
      matches
    }, getActionDataForCommit(pendingActionResult), {
      loaderData,
      errors: errors2
    }));
  }
  async function handleAction2(request, location2, submission, matches, opts) {
    if (opts === void 0) {
      opts = {};
    }
    interruptActiveLoads();
    let navigation = getSubmittingNavigation(location2, submission);
    updateState({
      navigation
    }, {
      flushSync: opts.flushSync === true
    });
    let result;
    let actionMatch = getTargetMatch(matches, location2);
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      result = {
        type: ResultType.error,
        error: getInternalRouterError(405, {
          method: request.method,
          pathname: location2.pathname,
          routeId: actionMatch.route.id
        })
      };
    } else {
      let results = await callDataStrategy("action", request, [actionMatch], matches);
      result = results[0];
      if (request.signal.aborted) {
        return {
          shortCircuited: true
        };
      }
    }
    if (isRedirectResult(result)) {
      let replace;
      if (opts && opts.replace != null) {
        replace = opts.replace;
      } else {
        let location3 = normalizeRedirectLocation(result.response.headers.get("Location"), new URL(request.url), basename);
        replace = location3 === state.location.pathname + state.location.search;
      }
      await startRedirectNavigation(request, result, {
        submission,
        replace
      });
      return {
        shortCircuited: true
      };
    }
    if (isDeferredResult(result)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(matches, actionMatch.route.id);
      if ((opts && opts.replace) !== true) {
        pendingAction = Action.Push;
      }
      return {
        pendingActionResult: [boundaryMatch.route.id, result]
      };
    }
    return {
      pendingActionResult: [actionMatch.route.id, result]
    };
  }
  async function handleLoaders(request, location2, matches, overrideNavigation, submission, fetcherSubmission, replace, initialHydration, flushSync, pendingActionResult) {
    let loadingNavigation = overrideNavigation || getLoadingNavigation(location2, submission);
    let activeSubmission = submission || fetcherSubmission || getSubmissionFromNavigation(loadingNavigation);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, activeSubmission, location2, future.v7_partialHydration && initialHydration === true, future.unstable_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult);
    cancelActiveDeferreds((routeId) => !(matches && matches.some((m) => m.route.id === routeId)) || matchesToLoad && matchesToLoad.some((m) => m.route.id === routeId));
    pendingNavigationLoadId = ++incrementingLoadId;
    if (matchesToLoad.length === 0 && revalidatingFetchers.length === 0) {
      let updatedFetchers2 = markFetchRedirectsDone();
      completeNavigation(location2, _extends({
        matches,
        loaderData: {},
        // Commit pending error if we're short circuiting
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null
      }, getActionDataForCommit(pendingActionResult), updatedFetchers2 ? {
        fetchers: new Map(state.fetchers)
      } : {}), {
        flushSync
      });
      return {
        shortCircuited: true
      };
    }
    if (!isUninterruptedRevalidation && (!future.v7_partialHydration || !initialHydration)) {
      revalidatingFetchers.forEach((rf) => {
        let fetcher = state.fetchers.get(rf.key);
        let revalidatingFetcher = getLoadingFetcher(void 0, fetcher ? fetcher.data : void 0);
        state.fetchers.set(rf.key, revalidatingFetcher);
      });
      let actionData;
      if (pendingActionResult && !isErrorResult(pendingActionResult[1])) {
        actionData = {
          [pendingActionResult[0]]: pendingActionResult[1].data
        };
      } else if (state.actionData) {
        if (Object.keys(state.actionData).length === 0) {
          actionData = null;
        } else {
          actionData = state.actionData;
        }
      }
      updateState(_extends({
        navigation: loadingNavigation
      }, actionData !== void 0 ? {
        actionData
      } : {}, revalidatingFetchers.length > 0 ? {
        fetchers: new Map(state.fetchers)
      } : {}), {
        flushSync
      });
    }
    revalidatingFetchers.forEach((rf) => {
      if (fetchControllers.has(rf.key)) {
        abortFetcher(rf.key);
      }
      if (rf.controller) {
        fetchControllers.set(rf.key, rf.controller);
      }
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((f) => abortFetcher(f.key));
    if (pendingNavigationController) {
      pendingNavigationController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    }
    let {
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, request);
    if (request.signal.aborted) {
      return {
        shortCircuited: true
      };
    }
    if (pendingNavigationController) {
      pendingNavigationController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    }
    revalidatingFetchers.forEach((rf) => fetchControllers.delete(rf.key));
    let redirect3 = findRedirect([...loaderResults, ...fetcherResults]);
    if (redirect3) {
      if (redirect3.idx >= matchesToLoad.length) {
        let fetcherKey = revalidatingFetchers[redirect3.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      await startRedirectNavigation(request, redirect3.result, {
        replace
      });
      return {
        shortCircuited: true
      };
    }
    let {
      loaderData,
      errors: errors2
    } = processLoaderData(state, matches, matchesToLoad, loaderResults, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds);
    activeDeferreds.forEach((deferredData, routeId) => {
      deferredData.subscribe((aborted) => {
        if (aborted || deferredData.done) {
          activeDeferreds.delete(routeId);
        }
      });
    });
    if (future.v7_partialHydration && initialHydration && state.errors) {
      Object.entries(state.errors).filter((_ref2) => {
        let [id] = _ref2;
        return !matchesToLoad.some((m) => m.route.id === id);
      }).forEach((_ref3) => {
        let [routeId, error] = _ref3;
        errors2 = Object.assign(errors2 || {}, {
          [routeId]: error
        });
      });
    }
    let updatedFetchers = markFetchRedirectsDone();
    let didAbortFetchLoads = abortStaleFetchLoads(pendingNavigationLoadId);
    let shouldUpdateFetchers = updatedFetchers || didAbortFetchLoads || revalidatingFetchers.length > 0;
    return _extends({
      loaderData,
      errors: errors2
    }, shouldUpdateFetchers ? {
      fetchers: new Map(state.fetchers)
    } : {});
  }
  function fetch2(key, routeId, href, opts) {
    if (isServer) {
      throw new Error("router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback.");
    }
    if (fetchControllers.has(key))
      abortFetcher(key);
    let flushSync = (opts && opts.unstable_flushSync) === true;
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let normalizedPath = normalizeTo(state.location, state.matches, basename, future.v7_prependBasename, href, future.v7_relativeSplatPath, routeId, opts == null ? void 0 : opts.relative);
    let matches = matchRoutes(routesToUse, normalizedPath, basename);
    if (!matches) {
      setFetcherError(key, routeId, getInternalRouterError(404, {
        pathname: normalizedPath
      }), {
        flushSync
      });
      return;
    }
    let {
      path,
      submission,
      error
    } = normalizeNavigateOptions(future.v7_normalizeFormMethod, true, normalizedPath, opts);
    if (error) {
      setFetcherError(key, routeId, error, {
        flushSync
      });
      return;
    }
    let match = getTargetMatch(matches, path);
    pendingPreventScrollReset = (opts && opts.preventScrollReset) === true;
    if (submission && isMutationMethod(submission.formMethod)) {
      handleFetcherAction(key, routeId, path, match, matches, flushSync, submission);
      return;
    }
    fetchLoadMatches.set(key, {
      routeId,
      path
    });
    handleFetcherLoader(key, routeId, path, match, matches, flushSync, submission);
  }
  async function handleFetcherAction(key, routeId, path, match, requestMatches, flushSync, submission) {
    interruptActiveLoads();
    fetchLoadMatches.delete(key);
    if (!match.route.action && !match.route.lazy) {
      let error = getInternalRouterError(405, {
        method: submission.formMethod,
        pathname: path,
        routeId
      });
      setFetcherError(key, routeId, error, {
        flushSync
      });
      return;
    }
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getSubmittingFetcher(submission, existingFetcher), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal, submission);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let actionResults = await callDataStrategy("action", fetchRequest, [match], requestMatches);
    let actionResult = actionResults[0];
    if (fetchRequest.signal.aborted) {
      if (fetchControllers.get(key) === abortController) {
        fetchControllers.delete(key);
      }
      return;
    }
    if (future.v7_fetcherPersist && deletedFetchers.has(key)) {
      if (isRedirectResult(actionResult) || isErrorResult(actionResult)) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      }
    } else {
      if (isRedirectResult(actionResult)) {
        fetchControllers.delete(key);
        if (pendingNavigationLoadId > originatingLoadId) {
          updateFetcherState(key, getDoneFetcher(void 0));
          return;
        } else {
          fetchRedirectIds.add(key);
          updateFetcherState(key, getLoadingFetcher(submission));
          return startRedirectNavigation(fetchRequest, actionResult, {
            fetcherSubmission: submission
          });
        }
      }
      if (isErrorResult(actionResult)) {
        setFetcherError(key, routeId, actionResult.error);
        return;
      }
    }
    if (isDeferredResult(actionResult)) {
      throw getInternalRouterError(400, {
        type: "defer-action"
      });
    }
    let nextLocation = state.navigation.location || state.location;
    let revalidationRequest = createClientSideRequest(init.history, nextLocation, abortController.signal);
    let routesToUse = inFlightDataRoutes || dataRoutes;
    let matches = state.navigation.state !== "idle" ? matchRoutes(routesToUse, state.navigation.location, basename) : state.matches;
    invariant(matches, "Didn't find any matches after fetcher action");
    let loadId = ++incrementingLoadId;
    fetchReloadIds.set(key, loadId);
    let loadFetcher = getLoadingFetcher(submission, actionResult.data);
    state.fetchers.set(key, loadFetcher);
    let [matchesToLoad, revalidatingFetchers] = getMatchesToLoad(init.history, state, matches, submission, nextLocation, false, future.unstable_skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, [match.route.id, actionResult]);
    revalidatingFetchers.filter((rf) => rf.key !== key).forEach((rf) => {
      let staleKey = rf.key;
      let existingFetcher2 = state.fetchers.get(staleKey);
      let revalidatingFetcher = getLoadingFetcher(void 0, existingFetcher2 ? existingFetcher2.data : void 0);
      state.fetchers.set(staleKey, revalidatingFetcher);
      if (fetchControllers.has(staleKey)) {
        abortFetcher(staleKey);
      }
      if (rf.controller) {
        fetchControllers.set(staleKey, rf.controller);
      }
    });
    updateState({
      fetchers: new Map(state.fetchers)
    });
    let abortPendingFetchRevalidations = () => revalidatingFetchers.forEach((rf) => abortFetcher(rf.key));
    abortController.signal.addEventListener("abort", abortPendingFetchRevalidations);
    let {
      loaderResults,
      fetcherResults
    } = await callLoadersAndMaybeResolveData(state.matches, matches, matchesToLoad, revalidatingFetchers, revalidationRequest);
    if (abortController.signal.aborted) {
      return;
    }
    abortController.signal.removeEventListener("abort", abortPendingFetchRevalidations);
    fetchReloadIds.delete(key);
    fetchControllers.delete(key);
    revalidatingFetchers.forEach((r) => fetchControllers.delete(r.key));
    let redirect3 = findRedirect([...loaderResults, ...fetcherResults]);
    if (redirect3) {
      if (redirect3.idx >= matchesToLoad.length) {
        let fetcherKey = revalidatingFetchers[redirect3.idx - matchesToLoad.length].key;
        fetchRedirectIds.add(fetcherKey);
      }
      return startRedirectNavigation(revalidationRequest, redirect3.result);
    }
    let {
      loaderData,
      errors: errors2
    } = processLoaderData(state, state.matches, matchesToLoad, loaderResults, void 0, revalidatingFetchers, fetcherResults, activeDeferreds);
    if (state.fetchers.has(key)) {
      let doneFetcher = getDoneFetcher(actionResult.data);
      state.fetchers.set(key, doneFetcher);
    }
    abortStaleFetchLoads(loadId);
    if (state.navigation.state === "loading" && loadId > pendingNavigationLoadId) {
      invariant(pendingAction, "Expected pending action");
      pendingNavigationController && pendingNavigationController.abort();
      completeNavigation(state.navigation.location, {
        matches,
        loaderData,
        errors: errors2,
        fetchers: new Map(state.fetchers)
      });
    } else {
      updateState({
        errors: errors2,
        loaderData: mergeLoaderData(state.loaderData, loaderData, matches, errors2),
        fetchers: new Map(state.fetchers)
      });
      isRevalidationRequired = false;
    }
  }
  async function handleFetcherLoader(key, routeId, path, match, matches, flushSync, submission) {
    let existingFetcher = state.fetchers.get(key);
    updateFetcherState(key, getLoadingFetcher(submission, existingFetcher ? existingFetcher.data : void 0), {
      flushSync
    });
    let abortController = new AbortController();
    let fetchRequest = createClientSideRequest(init.history, path, abortController.signal);
    fetchControllers.set(key, abortController);
    let originatingLoadId = incrementingLoadId;
    let results = await callDataStrategy("loader", fetchRequest, [match], matches);
    let result = results[0];
    if (isDeferredResult(result)) {
      result = await resolveDeferredData(result, fetchRequest.signal, true) || result;
    }
    if (fetchControllers.get(key) === abortController) {
      fetchControllers.delete(key);
    }
    if (fetchRequest.signal.aborted) {
      return;
    }
    if (deletedFetchers.has(key)) {
      updateFetcherState(key, getDoneFetcher(void 0));
      return;
    }
    if (isRedirectResult(result)) {
      if (pendingNavigationLoadId > originatingLoadId) {
        updateFetcherState(key, getDoneFetcher(void 0));
        return;
      } else {
        fetchRedirectIds.add(key);
        await startRedirectNavigation(fetchRequest, result);
        return;
      }
    }
    if (isErrorResult(result)) {
      setFetcherError(key, routeId, result.error);
      return;
    }
    invariant(!isDeferredResult(result), "Unhandled fetcher deferred data");
    updateFetcherState(key, getDoneFetcher(result.data));
  }
  async function startRedirectNavigation(request, redirect3, _temp2) {
    let {
      submission,
      fetcherSubmission,
      replace
    } = _temp2 === void 0 ? {} : _temp2;
    if (redirect3.response.headers.has("X-Remix-Revalidate")) {
      isRevalidationRequired = true;
    }
    let location2 = redirect3.response.headers.get("Location");
    invariant(location2, "Expected a Location header on the redirect Response");
    location2 = normalizeRedirectLocation(location2, new URL(request.url), basename);
    let redirectLocation = createLocation(state.location, location2, {
      _isRedirect: true
    });
    if (isBrowser) {
      let isDocumentReload = false;
      if (redirect3.response.headers.has("X-Remix-Reload-Document")) {
        isDocumentReload = true;
      } else if (ABSOLUTE_URL_REGEX.test(location2)) {
        const url = init.history.createURL(location2);
        isDocumentReload = // Hard reload if it's an absolute URL to a new origin
        url.origin !== routerWindow.location.origin || // Hard reload if it's an absolute URL that does not match our basename
        stripBasename(url.pathname, basename) == null;
      }
      if (isDocumentReload) {
        if (replace) {
          routerWindow.location.replace(location2);
        } else {
          routerWindow.location.assign(location2);
        }
        return;
      }
    }
    pendingNavigationController = null;
    let redirectHistoryAction = replace === true ? Action.Replace : Action.Push;
    let {
      formMethod,
      formAction,
      formEncType
    } = state.navigation;
    if (!submission && !fetcherSubmission && formMethod && formAction && formEncType) {
      submission = getSubmissionFromNavigation(state.navigation);
    }
    let activeSubmission = submission || fetcherSubmission;
    if (redirectPreserveMethodStatusCodes.has(redirect3.response.status) && activeSubmission && isMutationMethod(activeSubmission.formMethod)) {
      await startNavigation(redirectHistoryAction, redirectLocation, {
        submission: _extends({}, activeSubmission, {
          formAction: location2
        }),
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    } else {
      let overrideNavigation = getLoadingNavigation(redirectLocation, submission);
      await startNavigation(redirectHistoryAction, redirectLocation, {
        overrideNavigation,
        // Send fetcher submissions through for shouldRevalidate
        fetcherSubmission,
        // Preserve this flag across redirects
        preventScrollReset: pendingPreventScrollReset
      });
    }
  }
  async function callDataStrategy(type, request, matchesToLoad, matches) {
    try {
      let results = await callDataStrategyImpl(dataStrategyImpl, type, request, matchesToLoad, matches, manifest, mapRouteProperties);
      return await Promise.all(results.map((result, i) => {
        if (isRedirectHandlerResult(result)) {
          let response = result.result;
          return {
            type: ResultType.redirect,
            response: normalizeRelativeRoutingRedirectResponse(response, request, matchesToLoad[i].route.id, matches, basename, future.v7_relativeSplatPath)
          };
        }
        return convertHandlerResultToDataResult(result);
      }));
    } catch (e) {
      return matchesToLoad.map(() => ({
        type: ResultType.error,
        error: e
      }));
    }
  }
  async function callLoadersAndMaybeResolveData(currentMatches, matches, matchesToLoad, fetchersToLoad, request) {
    let [loaderResults, ...fetcherResults] = await Promise.all([matchesToLoad.length ? callDataStrategy("loader", request, matchesToLoad, matches) : [], ...fetchersToLoad.map((f) => {
      if (f.matches && f.match && f.controller) {
        let fetcherRequest = createClientSideRequest(init.history, f.path, f.controller.signal);
        return callDataStrategy("loader", fetcherRequest, [f.match], f.matches).then((r) => r[0]);
      } else {
        return Promise.resolve({
          type: ResultType.error,
          error: getInternalRouterError(404, {
            pathname: f.path
          })
        });
      }
    })]);
    await Promise.all([resolveDeferredResults(currentMatches, matchesToLoad, loaderResults, loaderResults.map(() => request.signal), false, state.loaderData), resolveDeferredResults(currentMatches, fetchersToLoad.map((f) => f.match), fetcherResults, fetchersToLoad.map((f) => f.controller ? f.controller.signal : null), true)]);
    return {
      loaderResults,
      fetcherResults
    };
  }
  function interruptActiveLoads() {
    isRevalidationRequired = true;
    cancelledDeferredRoutes.push(...cancelActiveDeferreds());
    fetchLoadMatches.forEach((_, key) => {
      if (fetchControllers.has(key)) {
        cancelledFetcherLoads.push(key);
        abortFetcher(key);
      }
    });
  }
  function updateFetcherState(key, fetcher, opts) {
    if (opts === void 0) {
      opts = {};
    }
    state.fetchers.set(key, fetcher);
    updateState({
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function setFetcherError(key, routeId, error, opts) {
    if (opts === void 0) {
      opts = {};
    }
    let boundaryMatch = findNearestBoundary(state.matches, routeId);
    deleteFetcher(key);
    updateState({
      errors: {
        [boundaryMatch.route.id]: error
      },
      fetchers: new Map(state.fetchers)
    }, {
      flushSync: (opts && opts.flushSync) === true
    });
  }
  function getFetcher(key) {
    if (future.v7_fetcherPersist) {
      activeFetchers.set(key, (activeFetchers.get(key) || 0) + 1);
      if (deletedFetchers.has(key)) {
        deletedFetchers.delete(key);
      }
    }
    return state.fetchers.get(key) || IDLE_FETCHER;
  }
  function deleteFetcher(key) {
    let fetcher = state.fetchers.get(key);
    if (fetchControllers.has(key) && !(fetcher && fetcher.state === "loading" && fetchReloadIds.has(key))) {
      abortFetcher(key);
    }
    fetchLoadMatches.delete(key);
    fetchReloadIds.delete(key);
    fetchRedirectIds.delete(key);
    deletedFetchers.delete(key);
    state.fetchers.delete(key);
  }
  function deleteFetcherAndUpdateState(key) {
    if (future.v7_fetcherPersist) {
      let count = (activeFetchers.get(key) || 0) - 1;
      if (count <= 0) {
        activeFetchers.delete(key);
        deletedFetchers.add(key);
      } else {
        activeFetchers.set(key, count);
      }
    } else {
      deleteFetcher(key);
    }
    updateState({
      fetchers: new Map(state.fetchers)
    });
  }
  function abortFetcher(key) {
    let controller = fetchControllers.get(key);
    invariant(controller, "Expected fetch controller: " + key);
    controller.abort();
    fetchControllers.delete(key);
  }
  function markFetchersDone(keys) {
    for (let key of keys) {
      let fetcher = getFetcher(key);
      let doneFetcher = getDoneFetcher(fetcher.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  function markFetchRedirectsDone() {
    let doneKeys = [];
    let updatedFetchers = false;
    for (let key of fetchRedirectIds) {
      let fetcher = state.fetchers.get(key);
      invariant(fetcher, "Expected fetcher: " + key);
      if (fetcher.state === "loading") {
        fetchRedirectIds.delete(key);
        doneKeys.push(key);
        updatedFetchers = true;
      }
    }
    markFetchersDone(doneKeys);
    return updatedFetchers;
  }
  function abortStaleFetchLoads(landedId) {
    let yeetedKeys = [];
    for (let [key, id] of fetchReloadIds) {
      if (id < landedId) {
        let fetcher = state.fetchers.get(key);
        invariant(fetcher, "Expected fetcher: " + key);
        if (fetcher.state === "loading") {
          abortFetcher(key);
          fetchReloadIds.delete(key);
          yeetedKeys.push(key);
        }
      }
    }
    markFetchersDone(yeetedKeys);
    return yeetedKeys.length > 0;
  }
  function getBlocker(key, fn) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    if (blockerFunctions.get(key) !== fn) {
      blockerFunctions.set(key, fn);
    }
    return blocker;
  }
  function deleteBlocker(key) {
    state.blockers.delete(key);
    blockerFunctions.delete(key);
  }
  function updateBlocker(key, newBlocker) {
    let blocker = state.blockers.get(key) || IDLE_BLOCKER;
    invariant(blocker.state === "unblocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "blocked" || blocker.state === "blocked" && newBlocker.state === "proceeding" || blocker.state === "blocked" && newBlocker.state === "unblocked" || blocker.state === "proceeding" && newBlocker.state === "unblocked", "Invalid blocker state transition: " + blocker.state + " -> " + newBlocker.state);
    let blockers = new Map(state.blockers);
    blockers.set(key, newBlocker);
    updateState({
      blockers
    });
  }
  function shouldBlockNavigation(_ref4) {
    let {
      currentLocation,
      nextLocation,
      historyAction
    } = _ref4;
    if (blockerFunctions.size === 0) {
      return;
    }
    if (blockerFunctions.size > 1) {
      warning(false, "A router only supports one blocker at a time");
    }
    let entries = Array.from(blockerFunctions.entries());
    let [blockerKey, blockerFunction] = entries[entries.length - 1];
    let blocker = state.blockers.get(blockerKey);
    if (blocker && blocker.state === "proceeding") {
      return;
    }
    if (blockerFunction({
      currentLocation,
      nextLocation,
      historyAction
    })) {
      return blockerKey;
    }
  }
  function cancelActiveDeferreds(predicate) {
    let cancelledRouteIds = [];
    activeDeferreds.forEach((dfd, routeId) => {
      if (!predicate || predicate(routeId)) {
        dfd.cancel();
        cancelledRouteIds.push(routeId);
        activeDeferreds.delete(routeId);
      }
    });
    return cancelledRouteIds;
  }
  function enableScrollRestoration(positions, getPosition, getKey) {
    savedScrollPositions = positions;
    getScrollPosition = getPosition;
    getScrollRestorationKey = getKey || null;
    if (!initialScrollRestored && state.navigation === IDLE_NAVIGATION) {
      initialScrollRestored = true;
      let y = getSavedScrollPosition(state.location, state.matches);
      if (y != null) {
        updateState({
          restoreScrollPosition: y
        });
      }
    }
    return () => {
      savedScrollPositions = null;
      getScrollPosition = null;
      getScrollRestorationKey = null;
    };
  }
  function getScrollKey(location2, matches) {
    if (getScrollRestorationKey) {
      let key = getScrollRestorationKey(location2, matches.map((m) => convertRouteMatchToUiMatch(m, state.loaderData)));
      return key || location2.key;
    }
    return location2.key;
  }
  function saveScrollPosition(location2, matches) {
    if (savedScrollPositions && getScrollPosition) {
      let key = getScrollKey(location2, matches);
      savedScrollPositions[key] = getScrollPosition();
    }
  }
  function getSavedScrollPosition(location2, matches) {
    if (savedScrollPositions) {
      let key = getScrollKey(location2, matches);
      let y = savedScrollPositions[key];
      if (typeof y === "number") {
        return y;
      }
    }
    return null;
  }
  function _internalSetRoutes(newRoutes) {
    manifest = {};
    inFlightDataRoutes = convertRoutesToDataRoutes(newRoutes, mapRouteProperties, void 0, manifest);
  }
  router2 = {
    get basename() {
      return basename;
    },
    get future() {
      return future;
    },
    get state() {
      return state;
    },
    get routes() {
      return dataRoutes;
    },
    get window() {
      return routerWindow;
    },
    initialize,
    subscribe,
    enableScrollRestoration,
    navigate,
    fetch: fetch2,
    revalidate,
    // Passthrough to history-aware createHref used by useHref so we get proper
    // hash-aware URLs in DOM paths
    createHref: (to) => init.history.createHref(to),
    encodeLocation: (to) => init.history.encodeLocation(to),
    getFetcher,
    deleteFetcher: deleteFetcherAndUpdateState,
    dispose,
    getBlocker,
    deleteBlocker,
    _internalFetchControllers: fetchControllers,
    _internalActiveDeferreds: activeDeferreds,
    // TODO: Remove setRoutes, it's temporary to avoid dealing with
    // updating the tree while validating the update algorithm.
    _internalSetRoutes
  };
  return router2;
}
const UNSAFE_DEFERRED_SYMBOL = Symbol("deferred");
function createStaticHandler(routes2, opts) {
  invariant(routes2.length > 0, "You must provide a non-empty routes array to createStaticHandler");
  let manifest = {};
  let basename = (opts ? opts.basename : null) || "/";
  let mapRouteProperties;
  if (opts != null && opts.mapRouteProperties) {
    mapRouteProperties = opts.mapRouteProperties;
  } else if (opts != null && opts.detectErrorBoundary) {
    let detectErrorBoundary = opts.detectErrorBoundary;
    mapRouteProperties = (route) => ({
      hasErrorBoundary: detectErrorBoundary(route)
    });
  } else {
    mapRouteProperties = defaultMapRouteProperties;
  }
  let future = _extends({
    v7_relativeSplatPath: false,
    v7_throwAbortReason: false
  }, opts ? opts.future : null);
  let dataRoutes = convertRoutesToDataRoutes(routes2, mapRouteProperties, void 0, manifest);
  async function query(request, _temp3) {
    let {
      requestContext,
      skipLoaderErrorBubbling,
      unstable_dataStrategy
    } = _temp3 === void 0 ? {} : _temp3;
    let url = new URL(request.url);
    let method = request.method;
    let location2 = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location2, basename);
    if (!isValidMethod(method) && method !== "HEAD") {
      let error = getInternalRouterError(405, {
        method
      });
      let {
        matches: methodNotAllowedMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location: location2,
        matches: methodNotAllowedMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    } else if (!matches) {
      let error = getInternalRouterError(404, {
        pathname: location2.pathname
      });
      let {
        matches: notFoundMatches,
        route
      } = getShortCircuitMatches(dataRoutes);
      return {
        basename,
        location: location2,
        matches: notFoundMatches,
        loaderData: {},
        actionData: null,
        errors: {
          [route.id]: error
        },
        statusCode: error.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    let result = await queryImpl(request, location2, matches, requestContext, unstable_dataStrategy || null, skipLoaderErrorBubbling === true, null);
    if (isResponse$1(result)) {
      return result;
    }
    return _extends({
      location: location2,
      basename
    }, result);
  }
  async function queryRoute(request, _temp4) {
    let {
      routeId,
      requestContext,
      unstable_dataStrategy
    } = _temp4 === void 0 ? {} : _temp4;
    let url = new URL(request.url);
    let method = request.method;
    let location2 = createLocation("", createPath(url), null, "default");
    let matches = matchRoutes(dataRoutes, location2, basename);
    if (!isValidMethod(method) && method !== "HEAD" && method !== "OPTIONS") {
      throw getInternalRouterError(405, {
        method
      });
    } else if (!matches) {
      throw getInternalRouterError(404, {
        pathname: location2.pathname
      });
    }
    let match = routeId ? matches.find((m) => m.route.id === routeId) : getTargetMatch(matches, location2);
    if (routeId && !match) {
      throw getInternalRouterError(403, {
        pathname: location2.pathname,
        routeId
      });
    } else if (!match) {
      throw getInternalRouterError(404, {
        pathname: location2.pathname
      });
    }
    let result = await queryImpl(request, location2, matches, requestContext, unstable_dataStrategy || null, false, match);
    if (isResponse$1(result)) {
      return result;
    }
    let error = result.errors ? Object.values(result.errors)[0] : void 0;
    if (error !== void 0) {
      throw error;
    }
    if (result.actionData) {
      return Object.values(result.actionData)[0];
    }
    if (result.loaderData) {
      var _result$activeDeferre;
      let data = Object.values(result.loaderData)[0];
      if ((_result$activeDeferre = result.activeDeferreds) != null && _result$activeDeferre[match.route.id]) {
        data[UNSAFE_DEFERRED_SYMBOL] = result.activeDeferreds[match.route.id];
      }
      return data;
    }
    return void 0;
  }
  async function queryImpl(request, location2, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, routeMatch) {
    invariant(request.signal, "query()/queryRoute() requests must contain an AbortController signal");
    try {
      if (isMutationMethod(request.method.toLowerCase())) {
        let result2 = await submit(request, matches, routeMatch || getTargetMatch(matches, location2), requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, routeMatch != null);
        return result2;
      }
      let result = await loadRouteData(request, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, routeMatch);
      return isResponse$1(result) ? result : _extends({}, result, {
        actionData: null,
        actionHeaders: {}
      });
    } catch (e) {
      if (isHandlerResult(e) && isResponse$1(e.result)) {
        if (e.type === ResultType.error) {
          throw e.result;
        }
        return e.result;
      }
      if (isRedirectResponse$1(e)) {
        return e;
      }
      throw e;
    }
  }
  async function submit(request, matches, actionMatch, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, isRouteRequest) {
    let result;
    if (!actionMatch.route.action && !actionMatch.route.lazy) {
      let error = getInternalRouterError(405, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: actionMatch.route.id
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    } else {
      let results = await callDataStrategy("action", request, [actionMatch], matches, isRouteRequest, requestContext, unstable_dataStrategy);
      result = results[0];
      if (request.signal.aborted) {
        throwStaticHandlerAbortedError(request, isRouteRequest, future);
      }
    }
    if (isRedirectResult(result)) {
      throw new Response(null, {
        status: result.response.status,
        headers: {
          Location: result.response.headers.get("Location")
        }
      });
    }
    if (isDeferredResult(result)) {
      let error = getInternalRouterError(400, {
        type: "defer-action"
      });
      if (isRouteRequest) {
        throw error;
      }
      result = {
        type: ResultType.error,
        error
      };
    }
    if (isRouteRequest) {
      if (isErrorResult(result)) {
        throw result.error;
      }
      return {
        matches: [actionMatch],
        loaderData: {},
        actionData: {
          [actionMatch.route.id]: result.data
        },
        errors: null,
        // Note: statusCode + headers are unused here since queryRoute will
        // return the raw Response or value
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null
      };
    }
    let loaderRequest = new Request(request.url, {
      headers: request.headers,
      redirect: request.redirect,
      signal: request.signal
    });
    if (isErrorResult(result)) {
      let boundaryMatch = skipLoaderErrorBubbling ? actionMatch : findNearestBoundary(matches, actionMatch.route.id);
      let context2 = await loadRouteData(loaderRequest, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, null, [boundaryMatch.route.id, result]);
      return _extends({}, context2, {
        statusCode: isRouteErrorResponse(result.error) ? result.error.status : result.statusCode != null ? result.statusCode : 500,
        actionData: null,
        actionHeaders: _extends({}, result.headers ? {
          [actionMatch.route.id]: result.headers
        } : {})
      });
    }
    let context = await loadRouteData(loaderRequest, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, null);
    return _extends({}, context, {
      actionData: {
        [actionMatch.route.id]: result.data
      }
    }, result.statusCode ? {
      statusCode: result.statusCode
    } : {}, {
      actionHeaders: result.headers ? {
        [actionMatch.route.id]: result.headers
      } : {}
    });
  }
  async function loadRouteData(request, matches, requestContext, unstable_dataStrategy, skipLoaderErrorBubbling, routeMatch, pendingActionResult) {
    let isRouteRequest = routeMatch != null;
    if (isRouteRequest && !(routeMatch != null && routeMatch.route.loader) && !(routeMatch != null && routeMatch.route.lazy)) {
      throw getInternalRouterError(400, {
        method: request.method,
        pathname: new URL(request.url).pathname,
        routeId: routeMatch == null ? void 0 : routeMatch.route.id
      });
    }
    let requestMatches = routeMatch ? [routeMatch] : pendingActionResult && isErrorResult(pendingActionResult[1]) ? getLoaderMatchesUntilBoundary(matches, pendingActionResult[0]) : matches;
    let matchesToLoad = requestMatches.filter((m) => m.route.loader || m.route.lazy);
    if (matchesToLoad.length === 0) {
      return {
        matches,
        // Add a null for all matched routes for proper revalidation on the client
        loaderData: matches.reduce((acc, m) => Object.assign(acc, {
          [m.route.id]: null
        }), {}),
        errors: pendingActionResult && isErrorResult(pendingActionResult[1]) ? {
          [pendingActionResult[0]]: pendingActionResult[1].error
        } : null,
        statusCode: 200,
        loaderHeaders: {},
        activeDeferreds: null
      };
    }
    let results = await callDataStrategy("loader", request, matchesToLoad, matches, isRouteRequest, requestContext, unstable_dataStrategy);
    if (request.signal.aborted) {
      throwStaticHandlerAbortedError(request, isRouteRequest, future);
    }
    let activeDeferreds = /* @__PURE__ */ new Map();
    let context = processRouteLoaderData(matches, matchesToLoad, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling);
    let executedLoaders = new Set(matchesToLoad.map((match) => match.route.id));
    matches.forEach((match) => {
      if (!executedLoaders.has(match.route.id)) {
        context.loaderData[match.route.id] = null;
      }
    });
    return _extends({}, context, {
      matches,
      activeDeferreds: activeDeferreds.size > 0 ? Object.fromEntries(activeDeferreds.entries()) : null
    });
  }
  async function callDataStrategy(type, request, matchesToLoad, matches, isRouteRequest, requestContext, unstable_dataStrategy) {
    let results = await callDataStrategyImpl(unstable_dataStrategy || defaultDataStrategy, type, request, matchesToLoad, matches, manifest, mapRouteProperties, requestContext);
    return await Promise.all(results.map((result, i) => {
      if (isRedirectHandlerResult(result)) {
        let response = result.result;
        throw normalizeRelativeRoutingRedirectResponse(response, request, matchesToLoad[i].route.id, matches, basename, future.v7_relativeSplatPath);
      }
      if (isResponse$1(result.result) && isRouteRequest) {
        throw result;
      }
      return convertHandlerResultToDataResult(result);
    }));
  }
  return {
    dataRoutes,
    query,
    queryRoute
  };
}
function getStaticContextFromError(routes2, context, error) {
  let newContext = _extends({}, context, {
    statusCode: isRouteErrorResponse(error) ? error.status : 500,
    errors: {
      [context._deepestRenderedBoundaryId || routes2[0].id]: error
    }
  });
  return newContext;
}
function throwStaticHandlerAbortedError(request, isRouteRequest, future) {
  if (future.v7_throwAbortReason && request.signal.reason !== void 0) {
    throw request.signal.reason;
  }
  let method = isRouteRequest ? "queryRoute" : "query";
  throw new Error(method + "() call aborted: " + request.method + " " + request.url);
}
function isSubmissionNavigation(opts) {
  return opts != null && ("formData" in opts && opts.formData != null || "body" in opts && opts.body !== void 0);
}
function normalizeTo(location2, matches, basename, prependBasename, to, v7_relativeSplatPath, fromRouteId, relative) {
  let contextualMatches;
  let activeRouteMatch;
  if (fromRouteId) {
    contextualMatches = [];
    for (let match of matches) {
      contextualMatches.push(match);
      if (match.route.id === fromRouteId) {
        activeRouteMatch = match;
        break;
      }
    }
  } else {
    contextualMatches = matches;
    activeRouteMatch = matches[matches.length - 1];
  }
  let path = resolveTo(to ? to : ".", getResolveToMatches(contextualMatches, v7_relativeSplatPath), stripBasename(location2.pathname, basename) || location2.pathname, relative === "path");
  if (to == null) {
    path.search = location2.search;
    path.hash = location2.hash;
  }
  if ((to == null || to === "" || to === ".") && activeRouteMatch && activeRouteMatch.route.index && !hasNakedIndexQuery(path.search)) {
    path.search = path.search ? path.search.replace(/^\?/, "?index&") : "?index";
  }
  if (prependBasename && basename !== "/") {
    path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
  }
  return createPath(path);
}
function normalizeNavigateOptions(normalizeFormMethod, isFetcher, path, opts) {
  if (!opts || !isSubmissionNavigation(opts)) {
    return {
      path
    };
  }
  if (opts.formMethod && !isValidMethod(opts.formMethod)) {
    return {
      path,
      error: getInternalRouterError(405, {
        method: opts.formMethod
      })
    };
  }
  let getInvalidBodyError = () => ({
    path,
    error: getInternalRouterError(400, {
      type: "invalid-body"
    })
  });
  let rawFormMethod = opts.formMethod || "get";
  let formMethod = normalizeFormMethod ? rawFormMethod.toUpperCase() : rawFormMethod.toLowerCase();
  let formAction = stripHashFromPath(path);
  if (opts.body !== void 0) {
    if (opts.formEncType === "text/plain") {
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      let text = typeof opts.body === "string" ? opts.body : opts.body instanceof FormData || opts.body instanceof URLSearchParams ? (
        // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#plain-text-form-data
        Array.from(opts.body.entries()).reduce((acc, _ref5) => {
          let [name, value] = _ref5;
          return "" + acc + name + "=" + value + "\n";
        }, "")
      ) : String(opts.body);
      return {
        path,
        submission: {
          formMethod,
          formAction,
          formEncType: opts.formEncType,
          formData: void 0,
          json: void 0,
          text
        }
      };
    } else if (opts.formEncType === "application/json") {
      if (!isMutationMethod(formMethod)) {
        return getInvalidBodyError();
      }
      try {
        let json3 = typeof opts.body === "string" ? JSON.parse(opts.body) : opts.body;
        return {
          path,
          submission: {
            formMethod,
            formAction,
            formEncType: opts.formEncType,
            formData: void 0,
            json: json3,
            text: void 0
          }
        };
      } catch (e) {
        return getInvalidBodyError();
      }
    }
  }
  invariant(typeof FormData === "function", "FormData is not available in this environment");
  let searchParams;
  let formData;
  if (opts.formData) {
    searchParams = convertFormDataToSearchParams(opts.formData);
    formData = opts.formData;
  } else if (opts.body instanceof FormData) {
    searchParams = convertFormDataToSearchParams(opts.body);
    formData = opts.body;
  } else if (opts.body instanceof URLSearchParams) {
    searchParams = opts.body;
    formData = convertSearchParamsToFormData(searchParams);
  } else if (opts.body == null) {
    searchParams = new URLSearchParams();
    formData = new FormData();
  } else {
    try {
      searchParams = new URLSearchParams(opts.body);
      formData = convertSearchParamsToFormData(searchParams);
    } catch (e) {
      return getInvalidBodyError();
    }
  }
  let submission = {
    formMethod,
    formAction,
    formEncType: opts && opts.formEncType || "application/x-www-form-urlencoded",
    formData,
    json: void 0,
    text: void 0
  };
  if (isMutationMethod(submission.formMethod)) {
    return {
      path,
      submission
    };
  }
  let parsedPath = parsePath(path);
  if (isFetcher && parsedPath.search && hasNakedIndexQuery(parsedPath.search)) {
    searchParams.append("index", "");
  }
  parsedPath.search = "?" + searchParams;
  return {
    path: createPath(parsedPath),
    submission
  };
}
function getLoaderMatchesUntilBoundary(matches, boundaryId) {
  let boundaryMatches = matches;
  if (boundaryId) {
    let index = matches.findIndex((m) => m.route.id === boundaryId);
    if (index >= 0) {
      boundaryMatches = matches.slice(0, index);
    }
  }
  return boundaryMatches;
}
function getMatchesToLoad(history, state, matches, submission, location2, isInitialLoad, skipActionErrorRevalidation, isRevalidationRequired, cancelledDeferredRoutes, cancelledFetcherLoads, deletedFetchers, fetchLoadMatches, fetchRedirectIds, routesToUse, basename, pendingActionResult) {
  let actionResult = pendingActionResult ? isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : pendingActionResult[1].data : void 0;
  let currentUrl = history.createURL(state.location);
  let nextUrl = history.createURL(location2);
  let boundaryId = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[0] : void 0;
  let boundaryMatches = boundaryId ? getLoaderMatchesUntilBoundary(matches, boundaryId) : matches;
  let actionStatus = pendingActionResult ? pendingActionResult[1].statusCode : void 0;
  let shouldSkipRevalidation = skipActionErrorRevalidation && actionStatus && actionStatus >= 400;
  let navigationMatches = boundaryMatches.filter((match, index) => {
    let {
      route
    } = match;
    if (route.lazy) {
      return true;
    }
    if (route.loader == null) {
      return false;
    }
    if (isInitialLoad) {
      if (typeof route.loader !== "function" || route.loader.hydrate) {
        return true;
      }
      return state.loaderData[route.id] === void 0 && // Don't re-run if the loader ran and threw an error
      (!state.errors || state.errors[route.id] === void 0);
    }
    if (isNewLoader(state.loaderData, state.matches[index], match) || cancelledDeferredRoutes.some((id) => id === match.route.id)) {
      return true;
    }
    let currentRouteMatch = state.matches[index];
    let nextRouteMatch = match;
    return shouldRevalidateLoader(match, _extends({
      currentUrl,
      currentParams: currentRouteMatch.params,
      nextUrl,
      nextParams: nextRouteMatch.params
    }, submission, {
      actionResult,
      unstable_actionStatus: actionStatus,
      defaultShouldRevalidate: shouldSkipRevalidation ? false : (
        // Forced revalidation due to submission, useRevalidator, or X-Remix-Revalidate
        isRevalidationRequired || currentUrl.pathname + currentUrl.search === nextUrl.pathname + nextUrl.search || // Search params affect all loaders
        currentUrl.search !== nextUrl.search || isNewRouteInstance(currentRouteMatch, nextRouteMatch)
      )
    }));
  });
  let revalidatingFetchers = [];
  fetchLoadMatches.forEach((f, key) => {
    if (isInitialLoad || !matches.some((m) => m.route.id === f.routeId) || deletedFetchers.has(key)) {
      return;
    }
    let fetcherMatches = matchRoutes(routesToUse, f.path, basename);
    if (!fetcherMatches) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: null,
        match: null,
        controller: null
      });
      return;
    }
    let fetcher = state.fetchers.get(key);
    let fetcherMatch = getTargetMatch(fetcherMatches, f.path);
    let shouldRevalidate = false;
    if (fetchRedirectIds.has(key)) {
      shouldRevalidate = false;
    } else if (cancelledFetcherLoads.includes(key)) {
      shouldRevalidate = true;
    } else if (fetcher && fetcher.state !== "idle" && fetcher.data === void 0) {
      shouldRevalidate = isRevalidationRequired;
    } else {
      shouldRevalidate = shouldRevalidateLoader(fetcherMatch, _extends({
        currentUrl,
        currentParams: state.matches[state.matches.length - 1].params,
        nextUrl,
        nextParams: matches[matches.length - 1].params
      }, submission, {
        actionResult,
        unstable_actionStatus: actionStatus,
        defaultShouldRevalidate: shouldSkipRevalidation ? false : isRevalidationRequired
      }));
    }
    if (shouldRevalidate) {
      revalidatingFetchers.push({
        key,
        routeId: f.routeId,
        path: f.path,
        matches: fetcherMatches,
        match: fetcherMatch,
        controller: new AbortController()
      });
    }
  });
  return [navigationMatches, revalidatingFetchers];
}
function isNewLoader(currentLoaderData, currentMatch, match) {
  let isNew = (
    // [a] -> [a, b]
    !currentMatch || // [a, b] -> [a, c]
    match.route.id !== currentMatch.route.id
  );
  let isMissingData = currentLoaderData[match.route.id] === void 0;
  return isNew || isMissingData;
}
function isNewRouteInstance(currentMatch, match) {
  let currentPath = currentMatch.route.path;
  return (
    // param change for this match, /users/123 -> /users/456
    currentMatch.pathname !== match.pathname || // splat param changed, which is not present in match.path
    // e.g. /files/images/avatar.jpg -> files/finances.xls
    currentPath != null && currentPath.endsWith("*") && currentMatch.params["*"] !== match.params["*"]
  );
}
function shouldRevalidateLoader(loaderMatch, arg) {
  if (loaderMatch.route.shouldRevalidate) {
    let routeChoice = loaderMatch.route.shouldRevalidate(arg);
    if (typeof routeChoice === "boolean") {
      return routeChoice;
    }
  }
  return arg.defaultShouldRevalidate;
}
async function loadLazyRouteModule(route, mapRouteProperties, manifest) {
  if (!route.lazy) {
    return;
  }
  let lazyRoute = await route.lazy();
  if (!route.lazy) {
    return;
  }
  let routeToUpdate = manifest[route.id];
  invariant(routeToUpdate, "No route found in manifest");
  let routeUpdates = {};
  for (let lazyRouteProperty in lazyRoute) {
    let staticRouteValue = routeToUpdate[lazyRouteProperty];
    let isPropertyStaticallyDefined = staticRouteValue !== void 0 && // This property isn't static since it should always be updated based
    // on the route updates
    lazyRouteProperty !== "hasErrorBoundary";
    warning(!isPropertyStaticallyDefined, 'Route "' + routeToUpdate.id + '" has a static property "' + lazyRouteProperty + '" defined but its lazy function is also returning a value for this property. ' + ('The lazy route property "' + lazyRouteProperty + '" will be ignored.'));
    if (!isPropertyStaticallyDefined && !immutableRouteKeys.has(lazyRouteProperty)) {
      routeUpdates[lazyRouteProperty] = lazyRoute[lazyRouteProperty];
    }
  }
  Object.assign(routeToUpdate, routeUpdates);
  Object.assign(routeToUpdate, _extends({}, mapRouteProperties(routeToUpdate), {
    lazy: void 0
  }));
}
function defaultDataStrategy(opts) {
  return Promise.all(opts.matches.map((m) => m.resolve()));
}
async function callDataStrategyImpl(dataStrategyImpl, type, request, matchesToLoad, matches, manifest, mapRouteProperties, requestContext) {
  let routeIdsToLoad = matchesToLoad.reduce((acc, m) => acc.add(m.route.id), /* @__PURE__ */ new Set());
  let loadedMatches = /* @__PURE__ */ new Set();
  let results = await dataStrategyImpl({
    matches: matches.map((match) => {
      let shouldLoad = routeIdsToLoad.has(match.route.id);
      let resolve = (handlerOverride) => {
        loadedMatches.add(match.route.id);
        return shouldLoad ? callLoaderOrAction(type, request, match, manifest, mapRouteProperties, handlerOverride, requestContext) : Promise.resolve({
          type: ResultType.data,
          result: void 0
        });
      };
      return _extends({}, match, {
        shouldLoad,
        resolve
      });
    }),
    request,
    params: matches[0].params,
    context: requestContext
  });
  matches.forEach((m) => invariant(loadedMatches.has(m.route.id), '`match.resolve()` was not called for route id "' + m.route.id + '". You must call `match.resolve()` on every match passed to `dataStrategy` to ensure all routes are properly loaded.'));
  return results.filter((_, i) => routeIdsToLoad.has(matches[i].route.id));
}
async function callLoaderOrAction(type, request, match, manifest, mapRouteProperties, handlerOverride, staticContext) {
  let result;
  let onReject;
  let runHandler = (handler) => {
    let reject;
    let abortPromise = new Promise((_, r) => reject = r);
    onReject = () => reject();
    request.signal.addEventListener("abort", onReject);
    let actualHandler = (ctx) => {
      if (typeof handler !== "function") {
        return Promise.reject(new Error("You cannot call the handler for a route which defines a boolean " + ('"' + type + '" [routeId: ' + match.route.id + "]")));
      }
      return handler({
        request,
        params: match.params,
        context: staticContext
      }, ...ctx !== void 0 ? [ctx] : []);
    };
    let handlerPromise;
    if (handlerOverride) {
      handlerPromise = handlerOverride((ctx) => actualHandler(ctx));
    } else {
      handlerPromise = (async () => {
        try {
          let val = await actualHandler();
          return {
            type: "data",
            result: val
          };
        } catch (e) {
          return {
            type: "error",
            result: e
          };
        }
      })();
    }
    return Promise.race([handlerPromise, abortPromise]);
  };
  try {
    let handler = match.route[type];
    if (match.route.lazy) {
      if (handler) {
        let handlerError;
        let [value] = await Promise.all([
          // If the handler throws, don't let it immediately bubble out,
          // since we need to let the lazy() execution finish so we know if this
          // route has a boundary that can handle the error
          runHandler(handler).catch((e) => {
            handlerError = e;
          }),
          loadLazyRouteModule(match.route, mapRouteProperties, manifest)
        ]);
        if (handlerError !== void 0) {
          throw handlerError;
        }
        result = value;
      } else {
        await loadLazyRouteModule(match.route, mapRouteProperties, manifest);
        handler = match.route[type];
        if (handler) {
          result = await runHandler(handler);
        } else if (type === "action") {
          let url = new URL(request.url);
          let pathname = url.pathname + url.search;
          throw getInternalRouterError(405, {
            method: request.method,
            pathname,
            routeId: match.route.id
          });
        } else {
          return {
            type: ResultType.data,
            result: void 0
          };
        }
      }
    } else if (!handler) {
      let url = new URL(request.url);
      let pathname = url.pathname + url.search;
      throw getInternalRouterError(404, {
        pathname
      });
    } else {
      result = await runHandler(handler);
    }
    invariant(result.result !== void 0, "You defined " + (type === "action" ? "an action" : "a loader") + " for route " + ('"' + match.route.id + "\" but didn't return anything from your `" + type + "` ") + "function. Please return a value or `null`.");
  } catch (e) {
    return {
      type: ResultType.error,
      result: e
    };
  } finally {
    if (onReject) {
      request.signal.removeEventListener("abort", onReject);
    }
  }
  return result;
}
async function convertHandlerResultToDataResult(handlerResult) {
  let {
    result,
    type,
    status
  } = handlerResult;
  if (isResponse$1(result)) {
    let data;
    try {
      let contentType = result.headers.get("Content-Type");
      if (contentType && /\bapplication\/json\b/.test(contentType)) {
        if (result.body == null) {
          data = null;
        } else {
          data = await result.json();
        }
      } else {
        data = await result.text();
      }
    } catch (e) {
      return {
        type: ResultType.error,
        error: e
      };
    }
    if (type === ResultType.error) {
      return {
        type: ResultType.error,
        error: new ErrorResponseImpl(result.status, result.statusText, data),
        statusCode: result.status,
        headers: result.headers
      };
    }
    return {
      type: ResultType.data,
      data,
      statusCode: result.status,
      headers: result.headers
    };
  }
  if (type === ResultType.error) {
    return {
      type: ResultType.error,
      error: result,
      statusCode: isRouteErrorResponse(result) ? result.status : status
    };
  }
  if (isDeferredData$1(result)) {
    var _result$init, _result$init2;
    return {
      type: ResultType.deferred,
      deferredData: result,
      statusCode: (_result$init = result.init) == null ? void 0 : _result$init.status,
      headers: ((_result$init2 = result.init) == null ? void 0 : _result$init2.headers) && new Headers(result.init.headers)
    };
  }
  return {
    type: ResultType.data,
    data: result,
    statusCode: status
  };
}
function normalizeRelativeRoutingRedirectResponse(response, request, routeId, matches, basename, v7_relativeSplatPath) {
  let location2 = response.headers.get("Location");
  invariant(location2, "Redirects returned/thrown from loaders/actions must have a Location header");
  if (!ABSOLUTE_URL_REGEX.test(location2)) {
    let trimmedMatches = matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1);
    location2 = normalizeTo(new URL(request.url), trimmedMatches, basename, true, location2, v7_relativeSplatPath);
    response.headers.set("Location", location2);
  }
  return response;
}
function normalizeRedirectLocation(location2, currentUrl, basename) {
  if (ABSOLUTE_URL_REGEX.test(location2)) {
    let normalizedLocation = location2;
    let url = normalizedLocation.startsWith("//") ? new URL(currentUrl.protocol + normalizedLocation) : new URL(normalizedLocation);
    let isSameBasename = stripBasename(url.pathname, basename) != null;
    if (url.origin === currentUrl.origin && isSameBasename) {
      return url.pathname + url.search + url.hash;
    }
  }
  return location2;
}
function createClientSideRequest(history, location2, signal, submission) {
  let url = history.createURL(stripHashFromPath(location2)).toString();
  let init = {
    signal
  };
  if (submission && isMutationMethod(submission.formMethod)) {
    let {
      formMethod,
      formEncType
    } = submission;
    init.method = formMethod.toUpperCase();
    if (formEncType === "application/json") {
      init.headers = new Headers({
        "Content-Type": formEncType
      });
      init.body = JSON.stringify(submission.json);
    } else if (formEncType === "text/plain") {
      init.body = submission.text;
    } else if (formEncType === "application/x-www-form-urlencoded" && submission.formData) {
      init.body = convertFormDataToSearchParams(submission.formData);
    } else {
      init.body = submission.formData;
    }
  }
  return new Request(url, init);
}
function convertFormDataToSearchParams(formData) {
  let searchParams = new URLSearchParams();
  for (let [key, value] of formData.entries()) {
    searchParams.append(key, typeof value === "string" ? value : value.name);
  }
  return searchParams;
}
function convertSearchParamsToFormData(searchParams) {
  let formData = new FormData();
  for (let [key, value] of searchParams.entries()) {
    formData.append(key, value);
  }
  return formData;
}
function processRouteLoaderData(matches, matchesToLoad, results, pendingActionResult, activeDeferreds, skipLoaderErrorBubbling) {
  let loaderData = {};
  let errors2 = null;
  let statusCode;
  let foundError = false;
  let loaderHeaders = {};
  let pendingError = pendingActionResult && isErrorResult(pendingActionResult[1]) ? pendingActionResult[1].error : void 0;
  results.forEach((result, index) => {
    let id = matchesToLoad[index].route.id;
    invariant(!isRedirectResult(result), "Cannot handle redirect results in processLoaderData");
    if (isErrorResult(result)) {
      let error = result.error;
      if (pendingError !== void 0) {
        error = pendingError;
        pendingError = void 0;
      }
      errors2 = errors2 || {};
      if (skipLoaderErrorBubbling) {
        errors2[id] = error;
      } else {
        let boundaryMatch = findNearestBoundary(matches, id);
        if (errors2[boundaryMatch.route.id] == null) {
          errors2[boundaryMatch.route.id] = error;
        }
      }
      loaderData[id] = void 0;
      if (!foundError) {
        foundError = true;
        statusCode = isRouteErrorResponse(result.error) ? result.error.status : 500;
      }
      if (result.headers) {
        loaderHeaders[id] = result.headers;
      }
    } else {
      if (isDeferredResult(result)) {
        activeDeferreds.set(id, result.deferredData);
        loaderData[id] = result.deferredData.data;
        if (result.statusCode != null && result.statusCode !== 200 && !foundError) {
          statusCode = result.statusCode;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      } else {
        loaderData[id] = result.data;
        if (result.statusCode && result.statusCode !== 200 && !foundError) {
          statusCode = result.statusCode;
        }
        if (result.headers) {
          loaderHeaders[id] = result.headers;
        }
      }
    }
  });
  if (pendingError !== void 0 && pendingActionResult) {
    errors2 = {
      [pendingActionResult[0]]: pendingError
    };
    loaderData[pendingActionResult[0]] = void 0;
  }
  return {
    loaderData,
    errors: errors2,
    statusCode: statusCode || 200,
    loaderHeaders
  };
}
function processLoaderData(state, matches, matchesToLoad, results, pendingActionResult, revalidatingFetchers, fetcherResults, activeDeferreds) {
  let {
    loaderData,
    errors: errors2
  } = processRouteLoaderData(
    matches,
    matchesToLoad,
    results,
    pendingActionResult,
    activeDeferreds,
    false
    // This method is only called client side so we always want to bubble
  );
  for (let index = 0; index < revalidatingFetchers.length; index++) {
    let {
      key,
      match,
      controller
    } = revalidatingFetchers[index];
    invariant(fetcherResults !== void 0 && fetcherResults[index] !== void 0, "Did not find corresponding fetcher result");
    let result = fetcherResults[index];
    if (controller && controller.signal.aborted) {
      continue;
    } else if (isErrorResult(result)) {
      let boundaryMatch = findNearestBoundary(state.matches, match == null ? void 0 : match.route.id);
      if (!(errors2 && errors2[boundaryMatch.route.id])) {
        errors2 = _extends({}, errors2, {
          [boundaryMatch.route.id]: result.error
        });
      }
      state.fetchers.delete(key);
    } else if (isRedirectResult(result)) {
      invariant(false, "Unhandled fetcher revalidation redirect");
    } else if (isDeferredResult(result)) {
      invariant(false, "Unhandled fetcher deferred data");
    } else {
      let doneFetcher = getDoneFetcher(result.data);
      state.fetchers.set(key, doneFetcher);
    }
  }
  return {
    loaderData,
    errors: errors2
  };
}
function mergeLoaderData(loaderData, newLoaderData, matches, errors2) {
  let mergedLoaderData = _extends({}, newLoaderData);
  for (let match of matches) {
    let id = match.route.id;
    if (newLoaderData.hasOwnProperty(id)) {
      if (newLoaderData[id] !== void 0) {
        mergedLoaderData[id] = newLoaderData[id];
      }
    } else if (loaderData[id] !== void 0 && match.route.loader) {
      mergedLoaderData[id] = loaderData[id];
    }
    if (errors2 && errors2.hasOwnProperty(id)) {
      break;
    }
  }
  return mergedLoaderData;
}
function getActionDataForCommit(pendingActionResult) {
  if (!pendingActionResult) {
    return {};
  }
  return isErrorResult(pendingActionResult[1]) ? {
    // Clear out prior actionData on errors
    actionData: {}
  } : {
    actionData: {
      [pendingActionResult[0]]: pendingActionResult[1].data
    }
  };
}
function findNearestBoundary(matches, routeId) {
  let eligibleMatches = routeId ? matches.slice(0, matches.findIndex((m) => m.route.id === routeId) + 1) : [...matches];
  return eligibleMatches.reverse().find((m) => m.route.hasErrorBoundary === true) || matches[0];
}
function getShortCircuitMatches(routes2) {
  let route = routes2.length === 1 ? routes2[0] : routes2.find((r) => r.index || !r.path || r.path === "/") || {
    id: "__shim-error-route__"
  };
  return {
    matches: [{
      params: {},
      pathname: "",
      pathnameBase: "",
      route
    }],
    route
  };
}
function getInternalRouterError(status, _temp5) {
  let {
    pathname,
    routeId,
    method,
    type
  } = _temp5 === void 0 ? {} : _temp5;
  let statusText = "Unknown Server Error";
  let errorMessage = "Unknown @remix-run/router error";
  if (status === 400) {
    statusText = "Bad Request";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method + ' request to "' + pathname + '" but ' + ('did not provide a `loader` for route "' + routeId + '", ') + "so there is no way to handle the request.";
    } else if (type === "defer-action") {
      errorMessage = "defer() is not supported in actions";
    } else if (type === "invalid-body") {
      errorMessage = "Unable to encode submission body";
    }
  } else if (status === 403) {
    statusText = "Forbidden";
    errorMessage = 'Route "' + routeId + '" does not match URL "' + pathname + '"';
  } else if (status === 404) {
    statusText = "Not Found";
    errorMessage = 'No route matches URL "' + pathname + '"';
  } else if (status === 405) {
    statusText = "Method Not Allowed";
    if (method && pathname && routeId) {
      errorMessage = "You made a " + method.toUpperCase() + ' request to "' + pathname + '" but ' + ('did not provide an `action` for route "' + routeId + '", ') + "so there is no way to handle the request.";
    } else if (method) {
      errorMessage = 'Invalid request method "' + method.toUpperCase() + '"';
    }
  }
  return new ErrorResponseImpl(status || 500, statusText, new Error(errorMessage), true);
}
function findRedirect(results) {
  for (let i = results.length - 1; i >= 0; i--) {
    let result = results[i];
    if (isRedirectResult(result)) {
      return {
        result,
        idx: i
      };
    }
  }
}
function stripHashFromPath(path) {
  let parsedPath = typeof path === "string" ? parsePath(path) : path;
  return createPath(_extends({}, parsedPath, {
    hash: ""
  }));
}
function isHashChangeOnly(a, b) {
  if (a.pathname !== b.pathname || a.search !== b.search) {
    return false;
  }
  if (a.hash === "") {
    return b.hash !== "";
  } else if (a.hash === b.hash) {
    return true;
  } else if (b.hash !== "") {
    return true;
  }
  return false;
}
function isHandlerResult(result) {
  return result != null && typeof result === "object" && "type" in result && "result" in result && (result.type === ResultType.data || result.type === ResultType.error);
}
function isRedirectHandlerResult(result) {
  return isResponse$1(result.result) && redirectStatusCodes$1.has(result.result.status);
}
function isDeferredResult(result) {
  return result.type === ResultType.deferred;
}
function isErrorResult(result) {
  return result.type === ResultType.error;
}
function isRedirectResult(result) {
  return (result && result.type) === ResultType.redirect;
}
function isDeferredData$1(value) {
  let deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
function isResponse$1(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
function isRedirectResponse$1(result) {
  if (!isResponse$1(result)) {
    return false;
  }
  let status = result.status;
  let location2 = result.headers.get("Location");
  return status >= 300 && status <= 399 && location2 != null;
}
function isValidMethod(method) {
  return validRequestMethods.has(method.toLowerCase());
}
function isMutationMethod(method) {
  return validMutationMethods.has(method.toLowerCase());
}
async function resolveDeferredResults(currentMatches, matchesToLoad, results, signals, isFetcher, currentLoaderData) {
  for (let index = 0; index < results.length; index++) {
    let result = results[index];
    let match = matchesToLoad[index];
    if (!match) {
      continue;
    }
    let currentMatch = currentMatches.find((m) => m.route.id === match.route.id);
    let isRevalidatingLoader = currentMatch != null && !isNewRouteInstance(currentMatch, match) && (currentLoaderData && currentLoaderData[match.route.id]) !== void 0;
    if (isDeferredResult(result) && (isFetcher || isRevalidatingLoader)) {
      let signal = signals[index];
      invariant(signal, "Expected an AbortSignal for revalidating fetcher deferred result");
      await resolveDeferredData(result, signal, isFetcher).then((result2) => {
        if (result2) {
          results[index] = result2 || results[index];
        }
      });
    }
  }
}
async function resolveDeferredData(result, signal, unwrap) {
  if (unwrap === void 0) {
    unwrap = false;
  }
  let aborted = await result.deferredData.resolveData(signal);
  if (aborted) {
    return;
  }
  if (unwrap) {
    try {
      return {
        type: ResultType.data,
        data: result.deferredData.unwrappedData
      };
    } catch (e) {
      return {
        type: ResultType.error,
        error: e
      };
    }
  }
  return {
    type: ResultType.data,
    data: result.deferredData.data
  };
}
function hasNakedIndexQuery(search) {
  return new URLSearchParams(search).getAll("index").some((v) => v === "");
}
function getTargetMatch(matches, location2) {
  let search = typeof location2 === "string" ? parsePath(location2).search : location2.search;
  if (matches[matches.length - 1].route.index && hasNakedIndexQuery(search || "")) {
    return matches[matches.length - 1];
  }
  let pathMatches = getPathContributingMatches(matches);
  return pathMatches[pathMatches.length - 1];
}
function getSubmissionFromNavigation(navigation) {
  let {
    formMethod,
    formAction,
    formEncType,
    text,
    formData,
    json: json3
  } = navigation;
  if (!formMethod || !formAction || !formEncType) {
    return;
  }
  if (text != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: void 0,
      json: void 0,
      text
    };
  } else if (formData != null) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData,
      json: void 0,
      text: void 0
    };
  } else if (json3 !== void 0) {
    return {
      formMethod,
      formAction,
      formEncType,
      formData: void 0,
      json: json3,
      text: void 0
    };
  }
}
function getLoadingNavigation(location2, submission) {
  if (submission) {
    let navigation = {
      state: "loading",
      location: location2,
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text
    };
    return navigation;
  } else {
    let navigation = {
      state: "loading",
      location: location2,
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0
    };
    return navigation;
  }
}
function getSubmittingNavigation(location2, submission) {
  let navigation = {
    state: "submitting",
    location: location2,
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text
  };
  return navigation;
}
function getLoadingFetcher(submission, data) {
  if (submission) {
    let fetcher = {
      state: "loading",
      formMethod: submission.formMethod,
      formAction: submission.formAction,
      formEncType: submission.formEncType,
      formData: submission.formData,
      json: submission.json,
      text: submission.text,
      data
    };
    return fetcher;
  } else {
    let fetcher = {
      state: "loading",
      formMethod: void 0,
      formAction: void 0,
      formEncType: void 0,
      formData: void 0,
      json: void 0,
      text: void 0,
      data
    };
    return fetcher;
  }
}
function getSubmittingFetcher(submission, existingFetcher) {
  let fetcher = {
    state: "submitting",
    formMethod: submission.formMethod,
    formAction: submission.formAction,
    formEncType: submission.formEncType,
    formData: submission.formData,
    json: submission.json,
    text: submission.text,
    data: existingFetcher ? existingFetcher.data : void 0
  };
  return fetcher;
}
function getDoneFetcher(data) {
  let fetcher = {
    state: "idle",
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data
  };
  return fetcher;
}
function restoreAppliedTransitions(_window, transitions) {
  try {
    let sessionPositions = _window.sessionStorage.getItem(TRANSITIONS_STORAGE_KEY);
    if (sessionPositions) {
      let json3 = JSON.parse(sessionPositions);
      for (let [k, v] of Object.entries(json3 || {})) {
        if (v && Array.isArray(v)) {
          transitions.set(k, new Set(v || []));
        }
      }
    }
  } catch (e) {
  }
}
function persistAppliedTransitions(_window, transitions) {
  if (transitions.size > 0) {
    let json3 = {};
    for (let [k, v] of transitions) {
      json3[k] = [...v];
    }
    try {
      _window.sessionStorage.setItem(TRANSITIONS_STORAGE_KEY, JSON.stringify(json3));
    } catch (error) {
      warning(false, "Failed to save applied view transitions in sessionStorage (" + error + ").");
    }
  }
}
const router$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AbortedDeferredError,
  get Action() {
    return Action;
  },
  IDLE_BLOCKER,
  IDLE_FETCHER,
  IDLE_NAVIGATION,
  UNSAFE_DEFERRED_SYMBOL,
  UNSAFE_DeferredData: DeferredData,
  UNSAFE_ErrorResponseImpl: ErrorResponseImpl,
  UNSAFE_convertRouteMatchToUiMatch: convertRouteMatchToUiMatch,
  UNSAFE_convertRoutesToDataRoutes: convertRoutesToDataRoutes,
  UNSAFE_getResolveToMatches: getResolveToMatches,
  UNSAFE_invariant: invariant,
  UNSAFE_warning: warning,
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory,
  createPath,
  createRouter,
  createStaticHandler,
  defer: defer$1,
  generatePath,
  getStaticContextFromError,
  getToPathname,
  isDeferredData: isDeferredData$1,
  isRouteErrorResponse,
  joinPaths,
  json: json$1,
  matchPath,
  matchRoutes,
  normalizePathname,
  parsePath,
  redirect: redirect$1,
  redirectDocument: redirectDocument$1,
  resolvePath,
  resolveTo,
  stripBasename
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(router$2);
var errors$2 = {};
const require$$1$1 = /* @__PURE__ */ getAugmentedNamespace(mode$1);
/**
 * @remix-run/server-runtime v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
Object.defineProperty(errors$2, "__esModule", { value: true });
var router$1 = require$$0;
var mode = require$$1$1;
function sanitizeError(error, serverMode) {
  if (error instanceof Error && serverMode !== mode.ServerMode.Development) {
    let sanitized = new Error("Unexpected Server Error");
    sanitized.stack = void 0;
    return sanitized;
  }
  return error;
}
function sanitizeErrors(errors2, serverMode) {
  return Object.entries(errors2).reduce((acc, [routeId, error]) => {
    return Object.assign(acc, {
      [routeId]: sanitizeError(error, serverMode)
    });
  }, {});
}
function serializeError(error, serverMode) {
  let sanitized = sanitizeError(error, serverMode);
  return {
    message: sanitized.message,
    stack: sanitized.stack
  };
}
function serializeErrors(errors2, serverMode) {
  if (!errors2)
    return null;
  let entries = Object.entries(errors2);
  let serialized = {};
  for (let [key, val] of entries) {
    if (router$1.isRouteErrorResponse(val)) {
      serialized[key] = {
        ...val,
        __type: "RouteErrorResponse"
      };
    } else if (val instanceof Error) {
      let sanitized = sanitizeError(val, serverMode);
      serialized[key] = {
        message: sanitized.message,
        stack: sanitized.stack,
        __type: "Error",
        // If this is a subclass (i.e., ReferenceError), send up the type so we
        // can re-create the same type during hydration.  This will only apply
        // in dev mode since all production errors are sanitized to normal
        // Error instances
        ...sanitized.name !== "Error" ? {
          __subType: sanitized.name
        } : {}
      };
    } else {
      serialized[key] = val;
    }
  }
  return serialized;
}
var sanitizeError_1 = errors$2.sanitizeError = sanitizeError;
var sanitizeErrors_1 = errors$2.sanitizeErrors = sanitizeErrors;
var serializeError_1 = errors$2.serializeError = serializeError;
var serializeErrors_1 = errors$2.serializeErrors = serializeErrors;
const errors$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: errors$2,
  sanitizeError: sanitizeError_1,
  sanitizeErrors: sanitizeErrors_1,
  serializeError: serializeError_1,
  serializeErrors: serializeErrors_1
}, [errors$2]);
const require$$1 = /* @__PURE__ */ getAugmentedNamespace(errors$1);
/**
 * @remix-run/server-runtime v2.9.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
Object.defineProperty(responses, "__esModule", { value: true });
var router = require$$0;
var errors = require$$1;
const json2 = (data, init = {}) => {
  return router.json(data, init);
};
const defer2 = (data, init = {}) => {
  return router.defer(data, init);
};
const redirect2 = (url, init = 302) => {
  return router.redirect(url, init);
};
const redirectDocument = (url, init = 302) => {
  return router.redirectDocument(url, init);
};
function isDeferredData(value) {
  let deferred = value;
  return deferred && typeof deferred === "object" && typeof deferred.data === "object" && typeof deferred.subscribe === "function" && typeof deferred.cancel === "function" && typeof deferred.resolveData === "function";
}
function isResponse(value) {
  return value != null && typeof value.status === "number" && typeof value.statusText === "string" && typeof value.headers === "object" && typeof value.body !== "undefined";
}
const redirectStatusCodes = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function isRedirectStatusCode(statusCode) {
  return redirectStatusCodes.has(statusCode);
}
function isRedirectResponse(response) {
  return isRedirectStatusCode(response.status);
}
function isTrackedPromise(value) {
  return value != null && typeof value.then === "function" && value._tracked === true;
}
const DEFERRED_VALUE_PLACEHOLDER_PREFIX = "__deferred_promise:";
function createDeferredReadableStream(deferredData, signal, serverMode) {
  let encoder = new TextEncoder();
  let stream = new ReadableStream({
    async start(controller) {
      let criticalData = {};
      let preresolvedKeys = [];
      for (let [key, value] of Object.entries(deferredData.data)) {
        if (isTrackedPromise(value)) {
          criticalData[key] = `${DEFERRED_VALUE_PLACEHOLDER_PREFIX}${key}`;
          if (typeof value._data !== "undefined" || typeof value._error !== "undefined") {
            preresolvedKeys.push(key);
          }
        } else {
          criticalData[key] = value;
        }
      }
      controller.enqueue(encoder.encode(JSON.stringify(criticalData) + "\n\n"));
      for (let preresolvedKey of preresolvedKeys) {
        enqueueTrackedPromise(controller, encoder, preresolvedKey, deferredData.data[preresolvedKey], serverMode);
      }
      let unsubscribe = deferredData.subscribe((aborted, settledKey) => {
        if (settledKey) {
          enqueueTrackedPromise(controller, encoder, settledKey, deferredData.data[settledKey], serverMode);
        }
      });
      await deferredData.resolveData(signal);
      unsubscribe();
      controller.close();
    }
  });
  return stream;
}
function enqueueTrackedPromise(controller, encoder, settledKey, promise, serverMode) {
  if ("_error" in promise) {
    controller.enqueue(encoder.encode("error:" + JSON.stringify({
      [settledKey]: promise._error instanceof Error ? errors.serializeError(promise._error, serverMode) : promise._error
    }) + "\n\n"));
  } else {
    controller.enqueue(encoder.encode("data:" + JSON.stringify({
      [settledKey]: promise._data ?? null
    }) + "\n\n"));
  }
}
var createDeferredReadableStream_1 = responses.createDeferredReadableStream = createDeferredReadableStream;
responses.defer = defer2;
var isDeferredData_1 = responses.isDeferredData = isDeferredData;
var isRedirectResponse_1 = responses.isRedirectResponse = isRedirectResponse;
var isRedirectStatusCode_1 = responses.isRedirectStatusCode = isRedirectStatusCode;
var isResponse_1 = responses.isResponse = isResponse;
var json_1 = responses.json = json2;
var redirect_1 = responses.redirect = redirect2;
responses.redirectDocument = redirectDocument;
function clone(_object) {
  const init = {};
  for (const property in _object) {
    init[property] = _object[property];
  }
  return init;
}
function getURLParameters(request, path = "") {
  const url = new URL(request.url);
  const match = matchPath$1(path, url.pathname);
  return {
    ...Object.fromEntries(new URL(request.url).searchParams.entries()),
    ...match == null ? void 0 : match.params
  };
}
function stripIndexParameter(request) {
  const url = new URL(request.url);
  const indexValues = url.searchParams.getAll("index");
  const indexValuesToKeep = [];
  url.searchParams.delete("index");
  for (const indexValue of indexValues) {
    if (indexValue) {
      indexValuesToKeep.push(indexValue);
    }
  }
  for (const toKeep of indexValuesToKeep) {
    url.searchParams.append("index", toKeep);
  }
  return new Request(url.href, { ...clone(request), duplex: "half" });
}
function stripDataParameter(request) {
  const url = new URL(request.url);
  url.searchParams.delete("_data");
  return new Request(url.href, { ...clone(request), duplex: "half" });
}
function createArgumentsFrom({ event, loadContext, path }) {
  const request = stripDataParameter(stripIndexParameter(event.request.clone()));
  const parameters = getURLParameters(request, path);
  return {
    request,
    params: parameters,
    context: loadContext
  };
}
function isMethod(request, methods) {
  return methods.includes(request.method.toLowerCase());
}
function isActionRequest(request) {
  const url = new URL(request.url);
  return isMethod(request, ["post", "delete", "put", "patch"]) && url.searchParams.get("_data");
}
function isLoaderRequest(request) {
  const url = new URL(request.url);
  return isMethod(request, ["get"]) && url.searchParams.get("_data");
}
function errorResponseToJson(errorResponse) {
  return json_1(errorResponse.error || { message: "Unexpected Server Error" }, {
    status: errorResponse.status,
    statusText: errorResponse.statusText,
    headers: {
      "X-Remix-Error": "yes"
    }
  });
}
function isRemixResponse(response) {
  return Array.from(response.headers.keys()).some((key) => key.toLowerCase().startsWith("x-remix-"));
}
async function handleRequest({ defaultHandler: defaultHandler2, errorHandler, event, loadContext, routes: routes2 }) {
  var _a;
  const url = new URL(event.request.url);
  const routeId = url.searchParams.get("_data");
  const route = routeId ? routes2[routeId] : void 0;
  const _arguments = {
    request: event.request,
    params: getURLParameters(event.request, route == null ? void 0 : route.path),
    context: loadContext
  };
  try {
    if (isLoaderRequest(event.request) && (route == null ? void 0 : route.module.workerLoader)) {
      return await handleLoader({
        event,
        loader: route.module.workerLoader,
        routeId: route.id,
        routePath: route.path,
        loadContext
      }).then(responseHandler);
    }
    if (isActionRequest(event.request) && ((_a = route == null ? void 0 : route.module) == null ? void 0 : _a.workerAction)) {
      return await handleAction({
        event,
        action: route.module.workerAction,
        routeId: route.id,
        routePath: route.path,
        loadContext
      }).then(responseHandler);
    }
  } catch (error) {
    const handler = (error2) => errorHandler(error2, _arguments);
    return _errorHandler({ error, handler });
  }
  return defaultHandler2(_arguments);
}
async function handleLoader({ event, loadContext, loader, routeId, routePath }) {
  const _arguments = createArgumentsFrom({ event, loadContext, path: routePath });
  const result = await loader(_arguments);
  if (result === void 0) {
    throw new Error(`You defined a loader for route "${routeId}" but didn't return anything from your \`worker loader\` function. Please return a value or \`null\`.`);
  }
  if (isDeferredData_1(result)) {
    if (result.init && isRedirectStatusCode_1(result.init.status || 200)) {
      return redirect_1(new Headers(result.init.headers).get("Location"), result.init);
    }
    const body = createDeferredReadableStream_1(result, event.request.signal, ServerMode_1.Production);
    const init = result.init || {};
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "text/remix-deferred");
    init.headers = headers;
    return new Response(body, init);
  }
  return isResponse_1(result) ? result : json_1(result);
}
async function handleAction({ action, event, loadContext, routeId, routePath }) {
  const _arguments = createArgumentsFrom({ event, loadContext, path: routePath });
  const result = await action(_arguments);
  if (result === void 0) {
    throw new Error(`You defined an action for route "${routeId}" but didn't return anything from your \`worker action\` function. Please return a value or \`null\`.`);
  }
  return isResponse_1(result) ? result : json_1(result);
}
function _errorHandler({ error, handler: handleError }) {
  if (isResponse_1(error)) {
    error.headers.set("X-Remix-Catch", "yes");
    return error;
  }
  if (isRouteErrorResponse$1(error)) {
    error.error && handleError(error.error);
    return errorResponseToJson(error);
  }
  const errorInstance = error instanceof Error ? error : new Error("Unexpected Server Error");
  handleError(errorInstance);
  return json_1({ message: errorInstance.message }, {
    status: 500,
    headers: {
      "X-Remix-Error": "yes"
    }
  });
}
function responseHandler(response) {
  if (isRedirectResponse_1(response)) {
    const headers2 = new Headers(response.headers);
    headers2.set("X-Remix-Redirect", headers2.get("Location"));
    headers2.set("X-Remix-Status", String(response.status));
    headers2.delete("Location");
    if (response.headers.get("Set-Cookie") !== null) {
      headers2.set("X-Remix-Revalidate", "yes");
    }
    return new Response(null, {
      status: 204,
      headers: headers2
    });
  }
  const isNotRemixResponse = !isRemixResponse(response);
  const headers = isNotRemixResponse ? new Headers(response.headers) : response.headers;
  if (isNotRemixResponse) {
    headers.set("X-Remix-Response", "yes");
    if (response.status < 200) {
      return new Response(response.body, { headers });
    }
    return new Response(response.body, { headers, status: response.status, statusText: response.statusText });
  }
  return response;
}
const _self = self;
function createContext(event) {
  var _a, _b;
  const context = ((_b = (_a = entry.module).getLoadContext) == null ? void 0 : _b.call(_a, event)) || {};
  return {
    event,
    fetchFromServer: () => fetch(event.request.clone()),
    // NOTE: we want the user to override the above properties if needed.
    ...context
  };
}
const defaultHandler = entry.module.defaultFetchHandler || ((event) => fetch(event.request.clone()));
const defaultErrorHandler = entry.module.errorHandler || ((error, { request }) => {
  if (!request.signal.aborted) {
    console.error(error);
  }
});
_self.__workerManifest = {
  // Re-publishing this. Somehow it's not available as `latest`
  assets,
  routes
};
_self.addEventListener(
  "fetch",
  (event) => {
    const response = handleRequest({
      event,
      routes,
      defaultHandler,
      errorHandler: defaultErrorHandler,
      loadContext: createContext(event)
    });
    return event.respondWith(response);
  }
);
