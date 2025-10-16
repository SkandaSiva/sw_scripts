const cacheName = 'spa-cache-v1';

// 定义主域名和备用域名列表
var BACKUP_DOMAINS = [
  'https://7bslot.com',
  'https://777ganhar.com',
  'https://7bslota.com',
  'https://777rodadas.com',
  'https://7bslotl.com',
  'https://7bslot.net',
];
// 当前选定的域名
let activeDomain = '';
var ORIGINAL_DOMAIN;

// 安装 Service Worker 并缓存 index.html
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(async (cache) => {
      let ok;

      const cookieRes = await self.cookieStore.get('ORIGINAL_DOMAIN');
      ORIGINAL_DOMAIN = cookieRes?.value;
      try {
        ok = await cache.addAll(
          [
            // '/index.html' // == https://legends.io
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
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(async cacheNames => {
      // console.log('activate Caching app shell', ORIGINAL_DOMAIN, self);
      const cookieRes = await self.cookieStore.get('ORIGINAL_DOMAIN');
      ORIGINAL_DOMAIN = cookieRes?.value;
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
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.mode === 'navigate') {
    event.respondWith(handleRequest(event.request, url));
  }
});

async function handleRequest(request, url) {

  const cachedResponse = await caches.match(request);
  try {
    const cookieRes = await self.cookieStore.get('ORIGINAL_DOMAIN');
    let ORIGINAL_DOMAIN = cookieRes?.value;
    // 如果缓存中有匹配，则继续请求网络，并更新缓存
    return await fetchAndUpdateCache(request, ORIGINAL_DOMAIN, url);

  } catch (err) {
    if (cachedResponse) {
      console.log('匹配到了缓存', cachedResponse);

      return cachedResponse;
    }
    console.log('请求处理失败:', err);
    return new Response('Service Worker Error', { status: 500 });
  }
}

async function fetchAndUpdateCache(request, ORIGINAL_DOMAIN, url) {
  try {
    const networkResponse = await fetch(request);
    if (ORIGINAL_DOMAIN && ORIGINAL_DOMAIN !== url.origin && url.origin === self.location.origin) {
      await self.cookieStore.delete('ORIGINAL_DOMAIN');
    }
    return networkResponse;
  } catch (err) {
    console.log('主域名请求失败:', request.url);
    return await handleBackupDomain(request, ORIGINAL_DOMAIN, url);
  }
}

async function handleBackupDomain(request, ORIGINAL_DOMAIN, url) {
  if (ORIGINAL_DOMAIN && ORIGINAL_DOMAIN !== url.origin && url.origin === self.location.origin) {
    console.log('备用域名已切换', ORIGINAL_DOMAIN);
    const backupResponse = await judgeActiveDomain(ORIGINAL_DOMAIN, request);
    if (backupResponse) return backupResponse;
  }

  console.log('备用域名不可用');
  return await fetchFromBackup(request);
}

async function fetchFromBackup(request) {
  for (let domain of BACKUP_DOMAINS) {
    const response = await judgeActiveDomain(domain, request);
    if (response) return response;
  }
  return await fetchFromLatestBackupAddress(request);
}

async function judgeActiveDomain(url, originalRequest) {
  try {
    const newUrl = originalRequest.url.replace(self.location.origin, url);
    const newRequest = new Request(newUrl);
    const response = await fetch(newRequest);
    if (response.ok) {
      // 成功从备用域名获取资源，更新 activeDomain，将请求的html 存入缓存
      await self.cookieStore.set('ORIGINAL_DOMAIN', url)

      console.log('切换备用域名:', url);
      // 刷新界面
      return response.text().then(body => {
        let newBody = body.replace(/src="\.\//g, `src="${url}/`);
        newBody = newBody.replace(/href="\.\//g, `href="${url}/`);
        console.log('进入缓存策略');
        return new Response(newBody, {
          headers: response.headers
        });
      });

    } else {
      console.log(`Backup domain ${url} returned status: ${response.status}`);
    }
  } catch (error) {
    console.log(`Backup domain ${url} failed:`, error);
  }
}

async function fetchFromLatestBackupAddress(originalRequest) {
  const response = await fetch('https://raw.githubusercontent.com/190699038/pwa/refs/heads/main/pwa.json');
  if (response.ok) {
    const data = await response.json();
    if (data?.domains?.length) {
      BACKUP_DOMAINS = BACKUP_DOMAINS.concat(data.domains);
      for (let i = 0; i < BACKUP_DOMAINS.length; i++) {
        const cloneRequest = originalRequest.clone();
        const res = await judgeActiveDomain(BACKUP_DOMAINS[i], cloneRequest);
        if (res) return res;

        // if (res) {
        //   return caches.open(cacheName).then(cache => {
        //     cache.put(cloneRequest, res.clone());
        //     return res;
        //   });
        // }
      }
      throw new Error('备用域名请求失败');
    } else {
      console.log('Failed to fetch latest backup address.');
      throw new Error('备用域名请求失败');
    }
  }
}
self.addEventListener('push', function (event) {
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
self.addEventListener('notificationclick', function (event) {
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