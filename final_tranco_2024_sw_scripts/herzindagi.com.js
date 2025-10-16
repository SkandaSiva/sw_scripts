const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
const channel = new BroadcastChannel("myChannel");

const saveSubscription = async (subscription, val) => {
  let device = val?.device || "";
  let browser = val?.browser || "";
  let domain = val?.domain || "";
  let category = val?.category || "";
  let userId = val?.userId || "";
  let lang = val?.lang || [];
  const response = await fetch(
    "https://web-push-notification-api.jagran.com/" + "notification/save-subscription",
    {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer 5088e7346b40a1c0c0dc6e8bfa88c1d4",
      },
      body: JSON.stringify({
        data: subscription,
        device,
        browser,
        domain,
        lang,
        category,
        userId
      }),
    }
  ).catch((err) => console.log("err", err));

  return response.json();
};
const renewSubscription = async (subscription, id, lang) => {
  const response = await fetch(
    "https://web-push-notification-api.jagran.com/" + "notification/renew-subscription",
    {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer 5088e7346b40a1c0c0dc6e8bfa88c1d4",
      },
      body: JSON.stringify({ data: subscription, id: id, lang: lang }),
    }
  ).catch((err) => console.log("err", err));

  return response.json();
};
let paramm1Promise = new Promise((resolve, reject) => {
  self.addEventListener("message", async (event) => {
    if (event.data && event.data.data) {
      self.paramm1 = event.data.data;
      resolve();
    }
  });
});

self.addEventListener("activate", async (e) => {
  await paramm1Promise;
  if (self?.paramm1?.userData) {
    const subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BGejt8rFdf3KA4J434lytilkoN-yvn_0BaUw761SqU6jp_vYHmNF2hCNXnnseJOX5BgvMOAwiTcfLfbjBRALUyg"
      ),
    });
    const response = await renewSubscription(
      subscription,
      self?.paramm1?.userData?.id,
      self?.paramm1?.userData?.lang
    );
    channel.postMessage({ type: "updateData", response: response });
  } else if (self?.paramm1) {
    const subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BGejt8rFdf3KA4J434lytilkoN-yvn_0BaUw761SqU6jp_vYHmNF2hCNXnnseJOX5BgvMOAwiTcfLfbjBRALUyg"
      ),
    });

    const response = await saveSubscription(subscription, self?.paramm1);
    channel.postMessage({
      type: "saveData",
      response: { id: response.id, lang: self?.paramm1?.lang || [] ,userId:self.paramm1.userId},
    });
  }
});

// self.postMessage({ value: "some data" });

self.addEventListener("push", (e) => {
  const data = e.data.json();

  const notification = {
    body: data.body,
    icon: data.img,
    actions: data.btn_List,
    data: { url: data.url, btn: data.btn_List, id: data.id, status: data.id },
    tag: data.id,
  };
  if (data.image) {
    notification["image"] = data.image;
  }
  self.registration.showNotification(data.title, notification);
});
const updateCount = async (data) => {
  const response = await fetch(
    "https://web-push-notification-api.jagran.com/" + "notification/update-count",
    {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer 5088e7346b40a1c0c0dc6e8bfa88c1d4",
      },
      body: JSON.stringify(data),
    }
  ).catch((err) => console.log("err", err));

  return response.json();
};

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  let url = event.notification.data.url;
  let obj = { count: 1, id: event.notification.data.id };
  if (event.action == "close") {
    obj["close"] = 1;

    updateCount(obj);
  }

  if (event.action == "btn1") {
    event.notification.data.btn.forEach((el) => {
      if (el.action == "btn1") {
        url = el.url;
      }
    });
    obj["btn1"] = 1;
    updateCount(obj);
    event.waitUntil(clients.openWindow(url));
    return;
  } else if (event.action == "btn2") {
    event.notification.data.btn.forEach((el) => {
      if (el.action == "btn2") url = el.url;
    });
    obj["btn2"] = 1;

    updateCount(obj);

    event.waitUntil(clients.openWindow(url));
    return;
  } else {
    updateCount(obj);
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
self.addEventListener("pushsubscriptionchange", async function (event) {
  const subscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      "BGejt8rFdf3KA4J434lytilkoN-yvn_0BaUw761SqU6jp_vYHmNF2hCNXnnseJOX5BgvMOAwiTcfLfbjBRALUyg"
    ),
  });
  let id = self?.paramm2?.id;
  let lang = self?.paramm2?.lang || [];
  if (id) {
    const response = await renewSubscription(subscription, id, lang);

    channel.postMessage({ type: "renewData", response: response });
  }
});
self.addEventListener("message", async (event) => {
  // if (event.data && event.data.data) {
  //   self.paramm1 = event.data.data;
  // }
  if (event.data && event.data.userData) {

    self.paramm2 = event.data.userData;
  }

  if (event.data && event.data.sendBack) {
  }
});
self.addEventListener("install", (e) => {
  self.skipWaiting();
});
self.addEventListener("notificationclose", (event) => {
  event.notification.close();
  let obj = { count: 1, id: event.notification.data.id, close: 1 };

  updateCount(obj);
});
