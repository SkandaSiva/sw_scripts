try {
  self["workbox:core:7.0.0"] && _();
} catch {
}
const _s = (s, ...e) => {
  let t = s;
  return e.length > 0 && (t += ` :: ${JSON.stringify(e)}`), t;
}, ls = _s;
class C extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(e, t) {
    const a = ls(e, t);
    super(a), this.name = e, this.details = t;
  }
}
const dt = /* @__PURE__ */ new Set();
function Es(s) {
  dt.add(s);
}
const B = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, Re = (s) => [B.prefix, s, B.suffix].filter((e) => e && e.length > 0).join("-"), us = (s) => {
  for (const e of Object.keys(B))
    s(e);
}, U = {
  updateDetails: (s) => {
    us((e) => {
      typeof s[e] == "string" && (B[e] = s[e]);
    });
  },
  getGoogleAnalyticsName: (s) => s || Re(B.googleAnalytics),
  getPrecacheName: (s) => s || Re(B.precache),
  getPrefix: () => B.prefix,
  getRuntimeName: (s) => s || Re(B.runtime),
  getSuffix: () => B.suffix
};
function st(s, e) {
  const t = new URL(s);
  for (const a of e)
    t.searchParams.delete(a);
  return t.href;
}
async function As(s, e, t, a) {
  const n = st(e.url, t);
  if (e.url === n)
    return s.match(e, a);
  const o = Object.assign(Object.assign({}, a), { ignoreSearch: !0 }), i = await s.keys(e, o);
  for (const A of i) {
    const d = st(A.url, t);
    if (n === d)
      return s.match(A, a);
  }
}
let se;
function ds() {
  if (se === void 0) {
    const s = new Response("");
    if ("body" in s)
      try {
        new Response(s.body), se = !0;
      } catch {
        se = !1;
      }
    se = !1;
  }
  return se;
}
function ht(s) {
  s.then(() => {
  });
}
class hs {
  /**
   * Creates a promise and exposes its resolve and reject functions as methods.
   */
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
async function Ts() {
  for (const s of dt)
    await s();
}
const ps = (s) => new URL(String(s), location.href).href.replace(new RegExp(`^${location.origin}`), "");
function Tt(s) {
  return new Promise((e) => setTimeout(e, s));
}
const at = {
  get googleAnalytics() {
    return U.getGoogleAnalyticsName();
  },
  get precache() {
    return U.getPrecacheName();
  },
  get prefix() {
    return U.getPrefix();
  },
  get runtime() {
    return U.getRuntimeName();
  },
  get suffix() {
    return U.getSuffix();
  }
};
async function Ps(s, e) {
  let t = null;
  if (s.url && (t = new URL(s.url).origin), t !== self.location.origin)
    throw new C("cross-origin-copy-response", { origin: t });
  const a = s.clone(), n = {
    headers: new Headers(a.headers),
    status: a.status,
    statusText: a.statusText
  }, o = e ? e(n) : n, i = ds() ? a.body : await a.blob();
  return new Response(i, o);
}
function Is() {
  self.addEventListener("activate", () => self.clients.claim());
}
try {
  self["workbox:precaching:7.0.0"] && _();
} catch {
}
try {
  self["workbox:strategies:7.0.0"] && _();
} catch {
}
function Te(s) {
  return typeof s == "string" ? new Request(s) : s;
}
class ms {
  /**
   * Creates a new instance associated with the passed strategy and event
   * that's handling the request.
   *
   * The constructor also initializes the state that will be passed to each of
   * the plugins handling this request.
   *
   * @param {workbox-strategies.Strategy} strategy
   * @param {Object} options
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params] The return value from the
   *     {@link workbox-routing~matchCallback} (if applicable).
   */
  constructor(e, t) {
    this._cacheKeys = {}, Object.assign(this, t), this.event = t.event, this._strategy = e, this._handlerDeferred = new hs(), this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const a of this._plugins)
      this._pluginStateMap.set(a, {});
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  /**
   * Fetches a given request (and invokes any applicable plugin callback
   * methods) using the `fetchOptions` (for non-navigation requests) and
   * `plugins` defined on the `Strategy` object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - `requestWillFetch()`
   * - `fetchDidSucceed()`
   * - `fetchDidFail()`
   *
   * @param {Request|string} input The URL or request to fetch.
   * @return {Promise<Response>}
   */
  async fetch(e) {
    const { event: t } = this;
    let a = Te(e);
    if (a.mode === "navigate" && t instanceof FetchEvent && t.preloadResponse) {
      const i = await t.preloadResponse;
      if (i)
        return i;
    }
    const n = this.hasCallback("fetchDidFail") ? a.clone() : null;
    try {
      for (const i of this.iterateCallbacks("requestWillFetch"))
        a = await i({ request: a.clone(), event: t });
    } catch (i) {
      if (i instanceof Error)
        throw new C("plugin-error-request-will-fetch", {
          thrownErrorMessage: i.message
        });
    }
    const o = a.clone();
    try {
      let i;
      i = await fetch(a, a.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
      for (const A of this.iterateCallbacks("fetchDidSucceed"))
        i = await A({
          event: t,
          request: o,
          response: i
        });
      return i;
    } catch (i) {
      throw n && await this.runCallbacks("fetchDidFail", {
        error: i,
        event: t,
        originalRequest: n.clone(),
        request: o.clone()
      }), i;
    }
  }
  /**
   * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
   * the response generated by `this.fetch()`.
   *
   * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
   * so you do not have to manually call `waitUntil()` on the event.
   *
   * @param {Request|string} input The request or URL to fetch and cache.
   * @return {Promise<Response>}
   */
  async fetchAndCachePut(e) {
    const t = await this.fetch(e), a = t.clone();
    return this.waitUntil(this.cachePut(e, a)), t;
  }
  /**
   * Matches a request from the cache (and invokes any applicable plugin
   * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
   * defined on the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cachedResponseWillByUsed()
   *
   * @param {Request|string} key The Request or URL to use as the cache key.
   * @return {Promise<Response|undefined>} A matching response, if found.
   */
  async cacheMatch(e) {
    const t = Te(e);
    let a;
    const { cacheName: n, matchOptions: o } = this._strategy, i = await this.getCacheKey(t, "read"), A = Object.assign(Object.assign({}, o), { cacheName: n });
    a = await caches.match(i, A);
    for (const d of this.iterateCallbacks("cachedResponseWillBeUsed"))
      a = await d({
        cacheName: n,
        matchOptions: o,
        cachedResponse: a,
        request: i,
        event: this.event
      }) || void 0;
    return a;
  }
  /**
   * Puts a request/response pair in the cache (and invokes any applicable
   * plugin callback methods) using the `cacheName` and `plugins` defined on
   * the strategy object.
   *
   * The following plugin lifecycle methods are invoked when using this method:
   * - cacheKeyWillByUsed()
   * - cacheWillUpdate()
   * - cacheDidUpdate()
   *
   * @param {Request|string} key The request or URL to use as the cache key.
   * @param {Response} response The response to cache.
   * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
   * not be cached, and `true` otherwise.
   */
  async cachePut(e, t) {
    const a = Te(e);
    await Tt(0);
    const n = await this.getCacheKey(a, "write");
    if (!t)
      throw new C("cache-put-with-no-response", {
        url: ps(n.url)
      });
    const o = await this._ensureResponseSafeToCache(t);
    if (!o)
      return !1;
    const { cacheName: i, matchOptions: A } = this._strategy, d = await self.caches.open(i), b = this.hasCallback("cacheDidUpdate"), R = b ? await As(
      // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
      // feature. Consider into ways to only add this behavior if using
      // precaching.
      d,
      n.clone(),
      ["__WB_REVISION__"],
      A
    ) : null;
    try {
      await d.put(n, b ? o.clone() : o);
    } catch (g) {
      if (g instanceof Error)
        throw g.name === "QuotaExceededError" && await Ts(), g;
    }
    for (const g of this.iterateCallbacks("cacheDidUpdate"))
      await g({
        cacheName: i,
        oldResponse: R,
        newResponse: o.clone(),
        request: n,
        event: this.event
      });
    return !0;
  }
  /**
   * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
   * executes any of those callbacks found in sequence. The final `Request`
   * object returned by the last plugin is treated as the cache key for cache
   * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
   * been registered, the passed request is returned unmodified
   *
   * @param {Request} request
   * @param {string} mode
   * @return {Promise<Request>}
   */
  async getCacheKey(e, t) {
    const a = `${e.url} | ${t}`;
    if (!this._cacheKeys[a]) {
      let n = e;
      for (const o of this.iterateCallbacks("cacheKeyWillBeUsed"))
        n = Te(await o({
          mode: t,
          request: n,
          event: this.event,
          // params has a type any can't change right now.
          params: this.params
          // eslint-disable-line
        }));
      this._cacheKeys[a] = n;
    }
    return this._cacheKeys[a];
  }
  /**
   * Returns true if the strategy has at least one plugin with the given
   * callback.
   *
   * @param {string} name The name of the callback to check for.
   * @return {boolean}
   */
  hasCallback(e) {
    for (const t of this._strategy.plugins)
      if (e in t)
        return !0;
    return !1;
  }
  /**
   * Runs all plugin callbacks matching the given name, in order, passing the
   * given param object (merged ith the current plugin state) as the only
   * argument.
   *
   * Note: since this method runs all plugins, it's not suitable for cases
   * where the return value of a callback needs to be applied prior to calling
   * the next callback. See
   * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
   * below for how to handle that case.
   *
   * @param {string} name The name of the callback to run within each plugin.
   * @param {Object} param The object to pass as the first (and only) param
   *     when executing each callback. This object will be merged with the
   *     current plugin state prior to callback execution.
   */
  async runCallbacks(e, t) {
    for (const a of this.iterateCallbacks(e))
      await a(t);
  }
  /**
   * Accepts a callback and returns an iterable of matching plugin callbacks,
   * where each callback is wrapped with the current handler state (i.e. when
   * you call each callback, whatever object parameter you pass it will
   * be merged with the plugin's current state).
   *
   * @param {string} name The name fo the callback to run
   * @return {Array<Function>}
   */
  *iterateCallbacks(e) {
    for (const t of this._strategy.plugins)
      if (typeof t[e] == "function") {
        const a = this._pluginStateMap.get(t);
        yield (o) => {
          const i = Object.assign(Object.assign({}, o), { state: a });
          return t[e](i);
        };
      }
  }
  /**
   * Adds a promise to the
   * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
   * of the event event associated with the request being handled (usually a
   * `FetchEvent`).
   *
   * Note: you can await
   * {@link workbox-strategies.StrategyHandler~doneWaiting}
   * to know when all added promises have settled.
   *
   * @param {Promise} promise A promise to add to the extend lifetime promises
   *     of the event that triggered the request.
   */
  waitUntil(e) {
    return this._extendLifetimePromises.push(e), e;
  }
  /**
   * Returns a promise that resolves once all promises passed to
   * {@link workbox-strategies.StrategyHandler~waitUntil}
   * have settled.
   *
   * Note: any work done after `doneWaiting()` settles should be manually
   * passed to an event's `waitUntil()` method (not this handler's
   * `waitUntil()` method), otherwise the service worker thread my be killed
   * prior to your work completing.
   */
  async doneWaiting() {
    let e;
    for (; e = this._extendLifetimePromises.shift(); )
      await e;
  }
  /**
   * Stops running the strategy and immediately resolves any pending
   * `waitUntil()` promises.
   */
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  /**
   * This method will call cacheWillUpdate on the available plugins (or use
   * status === 200) to determine if the Response is safe and valid to cache.
   *
   * @param {Request} options.request
   * @param {Response} options.response
   * @return {Promise<Response|undefined>}
   *
   * @private
   */
  async _ensureResponseSafeToCache(e) {
    let t = e, a = !1;
    for (const n of this.iterateCallbacks("cacheWillUpdate"))
      if (t = await n({
        request: this.request,
        response: t,
        event: this.event
      }) || void 0, a = !0, !t)
        break;
    return a || t && t.status !== 200 && (t = void 0), t;
  }
}
class z {
  /**
   * Creates a new instance of the strategy and sets all documented option
   * properties as public instance properties.
   *
   * Note: if a custom strategy class extends the base Strategy class and does
   * not need more than these properties, it does not need to define its own
   * constructor.
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   */
  constructor(e = {}) {
    this.cacheName = U.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
  }
  /**
   * Perform a request strategy and returns a `Promise` that will resolve with
   * a `Response`, invoking all relevant plugin callbacks.
   *
   * When a strategy instance is registered with a Workbox
   * {@link workbox-routing.Route}, this method is automatically
   * called when the route matches.
   *
   * Alternatively, this method can be used in a standalone `FetchEvent`
   * listener by passing it to `event.respondWith()`.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   */
  handle(e) {
    const [t] = this.handleAll(e);
    return t;
  }
  /**
   * Similar to {@link workbox-strategies.Strategy~handle}, but
   * instead of just returning a `Promise` that resolves to a `Response` it
   * it will return an tuple of `[response, done]` promises, where the former
   * (`response`) is equivalent to what `handle()` returns, and the latter is a
   * Promise that will resolve once any promises that were added to
   * `event.waitUntil()` as part of performing the strategy have completed.
   *
   * You can await the `done` promise to ensure any extra work performed by
   * the strategy (usually caching responses) completes successfully.
   *
   * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
   *     properties listed below.
   * @param {Request|string} options.request A request to run this strategy for.
   * @param {ExtendableEvent} options.event The event associated with the
   *     request.
   * @param {URL} [options.url]
   * @param {*} [options.params]
   * @return {Array<Promise>} A tuple of [response, done]
   *     promises that can be used to determine when the response resolves as
   *     well as when the handler has completed all its work.
   */
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const t = e.event, a = typeof e.request == "string" ? new Request(e.request) : e.request, n = "params" in e ? e.params : void 0, o = new ms(this, { event: t, request: a, params: n }), i = this._getResponse(o, a, t), A = this._awaitComplete(i, o, a, t);
    return [i, A];
  }
  async _getResponse(e, t, a) {
    await e.runCallbacks("handlerWillStart", { event: a, request: t });
    let n;
    try {
      if (n = await this._handle(t, e), !n || n.type === "error")
        throw new C("no-response", { url: t.url });
    } catch (o) {
      if (o instanceof Error) {
        for (const i of e.iterateCallbacks("handlerDidError"))
          if (n = await i({ error: o, event: a, request: t }), n)
            break;
      }
      if (!n)
        throw o;
    }
    for (const o of e.iterateCallbacks("handlerWillRespond"))
      n = await o({ event: a, request: t, response: n });
    return n;
  }
  async _awaitComplete(e, t, a, n) {
    let o, i;
    try {
      o = await e;
    } catch {
    }
    try {
      await t.runCallbacks("handlerDidRespond", {
        event: n,
        request: a,
        response: o
      }), await t.doneWaiting();
    } catch (A) {
      A instanceof Error && (i = A);
    }
    if (await t.runCallbacks("handlerDidComplete", {
      event: n,
      request: a,
      response: o,
      error: i
    }), t.destroy(), i)
      throw i;
  }
}
class k extends z {
  /**
   *
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to the cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
   * of all fetch() requests made by this strategy.
   * @param {Object} [options.matchOptions] The
   * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
   * for any `cache.match()` or `cache.put()` calls made by this strategy.
   * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
   * get the response from the network if there's a precache miss.
   */
  constructor(e = {}) {
    e.cacheName = U.getPrecacheName(e.cacheName), super(e), this._fallbackToNetwork = e.fallbackToNetwork !== !1, this.plugins.push(k.copyRedirectedCacheableResponsesPlugin);
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const a = await t.cacheMatch(e);
    return a || (t.event && t.event.type === "install" ? await this._handleInstall(e, t) : await this._handleFetch(e, t));
  }
  async _handleFetch(e, t) {
    let a;
    const n = t.params || {};
    if (this._fallbackToNetwork) {
      const o = n.integrity, i = e.integrity, A = !i || i === o;
      a = await t.fetch(new Request(e, {
        integrity: e.mode !== "no-cors" ? i || o : void 0
      })), o && A && e.mode !== "no-cors" && (this._useDefaultCacheabilityPluginIfNeeded(), await t.cachePut(e, a.clone()));
    } else
      throw new C("missing-precache-entry", {
        cacheName: this.cacheName,
        url: e.url
      });
    return a;
  }
  async _handleInstall(e, t) {
    this._useDefaultCacheabilityPluginIfNeeded();
    const a = await t.fetch(e);
    if (!await t.cachePut(e, a.clone()))
      throw new C("bad-precaching-response", {
        url: e.url,
        status: a.status
      });
    return a;
  }
  /**
   * This method is complex, as there a number of things to account for:
   *
   * The `plugins` array can be set at construction, and/or it might be added to
   * to at any time before the strategy is used.
   *
   * At the time the strategy is used (i.e. during an `install` event), there
   * needs to be at least one plugin that implements `cacheWillUpdate` in the
   * array, other than `copyRedirectedCacheableResponsesPlugin`.
   *
   * - If this method is called and there are no suitable `cacheWillUpdate`
   * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
   *
   * - If this method is called and there is exactly one `cacheWillUpdate`, then
   * we don't have to do anything (this might be a previously added
   * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
   *
   * - If this method is called and there is more than one `cacheWillUpdate`,
   * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
   * we need to remove it. (This situation is unlikely, but it could happen if
   * the strategy is used multiple times, the first without a `cacheWillUpdate`,
   * and then later on after manually adding a custom `cacheWillUpdate`.)
   *
   * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
   *
   * @private
   */
  _useDefaultCacheabilityPluginIfNeeded() {
    let e = null, t = 0;
    for (const [a, n] of this.plugins.entries())
      n !== k.copyRedirectedCacheableResponsesPlugin && (n === k.defaultPrecacheCacheabilityPlugin && (e = a), n.cacheWillUpdate && t++);
    t === 0 ? this.plugins.push(k.defaultPrecacheCacheabilityPlugin) : t > 1 && e !== null && this.plugins.splice(e, 1);
  }
}
k.defaultPrecacheCacheabilityPlugin = {
  async cacheWillUpdate({ response: s }) {
    return !s || s.status >= 400 ? null : s;
  }
};
k.copyRedirectedCacheableResponsesPlugin = {
  async cacheWillUpdate({ response: s }) {
    return s.redirected ? await Ps(s) : s;
  }
};
try {
  self["workbox:routing:7.0.0"] && _();
} catch {
}
const pt = "GET", pe = (s) => s && typeof s == "object" ? s : { handle: s };
class v {
  /**
   * Constructor for Route class.
   *
   * @param {workbox-routing~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, a = pt) {
    this.handler = pe(t), this.match = e, this.method = a;
  }
  /**
   *
   * @param {workbox-routing-handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response
   */
  setCatchHandler(e) {
    this.catchHandler = pe(e);
  }
}
class fs extends v {
  /**
   * If the regular expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * the captured values will be passed to the
   * {@link workbox-routing~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(e, t, a) {
    const n = ({ url: o }) => {
      const i = e.exec(o.href);
      if (i && !(o.origin !== location.origin && i.index !== 0))
        return i.slice(1);
    };
    super(n, t, a);
  }
}
class Pt {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = /* @__PURE__ */ new Map(), this._defaultHandlerMap = /* @__PURE__ */ new Map();
  }
  /**
   * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
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
    self.addEventListener("fetch", (e) => {
      const { request: t } = e, a = this.handleRequest({ request: t, event: e });
      a && e.respondWith(a);
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
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: t } = e.data, a = Promise.all(t.urlsToCache.map((n) => {
          typeof n == "string" && (n = [n]);
          const o = new Request(...n);
          return this.handleRequest({ request: o, event: e });
        }));
        e.waitUntil(a), e.ports && e.ports[0] && a.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle.
   * @param {ExtendableEvent} options.event The event that triggered the
   *     request.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */
  handleRequest({ request: e, event: t }) {
    const a = new URL(e.url, location.href);
    if (!a.protocol.startsWith("http"))
      return;
    const n = a.origin === location.origin, { params: o, route: i } = this.findMatchingRoute({
      event: t,
      request: e,
      sameOrigin: n,
      url: a
    });
    let A = i && i.handler;
    const d = e.method;
    if (!A && this._defaultHandlerMap.has(d) && (A = this._defaultHandlerMap.get(d)), !A)
      return;
    let b;
    try {
      b = A.handle({ url: a, request: e, event: t, params: o });
    } catch (g) {
      b = Promise.reject(g);
    }
    const R = i && i.catchHandler;
    return b instanceof Promise && (this._catchHandler || R) && (b = b.catch(async (g) => {
      if (R)
        try {
          return await R.handle({ url: a, request: e, event: t, params: o });
        } catch (c) {
          c instanceof Error && (g = c);
        }
      if (this._catchHandler)
        return this._catchHandler.handle({ url: a, request: e, event: t });
      throw g;
    })), b;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {boolean} options.sameOrigin The result of comparing `url.origin`
   *     against the current origin.
   * @param {Request} options.request The request to match.
   * @param {Event} options.event The corresponding event.
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */
  findMatchingRoute({ url: e, sameOrigin: t, request: a, event: n }) {
    const o = this._routes.get(a.method) || [];
    for (const i of o) {
      let A;
      const d = i.match({ url: e, sameOrigin: t, request: a, event: n });
      if (d)
        return A = d, (Array.isArray(A) && A.length === 0 || d.constructor === Object && // eslint-disable-line
        Object.keys(d).length === 0 || typeof d == "boolean") && (A = void 0), { route: i, params: A };
    }
    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to associate with this
   * default handler. Each method has its own default.
   */
  setDefaultHandler(e, t = pt) {
    this._defaultHandlerMap.set(t, pe(e));
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox-routing~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */
  setCatchHandler(e) {
    this._catchHandler = pe(e);
  }
  /**
   * Registers a route with the router.
   *
   * @param {workbox-routing.Route} route The route to register.
   */
  registerRoute(e) {
    this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {workbox-routing.Route} route The route to unregister.
   */
  unregisterRoute(e) {
    if (!this._routes.has(e.method))
      throw new C("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const t = this._routes.get(e.method).indexOf(e);
    if (t > -1)
      this._routes.get(e.method).splice(t, 1);
    else
      throw new C("unregister-route-route-not-registered");
  }
}
let ae;
const ve = () => (ae || (ae = new Pt(), ae.addFetchListener(), ae.addCacheListener()), ae);
function J(s, e, t) {
  let a;
  if (typeof s == "string") {
    const o = new URL(s, location.href), i = ({ url: A }) => A.href === o.href;
    a = new v(i, e, t);
  } else if (s instanceof RegExp)
    a = new fs(s, e, t);
  else if (typeof s == "function")
    a = new v(s, e, t);
  else if (s instanceof v)
    a = s;
  else
    throw new C("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  return ve().registerRoute(a), a;
}
const bs = "-precache-", Os = async (s, e = bs) => {
  const a = (await self.caches.keys()).filter((n) => n.includes(e) && n.includes(self.registration.scope) && n !== s);
  return await Promise.all(a.map((n) => self.caches.delete(n))), a;
};
function Ns() {
  self.addEventListener("activate", (s) => {
    const e = U.getPrecacheName();
    s.waitUntil(Os(e).then((t) => {
    }));
  });
}
function Cs(s) {
  ve().setCatchHandler(s);
}
function Ss(s) {
  ve().setDefaultHandler(s);
}
const gs = "pay-senger", It = "17.5.4", mt = { VITE_APP_BACKEND_HOST: "https://api.paysenger.com", VITE_APP_CACHE_VERSION: "v4", VITE_APP_TITLEAPP: "Paysenger", VITE_APP_I18N_FALLBACK_LOCALE: "en", VITE_APP_I18N_LOCALE: "en", VITE_APP_WEB_SITE: "https://paysenger.com/", VITE_APP_STRIPE_KEY: "pk_live_we4WLyULfoFmYBTaUzsU0V9200Qt3smKQl", VITE_APP_DOWNLOAD_ANDROID: "https://play.google.com/store/apps/details?id=com.paysenger.androidapp", VITE_APP_DOWNLOAD_IPHONE: "https://apps.apple.com/us/app/paysenger/id1460484935", VITE_APP_IS_SHOWN_STORE_BUTTONS: "false", VITE_APP_IS_SHOWN_LOGS: "true", VITE_APP_NFT_GATEWAY: "https://marketplace.paysenger.com", VITE_APP_IS_NFT_WALL_SHOWN: "true", VITE_APP_ENVIRONMENT: "production", VITE_APP_GOOGLE_CLOUD_RECAPTCHA_KEY: "6LfVCkYjAAAAAFLp42JupSIn8CZeXHHpPxfJ5Aj4", VITE_APP_IS_SHOWN_TOPS: "false", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_MANUAL: "0x96563b20F42b4d10FC8Fc0AFec58e9aA1caB8cf4", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_REQUEST_AUTOMINT: "0x4E64c89f2a6A2d54696b56005c9893Ae57b1Bb3E", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_SELFPOST_AUTOMINT: "0x5c37f938c1b85c9ec84d8e7ae90ede2f3106489f", VITE_APP_NFT_NETWORK: "bnb", VITE_APP_WITHDRAW_SERVICE_FEE: "0", VITE_APP_IS_NFT_DEMO_SHOWN: "true", VITE_APP_CHAT_EXPIRED: "5", VITE_APP_EGO_COIN_NAME: "EGO", VITE_APP_EGO_TOKENS_CONTRACT_DIST: "0xfeb120c36cd0b0316530712770b800449cba49c5", VITE_APP_EGO_TOKENS_CONTRACT: "0x44a21B3577924DCD2e9C81A3347D204C36a55466", VITE_APP_BLOCKCHAIN_CONDUIT_ADDRESS: "0x193370CC208C7AE1251ac68717b1ed12Ba83F6B3", VITE_APP_NFT_DEADLINE_IN_SECONDS: "2628000", VITE_APP_EGO_TOKENS_CHAIN_ID: "56", VITE_APP_EGO_TOKENS_DECIMALS: "18", VITE_APP_EGO_TOKENS_FAUCET: "", VITE_APP_EGO_TOKENS_IMAGE: "https://egoco.in/img/logo_gray.svg", VITE_APP_BLOCKCHAIN_SCAN_URL: "https://bscscan.com", VITE_APP_BLOCKCHAIN_SCAN_API_URL: "https://api.bscscan.com/api", VITE_APP_BLOCKCHAIN_SCAN_API_KEY: "HDVMTYQMD6I5A83GPJJNYQ8WRFF76M2NBF", VITE_APP_BLOCKCHAIN_CLAIM_CONTRACT: "0x301932BEB4A2B10Fb3a8b105A8DC12B3E25e3Ec2", VITE_APP_RECENT_CONTENT_LIMIT: "10", VITE_APP_DISCOVER_ID_FOR_MEMBERSHIPS_WIZARD: "40", VITE_APP_GAME_LEVELS_BENEFIT: "isPrimary", VITE_APP_ADDRESS_CYPRUS: "Operated by ATTN CAPITAL EU LTD, John Kennedy, 8, IRIS HOUSE, Floor 7, Office 740C 3106, Limassol, Cyprus<br/>under the license of Paysenger, Inc., California, USA", VITE_APP_DYNAMIC_LANDING_BONUS: "10", VITE_APP_PREMIUM_MULTIPLIER: "premium", VITE_APP_SENTRY_DSN: "https://49a37e57b74c4373957060e76b8e965e@sentry.ops.paysenger.net/14", BASE_URL: "./", MODE: "production", DEV: !1, PROD: !0, SSR: !1 }, ft = "https://paysengerapp-files", bt = ["jpg", "jpeg", "png", "webp"], ws = mt.VITE_APP_HASH_COMMIT || "", Fe = `${mt.VITE_APP_CACHE_VERSION}_${It}_${ws}` || "v2", Rs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CACHE_VERSION: Fe,
  CDN_URL_STARTS_WITH: ft,
  CND_ALLOWED_EXTS: bt
}, Symbol.toStringTag, { value: "Module" })), ys = {
  manifest: "manifest",
  apiResponses: "api-responses",
  cdnResponses: "cdn-responses",
  assetsJsCssJson: "assets-js-css-json",
  html: "html",
  staticImages: "static-images",
  googleFonts: "google-fonts",
  analytics: "analytics",
  fallback: "fallback",
  pages: "pages"
}, Ds = (s) => `${Fe}-${s}`, y = Object.fromEntries(
  Object.entries(ys).map(([s, e]) => [s, Ds(e)])
);
y.apiResponses, y.apiResponses, y.apiResponses;
const K = {
  oneDay: 24 * 60 * 60,
  // 1 day
  oneWeek: 24 * 60 * 60 * 7,
  // 7 days
  oneMonth: 24 * 60 * 60 * 31
  // 31 month
}, Ls = ["/offline.html", "/offline.png"], Vs = [
  /*
  '/',
  */
  // disabled due to 404 on stage:
  // https://paysenger.slack.com/archives/C03RWMDSV9T/p1664563509420729
  // '/discover', '/response-feed/', 'connections'
];
try {
  self["workbox:cacheable-response:7.0.0"] && _();
} catch {
}
class Ms {
  /**
   * To construct a new CacheableResponse instance you must provide at least
   * one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param {Object} config
   * @param {Array<number>} [config.statuses] One or more status codes that a
   * `Response` can have and be considered cacheable.
   * @param {Object<string,string>} [config.headers] A mapping of header names
   * and expected values that a `Response` can have and be considered cacheable.
   * If multiple headers are provided, only one needs to be present.
   */
  constructor(e = {}) {
    this._statuses = e.statuses, this._headers = e.headers;
  }
  /**
   * Checks a response to see whether it's cacheable or not, based on this
   * object's configuration.
   *
   * @param {Response} response The response whose cacheability is being
   * checked.
   * @return {boolean} `true` if the `Response` is cacheable, and `false`
   * otherwise.
   */
  isResponseCacheable(e) {
    let t = !0;
    return this._statuses && (t = this._statuses.includes(e.status)), this._headers && t && (t = Object.keys(this._headers).some((a) => e.headers.get(a) === this._headers[a])), t;
  }
}
class W {
  /**
   * To construct a new CacheableResponsePlugin instance you must provide at
   * least one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param {Object} config
   * @param {Array<number>} [config.statuses] One or more status codes that a
   * `Response` can have and be considered cacheable.
   * @param {Object<string,string>} [config.headers] A mapping of header names
   * and expected values that a `Response` can have and be considered cacheable.
   * If multiple headers are provided, only one needs to be present.
   */
  constructor(e) {
    this.cacheWillUpdate = async ({ response: t }) => this._cacheableResponse.isResponseCacheable(t) ? t : null, this._cacheableResponse = new Ms(e);
  }
}
const Us = (s, e) => e.some((t) => s instanceof t);
let nt, it;
function xs() {
  return nt || (nt = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Bs() {
  return it || (it = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const Ot = /* @__PURE__ */ new WeakMap(), Me = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap(), ye = /* @__PURE__ */ new WeakMap(), He = /* @__PURE__ */ new WeakMap();
function vs(s) {
  const e = new Promise((t, a) => {
    const n = () => {
      s.removeEventListener("success", o), s.removeEventListener("error", i);
    }, o = () => {
      t(F(s.result)), n();
    }, i = () => {
      a(s.error), n();
    };
    s.addEventListener("success", o), s.addEventListener("error", i);
  });
  return e.then((t) => {
    t instanceof IDBCursor && Ot.set(t, s);
  }).catch(() => {
  }), He.set(e, s), e;
}
function Fs(s) {
  if (Me.has(s))
    return;
  const e = new Promise((t, a) => {
    const n = () => {
      s.removeEventListener("complete", o), s.removeEventListener("error", i), s.removeEventListener("abort", i);
    }, o = () => {
      t(), n();
    }, i = () => {
      a(s.error || new DOMException("AbortError", "AbortError")), n();
    };
    s.addEventListener("complete", o), s.addEventListener("error", i), s.addEventListener("abort", i);
  });
  Me.set(s, e);
}
let Ue = {
  get(s, e, t) {
    if (s instanceof IDBTransaction) {
      if (e === "done")
        return Me.get(s);
      if (e === "objectStoreNames")
        return s.objectStoreNames || Nt.get(s);
      if (e === "store")
        return t.objectStoreNames[1] ? void 0 : t.objectStore(t.objectStoreNames[0]);
    }
    return F(s[e]);
  },
  set(s, e, t) {
    return s[e] = t, !0;
  },
  has(s, e) {
    return s instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in s;
  }
};
function Hs(s) {
  Ue = s(Ue);
}
function ks(s) {
  return s === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(e, ...t) {
    const a = s.call(De(this), e, ...t);
    return Nt.set(a, e.sort ? e.sort() : [e]), F(a);
  } : Bs().includes(s) ? function(...e) {
    return s.apply(De(this), e), F(Ot.get(this));
  } : function(...e) {
    return F(s.apply(De(this), e));
  };
}
function Ks(s) {
  return typeof s == "function" ? ks(s) : (s instanceof IDBTransaction && Fs(s), Us(s, xs()) ? new Proxy(s, Ue) : s);
}
function F(s) {
  if (s instanceof IDBRequest)
    return vs(s);
  if (ye.has(s))
    return ye.get(s);
  const e = Ks(s);
  return e !== s && (ye.set(s, e), He.set(e, s)), e;
}
const De = (s) => He.get(s);
function Ct(s, e, { blocked: t, upgrade: a, blocking: n, terminated: o } = {}) {
  const i = indexedDB.open(s, e), A = F(i);
  return a && i.addEventListener("upgradeneeded", (d) => {
    a(F(i.result), d.oldVersion, d.newVersion, F(i.transaction), d);
  }), t && i.addEventListener("blocked", (d) => t(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    d.oldVersion,
    d.newVersion,
    d
  )), A.then((d) => {
    o && d.addEventListener("close", () => o()), n && d.addEventListener("versionchange", (b) => n(b.oldVersion, b.newVersion, b));
  }).catch(() => {
  }), A;
}
function Ws(s, { blocked: e } = {}) {
  const t = indexedDB.deleteDatabase(s);
  return e && t.addEventListener("blocked", (a) => e(
    // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
    a.oldVersion,
    a
  )), F(t).then(() => {
  });
}
const Gs = ["get", "getKey", "getAll", "getAllKeys", "count"], qs = ["put", "add", "delete", "clear"], Le = /* @__PURE__ */ new Map();
function ot(s, e) {
  if (!(s instanceof IDBDatabase && !(e in s) && typeof e == "string"))
    return;
  if (Le.get(e))
    return Le.get(e);
  const t = e.replace(/FromIndex$/, ""), a = e !== t, n = qs.includes(t);
  if (
    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
    !(t in (a ? IDBIndex : IDBObjectStore).prototype) || !(n || Gs.includes(t))
  )
    return;
  const o = async function(i, ...A) {
    const d = this.transaction(i, n ? "readwrite" : "readonly");
    let b = d.store;
    return a && (b = b.index(A.shift())), (await Promise.all([
      b[t](...A),
      n && d.done
    ]))[0];
  };
  return Le.set(e, o), o;
}
Hs((s) => ({
  ...s,
  get: (e, t, a) => ot(e, t) || s.get(e, t, a),
  has: (e, t) => !!ot(e, t) || s.has(e, t)
}));
try {
  self["workbox:expiration:7.0.0"] && _();
} catch {
}
const Ys = "workbox-expiration", ne = "cache-entries", rt = (s) => {
  const e = new URL(s, location.href);
  return e.hash = "", e.href;
};
class js {
  /**
   *
   * @param {string} cacheName
   *
   * @private
   */
  constructor(e) {
    this._db = null, this._cacheName = e;
  }
  /**
   * Performs an upgrade of indexedDB.
   *
   * @param {IDBPDatabase<CacheDbSchema>} db
   *
   * @private
   */
  _upgradeDb(e) {
    const t = e.createObjectStore(ne, { keyPath: "id" });
    t.createIndex("cacheName", "cacheName", { unique: !1 }), t.createIndex("timestamp", "timestamp", { unique: !1 });
  }
  /**
   * Performs an upgrade of indexedDB and deletes deprecated DBs.
   *
   * @param {IDBPDatabase<CacheDbSchema>} db
   *
   * @private
   */
  _upgradeDbAndDeleteOldDbs(e) {
    this._upgradeDb(e), this._cacheName && Ws(this._cacheName);
  }
  /**
   * @param {string} url
   * @param {number} timestamp
   *
   * @private
   */
  async setTimestamp(e, t) {
    e = rt(e);
    const a = {
      url: e,
      timestamp: t,
      cacheName: this._cacheName,
      // Creating an ID from the URL and cache name won't be necessary once
      // Edge switches to Chromium and all browsers we support work with
      // array keyPaths.
      id: this._getId(e)
    }, o = (await this.getDb()).transaction(ne, "readwrite", {
      durability: "relaxed"
    });
    await o.store.put(a), await o.done;
  }
  /**
   * Returns the timestamp stored for a given URL.
   *
   * @param {string} url
   * @return {number | undefined}
   *
   * @private
   */
  async getTimestamp(e) {
    const a = await (await this.getDb()).get(ne, this._getId(e));
    return a == null ? void 0 : a.timestamp;
  }
  /**
   * Iterates through all the entries in the object store (from newest to
   * oldest) and removes entries once either `maxCount` is reached or the
   * entry's timestamp is less than `minTimestamp`.
   *
   * @param {number} minTimestamp
   * @param {number} maxCount
   * @return {Array<string>}
   *
   * @private
   */
  async expireEntries(e, t) {
    const a = await this.getDb();
    let n = await a.transaction(ne).store.index("timestamp").openCursor(null, "prev");
    const o = [];
    let i = 0;
    for (; n; ) {
      const d = n.value;
      d.cacheName === this._cacheName && (e && d.timestamp < e || t && i >= t ? o.push(n.value) : i++), n = await n.continue();
    }
    const A = [];
    for (const d of o)
      await a.delete(ne, d.id), A.push(d.url);
    return A;
  }
  /**
   * Takes a URL and returns an ID that will be unique in the object store.
   *
   * @param {string} url
   * @return {string}
   *
   * @private
   */
  _getId(e) {
    return this._cacheName + "|" + rt(e);
  }
  /**
   * Returns an open connection to the database.
   *
   * @private
   */
  async getDb() {
    return this._db || (this._db = await Ct(Ys, 1, {
      upgrade: this._upgradeDbAndDeleteOldDbs.bind(this)
    })), this._db;
  }
}
class Qs {
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
   * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
   * that will be used when calling `delete()` on the cache.
   */
  constructor(e, t = {}) {
    this._isRunning = !1, this._rerunRequested = !1, this._maxEntries = t.maxEntries, this._maxAgeSeconds = t.maxAgeSeconds, this._matchOptions = t.matchOptions, this._cacheName = e, this._timestampModel = new js(e);
  }
  /**
   * Expires entries for the given cache and given criteria.
   */
  async expireEntries() {
    if (this._isRunning) {
      this._rerunRequested = !0;
      return;
    }
    this._isRunning = !0;
    const e = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0, t = await this._timestampModel.expireEntries(e, this._maxEntries), a = await self.caches.open(this._cacheName);
    for (const n of t)
      await a.delete(n, this._matchOptions);
    this._isRunning = !1, this._rerunRequested && (this._rerunRequested = !1, ht(this.expireEntries()));
  }
  /**
   * Update the timestamp for the given URL. This ensures the when
   * removing entries based on maximum entries, most recently used
   * is accurate or when expiring, the timestamp is up-to-date.
   *
   * @param {string} url
   */
  async updateTimestamp(e) {
    await this._timestampModel.setTimestamp(e, Date.now());
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
  async isURLExpired(e) {
    if (this._maxAgeSeconds) {
      const t = await this._timestampModel.getTimestamp(e), a = Date.now() - this._maxAgeSeconds * 1e3;
      return t !== void 0 ? t < a : !0;
    } else
      return !1;
  }
  /**
   * Removes the IndexedDB object store used to keep track of cache expiration
   * metadata.
   */
  async delete() {
    this._rerunRequested = !1, await this._timestampModel.expireEntries(1 / 0);
  }
}
class G {
  /**
   * @param {ExpirationPluginOptions} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
   * that will be used when calling `delete()` on the cache.
   * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
   * automatic deletion if the available storage quota has been exceeded.
   */
  constructor(e = {}) {
    this.cachedResponseWillBeUsed = async ({ event: t, request: a, cacheName: n, cachedResponse: o }) => {
      if (!o)
        return null;
      const i = this._isResponseDateFresh(o), A = this._getCacheExpiration(n);
      ht(A.expireEntries());
      const d = A.updateTimestamp(a.url);
      if (t)
        try {
          t.waitUntil(d);
        } catch {
        }
      return i ? o : null;
    }, this.cacheDidUpdate = async ({ cacheName: t, request: a }) => {
      const n = this._getCacheExpiration(t);
      await n.updateTimestamp(a.url), await n.expireEntries();
    }, this._config = e, this._maxAgeSeconds = e.maxAgeSeconds, this._cacheExpirations = /* @__PURE__ */ new Map(), e.purgeOnQuotaError && Es(() => this.deleteCacheAndMetadata());
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
  _getCacheExpiration(e) {
    if (e === U.getRuntimeName())
      throw new C("expire-custom-caches-only");
    let t = this._cacheExpirations.get(e);
    return t || (t = new Qs(e, this._config), this._cacheExpirations.set(e, t)), t;
  }
  /**
   * @param {Response} cachedResponse
   * @return {boolean}
   *
   * @private
   */
  _isResponseDateFresh(e) {
    if (!this._maxAgeSeconds)
      return !0;
    const t = this._getDateHeaderTimestamp(e);
    if (t === null)
      return !0;
    const a = Date.now();
    return t >= a - this._maxAgeSeconds * 1e3;
  }
  /**
   * This method will extract the data header and parse it into a useful
   * value.
   *
   * @param {Response} cachedResponse
   * @return {number|null}
   *
   * @private
   */
  _getDateHeaderTimestamp(e) {
    if (!e.headers.has("date"))
      return null;
    const t = e.headers.get("date"), n = new Date(t).getTime();
    return isNaN(n) ? null : n;
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
    for (const [e, t] of this._cacheExpirations)
      await self.caches.delete(e), await t.delete();
    this._cacheExpirations = /* @__PURE__ */ new Map();
  }
}
class ke extends z {
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    let a = await t.cacheMatch(e), n;
    if (!a)
      try {
        a = await t.fetchAndCachePut(e);
      } catch (o) {
        o instanceof Error && (n = o);
      }
    if (!a)
      throw new C("no-response", { url: e.url, error: n });
    return a;
  }
}
class zs extends z {
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const a = await t.cacheMatch(e);
    if (!a)
      throw new C("no-response", { url: e.url });
    return a;
  }
}
const St = {
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
  cacheWillUpdate: async ({ response: s }) => s.status === 200 || s.status === 0 ? s : null
};
class Ke extends z {
  /**
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   * @param {number} [options.networkTimeoutSeconds] If set, any network requests
   * that fail to respond within the timeout will fallback to the cache.
   *
   * This option can be used to combat
   * "[lie-fi]{@link https://developers.google.com/web/fundamentals/performance/poor-connectivity/#lie-fi}"
   * scenarios.
   */
  constructor(e = {}) {
    super(e), this.plugins.some((t) => "cacheWillUpdate" in t) || this.plugins.unshift(St), this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const a = [], n = [];
    let o;
    if (this._networkTimeoutSeconds) {
      const { id: d, promise: b } = this._getTimeoutPromise({ request: e, logs: a, handler: t });
      o = d, n.push(b);
    }
    const i = this._getNetworkPromise({
      timeoutId: o,
      request: e,
      logs: a,
      handler: t
    });
    n.push(i);
    const A = await t.waitUntil((async () => await t.waitUntil(Promise.race(n)) || // If Promise.race() resolved with null, it might be due to a network
    // timeout + a cache miss. If that were to happen, we'd rather wait until
    // the networkPromise resolves instead of returning null.
    // Note that it's fine to await an already-resolved promise, so we don't
    // have to check to see if it's still "in flight".
    await i)());
    if (!A)
      throw new C("no-response", { url: e.url });
    return A;
  }
  /**
   * @param {Object} options
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs array
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  _getTimeoutPromise({ request: e, logs: t, handler: a }) {
    let n;
    return {
      promise: new Promise((i) => {
        n = setTimeout(async () => {
          i(await a.cacheMatch(e));
        }, this._networkTimeoutSeconds * 1e3);
      }),
      id: n
    };
  }
  /**
   * @param {Object} options
   * @param {number|undefined} options.timeoutId
   * @param {Request} options.request
   * @param {Array} options.logs A reference to the logs Array.
   * @param {Event} options.event
   * @return {Promise<Response>}
   *
   * @private
   */
  async _getNetworkPromise({ timeoutId: e, request: t, logs: a, handler: n }) {
    let o, i;
    try {
      i = await n.fetchAndCachePut(t);
    } catch (A) {
      A instanceof Error && (o = A);
    }
    return e && clearTimeout(e), (o || !i) && (i = await n.cacheMatch(t)), i;
  }
}
class gt extends z {
  /**
   * @param {Object} [options]
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {number} [options.networkTimeoutSeconds] If set, any network requests
   * that fail to respond within the timeout will result in a network error.
   */
  constructor(e = {}) {
    super(e), this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0;
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    let a, n;
    try {
      const o = [
        t.fetch(e)
      ];
      if (this._networkTimeoutSeconds) {
        const i = Tt(this._networkTimeoutSeconds * 1e3);
        o.push(i);
      }
      if (n = await Promise.race(o), !n)
        throw new Error(`Timed out the network response after ${this._networkTimeoutSeconds} seconds.`);
    } catch (o) {
      o instanceof Error && (a = o);
    }
    if (!n)
      throw new C("no-response", { url: e.url, error: a });
    return n;
  }
}
class We extends z {
  /**
   * @param {Object} [options]
   * @param {string} [options.cacheName] Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * {@link workbox-core.cacheNames}.
   * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} [options.fetchOptions] Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
   * `fetch()` requests made by this strategy.
   * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  constructor(e = {}) {
    super(e), this.plugins.some((t) => "cacheWillUpdate" in t) || this.plugins.unshift(St);
  }
  /**
   * @private
   * @param {Request|string} request A request to run this strategy for.
   * @param {workbox-strategies.StrategyHandler} handler The event that
   *     triggered the request.
   * @return {Promise<Response>}
   */
  async _handle(e, t) {
    const a = t.fetchAndCachePut(e).catch(() => {
    });
    t.waitUntil(a);
    let n = await t.cacheMatch(e), o;
    if (!n)
      try {
        n = await a;
      } catch (i) {
        i instanceof Error && (o = i);
      }
    if (!n)
      throw new C("no-response", { url: e.url, error: o });
    return n;
  }
}
const Js = () => {
  J(
    ({ url: s }) => s.pathname.startsWith("/manifest.webmanifest"),
    new We({
      cacheName: y.manifest,
      plugins: [
        new W({ statuses: [0, 200] }),
        new G({ maxEntries: 500, maxAgeSeconds: K.oneWeek })
      ]
    })
  );
}, Xs = () => {
  J(
    ({ url: s }) => s.pathname.startsWith("/assets") && (s.pathname.endsWith(".js") || s.pathname.endsWith(".css") || s.pathname.endsWith(".json")),
    new ke({
      cacheName: y.assetsJsCssJson,
      plugins: [
        new W({ statuses: [0, 200] }),
        new G({ maxEntries: 500, maxAgeSeconds: K.oneMonth })
      ]
    })
  );
}, $s = ["png", "jpg", "jpeg", "gif", "tiff", "ai", "svg", "webp", "webm"], Zs = (s) => $s.some((e) => s.pathname.endsWith(e)), ea = () => {
  J(
    // Add in any other file extensions or routing criteria as needed.
    ({ url: s }) => s.origin === self.location.origin && Zs(s),
    new We({
      cacheName: y.staticImages,
      plugins: [
        new W({ statuses: [0, 200] }),
        new G({ maxEntries: 500, maxAgeSeconds: K.oneMonth })
      ]
    })
  );
}, ta = () => {
  J(
    ({ url: s }) => {
      if (!s.origin.startsWith(ft))
        return !1;
      const e = s.pathname.toLowerCase();
      return bt.some((t) => e.endsWith(t));
    },
    // new CacheFirst({
    new We({
      cacheName: y.cdnResponses,
      plugins: [
        new W({ statuses: [0, 200] }),
        new G({
          maxEntries: 500,
          // Don't keep any entries for more than 30 days.
          maxAgeSeconds: K.oneMonth,
          // Automatically cleanup if quota is exceeded.
          purgeOnQuotaError: !0
        })
      ]
    })
  );
}, sa = ["https://fonts.gstatic.com", "https://fonts.googleapis.com"], aa = () => {
  J(
    ({ url: s }) => sa.includes(s.origin) || s.pathname.endsWith(".woff2"),
    new ke({
      cacheName: y.googleFonts,
      plugins: [
        new W({ statuses: [0, 200] }),
        new G({ maxEntries: 500, maxAgeSeconds: K.oneMonth })
      ]
    })
  );
};
try {
  self["workbox:background-sync:7.0.0"] && _();
} catch {
}
const ct = 3, na = "workbox-background-sync", x = "requests", ie = "queueName";
class ia {
  constructor() {
    this._db = null;
  }
  /**
   * Add QueueStoreEntry to underlying db.
   *
   * @param {UnidentifiedQueueStoreEntry} entry
   */
  async addEntry(e) {
    const a = (await this.getDb()).transaction(x, "readwrite", {
      durability: "relaxed"
    });
    await a.store.add(e), await a.done;
  }
  /**
   * Returns the first entry id in the ObjectStore.
   *
   * @return {number | undefined}
   */
  async getFirstEntryId() {
    const t = await (await this.getDb()).transaction(x).store.openCursor();
    return t == null ? void 0 : t.value.id;
  }
  /**
   * Get all the entries filtered by index
   *
   * @param queueName
   * @return {Promise<QueueStoreEntry[]>}
   */
  async getAllEntriesByQueueName(e) {
    const a = await (await this.getDb()).getAllFromIndex(x, ie, IDBKeyRange.only(e));
    return a || new Array();
  }
  /**
   * Returns the number of entries filtered by index
   *
   * @param queueName
   * @return {Promise<number>}
   */
  async getEntryCountByQueueName(e) {
    return (await this.getDb()).countFromIndex(x, ie, IDBKeyRange.only(e));
  }
  /**
   * Deletes a single entry by id.
   *
   * @param {number} id the id of the entry to be deleted
   */
  async deleteEntry(e) {
    await (await this.getDb()).delete(x, e);
  }
  /**
   *
   * @param queueName
   * @returns {Promise<QueueStoreEntry | undefined>}
   */
  async getFirstEntryByQueueName(e) {
    return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "next");
  }
  /**
   *
   * @param queueName
   * @returns {Promise<QueueStoreEntry | undefined>}
   */
  async getLastEntryByQueueName(e) {
    return await this.getEndEntryFromIndex(IDBKeyRange.only(e), "prev");
  }
  /**
   * Returns either the first or the last entries, depending on direction.
   * Filtered by index.
   *
   * @param {IDBCursorDirection} direction
   * @param {IDBKeyRange} query
   * @return {Promise<QueueStoreEntry | undefined>}
   * @private
   */
  async getEndEntryFromIndex(e, t) {
    const n = await (await this.getDb()).transaction(x).store.index(ie).openCursor(e, t);
    return n == null ? void 0 : n.value;
  }
  /**
   * Returns an open connection to the database.
   *
   * @private
   */
  async getDb() {
    return this._db || (this._db = await Ct(na, ct, {
      upgrade: this._upgradeDb
    })), this._db;
  }
  /**
   * Upgrades QueueDB
   *
   * @param {IDBPDatabase<QueueDBSchema>} db
   * @param {number} oldVersion
   * @private
   */
  _upgradeDb(e, t) {
    t > 0 && t < ct && e.objectStoreNames.contains(x) && e.deleteObjectStore(x), e.createObjectStore(x, {
      autoIncrement: !0,
      keyPath: "id"
    }).createIndex(ie, ie, { unique: !1 });
  }
}
class oa {
  /**
   * Associates this instance with a Queue instance, so entries added can be
   * identified by their queue name.
   *
   * @param {string} queueName
   */
  constructor(e) {
    this._queueName = e, this._queueDb = new ia();
  }
  /**
   * Append an entry last in the queue.
   *
   * @param {Object} entry
   * @param {Object} entry.requestData
   * @param {number} [entry.timestamp]
   * @param {Object} [entry.metadata]
   */
  async pushEntry(e) {
    delete e.id, e.queueName = this._queueName, await this._queueDb.addEntry(e);
  }
  /**
   * Prepend an entry first in the queue.
   *
   * @param {Object} entry
   * @param {Object} entry.requestData
   * @param {number} [entry.timestamp]
   * @param {Object} [entry.metadata]
   */
  async unshiftEntry(e) {
    const t = await this._queueDb.getFirstEntryId();
    t ? e.id = t - 1 : delete e.id, e.queueName = this._queueName, await this._queueDb.addEntry(e);
  }
  /**
   * Removes and returns the last entry in the queue matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   */
  async popEntry() {
    return this._removeEntry(await this._queueDb.getLastEntryByQueueName(this._queueName));
  }
  /**
   * Removes and returns the first entry in the queue matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   */
  async shiftEntry() {
    return this._removeEntry(await this._queueDb.getFirstEntryByQueueName(this._queueName));
  }
  /**
   * Returns all entries in the store matching the `queueName`.
   *
   * @param {Object} options See {@link workbox-background-sync.Queue~getAll}
   * @return {Promise<Array<Object>>}
   */
  async getAll() {
    return await this._queueDb.getAllEntriesByQueueName(this._queueName);
  }
  /**
   * Returns the number of entries in the store matching the `queueName`.
   *
   * @param {Object} options See {@link workbox-background-sync.Queue~size}
   * @return {Promise<number>}
   */
  async size() {
    return await this._queueDb.getEntryCountByQueueName(this._queueName);
  }
  /**
   * Deletes the entry for the given ID.
   *
   * WARNING: this method does not ensure the deleted entry belongs to this
   * queue (i.e. matches the `queueName`). But this limitation is acceptable
   * as this class is not publicly exposed. An additional check would make
   * this method slower than it needs to be.
   *
   * @param {number} id
   */
  async deleteEntry(e) {
    await this._queueDb.deleteEntry(e);
  }
  /**
   * Removes and returns the first or last entry in the queue (based on the
   * `direction` argument) matching the `queueName`.
   *
   * @return {Promise<QueueStoreEntry|undefined>}
   * @private
   */
  async _removeEntry(e) {
    return e && await this.deleteEntry(e.id), e;
  }
}
const ra = [
  "method",
  "referrer",
  "referrerPolicy",
  "mode",
  "credentials",
  "cache",
  "redirect",
  "integrity",
  "keepalive"
];
class oe {
  /**
   * Converts a Request object to a plain object that can be structured
   * cloned or JSON-stringified.
   *
   * @param {Request} request
   * @return {Promise<StorableRequest>}
   */
  static async fromRequest(e) {
    const t = {
      url: e.url,
      headers: {}
    };
    e.method !== "GET" && (t.body = await e.clone().arrayBuffer());
    for (const [a, n] of e.headers.entries())
      t.headers[a] = n;
    for (const a of ra)
      e[a] !== void 0 && (t[a] = e[a]);
    return new oe(t);
  }
  /**
   * Accepts an object of request data that can be used to construct a
   * `Request` but can also be stored in IndexedDB.
   *
   * @param {Object} requestData An object of request data that includes the
   *     `url` plus any relevant properties of
   *     [requestInit]{@link https://fetch.spec.whatwg.org/#requestinit}.
   */
  constructor(e) {
    e.mode === "navigate" && (e.mode = "same-origin"), this._requestData = e;
  }
  /**
   * Returns a deep clone of the instances `_requestData` object.
   *
   * @return {Object}
   */
  toObject() {
    const e = Object.assign({}, this._requestData);
    return e.headers = Object.assign({}, this._requestData.headers), e.body && (e.body = e.body.slice(0)), e;
  }
  /**
   * Converts this instance to a Request.
   *
   * @return {Request}
   */
  toRequest() {
    return new Request(this._requestData.url, this._requestData);
  }
  /**
   * Creates and returns a deep clone of the instance.
   *
   * @return {StorableRequest}
   */
  clone() {
    return new oe(this.toObject());
  }
}
const _t = "workbox-background-sync", ca = 60 * 24 * 7, Ve = /* @__PURE__ */ new Set(), lt = (s) => {
  const e = {
    request: new oe(s.requestData).toRequest(),
    timestamp: s.timestamp
  };
  return s.metadata && (e.metadata = s.metadata), e;
};
class _a {
  /**
   * Creates an instance of Queue with the given options
   *
   * @param {string} name The unique name for this queue. This name must be
   *     unique as it's used to register sync events and store requests
   *     in IndexedDB specific to this instance. An error will be thrown if
   *     a duplicate name is detected.
   * @param {Object} [options]
   * @param {Function} [options.onSync] A function that gets invoked whenever
   *     the 'sync' event fires. The function is invoked with an object
   *     containing the `queue` property (referencing this instance), and you
   *     can use the callback to customize the replay behavior of the queue.
   *     When not set the `replayRequests()` method is called.
   *     Note: if the replay fails after a sync event, make sure you throw an
   *     error, so the browser knows to retry the sync event later.
   * @param {number} [options.maxRetentionTime=7 days] The amount of time (in
   *     minutes) a request may be retried. After this amount of time has
   *     passed, the request will be deleted from the queue.
   * @param {boolean} [options.forceSyncFallback=false] If `true`, instead
   *     of attempting to use background sync events, always attempt to replay
   *     queued request at service worker startup. Most folks will not need
   *     this, unless you explicitly target a runtime like Electron that
   *     exposes the interfaces for background sync, but does not have a working
   *     implementation.
   */
  constructor(e, { forceSyncFallback: t, onSync: a, maxRetentionTime: n } = {}) {
    if (this._syncInProgress = !1, this._requestsAddedDuringSync = !1, Ve.has(e))
      throw new C("duplicate-queue-name", { name: e });
    Ve.add(e), this._name = e, this._onSync = a || this.replayRequests, this._maxRetentionTime = n || ca, this._forceSyncFallback = !!t, this._queueStore = new oa(this._name), this._addSyncListener();
  }
  /**
   * @return {string}
   */
  get name() {
    return this._name;
  }
  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the end of the queue.
   *
   * @param {QueueEntry} entry
   * @param {Request} entry.request The request to store in the queue.
   * @param {Object} [entry.metadata] Any metadata you want associated with the
   *     stored request. When requests are replayed you'll have access to this
   *     metadata object in case you need to modify the request beforehand.
   * @param {number} [entry.timestamp] The timestamp (Epoch time in
   *     milliseconds) when the request was first added to the queue. This is
   *     used along with `maxRetentionTime` to remove outdated requests. In
   *     general you don't need to set this value, as it's automatically set
   *     for you (defaulting to `Date.now()`), but you can update it if you
   *     don't want particular requests to expire.
   */
  async pushRequest(e) {
    await this._addRequest(e, "push");
  }
  /**
   * Stores the passed request in IndexedDB (with its timestamp and any
   * metadata) at the beginning of the queue.
   *
   * @param {QueueEntry} entry
   * @param {Request} entry.request The request to store in the queue.
   * @param {Object} [entry.metadata] Any metadata you want associated with the
   *     stored request. When requests are replayed you'll have access to this
   *     metadata object in case you need to modify the request beforehand.
   * @param {number} [entry.timestamp] The timestamp (Epoch time in
   *     milliseconds) when the request was first added to the queue. This is
   *     used along with `maxRetentionTime` to remove outdated requests. In
   *     general you don't need to set this value, as it's automatically set
   *     for you (defaulting to `Date.now()`), but you can update it if you
   *     don't want particular requests to expire.
   */
  async unshiftRequest(e) {
    await this._addRequest(e, "unshift");
  }
  /**
   * Removes and returns the last request in the queue (along with its
   * timestamp and any metadata). The returned object takes the form:
   * `{request, timestamp, metadata}`.
   *
   * @return {Promise<QueueEntry | undefined>}
   */
  async popRequest() {
    return this._removeRequest("pop");
  }
  /**
   * Removes and returns the first request in the queue (along with its
   * timestamp and any metadata). The returned object takes the form:
   * `{request, timestamp, metadata}`.
   *
   * @return {Promise<QueueEntry | undefined>}
   */
  async shiftRequest() {
    return this._removeRequest("shift");
  }
  /**
   * Returns all the entries that have not expired (per `maxRetentionTime`).
   * Any expired entries are removed from the queue.
   *
   * @return {Promise<Array<QueueEntry>>}
   */
  async getAll() {
    const e = await this._queueStore.getAll(), t = Date.now(), a = [];
    for (const n of e) {
      const o = this._maxRetentionTime * 60 * 1e3;
      t - n.timestamp > o ? await this._queueStore.deleteEntry(n.id) : a.push(lt(n));
    }
    return a;
  }
  /**
   * Returns the number of entries present in the queue.
   * Note that expired entries (per `maxRetentionTime`) are also included in this count.
   *
   * @return {Promise<number>}
   */
  async size() {
    return await this._queueStore.size();
  }
  /**
   * Adds the entry to the QueueStore and registers for a sync event.
   *
   * @param {Object} entry
   * @param {Request} entry.request
   * @param {Object} [entry.metadata]
   * @param {number} [entry.timestamp=Date.now()]
   * @param {string} operation ('push' or 'unshift')
   * @private
   */
  async _addRequest({ request: e, metadata: t, timestamp: a = Date.now() }, n) {
    const i = {
      requestData: (await oe.fromRequest(e.clone())).toObject(),
      timestamp: a
    };
    switch (t && (i.metadata = t), n) {
      case "push":
        await this._queueStore.pushEntry(i);
        break;
      case "unshift":
        await this._queueStore.unshiftEntry(i);
        break;
    }
    this._syncInProgress ? this._requestsAddedDuringSync = !0 : await this.registerSync();
  }
  /**
   * Removes and returns the first or last (depending on `operation`) entry
   * from the QueueStore that's not older than the `maxRetentionTime`.
   *
   * @param {string} operation ('pop' or 'shift')
   * @return {Object|undefined}
   * @private
   */
  async _removeRequest(e) {
    const t = Date.now();
    let a;
    switch (e) {
      case "pop":
        a = await this._queueStore.popEntry();
        break;
      case "shift":
        a = await this._queueStore.shiftEntry();
        break;
    }
    if (a) {
      const n = this._maxRetentionTime * 60 * 1e3;
      return t - a.timestamp > n ? this._removeRequest(e) : lt(a);
    } else
      return;
  }
  /**
   * Loops through each request in the queue and attempts to re-fetch it.
   * If any request fails to re-fetch, it's put back in the same position in
   * the queue (which registers a retry for the next sync event).
   */
  async replayRequests() {
    let e;
    for (; e = await this.shiftRequest(); )
      try {
        await fetch(e.request.clone());
      } catch {
        throw await this.unshiftRequest(e), new C("queue-replay-failed", { name: this._name });
      }
  }
  /**
   * Registers a sync event with a tag unique to this instance.
   */
  async registerSync() {
    if ("sync" in self.registration && !this._forceSyncFallback)
      try {
        await self.registration.sync.register(`${_t}:${this._name}`);
      } catch {
      }
  }
  /**
   * In sync-supporting browsers, this adds a listener for the sync event.
   * In non-sync-supporting browsers, or if _forceSyncFallback is true, this
   * will retry the queue on service worker startup.
   *
   * @private
   */
  _addSyncListener() {
    "sync" in self.registration && !this._forceSyncFallback ? self.addEventListener("sync", (e) => {
      if (e.tag === `${_t}:${this._name}`) {
        const t = async () => {
          this._syncInProgress = !0;
          let a;
          try {
            await this._onSync({ queue: this });
          } catch (n) {
            if (n instanceof Error)
              throw a = n, a;
          } finally {
            this._requestsAddedDuringSync && !(a && !e.lastChance) && await this.registerSync(), this._syncInProgress = !1, this._requestsAddedDuringSync = !1;
          }
        };
        e.waitUntil(t());
      }
    }) : this._onSync({ queue: this });
  }
  /**
   * Returns the set of queue names. This is primarily used to reset the list
   * of queue names in tests.
   *
   * @return {Set<string>}
   *
   * @private
   */
  static get _queueNames() {
    return Ve;
  }
}
class la {
  /**
   * @param {string} name See the {@link workbox-background-sync.Queue}
   *     documentation for parameter details.
   * @param {Object} [options] See the
   *     {@link workbox-background-sync.Queue} documentation for
   *     parameter details.
   */
  constructor(e, t) {
    this.fetchDidFail = async ({ request: a }) => {
      await this._queue.pushRequest({ request: a });
    }, this._queue = new _a(e, t);
  }
}
try {
  self["workbox:google-analytics:7.0.0"] && _();
} catch {
}
const Ea = "workbox-google-analytics", ua = 60 * 48, wt = "www.google-analytics.com", Rt = "www.googletagmanager.com", Aa = "/analytics.js", da = "/gtag/js", ha = "/gtm.js", Ta = /^\/(\w+\/)?collect/, pa = (s) => async ({ queue: e }) => {
  let t;
  for (; t = await e.shiftRequest(); ) {
    const { request: a, timestamp: n } = t, o = new URL(a.url);
    try {
      const i = a.method === "POST" ? new URLSearchParams(await a.clone().text()) : o.searchParams, A = n - (Number(i.get("qt")) || 0), d = Date.now() - A;
      if (i.set("qt", String(d)), s.parameterOverrides)
        for (const b of Object.keys(s.parameterOverrides)) {
          const R = s.parameterOverrides[b];
          i.set(b, R);
        }
      typeof s.hitFilter == "function" && s.hitFilter.call(null, i), await fetch(new Request(o.origin + o.pathname, {
        body: i.toString(),
        method: "POST",
        mode: "cors",
        credentials: "omit",
        headers: { "Content-Type": "text/plain" }
      }));
    } catch (i) {
      throw await e.unshiftRequest(t), i;
    }
  }
}, Pa = (s) => {
  const e = ({ url: a }) => a.hostname === wt && Ta.test(a.pathname), t = new gt({
    plugins: [s]
  });
  return [new v(e, t, "GET"), new v(e, t, "POST")];
}, Ia = (s) => {
  const e = ({ url: a }) => a.hostname === wt && a.pathname === Aa, t = new Ke({ cacheName: s });
  return new v(e, t, "GET");
}, ma = (s) => {
  const e = ({ url: a }) => a.hostname === Rt && a.pathname === da, t = new Ke({ cacheName: s });
  return new v(e, t, "GET");
}, fa = (s) => {
  const e = ({ url: a }) => a.hostname === Rt && a.pathname === ha, t = new Ke({ cacheName: s });
  return new v(e, t, "GET");
}, ba = (s = {}) => {
  const e = U.getGoogleAnalyticsName(s.cacheName), t = new la(Ea, {
    maxRetentionTime: ua,
    onSync: pa(s)
  }), a = [
    fa(e),
    Ia(e),
    ma(e),
    ...Pa(t)
  ], n = new Pt();
  for (const o of a)
    n.registerRoute(o);
  n.addFetchListener();
}, Oa = [
  "https://www.google-analytics.com/gtm/optimize.js",
  // 'https://analytics.tiktok.com/i18n/pixel/events.js',
  "https://www.google-analytics.com/analytics.js",
  "https://analytics.tiktok.com/i18n/pixel/identify.js",
  "https://analytics.tiktok.com/i18n/pixel/config.js"
], Na = () => {
  ba({
    // https://developer.chrome.com/docs/workbox/modules/workbox-google-analytics/#using-a-custom-metric-to-track-time-requests-spent-in-the-queu
    parameterOverrides: {
      cd1: "offline"
    }
  }), J(
    ({ url: s }) => Oa.some((e) => s.href.startsWith(e)),
    new ke({
      cacheName: y.analytics,
      plugins: [
        new W({ statuses: [0, 200] }),
        new G({ maxEntries: 500, maxAgeSeconds: K.oneMonth })
      ]
    })
  );
}, Ca = "/offline.html", Sa = "/offline.png", Et = new zs({
  cacheName: y.fallback,
  plugins: [
    new W({ statuses: [0, 200] }),
    new G({ maxEntries: 500, maxAgeSeconds: K.oneMonth })
  ]
}), ga = () => {
  Cs(async ({ event: s, request: e }) => {
    switch (e.destination) {
      case "document":
        return Et.handle({ event: s, request: Ca });
      case "image":
        return Et.handle({ event: s, request: Sa });
      default:
        return Response.error();
    }
  });
}, wa = () => {
  Js(), Xs(), ea(), ta(), aa(), Na(), ga();
};
var Ra = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function ya(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var xe = { exports: {} };
(function(s, e) {
  (function(t, a) {
    var n = "1.0.36", o = "", i = "?", A = "function", d = "undefined", b = "object", R = "string", g = "major", c = "model", E = "name", r = "type", l = "vendor", u = "version", D = "architecture", $ = "console", P = "mobile", p = "tablet", w = "smarttv", Y = "wearable", Ie = "embedded", me = 350, ce = "Amazon", Z = "Apple", Ge = "ASUS", qe = "BlackBerry", j = "Browser", _e = "Chrome", is = "Edge", le = "Firefox", Ee = "Google", Ye = "Huawei", fe = "LG", be = "Microsoft", je = "Motorola", ue = "Opera", Oe = "Samsung", Qe = "Sharp", Ae = "Sony", Ne = "Xiaomi", Ce = "Zebra", ze = "Facebook", Je = "Chromium OS", Xe = "Mac OS", os = function(I, f) {
      var T = {};
      for (var O in I)
        f[O] && f[O].length % 2 === 0 ? T[O] = f[O].concat(I[O]) : T[O] = I[O];
      return T;
    }, de = function(I) {
      for (var f = {}, T = 0; T < I.length; T++)
        f[I[T].toUpperCase()] = I[T];
      return f;
    }, $e = function(I, f) {
      return typeof I === R ? ee(f).indexOf(ee(I)) !== -1 : !1;
    }, ee = function(I) {
      return I.toLowerCase();
    }, rs = function(I) {
      return typeof I === R ? I.replace(/[^\d\.]/g, o).split(".")[0] : a;
    }, Se = function(I, f) {
      if (typeof I === R)
        return I = I.replace(/^\s\s*/, o), typeof f === d ? I : I.substring(0, me);
    }, te = function(I, f) {
      for (var T = 0, O, H, V, m, h, M; T < f.length && !h; ) {
        var we = f[T], tt = f[T + 1];
        for (O = H = 0; O < we.length && !h && we[O]; )
          if (h = we[O++].exec(I), h)
            for (V = 0; V < tt.length; V++)
              M = h[++H], m = tt[V], typeof m === b && m.length > 0 ? m.length === 2 ? typeof m[1] == A ? this[m[0]] = m[1].call(this, M) : this[m[0]] = m[1] : m.length === 3 ? typeof m[1] === A && !(m[1].exec && m[1].test) ? this[m[0]] = M ? m[1].call(this, M, m[2]) : a : this[m[0]] = M ? M.replace(m[1], m[2]) : a : m.length === 4 && (this[m[0]] = M ? m[3].call(this, M.replace(m[1], m[2])) : a) : this[m] = M || a;
        T += 2;
      }
    }, ge = function(I, f) {
      for (var T in f)
        if (typeof f[T] === b && f[T].length > 0) {
          for (var O = 0; O < f[T].length; O++)
            if ($e(f[T][O], I))
              return T === i ? a : T;
        } else if ($e(f[T], I))
          return T === i ? a : T;
      return I;
    }, cs = {
      "1.0": "/8",
      "1.2": "/1",
      "1.3": "/3",
      "2.0": "/412",
      "2.0.2": "/416",
      "2.0.3": "/417",
      "2.0.4": "/419",
      "?": "/"
    }, Ze = {
      ME: "4.90",
      "NT 3.11": "NT3.51",
      "NT 4.0": "NT4.0",
      2e3: "NT 5.0",
      XP: ["NT 5.1", "NT 5.2"],
      Vista: "NT 6.0",
      7: "NT 6.1",
      8: "NT 6.2",
      "8.1": "NT 6.3",
      10: ["NT 6.4", "NT 10.0"],
      RT: "ARM"
    }, et = {
      browser: [
        [
          /\b(?:crmo|crios)\/([\w\.]+)/i
          // Chrome for Android/iOS
        ],
        [u, [E, "Chrome"]],
        [
          /edg(?:e|ios|a)?\/([\w\.]+)/i
          // Microsoft Edge
        ],
        [u, [E, "Edge"]],
        [
          // Presto based
          /(opera mini)\/([-\w\.]+)/i,
          // Opera Mini
          /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
          // Opera Mobi/Tablet
          /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i
          // Opera
        ],
        [E, u],
        [
          /opios[\/ ]+([\w\.]+)/i
          // Opera mini on iphone >= 8.0
        ],
        [u, [E, ue + " Mini"]],
        [
          /\bopr\/([\w\.]+)/i
          // Opera Webkit
        ],
        [u, [E, ue]],
        [
          // Mixed
          /(kindle)\/([\w\.]+)/i,
          // Kindle
          /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
          // Lunascape/Maxthon/Netfront/Jasmine/Blazer
          // Trident based
          /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
          // Avant/IEMobile/SlimBrowser
          /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
          // Baidu Browser
          /(?:ms|\()(ie) ([\w\.]+)/i,
          // Internet Explorer
          // Webkit/KHTML based                                               // Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
          /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,
          // Rekonq/Puffin/Brave/Whale/QQBrowserLite/QQ, aka ShouQ
          /(heytap|ovi)browser\/([\d\.]+)/i,
          // Heytap/Ovi
          /(weibo)__([\d\.]+)/i
          // Weibo
        ],
        [E, u],
        [
          /(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i
          // UCBrowser
        ],
        [u, [E, "UC" + j]],
        [
          /microm.+\bqbcore\/([\w\.]+)/i,
          // WeChat Desktop for Windows Built-in Browser
          /\bqbcore\/([\w\.]+).+microm/i
        ],
        [u, [E, "WeChat(Win) Desktop"]],
        [
          /micromessenger\/([\w\.]+)/i
          // WeChat
        ],
        [u, [E, "WeChat"]],
        [
          /konqueror\/([\w\.]+)/i
          // Konqueror
        ],
        [u, [E, "Konqueror"]],
        [
          /trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i
          // IE11
        ],
        [u, [E, "IE"]],
        [
          /ya(?:search)?browser\/([\w\.]+)/i
          // Yandex
        ],
        [u, [E, "Yandex"]],
        [
          /(avast|avg)\/([\w\.]+)/i
          // Avast/AVG Secure Browser
        ],
        [[E, /(.+)/, "$1 Secure " + j], u],
        [
          /\bfocus\/([\w\.]+)/i
          // Firefox Focus
        ],
        [u, [E, le + " Focus"]],
        [
          /\bopt\/([\w\.]+)/i
          // Opera Touch
        ],
        [u, [E, ue + " Touch"]],
        [
          /coc_coc\w+\/([\w\.]+)/i
          // Coc Coc Browser
        ],
        [u, [E, "Coc Coc"]],
        [
          /dolfin\/([\w\.]+)/i
          // Dolphin
        ],
        [u, [E, "Dolphin"]],
        [
          /coast\/([\w\.]+)/i
          // Opera Coast
        ],
        [u, [E, ue + " Coast"]],
        [
          /miuibrowser\/([\w\.]+)/i
          // MIUI Browser
        ],
        [u, [E, "MIUI " + j]],
        [
          /fxios\/([-\w\.]+)/i
          // Firefox for iOS
        ],
        [u, [E, le]],
        [
          /\bqihu|(qi?ho?o?|360)browser/i
          // 360
        ],
        [[E, "360 " + j]],
        [
          /(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i
        ],
        [[E, /(.+)/, "$1 " + j], u],
        [
          // Oculus/Samsung/Sailfish/Huawei Browser
          /(comodo_dragon)\/([\w\.]+)/i
          // Comodo Dragon
        ],
        [[E, /_/g, " "], u],
        [
          /(electron)\/([\w\.]+) safari/i,
          // Electron-based App
          /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
          // Tesla
          /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i
          // QQBrowser/Baidu App/2345 Browser
        ],
        [E, u],
        [
          /(metasr)[\/ ]?([\w\.]+)/i,
          // SouGouBrowser
          /(lbbrowser)/i,
          // LieBao Browser
          /\[(linkedin)app\]/i
          // LinkedIn App for iOS & Android
        ],
        [E],
        [
          // WebView
          /((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i
          // Facebook App for iOS & Android
        ],
        [[E, ze], u],
        [
          /(kakao(?:talk|story))[\/ ]([\w\.]+)/i,
          // Kakao App
          /(naver)\(.*?(\d+\.[\w\.]+).*\)/i,
          // Naver InApp
          /safari (line)\/([\w\.]+)/i,
          // Line App for iOS
          /\b(line)\/([\w\.]+)\/iab/i,
          // Line App for Android
          /(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i
          // Chromium/Instagram/Snapchat
        ],
        [E, u],
        [
          /\bgsa\/([\w\.]+) .*safari\//i
          // Google Search Appliance on iOS
        ],
        [u, [E, "GSA"]],
        [
          /musical_ly(?:.+app_?version\/|_)([\w\.]+)/i
          // TikTok
        ],
        [u, [E, "TikTok"]],
        [
          /headlesschrome(?:\/([\w\.]+)| )/i
          // Chrome Headless
        ],
        [u, [E, _e + " Headless"]],
        [
          / wv\).+(chrome)\/([\w\.]+)/i
          // Chrome WebView
        ],
        [[E, _e + " WebView"], u],
        [
          /droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i
          // Android Browser
        ],
        [u, [E, "Android " + j]],
        [
          /(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i
          // Chrome/OmniWeb/Arora/Tizen/Nokia
        ],
        [E, u],
        [
          /version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i
          // Mobile Safari
        ],
        [u, [E, "Mobile Safari"]],
        [
          /version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i
          // Safari & Safari Mobile
        ],
        [u, E],
        [
          /webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i
          // Safari < 3.0
        ],
        [E, [u, ge, cs]],
        [
          /(webkit|khtml)\/([\w\.]+)/i
        ],
        [E, u],
        [
          // Gecko based
          /(navigator|netscape\d?)\/([-\w\.]+)/i
          // Netscape
        ],
        [[E, "Netscape"], u],
        [
          /mobile vr; rv:([\w\.]+)\).+firefox/i
          // Firefox Reality
        ],
        [u, [E, le + " Reality"]],
        [
          /ekiohf.+(flow)\/([\w\.]+)/i,
          // Flow
          /(swiftfox)/i,
          // Swiftfox
          /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
          // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror/Klar
          /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
          // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
          /(firefox)\/([\w\.]+)/i,
          // Other Firefox-based
          /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
          // Mozilla
          // Other
          /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
          // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir/Obigo/Mosaic/Go/ICE/UP.Browser
          /(links) \(([\w\.]+)/i,
          // Links
          /panasonic;(viera)/i
          // Panasonic Viera
        ],
        [E, u],
        [
          /(cobalt)\/([\w\.]+)/i
          // Cobalt
        ],
        [E, [u, /master.|lts./, ""]]
      ],
      cpu: [
        [
          /(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i
          // AMD64 (x64)
        ],
        [[D, "amd64"]],
        [
          /(ia32(?=;))/i
          // IA32 (quicktime)
        ],
        [[D, ee]],
        [
          /((?:i[346]|x)86)[;\)]/i
          // IA32 (x86)
        ],
        [[D, "ia32"]],
        [
          /\b(aarch64|arm(v?8e?l?|_?64))\b/i
          // ARM64
        ],
        [[D, "arm64"]],
        [
          /\b(arm(?:v[67])?ht?n?[fl]p?)\b/i
          // ARMHF
        ],
        [[D, "armhf"]],
        [
          // PocketPC mistakenly identified as PowerPC
          /windows (ce|mobile); ppc;/i
        ],
        [[D, "arm"]],
        [
          /((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i
          // PowerPC
        ],
        [[D, /ower/, o, ee]],
        [
          /(sun4\w)[;\)]/i
          // SPARC
        ],
        [[D, "sparc"]],
        [
          /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i
          // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
        ],
        [[D, ee]]
      ],
      device: [
        [
          //////////////////////////
          // MOBILES & TABLETS
          /////////////////////////
          // Samsung
          /\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i
        ],
        [c, [l, Oe], [r, p]],
        [
          /\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,
          /samsung[- ]([-\w]+)/i,
          /sec-(sgh\w+)/i
        ],
        [c, [l, Oe], [r, P]],
        [
          // Apple
          /(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i
          // iPod/iPhone
        ],
        [c, [l, Z], [r, P]],
        [
          /\((ipad);[-\w\),; ]+apple/i,
          // iPad
          /applecoremedia\/[\w\.]+ \((ipad)/i,
          /\b(ipad)\d\d?,\d\d?[;\]].+ios/i
        ],
        [c, [l, Z], [r, p]],
        [
          /(macintosh);/i
        ],
        [c, [l, Z]],
        [
          // Sharp
          /\b(sh-?[altvz]?\d\d[a-ekm]?)/i
        ],
        [c, [l, Qe], [r, P]],
        [
          // Huawei
          /\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i
        ],
        [c, [l, Ye], [r, p]],
        [
          /(?:huawei|honor)([-\w ]+)[;\)]/i,
          /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i
        ],
        [c, [l, Ye], [r, P]],
        [
          // Xiaomi
          /\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,
          // Xiaomi POCO
          /\b; (\w+) build\/hm\1/i,
          // Xiaomi Hongmi 'numeric' models
          /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
          // Xiaomi Hongmi
          /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
          // Xiaomi Redmi
          /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i
          // Xiaomi Mi
        ],
        [[c, /_/g, " "], [l, Ne], [r, P]],
        [
          /\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i
          // Mi Pad tablets
        ],
        [[c, /_/g, " "], [l, Ne], [r, p]],
        [
          // OPPO
          /; (\w+) bui.+ oppo/i,
          /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i
        ],
        [c, [l, "OPPO"], [r, P]],
        [
          // Vivo
          /vivo (\w+)(?: bui|\))/i,
          /\b(v[12]\d{3}\w?[at])(?: bui|;)/i
        ],
        [c, [l, "Vivo"], [r, P]],
        [
          // Realme
          /\b(rmx[12]\d{3})(?: bui|;|\))/i
        ],
        [c, [l, "Realme"], [r, P]],
        [
          // Motorola
          /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
          /\bmot(?:orola)?[- ](\w*)/i,
          /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i
        ],
        [c, [l, je], [r, P]],
        [
          /\b(mz60\d|xoom[2 ]{0,2}) build\//i
        ],
        [c, [l, je], [r, p]],
        [
          // LG
          /((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i
        ],
        [c, [l, fe], [r, p]],
        [
          /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
          /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
          /\blg-?([\d\w]+) bui/i
        ],
        [c, [l, fe], [r, P]],
        [
          // Lenovo
          /(ideatab[-\w ]+)/i,
          /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i
        ],
        [c, [l, "Lenovo"], [r, p]],
        [
          // Nokia
          /(?:maemo|nokia).*(n900|lumia \d+)/i,
          /nokia[-_ ]?([-\w\.]*)/i
        ],
        [[c, /_/g, " "], [l, "Nokia"], [r, P]],
        [
          // Google
          /(pixel c)\b/i
          // Google Pixel C
        ],
        [c, [l, Ee], [r, p]],
        [
          /droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i
          // Google Pixel
        ],
        [c, [l, Ee], [r, P]],
        [
          // Sony
          /droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i
        ],
        [c, [l, Ae], [r, P]],
        [
          /sony tablet [ps]/i,
          /\b(?:sony)?sgp\w+(?: bui|\))/i
        ],
        [[c, "Xperia Tablet"], [l, Ae], [r, p]],
        [
          // OnePlus
          / (kb2005|in20[12]5|be20[12][59])\b/i,
          /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i
        ],
        [c, [l, "OnePlus"], [r, P]],
        [
          // Amazon
          /(alexa)webm/i,
          /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,
          // Kindle Fire without Silk / Echo Show
          /(kf[a-z]+)( bui|\)).+silk\//i
          // Kindle Fire HD
        ],
        [c, [l, ce], [r, p]],
        [
          /((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i
          // Fire Phone
        ],
        [[c, /(.+)/g, "Fire Phone $1"], [l, ce], [r, P]],
        [
          // BlackBerry
          /(playbook);[-\w\),; ]+(rim)/i
          // BlackBerry PlayBook
        ],
        [c, l, [r, p]],
        [
          /\b((?:bb[a-f]|st[hv])100-\d)/i,
          /\(bb10; (\w+)/i
          // BlackBerry 10
        ],
        [c, [l, qe], [r, P]],
        [
          // Asus
          /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i
        ],
        [c, [l, Ge], [r, p]],
        [
          / (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i
        ],
        [c, [l, Ge], [r, P]],
        [
          // HTC
          /(nexus 9)/i
          // HTC Nexus 9
        ],
        [c, [l, "HTC"], [r, p]],
        [
          /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
          // HTC
          // ZTE
          /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
          /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i
          // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
        ],
        [l, [c, /_/g, " "], [r, P]],
        [
          // Acer
          /droid.+; ([ab][1-7]-?[0178a]\d\d?)/i
        ],
        [c, [l, "Acer"], [r, p]],
        [
          // Meizu
          /droid.+; (m[1-5] note) bui/i,
          /\bmz-([-\w]{2,})/i
        ],
        [c, [l, "Meizu"], [r, P]],
        [
          // MIXED
          /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,
          // BlackBerry/BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
          /(hp) ([\w ]+\w)/i,
          // HP iPAQ
          /(asus)-?(\w+)/i,
          // Asus
          /(microsoft); (lumia[\w ]+)/i,
          // Microsoft Lumia
          /(lenovo)[-_ ]?([-\w]+)/i,
          // Lenovo
          /(jolla)/i,
          // Jolla
          /(oppo) ?([\w ]+) bui/i
          // OPPO
        ],
        [l, c, [r, P]],
        [
          /(kobo)\s(ereader|touch)/i,
          // Kobo
          /(archos) (gamepad2?)/i,
          // Archos
          /(hp).+(touchpad(?!.+tablet)|tablet)/i,
          // HP TouchPad
          /(kindle)\/([\w\.]+)/i,
          // Kindle
          /(nook)[\w ]+build\/(\w+)/i,
          // Nook
          /(dell) (strea[kpr\d ]*[\dko])/i,
          // Dell Streak
          /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
          // Le Pan Tablets
          /(trinity)[- ]*(t\d{3}) bui/i,
          // Trinity Tablets
          /(gigaset)[- ]+(q\w{1,9}) bui/i,
          // Gigaset Tablets
          /(vodafone) ([\w ]+)(?:\)| bui)/i
          // Vodafone
        ],
        [l, c, [r, p]],
        [
          /(surface duo)/i
          // Surface Duo
        ],
        [c, [l, be], [r, p]],
        [
          /droid [\d\.]+; (fp\du?)(?: b|\))/i
          // Fairphone
        ],
        [c, [l, "Fairphone"], [r, P]],
        [
          /(u304aa)/i
          // AT&T
        ],
        [c, [l, "AT&T"], [r, P]],
        [
          /\bsie-(\w*)/i
          // Siemens
        ],
        [c, [l, "Siemens"], [r, P]],
        [
          /\b(rct\w+) b/i
          // RCA Tablets
        ],
        [c, [l, "RCA"], [r, p]],
        [
          /\b(venue[\d ]{2,7}) b/i
          // Dell Venue Tablets
        ],
        [c, [l, "Dell"], [r, p]],
        [
          /\b(q(?:mv|ta)\w+) b/i
          // Verizon Tablet
        ],
        [c, [l, "Verizon"], [r, p]],
        [
          /\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i
          // Barnes & Noble Tablet
        ],
        [c, [l, "Barnes & Noble"], [r, p]],
        [
          /\b(tm\d{3}\w+) b/i
        ],
        [c, [l, "NuVision"], [r, p]],
        [
          /\b(k88) b/i
          // ZTE K Series Tablet
        ],
        [c, [l, "ZTE"], [r, p]],
        [
          /\b(nx\d{3}j) b/i
          // ZTE Nubia
        ],
        [c, [l, "ZTE"], [r, P]],
        [
          /\b(gen\d{3}) b.+49h/i
          // Swiss GEN Mobile
        ],
        [c, [l, "Swiss"], [r, P]],
        [
          /\b(zur\d{3}) b/i
          // Swiss ZUR Tablet
        ],
        [c, [l, "Swiss"], [r, p]],
        [
          /\b((zeki)?tb.*\b) b/i
          // Zeki Tablets
        ],
        [c, [l, "Zeki"], [r, p]],
        [
          /\b([yr]\d{2}) b/i,
          /\b(dragon[- ]+touch |dt)(\w{5}) b/i
          // Dragon Touch Tablet
        ],
        [[l, "Dragon Touch"], c, [r, p]],
        [
          /\b(ns-?\w{0,9}) b/i
          // Insignia Tablets
        ],
        [c, [l, "Insignia"], [r, p]],
        [
          /\b((nxa|next)-?\w{0,9}) b/i
          // NextBook Tablets
        ],
        [c, [l, "NextBook"], [r, p]],
        [
          /\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i
          // Voice Xtreme Phones
        ],
        [[l, "Voice"], c, [r, P]],
        [
          /\b(lvtel\-)?(v1[12]) b/i
          // LvTel Phones
        ],
        [[l, "LvTel"], c, [r, P]],
        [
          /\b(ph-1) /i
          // Essential PH-1
        ],
        [c, [l, "Essential"], [r, P]],
        [
          /\b(v(100md|700na|7011|917g).*\b) b/i
          // Envizen Tablets
        ],
        [c, [l, "Envizen"], [r, p]],
        [
          /\b(trio[-\w\. ]+) b/i
          // MachSpeed Tablets
        ],
        [c, [l, "MachSpeed"], [r, p]],
        [
          /\btu_(1491) b/i
          // Rotor Tablets
        ],
        [c, [l, "Rotor"], [r, p]],
        [
          /(shield[\w ]+) b/i
          // Nvidia Shield Tablets
        ],
        [c, [l, "Nvidia"], [r, p]],
        [
          /(sprint) (\w+)/i
          // Sprint Phones
        ],
        [l, c, [r, P]],
        [
          /(kin\.[onetw]{3})/i
          // Microsoft Kin
        ],
        [[c, /\./g, " "], [l, be], [r, P]],
        [
          /droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i
          // Zebra
        ],
        [c, [l, Ce], [r, p]],
        [
          /droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i
        ],
        [c, [l, Ce], [r, P]],
        [
          ///////////////////
          // SMARTTVS
          ///////////////////
          /smart-tv.+(samsung)/i
          // Samsung
        ],
        [l, [r, w]],
        [
          /hbbtv.+maple;(\d+)/i
        ],
        [[c, /^/, "SmartTV"], [l, Oe], [r, w]],
        [
          /(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i
          // LG SmartTV
        ],
        [[l, fe], [r, w]],
        [
          /(apple) ?tv/i
          // Apple TV
        ],
        [l, [c, Z + " TV"], [r, w]],
        [
          /crkey/i
          // Google Chromecast
        ],
        [[c, _e + "cast"], [l, Ee], [r, w]],
        [
          /droid.+aft(\w+)( bui|\))/i
          // Fire TV
        ],
        [c, [l, ce], [r, w]],
        [
          /\(dtv[\);].+(aquos)/i,
          /(aquos-tv[\w ]+)\)/i
          // Sharp
        ],
        [c, [l, Qe], [r, w]],
        [
          /(bravia[\w ]+)( bui|\))/i
          // Sony
        ],
        [c, [l, Ae], [r, w]],
        [
          /(mitv-\w{5}) bui/i
          // Xiaomi
        ],
        [c, [l, Ne], [r, w]],
        [
          /Hbbtv.*(technisat) (.*);/i
          // TechniSAT
        ],
        [l, c, [r, w]],
        [
          /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
          // Roku
          /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i
          // HbbTV devices
        ],
        [[l, Se], [c, Se], [r, w]],
        [
          /\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i
          // SmartTV from Unidentified Vendors
        ],
        [[r, w]],
        [
          ///////////////////
          // CONSOLES
          ///////////////////
          /(ouya)/i,
          // Ouya
          /(nintendo) ([wids3utch]+)/i
          // Nintendo
        ],
        [l, c, [r, $]],
        [
          /droid.+; (shield) bui/i
          // Nvidia
        ],
        [c, [l, "Nvidia"], [r, $]],
        [
          /(playstation [345portablevi]+)/i
          // Playstation
        ],
        [c, [l, Ae], [r, $]],
        [
          /\b(xbox(?: one)?(?!; xbox))[\); ]/i
          // Microsoft Xbox
        ],
        [c, [l, be], [r, $]],
        [
          ///////////////////
          // WEARABLES
          ///////////////////
          /((pebble))app/i
          // Pebble
        ],
        [l, c, [r, Y]],
        [
          /(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i
          // Apple Watch
        ],
        [c, [l, Z], [r, Y]],
        [
          /droid.+; (glass) \d/i
          // Google Glass
        ],
        [c, [l, Ee], [r, Y]],
        [
          /droid.+; (wt63?0{2,3})\)/i
        ],
        [c, [l, Ce], [r, Y]],
        [
          /(quest( 2| pro)?)/i
          // Oculus Quest
        ],
        [c, [l, ze], [r, Y]],
        [
          ///////////////////
          // EMBEDDED
          ///////////////////
          /(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i
          // Tesla
        ],
        [l, [r, Ie]],
        [
          /(aeobc)\b/i
          // Echo Dot
        ],
        [c, [l, ce], [r, Ie]],
        [
          ////////////////////
          // MIXED (GENERIC)
          ///////////////////
          /droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i
          // Android Phones from Unidentified Vendors
        ],
        [c, [r, P]],
        [
          /droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i
          // Android Tablets from Unidentified Vendors
        ],
        [c, [r, p]],
        [
          /\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i
          // Unidentifiable Tablet
        ],
        [[r, p]],
        [
          /(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i
          // Unidentifiable Mobile
        ],
        [[r, P]],
        [
          /(android[-\w\. ]{0,9});.+buil/i
          // Generic Android Device
        ],
        [c, [l, "Generic"]]
      ],
      engine: [
        [
          /windows.+ edge\/([\w\.]+)/i
          // EdgeHTML
        ],
        [u, [E, is + "HTML"]],
        [
          /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i
          // Blink
        ],
        [u, [E, "Blink"]],
        [
          /(presto)\/([\w\.]+)/i,
          // Presto
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
          // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
          /ekioh(flow)\/([\w\.]+)/i,
          // Flow
          /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
          // KHTML/Tasman/Links
          /(icab)[\/ ]([23]\.[\d\.]+)/i,
          // iCab
          /\b(libweb)/i
        ],
        [E, u],
        [
          /rv\:([\w\.]{1,9})\b.+(gecko)/i
          // Gecko
        ],
        [u, E]
      ],
      os: [
        [
          // Windows
          /microsoft (windows) (vista|xp)/i
          // Windows (iTunes)
        ],
        [E, u],
        [
          /(windows) nt 6\.2; (arm)/i,
          // Windows RT
          /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
          // Windows Phone
          /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i
        ],
        [E, [u, ge, Ze]],
        [
          /(win(?=3|9|n)|win 9x )([nt\d\.]+)/i
        ],
        [[E, "Windows"], [u, ge, Ze]],
        [
          // iOS/macOS
          /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
          // iOS
          /(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,
          /cfnetwork\/.+darwin/i
        ],
        [[u, /_/g, "."], [E, "iOS"]],
        [
          /(mac os x) ?([\w\. ]*)/i,
          /(macintosh|mac_powerpc\b)(?!.+haiku)/i
          // Mac OS
        ],
        [[E, Xe], [u, /_/g, "."]],
        [
          // Mobile OSes
          /droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i
          // Android-x86/HarmonyOS
        ],
        [u, E],
        [
          // Android/WebOS/QNX/Bada/RIM/Maemo/MeeGo/Sailfish OS
          /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
          /(blackberry)\w*\/([\w\.]*)/i,
          // Blackberry
          /(tizen|kaios)[\/ ]([\w\.]+)/i,
          // Tizen/KaiOS
          /\((series40);/i
          // Series 40
        ],
        [E, u],
        [
          /\(bb(10);/i
          // BlackBerry 10
        ],
        [u, [E, qe]],
        [
          /(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i
          // Symbian
        ],
        [u, [E, "Symbian"]],
        [
          /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i
          // Firefox OS
        ],
        [u, [E, le + " OS"]],
        [
          /web0s;.+rt(tv)/i,
          /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i
          // WebOS
        ],
        [u, [E, "webOS"]],
        [
          /watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i
          // watchOS
        ],
        [u, [E, "watchOS"]],
        [
          // Google Chromecast
          /crkey\/([\d\.]+)/i
          // Google Chromecast
        ],
        [u, [E, _e + "cast"]],
        [
          /(cros) [\w]+(?:\)| ([\w\.]+)\b)/i
          // Chromium OS
        ],
        [[E, Je], u],
        [
          // Smart TVs
          /panasonic;(viera)/i,
          // Panasonic Viera
          /(netrange)mmh/i,
          // Netrange
          /(nettv)\/(\d+\.[\w\.]+)/i,
          // NetTV
          // Console
          /(nintendo|playstation) ([wids345portablevuch]+)/i,
          // Nintendo/Playstation
          /(xbox); +xbox ([^\);]+)/i,
          // Microsoft Xbox (360, One, X, S, Series X, Series S)
          // Other
          /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
          // Joli/Palm
          /(mint)[\/\(\) ]?(\w*)/i,
          // Mint
          /(mageia|vectorlinux)[; ]/i,
          // Mageia/VectorLinux
          /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
          // Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware/Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus/Raspbian/Plan9/Minix/RISCOS/Contiki/Deepin/Manjaro/elementary/Sabayon/Linspire
          /(hurd|linux) ?([\w\.]*)/i,
          // Hurd/Linux
          /(gnu) ?([\w\.]*)/i,
          // GNU
          /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
          // FreeBSD/NetBSD/OpenBSD/PC-BSD/GhostBSD/DragonFly
          /(haiku) (\w+)/i
          // Haiku
        ],
        [E, u],
        [
          /(sunos) ?([\w\.\d]*)/i
          // Solaris
        ],
        [[E, "Solaris"], u],
        [
          /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
          // Solaris
          /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
          // AIX
          /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,
          // BeOS/OS2/AmigaOS/MorphOS/OpenVMS/Fuchsia/HP-UX/SerenityOS
          /(unix) ?([\w\.]*)/i
          // UNIX
        ],
        [E, u]
      ]
    }, L = function(I, f) {
      if (typeof I === b && (f = I, I = a), !(this instanceof L))
        return new L(I, f).getResult();
      var T = typeof t !== d && t.navigator ? t.navigator : a, O = I || (T && T.userAgent ? T.userAgent : o), H = T && T.userAgentData ? T.userAgentData : a, V = f ? os(et, f) : et, m = T && T.userAgent == O;
      return this.getBrowser = function() {
        var h = {};
        return h[E] = a, h[u] = a, te.call(h, O, V.browser), h[g] = rs(h[u]), m && T && T.brave && typeof T.brave.isBrave == A && (h[E] = "Brave"), h;
      }, this.getCPU = function() {
        var h = {};
        return h[D] = a, te.call(h, O, V.cpu), h;
      }, this.getDevice = function() {
        var h = {};
        return h[l] = a, h[c] = a, h[r] = a, te.call(h, O, V.device), m && !h[r] && H && H.mobile && (h[r] = P), m && h[c] == "Macintosh" && T && typeof T.standalone !== d && T.maxTouchPoints && T.maxTouchPoints > 2 && (h[c] = "iPad", h[r] = p), h;
      }, this.getEngine = function() {
        var h = {};
        return h[E] = a, h[u] = a, te.call(h, O, V.engine), h;
      }, this.getOS = function() {
        var h = {};
        return h[E] = a, h[u] = a, te.call(h, O, V.os), m && !h[E] && H && H.platform != "Unknown" && (h[E] = H.platform.replace(/chrome os/i, Je).replace(/macos/i, Xe)), h;
      }, this.getResult = function() {
        return {
          ua: this.getUA(),
          browser: this.getBrowser(),
          engine: this.getEngine(),
          os: this.getOS(),
          device: this.getDevice(),
          cpu: this.getCPU()
        };
      }, this.getUA = function() {
        return O;
      }, this.setUA = function(h) {
        return O = typeof h === R && h.length > me ? Se(h, me) : h, this;
      }, this.setUA(O), this;
    };
    L.VERSION = n, L.BROWSER = de([E, u, g]), L.CPU = de([D]), L.DEVICE = de([c, l, r, $, P, w, p, Y, Ie]), L.ENGINE = L.OS = de([E, u]), s.exports && (e = s.exports = L), e.UAParser = L;
    var Q = typeof t !== d && (t.jQuery || t.Zepto);
    if (Q && !Q.ua) {
      var he = new L();
      Q.ua = he.getResult(), Q.ua.get = function() {
        return he.getUA();
      }, Q.ua.set = function(I) {
        he.setUA(I);
        var f = he.getResult();
        for (var T in f)
          Q.ua[T] = f[T];
      };
    }
  })(typeof window == "object" ? window : Ra);
})(xe, xe.exports);
var Da = xe.exports;
const La = /* @__PURE__ */ ya(Da), Va = La(), yt = () => {
  var s;
  return (s = Va.os) == null ? void 0 : s.name;
}, Dt = {
  iOS: "iOS",
  Android: "Android"
}, Lt = () => yt() === Dt.iOS, Vt = () => yt() === Dt.Android;
Lt() || Vt();
const re = { VITE_APP_BACKEND_HOST: "https://api.paysenger.com", VITE_APP_CACHE_VERSION: "v4", VITE_APP_TITLEAPP: "Paysenger", VITE_APP_I18N_FALLBACK_LOCALE: "en", VITE_APP_I18N_LOCALE: "en", VITE_APP_WEB_SITE: "https://paysenger.com/", VITE_APP_STRIPE_KEY: "pk_live_we4WLyULfoFmYBTaUzsU0V9200Qt3smKQl", VITE_APP_DOWNLOAD_ANDROID: "https://play.google.com/store/apps/details?id=com.paysenger.androidapp", VITE_APP_DOWNLOAD_IPHONE: "https://apps.apple.com/us/app/paysenger/id1460484935", VITE_APP_IS_SHOWN_STORE_BUTTONS: "false", VITE_APP_IS_SHOWN_LOGS: "true", VITE_APP_NFT_GATEWAY: "https://marketplace.paysenger.com", VITE_APP_IS_NFT_WALL_SHOWN: "true", VITE_APP_ENVIRONMENT: "production", VITE_APP_GOOGLE_CLOUD_RECAPTCHA_KEY: "6LfVCkYjAAAAAFLp42JupSIn8CZeXHHpPxfJ5Aj4", VITE_APP_IS_SHOWN_TOPS: "false", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_MANUAL: "0x96563b20F42b4d10FC8Fc0AFec58e9aA1caB8cf4", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_REQUEST_AUTOMINT: "0x4E64c89f2a6A2d54696b56005c9893Ae57b1Bb3E", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_SELFPOST_AUTOMINT: "0x5c37f938c1b85c9ec84d8e7ae90ede2f3106489f", VITE_APP_NFT_NETWORK: "bnb", VITE_APP_WITHDRAW_SERVICE_FEE: "0", VITE_APP_IS_NFT_DEMO_SHOWN: "true", VITE_APP_CHAT_EXPIRED: "5", VITE_APP_EGO_COIN_NAME: "EGO", VITE_APP_EGO_TOKENS_CONTRACT_DIST: "0xfeb120c36cd0b0316530712770b800449cba49c5", VITE_APP_EGO_TOKENS_CONTRACT: "0x44a21B3577924DCD2e9C81A3347D204C36a55466", VITE_APP_BLOCKCHAIN_CONDUIT_ADDRESS: "0x193370CC208C7AE1251ac68717b1ed12Ba83F6B3", VITE_APP_NFT_DEADLINE_IN_SECONDS: "2628000", VITE_APP_EGO_TOKENS_CHAIN_ID: "56", VITE_APP_EGO_TOKENS_DECIMALS: "18", VITE_APP_EGO_TOKENS_FAUCET: "", VITE_APP_EGO_TOKENS_IMAGE: "https://egoco.in/img/logo_gray.svg", VITE_APP_BLOCKCHAIN_SCAN_URL: "https://bscscan.com", VITE_APP_BLOCKCHAIN_SCAN_API_URL: "https://api.bscscan.com/api", VITE_APP_BLOCKCHAIN_SCAN_API_KEY: "HDVMTYQMD6I5A83GPJJNYQ8WRFF76M2NBF", VITE_APP_BLOCKCHAIN_CLAIM_CONTRACT: "0x301932BEB4A2B10Fb3a8b105A8DC12B3E25e3Ec2", VITE_APP_RECENT_CONTENT_LIMIT: "10", VITE_APP_DISCOVER_ID_FOR_MEMBERSHIPS_WIZARD: "40", VITE_APP_GAME_LEVELS_BENEFIT: "isPrimary", VITE_APP_ADDRESS_CYPRUS: "Operated by ATTN CAPITAL EU LTD, John Kennedy, 8, IRIS HOUSE, Floor 7, Office 740C 3106, Limassol, Cyprus<br/>under the license of Paysenger, Inc., California, USA", VITE_APP_DYNAMIC_LANDING_BONUS: "10", VITE_APP_PREMIUM_MULTIPLIER: "premium", VITE_APP_SENTRY_DSN: "https://49a37e57b74c4373957060e76b8e965e@sentry.ops.paysenger.net/14", BASE_URL: "./", MODE: "production", DEV: !1, PROD: !0, SSR: !1 }, Ma = 20, Ua = 20, xa = re.VITE_APP_USER_INFO_LENGTH || 1130, Ba = 1e3, va = re.VITE_APP_MONEY_PREFIX || "$", Fa = re.VITE_APP_MONEY_INPUT_PREFIX || "$", Ha = re.VITE_APP_WITHDRAW_MIN_AMOUNT || 20, ka = re.VITE_APP_WITHDRAW_SERVICE_FEE, Ka = 5, Wa = 5, Ga = 2e3, qa = "######", Ya = {
  10: [10, 20, 50, 100],
  // $10- -------------– $10 / $20 / $50 / $100
  20: [20, 50, 100, 150],
  // 11-20 –----------- $20 / $50 / $100 / $150
  100: [100, 150, 200, 300],
  // 51 - 100 ------ $100 / $150 / $200 / $300
  150: [150, 200, 300, 500],
  // 101 - 150 ----- $150 / $200 / $300 / $500
  200: [200, 300, 500, 1e3],
  // 151 - 200 ---- $200 / $300 / $500 / $1000
  300: [300, 500, 1e3, 3e3],
  // 201 - 300 --- $300 / $500 / $1000 / $3000
  Infinity: [500, 1e3, 3e3, 5e3]
  // 301+ -- $500 / $1000 / $3000 / $5000
}, ja = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  EXPIRED_IN_DAYS: Wa,
  FUNDS_MIN_ADD: Ka,
  MAX_LENGTH_COMMENT: Ba,
  MAX_LENGTH_FIRST_NAME: Ma,
  MAX_LENGTH_LAST_NAME: Ua,
  MAX_REQUEST_RESPONSE_COMMENT: Ga,
  MONEY_INPUT_PREFIX: Fa,
  MONEY_PREFIX: va,
  PHONE_CONFIRM_CODE_MASK: qa,
  TOP_TUP_PRICES_MAP: Ya,
  USER_INFO_LENGTH: xa,
  WITHDRAW_MIN_AMOUNT: Ha,
  WITHDRAW_SERVICE_FEE: ka
}, Symbol.toStringTag, { value: "Module" })), Mt = "https://t.me/egocoin_en", Ut = "https://www.linkedin.com/company/paysenger-com/", xt = "https://www.tiktok.com/@paysenger", Bt = "https://discord.gg/nFKwRFKvpm", vt = "https://medium.com/@ego_paysenger", Ft = "https://www.facebook.com/ego.paysenger/", Ht = "https://www.instagram.com/paysenger_com", kt = "https://www.youtube.com/channel/UChd02YGf2ePGmEIe-SvunLA/videos", Kt = "https://twitter.com/Ego_Paysenger", Wt = "https://t.me/paysengeradd_bot", Gt = "https://m.me/paysengercom", Qa = "https://paysenger.com/@paysenger", qt = "https://career.paysenger.com/", Yt = "https://paysenger.com/affiliate/en", jt = "https://t.me/paysengeradd_bot", Qt = "https://m.me/paysengercom", zt = "https://wa.me/message/TVTYAKARXV3EM1", Jt = "https://paysenger.canny.io/feature-requests", za = {
  SOCIAL_TELEGRAM_URL: Mt,
  SOCIAL_LINKEDIN_URL: Ut,
  SOCIAL_TIKTOK_URL: xt,
  SOCIAL_DISCORD_URL: Bt,
  SOCIAL_MEDIUM_URL: vt,
  SOCIAL_FACEBOOK_URL: Ft,
  SOCIAL_INSTAGRAM_URL: Ht,
  SOCIAL_YOUTUBE_URL: kt,
  SOCIAL_TWITTER_URL: Kt,
  SOCIAL_SUPPORT_TELEGRAM_URL: Wt,
  /*
  SOCIAL_SUPPORT_WHATSAPP_URL,
  */
  SOCIAL_SUPPORT_FACEBOOK_URL: Gt,
  CAREER_URL: qt,
  AFFILIATE_URL: Yt,
  TELEGRAM_URL: jt,
  FACEBOOK_URL: Qt,
  WHATSAPP_URL: zt,
  FEEDBACK_URL: Jt
}, Ja = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AFFILIATE_URL: Yt,
  CAREER_URL: qt,
  FACEBOOK_URL: Qt,
  FEEDBACK_URL: Jt,
  PAYSENGER_SUPPORT: Qa,
  SOCIAL_DISCORD_URL: Bt,
  SOCIAL_FACEBOOK_URL: Ft,
  SOCIAL_INSTAGRAM_URL: Ht,
  SOCIAL_LINKEDIN_URL: Ut,
  SOCIAL_MEDIUM_URL: vt,
  SOCIAL_SUPPORT_FACEBOOK_URL: Gt,
  SOCIAL_SUPPORT_TELEGRAM_URL: Wt,
  SOCIAL_TELEGRAM_URL: Mt,
  SOCIAL_TIKTOK_URL: xt,
  SOCIAL_TWITTER_URL: Kt,
  SOCIAL_YOUTUBE_URL: kt,
  TELEGRAM_URL: jt,
  WHATSAPP_URL: zt,
  default: za
}, Symbol.toStringTag, { value: "Module" })), N = { VITE_APP_BACKEND_HOST: "https://api.paysenger.com", VITE_APP_CACHE_VERSION: "v4", VITE_APP_TITLEAPP: "Paysenger", VITE_APP_I18N_FALLBACK_LOCALE: "en", VITE_APP_I18N_LOCALE: "en", VITE_APP_WEB_SITE: "https://paysenger.com/", VITE_APP_STRIPE_KEY: "pk_live_we4WLyULfoFmYBTaUzsU0V9200Qt3smKQl", VITE_APP_DOWNLOAD_ANDROID: "https://play.google.com/store/apps/details?id=com.paysenger.androidapp", VITE_APP_DOWNLOAD_IPHONE: "https://apps.apple.com/us/app/paysenger/id1460484935", VITE_APP_IS_SHOWN_STORE_BUTTONS: "false", VITE_APP_IS_SHOWN_LOGS: "true", VITE_APP_NFT_GATEWAY: "https://marketplace.paysenger.com", VITE_APP_IS_NFT_WALL_SHOWN: "true", VITE_APP_ENVIRONMENT: "production", VITE_APP_GOOGLE_CLOUD_RECAPTCHA_KEY: "6LfVCkYjAAAAAFLp42JupSIn8CZeXHHpPxfJ5Aj4", VITE_APP_IS_SHOWN_TOPS: "false", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_MANUAL: "0x96563b20F42b4d10FC8Fc0AFec58e9aA1caB8cf4", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_REQUEST_AUTOMINT: "0x4E64c89f2a6A2d54696b56005c9893Ae57b1Bb3E", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_SELFPOST_AUTOMINT: "0x5c37f938c1b85c9ec84d8e7ae90ede2f3106489f", VITE_APP_NFT_NETWORK: "bnb", VITE_APP_WITHDRAW_SERVICE_FEE: "0", VITE_APP_IS_NFT_DEMO_SHOWN: "true", VITE_APP_CHAT_EXPIRED: "5", VITE_APP_EGO_COIN_NAME: "EGO", VITE_APP_EGO_TOKENS_CONTRACT_DIST: "0xfeb120c36cd0b0316530712770b800449cba49c5", VITE_APP_EGO_TOKENS_CONTRACT: "0x44a21B3577924DCD2e9C81A3347D204C36a55466", VITE_APP_BLOCKCHAIN_CONDUIT_ADDRESS: "0x193370CC208C7AE1251ac68717b1ed12Ba83F6B3", VITE_APP_NFT_DEADLINE_IN_SECONDS: "2628000", VITE_APP_EGO_TOKENS_CHAIN_ID: "56", VITE_APP_EGO_TOKENS_DECIMALS: "18", VITE_APP_EGO_TOKENS_FAUCET: "", VITE_APP_EGO_TOKENS_IMAGE: "https://egoco.in/img/logo_gray.svg", VITE_APP_BLOCKCHAIN_SCAN_URL: "https://bscscan.com", VITE_APP_BLOCKCHAIN_SCAN_API_URL: "https://api.bscscan.com/api", VITE_APP_BLOCKCHAIN_SCAN_API_KEY: "HDVMTYQMD6I5A83GPJJNYQ8WRFF76M2NBF", VITE_APP_BLOCKCHAIN_CLAIM_CONTRACT: "0x301932BEB4A2B10Fb3a8b105A8DC12B3E25e3Ec2", VITE_APP_RECENT_CONTENT_LIMIT: "10", VITE_APP_DISCOVER_ID_FOR_MEMBERSHIPS_WIZARD: "40", VITE_APP_GAME_LEVELS_BENEFIT: "isPrimary", VITE_APP_ADDRESS_CYPRUS: "Operated by ATTN CAPITAL EU LTD, John Kennedy, 8, IRIS HOUSE, Floor 7, Office 740C 3106, Limassol, Cyprus<br/>under the license of Paysenger, Inc., California, USA", VITE_APP_DYNAMIC_LANDING_BONUS: "10", VITE_APP_PREMIUM_MULTIPLIER: "premium", VITE_APP_SENTRY_DSN: "https://49a37e57b74c4373957060e76b8e965e@sentry.ops.paysenger.net/14", BASE_URL: "./", MODE: "production", DEV: !1, PROD: !0, SSR: !1 }, Xa = N.VITE_APP_IS_NFT_WALL_SHOWN === "true", $a = N.VITE_APP_IS_NFT_DEMO_SHOWN === "true", Za = N.VITE_APP_IPFS_UPLOAD_URL || "https://ipfs.infura.io:5001/api/v0", en = N.VITE_APP_IPFS_CLOUD || "https://paysengertest.infura-ipfs.io/ipfs", tn = N.VITE_APP_NFT_GATEWAY, sn = N.VITE_APP_METAMASK_DOWNLOAD_URL || "https://metamask.io/download/", an = N.VITE_APP_BLOCKCHAIN_CONDUIT_ADDRESS, nn = N.VITE_APP_NFT_NETWORK, on = N.VITE_APP_BLOCKCHAIN_NAME || "Binance", rn = N.VITE_APP_BLOCKCHAIN_SCAN_URL, cn = N.VITE_APP_BLOCKCHAIN_SCAN_API_URL, _n = N.VITE_APP_BLOCKCHAIN_SCAN_API_KEY, ln = N.VITE_APP_EGO_COIN_NAME, En = N.VITE_APP_NFT_DEADLINE_IN_SECONDS, un = N.VITE_APP_EGO_TOKENS_CONTRACT_DIST, An = N.VITE_APP_EGO_TOKENS_CONTRACT, dn = N.VITE_APP_EGO_TOKENS_CHAIN_ID, hn = N.VITE_APP_EGO_TOKENS_DECIMALS, Tn = "https://discord.gg/bnbchain", pn = N.VITE_APP_EGO_TOKENS_IMAGE, Xt = {
  moonbase: {
    chainId: "0x507",
    rpcUrls: ["https://moonbase-alpha.public.blastapi.io"],
    chainName: "Moonbase Alpha",
    nativeCurrency: {
      name: "Moonbase Coin",
      symbol: "DEV",
      decimals: 18
    },
    blockExplorerUrls: ["https://moonbase.moonscan.io/"]
  },
  bnbt: {
    chainId: "0x61",
    rpcUrls: [
      "https://data-seed-prebsc-1-s1.binance.org:8545/",
      "https://data-seed-prebsc-2-s1.binance.org:8545",
      "https://data-seed-prebsc-1-s2.binance.org:8545",
      "https://data-seed-prebsc-2-s2.binance.org:8545",
      "https://data-seed-prebsc-1-s3.binance.org:8545",
      "https://data-seed-prebsc-2-s3.binance.org:8545"
    ],
    chainName: "BSC testnet",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18
    },
    blockExplorerUrls: ["https://testnet.bscscan.com"]
  },
  erc20: {
    chainId: "0x1",
    rpcUrls: ["https://cloudflare-eth.com"],
    chainName: "Ethereum",
    nativeCurrency: {
      name: "Ethereum Coin",
      symbol: "ETH",
      decimals: 6
    },
    blockExplorerUrls: ["https://etherscan.io"]
  },
  bep20: {
    chainId: "0x38",
    rpcUrls: [
      "https://bsc-dataseed.binance.org/",
      "https://bsc-dataseed1.binance.org",
      "https://bsc-dataseed2.binance.org",
      "https://bsc-dataseed3.binance.org",
      "https://bsc-dataseed4.binance.org"
    ],
    chainName: "BSC",
    nativeCurrency: {
      name: "Binance Coin",
      symbol: "BNB",
      decimals: 18
    },
    blockExplorerUrls: ["https://bscscan.com"]
  },
  mumbai: {
    chainId: "0x13881",
    rpcUrls: ["https://polygon-mumbai.infura.io/v3/4983e251b9a64533b494726bf154ccf6"],
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
  },
  maticmum: {
    chainId: "0x13881",
    rpcUrls: ["https://polygon-mumbai.infura.io/v3/4983e251b9a64533b494726bf154ccf6"],
    chainName: "Mumbai",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"]
  }
}, Pn = Object.keys(Xt).reduce((s, e) => ({ ...s, [e]: e }), {}), In = N.VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_MANUAL, mn = N.VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_REQUEST_AUTOMINT, fn = N.VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_SELFPOST_AUTOMINT, bn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BLOCKCHAIN_CONDUIT_ADDRESS: an,
  BLOCKCHAIN_CONTRACT_ADDRESS_MANUAL: In,
  BLOCKCHAIN_CONTRACT_ADDRESS_REQUEST_AUTOMINT: mn,
  BLOCKCHAIN_CONTRACT_ADDRESS_SELFPOST_AUTOMINT: fn,
  BLOCKCHAIN_NAME: on,
  BLOCKCHAIN_SCAN_API_KEY: _n,
  BLOCKCHAIN_SCAN_API_URL: cn,
  BLOCKCHAIN_SCAN_URL: rn,
  CRYPTO_NETWORKS: Xt,
  CRYPTO_NETWORKS_NAMES: Pn,
  EGO_COIN_NAME: ln,
  EGO_TOKENS_CHAIN_ID: dn,
  EGO_TOKENS_CONTRACT: An,
  EGO_TOKENS_CONTRACT_DIST: un,
  EGO_TOKENS_DECIMALS: hn,
  EGO_TOKENS_FAUCET: Tn,
  EGO_TOKENS_IMAGE: pn,
  IPFS_CLOUD: en,
  IPFS_UPLOAD_URL: Za,
  IS_NFT_DEMO_SHOWN: $a,
  IS_NFT_WALL_SHOWN: Xa,
  METAMASK_DOWNLOAD_URL: sn,
  NFT_DEADLINE_IN_SECONDS: En,
  NFT_GATEWAY: tn,
  NFT_NETWORK: nn
}, Symbol.toStringTag, { value: "Module" })), Pe = {
  confirmEmail: "confirmEmail",
  confirm: "confirm",
  codeSended: "codeSended",
  dontShowNFTRemindModal: "dontShowNFTRemindModal",
  automintBannerCountCloses: "automintBannerCountCloses",
  registerFromUser: "registerFromUser"
}, On = [Pe.dontShowNFTRemindModal, Pe.automintBannerCountCloses], Nn = (s) => localStorage[s], Cn = (s, e) => {
  let t = e;
  return typeof e == "object" && (t = JSON.stringify(e)), localStorage[s] = t;
}, Sn = (s) => localStorage.removeItem(s), gn = () => {
  Object.keys(Pe).forEach((s) => {
    On.includes(s) || localStorage.removeItem(s);
  });
}, wn = "accessToken", Rn = "currentUserIdToken", yn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ACCESS_TOKEN_LS_KEY: wn,
  CURRENT_USER_ID_LS_KEY: Rn,
  clearLocalStorage: gn,
  getLocalStorageByKey: Nn,
  localStorageMap: Pe,
  removeLocalStorageByKey: Sn,
  setLocalStorageByKey: Cn
}, Symbol.toStringTag, { value: "Module" })), Dn = {
  Discover: "Discover",
  Connections: "Connections",
  RequestHidden: "RequestHidden",
  RequestMedia: "RequestMedia",
  ProfileTasks: "ProfileTasks",
  ProfileExpertNotOwner: "ProfileExpertNotOwner",
  SettingsTipHowEgoWorks: "SettingsTipHowEgoWorks",
  SelfPostModalReadyToPublish: "SelfPostModalReadyToPublish",
  SelfPostModalTour: "SelfPostModalTour",
  ProfileWallResponsesCreate: {
    NewPostTutor: "ProfileWallResponsesCreate.NewPostTutor",
    ReadyToGoToCreators: "ProfileWallResponsesCreate.ReadyToGoToCreators"
  },
  TopContentPageInfo: "TopContentPageInfo",
  FeedPaytagTip: "FeedPaytagTip",
  FeedTagTip: "FeedTagTip",
  TopCreatorsPageInfo: "TopCreatorsPageInfo"
}, Ln = {
  OnboardingCreator: "OnboardingCreator",
  OnboardingIdeas: "OnboardingIdeas",
  OnboardingTokens: "OnboardingTokens",
  OnboardingShare: "OnboardingShare",
  OnboardingSelfpost: "OnboardingSelfpost"
}, Vn = {
  creators: "creators",
  feed: "feed"
}, Mn = "vuex-pay", Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  INFO_BANNERS_MAP: Vn,
  VUEX_KEY: Mn,
  onboardingMap: Ln,
  tourMap: Dn
}, Symbol.toStringTag, { value: "Module" })), $t = [
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/vnd.wap.wbmp",
  "image/webp"
], Zt = [
  "video/mpeg",
  "video/mp4",
  "video/mov",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-ms-wmv",
  "video/x-flv",
  "video/x-msvideo",
  "video/3gpp",
  "video/3gpp2",
  "video/x-matroska",
  ".mkv"
], es = $t.join(","), ts = Zt.join(","), xn = `${es},${ts}`, Bn = 250, vn = 250, Fn = 50, Hn = 10, kn = {
  video: "video",
  image: "image",
  media: "media"
  // both (video + image)
}, Kn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ACCEPT_IMAGE: es,
  ACCEPT_MEDIA: xn,
  ACCEPT_VIDEO: ts,
  CONTENT_TYPES_MAP: kn,
  IMAGE_FORMATS: $t,
  IMAGE_LIMIT: Fn,
  MAX_ATTACHMENTS_COUNT: Hn,
  MAX_MEDIA_FILE_SIZE: Bn,
  VIDEO_FORMATS: Zt,
  VIDEO_LIMIT: vn
}, Symbol.toStringTag, { value: "Module" })), X = { VITE_APP_BACKEND_HOST: "https://api.paysenger.com", VITE_APP_CACHE_VERSION: "v4", VITE_APP_TITLEAPP: "Paysenger", VITE_APP_I18N_FALLBACK_LOCALE: "en", VITE_APP_I18N_LOCALE: "en", VITE_APP_WEB_SITE: "https://paysenger.com/", VITE_APP_STRIPE_KEY: "pk_live_we4WLyULfoFmYBTaUzsU0V9200Qt3smKQl", VITE_APP_DOWNLOAD_ANDROID: "https://play.google.com/store/apps/details?id=com.paysenger.androidapp", VITE_APP_DOWNLOAD_IPHONE: "https://apps.apple.com/us/app/paysenger/id1460484935", VITE_APP_IS_SHOWN_STORE_BUTTONS: "false", VITE_APP_IS_SHOWN_LOGS: "true", VITE_APP_NFT_GATEWAY: "https://marketplace.paysenger.com", VITE_APP_IS_NFT_WALL_SHOWN: "true", VITE_APP_ENVIRONMENT: "production", VITE_APP_GOOGLE_CLOUD_RECAPTCHA_KEY: "6LfVCkYjAAAAAFLp42JupSIn8CZeXHHpPxfJ5Aj4", VITE_APP_IS_SHOWN_TOPS: "false", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_MANUAL: "0x96563b20F42b4d10FC8Fc0AFec58e9aA1caB8cf4", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_REQUEST_AUTOMINT: "0x4E64c89f2a6A2d54696b56005c9893Ae57b1Bb3E", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_SELFPOST_AUTOMINT: "0x5c37f938c1b85c9ec84d8e7ae90ede2f3106489f", VITE_APP_NFT_NETWORK: "bnb", VITE_APP_WITHDRAW_SERVICE_FEE: "0", VITE_APP_IS_NFT_DEMO_SHOWN: "true", VITE_APP_CHAT_EXPIRED: "5", VITE_APP_EGO_COIN_NAME: "EGO", VITE_APP_EGO_TOKENS_CONTRACT_DIST: "0xfeb120c36cd0b0316530712770b800449cba49c5", VITE_APP_EGO_TOKENS_CONTRACT: "0x44a21B3577924DCD2e9C81A3347D204C36a55466", VITE_APP_BLOCKCHAIN_CONDUIT_ADDRESS: "0x193370CC208C7AE1251ac68717b1ed12Ba83F6B3", VITE_APP_NFT_DEADLINE_IN_SECONDS: "2628000", VITE_APP_EGO_TOKENS_CHAIN_ID: "56", VITE_APP_EGO_TOKENS_DECIMALS: "18", VITE_APP_EGO_TOKENS_FAUCET: "", VITE_APP_EGO_TOKENS_IMAGE: "https://egoco.in/img/logo_gray.svg", VITE_APP_BLOCKCHAIN_SCAN_URL: "https://bscscan.com", VITE_APP_BLOCKCHAIN_SCAN_API_URL: "https://api.bscscan.com/api", VITE_APP_BLOCKCHAIN_SCAN_API_KEY: "HDVMTYQMD6I5A83GPJJNYQ8WRFF76M2NBF", VITE_APP_BLOCKCHAIN_CLAIM_CONTRACT: "0x301932BEB4A2B10Fb3a8b105A8DC12B3E25e3Ec2", VITE_APP_RECENT_CONTENT_LIMIT: "10", VITE_APP_DISCOVER_ID_FOR_MEMBERSHIPS_WIZARD: "40", VITE_APP_GAME_LEVELS_BENEFIT: "isPrimary", VITE_APP_ADDRESS_CYPRUS: "Operated by ATTN CAPITAL EU LTD, John Kennedy, 8, IRIS HOUSE, Floor 7, Office 740C 3106, Limassol, Cyprus<br/>under the license of Paysenger, Inc., California, USA", VITE_APP_DYNAMIC_LANDING_BONUS: "10", VITE_APP_PREMIUM_MULTIPLIER: "premium", VITE_APP_SENTRY_DSN: "https://49a37e57b74c4373957060e76b8e965e@sentry.ops.paysenger.net/14", BASE_URL: "./", MODE: "production", DEV: !1, PROD: !0, SSR: !1 }, Wn = X.VITE_APP_DATE_FORMAT || "DD.MM.YY", Gn = X.VITE_APP_DATE_FORMAT || "DD.MM.YYYY", qn = X.VITE_APP_TIME_FORMAT || "HH:mm", Yn = X.VITE_APP_TIME_FORMAT || "HH:mm:ss", jn = X.VITE_APP_DATE_TIME_FORMAT || "DD.MM.YYYY HH:mm", Qn = X.VITE_APP_DATE_TIME_HUMAN_FORMAT || "MMM D, YYYY, HH:mm", zn = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DATE_FORMAT: Wn,
  DATE_FORMAT_FULL: Gn,
  DATE_TIME_FORMAT: jn,
  DATE_TIME_HUMAN_FORMAT: Qn,
  TIME_FORMAT: qn,
  TIME_FORMAT_FULL: Yn
}, Symbol.toStringTag, { value: "Module" })), Jn = {
  tag: "tags",
  // type: "request_topic", without media (hashtag): self post
  paytag: "request_topic"
  // type: "tags", with media: self post + pay post
}, Xn = {
  banner: "banner",
  paytag: "paytag"
}, $n = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BANNER_TYPES_MAP: Xn,
  TAG_TYPES: Jn
}, Symbol.toStringTag, { value: "Module" })), Zn = {
  inputs: ja,
  pwa: Rs,
  socials: Ja,
  crypto: bn,
  localStorage: yn,
  settings: Un,
  media: Kn,
  dateTime: zn,
  feed: $n
}, S = { VITE_APP_BACKEND_HOST: "https://api.paysenger.com", VITE_APP_CACHE_VERSION: "v4", VITE_APP_TITLEAPP: "Paysenger", VITE_APP_I18N_FALLBACK_LOCALE: "en", VITE_APP_I18N_LOCALE: "en", VITE_APP_WEB_SITE: "https://paysenger.com/", VITE_APP_STRIPE_KEY: "pk_live_we4WLyULfoFmYBTaUzsU0V9200Qt3smKQl", VITE_APP_DOWNLOAD_ANDROID: "https://play.google.com/store/apps/details?id=com.paysenger.androidapp", VITE_APP_DOWNLOAD_IPHONE: "https://apps.apple.com/us/app/paysenger/id1460484935", VITE_APP_IS_SHOWN_STORE_BUTTONS: "false", VITE_APP_IS_SHOWN_LOGS: "true", VITE_APP_NFT_GATEWAY: "https://marketplace.paysenger.com", VITE_APP_IS_NFT_WALL_SHOWN: "true", VITE_APP_ENVIRONMENT: "production", VITE_APP_GOOGLE_CLOUD_RECAPTCHA_KEY: "6LfVCkYjAAAAAFLp42JupSIn8CZeXHHpPxfJ5Aj4", VITE_APP_IS_SHOWN_TOPS: "false", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_MANUAL: "0x96563b20F42b4d10FC8Fc0AFec58e9aA1caB8cf4", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_REQUEST_AUTOMINT: "0x4E64c89f2a6A2d54696b56005c9893Ae57b1Bb3E", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_SELFPOST_AUTOMINT: "0x5c37f938c1b85c9ec84d8e7ae90ede2f3106489f", VITE_APP_NFT_NETWORK: "bnb", VITE_APP_WITHDRAW_SERVICE_FEE: "0", VITE_APP_IS_NFT_DEMO_SHOWN: "true", VITE_APP_CHAT_EXPIRED: "5", VITE_APP_EGO_COIN_NAME: "EGO", VITE_APP_EGO_TOKENS_CONTRACT_DIST: "0xfeb120c36cd0b0316530712770b800449cba49c5", VITE_APP_EGO_TOKENS_CONTRACT: "0x44a21B3577924DCD2e9C81A3347D204C36a55466", VITE_APP_BLOCKCHAIN_CONDUIT_ADDRESS: "0x193370CC208C7AE1251ac68717b1ed12Ba83F6B3", VITE_APP_NFT_DEADLINE_IN_SECONDS: "2628000", VITE_APP_EGO_TOKENS_CHAIN_ID: "56", VITE_APP_EGO_TOKENS_DECIMALS: "18", VITE_APP_EGO_TOKENS_FAUCET: "", VITE_APP_EGO_TOKENS_IMAGE: "https://egoco.in/img/logo_gray.svg", VITE_APP_BLOCKCHAIN_SCAN_URL: "https://bscscan.com", VITE_APP_BLOCKCHAIN_SCAN_API_URL: "https://api.bscscan.com/api", VITE_APP_BLOCKCHAIN_SCAN_API_KEY: "HDVMTYQMD6I5A83GPJJNYQ8WRFF76M2NBF", VITE_APP_BLOCKCHAIN_CLAIM_CONTRACT: "0x301932BEB4A2B10Fb3a8b105A8DC12B3E25e3Ec2", VITE_APP_RECENT_CONTENT_LIMIT: "10", VITE_APP_DISCOVER_ID_FOR_MEMBERSHIPS_WIZARD: "40", VITE_APP_GAME_LEVELS_BENEFIT: "isPrimary", VITE_APP_ADDRESS_CYPRUS: "Operated by ATTN CAPITAL EU LTD, John Kennedy, 8, IRIS HOUSE, Floor 7, Office 740C 3106, Limassol, Cyprus<br/>under the license of Paysenger, Inc., California, USA", VITE_APP_DYNAMIC_LANDING_BONUS: "10", VITE_APP_PREMIUM_MULTIPLIER: "premium", VITE_APP_SENTRY_DSN: "https://49a37e57b74c4373957060e76b8e965e@sentry.ops.paysenger.net/14", BASE_URL: "./", MODE: "production", DEV: !1, PROD: !0, SSR: !1 }, ei = S.MODE, ss = location.hash === "#hesoyam", as = S.VITE_APP_IS_STAGE === "true", ti = S.PROD, si = !as, ai = S.VITE_APP_IS_SHOWN_LOGS === "true", { BASE_URL: ni } = S, ii = S.VITE_APP_WEB_SITE, oi = S.VITE_APP_BACKEND_HOST, ri = S.VITE_APP_NOTIFICATION_SERVICE || "wss://notification-service.paysenger.com/", ci = S.VITE_APP_IS_SHOWN_STORE_BUTTONS === "true", _i = S.VITE_APP_VERSION || It, li = S.VITE_APP_I18N_LOCALE, Ei = S.VITE_APP_I18N_FALLBACK_LOCALE, ui = S.VITE_APP_SENTRY_DSN, Ai = gs, ns = "https://paysenger.onelink.me/Jznc/va6nqpsw", di = Vt() ? ns : S.VITE_APP_DOWNLOAD_ANDROID, hi = Lt() ? ns : S.VITE_APP_DOWNLOAD_IPHONE, Ti = S.VITE_APP_ADDRESS_CYPRUS, pi = "support@paysenger.com", Pi = `© Paysenger, 2021-${(/* @__PURE__ */ new Date()).getFullYear()}`, Ii = Object.freeze({
  env: { VITE_APP_BACKEND_HOST: "https://api.paysenger.com", VITE_APP_CACHE_VERSION: "v4", VITE_APP_TITLEAPP: "Paysenger", VITE_APP_I18N_FALLBACK_LOCALE: "en", VITE_APP_I18N_LOCALE: "en", VITE_APP_WEB_SITE: "https://paysenger.com/", VITE_APP_STRIPE_KEY: "pk_live_we4WLyULfoFmYBTaUzsU0V9200Qt3smKQl", VITE_APP_DOWNLOAD_ANDROID: "https://play.google.com/store/apps/details?id=com.paysenger.androidapp", VITE_APP_DOWNLOAD_IPHONE: "https://apps.apple.com/us/app/paysenger/id1460484935", VITE_APP_IS_SHOWN_STORE_BUTTONS: "false", VITE_APP_IS_SHOWN_LOGS: "true", VITE_APP_NFT_GATEWAY: "https://marketplace.paysenger.com", VITE_APP_IS_NFT_WALL_SHOWN: "true", VITE_APP_ENVIRONMENT: "production", VITE_APP_GOOGLE_CLOUD_RECAPTCHA_KEY: "6LfVCkYjAAAAAFLp42JupSIn8CZeXHHpPxfJ5Aj4", VITE_APP_IS_SHOWN_TOPS: "false", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_MANUAL: "0x96563b20F42b4d10FC8Fc0AFec58e9aA1caB8cf4", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_REQUEST_AUTOMINT: "0x4E64c89f2a6A2d54696b56005c9893Ae57b1Bb3E", VITE_APP_BLOCKCHAIN_CONTRACT_ADDRESS_SELFPOST_AUTOMINT: "0x5c37f938c1b85c9ec84d8e7ae90ede2f3106489f", VITE_APP_NFT_NETWORK: "bnb", VITE_APP_WITHDRAW_SERVICE_FEE: "0", VITE_APP_IS_NFT_DEMO_SHOWN: "true", VITE_APP_CHAT_EXPIRED: "5", VITE_APP_EGO_COIN_NAME: "EGO", VITE_APP_EGO_TOKENS_CONTRACT_DIST: "0xfeb120c36cd0b0316530712770b800449cba49c5", VITE_APP_EGO_TOKENS_CONTRACT: "0x44a21B3577924DCD2e9C81A3347D204C36a55466", VITE_APP_BLOCKCHAIN_CONDUIT_ADDRESS: "0x193370CC208C7AE1251ac68717b1ed12Ba83F6B3", VITE_APP_NFT_DEADLINE_IN_SECONDS: "2628000", VITE_APP_EGO_TOKENS_CHAIN_ID: "56", VITE_APP_EGO_TOKENS_DECIMALS: "18", VITE_APP_EGO_TOKENS_FAUCET: "", VITE_APP_EGO_TOKENS_IMAGE: "https://egoco.in/img/logo_gray.svg", VITE_APP_BLOCKCHAIN_SCAN_URL: "https://bscscan.com", VITE_APP_BLOCKCHAIN_SCAN_API_URL: "https://api.bscscan.com/api", VITE_APP_BLOCKCHAIN_SCAN_API_KEY: "HDVMTYQMD6I5A83GPJJNYQ8WRFF76M2NBF", VITE_APP_BLOCKCHAIN_CLAIM_CONTRACT: "0x301932BEB4A2B10Fb3a8b105A8DC12B3E25e3Ec2", VITE_APP_RECENT_CONTENT_LIMIT: "10", VITE_APP_DISCOVER_ID_FOR_MEMBERSHIPS_WIZARD: "40", VITE_APP_GAME_LEVELS_BENEFIT: "isPrimary", VITE_APP_ADDRESS_CYPRUS: "Operated by ATTN CAPITAL EU LTD, John Kennedy, 8, IRIS HOUSE, Floor 7, Office 740C 3106, Limassol, Cyprus<br/>under the license of Paysenger, Inc., California, USA", VITE_APP_DYNAMIC_LANDING_BONUS: "10", VITE_APP_PREMIUM_MULTIPLIER: "premium", VITE_APP_SENTRY_DSN: "https://49a37e57b74c4373957060e76b8e965e@sentry.ops.paysenger.net/14", BASE_URL: "./", MODE: "production", DEV: !1, PROD: !0, SSR: !1 },
  MODE_ENV: ei,
  IS_DEV: ss,
  IS_STAGE: as,
  NOTIFICATION_SERVICE: ri,
  IS_PROD: ti,
  IS_REAL_PROD: si,
  BASE_URL: ni,
  APP_VERSION: _i,
  APP_NAME: Ai,
  I18N_LOCALE: li,
  FALLBACK_LOCALE: Ei,
  BACKEND_HOST: oi,
  WEB_SITE: ii,
  DOWNLOAD_ANDROID: di,
  DOWNLOAD_IPHONE: hi,
  ADDRESS_CYPRUS: Ti,
  SUPPORT_MAIL: pi,
  COPYRIGHT: Pi,
  SENTRY_DSN: ui,
  IS_SHOWN_STORE_BUTTONS: ci,
  IS_SHOWN_LOGS: ai,
  modules: Zn
});
typeof globalThis < "u" && (globalThis.$$$NEQUE_TUT_SMOTRET = (s) => s === "show" ? Ii : "noop");
const mi = "font-size: 20px; background: white; color: black;", Be = {}, fi = () => {
  Object.entries(Be).forEach(([s, { header: e, body: t, title: a, logType: n, isStyled: o }]) => {
    const i = t ? [a, t] : [a];
    o ? console[n](`%c${i}`, mi) : console[n](...i), delete Be[s];
  });
};
let ut;
const q = ({
  header: s = Date.now(),
  body: e = "",
  title: t = "[DEPREC]",
  timeout: a = 1e3,
  showOnProd: n = !1,
  logType: o = "info",
  isStyled: i = !1
}) => {
  !ss && !n || (Be[s + e] = {
    header: s,
    body: e,
    title: t,
    logType: o,
    isStyled: i
  }, clearTimeout(ut), ut = setTimeout(fi, a));
}, bi = async (s) => (q({
  title: "[sw] removing old cache",
  body: s,
  logType: "warn"
}), caches.delete(s)), Oi = async () => {
  const e = (await caches.keys()).map((t) => {
    if (q({ title: "[sw] checking for outdated cache...", body: `${{ cacheName: t, cacheNames: at }}` }), !Object.values(at).includes(t) && !t.startsWith(Fe))
      return bi(t);
  });
  return Promise.all(e);
}, Ni = (s, e) => (q({ title: "pages,", body: s }), s.map((t) => {
  const { href: a } = new URL(t, e);
  return new Request(a, { credentials: "same-origin" });
})), At = async (s, e, t) => {
  const a = await caches.open(s), n = Ni(e, t);
  return a.addAll(n);
};
Ns();
Ss(new gt());
Is();
const Ci = [{"revision":"84f720fd77182bdf4aa374f42c9cec62","url":"manifest.webmanifest"}];
q({ title: "--- self ----", body: self });
q({ title: "[sw] ---manifest---", body: Ci, logType: "warn" });
self.addEventListener("install", (s) => {
  const { location: e } = self;
  return s.waitUntil(
    (async () => (await At(y.fallback, Ls, e), At(y.pages, Vs, e)))()
  );
});
self.addEventListener("activate", (s) => {
  q({
    title: "[sw] ACTIVATE",
    body: s,
    logType: "warn"
  }), s.waitUntil(Oi());
});
self.addEventListener("message", (s) => {
  s.data && s.data.type === "SKIP_WAITING" && (q({ title: "service-worker.js - SKIP_WAITING message received." }), self.skipWaiting());
});
wa();
