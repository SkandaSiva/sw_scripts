var act;
const syncStore = {};

self.addEventListener("push", function (e) {
  console.log("push");
  
  if (!(self.Notification && self.Notification.permission === "granted")) {
    // Notifications aren't supported or permission not granted!
    return;
  }

  if (e.data) {
    var msg = e.data.json();
    if (!msg) return; // Ensure msg is not null or undefined

    act = msg;
    let body_campId;
    try {
      body_campId = JSON.parse(msg.body);
    } catch (error) {
      console.error('Invalid JSON in msg.body:', error);
      return;
    }
    
    if (!body_campId || !body_campId.body || !body_campId.camp_tok) {
      console.error("Invalid body_campId structure:", body_campId);
      return;
    }

    console.log(act);
    console.log(body_campId);

    // Set notifications buttons if exist
    var w = [];
    if (act.actions && act.actions.length > 0 && "title" in act.actions[0]) {
      w[0] = {
        action: act.actions[0].action[0],
        title: act.actions[0].title[0],
      };

      // if there is another button
      if (act.actions[0].action.length == 2) {
        w[1] = {
          action: act.actions[0].action[1],
          title: act.actions[0].title[1],
        };
      }
    }

    if (!msg.title || !msg.image) {
      console.error('Missing notification title or image.');
      return;
    }

    e.waitUntil(
      self.registration.showNotification(msg.title, {
        body: body_campId.body,
        icon: msg.image,
        image: msg.image,
        actions: w,
        data: {
          action: act.actions[0]?.action[0] || '',
          campaign_token: body_campId.camp_tok,
        },
      })
    );

    // ------------------------------------------
    let campaign_token = body_campId.camp_tok || '';
    let guest_id = body_campId.gue_id || '';
    let shopware_user_id = body_campId.usr_id;

    if (shopware_user_id != null) {
      localStorage.setItem("skyfy_user_id", shopware_user_id);
    } else {
      localStorage.setItem("skyfy_user_id", -1);
    }

    var data = {
      cid: campaign_token,
      idsite: _skyfy_tms_shop_id || '', // Ensure _skyfy_tms_shop_id exists
      type: "visit",
      guest_id: guest_id,
      client_id: shopware_user_id || '',
    };
 console.log('skyfy_campaign_endpoint_stats',skyfy_campaign_endpoint_stats);
    if (skyfy_campaign_endpoint_stats) {
      fetch(skyfy_campaign_endpoint_stats, {
        method: "POST",
        headers: {
          Accept: "*",
        },
        body: JSON.stringify(data), // Ensure request body is sent
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.error("Missing campaign endpoint URL");
    }
    // ------------------------------------------
  }
});

self.addEventListener("message", function (event) {
  if (event.data && event.data.type === "sync") {
    const id = "skfyuserkey";
    syncStore[id] = event.data;
    self.registration.sync.register(id);
  }
});

self.addEventListener("install", function (i) {
  self.skipWaiting();
});

self.addEventListener("notificationclick", function (event) {
  console.log("On notification click: ", event.notification.tag);
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      if (clients.openWindow) {
        if (event.action) {
          return clients.openWindow(event.action);
        } else if (event.notification.data.action) {
          return clients.openWindow(event.notification.data.action);
        }
      }
    })
  );
});

self.addEventListener("activate", function (a) {
  a.waitUntil(clients.claim());
});
