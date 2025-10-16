importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.2.4/workbox-sw.js');

workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("push", (event) => {
  const { title, body, url, tag } = event.data.json();
  const options = {
    body,
    data: { url }, // 리다이렉트 URL을 알림 데이터에 추가
    badge: '/bubble_logo.png',
    tag
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { url } = event.notification.data;
  if (url) {
    event.waitUntil(
      clients.openWindow(url) // 클릭 시 리다이렉트 수행
    );
  }
});