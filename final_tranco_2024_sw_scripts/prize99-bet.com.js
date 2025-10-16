let CACHE_NAME = "cache-v-";
const URLS_TO_CACHE = [
  '/js/',
  // 在这里添加你需要缓存的其他资源
];
let NODE_ENV = '';

// function createCacheName() {
//   return fetch("/build.json?v=" + new Date().getTime().toString(), {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Data received:', data);
//       if (data && data.build_time) {
//         CACHE_NAME += data.build_time
//       }
//       return data;
//     })
// }

self.addEventListener('message', event => {
  // console.log('event.data=>', event.data)
  // if (event.data.type === 'CLEAR_CACHE') {
  //   // 清空所有缓存
  // }
  // if (event.data.type === 'NODE_ENV') {
  //   NODE_ENV = event.data.data || ''
  // }
});
self.addEventListener("install", async (event) => {
    // event.waitUntil(
    //   createCacheName().then(() => {
    //     caches.open(CACHE_NAME).then((cache) => {
    //       console.log('Opened cache');
    //       return cache.addAll(URLS_TO_CACHE);
    //     })
    //   })
    // );
});

self.addEventListener("fetch", (event) => {
  // 检查请求的 URL 是否匹配 .js 或 .css 后缀
  // const requestUrl = new URL(event.request.url);
  // // prod 下 针对主站js css 缓存
  // if (!self.location.origin.includes('localhost:')
  //   && requestUrl.origin === self.location.origin
  //   && (requestUrl.pathname.endsWith('.js') || requestUrl.pathname.endsWith('.css'))) {
  //     // 处理缓存
  //     event.respondWith(
  //         caches.match(event.request)
  //             .then(function(response) {
  //                 if (response) {
  //                     return response; // 如果找到匹配的缓存，则返回缓存内容
  //                 }

  //                 // 如果没有缓存，执行网络请求并缓存请求的响应
  //                 return fetch(event.request).then(function(networkResponse) {
  //                   //  networkResponse.status = 304;
                   
  //                   //  let status = 304;
  //                     // 检查响应是否有效
  //                     if (!networkResponse || (networkResponse.status !== 200 && networkResponse.status !== 304) || networkResponse.type !== 'basic') {
  //                         return networkResponse;
  //                     }

  //                     // 克隆响应，以便同时使用和缓存
  //                     console.log('克隆响应，以便同时使用和缓存')
  //                     const responseToCache = networkResponse.clone();
  //                     caches.open(CACHE_NAME)
  //                         .then(function(cache) {
  //                             cache.put(event.request, responseToCache); // 将响应放入缓存
  //                         });

  //                     return networkResponse; // 返回网络请求的响应
  //                 });
  //             })
  //     );
  //   }

});

self.addEventListener('activate', event => {
  // const cacheWhitelist = [CACHE_NAME]; // 保留当前的缓存名称
  // event.waitUntil(
  //   caches.keys().then(function (cacheNames) {
  //     return Promise.all(
  //       cacheNames.map(function (cacheName) {
  //         if (cacheWhitelist.indexOf(cacheName) === -1) {
  //           return caches.delete(cacheName); // 删除旧的缓存
  //         }
  //       })
  //     );
  //   })
  // );
})

// 监听 push 事件
self.addEventListener('push', async function (e) {
  if (!e.data) {
    return
  }
  // 解析获取推送消息
  let payload = e.data.text()
  payload = JSON.parse(payload);
  // 根据推送消息生成桌面通知并展现出来
  //{"user_sid":10086000000243,"title":"11111","body":"1111111","icon":"/file/c4a6c07a8a2d7c804a5776d9d039428a_20240808234712.png"}
  const res = await getDataFromIndexedDB('userInfo');
  if (!res) return;

  if (res.data?.sid !== String(payload.user_sid)) return;

  const doMainRes = await getDataFromIndexedDB('domain');

  if (doMainRes) {
    payload.icon = doMainRes.data.webHotUpdateUrl + payload.icon;
  }


  let promise = self.registration.showNotification(payload.title, {
    body: payload.body,
    icon: payload.icon,
    vibrate: [200, 100, 200, 100, 200],
    // data: {
    //   url: payload.url || ''
    // }
  })
  e.waitUntil(promise)
})

// 监听通知点击事件
self.addEventListener('notificationclick', function (e) {
  // 关闭窗口
  e.notification.close()
  // 打开网页
  // e.waitUntil(self.clients.openWindow(e.notification.data.url))
  e.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(function (clientList) {
      // 遍历所有的客户端窗口，如果找到当前网站的窗口，则聚焦它。
      // for (const i = 0; i < clientList.length; i++) {
      //   const client = clientList[i];
      //   if ('focus' in client) {
      //     return client.focus();
      //   }
      // }
      // 如果没有找到当前网站的窗口，则使用clients.openWindow方法打开一个新的窗口。
      if (self.clients.openWindow) {
        return self.clients.openWindow('/?hideTopDownload=1');
      }
    })
  );
})

async function clearCaches() {
  const cacheNames = await caches.keys(); // 获取所有缓存名称

  // 逐一删除所有缓存
  return Promise.all(
    cacheNames.map(cacheName => {
      return caches.delete(cacheName);
    })
  );
}

function saveDataToIndexedDB(key, data) {
  const request = indexedDB.open('commonDb', 1);

  request.onupgradeneeded = event => {
    const db = event.target.result;
    const store = db.createObjectStore('dataStore', { keyPath: 'id' });
  };

  request.onsuccess = event => {
    const db = event.target.result;
    const transaction = db.transaction('dataStore', 'readwrite');
    const store = transaction.objectStore('dataStore');

    store.put({ id: key, data: data });
  };

  request.onerror = event => {
    console.error('Error opening IndexedDB', event.target.error);
  };
}

function getDataFromIndexedDB(key) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('commonDb', 1);

    request.onsuccess = event => {
      const db = event.target.result;
      const transaction = db.transaction('dataStore', 'readonly');
      const store = transaction.objectStore('dataStore');

      const getRequest = store.get(key);
      getRequest.onsuccess = event => {
        const data = event.target.result;
        resolve(data);
      };
    };

    request.onerror = event => {
      console.error('Error opening IndexedDB', event.target.error);
      reject(event.target.error);
    };
  });
}