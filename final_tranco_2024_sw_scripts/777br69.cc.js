// service-worker.js

self.addEventListener('install', event => {
    console.log('Service worker installed.');
  });
  
  self.addEventListener('activate', event => {
    console.log('Service worker activated.');
  });
  
  self.addEventListener('fetch', event => {
    // 可以在这里实现缓存策略，但这里仅作示例，不进行任何操作
  });
  
  // 可选：发送消息通知页面Service Worker已经准备就绪
  self.addEventListener('statechange', () => {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'SERVICE_WORKER_READY'
        });
    }
  });