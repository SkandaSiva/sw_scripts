var appname="سی ان سی یاب";
var apphost="https://cncyab.com";
importScripts(apphost + '/module/js/pouchdb-7.1.1.min.js');
var db = new PouchDB('_ana_dcache');
var pushid="guest";
var connid="guest";
var anauid="guest";

'use strict';
(function() {
    var staticCacheName = 'static';
    var version = 'v1::';
    function readdb(){ db.get('connid', function(err, doc) {console.log(doc.xfreq);  connid=doc.xfreq;}); }
    db.get('connid', function(err, doc) {console.log(doc.xfreq);  connid=doc.xfreq;}).then(function(){
        if(typeof(EventSource) !== "undefined") {
            var notifix = new EventSource("/ajax.php?unit=anahidcms_app_push&set_id=" + pushid +"&rec_id=" + connid);
       }
       notifix.addEventListener('push', function(event) {
        var anaref = JSON.parse(event.data);
            self.registration.showNotification( appname, {
              body: anaref.msg,
              icon: anaref.icon,
              image: anaref.icon,
              tag: 'ٔخبر',
              dir: 'rtl'
            })
        });
    });
    
    readdb();
    
    function updateStaticCache() {
        return caches.open(version + staticCacheName)
            .then(function (cache) {
                return cache.addAll([
                    '/',
                    '/offline.html'
                ]);
            });
    };
    self.addEventListener('install', function (event) {    event.waitUntil(updateStaticCache());    });

    self.addEventListener('activate', function (event) {
        event.waitUntil(
            caches.keys()
                .then(function (keys) {
                    return Promise.all(keys
                        .filter(function (key) {
                          return key.indexOf(version) !== 0;
                        })
                        .map(function (key) {
                          return caches.delete(key);
                        })
                    );
                })
        );
    });

    
    self.addEventListener('notificationclick', function(event) {
        console.log('On notification click: ', event.notification.tag);
        event.notification.close();
        event.waitUntil(clients.matchAll({
          type: "window"
        }).then(function(clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == '/' && 'focus' in client)
              return client.focus();
          }
          if (clients.openWindow)
            return clients.openWindow('/');
        }));
      });
    self.addEventListener('fetch', function (event) {
        var request = event.request;
        if (request.method !== 'GET') {
            event.respondWith(
                fetch(request)
                    .catch(function () {
                        return caches.match('/offline.html');
                    })
            );
            return;
        }
        if (request.headers.get('Accept').indexOf('text/html') !== -1) {
            event.respondWith(
                fetch(request)
                    .then(function (response) {
                        var copy = response.clone();
                        caches.open(version + staticCacheName)
                            .then(function (cache) {
                                cache.put(request, copy);
                            });
                        return response;
                    })
                    .catch(function () {
                        return caches.match(request)
                            .then(function (response) {
                                return response || caches.match('/offline.html');
                            })
                    })
            );
            return;
        }
        event.respondWith(
            caches.match(request)
                .then(function (response) {
                    return response || fetch(request)
                        .catch(function () {
                            if (request.headers.get('Accept').indexOf('image') !== -1) {
                                return new Response('<svg width="400" height="300" role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', { headers: { 'Content-Type': 'image/svg+xml' }});
                            }
                        });
                })
        );
    });
})();


