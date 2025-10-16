

// cache名, 在控制台Application的CaChe下可以看到
const CACHE_NAME = "penueling";

const OFFLINE_URL = '#offline#';

// cache文件
const cacheFiles = ["/index.html", "/manifest.webmanifest"];

var offlineExclude = [
  '/api/',
];
/**
 * 安装 Service Worker
 * install事件是 Service Worker 执行的第一个事件，同一个 Service Worker 只会调用一次
 * 即使 Service Worker 脚本文件只有一个字节不同，浏览器也将视为一个新的 Service Worker
 */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
    })
  );

  self.skipWaiting().then();
});

/**
 * 激活 Service Worker
 * Service Worker 安装成功之后,会触发activate事件
 * 在这个阶段我们一般做一些清理旧缓存相关的工作
 */
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((name) => {
        if (!cacheWhitelist.includes(name)) {
          return caches.delete(name);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  // console.log(event, 'eeeeeeeeee')
  if (event.request.method !== 'GET') {
    return;
  }
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return false
  }
  for (let i = 0; i < offlineExclude.length; i++) {
    if (event.request.url.indexOf(offlineExclude[i]) !== -1) return false;
  }
  var u = event.request.url.replace('https://', '')


  var n = u.indexOf('/')
  if (u.slice(n, 60).indexOf('.') == -1) {
    return false;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});