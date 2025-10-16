const filesToCache = [];
console.log('hoge')
this.oninstall = (event) => {
  event.waitUntil(
    caches.open('v1').then(cache => cache.addAll(filesToCache))
      .then(_ => console.log('done'))
      .catch(err => console.log(err))
  )
}

const cacheForeverHostnames = [
  'cdn.rawgit.com',
  'cdnjs.cloudflare.com',
  'toolkitstatic.sekandocdn.net'
]

this.onfetch = (event) => {
  const url = new URL(event.request.url)
  const request = event.request
  const requestCopy = request.clone()
  const shouldCache = cacheForeverHostnames.indexOf(url.hostname) != -1
    || url.pathname.indexOf('/hashed-public/') == 0
  const fetchOptions = {}
  if(shouldCache) {
    fetchOptions['no-cors'] = true
  }
  event.respondWith(
    caches.open('v1')
      .then(cache => cache.match(event.request))
      .then(response => {
        if(!response) {
          return fetch(event.request,fetchOptions)
            .then(response => {
              if(shouldCache) {
                cacheResponse(request,response)
                return response.clone()
              }
              return response
            })
        }
        return response
      })
      .catch(err => {
        console.log(err)
        return fetch(requestCopy)
      })
  )
};

function cacheResponse(request,response) {
  return caches.open('v1')
    .then(cache => cache.put(request.url,response))
    .catch(err => {
      console.log(err)
    })
}