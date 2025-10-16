try {
  self["workbox:core:7.0.0"] && _();
} catch {
}
const c = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, s = (e) => [c.prefix, e, c.suffix].filter((t) => t && t.length > 0).join("-"), n = (e) => {
  for (const t of Object.keys(c))
    e(t);
}, o = {
  updateDetails: (e) => {
    n((t) => {
      typeof e[t] == "string" && (c[t] = e[t]);
    });
  },
  getGoogleAnalyticsName: (e) => e || s(c.googleAnalytics),
  getPrecacheName: (e) => e || s(c.precache),
  getPrefix: () => c.prefix,
  getRuntimeName: (e) => e || s(c.runtime),
  getSuffix: () => c.suffix
};
function l() {
  self.addEventListener("activate", () => self.clients.claim());
}
try {
  self["workbox:precaching:7.0.0"] && _();
} catch {
}
try {
  self["workbox:strategies:7.0.0"] && _();
} catch {
}
try {
  self["workbox:routing:7.0.0"] && _();
} catch {
}
const f = "-precache-", h = async (e, t = f) => {
  const r = (await self.caches.keys()).filter((a) => a.includes(t) && a.includes(self.registration.scope) && a !== e);
  return await Promise.all(r.map((a) => self.caches.delete(a))), r;
};
function u() {
  self.addEventListener("activate", (e) => {
    const t = o.getPrecacheName();
    e.waitUntil(h(t).then((i) => {
    }));
  });
}
u();
self.skipWaiting();
l();
