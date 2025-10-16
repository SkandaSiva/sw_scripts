self.addEventListener('install', function (e) {
  console.log('Service Worker 状态： install');
});
self.addEventListener('fetch', function (e) {
  console.log('Service Worker 状态： fetch');
});
self.addEventListener('activate', function (e) {
  console.log('Service Worker 状态： activate');
});