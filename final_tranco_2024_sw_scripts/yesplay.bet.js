(() => {
    var t = Object.defineProperty;
    var e = Object.defineProperties;
    var s = Object.getOwnPropertyDescriptors;
    var a = Object.getOwnPropertySymbols;
    var i = Object.prototype.hasOwnProperty;
    var n = Object.prototype.propertyIsEnumerable;
    var r = (e, s, a) => s in e ? t(e, s, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: a
    }) : e[s] = a;
    var h = (t, e) => {
        for (var s in e || (e = {})) if (i.call(e, s)) r(t, s, e[s]);
        if (a) for (var s of a(e)) {
            if (n.call(e, s)) r(t, s, e[s]);
        }
        return t;
    };
    var c = (t, a) => e(t, s(a));
    var o = class {
        constructor(t, e) {
            this.original = t;
            this.cacheNamePrefix = e;
        }
        delete(t) {
            return this.original.delete(`${this.cacheNamePrefix}:${t}`);
        }
        has(t) {
            return this.original.has(`${this.cacheNamePrefix}:${t}`);
        }
        async keys() {
            const t = `${this.cacheNamePrefix}:`;
            const e = await this.original.keys();
            const s = e.filter((e => e.startsWith(t)));
            return s.map((e => e.slice(t.length)));
        }
        match(t, e) {
            return this.original.match(t, e);
        }
        async open(t) {
            const e = await this.original.open(`${this.cacheNamePrefix}:${t}`);
            return Object.assign(e, {
                name: t
            });
        }
    };
    var l = class {
        constructor(t, e) {
            this.scopeUrl = t;
            const s = this.parseUrl(this.scopeUrl);
            this.origin = s.origin;
            this.caches = new o(e, `ngsw:${s.path}`);
        }
        newRequest(t, e) {
            return new Request(t, e);
        }
        newResponse(t, e) {
            return new Response(t, e);
        }
        newHeaders(t) {
            return new Headers(t);
        }
        isClient(t) {
            return t instanceof Client;
        }
        get time() {
            return Date.now();
        }
        normalizeUrl(t) {
            const e = this.parseUrl(t, this.scopeUrl);
            return e.origin === this.origin ? e.path : t;
        }
        parseUrl(t, e) {
            const s = !e ? new URL(t) : new URL(t, e);
            return {
                origin: s.origin,
                path: s.pathname,
                search: s.search
            };
        }
        timeout(t) {
            return new Promise((e => {
                setTimeout((() => e()), t);
            }));
        }
    };
    var u = class {
        constructor(t, e) {
            this.table = t;
            this.key = e;
        }
    };
    var d = class {
        constructor(t) {
            this.adapter = t;
            this.cacheNamePrefix = "db";
            this.tables = new Map;
        }
        delete(t) {
            if (this.tables.has(t)) {
                this.tables.delete(t);
            }
            return this.adapter.caches.delete(`${this.cacheNamePrefix}:${t}`);
        }
        async list() {
            const t = `${this.cacheNamePrefix}:`;
            const e = await this.adapter.caches.keys();
            const s = e.filter((e => e.startsWith(t)));
            return s.map((e => e.slice(t.length)));
        }
        async open(t, e) {
            if (!this.tables.has(t)) {
                const s = await this.adapter.caches.open(`${this.cacheNamePrefix}:${t}`);
                const a = new p(t, s, this.adapter, e);
                this.tables.set(t, a);
            }
            return this.tables.get(t);
        }
    };
    var p = class {
        constructor(t, e, s, a) {
            this.name = t;
            this.cache = e;
            this.adapter = s;
            this.cacheQueryOptions = a;
            this.cacheName = this.cache.name;
        }
        request(t) {
            return this.adapter.newRequest("/" + t);
        }
        delete(t) {
            return this.cache.delete(this.request(t), this.cacheQueryOptions);
        }
        keys() {
            return this.cache.keys().then((t => t.map((t => t.url.slice(1)))));
        }
        read(t) {
            return this.cache.match(this.request(t), this.cacheQueryOptions).then((e => {
                if (e === void 0) {
                    return Promise.reject(new u(this.name, t));
                }
                return e.json();
            }));
        }
        write(t, e) {
            return this.cache.put(this.request(t), this.adapter.newResponse(JSON.stringify(e)));
        }
    };
    var f;
    (function(t) {
        t[t["NOT_CACHED"] = 0] = "NOT_CACHED";
        t[t["CACHED_BUT_UNUSED"] = 1] = "CACHED_BUT_UNUSED";
        t[t["CACHED"] = 2] = "CACHED";
    })(f || (f = {}));
    var w = class extends Error {
        constructor() {
            super(...arguments);
            this.isCritical = true;
        }
    };
    function g(t) {
        if (t instanceof Error) {
            return `${t.message}\n${t.stack}`;
        } else {
            return `${t}`;
        }
    }
    var m = class extends w {
        constructor() {
            super(...arguments);
            this.isUnrecoverableState = true;
        }
    };
    function y(t) {
        const e = t;
        const s = O(e, $.Big);
        return C(s, e.length * 8);
    }
    function v(t) {
        const e = k(t, $.Big);
        return C(e, t.byteLength * 8);
    }
    function C(t, e) {
        const s = [];
        let [a, i, n, r, h] = [ 1732584193, 4023233417, 2562383102, 271733878, 3285377520 ];
        t[e >> 5] |= 128 << 24 - e % 32;
        t[(e + 64 >> 9 << 4) + 15] = e;
        for (let e = 0; e < t.length; e += 16) {
            const [c, o, l, u, d] = [ a, i, n, r, h ];
            for (let c = 0; c < 80; c++) {
                if (c < 16) {
                    s[c] = t[e + c];
                } else {
                    s[c] = R(s[c - 3] ^ s[c - 8] ^ s[c - 14] ^ s[c - 16], 1);
                }
                const [o, l] = E(c, i, n, r);
                const u = [ R(a, 5), o, h, l, s[c] ].reduce(b);
                [h, r, n, i, a] = [ r, n, R(i, 30), a, u ];
            }
            [a, i, n, r, h] = [ b(a, c), b(i, o), b(n, l), b(r, u), b(h, d) ];
        }
        return H(N([ a, i, n, r, h ]));
    }
    function b(t, e) {
        return A(t, e)[1];
    }
    function A(t, e) {
        const s = (t & 65535) + (e & 65535);
        const a = (t >>> 16) + (e >>> 16) + (s >>> 16);
        return [ a >>> 16, a << 16 | s & 65535 ];
    }
    function R(t, e) {
        return t << e | t >>> 32 - e;
    }
    var $;
    (function(t) {
        t[t["Little"] = 0] = "Little";
        t[t["Big"] = 1] = "Big";
    })($ || ($ = {}));
    function E(t, e, s, a) {
        if (t < 20) {
            return [ e & s | ~e & a, 1518500249 ];
        }
        if (t < 40) {
            return [ e ^ s ^ a, 1859775393 ];
        }
        if (t < 60) {
            return [ e & s | e & a | s & a, 2400959708 ];
        }
        return [ e ^ s ^ a, 3395469782 ];
    }
    function O(t, e) {
        const s = t.length + 3 >>> 2;
        const a = [];
        for (let i = 0; i < s; i++) {
            a[i] = F(t, i * 4, e);
        }
        return a;
    }
    function k(t, e) {
        const s = t.byteLength + 3 >>> 2;
        const a = [];
        const i = new Uint8Array(t);
        for (let t = 0; t < s; t++) {
            a[t] = F(i, t * 4, e);
        }
        return a;
    }
    function T(t, e) {
        if (typeof t === "string") {
            return e >= t.length ? 0 : t.charCodeAt(e) & 255;
        } else {
            return e >= t.byteLength ? 0 : t[e] & 255;
        }
    }
    function F(t, e, s) {
        let a = 0;
        if (s === $.Big) {
            for (let s = 0; s < 4; s++) {
                a += T(t, e + s) << 24 - 8 * s;
            }
        } else {
            for (let s = 0; s < 4; s++) {
                a += T(t, e + s) << 8 * s;
            }
        }
        return a;
    }
    function N(t) {
        return t.reduce(((t, e) => t + U(e)), "");
    }
    function U(t) {
        let e = "";
        for (let s = 0; s < 4; s++) {
            e += String.fromCharCode(t >>> 8 * (3 - s) & 255);
        }
        return e;
    }
    function H(t) {
        let e = "";
        for (let s = 0; s < t.length; s++) {
            const a = T(t, s);
            e += (a >>> 4).toString(16) + (a & 15).toString(16);
        }
        return e.toLowerCase();
    }
    var M = class {
        constructor(t, e, s, a, i, n, r) {
            this.scope = t;
            this.adapter = e;
            this.idle = s;
            this.config = a;
            this.hashes = i;
            this.db = n;
            this.inFlightRequests = new Map;
            this.urls = [];
            this.patterns = [];
            this.name = a.name;
            this.urls = a.urls.map((t => e.normalizeUrl(t)));
            this.patterns = a.patterns.map((t => new RegExp(t)));
            this.cache = e.caches.open(`${r}:${a.name}:cache`);
            this.metadata = this.db.open(`${r}:${a.name}:meta`, a.cacheQueryOptions);
        }
        async cacheStatus(t) {
            const e = await this.cache;
            const s = await this.metadata;
            const a = this.adapter.newRequest(t);
            const i = await e.match(a, this.config.cacheQueryOptions);
            if (i === void 0) {
                return f.NOT_CACHED;
            }
            try {
                const t = await s.read(a.url);
                if (!t.used) {
                    return f.CACHED_BUT_UNUSED;
                }
            } catch (t) {}
            return f.CACHED;
        }
        async getCacheNames() {
            const [t, e] = await Promise.all([ this.cache, this.metadata ]);
            return [ t.name, e.cacheName ];
        }
        async handleFetch(t, e) {
            const s = this.adapter.normalizeUrl(t.url);
            if (this.urls.indexOf(s) !== -1 || this.patterns.some((t => t.test(s)))) {
                const e = await this.cache;
                let a;
                try {
                    a = await e.match(t, this.config.cacheQueryOptions);
                } catch (t) {
                    throw new w(`Cache is throwing while looking for a match: ${t}`);
                }
                if (a !== void 0) {
                    if (this.hashes.has(s)) {
                        return a;
                    } else {
                        if (await this.needToRevalidate(t, a)) {
                            this.idle.schedule(`revalidate(${e.name}): ${t.url}`, (async () => {
                                await this.fetchAndCacheOnce(t);
                            }));
                        }
                        return a;
                    }
                }
                const i = await this.fetchAndCacheOnce(this.newRequestWithMetadata(t.url, t));
                return i.clone();
            } else {
                return null;
            }
        }
        async needToRevalidate(t, e) {
            if (e.headers.has("Cache-Control")) {
                const s = e.headers.get("Cache-Control");
                const a = s.split(",").map((t => t.trim())).map((t => t.split("=")));
                a.forEach((t => t[0] = t[0].toLowerCase()));
                const i = a.find((t => t[0] === "max-age"));
                const n = i ? i[1] : void 0;
                if (!n) {
                    return true;
                }
                try {
                    const s = 1e3 * parseInt(n);
                    let a;
                    try {
                        const e = await this.metadata;
                        a = (await e.read(t.url)).ts;
                    } catch (t) {
                        const s = e.headers.get("Date");
                        if (s === null) {
                            return true;
                        }
                        a = Date.parse(s);
                    }
                    const i = this.adapter.time - a;
                    return i < 0 || i > s;
                } catch (t) {
                    return true;
                }
            } else if (e.headers.has("Expires")) {
                const t = e.headers.get("Expires");
                try {
                    return this.adapter.time > Date.parse(t);
                } catch (t) {
                    return true;
                }
            } else {
                return true;
            }
        }
        async fetchFromCacheOnly(t) {
            const e = await this.cache;
            const s = await this.metadata;
            const a = this.adapter.newRequest(t);
            const i = await e.match(a, this.config.cacheQueryOptions);
            if (i === void 0) {
                return null;
            }
            let n = void 0;
            try {
                n = await s.read(a.url);
            } catch (t) {}
            return {
                response: i,
                metadata: n
            };
        }
        async unhashedResources() {
            const t = await this.cache;
            return (await t.keys()).map((t => this.adapter.normalizeUrl(t.url))).filter((t => !this.hashes.has(t)));
        }
        async fetchAndCacheOnce(t, e = true) {
            if (this.inFlightRequests.has(t.url)) {
                return this.inFlightRequests.get(t.url);
            }
            const s = this.fetchFromNetwork(t);
            this.inFlightRequests.set(t.url, s);
            try {
                const a = await s;
                if (!a.ok) {
                    throw new Error(`Response not Ok (fetchAndCacheOnce): request for ${t.url} returned response ${a.status} ${a.statusText}`);
                }
                try {
                    const s = await this.cache;
                    await s.put(t, a.clone());
                    if (!this.hashes.has(this.adapter.normalizeUrl(t.url))) {
                        const s = {
                            ts: this.adapter.time,
                            used: e
                        };
                        const a = await this.metadata;
                        await a.write(t.url, s);
                    }
                    return a;
                } catch (e) {
                    throw new w(`Failed to update the caches for request to '${t.url}' (fetchAndCacheOnce): ${g(e)}`);
                }
            } finally {
                this.inFlightRequests.delete(t.url);
            }
        }
        async fetchFromNetwork(t, e = 3) {
            const s = await this.cacheBustedFetchFromNetwork(t);
            if (s["redirected"] && !!s.url) {
                if (e === 0) {
                    throw new w(`Response hit redirect limit (fetchFromNetwork): request redirected too many times, next is ${s.url}`);
                }
                return this.fetchFromNetwork(this.newRequestWithMetadata(s.url, t), e - 1);
            }
            return s;
        }
        async cacheBustedFetchFromNetwork(t) {
            const e = this.adapter.normalizeUrl(t.url);
            if (this.hashes.has(e)) {
                const s = this.hashes.get(e);
                let a = await this.safeFetch(t);
                let i = a.ok;
                if (i) {
                    const t = v(await a.clone().arrayBuffer());
                    i = t !== s;
                }
                if (i) {
                    const e = this.newRequestWithMetadata(this.cacheBust(t.url), t);
                    a = await this.safeFetch(e);
                    if (a.ok) {
                        const e = v(await a.clone().arrayBuffer());
                        if (s !== e) {
                            throw new w(`Hash mismatch (cacheBustedFetchFromNetwork): ${t.url}: expected ${s}, got ${e} (after cache busting)`);
                        }
                    }
                }
                if (!a.ok && a.status === 404) {
                    throw new m(`Failed to retrieve hashed resource from the server. (AssetGroup: ${this.config.name} | URL: ${e})`);
                }
                return a;
            } else {
                return this.safeFetch(t);
            }
        }
        async maybeUpdate(t, e, s) {
            const a = this.adapter.normalizeUrl(e.url);
            if (this.hashes.has(a)) {
                const i = this.hashes.get(a);
                const n = await t.lookupResourceWithHash(a, i);
                if (n !== null) {
                    await s.put(e, n);
                    return true;
                }
            }
            return false;
        }
        newRequestWithMetadata(t, e) {
            return this.adapter.newRequest(t, {
                headers: e.headers
            });
        }
        cacheBust(t) {
            return t + (t.indexOf("?") === -1 ? "?" : "&") + "ngsw-cache-bust=" + Math.random();
        }
        async safeFetch(t) {
            try {
                return await this.scope.fetch(t);
            } catch (t) {
                return this.adapter.newResponse("", {
                    status: 504,
                    statusText: "Gateway Timeout"
                });
            }
        }
    };
    var D = class extends M {
        async initializeFully(t) {
            const e = await this.cache;
            await this.urls.reduce((async (s, a) => {
                await s;
                const i = this.adapter.newRequest(a);
                let n = false;
                try {
                    n = await e.match(i, this.config.cacheQueryOptions) !== void 0;
                } catch (t) {
                    throw new w(`Cache is throwing while looking for a match in a PrefetchAssetGroup: ${t}`);
                }
                if (n) {
                    return;
                }
                if (t !== void 0 && await this.maybeUpdate(t, i, e)) {
                    return;
                }
                await this.fetchAndCacheOnce(i, false);
            }), Promise.resolve());
            if (t !== void 0) {
                const s = await this.metadata;
                await (await t.previouslyCachedResources()).filter((t => this.urls.indexOf(t) !== -1 || this.patterns.some((e => e.test(t))))).reduce((async (a, i) => {
                    await a;
                    const n = this.adapter.newRequest(i);
                    const r = await e.match(n, this.config.cacheQueryOptions) !== void 0;
                    if (r) {
                        return;
                    }
                    const o = await t.lookupResourceWithoutHash(i);
                    if (o === null || o.metadata === void 0) {
                        return;
                    }
                    await e.put(n, o.response);
                    await s.write(n.url, c(h({}, o.metadata), {
                        used: false
                    }));
                }), Promise.resolve());
            }
        }
    };
    var L = class extends M {
        async initializeFully(t) {
            if (t === void 0) {
                return;
            }
            const e = await this.cache;
            await this.urls.reduce((async (s, a) => {
                await s;
                const i = this.adapter.newRequest(a);
                let n = false;
                try {
                    n = await e.match(i, this.config.cacheQueryOptions) !== void 0;
                } catch (t) {
                    throw new w(`Cache is throwing while looking for a match in a LazyAssetGroup: ${t}`);
                }
                if (n) {
                    return;
                }
                const r = await this.maybeUpdate(t, i, e);
                if (this.config.updateMode === "prefetch" && !r) {
                    const e = await t.recentCacheStatus(a);
                    if (e !== f.CACHED) {
                        return;
                    }
                    await this.fetchAndCacheOnce(i, false);
                }
            }), Promise.resolve());
        }
    };
    var x = class {
        constructor(t) {
            if (t === void 0) {
                t = {
                    head: null,
                    tail: null,
                    map: {},
                    count: 0
                };
            }
            this.state = t;
        }
        get size() {
            return this.state.count;
        }
        pop() {
            if (this.state.tail === null) {
                return null;
            }
            const t = this.state.tail;
            this.remove(t);
            return t;
        }
        remove(t) {
            const e = this.state.map[t];
            if (e === void 0) {
                return false;
            }
            if (this.state.head === t) {
                if (e.next === null) {
                    this.state.head = null;
                    this.state.tail = null;
                    this.state.map = {};
                    this.state.count = 0;
                    return true;
                }
                const s = this.state.map[e.next];
                s.previous = null;
                this.state.head = s.url;
                e.next = null;
                delete this.state.map[t];
                this.state.count--;
                return true;
            }
            const s = this.state.map[e.previous];
            s.next = e.next;
            if (e.next !== null) {
                this.state.map[e.next].previous = e.previous;
            } else {
                this.state.tail = e.previous;
            }
            e.next = null;
            e.previous = null;
            delete this.state.map[t];
            this.state.count--;
            return true;
        }
        accessed(t) {
            if (this.state.head === t) {
                return;
            }
            const e = this.state.map[t] || {
                url: t,
                next: null,
                previous: null
            };
            if (this.state.map[t] !== void 0) {
                this.remove(t);
            }
            if (this.state.head !== null) {
                this.state.map[this.state.head].previous = t;
            }
            e.next = this.state.head;
            this.state.head = t;
            if (this.state.tail === null) {
                this.state.tail = t;
            }
            this.state.map[t] = e;
            this.state.count++;
        }
    };
    var I = class {
        constructor(t, e, s, a, i, n) {
            this.scope = t;
            this.adapter = e;
            this.config = s;
            this.db = a;
            this.debugHandler = i;
            this._lru = null;
            this.patterns = s.patterns.map((t => new RegExp(t)));
            this.cache = e.caches.open(`${n}:${s.name}:cache`);
            this.lruTable = this.db.open(`${n}:${s.name}:lru`, s.cacheQueryOptions);
            this.ageTable = this.db.open(`${n}:${s.name}:age`, s.cacheQueryOptions);
        }
        async lru() {
            if (this._lru === null) {
                const t = await this.lruTable;
                try {
                    this._lru = new x(await t.read("lru"));
                } catch (t) {
                    this._lru = new x;
                }
            }
            return this._lru;
        }
        async syncLru() {
            if (this._lru === null) {
                return;
            }
            const t = await this.lruTable;
            try {
                return t.write("lru", this._lru.state);
            } catch (t) {
                this.debugHandler.log(t, `DataGroup(${this.config.name}@${this.config.version}).syncLru()`);
            }
        }
        async handleFetch(t, e) {
            if (!this.patterns.some((e => e.test(t.url)))) {
                return null;
            }
            const s = await this.lru();
            switch (t.method) {
              case "OPTIONS":
                return null;

              case "GET":
              case "HEAD":
                switch (this.config.strategy) {
                  case "freshness":
                    return this.handleFetchWithFreshness(t, e, s);

                  case "performance":
                    return this.handleFetchWithPerformance(t, e, s);

                  default:
                    throw new Error(`Unknown strategy: ${this.config.strategy}`);
                }

              default:
                const a = s.remove(t.url);
                if (a) {
                    await this.clearCacheForUrl(t.url);
                }
                await this.syncLru();
                return this.safeFetch(t);
            }
        }
        async handleFetchWithPerformance(t, e, s) {
            var a;
            const i = (a = this.config.cacheOpaqueResponses) != null ? a : false;
            let n = null;
            const r = await this.loadFromCache(t, s);
            if (r !== null) {
                n = r.res;
                if (this.config.refreshAheadMs !== void 0 && r.age >= this.config.refreshAheadMs) {
                    e.waitUntil(this.safeCacheResponse(t, this.safeFetch(t), s, i));
                }
            }
            if (n !== null) {
                return n;
            }
            const [h, c] = this.networkFetchWithTimeout(t);
            n = await h;
            if (n === void 0) {
                n = this.adapter.newResponse(null, {
                    status: 504,
                    statusText: "Gateway Timeout"
                });
                e.waitUntil(this.safeCacheResponse(t, c, s, i));
            } else {
                await this.safeCacheResponse(t, n, s, i);
            }
            return n;
        }
        async handleFetchWithFreshness(t, e, s) {
            var a;
            const i = (a = this.config.cacheOpaqueResponses) != null ? a : true;
            const [n, r] = this.networkFetchWithTimeout(t);
            let h;
            try {
                h = await n;
            } catch (t) {
                h = void 0;
            }
            if (h === void 0) {
                e.waitUntil(this.safeCacheResponse(t, r, s, i));
                const a = await this.loadFromCache(t, s);
                h = a !== null ? a.res : null;
            } else {
                await this.safeCacheResponse(t, h, s, i);
            }
            if (h !== null) {
                return h;
            }
            return r;
        }
        networkFetchWithTimeout(t) {
            if (this.config.timeoutMs !== void 0) {
                const e = this.scope.fetch(t);
                const s = (async () => {
                    try {
                        return await e;
                    } catch (t) {
                        return this.adapter.newResponse(null, {
                            status: 504,
                            statusText: "Gateway Timeout"
                        });
                    }
                })();
                const a = (async () => {
                    try {
                        return await e;
                    } catch (t) {
                        return void 0;
                    }
                })();
                const i = this.adapter.timeout(this.config.timeoutMs);
                return [ Promise.race([ a, i ]), s ];
            } else {
                const e = this.safeFetch(t);
                return [ e, e ];
            }
        }
        async safeCacheResponse(t, e, s, a) {
            try {
                const i = await e;
                try {
                    await this.cacheResponse(t, i, s, a);
                } catch (e) {
                    this.debugHandler.log(e, `DataGroup(${this.config.name}@${this.config.version}).safeCacheResponse(${t.url}, status: ${i.status})`);
                }
            } catch (t) {}
        }
        async loadFromCache(t, e) {
            const s = await this.cache;
            let a = await s.match(t, this.config.cacheQueryOptions);
            if (a !== void 0) {
                try {
                    const s = await this.ageTable;
                    const i = this.adapter.time - (await s.read(t.url)).age;
                    if (i <= this.config.maxAge) {
                        e.accessed(t.url);
                        return {
                            res: a,
                            age: i
                        };
                    }
                } catch (t) {}
                e.remove(t.url);
                await this.clearCacheForUrl(t.url);
                await this.syncLru();
            }
            return null;
        }
        async cacheResponse(t, e, s, a = false) {
            if (!(e.ok || a && e.type === "opaque")) {
                return;
            }
            if (s.size >= this.config.maxSize) {
                const t = s.pop();
                if (t !== null) {
                    await this.clearCacheForUrl(t);
                }
            }
            s.accessed(t.url);
            await (await this.cache).put(t, e.clone());
            const i = await this.ageTable;
            await i.write(t.url, {
                age: this.adapter.time
            });
            await this.syncLru();
        }
        async cleanup() {
            await Promise.all([ this.cache.then((t => this.adapter.caches.delete(t.name))), this.ageTable.then((t => this.db.delete(t.name))), this.lruTable.then((t => this.db.delete(t.name))) ]);
        }
        async getCacheNames() {
            const [t, e, s] = await Promise.all([ this.cache, this.ageTable, this.lruTable ]);
            return [ t.name, e.cacheName, s.cacheName ];
        }
        async clearCacheForUrl(t) {
            const [e, s] = await Promise.all([ this.cache, this.ageTable ]);
            await Promise.all([ e.delete(this.adapter.newRequest(t, {
                method: "GET"
            }), this.config.cacheQueryOptions), e.delete(this.adapter.newRequest(t, {
                method: "HEAD"
            }), this.config.cacheQueryOptions), s.delete(t) ]);
        }
        async safeFetch(t) {
            try {
                return this.scope.fetch(t);
            } catch (t) {
                return this.adapter.newResponse(null, {
                    status: 504,
                    statusText: "Gateway Timeout"
                });
            }
        }
    };
    var P = [ {
        positive: true,
        regex: "^/.*$"
    }, {
        positive: false,
        regex: "^/.*\\.[^/]*$"
    }, {
        positive: false,
        regex: "^/.*__"
    } ];
    var S = class {
        get okay() {
            return this._okay;
        }
        constructor(t, e, s, a, i, n, r) {
            this.scope = t;
            this.adapter = e;
            this.database = s;
            this.debugHandler = i;
            this.manifest = n;
            this.manifestHash = r;
            this.hashTable = new Map;
            this._okay = true;
            this.indexUrl = this.adapter.normalizeUrl(this.manifest.index);
            Object.keys(n.hashTable).forEach((t => {
                this.hashTable.set(e.normalizeUrl(t), n.hashTable[t]);
            }));
            const h = `${r}:assets`;
            this.assetGroups = (n.assetGroups || []).map((i => {
                switch (i.installMode) {
                  case "prefetch":
                    return new D(t, e, a, i, this.hashTable, s, h);

                  case "lazy":
                    return new L(t, e, a, i, this.hashTable, s, h);
                }
            }));
            this.dataGroups = (n.dataGroups || []).map((a => new I(t, e, a, s, i, `${a.version}:data`)));
            n.navigationUrls = n.navigationUrls || P;
            const c = n.navigationUrls.filter((t => t.positive));
            const o = n.navigationUrls.filter((t => !t.positive));
            this.navigationUrls = {
                include: c.map((t => new RegExp(t.regex))),
                exclude: o.map((t => new RegExp(t.regex)))
            };
        }
        async initializeFully(t) {
            try {
                await this.assetGroups.reduce((async (e, s) => {
                    await e;
                    return s.initializeFully(t);
                }), Promise.resolve());
            } catch (t) {
                this._okay = false;
                throw t;
            }
        }
        async handleFetch(t, e) {
            const s = await this.assetGroups.reduce((async (s, a) => {
                const i = await s;
                if (i !== null) {
                    return i;
                }
                return a.handleFetch(t, e);
            }), Promise.resolve(null));
            if (s !== null) {
                return s;
            }
            const a = await this.dataGroups.reduce((async (s, a) => {
                const i = await s;
                if (i !== null) {
                    return i;
                }
                return a.handleFetch(t, e);
            }), Promise.resolve(null));
            if (a !== null) {
                return a;
            }
            if (this.adapter.normalizeUrl(t.url) !== this.indexUrl && this.isNavigationRequest(t)) {
                if (this.manifest.navigationRequestStrategy === "freshness") {
                    try {
                        return await this.scope.fetch(t);
                    } catch (t) {}
                }
                return this.handleFetch(this.adapter.newRequest(this.indexUrl), e);
            }
            return null;
        }
        isNavigationRequest(t) {
            if (t.method !== "GET" || t.mode !== "navigate") {
                return false;
            }
            if (!this.acceptsTextHtml(t)) {
                return false;
            }
            const e = this.scope.registration.scope.replace(/\/$/, "");
            const s = t.url.startsWith(e) ? t.url.slice(e.length) : t.url;
            const a = s.replace(/[?#].*$/, "");
            return this.navigationUrls.include.some((t => t.test(a))) && !this.navigationUrls.exclude.some((t => t.test(a)));
        }
        async lookupResourceWithHash(t, e) {
            if (!this.hashTable.has(t)) {
                return null;
            }
            if (this.hashTable.get(t) !== e) {
                return null;
            }
            const s = await this.lookupResourceWithoutHash(t);
            return s && s.response;
        }
        lookupResourceWithoutHash(t) {
            return this.assetGroups.reduce((async (e, s) => {
                const a = await e;
                if (a !== null) {
                    return a;
                }
                return s.fetchFromCacheOnly(t);
            }), Promise.resolve(null));
        }
        previouslyCachedResources() {
            return this.assetGroups.reduce((async (t, e) => (await t).concat(await e.unhashedResources())), Promise.resolve([]));
        }
        async recentCacheStatus(t) {
            return this.assetGroups.reduce((async (e, s) => {
                const a = await e;
                if (a === f.CACHED) {
                    return a;
                }
                const i = await s.cacheStatus(t);
                if (i === f.NOT_CACHED) {
                    return a;
                }
                return i;
            }), Promise.resolve(f.NOT_CACHED));
        }
        async getCacheNames() {
            const t = await Promise.all([ ...this.assetGroups.map((t => t.getCacheNames())), ...this.dataGroups.map((t => t.getCacheNames())) ]);
            return [].concat(...t);
        }
        get appData() {
            return this.manifest.appData || null;
        }
        acceptsTextHtml(t) {
            const e = t.headers.get("Accept");
            if (e === null) {
                return false;
            }
            const s = e.split(",");
            return s.some((t => t.trim().toLowerCase() === "text/html"));
        }
    };
    var q = "18.2.10";
    var V = 100;
    var _ = class {
        constructor(t, e) {
            this.driver = t;
            this.adapter = e;
            this.debugLogA = [];
            this.debugLogB = [];
        }
        async handleFetch(t) {
            const [e, s, a] = await Promise.all([ this.driver.debugState(), this.driver.debugVersions(), this.driver.debugIdleState() ]);
            const i = `NGSW Debug Info:\n\nDriver version: ${q}\nDriver state: ${e.state} (${e.why})\nLatest manifest hash: ${e.latestHash || "none"}\nLast update check: ${this.since(e.lastUpdateCheck)}`;
            const n = s.map((t => `=== Version ${t.hash} ===\n\nClients: ${t.clients.join(", ")}`)).join("\n\n");
            const r = `=== Idle Task Queue ===\nLast update tick: ${this.since(a.lastTrigger)}\nLast update run: ${this.since(a.lastRun)}\nTask queue:\n${a.queue.map((t => " * " + t)).join("\n")}\n\nDebug log:\n${this.formatDebugLog(this.debugLogB)}\n${this.formatDebugLog(this.debugLogA)}\n`;
            return this.adapter.newResponse(`${i}\n\n${n}\n\n${r}`, {
                headers: this.adapter.newHeaders({
                    "Content-Type": "text/plain"
                })
            });
        }
        since(t) {
            if (t === null) {
                return "never";
            }
            let e = this.adapter.time - t;
            const s = Math.floor(e / 864e5);
            e = e % 864e5;
            const a = Math.floor(e / 36e5);
            e = e % 36e5;
            const i = Math.floor(e / 6e4);
            e = e % 6e4;
            const n = Math.floor(e / 1e3);
            const r = e % 1e3;
            return (s > 0 ? `${s}d` : "") + (a > 0 ? `${a}h` : "") + (i > 0 ? `${i}m` : "") + (n > 0 ? `${n}s` : "") + (r > 0 ? `${r}u` : "");
        }
        log(t, e = "") {
            if (this.debugLogA.length === V) {
                this.debugLogB = this.debugLogA;
                this.debugLogA = [];
            }
            if (typeof t !== "string") {
                t = this.errorToString(t);
            }
            this.debugLogA.push({
                value: t,
                time: this.adapter.time,
                context: e
            });
        }
        errorToString(t) {
            return `${t.name}(${t.message}, ${t.stack})`;
        }
        formatDebugLog(t) {
            return t.map((t => `[${this.since(t.time)}] ${t.value} ${t.context}`)).join("\n");
        }
    };
    var z = class {
        constructor(t, e, s, a) {
            this.adapter = t;
            this.delay = e;
            this.maxDelay = s;
            this.debug = a;
            this.queue = [];
            this.scheduled = null;
            this.empty = Promise.resolve();
            this.emptyResolve = null;
            this.lastTrigger = null;
            this.lastRun = null;
            this.oldestScheduledAt = null;
        }
        async trigger() {
            var t;
            this.lastTrigger = this.adapter.time;
            if (this.queue.length === 0) {
                return;
            }
            if (this.scheduled !== null) {
                this.scheduled.cancel = true;
            }
            const e = {
                cancel: false
            };
            this.scheduled = e;
            const s = this.adapter.time;
            const a = Math.max(0, ((t = this.oldestScheduledAt) != null ? t : s) + this.maxDelay - s);
            const i = Math.min(a, this.delay);
            await this.adapter.timeout(i);
            if (e.cancel) {
                return;
            }
            this.scheduled = null;
            await this.execute();
        }
        async execute() {
            this.lastRun = this.adapter.time;
            while (this.queue.length > 0) {
                const t = this.queue;
                this.queue = [];
                await t.reduce((async (t, e) => {
                    await t;
                    try {
                        await e.run();
                    } catch (t) {
                        this.debug.log(t, `while running idle task ${e.desc}`);
                    }
                }), Promise.resolve());
            }
            if (this.emptyResolve !== null) {
                this.emptyResolve();
                this.emptyResolve = null;
            }
            this.empty = Promise.resolve();
            this.oldestScheduledAt = null;
        }
        schedule(t, e) {
            this.queue.push({
                desc: t,
                run: e
            });
            if (this.emptyResolve === null) {
                this.empty = new Promise((t => {
                    this.emptyResolve = t;
                }));
            }
            if (this.oldestScheduledAt === null) {
                this.oldestScheduledAt = this.adapter.time;
            }
        }
        get size() {
            return this.queue.length;
        }
        get taskDescriptions() {
            return this.queue.map((t => t.desc));
        }
    };
    function W(t) {
        return y(JSON.stringify(t));
    }
    function G(t) {
        return t.action === "CHECK_FOR_UPDATES";
    }
    function B(t) {
        return t.action === "ACTIVATE_UPDATE";
    }
    var j = 5e3;
    var Q = 3e4;
    var Y = 1;
    var X = [ "actions", "badge", "body", "data", "dir", "icon", "image", "lang", "renotify", "requireInteraction", "silent", "tag", "timestamp", "title", "vibrate" ];
    var J;
    (function(t) {
        t[t["NORMAL"] = 0] = "NORMAL";
        t[t["EXISTING_CLIENTS_ONLY"] = 1] = "EXISTING_CLIENTS_ONLY";
        t[t["SAFE_MODE"] = 2] = "SAFE_MODE";
    })(J || (J = {}));
    var K = class {
        constructor(t, e, s) {
            this.scope = t;
            this.adapter = e;
            this.db = s;
            this.state = J.NORMAL;
            this.stateMessage = "(nominal)";
            this.initialized = null;
            this.clientVersionMap = new Map;
            this.versions = new Map;
            this.latestHash = null;
            this.lastUpdateCheck = null;
            this.scheduledNavUpdateCheck = false;
            this.loggedInvalidOnlyIfCachedRequest = false;
            this.controlTable = this.db.open("control");
            this.ngswStatePath = this.adapter.parseUrl("ngsw/state", this.scope.registration.scope).path;
            this.scope.addEventListener("install", (t => {
                t.waitUntil(this.scope.skipWaiting());
            }));
            this.scope.addEventListener("activate", (t => {
                t.waitUntil((async () => {
                    await this.scope.clients.claim();
                    this.idle.schedule("activate: cleanup-old-sw-caches", (async () => {
                        try {
                            await this.cleanupOldSwCaches();
                        } catch (t) {
                            this.debugger.log(t, "cleanupOldSwCaches @ activate: cleanup-old-sw-caches");
                        }
                    }));
                })());
                if (this.scope.registration.active !== null) {
                    this.scope.registration.active.postMessage({
                        action: "INITIALIZE"
                    });
                }
            }));
            this.scope.addEventListener("fetch", (t => this.onFetch(t)));
            this.scope.addEventListener("message", (t => this.onMessage(t)));
            this.scope.addEventListener("push", (t => this.onPush(t)));
            this.scope.addEventListener("notificationclick", (t => this.onClick(t)));
            this.debugger = new _(this, this.adapter);
            this.idle = new z(this.adapter, j, Q, this.debugger);
        }
        onFetch(t) {
            if (t.request.url.indexOf("google") > -1) {
                return;
            }
            const e = t.request;
            const s = this.scope.registration.scope;
            const a = this.adapter.parseUrl(e.url, s);
            if (e.headers.has("ngsw-bypass") || /[?&]ngsw-bypass(?:[=&]|$)/i.test(a.search)) {
                return;
            }
            if (a.path === this.ngswStatePath) {
                t.respondWith(this.debugger.handleFetch(e));
                return;
            }
            if (this.state === J.SAFE_MODE) {
                t.waitUntil(this.idle.trigger());
                return;
            }
            if (a.origin.startsWith("http:") && s.startsWith("https:")) {
                this.debugger.log(`Ignoring passive mixed content request: Driver.fetch(${e.url})`);
                return;
            }
            if (e.cache === "only-if-cached" && e.mode !== "same-origin") {
                if (!this.loggedInvalidOnlyIfCachedRequest) {
                    this.loggedInvalidOnlyIfCachedRequest = true;
                    this.debugger.log(`Ignoring invalid request: 'only-if-cached' can be set only with 'same-origin' mode`, `Driver.fetch(${e.url}, cache: ${e.cache}, mode: ${e.mode})`);
                }
                return;
            }
            t.respondWith(this.handleFetch(t));
        }
        onMessage(t) {
            if (this.state === J.SAFE_MODE) {
                return;
            }
            const e = t.data;
            if (!e || !e.action) {
                return;
            }
            t.waitUntil((async () => {
                if (e.action === "INITIALIZE") {
                    return this.ensureInitialized(t);
                }
                if (!this.adapter.isClient(t.source)) {
                    return;
                }
                await this.ensureInitialized(t);
                await this.handleMessage(e, t.source);
            })());
        }
        onPush(t) {
            if (!t.data) {
                return;
            }
            t.waitUntil(this.handlePush(t.data.json()));
        }
        onClick(t) {
            t.waitUntil(this.handleClick(t.notification, t.action));
        }
        async ensureInitialized(t) {
            if (this.initialized !== null) {
                return this.initialized;
            }
            try {
                this.initialized = this.initialize();
                await this.initialized;
            } catch (t) {
                this.state = J.SAFE_MODE;
                this.stateMessage = `Initialization failed due to error: ${g(t)}`;
                throw t;
            } finally {
                t.waitUntil(this.idle.trigger());
            }
        }
        async handleMessage(t, e) {
            if (G(t)) {
                const s = this.checkForUpdate();
                await this.completeOperation(e, s, t.nonce);
            } else if (B(t)) {
                const s = this.updateClient(e);
                await this.completeOperation(e, s, t.nonce);
            }
        }
        async handlePush(t) {
            await this.broadcast({
                type: "PUSH",
                data: t
            });
            if (!t.notification || !t.notification.title) {
                return;
            }
            const e = t.notification;
            let s = {};
            X.filter((t => e.hasOwnProperty(t))).forEach((t => s[t] = e[t]));
            await this.scope.registration.showNotification(e["title"], s);
        }
        async handleClick(t, e) {
            var s, a, i;
            t.close();
            const n = {};
            X.filter((e => e in t)).forEach((e => n[e] = t[e]));
            const r = e === "" || e === void 0 ? "default" : e;
            const h = (a = (s = t == null ? void 0 : t.data) == null ? void 0 : s.onActionClick) == null ? void 0 : a[r];
            const c = new URL((i = h == null ? void 0 : h.url) != null ? i : "", this.scope.registration.scope).href;
            switch (h == null ? void 0 : h.operation) {
              case "openWindow":
                await this.scope.clients.openWindow(c);
                break;

              case "focusLastFocusedOrOpen":
                {
                    let t = await this.getLastFocusedMatchingClient(this.scope);
                    if (t) {
                        await (t == null ? void 0 : t.focus());
                    } else {
                        await this.scope.clients.openWindow(c);
                    }
                    break;
                }

              case "navigateLastFocusedOrOpen":
                {
                    let t = await this.getLastFocusedMatchingClient(this.scope);
                    if (t) {
                        t = await t.navigate(c);
                        await (t == null ? void 0 : t.focus());
                    } else {
                        await this.scope.clients.openWindow(c);
                    }
                    break;
                }

              case "sendRequest":
                {
                    await this.scope.fetch(c);
                    break;
                }

              default:
                break;
            }
            await this.broadcast({
                type: "NOTIFICATION_CLICK",
                data: {
                    action: e,
                    notification: n
                }
            });
        }
        async getLastFocusedMatchingClient(t) {
            const e = await t.clients.matchAll({
                type: "window"
            });
            return e[0];
        }
        async completeOperation(t, e, s) {
            const a = {
                type: "OPERATION_COMPLETED",
                nonce: s
            };
            try {
                t.postMessage(c(h({}, a), {
                    result: await e
                }));
            } catch (e) {
                t.postMessage(c(h({}, a), {
                    error: e.toString()
                }));
            }
        }
        async updateClient(t) {
            const e = this.clientVersionMap.get(t.id);
            if (e === this.latestHash) {
                return false;
            }
            let s = void 0;
            if (e !== void 0) {
                const t = this.versions.get(e);
                s = this.mergeHashWithAppData(t.manifest, e);
            }
            this.clientVersionMap.set(t.id, this.latestHash);
            await this.sync();
            const a = this.versions.get(this.latestHash);
            return true;
        }
        async handleFetch(t) {
            try {
                await this.ensureInitialized(t);
            } catch (e) {
                return this.safeFetch(t.request);
            }
            if (t.request.mode === "navigate" && !this.scheduledNavUpdateCheck) {
                this.scheduledNavUpdateCheck = true;
                this.idle.schedule("check-updates-on-navigation", (async () => {
                    this.scheduledNavUpdateCheck = false;
                    await this.checkForUpdate();
                }));
            }
            const e = await this.assignVersion(t);
            let s = null;
            try {
                if (e !== null) {
                    try {
                        s = await e.handleFetch(t.request, t);
                    } catch (s) {
                        if (s.isUnrecoverableState) {
                            await this.notifyClientsAboutUnrecoverableState(e, s.message);
                        }
                        if (s.isCritical) {
                            this.debugger.log(s, `Driver.handleFetch(version: ${e.manifestHash})`);
                            await this.versionFailed(e, s);
                            return this.safeFetch(t.request);
                        }
                        throw s;
                    }
                }
                if (s === null) {
                    return this.safeFetch(t.request);
                }
                return s;
            } finally {
                t.waitUntil(this.idle.trigger());
            }
        }
        async initialize() {
            const t = await this.controlTable;
            let e, s, a;
            try {
                [e, s, a] = await Promise.all([ t.read("manifests"), t.read("assignments"), t.read("latest") ]);
                if (!this.versions.has(a.latest) && !e.hasOwnProperty(a.latest)) {
                    this.debugger.log(`Missing manifest for latest version hash ${a.latest}`, "initialize: read from DB");
                    throw new Error(`Missing manifest for latest hash ${a.latest}`);
                }
                this.idle.schedule("init post-load (update)", (async () => {
                    await this.checkForUpdate();
                }));
            } catch (i) {
                const n = await this.fetchLatestManifest();
                const r = W(n);
                e = {
                    [r]: n
                };
                s = {};
                a = {
                    latest: r
                };
                await Promise.all([ t.write("manifests", e), t.write("assignments", s), t.write("latest", a) ]);
            }
            this.idle.schedule("init post-load (cleanup)", (async () => {
                await this.cleanupCaches();
            }));
            Object.keys(e).forEach((t => {
                const s = e[t];
                if (!this.versions.has(t)) {
                    this.versions.set(t, new S(this.scope, this.adapter, this.db, this.idle, this.debugger, s, t));
                }
            }));
            Object.keys(s).forEach((t => {
                const e = s[t];
                if (this.versions.has(e)) {
                    this.clientVersionMap.set(t, e);
                } else {
                    this.clientVersionMap.set(t, a.latest);
                    this.debugger.log(`Unknown version ${e} mapped for client ${t}, using latest instead`, `initialize: map assignments`);
                }
            }));
            this.latestHash = a.latest;
            if (!this.versions.has(a.latest)) {
                throw new Error(`Invariant violated (initialize): latest hash ${a.latest} has no known manifest`);
            }
            await Promise.all(Object.keys(e).map((async t => {
                try {
                    await this.scheduleInitialization(this.versions.get(t));
                } catch (e) {
                    this.debugger.log(e, `initialize: schedule init of ${t}`);
                }
            })));
        }
        lookupVersionByHash(t, e = "lookupVersionByHash") {
            if (!this.versions.has(t)) {
                throw new Error(`Invariant violated (${e}): want AppVersion for ${t} but not loaded`);
            }
            return this.versions.get(t);
        }
        async assignVersion(t) {
            const e = t.resultingClientId || t.clientId;
            if (e) {
                if (this.clientVersionMap.has(e)) {
                    const s = this.clientVersionMap.get(e);
                    let a = this.lookupVersionByHash(s, "assignVersion");
                    if (this.state === J.NORMAL && s !== this.latestHash && a.isNavigationRequest(t.request)) {
                        if (this.latestHash === null) {
                            throw new Error(`Invariant violated (assignVersion): latestHash was null`);
                        }
                        const t = await this.scope.clients.get(e);
                        if (t) {
                            await this.updateClient(t);
                        }
                        a = this.lookupVersionByHash(this.latestHash, "assignVersion");
                    }
                    return a;
                } else {
                    if (this.state !== J.NORMAL) {
                        return null;
                    }
                    if (this.latestHash === null) {
                        throw new Error(`Invariant violated (assignVersion): latestHash was null`);
                    }
                    this.clientVersionMap.set(e, this.latestHash);
                    await this.sync();
                    return this.lookupVersionByHash(this.latestHash, "assignVersion");
                }
            } else {
                if (this.state !== J.NORMAL) {
                    return null;
                }
                if (this.latestHash === null) {
                    throw new Error(`Invariant violated (assignVersion): latestHash was null`);
                }
                return this.lookupVersionByHash(this.latestHash, "assignVersion");
            }
        }
        async fetchLatestManifest(t = false) {
            const e = await this.safeFetch(this.adapter.newRequest("ngsw.json?ngsw-cache-bust=" + Math.random()));
            if (!e.ok) {
                if (e.status === 404) {
                    await this.deleteAllCaches();
                    await this.scope.registration.unregister();
                } else if ((e.status === 503 || e.status === 504) && t) {
                    return null;
                }
                throw new Error(`Manifest fetch failed! (status: ${e.status})`);
            }
            this.lastUpdateCheck = this.adapter.time;
            return e.json();
        }
        async deleteAllCaches() {
            const t = await this.adapter.caches.keys();
            await Promise.all(t.map((t => this.adapter.caches.delete(t))));
        }
        async scheduleInitialization(t) {
            const e = async () => {
                try {
                    await t.initializeFully();
                } catch (e) {
                    this.debugger.log(e, `initializeFully for ${t.manifestHash}`);
                    await this.versionFailed(t, e);
                }
            };
            if (this.scope.registration.scope.indexOf("://localhost") > -1) {
                return e();
            }
            this.idle.schedule(`initialization(${t.manifestHash})`, e);
        }
        async versionFailed(t, e) {
            const s = Array.from(this.versions.entries()).find((([e, s]) => s === t));
            if (s === void 0) {
                return;
            }
            const a = s[0];
            if (this.latestHash === a) {
                this.state = J.EXISTING_CLIENTS_ONLY;
                this.stateMessage = `Degraded due to: ${g(e)}`;
            }
        }
        async setupUpdate(t, e) {
            try {
                const s = new S(this.scope, this.adapter, this.db, this.idle, this.debugger, t, e);
                if (t.configVersion !== Y) {
                    await this.deleteAllCaches();
                    await this.scope.registration.unregister();
                    throw new Error(`Invalid config version: expected ${Y}, got ${t.configVersion}.`);
                }
                await s.initializeFully(this);
                this.versions.set(e, s);
                this.latestHash = e;
                if (this.state === J.EXISTING_CLIENTS_ONLY) {
                    this.state = J.NORMAL;
                    this.stateMessage = "(nominal)";
                }
                await this.sync();
                await this.notifyClientsAboutVersionReady(t, e);
            } catch (s) {
                await this.notifyClientsAboutVersionInstallationFailed(t, e, s);
                throw s;
            }
        }
        async checkForUpdate() {
            let t = "(unknown)";
            try {
                const e = await this.fetchLatestManifest(true);
                if (e === null) {
                    this.debugger.log("Check for update aborted. (Client or server offline.)");
                    return false;
                }
                t = W(e);
                if (this.versions.has(t)) {
                    await this.notifyClientsAboutNoNewVersionDetected(e, t);
                    return false;
                }
                await this.notifyClientsAboutVersionDetected(e, t);
                await this.setupUpdate(e, t);
                return true;
            } catch (e) {
                this.debugger.log(e, `Error occurred while updating to manifest ${t}`);
                this.state = J.EXISTING_CLIENTS_ONLY;
                this.stateMessage = `Degraded due to failed initialization: ${g(e)}`;
                return false;
            }
        }
        async sync() {
            const t = await this.controlTable;
            const e = {};
            this.versions.forEach(((t, s) => {
                e[s] = t.manifest;
            }));
            const s = {};
            this.clientVersionMap.forEach(((t, e) => {
                s[e] = t;
            }));
            const a = {
                latest: this.latestHash
            };
            await Promise.all([ t.write("manifests", e), t.write("assignments", s), t.write("latest", a) ]);
        }
        async cleanupCaches() {
            try {
                const t = new Set((await this.scope.clients.matchAll()).map((t => t.id)));
                const e = Array.from(this.clientVersionMap.keys());
                const s = e.filter((e => !t.has(e)));
                s.forEach((t => this.clientVersionMap.delete(t)));
                const a = new Set(this.clientVersionMap.values());
                const i = Array.from(this.versions.keys()).filter((t => !a.has(t) && t !== this.latestHash));
                i.forEach((t => this.versions.delete(t)));
                await this.sync();
                const n = await this.adapter.caches.keys();
                const r = new Set(await this.getCacheNames());
                const h = n.filter((t => !r.has(t)));
                await Promise.all(h.map((t => this.adapter.caches.delete(t))));
            } catch (t) {
                this.debugger.log(t, "cleanupCaches");
            }
        }
        async cleanupOldSwCaches() {
            const t = this.adapter.caches.original;
            const e = await t.keys();
            const s = e.filter((t => /^ngsw:(?!\/)/.test(t)));
            await Promise.all(s.map((e => t.delete(e))));
        }
        lookupResourceWithHash(t, e) {
            return Array.from(this.versions.values()).reduce((async (s, a) => {
                if (await s !== null) {
                    return s;
                }
                return a.lookupResourceWithHash(t, e);
            }), Promise.resolve(null));
        }
        async lookupResourceWithoutHash(t) {
            await this.initialized;
            const e = this.versions.get(this.latestHash);
            return e ? e.lookupResourceWithoutHash(t) : null;
        }
        async previouslyCachedResources() {
            await this.initialized;
            const t = this.versions.get(this.latestHash);
            return t ? t.previouslyCachedResources() : [];
        }
        async recentCacheStatus(t) {
            const e = this.versions.get(this.latestHash);
            return e ? e.recentCacheStatus(t) : f.NOT_CACHED;
        }
        mergeHashWithAppData(t, e) {
            return {
                hash: e,
                appData: t.appData
            };
        }
        async notifyClientsAboutUnrecoverableState(t, e) {
            const s = Array.from(this.versions.entries()).find((([e, s]) => s === t));
            if (s === void 0) {
                return;
            }
            const a = s[0];
            const i = Array.from(this.clientVersionMap.entries()).filter((([t, e]) => e === a)).map((([t]) => t));
            await Promise.all(i.map((async t => {
                const s = await this.scope.clients.get(t);
                if (s) {
                    s.postMessage({
                        type: "UNRECOVERABLE_STATE",
                        reason: e
                    });
                }
            })));
        }
        async notifyClientsAboutVersionInstallationFailed(t, e, s) {
            await this.initialized;
            const a = await this.scope.clients.matchAll();
            await Promise.all(a.map((async a => {
                a.postMessage({
                    type: "VERSION_INSTALLATION_FAILED",
                    version: this.mergeHashWithAppData(t, e),
                    error: g(s)
                });
            })));
        }
        async notifyClientsAboutNoNewVersionDetected(t, e) {
            await this.initialized;
            const s = await this.scope.clients.matchAll();
            await Promise.all(s.map((async s => {
                s.postMessage({
                    type: "NO_NEW_VERSION_DETECTED",
                    version: this.mergeHashWithAppData(t, e)
                });
            })));
        }
        async notifyClientsAboutVersionDetected(t, e) {
            await this.initialized;
            const s = await this.scope.clients.matchAll();
            await Promise.all(s.map((async s => {
                const a = this.clientVersionMap.get(s.id);
                if (a === void 0) {
                    return;
                }
                s.postMessage({
                    type: "VERSION_DETECTED",
                    version: this.mergeHashWithAppData(t, e)
                });
            })));
        }
        async notifyClientsAboutVersionReady(t, e) {
            await this.initialized;
            const s = await this.scope.clients.matchAll();
            await Promise.all(s.map((async s => {
                const a = this.clientVersionMap.get(s.id);
                if (a === void 0) {
                    return;
                }
                if (a === this.latestHash) {
                    return;
                }
                const i = this.versions.get(a);
                const n = {
                    type: "VERSION_READY",
                    currentVersion: this.mergeHashWithAppData(i.manifest, a),
                    latestVersion: this.mergeHashWithAppData(t, e)
                };
                s.postMessage(n);
            })));
        }
        async broadcast(t) {
            const e = await this.scope.clients.matchAll();
            e.forEach((e => {
                e.postMessage(t);
            }));
        }
        async debugState() {
            return {
                state: J[this.state],
                why: this.stateMessage,
                latestHash: this.latestHash,
                lastUpdateCheck: this.lastUpdateCheck
            };
        }
        async debugVersions() {
            return Array.from(this.versions.keys()).map((t => {
                const e = this.versions.get(t);
                const s = Array.from(this.clientVersionMap.entries()).filter((([e, s]) => s === t)).map((([t, e]) => t));
                return {
                    hash: t,
                    manifest: e.manifest,
                    clients: s,
                    status: ""
                };
            }));
        }
        async debugIdleState() {
            return {
                queue: this.idle.taskDescriptions,
                lastTrigger: this.idle.lastTrigger,
                lastRun: this.idle.lastRun
            };
        }
        async safeFetch(t) {
            try {
                return await this.scope.fetch(t);
            } catch (e) {
                this.debugger.log(e, `Driver.fetch(${t.url})`);
                return this.adapter.newResponse(null, {
                    status: 504,
                    statusText: "Gateway Timeout"
                });
            }
        }
        async getCacheNames() {
            const t = await this.controlTable;
            const e = Array.from(this.versions.values());
            const s = await Promise.all(e.map((t => t.getCacheNames())));
            return [ t.cacheName ].concat(...s);
        }
    };
    var Z = self;
    var tt = new l(Z.registration.scope, self.caches);
    new K(Z, tt, new d(tt));
})();