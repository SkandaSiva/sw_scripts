
var SERVICE_WORKER_VERSION = 2;
var CACHE_NAME = 'ExtentWorld-' + SERVICE_WORKER_VERSION;

function HasPrefix(pf, s) {
  return s.substring(0, pf.length) === pf;
}

function ParseJSON(rawStr) {
  try {
    return JSON.parse(rawStr);
  } catch (err) {
    return null;
  }
}



function getHtmlPage(txtMsg) {
  var html = '<!DOCTYPE html><html lang="en"><head><title>Error</title>\
<meta charset="UTF-8"/>\
<meta http-equiv="X-UA-Compatible" content="IE=edge"/>\
<meta http-equiv="content-type" content="text/html; charset=UTF-8"/>\
<meta name="theme-color" content="#ddd"/>\
<meta name="mobile-web-app-capable" content="yes"/>\
<meta name="apple-mobile-web-app-capable" content="yes"/>\
<meta name="apple-mobile-web-app-title" content="ExtentWorld"/>\
<link rel="apple-touch-icon" href="/auto/HjBB6bABVsba1ly08.png"/>\
<link rel="apple-touch-icon" sizes="76x76" href="/auto/HjBB6bABVsba1ly08.png"/>\
<link rel="apple-touch-icon" sizes="120x120" href="/auto/HjBB6bABVsba1ly08.png"/>\
<link rel="apple-touch-icon" sizes="152x152" href="/auto/HjBB6bABVsba1ly08.png"/>\
<link rel="manifest" href="/auto/HhWJjVYyITtbjgxG_.json"/>\
<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width"/>\
<link rel="icon" href="/auto/HjBB6bABVsba1ly08.png"/>\
<style>\
*{\
  font-family: "Lucida Grande", Tahoma, Helvetica, "Helvetica Neue", Roboto, Arial, Geneva, "Liberation Sans", sans-serif;\
}\
html\
{\
  position: fixed;\
  width: 100vw;\
  height: 100vh;\
  overflow: hidden;\
}\
body\
{\
  position: fixed;\
  width: 100vw;\
  height: 100vh;\
  margin: 0px;\
  overflow: hidden;\
  background-color: #ddd;\
}\
.mainBox\
{\
  width: 100vw;\
  height: 100vh;\
  overflow-x: hidden;\
  overflow-y: scroll;\
  overscroll-behavior: contain;\
  scroll-behavior: smooth;\
	-webkit-overflow-scrolling: touch;\
  padding-top: 30vh;\
  padding-left: 10px;\
  padding-right: 10px;\
  overflow: hidden;\
  text-align: center;\
  background-color: #ddd;\
}\
.blkLink\
{\
  display: block;\
  width: calc(100% - 20px);\
  overflow: hidden;\
  cursor: pointer;\
}\
.msg\
{\
  display: inline-block;\
  vertical-align: top;\
  width: calc(100% - 40px);\
  max-width: 400px;\
  margin-top: 20px;\
  font-size: 20px;\
  padding: 10px;\
  color: #1f408c;\
  font-weight: bold;\
  overflow-wrap: break-word;\
  border: solid 2px red;\
  border-radius: 4px;\
  background-color: #ebe5c6;\
}\
.logoBox\
{\
  display: inline-block;\
  vertical-align: top;\
  width: 100%;\
  white-space: nowrap;\
  font-size: 0px;\
  overflow: hidden;\
}\
.logoTxt\
{\
  vertical-align: top;\
  padding-left: 4px;\
  height: 60px;\
  line-height: 60px;\
  font-size: 40px;\
  font-weight: bold;\
  color: #0582C6;\
  letter-spacing: 5px;\
}\
.logoIcon\
{\
  display: inline-block;\
  vertical-align: top;\
  height: 80px;\
}\
</style></head>\
';
  html += '<body>\
<div class="mainBox">\
  <a class="blkLink" href="/">\
    <div class="logoBox">\
      <img class="logoIcon" src="/auto/HjBB6bABVsba1ly08.png"/>\
      <div class="logoTxt">ExtentWorld</div>\
    </div>\
  </a>\
  <noscript>\
    <div class="blkLink">\
      <div class="msg">\
        Require JavaScript\
      </div>\
    </div>\
  </noscript>\
  <a class="blkLink" href="javascript:window.location.reload(true);">\
    <div class="msg">\
' + (txtMsg || '') + '\
    </div>\
  </a>\
</div>\
</body>\
';
  html += '</html>';
  return html;
}
var connErrRespHtml = getHtmlPage('<div>No internet connection.</div><div>Click here to reconnect.</div>');
var svrErrRespHtml = getHtmlPage('<div>Unable to connect to server.</div><div>Click here to reconnect.</div>');
var connErrRespBlob = new Blob([connErrRespHtml], {type : 'text/html'});
var svrErrRespBlob = new Blob([svrErrRespHtml], {type : 'text/html'});

var cacheUrlMap = {
  //'/auto/HsalWb4bNUVFDvkaD.gif' : 2,
  //'/auto/HhWJjVYyITtbjgxG_.json' : 2,
  '/auto/HMdAfNGiWqlJH5qeT.ico' : 2,
  '/auto/Hmfd1vGdNrhwYGRok.png' : 2,
  '/auto/HjBB6bABVsba1ly08.png' : 2
};

