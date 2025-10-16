'use strict';
var version = "0.1.5";
var offlinePageAjax = '<div onclick="window.location.reload()" class="ANretry c6 p12 taC bgE mt84">'+
                      '<div class="fs16">No Internet Connection Detected!</div>'+
                      '<div class="fs12 p160 pt4">It Seems that you are offline.</div>'+
                      '<div class="bs c3 fs14 p12 taC tdU">Try Again !</div>'+
                      '</div>';
var offlinePage = '<html>'+
                  '<head>'+
                  '<meta id="vp" name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>'+
                  '<style>.ANretry{font-family:sans-serif}.c6{color:#666}.p12{padding:12px}.taC{text-align:center}.fs12{font-size:12px}.fs14{font-size:14px}.fs16{font-size:16px}</style>'+
                  '</head>'+
                  '<body><div onclick="window.location.reload()" class="ANretry c6 p12 taC bgE"><div>No Internet Connection Detected!</div><div class="fs12 p160 pt4">It Seems that you are offline.</div><div class="bs c3 f14 p12 taC tdU">Try Again !</div></div></body>'+
                  '</html>';
var offlineImage = '<svg width="1px" height="1px" xmlns="http://www.w3.org/2000/svg">'+
                   '<image xlink:href="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" x="0" y="0" height="1px" width="1px"/>'+
                   '</svg>';
var staticDestinations = "script image".split(" ");
var toCacheURLs = "junaroad.com limeroad.com".split(" ");
var notTocacheURLs = "tr.junaroad.com doubleclick widget.as.criteo dis.as.criteo sslwidget.criteo adservice maps.googleapis.com".split(" ");
var notToFetchURLs = "googlesyndication.com facebook.com/tr".split(" ");
var deviceType = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent) ? "m" : "d";
var abortFetch, abortFetchSignal;
var lrLogo = "https://img1.junaroad.com//assets/images/mobileNotif/img-1680161537554.jpg";

function cacheName (key) {
  return `${version}-${key}`
};

function getDeviceInfo(){
  var ua = navigator.userAgent;
  return ua;
};

function getUTMParamLink(camp, landingUrl){
  var ua = navigator.userAgent;
  var utm_params = "utm_source="+deviceType+"&utm_campaign="+camp+"&utm_medium=webnotif"
  if(landingUrl.includes("&")){
    landingUrl = landingUrl + "&" + utm_params
  }else{
    landingUrl = landingUrl + "?" + utm_params
  }  
  return landingUrl 
};

function isSet(value){
  if(value) {
    if (typeof (value) == "string") {
      if ((value == "") || (value == "null"))
        return false;
    }
    return true;
  }
  else {
    return false;
  }
}

function getHTTPSUrl(url) {
  if(url && typeof(url)=="string") {
    if(url.startsWith("https")){
      return url;
    }else{
      return url.replace("http", "https")
    }
  } else {
    return null;
  }
};

function fetchSimilarFromCache (cacheKey, requestString) {
  return caches.open(cacheKey).then( cache => {
    return cache.keys().then( keys => {
      try {
        keys.forEach(function(request, index, array) {
          if(request.url.indexOf(requestString) > -1 ){
            throw request
          }
        });
      }catch(request) {
        return caches.match(request).catch(() => {return undefined});
      }
      return undefined
    });
  });
};

