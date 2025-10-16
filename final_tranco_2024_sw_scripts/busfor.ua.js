
self.importScripts('https://push.esputnik.com/service-worker.js');

// если Gravitec отключит push`ы то наш воркер для кэша не подключиться
// self.importScripts(new URL('/service-worker.js', location.origin));
// self.importScripts('/service-worker.js');
