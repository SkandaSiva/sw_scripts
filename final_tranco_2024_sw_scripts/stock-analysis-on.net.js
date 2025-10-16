self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            if (self.registration.navigationPreload) {
                await self.registration.navigationPreload.enable();
            }
        })()
    );
});
self.addEventListener("fetch", async (event) => {
    event.respondWith(await fetch(event.request));
});
