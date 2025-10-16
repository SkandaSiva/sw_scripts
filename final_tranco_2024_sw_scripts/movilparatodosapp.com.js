const c = "MPT", l = "https://movilparatodosapp.com", s = l, a = "version-1", d = ["index.html", "offline.html"];
self.addEventListener("install", (t) => {
  t.waitUntil(
    caches.open(a).then((e) => (console.log("Opened cache"), e.addAll(d)))
  );
});
self.addEventListener("activate", (t) => {
  const e = [];
  e.push(a), t.waitUntil(
    caches.keys().then(
      (n) => Promise.all(
        n.map((o) => {
          if (!e.includes(o))
            return caches.delete(o);
        })
      )
    )
  );
});
self.addEventListener("push", (t) => {
  var o, i;
  const e = "Movil para todos";
  let n;
  try {
    n = (o = t.data) == null ? void 0 : o.json();
  } catch {
    n = {
      title: e,
      // default notification title
      content: ((i = t.data) == null ? void 0 : i.text()) || ""
      // text content as default content or default content
    };
  }
  t.waitUntil(
    self.registration.showNotification(n.title || e, {
      body: n.content,
      icon: `${s}/${c.toLowerCase()}/icon-192x192.png`,
      tag: n.messageId
    })
  );
});
self.addEventListener("notificationclick", function(t) {
  const e = t.notification.tag;
  t.notification.close(), clients.openWindow(`${s}/mensajes/${e}`);
});
