'use strict';

/*
COMMS-590 - Refactor para multicompañia:
Mapa con valores default para icon y badge por companyId. Formato: Map(companyId, json{icon, badge})

Se espera recibir el companyId como parte del objeto data de la push.
 */
const map = new Map();
map.set("1", {"icon":'https://media.staticontent.com/me/subscriptions-ui/staticui/imgs/iconx2.png', "badge":'/me/subscriptions-ui/staticui/imgs/res/drawable-xxxhdpi/ic_stat_iconx2.png'});
map.set("2875", {"icon":'https://media.staticontent.com/me/subscriptions-ui/staticui/imgs/icon_beda.png', "badge":'/me/subscriptions-ui/staticui/imgs/res/drawable-xxxhdpi/ic_stat_icon_beda.png'});
map.set("2825", {"icon":'https://media.staticontent.com/me/subscriptions-ui/staticui/imgs/icon_vf.png', "badge":'/me/subscriptions-ui/staticui/imgs/res/drawable-xxxhdpi/ic_stat_icon_vf.png'});
map.set("3212", {"icon":'https://media.staticontent.com/me/subscriptions-ui/staticui/imgs/icon_vn.png', "badge":'/me/subscriptions-ui/staticui/imgs/res/drawable-xxxhdpi/ic_stat_icon_vn.png'});
map.set("3211", {"icon":'https://media.staticontent.com/me/subscriptions-ui/staticui/imgs/icon_pa_2.png', "badge":'/me/subscriptions-ui/staticui/imgs/res/drawable-xxxhdpi/ic_stat_icon_pa.png'});

self.addEventListener('push', function (event) {
  let promiseChain;
  if (event.data) {
    // We have data - lets use it
    promiseChain = Promise.resolve(event.data.json());

    promiseChain.then(data => {
      if (data.silent) {
        return new Promise(function () {
        });
      }

      let companyDataArray = map.get(data.data.companyId);

      return self.registration.showNotification(data.title,
        {
          body: data.body,
          icon: data.icon ? data.icon : companyDataArray.icon,
          badge: data.badge ? data.badge : companyDataArray.badge,
          image: data.image ? data.image : '',
          tag: data.tag,
          data: data.data,
          actions: data.actions ? data.actions : [],
          requireInteraction: true,
          silent: data.silent ? data.silent : false
        });

    });
    event.waitUntil(promiseChain);
  }
});


self.addEventListener('install', function (event) {
  self.skipWaiting();
});
self.addEventListener('activate', function (event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', function (event) {
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  let goto;
  if (!event.action) {
    // Was a normal notification click
    goto = event.notification.data.url;
  } else {
    goto = event.notification.data.actionsUrl[event.action];
    if (!goto) {
      goto = event.notification.data.url;
    }
  }

  if (goto !== undefined && goto !== "") {
    const promiseChain = clients.openWindow(goto);
    event.waitUntil(promiseChain);
  }

});
