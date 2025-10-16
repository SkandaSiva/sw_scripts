(() => {
    "use strict";

    function e(e, t, n, i, o, r, a) {
        try {
            var l = e[r](a),
                s = l.value
        } catch (e) {
            n(e);
            return
        }
        l.done ? t(s) : Promise.resolve(s).then(i, o)
    }

    function t(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {},
                i = Object.keys(n);
            "function" == typeof Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(n).filter(function(e) {
                return Object.getOwnPropertyDescriptor(n, e).enumerable
            }))), i.forEach(function(t) {
                var i;
                i = n[t], t in e ? Object.defineProperty(e, t, {
                    value: i,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = i
            })
        }
        return e
    }

    function n() {
        var i;
        return i = function(e, n) {
            return function(e, t) {
                var n, i, o, r, a = {
                    label: 0,
                    sent: function() {
                        if (1 & o[0]) throw o[1];
                        return o[1]
                    },
                    trys: [],
                    ops: []
                };
                return r = {
                    next: l(0),
                    throw: l(1),
                    return: l(2)
                }, "function" == typeof Symbol && (r[Symbol.iterator] = function() {
                    return this
                }), r;

                function l(r) {
                    return function(l) {
                        return function(r) {
                            if (n) throw TypeError("Generator is already executing.");
                            for (; a;) try {
                                if (n = 1, i && (o = 2 & r[0] ? i.return : r[0] ? i.throw || ((o = i.return) && o.call(i), 0) : i.next) && !(o = o.call(i, r[1])).done) return o;
                                switch (i = 0, o && (r = [2 & r[0], o.value]), r[0]) {
                                    case 0:
                                    case 1:
                                        o = r;
                                        break;
                                    case 4:
                                        return a.label++, {
                                            value: r[1],
                                            done: !1
                                        };
                                    case 5:
                                        a.label++, i = r[1], r = [0];
                                        continue;
                                    case 7:
                                        r = a.ops.pop(), a.trys.pop();
                                        continue;
                                    default:
                                        if (!(o = (o = a.trys).length > 0 && o[o.length - 1]) && (6 === r[0] || 2 === r[0])) {
                                            a = 0;
                                            continue
                                        }
                                        if (3 === r[0] && (!o || r[1] > o[0] && r[1] < o[3])) {
                                            a.label = r[1];
                                            break
                                        }
                                        if (6 === r[0] && a.label < o[1]) {
                                            a.label = o[1], o = r;
                                            break
                                        }
                                        if (o && a.label < o[2]) {
                                            a.label = o[2], a.ops.push(r);
                                            break
                                        }
                                        o[2] && a.ops.pop(), a.trys.pop();
                                        continue
                                }
                                r = t.call(e, a)
                            } catch (e) {
                                r = [6, e], i = 0
                            } finally {
                                n = o = 0
                            }
                            if (5 & r[0]) throw r[1];
                            return {
                                value: r[0] ? r[1] : void 0,
                                done: !0
                            }
                        }([r, l])
                    }
                }
            }(this, function(i) {

            })
        }, (n = function() {
            var t = this,
                n = arguments;
            return new Promise(function(o, r) {
                var a = i.apply(t, n);

                function l(t) {
                    e(a, o, r, l, s, "next", t)
                }

                function s(t) {
                    e(a, o, r, l, s, "throw", t)
                }
                l(void 0)
            })
        }).apply(this, arguments)
    }
    self._client_data = {};
    var i = e => {},
        o = (e, t) => {
            var n = void 0 === t ? {} : t;
            self.clients.matchAll().then(function(t) {
                t.forEach(t => {
                    t.postMessage({
                        type: e,
                        data: n
                    })
                })
            })
        };
    self.addEventListener("fetch", e => {}), self.addEventListener("install", e => {
        self.skipWaiting()
    }), self.addEventListener("push", e => {
        e.data.text();
        try {
            var t = JSON.parse(e.data.text());
            i(21028), e.waitUntil(self.registration.showNotification(t.title, t.options))
        } catch (e) {
            console.error(e)
        }
    }), self.addEventListener("notificationclick", function(e) {
        var t, n, o, r;
        i(21029), e.notification.close(), (null == e ? void 0 : e.action) ? e.waitUntil(self.clients.openWindow(null == e ? void 0 : e.action)) : (null == e ? void 0 : null === (n = e.notification) || void 0 === n ? void 0 : null === (t = n.data) || void 0 === t ? void 0 : t.url) && e.waitUntil(self.clients.openWindow(null == e ? void 0 : null === (r = e.notification) || void 0 === r ? void 0 : null === (o = r.data) || void 0 === o ? void 0 : o.url))
    }), self.addEventListener("pushsubscriptionchange", e => {
        var t;
        e.waitUntil(null === (t = self.registration) || void 0 === t ? void 0 : t.pushManager.subscribe(e.oldSubscription.options).then(function(e) {
            var t, i, r, a, l;
            l = JSON.parse(JSON.stringify((t = {
                    link_id: self._client_data.linkId,
                    subscription: e
                }).subscription)),
                function(e, t) {
                    n.apply(this, arguments)
                }("/push/subscribe", {
                    method: "post",
                    data: {
                        link_id: t.link_id,
                        domain: null !== (a = null === (r = window) || void 0 === r ? void 0 : null === (i = r.location) || void 0 === i ? void 0 : i.origin) && void 0 !== a ? a : "",
                        push_subscription: {
                            endpoint: l.endpoint,
                            expirationTime: l.expirationTime,
                            keys: l.keys
                        }
                    }
                }), o("SUBSCRIPTION")
        }).catch(e => {
            console.error(e), o("NOT_SUBSCRIPTION")
        }))
    }), self.addEventListener("message", e => {
        "SET_DATA" === e.data.type && (self._client_data = e.data.data)
    })
})();