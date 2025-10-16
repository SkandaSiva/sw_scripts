self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('fetch', (event) => {
  event.waitUntil(
    Promise.all([
      // 更新客户端
      self.clients.claim(), // 清理旧版本
      caches.keys().then(function (cacheList) {
        return Promise.all(
          cacheList.map(function (cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    ])
  );
});

// 浏览器通知推送消息
self.addEventListener('push', (e) => {
  const data = e.data.json();
  self.registration.showNotification(data.title, {
    body: data.content,
    icon: data.icon,
    data: { url: data.jumpUrl },
    actions: [{ action: 'open_url', title: 'Read Now' }]
  });
});

self.addEventListener('notificationclick', (e) => {
  self.clients.openWindow(e.notification.data.url); //which we got from above
});