self.addEventListener('install', function(evt) {
  var cacheList = [
    //'/auto/HsalWb4bNUVFDvkaD.gif',
    //'/auto/HhWJjVYyITtbjgxG_.json',
    '/auto/HMdAfNGiWqlJH5qeT.ico',
    '/auto/Hmfd1vGdNrhwYGRok.png',
    '/auto/HjBB6bABVsba1ly08.png'
  ];
  evt.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll ? cache.addAll(cacheList) : null;
    })
  );
});

self.addEventListener('fetch', function(evt) {
  var req = evt.request;
  var normalizedUrl = new URL(req.url);
  normalizedUrl.hash = '';
  var urlPath = normalizedUrl.pathname;
  if (HasPrefix('/offline/', urlPath)) {
    return;
  }

  var isStaticCache = false; //HasPrefix('/auto/', urlPath);
  var shouldBeCached = isStaticCache || cacheUrlMap[urlPath] || cacheUrlMap[urlPath + normalizedUrl.search];
  //shouldBeCached = shouldBeCached || HasPrefix('/HfjoVbnENcNYU6yka/', urlPath);
  //shouldBeCached = shouldBeCached || HasPrefix('/HwVJO9UlPWkDg2yAE/', urlPath);
  var isNavigateReq = (req.mode === 'navigate');
  if (!isNavigateReq && !shouldBeCached) {
    return;
  }

  

  var getRespFcn = async function() {

    if (isStaticCache) {
      var cachedResp = await caches.match(normalizedUrl);
      if (cachedResp) {
        return cachedResp;
      }
    }

    var fetchParam = {
      
      redirect: 'manual',
      credentials: 'same-origin'
    };

    var fetchOk = true;
    var fetchedResp;
    try {
      fetchedResp = await fetch(normalizedUrl, fetchParam);
      fetchOk = fetchedResp && fetchedResp.ok;
    } catch (err) {
      
      fetchOk = false;
    }

    if (fetchOk) {
      
      if (!fetchedResp || fetchedResp.status !== 200 || fetchedResp.type !== 'basic') {
        
        if (isNavigateReq) {
          if (fetchedResp.status >= 500) {
            return new Response(svrErrRespBlob, {status: 200, statusText: 'OK'});
          }
          return new Response(connErrRespBlob, {status: 200, statusText: 'OK'});
        }
        return fetchedResp;
      }
      if (!shouldBeCached) {
        
        return fetchedResp;
      }
      
      var respToCache = fetchedResp.clone();
      var cache = await caches.open(CACHE_NAME);
      cache.put(normalizedUrl, respToCache);
      return fetchedResp;
    }
    if (isNavigateReq) {
      
      if (fetchedResp && fetchedResp.status >= 500) {
        return new Response(svrErrRespBlob, {status: 200, statusText: 'OK'});
      }
      return new Response(connErrRespBlob, {status: 200, statusText: 'OK'});
    }
    if (!isStaticCache) {
      var cachedResp = await caches.match(normalizedUrl);
      if (cachedResp) {
        
        return cachedResp;
      }
    }
    
    return new Response(null, {status: 503, statusText: 'Error'});
  };

  evt.respondWith(getRespFcn());
});


self.addEventListener('notificationclick', function(evt) {
  var notification = evt.notification;
  var action = evt.action;
  notification.close();
  if (evt.action == 'close') {
    return;
  }
  evt.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientsArr) {
      var numWindowClients = clientsArr ? clientsArr.length : 0;
      for (var i = 0; i < numWindowClients; i++) {
        var windowClient = clientsArr[i];
        if (windowClient && 'focus' in windowClient) {
          windowClient.focus();
          return;
        }
      }
      if (clients.openWindow) {
        clients.openWindow('/');
      }
    })
  );
});

self.addEventListener('periodicsync', (evt) => {
  
  if (evt.tag === 'daily-reminder') {
    var options = {
      body: 'Have you checked news on ExtentWorld today?',
      icon: '/auto/HjBB6bABVsba1ly08.png',
    };
    evt.waitUntil(self.registration.showNotification('ExtentWorld', options));
  }
  if (evt.tag === 'daily-reminder-vn') {
    var options = {
      body: 'B\u1EA1n xem tin t\u1EE9c tr\xEAn ExtentWorld h\xF4m nay ch\u01B0a?',
      icon: '/auto/HjBB6bABVsba1ly08.png',
    };
    evt.waitUntil(self.registration.showNotification('ExtentWorld', options));
  }
});

self.addEventListener('push', function(evt) {
  
  var rawTxtMsg = evt.data && evt.data.text ? evt.data.text() : '';
  var msgInfo = ParseJSON(rawTxtMsg);
  var title = 'ExtentWorld';
  var options = {
    body: 'You have notifications',
    icon: '/auto/HjBB6bABVsba1ly08.png',
  };
  if (msgInfo) {
    if (msgInfo.Dt) {
      options.icon = '/auto/Heiv_4bz2FFtsQl6g.png';
      title = 'ExtentWorld Dating';
    } else if (msgInfo.Sc) {
      options.icon = '/auto/HVWECt6X2FL52bPMi.png';
      title = 'ExtentWorld Social';
    }
    if (msgInfo.I) {
      options.icon = msgInfo.I;
    }
    if (msgInfo.S) {
      options.body = msgInfo.S;
    }
    if (msgInfo.T) {
      title = msgInfo.T;
    }
  } else if (rawTxtMsg) {
    options.body = rawTxtMsg;
  }
  evt.waitUntil(self.registration.showNotification(title, options));
});