function offlineResponse (url, destination) {
  var cacheKey = cacheName('static');
  if (destination === "image") {
    return new Response(offlineImage,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }else if (destination === "script") {
    if(url.includes('limeroad')){
      if(url.includes(url.split('/?v=')[0])){
        url = url.split('/?v=')[0];
      }else{
        url = url.split('-')[0];
      }
    }
    return fetchSimilarFromCache(cacheKey, url).catch(e => {return undefined})
  }else {
    var offlineResponseString = offlinePageAjax;
    if(!url.includes('ajax=true')){
      offlineResponseString = offlinePage
    }
    return new Response(offlineResponseString, 
      { headers: {'Content-Type': 'text/html'}}
    )
  }
};

function expiredNotif(expiryTimestamp){
  var current_time = 1000*(new Date()/1000);
  return current_time > expiryTimestamp ? true : false;
};

self.addEventListener('install', event => {
  return self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheKeys => {
      var oldCacheKeys = cacheKeys.filter(key => key.indexOf(version) !== 0);
      var deletePromises = oldCacheKeys.map(oldKey => {
        return caches.delete(oldKey)
      });
      return Promise.all(deletePromises);
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  var fetchRequest = event.request;
  var method = fetchRequest.method;
  if (method === 'GET') {
    var newRequest;
    if(fetchRequest.mode === "navigate"){
      // try{
      //   if(abortFetch && abortFetchSignal && !abortFetchSignal.aborted){
      //     abortFetch.abort();
      //   }
      // }catch(e){}
      newRequest = fetchRequest;
    }else{
      try{
        if(!abortFetch || (!abortFetchSignal) || (abortFetchSignal && abortFetchSignal.aborted)){
          abortFetch = new AbortController();
          abortFetchSignal = abortFetch.signal;
        };
        newRequest = new Request(fetchRequest, {
          mode : fetchRequest.mode,
          referrer : fetchRequest.referrer,
          signal : abortFetchSignal
        });
      }catch(e){
        newRequest = new Request(fetchRequest, {
          mode : fetchRequest.mode,
          referrer : fetchRequest.referrer
        });
      }
    }
    var responseType,
        destination = event.request.destination,
        url = newRequest.url,
        ifStaticURL = staticDestinations.some(staticDestination => destination === staticDestination),
        ifImageURL = destination === "image" ? !0 : !1,
        toCacheURL = toCacheURLs.some(cacheURL => url.includes(cacheURL)),
        notToCacheURL = notTocacheURLs.some(noCacheURL => url.includes(noCacheURL)),
        notToFetchURL = notToFetchURLs.some(noFetchURL => url.includes(noFetchURL));
    if(!notToFetchURL){
      if (ifStaticURL) {
        responseType = "static"
      }else{
        responseType = "dynamic"
      }
      var cacheKey = cacheName(responseType);
      if(responseType === 'static'){
        event.respondWith(
          caches.match(event.request).then(response => {
            return response || fetch(newRequest).then(response => {
              if (toCacheURL && !notToCacheURL && !ifImageURL && response && (response.ok || (response.type === "opaque")) && response.status != 206) {
                let copy = response.clone();
                caches.open(cacheKey).then( cache => {
                  cache.keys().then(keys => {
                    try {
                      keys.forEach(function(request, index, array) {
                        if(request.url.includes(event.request.url.split('-')[0]) || request.url.includes(event.request.url.split('/?v=')[0])){
                          cache.delete(request);
                        }
                      });
                    }catch(e) {}
                    cache.put(newRequest, copy).then(() => {}).catch(error => {})
                  });
                });
              }
              return response;
            });
          })
          .catch((e) => {
            if (e.name === 'AbortError') {
              return new Response();
            }else{
              return offlineResponse(url, destination);
            }
          })
        );
      }else{
        event.respondWith(
          fetch(newRequest).then(response => {
            if (toCacheURL && !notToCacheURL && !ifImageURL && response && response.ok && response.status != 206) {
              let copy = response.clone();
              caches.open(cacheKey).then( cache => {
                cache.put(newRequest, copy).then(() => {}).catch(error => {})
              });
            }
            return response;
          })
          .catch((e) => {
            if (e.name === 'AbortError') {
              return new Response();
            }else{
              return caches.match(newRequest).then(response => {
                if(response){
                  return response
                }else {
                  return offlineResponse(url, destination);
                }
              });
            }
          })
        )
      }
    }
  }
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate().then(function(results) {
      var percentUsed = (results.usage / results.quota) * 100;
      if (percentUsed >= 10) {
        caches.keys().then(cacheKeys => {
          cacheKeys.forEach(function(cacheName) {
            return caches.delete(cacheName);
          })
        }).then(function() {
          logSW("storageUsageExceed", "", "", "", "");
        })
      }
    });
  }
});

function loggerRequest(data){
  var url =  "https://tr.junaroad.com/"+JSON.stringify(data);
  url = encodeURI(url);
  fetch(url,{'mode': 'no-cors'}).then(data=>{}).catch(e => {return undefined})
};

function logSW(ev_name, notif_id, uuid, ruid, do_extra){
  var ua = navigator.userAgent;
  var data = {
    "sc": deviceType,
    "md": "production",
    "sess": "",
    "src": "notif",
    "med": "webnotif",
    "camp": notif_id,
    "device_type": getDeviceInfo(),
    "ev": [{
      "name": ev_name,
      "dest": "dw",
      "do": {
        "type": "notification",
        "id": notif_id,
        "extra": do_extra
      },
      "df":{
        "extra": version
      }
    }]
  };

  if(uuid != undefined && uuid.length == 24){
    data["db"] = {
      "type": "user",
      "user_type": "uuid",
      "id": uuid,
      "ruid": ruid
    };
  }else{
    data["db"] = {
      "type": "user",
      "user_type": "ruid",
      "id": ruid,
      "ruid": ruid
    };
  }
  loggerRequest(data);
};

function showNotificationCustom(e, event){
  logSW("webpushinit", getNotifId(e), getUUID(e), getRUID(e), "");
  const data = webNotifData(e);
  event.waitUntil(
    self.registration.showNotification(JSON.parse(data.data).title, data)
    .then(function(data){
      logSW("webpushshown",getNotifId(e), getUUID(e), getRUID(e), "");
    }).catch(function(){
      logSW("webpusherror",getNotifId(e), getUUID(e), getRUID(e), "");
    })
  )
};

self.addEventListener('message', event => {
  if(event.data === "abortFetch"){
    try{
      if(abortFetch && abortFetchSignal && !abortFetchSignal.aborted){
        abortFetch.abort();
      }
    }catch(e){}
  }else{
    logSW("webpushpreinit", "", "", "", "");
    try {
      var e = JSON.parse(event.data).data;
      showNotificationCustom(e, event);
    }catch(err){
      logSW("webpushparseerror", "", "", "", "");
    }
  }
});

self.addEventListener('push', event => {
  logSW("webpushpreinit", "", "", "", "");
  try {
    var e = event.data.json().data;
    showNotificationCustom(e, event);
  }catch(err){
    logSW("webpushparseerror", "", "", "", "");
  }
});

self.addEventListener('notificationclose', event => {
  const eventData = JSON.parse(event.notification.data);
  logSW("webpushclosed", eventData.notif_id, eventData.uuid, eventData.ruid, "");
});

self.addEventListener('notificationclick', event => {
  const eventData = JSON.parse(event.notification.data);
  var landing_url = event.action ? event.action : eventData.landing_url;
  var clicked_text = event.action ? "action" : eventData.landing_url;
  logSW("webpushclicked", eventData.notif_id, eventData.uuid, eventData.ruid, clicked_text);
  event.notification.close();
  event.waitUntil(clients.matchAll({
    type: "window"
  }).then(clientList => {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url == landing_url && 'focus' in client){
        return client.focus();
      }
    }
    if (clients.openWindow){
      return clients.openWindow(landing_url);
    }
  }));
});

