/* eslint-disable  */

self.addEventListener("install", function (event) {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (event) => {
  const { searchParams } = new URL(location)
  const blockExternals = searchParams.get("block-externals") === "1"
  const hostname = searchParams.get("hostname")
  const url = new URL(event.request.url)

  if (
    blockExternals &&
    url.protocol.startsWith("http") &&
    url.hostname !== hostname
  ) {
    event.respondWith(
      new Response("/* request intercepted by service worker */", {
        status: 200,
      })
    )
  }
})
