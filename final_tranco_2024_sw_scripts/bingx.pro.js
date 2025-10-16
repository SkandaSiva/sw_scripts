importScripts(
  "https://static-app.bb-os.com/fe-common/lib/sw-helper/sendLog.js?v=1207"
);

importScripts(
  "https://static-app.bb-os.com/fe-common/lib/sw-lib/crash-monitor.sw.js?v=010"
);

importScripts(
  "https://static-app.bb-os.com/fe-common/lib/sw-lib/exposure.sw.js?v=1016"
);

/**
 * 安装过程
 */
self.addEventListener("install", (event) => {
  console.log("==========>", "Installing Service Worker...");
  event.waitUntil(
    // 在安装阶段立即激活新的 Service Worker，而不需要等待当前页面关闭或刷新。默认情况下，新的 Service Worker 安装后会等待，直到所有当前使用的页面关闭，才会激活。
    // 通过调用 self.skipWaiting()，你可以跳过等待阶段，立即激活新的 Service Worker，从而更快地使更新生效。
    self.skipWaiting()
  );
});

/**
 * 激活过程
 */
self.addEventListener("activate", (event) => {
  console.log("==========>", "Activating Service Worker...");
  event.waitUntil(
    // 调用 self.clients.claim() 来确保新的 Service Worker 立即开始控制当前页面。
    // 一旦激活，Service Worker 将开始控制其作用域内的所有页面（除非你使用了 clients.claim()，否则它只会控制下一次加载的页面）。
    self.clients.claim()
  );
});
