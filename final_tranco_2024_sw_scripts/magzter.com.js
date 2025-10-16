
const PRECACHE = 'magzter-js-css-v8.0.3';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
];


importScripts("https://d2r1yp2w7bby2u.cloudfront.net/js/localforage.min.js");

if ("undefined" === typeof globalRedirectPath) {
  var globalNotificationData, globalRedirectPath;
}



self.addEventListener("push", function (b) {
  console.log("Push event: ", b);
  var a = JSON.parse(b.data.text()),
    c = a.title,
    d = a.notificationOptions,
    f = d.data,
    e;
  "undefined" !== typeof f && (e = f.wzrk_id);
  "undefined" === typeof e && (e = c);
  localforage.setItem(e, b.data.text()).then(function (a) { })["catch"](
    function (a) {
      console.log("Error in persisting")
    });
  globalRedirectPath = a.redirectPath;
  globalNotificationData = a;
  a = a.raiseNotificationViewedPath;
  "undefined" !== typeof a && fetch(a, {
    mode: "no-cors"
  });
  b.waitUntil(self.registration.showNotification(c,
    d))
});

function onClick(b, a, c) {
  var d = !0;
  "action1" === b.action ? ("undefined" !== typeof c.notificationOptions
    .actions[0].deepLink && (a += "&r=" + encodeURIComponent(c
      .notificationOptions.actions[0].deepLink), d = !1), a += "&b=" +
      encodeURIComponent("button1")) : "action2" === b.action ? ("undefined" !==
        typeof c.notificationOptions.actions[1].deepLink && (a += "&r=" +
          encodeURIComponent(c.notificationOptions.actions[1].deepLink), d = !1),
        a += "&b=" + encodeURIComponent("button2")) : ("undefined" !== typeof c
          .deepLink && (a += "&r=" + encodeURIComponent(c.deepLink), d = !1), a +=
          "&b=" + encodeURIComponent("button0"));
  d ? fireSilentRequest(a) : clients.openWindow(a);
  b.notification.close()
}
self.addEventListener("notificationclick", function (b) {
  var a = b.notification,
    c = a.data,
    d;
  "undefined" !== typeof c && null !== c && (d = c.wzrk_id);
  "undefined" === typeof d && (d = a.title);
  a = localforage.getItem(d).then(function (a) {
    a = JSON.parse(a);
    onClick(b, a.redirectPath, a)
  })["catch"](function (a) {
    onClick(b, globalRedirectPath, globalNotificationData);
    console.log(a)
  });
  b.waitUntil(a)
});
var fireSilentRequest = function (b) {
  fetch(b + "&s=true", {
    mode: "no-cors"
  })
};


self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});