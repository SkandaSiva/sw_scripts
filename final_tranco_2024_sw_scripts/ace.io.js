/* eslint-disable-next-line no-restricted-globals */
let sw = self
const setLoginCache = (cache, value) => {
  cache.put(
    new Request('/islogin.json'),
    new Response(JSON.stringify({ isLogin: value }))
  )
}

const checkIsLogin = () =>
  caches.open('v1').then(async cache => {
    const writeRequestToCache = async () => {
      const result = await cache.match('/islogin.json')
      return result.json()
    }
    return (await writeRequestToCache()).isLogin
  })

sw.addEventListener('push', event => {
  const data = event.data.json()

  event.waitUntil(
    sw.registration.showNotification(data.notification.title, {
      body: data.notification.body,
      icon: '/favicon.png',
      data: data.data.type ?? 'else',
    })
  )
})

sw.addEventListener('fetch', event => {
  event.waitUntil(
    caches.open('v1').then(cache => {
      const reqUrl = event.request.url
      if (
        reqUrl.endsWith('banner') ||
        reqUrl.includes('loginGAFirst') ||
        reqUrl.includes('personalInfo') ||
        reqUrl.includes('register')
      ) {
        let isLogin = event.request.headers.get('uid') ? true : false
        setLoginCache(cache, isLogin)
      } else if (reqUrl.endsWith('logout')) {
        setLoginCache(cache, false)
      }
    })
  )
})

sw.addEventListener('notificationclick', async event => {
  const tag = event.notification.data ?? ''
  event.notification.close()
  const { clients } = sw

  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: 'window',
      })
      .then(async clientList => {
        let redirectUrl = ''

        if (await checkIsLogin()) {
          if (tag.includes('trade')) {
            redirectUrl = '/orders/history'
          } else if (
            tag === 'kyc_failed_B' ||
            tag === 'kyc_attachment_replenish'
          ) {
            redirectUrl = '/user/bank'
          } else if (tag.includes('kyc')) {
            redirectUrl = '/user/kyc'
          } else if (tag.includes('vip_grade_change')) {
            redirectUrl = '/user/vip'
          } else if (tag.includes('vip_fee_back') || tag.includes('airdrop')) {
            redirectUrl = '/wallet/asset-changes/reward'
          } else if (tag.includes('price_alert')) {
            const ctRel = event.notification.title.split(' ')[0] ?? ''
            redirectUrl = `/trade/${ctRel}`
          } else {
            redirectUrl = '/'
          }
        } else {
          redirectUrl = '/login'
        }

        for (const client of clientList) {
          if (client.url.includes(redirectUrl) && 'focused' in client)
            return client.focus()
        }
        if (clients.openWindow) return clients.openWindow(redirectUrl)
      })
  )
})
