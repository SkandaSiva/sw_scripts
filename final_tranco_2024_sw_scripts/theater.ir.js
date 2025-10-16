//import config from './pwa/config.js'
//console.log('S.W. Ver.',config.ver)

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())

/*
self.addEventListener('install', e => {
	
	console.info('Service Worker install', new Date())
	
	if(navigator.onLine){
		e.waitUntil(
			caches.open(config.cacheName).then( cache => {
				cache.addAll(config.cacheFiles)
				self.skipWaiting()
			})
		)
	}
	
})

self.addEventListener('activate', e => {
	
	console.log('Service Worker Activate event', new Date())
	
	if(navigator.onLine){
		
		e.waitUntil(
			caches
			.keys()
			.then( keys => Promise.all( keys.map( k => {
					if(k != config.cacheName && k.indexOf('cache-v1-') == 0){
						return caches.delete(k)
					}else{
						return Promise.resolve()
					}
					self.clients.claim()
				}))
			)
		)
		
		//e.waitUntil( self.clients.claim() )
		
	}
	
})
*/

/*
self.addEventListener('message', e => {
	if(e.data.action==='skipWaiting')
		self.skipWaiting()
})
*/

/*
const notResponse = contentType => 
	new Response( contentType.includes('application/json') ? '[]' : '', {
		status: 200,
		statusText: 'OK',
		headers: {'Content-Type': contentType},
	})
*/

/*
self.addEventListener('fetch', async e => {
	let { headers, method, url, mode } = e.request
	let contentType = headers.get('Accept') || headers.get('Content-Type') || 'text/html'
	if(!(method=='GET' || (method=='POST' && contentType.includes('application/json')))) return
	let { pathname } = new URL(url)
	
	if(!url.startsWith(self.location.origin)) return
	
	if(navigator.onLine){
		return
	}else{
		
		await e.respondWith(
			
			caches
			.open(CACHENAME)
			.then( cache =>
				cache
				.match(e.request)
				.then( response => {
					return response || notResponse(contentType)
				})
				.catch( error => {
					console.error(error)
					return notResponse(contentType)
				})
			)
			
		)
	}
})
*/

/*
self.addEventListener('notificationclick', e => {
	
	console.log('On notification click: ', e.notification.tag)
	
	e.notification.close()
	
	// This looks to see if the current is already open and focuses if it is
	e.waitUntil(
	
		clients
		.matchAll({type:'window'})
		.then( clientList => {
			
			for(var i = 0; i < clientList.length; i++){
				var client = clientList[i]
				if(client.url == '/' && 'focus' in client){
					return client.focus()
				}
			}
			
			if(clients.openWindow){
				return clients.openWindow('/')
			}
			
		})
		
	)
	
})
*/

/*
self.addEventListener('push', e => {
	if(e.data){
		try{
			data = JSON.parse(e.data.text())
			
			e.waitUntil(
				self.registration.showNotification(
					'My Title',
					{
						body: 'Hello world!',
						icon: './favcion.png',
						badge: './favcion.png',
					},
				)
			)
			
		}catch(error){
			//console.error('push event data parse fail', error)
		}
	}
})
*/