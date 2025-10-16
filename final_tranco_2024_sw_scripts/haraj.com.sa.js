/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable sonarjs/no-duplicate-string */
self.addEventListener('push', (event) => {
  try {
    return event.waitUntil(
      self.registration.pushManager
        .getSubscription()
        .then(function (subscription) {
          if (subscription.endpoint) {
            const headers = {
              'Content-Type': 'text/plain; charset=utf-8'
            }

            const endpoint = subscription.endpoint
            const query = `{
  					webNotification(subscription:"${endpoint}") {
  						body
  						icon
  						type
  						related_title
  						related_user
  						related_ads_num
  						pay_value
  						status
  						date
  					}
  				}`

            return fetch(
              'https://graphql.haraj.com.sa/?queryName=webNotification',
              {
                method: 'POST',
                body: JSON.stringify({ query }),
                headers
              }
            )
              .then((res) => res.json())
              .then((resp) => {
                let title = 'لديك إشعار جديد'
                let notfBody = {
                  body: '',
                  icon: 'https://betacdn.haraj.com.sa/assets/images/256_icon.png',
                  badge: 'https://betacdn.haraj.com.sa/assets/images/badge.png'
                }
                if (
                  resp &&
                  resp.data &&
                  resp.data.webNotification &&
                  resp.data.webNotification.body
                ) {
                  const info = {
                    title:
                      resp.data.webNotification.related_title ||
                      'لديك إشعار جديد',
                    body: resp.data.webNotification.body,
                    icon: resp.data.webNotification.icon,
                    extra: {
                      related_user: resp.data.webNotification.related_user,
                      related_ads_num:
                        resp.data.webNotification.related_ads_num,
                      pay_value: resp.data.webNotification.pay_value,
                      status: resp.data.webNotification.status,
                      date: resp.data.webNotification.date,
                      type: resp.data.webNotification.type
                    }
                  }
                  if (info.title) {
                    title = info.title
                  }
                  notfBody = {
                    body: info.body || '',
                    icon:
                      info.icon ||
                      'https://betacdn.haraj.com.sa/assets/images/256_icon.png',
                    badge:
                      'https://betacdn.haraj.com.sa/assets/images/badge.png',
                    data: info
                  }
                }
                return event.waitUntil(
                  self.registration.showNotification(title, notfBody)
                )
              })
              .catch((error) => {
                const title = 'لديك إشعار جديد'
                const body = {
                  body: '',
                  icon: 'https://betacdn.haraj.com.sa/assets/images/256_icon.png',
                  badge: 'https://betacdn.haraj.com.sa/assets/images/badge.png'
                }
                console.warn(error)
                return event.waitUntil(
                  self.registration.showNotification(title, body)
                )
              })
          } else {
            const title = 'لديك إشعار جديد'
            const body = {
              body: '',
              icon: 'https://betacdn.haraj.com.sa/assets/images/256_icon.png',
              badge: 'https://betacdn.haraj.com.sa/assets/images/badge.png'
            }
            return event.waitUntil(
              self.registration.showNotification(title, body)
            )
          }
        })
    )
  } catch (error) {
    console.log(error)
  }
})

self.addEventListener('install', function (event) {
  self.skipWaiting()
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          return caches.delete(cacheName)
        })
      )
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  // console.log({ event })
  const url =
    event.notification.data &&
    event.notification.data.extra &&
    event.notification.data.extra.type === 'replay_ads' &&
    event.notification.data.extra.related_ads_num
      ? '/11' + event.notification.data.extra.related_ads_num
      : '/note.php'
  event.notification.close()
  event.waitUntil(clients.openWindow(url))
})
