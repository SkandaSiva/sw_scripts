/* eslint no-restricted-globals: 1 */
/* eslint no-undef: 1 */
const SERVICE_WORKER_VERSION = 1

// Cache Identifiers
const CACHE_BUILD = 'buildCache'
const CACHE_FONT = 'fontCache'
const CACHE_RUNTIME = 'runtimeCache'
// const CACHE_THUMB = 'thumbCache'
// const CACHE_RFK = 'rfkCache'

// IndexDB identifiers
const STORE_VERSION = 1
const STORE_RELEASES = 'sw-releases'

const RUNTIME_CACHE_DURATION = 1000 * 60 * 60 * 24 * 7

const dbVersion = 1

// Global reference to indexeddb reference
let DB = null

// Print log messages
const DEBUG = false

// The shell is used to render the actual document request using the serviceworker. ONLY_SPA must be set to FALSE for this to work.
const SHELL_ENABLED = false

// Only use the service worker for static assets and precaching
const ONLY_SPA = true

const RELEASES_TO_KEEP = 2

const log = DEBUG ? console.log : () => {
}

console.log(`Rogue Service Worker: v${SERVICE_WORKER_VERSION}.${STORE_VERSION}`)

/**
 * DB code - store timeouts for cached responses, so we can expire them
 */

const openDB = () => new Promise((resolve, reject) => {
  const req = indexedDB.open('rogueDB', dbVersion)
  req.onerror = (err) => {
    DB = null
    reject(err)
  }
  req.onupgradeneeded = (ev) => {
    const db = ev.target.result
    if (!db.objectStoreNames.contains('sw-releases')) {
      db.createObjectStore('sw-releases', { keyPath : 'id' })
    }
  }
  req.onsuccess = (ev) => {
    DB = ev.target.result
    resolve(DB)
  }
})

// Convenience method to read an item in indexeddb
const getFromDB = async (store, key) => {
  const db = DB || await openDB()

  return new Promise((resolve, reject) => {
    const txn = db.transaction(store).objectStore(store).get(key)
    txn.onsuccess = evt => resolve(evt.target.result)
    txn.onerror = err => reject(err)
  })
}

// Convenience method to read an item in indexeddb
const getAllFromDB = async (store) => {
  const db = DB || await openDB()

  return new Promise((resolve, reject) => {
    const txn = db.transaction(store).objectStore(store).getAll()
    txn.onsuccess = evt => resolve(evt.target.result)
    txn.onerror = err => reject(err)
  })
}

// Convenience method to set an item in indexeddb
const setInDb = async (store, val) => {
  const db = DB || await openDB()

  return new Promise((resolve, reject) => {
    const txn = db.transaction([store], 'readwrite').objectStore(store).add(val)
    txn.onsuccess = evt => resolve(evt.target.result)
    txn.onerror = err => reject(err)
  })
}

// Convenience method to set an item in indexeddb
const deleteInDb = async (store, key) => {
  const db = DB || await openDB()

  return new Promise((resolve, reject) => {
    const txn = db.transaction([store], 'readwrite').objectStore(store).delete(key)
    txn.onsuccess = () => resolve()
    txn.onerror = err => reject(err)
  })
}

async function cacheBuildFiles(releaseHash) {
  // If this release is already in the indexeddb, we dont need to cache anything new
  let release = await getFromDB(STORE_RELEASES, releaseHash)
  const cache = await caches.open(CACHE_BUILD)

  if (!release) {
    log(`Service worker downloading precache files for new release ${releaseHash}`)
    const precacheResp = await fetch(`/svc_spa/precache.json?release=${releaseHash}`)
    const files = await precacheResp.json()
    const withOrigin = files.map(f => `${location.origin}${f}`)

    release = { id : releaseHash, files : withOrigin, ts : Date.now() }

    await setInDb(STORE_RELEASES, release)

    if (SHELL_ENABLED) {
      const homepage = await fetch('/')

      const text = await homepage.clone().text()
      if (text.indexOf(releaseHash) !== -1) {
        log(`Downloaded new homepage for ${releaseHash}`)
        await cache.put('homepage', homepage)
      }
    }
  }

  // Find all the currently cached build files
  const alreadyCached = (await cache.keys()).map(key => key.url)

  // Find any new assets that need to be preloaded & cached
  const toCache = release.files.filter(f => alreadyCached.indexOf(f) === -1)

  if (toCache.length) {
    log(`Caching ${toCache.length} new files for ${releaseHash}`, toCache)
    await cache.addAll(toCache)

    await cleanBuildCache()
  }
}

