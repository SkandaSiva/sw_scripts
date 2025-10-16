// public/service-worker.js

self.addEventListener("install", (event) => {
  ///console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  /// console.log("Service Worker activating.");
});

// This example caches an example request; you can add more logic as needed
self.addEventListener("fetch", (event) => {
  ///console.log("Fetching:", event.request.url);
});
