!function(){let a=[],t="";self.addEventListener("install",(e=>e.waitUntil(async function(){const e=await caches.open(t);await e.addAll(a)}()))),self.addEventListener("activate",(a=>a.waitUntil(async function(){const a=await caches.keys();await Promise.all(a.map((a=>a!==t&&caches.delete(a))))}())))}();
//# sourceMappingURL=service-worker.js.map
