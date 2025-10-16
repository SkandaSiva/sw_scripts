self.addEventListener("install", function (event) {
   event.waitUntil(self.skipWaiting())
});

self.addEventListener("activate", function (event) {
   event.waitUntil(self.clients.claim())
});

self.addEventListener('push', function (event) {
  if (self.Notification && "granted" === self.Notification.permission) {
      const payload = event.data ? event.data.json() : null
      console.log(payload)
      if(payload) {
         event.waitUntil(self.registration.showNotification(payload.title, payload).then(() => {
            fetch(
               `${payload.data.host}/front/popup`,
               {
                  method:'PUT',
                  body:JSON.stringify({ subscription_code: payload.data.subscription_code, trance_id: payload.data.trance_id }),
                  headers:{
                     'Content-Type':'application/json',
                  }
               }
            ).then(res => {
            })
         }))
      }
  }
});

self.addEventListener('notificationclick', function (e) {
   const action = e.action;
   const { link, host, subscription_code, urls, event_step_id, event_id, trance_id } = e.notification.data
   if (!action) {
      e.waitUntil(clients.openWindow(link))
   } else {
      e.waitUntil(clients.openWindow(urls[action]))
   }

   e.notification.close()

   fetch(
      `${host}/front/click`,
      {
         method:'PUT',
         body:JSON.stringify({
            subscription_code,
            event_step_id,
            event_id,
            trance_id,
         }),
         headers:{
            'Content-Type':'application/json',
         }
      }
   ).then(res => {
         console.log('webpush点击事件统计接口响应')
         if (res.code === 0) {
            console.log('webpush点击事件统计成功')
         }
   })
});