async function cleanBuildCache() {
  const cache = await caches.open(CACHE_BUILD)

  // Find all the currently cached build files
  const alreadyCached = (await cache.keys()).map(key => key.url)

  // Clean up old release files not used by the last two releases
  getAllFromDB(STORE_RELEASES).then(releases => {
    const recentFiles = []

    log(`Found ${releases.length} releases`)

    releases.sort((a, b) => b.ts - a.ts)
      .slice(0, RELEASES_TO_KEEP)
      .forEach(release => release.files.forEach(file => recentFiles.push(file)))

    const oldFiles = alreadyCached.filter(f => recentFiles.indexOf(f) === -1)

    if (oldFiles.length) {
      log(`Deleting ${oldFiles.length} old release files`)
    }

    // Find any existing resources that we dont need anymore - we can remove these from the build cache (and move to "deprecated" cache)
    oldFiles.forEach(toDeprecate => cache.delete(toDeprecate))
  }).catch(err => {
    log('Error cleaning up releases', err)
  })
}

async function handleFetch(req) {
  const cached = await caches.match(req)
  let targetCache

  if (req.url.match(/\/svc_spa\/fonts/)) {
    targetCache = CACHE_FONT
  } else if (req.url.match(/\/svc_spa\//i)) {
    // Cache build files, but not the hash or precache files used for heartbeat
    targetCache = CACHE_RUNTIME
  }

  let expired = false

  if (cached) {
    if (targetCache === CACHE_RUNTIME && cached.headers.has('date')) {
      const cacheDate = new Date(cached.headers.get('date'))
      expired = cacheDate.getTime() < Date.now() - RUNTIME_CACHE_DURATION
    }

    // If it is expired, we will try to get a new resource - and if it fails, return the expired one
    if (!expired) {
      return cached
    }
    log('Runtime cache expired for ' + req.url)
  }

  if (SHELL_ENABLED && req.destination === 'document' && (req.url === location.origin || req.url === `${location.origin}/`)) {
    log(`Document request for ${req.url}`)
    const indexResult = await caches.match('homepage')
    console.log('Homepage result', indexResult)

    if (indexResult) {
      return indexResult
    }
  }

  const isCOR = !req.url.startsWith(location.origin)

  const networkResp = await fetch(req, isCOR ? { credentials : 'omit', mode : 'cors' } : undefined)

  if (networkResp.ok) {
    if (targetCache) {
      caches.open(targetCache).then(cache => cache.put(req, networkResp))
      return networkResp.clone()
    }
  } else {
    // If we had a stale response in the cache, we can still return it
    log('Returning expired resource for ' + req.url)
    return cached
  }

  return networkResp
}

async function handleMessage(ev) {
  // Message from the SPA
  if (ev.data.type === 'PRELOAD_RELEASE') {
    await cacheBuildFiles(ev.data.releaseHash)
  } else {
    log('Unknown key')
  }
}

self.addEventListener('install', () => {
  // Our install DOESNT precache build files - this is so we can do a graceful reload
  log('Installing service worker')
  self.skipWaiting()
})

self.addEventListener('activate', () => {
  log('Activating service worker')
  // We want to claim any un-workered pages
  clients.claim()
  // Create the database if necessary
  openDB()
})

self.addEventListener('fetch', ev => {
  const url = ev.request.url

  // Dont mess with cors requests...
  if (!url.startsWith(location.origin)) {
    return
  }

  // For now only match svc_spa routes
  if (!url.match(/svc_spa\//i) || url.match(/\/svc_spa\/precache.json/)) {
    return
  }

  // Also dont cache the main document
  if (!SHELL_ENABLED && ev.request.destination === 'document') {
    return
  }

  // The handleFetch method will take care of fetches
  ev.respondWith(handleFetch(ev.request))
})

self.addEventListener('message', (ev) => {
  // the handleMessage function will take care of messages
  ev.waitUntil(handleMessage(ev))
})
