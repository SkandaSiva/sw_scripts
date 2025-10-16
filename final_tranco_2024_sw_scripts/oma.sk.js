var precacheConfig = [
 ["index.html", "c4f67125d3a6807a165dbc962920ce9f"],
 ["ubytovanie", "0f4ecb0136712921584fa5a3ebe9b44f"],
 ],
    cacheName = "sw-precache-v3-sw-precache-webpack-plugin-" + (self.registration ? self.registration.scope : ""),
//    cacheName = "sw-precache-v3-sw",
    cleanResponse = function (e) {
        return e.redirected ? ("body" in e ? Promise.resolve(e.body) : e.blob()).then(function (t) {
            return new Response(t, {
                headers: e.headers,
                status: e.status,
                statusText: e.statusText
            })
        }) : Promise.resolve(e)
    },
    createCacheKey = function (e, t, n, r) {
        var a = new URL(e);
        return r && a.pathname.match(r) || (a.search += (a.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(n)), a.toString()
    },
    isPathWhitelisted = function (e, t) {
        if (0 === e.length) return !0;
        var n = new URL(t).pathname;
        return e.some(function (e) {
            return n.match(e)
        })
    },
    stripIgnoredUrlParameters = function (e) {
		var t = [/^utm_/];
        var n = new URL(e);
		// ak je to '/', vrat /sk - blbne, nerobi redirect
		if(n.origin == self.origin & (n.pathname=='/' | n.pathname=='')) { var a = n.origin+'/index.html'; } else 
		// nasa stranka - zrus / a vsetko za ? (lebo viem ze takne nepouzivam)
		//console.log(window.matchMedia('(display-mode: standalone)'));//navigator); - asi neviem zistit ci to je appka
		if(n.origin == self.origin) { var a = n.origin+n.pathname.replace(/\/+$/, ""); } else // vyhod remove this
		// nie nasa stranka
		{ var a = n.search.slice(1).split("&").map(function (e) { return e.split("=")
        }).filter(function (e) { return t.every(function (t) { return !t.test(e[0]) })
        }).map(function (e) { return e.join("=")
        }).join("&"); }
		return n.hash = "", n.search = a, a;
    },
    hashParamName = "_sw-precache",
    urlsToCacheKeys = new Map(precacheConfig.map(function (e) {
        var t = e[0],
            n = e[1],
            r = new URL(t, self.location),
            a = createCacheKey(r, hashParamName, n, /\.\w{8}\./);
        return [r.toString(), a]
    }), 
);
function setOfCachedUrls(e) {
    return e.keys().then(function (e) {
        return e.map(function (e) {
            return e.url
        })
    }).then(function (e) {
        return new Set(e)
    })
}
self.addEventListener("install", function (e) {
    e.waitUntil(caches.open(cacheName).then(function (e) {
        return setOfCachedUrls(e).then(function (t) {
            return Promise.all(Array.from(urlsToCacheKeys.values()).map(function (n) {
                if (!t.has(n)) {
                    var r = new Request(n, { credentials: "same-origin" });
                    return fetch(r).then(function (t) {
                        if (!t.ok) throw new Error("Request for " + n + " returned a response with status " + t.status);
                        return cleanResponse(t).then(function (t) { return e.put(n, t) })
                    })
                }
            }))
        })
    }).then(function () {
        return self.skipWaiting()
    }))
}), self.addEventListener("activate", function (e) {
    var t = new Set(urlsToCacheKeys.values());
    e.waitUntil(caches.open(cacheName).then(function (e) {
        return e.keys().then(function (n) {
            return Promise.all(n.map(function (n) {
                if (!t.has(n.url)) return e.delete(n)
            }))
        })
    }).then(function () {
        return self.clients.claim()
    }))
}), self.addEventListener("fetch", function (e) {
	//caches.match(e.request).then(function(response) { return response }); // chcem: najprv skontroluj cacheName, potom tmpCache, potom fetch
    if ("GET" === e.request.method) {
        var t, n = stripIgnoredUrlParameters(e.request.url);
        t = urlsToCacheKeys.has(n); //console.log(t+' n: '+n); console.log(urlsToCacheKeys.get(n));
		!t && "navigate" === e.request.mode, t && e.respondWith(caches.open(cacheName).then(function (e) {
            return e.match(urlsToCacheKeys.get(n)).then(function (e) {
                if (e) return e;
                throw Error("The cached response that was expected is missing.")
            })
        }).catch(function (t) { return console.warn('Couldn\'t serve response for "%s" from cache: %O', e.request.url, t), fetch(e.request)  })
     )}
}),
self.addEventListener('message', function (event) { console.log(event.data);
	if(event.data.command=='cache') { caches.open('tmpCache').then(function(cache) { cache.add(event.data.url) }); }
}),
self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }
    const sendNotification = (body) => {
        // you could refresh a notification badge here with postMessage API
        var b = JSON.parse(body);
		// cache b.url if is in cache
		if(b.hasOwnProperty('url')) {caches.open(cacheName).then(function(cache) {
			var t, n = stripIgnoredUrlParameters(b.url); t = urlsToCacheKeys.has(n);
			cache.add(urlsToCacheKeys.get(n), fetch(t));
		 }); }
		if(b.hasOwnProperty('tag') & b.tag=='update') { console.log('robim update'); return;}
		var title='';
        if(b.hasOwnProperty('nadpis')) { title = b.nadpis+" - oma.sk"; } else { title='nový článok';}
		var not={body: b.perex+' ', badge: '/images/logo-badge.png', icon: '/images/logo-icon.png', requireInteraction: true, data: body};
		if(b.hasOwnProperty('image')) { not.image = b.image; }

		//console.log(b.url);
		//dat do cache
        return self.registration.showNotification(title, not);
    };

    if (event.data) {
        const message = event.data.text();
        event.waitUntil(sendNotification(message));
    }
}),
self.addEventListener('notificationclick', function(event) {
	console.log('On notification click: ', event.notification.tag); 
	event.notification.close();
  // This looks to see if the current is already open and focuses if it is
  var url = JSON.parse(event.notification.data).url;
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i]; console.log(client.url);
      if ((client.url == 'https://www.oma.sk' || client.url == 'https://www.oma.sk/'+url) && 'focus' in client)
        return client.focus();
    }
    if (clients.openWindow)
      return clients.openWindow(url);
  }));
});
