const VERSION = 'v1'; 

self.addEventListener('install',event=>{
    console.log('sw inwstalled');
    event.waitUntil(precache())
})

self.addEventListener('fetch', event=>{
    return
})

async function precache(){
    const cache = await caches.open(VERSION)
    return cache.addAll([
    ])
}