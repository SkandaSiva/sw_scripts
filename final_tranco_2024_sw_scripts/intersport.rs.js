
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await clients.claim();
    })()
  );
});
