const CACHE_VERSION = 'wiki 1.0.6'
const SHELL_HEAD = `/wiki/wp-content/themes/new-flopsy/shell-head.html`
const SHELL_START = `/wiki/wp-content/themes/new-flopsy/shell-start.html`
const SHELL_END = `/wiki/wp-content/themes/new-flopsy/shell-end.html`
const OFFLINE_URL = `/wiki/wp-content/themes/new-flopsy/offline-page.html`
const STYLE = `/wiki/wp-content/themes/new-flopsy/assets/style.css`

self.addEventListener('install', event => {
    event.waitUntil( (async () => {
        const cache = await caches.open(CACHE_VERSION)
        await cache.addAll([
            new Request(SHELL_HEAD, {cache: 'reload'}),
            new Request(SHELL_START, {cache: 'reload'}),
            new Request(SHELL_END, {cache: 'reload'}),
            new Request(OFFLINE_URL, {cache: 'reload'}),
            new Request(STYLE, {cache: 'reload'}),
        ])
    })())
})

self.addEventListener('activate', event => {
    event.waitUntil( (async () => {

        // Enable navigation preload if it's supported.
        // if ('navigationPreload' in self.registration) {
        //     await self.registration.navigationPreload.enable()
        // }
        
        // Delete any caches that aren't in caches
        const cacheKeys = await caches.keys()
        cacheKeys.forEach(key => {
            if (key.includes('wiki') && key !== CACHE_VERSION) {
              return caches.delete(key)
            }
        })
        
        // Tell the active service worker to take control of the page immediately.
        self.clients.claim()

    })())
})

const createPageStream = async (request) => {
    
    const stream = new ReadableStream({
        
        start(controller) {
            
            // Get Cashes
            const headFetch = caches.match(SHELL_HEAD)
            const startFetch = caches.match(SHELL_START)
            const endFetch = caches.match(SHELL_END)
            
            // Get Body Part frome Server
            const url = new URL(request.url)
            url.searchParams.set('shell', 'body')

            const middleFetch = fetch(url).then(response => response)
            .catch( () => caches.match(OFFLINE_URL) )

            // Merge Streams
            const pushStream = (stream) => {
                const reader = stream.getReader()
                return reader.read()
                .then(process = (result) => {
                    if (result.done) return
                    controller.enqueue(result.value)
                    return reader.read().then(process)
                })
            }
      
            headFetch
            .then(response => pushStream(response.body))
            .then(() => startFetch)
            .then(response => pushStream(response.body))
            .then(() => middleFetch)
            .then(response => pushStream(response.body))
            .then(() => endFetch)
            .then(response => pushStream(response.body))
            .then(() => controller.close())
        }
    })
  
    return new Response(stream, {
      headers: {'Content-Type': 'text/html; charset=utf-8'}
    })
}

// Update App (Wait For User Trigger)
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})

self.addEventListener('fetch', event => {

    // if HTML page
    if (event.request.mode === 'navigate') {

        const url = new URL(event.request.url)
        
        // Skip if Shortlink Redirect
        if (url.searchParams.get('p')) return

        event.respondWith( (async () => {

            try {
                // Respond from the cache (page cache)
                // const cachedResponse = await caches.match(event.request)
                // if (cachedResponse) return cachedResponse

                // Else, Respond from the cache (header, footer) and fetch body
                // Home, Category, Article Pages
                if (/^\/wiki\/(?!.*?wp-)[a-z0-9-%?\/]*?$/.test(url.pathname)) {
                    const cachedResponse = await createPageStream(event.request)
                    if (cachedResponse) return cachedResponse
                }

                // Else, use the preloaded response
                // const preloadResponse = await event.preloadResponse
                // if (preloadResponse) return preloadResponse

                // Else try the network.
                const networkResponse = await fetch(event.request)
                return networkResponse;
            
            } catch (error) {
                console.log('Fetch failed; returning offline page instead.', error);

                // const cachedResponse = await caches.match(OFFLINE_URL)
                // return cachedResponse
            }

        })())
    }
})