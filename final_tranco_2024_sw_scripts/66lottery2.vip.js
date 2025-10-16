// 缓存的资源列表
const cacheName = 'my-site-cache';
const cacheAssets = [
  '/',
];

let errorUrls = {};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        console.log('caches open');
        return cache.addAll(cacheAssets);
      })
      .then(() => {
        console.log('Assets cache');
      })
      .catch((error) => {
        console.log('cache error:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
	// console.log("-------------------->", event.request.url);
	// 检查是否是 JS 文件请求
	if (event.request.url.endsWith('.js')) {
		const url = new URL(event.request.url);  // 统一 URL 解析
	
		// 检查请求的 URL 是否是目标 URL
		if (errorUrls[url.href] && errorUrls[url.href] >= 1) {
			// const backupSuffix = `.t.js`;
			
			const backupSuffix = `?t=` + errorUrls[url.href];
			// 生成备用 URL
			const backupUrl = `${url.pathname}${backupSuffix}`;
	
			event.respondWith(
				fetch(backupUrl)
			);
		} 
		// else {
		// 	// 对于其他请求，继续使用默认的处理方式
		// 	event.respondWith(
		// 	  fetch(event.request)
		// 	);
		// }
	} 
	// else {
	// 	event.respondWith(
	// 	  fetch(event.request)
	// 	);
	// }
});

self.addEventListener('activate', function (e) {
    console.log('SW Activate')
    e.waitUntil(
      caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== cacheName) {
            console.log('SW Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
    )
    return self.clients.claim()
  })
  
  self.addEventListener('message', (event) => {
    if (event.data.action === 'errorUrls') {
      // const { key, value } = event.data;
  	errorUrls = event.data.value
    }
  });