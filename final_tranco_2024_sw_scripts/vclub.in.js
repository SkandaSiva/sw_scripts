// 定义缓存名称
const cacheName = 'vclub-v1';

// 需要缓存的资源文件
const cacheAssets = [
  '/',
];

// 安装Service Worker
self.addEventListener('install', (event) => {
  // event.waitUntil(
  //   caches
  //     .open(cacheName)
  //     .then((cache) => {
  //       // 缓存应用所需的资源
  //       return cache.addAll(cacheAssets);
  //     })
  //     .then(() => self.skipWaiting())
  // );

});

// 激活Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== cacheName) {
            // 删除旧版本的缓存
            return caches.delete(name);
          }
        })
      );
    })
  );
});
