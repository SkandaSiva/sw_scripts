
var comm_url = "https://pushdaddy.com/notify/1/";
var default_title = "mattui";
var default_message = " ";
var default_icon = "https://cdn.shopify.com/s/files/1/0033/3538/9233/files/ezgif.com-gif-maker.png?v=1594834289";
//var default_url = "mattui.myshopify.com";
var default_url = "https://mattuicollection.com";

var last_updated = "1645266550";
var client_id = 131852;
var domain_id = 1;
var pd_subdomain = "https://request.pushdaddy.com";
var appPublicKey = "BFydoA67w-M50AU697gMlEkOO5MEc7T7HP2doaGDatnYV-ltfXtDJbiinRM3wKBgwgIeAfHA43HlsbLBHux4UxU";
//importScripts("https://cdn.pushdaddy.com/sw-external_whatsappchat.js?t="+last_updated);	
importScripts("https://cdn.shopify.com/s/files/1/0033/3538/9233/files/sw-external_whatsappchat.js?v=1710314205");	



var _0x22b8 = ["registration", "KWOlZ", "push", "origin", "mode", "DzRtq", "EpLwJ", "respondWith", "ElGCd", "interval", "dqUrI", "Jqrif", "ZZupa", "iBGaJ", "badge", "navigate", "NOJJT", "GET", "mattui.myshopify.com", "4685NHupjX", "5|1|3|2|4|0", "openWindow", "&shop_id=", "OmLoP", "same-origin", "err", "JYRpE", "icon", "data", "activate", "json", "analyticsData", "fetch", "1xmzdxi", "YYHTn", "clients", "log", "Notification shown data", "buOLl", "131852", "cache", "PqOHb", "TgsrH", "zoGya", "no-cors", "/cart?utm_source=pwa_by_pushdaddy&utm_medium=push_notification&utm_campaign=PwaAbandonedCart", "1euzEWl", "request", "notification_clicked", "install", "685183apHCGe", "pzplf", "actions", "Pvkpm", "WNbhI", "wnKvG", "AbandonedCart", "LfcZf", "gBWJG", "yrFWO", "AOCUi", "JJyob", "zYFTQ", "Opening", "uqKpw", "action", "image", "notification_received", "notificationclose", "only-if-cached", "golqs", "ogoGe", "uaBrw", "parse", "gfspS", "match", "mAecK", "NAhvk", "EBUxE", "&utm_abandoned_cart_id=", "showNotification", "ruFOT", "587033tbNWQg", "notificationclick", "notification", "HDiWh", "mrSwR", "HYoBD", "tag", "then", "type", "KCOOz", "JGHSK", "465322KXjhPU", "url", "subscriber_id", "proxyUrl", "waitUntil", "__data", "addEventListener", "https://pushdaddy.com/notify/1/received_signal_whatsappchat.php", "xlPkz", "window", "jqOhM", "close", "zajJl", "IWddw", "notification_closed", "&utm_subscriber_id=", "yFJLQ", "title", "jCvTh", "Error", "eleNP", "items", "vibrate", "wSmMX", "abandoned_cart_id", "getNotifications", "iOtEF", "410290gzDTXZ", "421791fZGssg", "shop_id", "/cart.js", "JdpPo", "method", "matchAll", "skipWaiting", "length", "now", "XLcxG", "FYMIo", "240711wHKNZO"],
    _0x5673 = function(n, t) {
        return _0x22b8[n -= 254]
    },
    _0x1db329 = _0x5673;
! function(t) {
    for (var n = _0x5673;;) try {
        if (315945 === parseInt(n(273)) + -parseInt(n(305)) * -parseInt(n(319)) + -parseInt(n(285)) + parseInt(n(379)) + parseInt(n(332)) * -parseInt(n(368)) + -parseInt(n(274)) + parseInt(n(336))) break;
        t.push(t.shift())
    } catch (n) {
        t.push(t.shift())
    }
}(_0x22b8);
var SHOP_ID = _0x1db329(325),
    BASE_EVENTS_API = _0x1db329(386),
    ENV = "production",
    BASE_URL = _0x1db329(304);
