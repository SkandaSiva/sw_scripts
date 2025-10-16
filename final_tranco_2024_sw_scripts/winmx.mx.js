var cacheName = 'pc-v2'; 

// Installing Service Worker
// "https://legends.io/index.html"
self.addEventListener('install',  function (e) {
  e.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      console.log("CACHING /INDEX.HTML");
      let ok;
      try {
        ok = await cache.addAll(
          [
            '/index.html' // == https://legends.io
          ]
        );
      } catch (err) {
        console.log('err: cache.addAll');
      }
  
      return ok;
    })
  ); 
  console.log('[Service Worker] Install');   
});

self.addEventListener('activate', e => {
  console.log('Service Worker: Activated');
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// FETCH PROXY & CACHING
// 1.) try get resource from cache else fetch and update cache else --> error
self.addEventListener('fetch', function(event) {
  if (event.request.mode === 'navigate') {// 导航请求，通常意味着浏览器正在请求一个HTML文档
    // 如果是html 的请求，则不从缓存中获取响应
    event.respondWith(
      fetch(event.request)
    );
  } else {
    // 对于其他类型的请求，可以从缓存中获取响应
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});

self.addEventListener('push', function(event) {
  if (event.data) {
    var notificationData = event.data.json();
    var title = notificationData.title;
    var imageSmall = notificationData.imageSmall;
    var imageLarge = notificationData.imageLarge;
    // 跳转地址
    var url = notificationData.url;
    var actions = notificationData.actions;

    var options = {
      body: notificationData.body || notificationData.message,
      icon: imageSmall,
      image: imageLarge,
      badge: imageSmall,
      actions: actions,
      data: {
        url: url
      }
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

// 处理点击消息
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // 关闭推送通知
  // 获取推送通知的数据
  var notificationData = event.notification.data;
  // 获取要跳转的页面链接
  var targetPage = notificationData.url; // 假设推送通知的数据中包含了要跳转的页面链接
  // 执行页面跳转操作
  event.waitUntil(
      clients.openWindow(targetPage)
  );
});