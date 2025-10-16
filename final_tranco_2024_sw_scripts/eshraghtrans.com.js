const _CONF = { v: '5.15.252', l: 'fa', ls: 'fa' };
// -------------------------------------------------------------------------------------------

const VERSION = _CONF.v;
const DEF_LOCALE = _CONF.l;
const LOCALES = _CONF.ls.split(",");

const SHARE_ASSETS = "_share-target";
const PWA_REQ_KEY = "/_reta-pwa-";
const CLIENT_OPTIONS = { type: "window", includeUncontrolled: true };

const removeAllCache = async () => {
  const keys = await caches.keys();
  for (const key of keys) {
    await caches.delete(key);
  }
};

const defaultResponse = async (event) => {
  const preloadResp = await event.preloadResponse;
  if (preloadResp) {
    return preloadResp;
  }

  return fetch(event.request);
};

const broadcastVersion = async (version) => {
  const mClients = await self.clients.matchAll(CLIENT_OPTIONS);
  for (const client of mClients) {
    client.postMessage({ version, swVersion: VERSION });
  }
};

//_________________________________________________________________________

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      defaultResponse(event).catch(
        () =>
          new Response(
            `
                  <html>
                    <head> <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"> <meta name="referrer" content="same-origin" /> </head>
                    <body>
                      <div dir="rtl" style="text-align:center;padding-top:100px;font-family:tahoma">
                          <h1>مشکل در اتصال به اینترنت</h1>
                          <p>برقراری ارتباط با سرور میسر نیست. لطفا اتصال اینترنت خود را بررسی کرده و مجددا تلاش نمایید.</p>
                          <button onclick="reloadPage()" style="font-family:tahoma;font-size:1rem;">
                              تلاش مجدد
                          </button>
                          <script>
                              function reloadPage () { location.reload(); };
                              setTimeout(reloadPage, 15000);
                              window.addEventListener('online', reloadPage);
                          </script>
                      </div>
                    </body>
                  </html>
                `,
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: { "content-type": "text/html; charset=UTF-8" },
            }
          )
      )
    );
  }
});

//_________________________________________________________________________

self.skipWaiting();

// const onInstall = async () => {}
// self.addEventListener('install', ev => ev.waitUntil(onInstall()))

//_________________________________________________________________________

const onActivate = async () => {
  await self.clients.claim();

  await removeAllCache();

  await broadcastVersion(VERSION);

  if (self.registration.navigationPreload) {
    await self.registration.navigationPreload.enable();
  }
};
self.addEventListener("activate", (ev) => ev.waitUntil(onActivate()));

//_________________________________________________________________________

const onPush = async (event) => {
  try {
    const data = event.data
      ? event.data.json()
      : { title: "Notification from " + self.registration.scope, link: "/" };

    if ((self.Notification || {}).permission === "granted") {
      data.tag = "app.sw.notification";
      data.renotify = true;

      await self.registration.showNotification(data.title, data);
    }
  } catch (error) {
    console.warn(error);
  }

  // always check for service worker updates
  await self.registration.update();
};
self.addEventListener("push", (ev) => ev.waitUntil(onPush(ev)));

//_________________________________________________________________________

const onNotifClick = async (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const link = data.link || "/";
  const notif = data.notif;

  const mClients = await self.clients.matchAll(CLIENT_OPTIONS);

  if (notif) {
    for (const client of mClients) {
      try {
        const path = /^https?:/g.test(client.url)
          ? new URL(client.url).pathname
          : client.url;

        // this client does not handle the notif events
        if (path.includes(".")) {
          continue;
        }

        if (!client.focused) {
          await client.focus();
        }

        client.postMessage({ notif });
        return;
      } catch (err) {
        console.warn(err);
      }
    }
  }

  // in case there was no client or no notif
  if (self.clients.openWindow) {
    await self.clients.openWindow(link);
  }
};
self.addEventListener("notificationclick", (ev) =>
  ev.waitUntil(onNotifClick(ev))
);

//_________________________________________________________________________