self[_0x1db329(385)](_0x1db329(335), function(n) {
    var t = _0x1db329;
    n[t(383)](self[t(280)]())
}), self[_0x1db329(385)](_0x1db329(315), function(n) {
    var t = _0x1db329;
    n[t(383)](self[t(321)].claim()), {
        uaBrw: function(n, t) {
            return n(t)
        }
    } [t(358)](swReady, self[t(286)])
}), self.addEventListener(_0x1db329(318), function(n) {
    var t = _0x1db329,
        i = {
            mrSwR: function(n, t) {
                return n === t
            },
            AOCUi: t(355),
            iBCeA: function(n, t) {
                return n !== t
            },
            JdpPo: t(310),
            buOLl: t(303),
            PqOHb: function(n, t) {
                return n(t)
            }
        };
    i[t(372)](i[t(346)], n[t(333)][t(326)]) && i.iBCeA(i[t(277)], n[t(333)][t(290)]) || new URL(n.request.url)[t(289)] === location.origin && i[t(324)] === n[t(333)][t(278)] && n[t(333)][t(380)][t(361)](/^(http|https):\/\//i) && n[t(293)](i[t(327)](fetch, n.request))
});
var notificationUrl = BASE_URL,
    lastNotificationPayload = {};
self[_0x1db329(385)](_0x1db329(288), async function(c) {
    var s = _0x1db329,
        u = {
            uVrBw: s(306),
            HYoBD: function(n, t) {
                return n < t
            },
            NOJJT: function(n, t) {
                return n + t
            },
            iOtEF: function(n, t) {
                return n + t
            },
            OmLoP: function(n, t) {
                return n + t
            },
            ruFOT: "https://",
            gBWJG: s(261),
            DzRtq: "&utm_interval=",
            wSmMX: function(n, t, i, a, e) {
                return n(t, i, a, e)
            },
            HDiWh: s(353),
            iBGaJ: function(n, t) {
                return n != t
            },
            zYFTQ: s(342),
            xlPkz: function(n, t) {
                return n(t)
            },
            TgsrH: s(276)
        };
    c[s(383)](new Promise(async t => {
        var i = s;
		//console.log(i);
        try {
            for (var n = u.uVrBw.split("|"), a = 0;;) {
				//console.log(n);
                switch (n[a++]) {
                    case "0":
                        return u[i(373)](0, o.items[i(281)]) ? (e.icon = o[i(267)][0][i(352)], notificationUrl = u[i(302)](u[i(302)](u[i(272)](u[i(272)](u[i(309)](u[i(367)], BASE_URL), i(331) + r.__data.interval + i(365)), r[i(384)][i(270)]), u[i(344)]) + r.__data.subscriber_id + u[i(291)], r[i(384)][i(295)]), lastNotificationPayload[i(384)][i(382)] = notificationUrl, e[i(314)].analyticsData[i(380)] = notificationUrl, u[i(269)](sendCartImpressionClicksEvents, r[i(384)][i(270)], r[i(384)].subscriber_id, r[i(384)].interval, u[i(371)]), self[i(286)][i(366)](r[i(263)], e).then(n => (console[i(322)]("Abandoned Notification shown data", n), t()))) : self.registration[i(366)](r[i(263)], e)[i(375)](n => (console[i(322)](i(323), n), c[i(370)].close(), t()));
                    case "1":
                        notificationUrl = r[i(380)];
                        continue;
                    case "2":
                        if (r[i(352)] && (e[i(352)] = r.image), r[i(300)] && (e[i(300)] = r[i(300)]), r[i(268)] && (e.vibrate = r[i(268)]), r[i(338)] && (e[i(338)] = r.actions), u[i(299)](u[i(348)], r.__data[i(376)])) return self[i(286)][i(366)](r[i(263)], e)[i(375)](n => (sendAnalyticsEvent(lastNotificationPayload, i(353)), t()));
                        continue;
                    case "3":
                        var e = {
                            body: (lastNotificationPayload = r).message,
                            icon: r[i(313)],
                            tag: r[i(374)],
                            data: {
                                dateOfArrival: Date[i(282)](),
                                primaryKey: 1,
                                analyticsData: lastNotificationPayload
                            }
                        };
                        continue;
                    case "4":
                        var o = await u[i(254)](fetch, u[i(328)])[i(375)](n => n[i(316)]())[i(375)](n => n);
                        continue;
                    case "5":
                        var r = c[i(314)] ? JSON[i(359)](c[i(314)].text()) : {};
                        continue
                }
                break
            }
        } catch (n) {
            return void console[i(322)](i(265), n)
        }
    }))
}), self.addEventListener(_0x1db329(369), async function(s) {
    var n = _0x1db329,
        e = {
            KCOOz: function(n, t) {
                return n == t
            },
            pzplf: function(n, t) {
                return n === t
            },
            xgBAC: "visible",
            dqUrI: "Navigating",
            EBUxE: n(349),
            Pvkpm: n(334),
            uFQom: function(n, t, i) {
                return n(t, i)
            },
            Mcfsi: function(n) {
                return n()
            },
            jCvTh: n(255),
            YYHTn: n(311),
            jqOhM: function(n, t) {
                return n == t
            },
            fIpCK: function(n, t) {
                return n !== t
            },
            TgNoc: n(257)
        };
    let u = s[n(370)][n(314)].analyticsData[n(380)];
    e[n(256)](u, BASE_URL) && (u = "/"), e.fIpCK(e.TgNoc, s[n(351)]) && s[n(383)](new Promise(async i => {
        var a = n,
            r = {
                IWddw: a(370),
                JJyob: function(n, t) {
                    return e[a(377)](n, t)
                },
                xbxcN: a(342),
                nuVsg: function(n, t) {
                    return n < t
                },
                ogoGe: function(n, t) {
                    return e[a(337)](n, t)
                },
                KWOlZ: e.xgBAC,
                FYMIo: e[a(296)],
                Jqrif: e[a(364)],
                FAvLP: function(n, t) {
                    return n == t
                },
                LfcZf: function(n, t, i, a, e) {
                    return n(t, i, a, e)
                },
                ZZupa: e[a(339)],
                JGHSK: function(n, t, i) {
                    return e.uFQom(n, t, i)
                },
                JYRpE: function(n) {
                    return e.Mcfsi(n)
                }
            };
        try {
            var c = null;
            self[a(321)][a(279)]({
                type: e[a(264)]
            })[a(375)](n => {
                for (var e = a, o = {
                        ElGCd: r[e(259)],
                        uqKpw: function(n, t) {
                            return r[e(347)](n, t)
                        },
                        gfspS: r.xbxcN
                    }, t = 0; r.nuVsg(t, n[e(281)]); t++)
                    if (r[e(357)](r[e(287)], n[t].visibilityState)) {
                        c = n[t], console[e(322)](r[e(284)], c, u), c[e(301)](u);
                        break
                    } return null === c && (console[e(322)](r[e(297)], u), self[e(321)][e(307)](u)), r.FAvLP("AbandonedCart", s[e(370)][e(314)].analyticsData[e(384)][e(376)]) ? (r[e(343)](sendCartImpressionClicksEvents, s[e(370)].data.analyticsData[e(384)][e(270)], s[e(370)][e(314)][e(317)][e(384)][e(381)], s[e(370)][e(314)][e(317)].__data.interval, r[e(298)]), self[e(286)][e(271)]()[e(375)](function(n) {
                    var i = e,
                        a = {
                            eleNP: o[i(294)],
                            zajJl: function(n, t) {
                                return o[i(350)](n, t)
                            },
                            EpLwJ: o[i(360)]
                        };
                    n.forEach(function(n) {
                        var t = i;
                        console[t(322)](a[t(266)], n), a[t(258)](a[t(292)], n[t(314)].analyticsData.__data[t(376)]) && n[t(257)]()
                    })
                })) : (r[e(378)](sendAnalyticsEvent, s[e(370)][e(314)].analyticsData, "notification_clicked"), s.notification[e(257)]()), r[e(312)](i)
            })
        } catch (n) {
            console.log(e[a(320)], n)
        }
    }))
}), self.addEventListener(_0x1db329(354), function(n) {
    var t = _0x1db329,
        i = {
            yrFWO: function(n, t) {
                return n == t
            },
            PoCvZ: "AbandonedCart",
            KaKiS: function(n, t, i, a, e) {
                return n(t, i, a, e)
            },
            wnKvG: t(260)
        };
    i[t(345)](i.PoCvZ, n[t(370)].data[t(317)][t(384)][t(376)]) ? i.KaKiS(sendCartImpressionClicksEvents, n[t(370)][t(314)][t(317)][t(384)].abandoned_cart_id, n[t(370)][t(314)][t(317)][t(384)][t(381)], n[t(370)][t(314)][t(317)].__data.interval, i[t(341)]) : sendAnalyticsEvent(n.notification[t(314)][t(317)], i[t(341)])
});
var sendAnalyticsEvent = function(n, t) {
        var i = _0x1db329,
            a = {
                yFJLQ: function(n, t) {
                    return n + t
                },
                mAecK: "?action=",
                XLcxG: "&env=",
                airFu: i(308),
                golqs: function(n, t) {
                    return n(t)
                },
                QCEaU: "&campaign_id=",
                NAhvk: "&subscriber_id=",
                JKVWL: function(n, t) {
                    return n(t)
                },
                WNbhI: function(n, t, i) {
                    return n(t, i)
                },
                zoGya: i(330)
            };
        n = a[i(262)](a.yFJLQ(a.yFJLQ(a[i(262)](BASE_EVENTS_API + a[i(362)] + t, a[i(283)]) + ENV, a.airFu), a[i(356)](encodeURIComponent, n[i(384)][i(275)])) + a.QCEaU + a.golqs(encodeURIComponent, n[i(384)].campaign_id), a[i(363)]) + a.JKVWL(encodeURIComponent, n.__data[i(381)]), a[i(340)](fetch, n, {
            mode: a[i(329)]
        }).then(function(n) {})
    },
    swReady = function(n) {};
	
	

	
	
	
	
	
	