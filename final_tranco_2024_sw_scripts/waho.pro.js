//sw.js
self.addEventListener("fetch", (e) => {
  // console.log('拦截：', e.request.url);
});
self.addEventListener("install", (e) => {
  e.waitUntil(self.skipWaiting()); // 跳过等待，直接激活
  console.log("install...");
});
self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim()); // 激活后立刻让serviceWorker拥有控制权
  console.log("activate....");
});

console.log("activate");
