const c="1730985169825",s=`cache-${c}`;self.addEventListener("activate",t=>{async function a(){for(const e of await caches.keys())e!==s&&await caches.delete(e)}t.waitUntil(a())});
