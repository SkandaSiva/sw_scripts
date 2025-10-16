let pwaTools = {
    CacheNameRUNTIME: 'runtime-v1',
    CacheNameSYSVERSION: 'sysver-v1',
    CacheNamePERMA: 'perma-v1',
    OFFLINE_URL: '/Offline',
    PRECACHE_URLS: ['/Offline', '/Content/fonts/icomoon.woff?qm0qed', '/Content/fonts/icomoon.ttf?qm0qed', '/Content/fonts/Roboto-Regular.ttf', '/Content/flaticon/Flaticon.woff'/*,'index.html','./', // Alias for index.html'styles.css','../../styles/main.css','demo.js'*/],
    getCacheRule: function (event) {

        if (!event || !event.request || !event.request.url)
            return null;

        if (event.request.method == 'GET') {

            if (event.request.destination == 'font')
                return { canCache: true, typ: 1, cacheName: pwaTools.CacheNamePERMA };

            if (event.request.url.endsWith('.min.js'))
                return { canCache: true, typ: 2, cacheName: pwaTools.CacheNamePERMA };

            if (event.request.url.endsWith('-min.js'))
                return { canCache: true, typ: 3, cacheName: pwaTools.CacheNamePERMA };

            if (event.request.url.indexOf('/Scripts/WALocalCaching.js') > -1)
                return { canCache: true, typ: 4, cacheName: pwaTools.CacheNameSYSVERSION };

            if (event.request.url.indexOf('/Scripts/datepicker-') > -1)
                return { canCache: true, typ: 5, cacheName: pwaTools.CacheNamePERMA };

            if (event.request.url.indexOf('/Scripts/i18n/angular-locale_') > -1)
                return { canCache: true, typ: 6, cacheName: pwaTools.CacheNamePERMA };

            if (event.request.url.endsWith('.css'))
                return { canCache: true, typ: 7, cacheName: pwaTools.CacheNamePERMA };

            if (event.request.url.endsWith('.svg'))
                return { canCache: true, typ: 8, cacheName: pwaTools.CacheNamePERMA };

            //if (event.request.url.indexOf('/Content/maps') > -1) {
            //    return { canCache: true, typ: 9, cacheName: pwaTools.CacheNamePERMA };
            //}

            if (event.request.url.indexOf('globalCSS') > -1)
                return { canCache: true, typ: 10, cacheName: pwaTools.CacheNameSYSVERSION };
            
            //if (event.request.url.indexOf('/Content/css/_master') > -1)
            //    return { canCache: true, typ: 10, cacheName: pwaTools.CacheNameSYSVERSION };

            if (event.request.url.indexOf('/Content/css/_master_login') > -1)
                return { canCache: true, typ: 11, cacheName: pwaTools.CacheNameSYSVERSION };

            //if (event.request.url.indexOf('/Content/css/_master_no_dossier') > -1)
            //    return { canCache: true, typ: 12, cacheName: pwaTools.CacheNameSYSVERSION };

            if (event.request.url.indexOf('/JSConfig/JSConfig.js') > -1)
                return { canCache: true, typ: 13, cleanOldByParam: 'v' };

            if (event.request.url.indexOf('/Scripts/globalScript') > -1 || event.request.url.indexOf('/Scripts/deferGlobalScript') > -1)
                return { canCache: true, typ: 14, cacheName: pwaTools.CacheNameSYSVERSION };

            if (event.request.url.indexOf('/Scripts/Login/ngWA.Login.js') > -1)
                return { canCache: true, typ: 15, cacheName: pwaTools.CacheNameSYSVERSION };

            if (event.request.destination == 'image') {
                if (event.request.url.indexOf('/Dossier/') > -1 && event.request.url.indexOf('/Logo') > -1)
                    return { canCache: true, typ: 18, cleanOldByParam: 'v' };

                if (event.request.url.indexOf('/Logo/User/') > -1)
                    return { canCache: true, typ: 19, cleanOldByParam: 'v' };

                if (event.request.url.indexOf('/Logo/BrandingFromUrl') > -1)
                    return { canCache: true, typ: 16, cleanOldByParam: 'v' };

                if (event.request.url.indexOf('/Login/BrandingbyCurrentUser') > -1)
                    return { canCache: true, typ: 17, cleanOldByParam: 'v' };

                if (event.request.url.indexOf('/Logo/Bank/') > -1)
                    return { canCache: true, typ: 20, cacheName: pwaTools.CacheNamePERMA };

                if (event.request.url.indexOf('/Content/icons/') > -1)
                    return { canCache: true, typ: 21, cacheName: pwaTools.CacheNamePERMA };

                if (event.request.url.indexOf('/Content/img/') > -1)
                    return { canCache: true, typ: 22, cacheName: pwaTools.CacheNamePERMA };

                if (event.request.url.indexOf('/Content/images/') > -1)
                    return { canCache: true, typ: 23, cacheName: pwaTools.CacheNamePERMA }

                if (event.request.url.indexOf('/Content/LogoW/') > -1)
                    return { canCache: true, typ: 24, cacheName: pwaTools.CacheNamePERMA };

                if (event.request.url.indexOf('/Content/LogoBanks/') > -1)
                    return { canCache: true, typ: 25, cacheName: pwaTools.CacheNamePERMA };

                if (event.request.url.indexOf('/Content/widgetThumb/') > -1)
                    return { canCache: true, typ: 26, cacheName: pwaTools.CacheNamePERMA };

                if (event.request.url.indexOf('/Content/LogoConcurrents/') > -1)
                    return { canCache: true, typ: 28, cacheName: pwaTools.CacheNamePERMA };
            }

            if (event.request.url.indexOf('Logo/BelgiumMap') > -1) {
                return { canCache: true, typ: 27, cacheName: pwaTools.CacheNamePERMA };
            }
        }
        return null;
    },
    deferredInstallPrompt: null,
    installEvent: function (event) {
        event.waitUntil(
            caches.open(pwaTools.CacheNamePERMA)
                .then(cache => cache.addAll(pwaTools.PRECACHE_URLS))
                .then(self.skipWaiting())
        )
    },
    activateEvent: function (event) {
        if (self && self.location && self.location.search && self.location.search.length > 3) {
            var currentVersionNr = self.location.search.substr(3);
            var endFile = "_v" + currentVersionNr.replaceAll(".", "") + "_";

            //remove system cache from older version
            caches.open(pwaTools.CacheNameSYSVERSION).then(cache => {
                cache.keys().then(keys => {
                    keys.forEach(k => {
                        //console.log("serviceworker k : ",k.url);

                        if (!k.url || !k.url.endsWith(endFile) || !k.url.endsWith(currentVersionNr)) {
                            cache.delete(k);
                        }
                    });
                });
            });
        }

        //remove old cache stores
        const currentCaches = [pwaTools.CacheNamePERMA, pwaTools.CacheNameRUNTIME, pwaTools.CacheNameSYSVERSION];
        event.waitUntil(
            caches.keys().then(cacheNames => {
                return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
            }).then(cachesToDelete => {
                return Promise.all(cachesToDelete.map(cacheToDelete => {
                    return caches.delete(cacheToDelete);
                }));
            }).then(() => self.clients.claim())
        );
    },
    getParamValFromUrl: function (url, paramName) {
        if (!url)
            return '';

        var t = url.split('?');
        if (!t || t.length <= 1)
            return '';

        var paramList = t[t.length - 1].split('&');
        if (!paramList || paramList.length == 0)
            return '';

        var paramVal = '';
        paramList.forEach(p => {
            var kvp = p.split('=');
            if (kvp.length < 2)
                return;
            if (kvp[0] == paramName)
                paramVal = kvp[1];
        });
        return paramVal;

    },
    fetchEvent: function (event) {
        var url = event.request.url;
        if (!url.startsWith(self.location.origin))
            return;//same origin only

        if (event.request.mode === 'navigate' && url.indexOf('/Login/') == -1 && url.indexOf('/BackupRestore/') == -1 && url.indexOf('/PrintPDFs') == -1 && url.indexOf('/DownloadPDFs') == -1 && url.indexOf('/DownloadDocs') == -1 && url.indexOf('/DownloadUBLs') == -1 && url.indexOf('/Restore/') == -1 && url.indexOf('/DL/') == -1 && url.indexOf('/ResetKeyMap/') == -1 && url.indexOf('/ValidateEmail?') == -1 && url.indexOf('/ValidateEmail2?') == -1 && url.indexOf('/CodaGenerator/') == -1) {
            event.respondWith(fetch(url).catch(error => {
                return caches.match(pwaTools.OFFLINE_URL);
            }));
        }
        else {
            var cacheRule = pwaTools.getCacheRule(event);
            if (cacheRule && cacheRule.canCache) {

                //try too load from cache if static
                event.respondWith(
                    caches.match(event.request).then(cachedResponse => {

                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        //fetch news data and keep a copy in cache
                        var targetCacheName = (cacheRule.cacheName ? cacheRule.cacheName : pwaTools.CacheNameRUNTIME);
                        return caches.open(targetCacheName).then(cache => {


                            return fetch(event.request).then(response => {
                                return cache.put(event.request, response.clone()).then(() => {
                                    //DELETE OLD CACHE
                                    if (targetCacheName === pwaTools.CacheNameRUNTIME) {
                                        if (cacheRule.cleanOldByParam) {
                                            cache.keys(event.request, { ignoreSearch: true }).then(keys => {
                                                keys.forEach(cachedData => {
                                                    if (event.request.url !== cachedData.url) {
                                                        var param1 = pwaTools.getParamValFromUrl(event.request.url, cacheRule.cleanOldByParam);
                                                        var param2 = pwaTools.getParamValFromUrl(cachedData.url, cacheRule.cleanOldByParam);
                                                        if (param1 != param2) {
                                                            cache.delete(cachedData);
                                                        }
                                                    }
                                                });

                                            });
                                        }
                                    }
                                    //return new cache
                                    return response;
                                });
                            });
                        });
                    })
                );
            }
        }
    }
};
self.addEventListener('install', pwaTools.installEvent);// The install handler takes care of precaching the resources we always need.
self.addEventListener('activate', pwaTools.activateEvent);// The activate handler takes care of cleaning up old caches.
self.addEventListener('fetch', pwaTools.fetchEvent);//cache management
