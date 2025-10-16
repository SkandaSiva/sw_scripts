//首先是异常处理
self.addEventListener('error', function (e) {
  self.clients.matchAll().then(function (clients) {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: 'ERROR',
        msg: e.message || null,
        stack: e.error ? e.error.stack : null,
      })
    }
  })
})

self.addEventListener('unhandledrejection', function (e) {
  self.clients.matchAll().then(function (clients) {
    if (clients && clients.length) {
      clients[0].postMessage({
        type: 'REJECTION',
        msg: e.reason ? e.reason.message : null,
        stack: e.reason ? e.reason.stack : null,
      })
    }
  })
})

var workbox = (function () {
  'use strict'
  try {
    self.workbox.v['workbox:sw:3.3.0'] = 1
  } catch (t) {}
  const t = {
    backgroundSync: 'background-sync',
    broadcastUpdate: 'broadcast-cache-update',
    cacheableResponse: 'cacheable-response',
    core: 'core',
    expiration: 'cache-expiration',
    googleAnalytics: 'google-analytics',
    precaching: 'precaching',
    rangeRequests: 'range-requests',
    routing: 'routing',
    strategies: 'strategies',
    streams: 'streams',
  }
  return new (class {
    constructor() {
      return (
        (this.v = {}),
        (this.t = {
          debug: 'localhost' === self.location.hostname,
          modulePathPrefix: null,
          modulePathCb: null,
        }),
        (this.e = this.t.debug ? 'dev' : 'prod'),
        (this.s = !1),
        new Proxy(this, {
          get(e, s) {
            if (e[s]) return e[s]
            const o = t[s]
            return o && e.loadModule(`workbox-${o}`), e[s]
          },
        })
      )
    }
    setConfig(t = {}) {
      if (this.s)
        throw new Error('Config must be set before accessing workbox.* modules')
      Object.assign(this.t, t), (this.e = this.t.debug ? 'dev' : 'prod')
    }
    skipWaiting() {
      self.addEventListener('install', () => self.skipWaiting())
    }
    clientsClaim() {
      self.addEventListener('activate', () => self.clients.claim())
    }
    loadModule(t) {
      const e = this.o(t)
      try {
        importScripts(e), (this.s = !0)
      } catch (s) {
        throw (console.error(`Unable to import module '${t}' from '${e}'.`), s)
      }
    }
    o(t) {
      if (this.t.modulePathCb) return this.t.modulePathCb(t, this.t.debug)
      let e = ['https://storage.googleapis.com/workbox-cdn/releases/3.3.0']
      const s = `${t}.${this.e}.js`,
        o = this.t.modulePathPrefix
      return (
        o &&
          '' === (e = o.split('/'))[e.length - 1] &&
          e.splice(e.length - 1, 1),
        e.push(s),
        e.join('/')
      )
    }
  })()
})()

if (workbox) {
  workbox.setConfig({ debug: false })

  //直接激活跳过等待阶段
  workbox.skipWaiting()
  workbox.clientsClaim()
  //定义要缓存的html
  var cacheList = ['/', 'html', ]
  //html采用networkFirst策略，支持离线也能大体访问
  workbox.routing.registerRoute(
    function (event) {
      // 需要缓存的HTML路径列表
      if (~cacheList.indexOf(event.url.pathname)) return true
      return false
    },
    workbox.strategies.networkFirst({
      cacheName: 'creality:html',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 10,
        }),
        new workbox.expiration.Plugin({
          maxAgeSeconds: 12 * 60 * 60,
        })
      ],
    })
  )

  //静态资源采用staleWhileRevalidate策略，安全可靠

  workbox.routing.registerRoute(
    (event) => {
      const pathname = event.url.pathname
      if (pathname.startsWith('/_nuxt/')) {
        return true
      }
      return false
    },
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'creality:assets',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 12 * 60 * 60,
        }),
        {
          cacheWillUpdate: async ({response}) => {
            // 如果响应的 Vary 头包含 *, 跳过缓存
            if (response.headers.get('Vary') === '*') {
              return null;
            }
            if (response && response.status === 200) {
              return response;
            }
            return null;
          }
        }
      ],
    })
  )


  workbox.routing.registerRoute(
    function (event) {
      const pathname = event.url.pathname
      // const request = event.event.request
      if (pathname.match(/\.(woff|woff2|ttf|eot)$/)) {
        return true
      }
      return false
    },
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'creality:file',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 20,
          maxAgeSeconds: 12 * 60 * 60,
        }),
        {
          cacheWillUpdate: async ({response}) => {
            // 如果响应的 Vary 头包含 *, 跳过缓存
            if (response.headers.get('Vary') === '*') {
              return null;
            }
            if (response && response.status === 200) {
              return response;
            }
            return null;
          }
        }
      ],
    })
  )

  workbox.routing.registerRoute(
    function (event) {
      const pathname = event.url.pathname
      if (pathname.match(/\.(wasm)$/)) {
        return true
      }
      return false
    },
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'creality:wasm',
      plugins: [
        new workbox.expiration.Plugin({
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  )
    //图片采用cacheFirst策略，提升速度
  workbox.routing.registerRoute(
    (event) => {
      const request = event.event.request
      return request.destination === 'image'
    },
    workbox.strategies.cacheFirst({
      cacheName: 'creality:img',
      networkTimeoutSeconds: 5,
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  )
 
  workbox.routing.registerRoute(
    function (event) {
      const pathname = event.url.pathname
      if (pathname.match(/\.(wav|mp3|mp4)$/)) {
        return true
      }
      return false
    },
    workbox.strategies.cacheFirst({
      cacheName: 'creality:video',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [200],
        }),
        new workbox.expiration.Plugin({
          maxEntries: 10,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        }),
      ],
    })
  )
  
} else {
  console.log('workbox加载失败')
}
