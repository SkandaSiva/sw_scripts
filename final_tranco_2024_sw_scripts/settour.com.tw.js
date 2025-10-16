importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js');

/** [Promise] Get FCM Token */
function getSubToken() {
  var firebaseConfig = {
      apiKey: "AIzaSyAwjgJQznU-hxzl6bqrUHVj6QcQOizXWYw",
      projectId: "settour-mkt-main-prod",
      messagingSenderId: "424801772894",
      appId: "1:424801772894:web:ad30a5c1f5145181951bcf",
      measurementId: "G-DHK5E0BMW9"
  };
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  return firebase.messaging().getToken()
  .then(function(token) {
    return subToken = token;
  })
  .catch(function(error) {
      console.error('[SETTOUR-SW] Get Token Error', error);
      return null;
  });
};

/** [Fetch] saveWebPushClickGql */
function saveWebPushClick (pushId, subToken = '') {
  var serverUrl = 'https://gql.settour.com.tw/graphql'
  var body = {
    query: 'mutation ($subToken: String, $pushId: String!) {\
              saveWebPushClick(subToken: $subToken, pushId: $pushId) {\
                error {\
                  msgCode\
                  msgDesc\
                }\
                data {\
                  result\
                }\
              }\
            }',
    variables: { subToken: subToken , pushId: pushId }
  };
  fetch(serverUrl, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

self.addEventListener('install', function(event) {
    self.skipWaiting();
});

self.addEventListener('activate', function(event){
});

/** 監聽 Push */
self.addEventListener('push', function(event) {
  var payload = event.data.json();
  var notifyMsg = payload.notification;
  var dataMsg = payload.data;
  var msgTitle = notifyMsg.title || '';
  var msgContent = {
    icon:'https://www.settour.com.tw/st_dist/img/settour-logo/settour-logo-192x192.png',
    badge: 'https://www.settour.com.tw/st_dist/img/settour-logo/settour-logo-72x72_1.png',
  }
  msgContent.body = notifyMsg.body || '',
  msgContent.image = notifyMsg.image || '',
  msgContent.tag = dataMsg.pushId, //tag屬性:相同tag的推播，新的會覆蓋舊的
  msgContent.data = dataMsg,
  event.waitUntil(
    self.registration.showNotification(msgTitle, msgContent)
  );
});


/** 監聽 Notification Click */
self.addEventListener('notificationclick', function(event) {
  var clickUrl =  event.notification.data.clickUrl || 'https://www.settour.com.tw/';
  var pushId =  event.notification.data.pushId || '';
  var actionType =  event.notification.data.actionType || 'NONE'; //瀏覽行為（NONE: 不指定, ORD: 放棄訂購, VIEW: 放棄瀏覽, URL: 特定網址）
  var isNeedSaveDetail = !(actionType === 'ORD' || actionType === 'VIEW');
  event.waitUntil(
    clients.matchAll({
      includeUncontrolled: true,
      type: 'window'
    }).then(windowClients => {
      // 如果tab是開著的，就 focus 這個tab
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if(client.url === clickUrl && 'focus' in client) {
          client.focus();
          if(pushId) {
            if (isNeedSaveDetail) getSubToken().then((subToken) => saveWebPushClick(pushId, subToken));
            else saveWebPushClick(pushId);
          }
          return event.notification.close();
        }
      }
      // 如果沒有，就新增tab
      if(clients.openWindow) {
        clients.openWindow(clickUrl);
        if(pushId) {
          if (isNeedSaveDetail) getSubToken().then((subToken) => saveWebPushClick(pushId, subToken));
          else saveWebPushClick(pushId);
        }
        return event.notification.close();
      }
    })
  );
});
