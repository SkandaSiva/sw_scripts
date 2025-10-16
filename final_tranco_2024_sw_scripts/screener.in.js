/* global clients */
// self is global scope of service worker:
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope
// https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/self

(function () {
  function listenToPush () {
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    self.addEventListener('push', function (event) {
      var data = event.data.text()
      data = JSON.parse(data)
      self.registration.showNotification(data.title, data.options)
    })
  }

  function listenToNotificationClick () {
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/onnotificationclick
    // https://developer.mozilla.org/en-US/docs/Web/API/Notification
    self.addEventListener('notificationclick', function (event) {
      var url = event.notification.data
      if (event.action === 'close') {
        event.notification.close()
      } else {
        clients.openWindow(url)
        event.notification.close()
      }
    })
  }

  function listenPwaRequests () {
    // pass-through it not recommended
    // https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading
    // it also breaks "export to excel" downloads on Safari
    self.addEventListener('fetch', function (event) {
      event.respondWith(fetch(event.request))
    })
  }

  function installImmediately () {
    // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/oninstall
    self.addEventListener('install', function (event) {
      console.log('installing new service-worker without waiting')
      self.skipWaiting();
    })
  }


  function setupServiceWorker () {
    listenToPush()
    listenToNotificationClick()
    // listenPwaRequests()
    installImmediately()
  }

  setupServiceWorker()
})()