function webNotifData(data){
  var requireInteraction = isSet(data.stky) ? (data.stky=='true') : false;
  var d = new Date();
  var notif_data = {
    "body": data.notificationText,
    "icon": isSet(data.thumbnailPic) ? getHTTPSUrl(data.thumbnailPic) : lrLogo,
    "badge": "https://img1.junaroad.com/assets/images/ic_launcher_monochrome.png",
    "dir": "auto",
    // "tag": "LR-main_" + d.getDate() + "_" + d.getMonth(),
    "tag": getNotifId(data),
    "data": JSON.stringify({
      "uuid": getUUID(data),
      "ruid": getRUID(data),
      "title": data.title,
      "notif_id": getNotifId(data),
      "landing_url": getUTMParamLink(data._id, data.landingPageUrl),
    }),
    "requireInteraction": requireInteraction,
    "renotify": false,
    "silent": false,
    "timestamp": d.getTime()
  };

  if(isSet(data.bigPictureUrl))
    notif_data.image = getHTTPSUrl(data.bigPictureUrl);
  // Parse Notification actions
  if(isSet(data.notif_act)) {
    try {
      var actions = [];
      var notif_act = JSON.parse(data.notif_act);
      notif_act.forEach(function (action, index) {
        actions.push({title: action.title, action: action.act_link})
      });
      notif_data.actions = actions;
    } catch(err){
      logSW("webpushparseerror", "", "", "", "notif_act -"+ data.notif_act.toString());
    }
  }
  return notif_data;
}

function getUUID(data){
  const extras = JSON.parse(data.extraJsonString); 
  if(extras){
    return extras.uuid;
  }else{
    return null;
  }
}

function getRUID(data){
  const extras = JSON.parse(data.extraJsonString); 
  if(extras){
    return extras.ruid;
  }else{
    return null;
  }
}

function getNotifId(data){
  return data._id;
}
