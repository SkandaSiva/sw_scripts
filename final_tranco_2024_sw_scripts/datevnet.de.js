const worker = self
let pageName
let referrer
var appData = {
    extensions: ['doc', 'docx', 'mw', 'ppt', 'rtf', 'swf', 'txt', 'png', 'jpg', 'css', 'svg', 'js', 'json', 'woff']
}

// Service Worker Installation
const onInstall = (event) => {
    console.info('INSTALL');
    event.waitUntil(worker.skipWaiting());
}

// Worker Activation
const onActive = (event) => {
    console.info('ACTIVE');
    event.waitUntil(async () => {
        self.clients.claim();
        if (worker.registration.navigationPreload) {
             await worker.registration.navigationPreload.enable();
        }
    })
}

const onFetch = (event) => {
    // console.info('FETCH', event)
    if (isSpecialExtension(event.request.url, appData.extensions)) {
        return false
    }
    if (event.request.url.includes("/ep-search-backend/")) {
      event.respondWith(
        (async function () {
            if (event.request != undefined && event.request.mode == 'cors' && event.request.method == 'POST' && isSearchRequest(event.request.url)) {
                // TODO track hit = 0
                let clonedBody = await event.request.clone().json();
                const searchKey = buildSearchURL(clonedBody)
                var searchUrl = ""
                if (searchKey.includes("DATEV-Shop")) {
                   searchUrl = "/web/de/datev-shop/?"
                } else if (searchKey.includes("DATEV-Marktplatz")) {
                    searchUrl = "/web/de/m/marktplatz/?"
                } else {
                    searchUrl = "/web/de/suche/?"
                }
               
                const state = await worker.registration.navigationPreload.getState()
                const url = new URL(event.request.url)
                const requestURL =  getTrackingRequestUrl(event.request.url)
                const hId = state.headerValue.split(';')
                const requestBody = {
                    "pageName": pageName, 
                    "url":  hId[2]? hId[2] + searchUrl : searchUrl,
                    "referrer": referrer, 
                    "visitorId": hId[1]? hId[1] : "undefined",
                    "server": hId[2]? hId[2].slice(8) : "www.datev.de",
                    "previousPage": hId[0]? hId[0] : "undefined",
                    "searchKeyword": clonedBody.Query,
                    "action": "Internal search"
                }
                //  console.log("request body in service worker: ", requestBody);
                //  console.log("Send request to tracking server: " + requestURL);
                sendTrackingData(requestURL, requestBody)
                //    .then(response => console.log("Tracking by service worker: " + response.status))
                   .catch(error => console.log("Tracking request with error", error))
            }
           
            return fetch(event.request)     
    })())
   } else {
    return false
  }
}

function isSpecialExtension(url, extensionsArray) {
    var extension = getExtensionFromUrl(url);
    if (extension === '') {
      return false;
    } else {
      if (extensionsArray.indexOf(extension) === -1) {
        return false;
      } else {
        return true;
      }
    }
  } 
  
function getExtensionFromUrl (url) {
    var extension = '';
    var pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
    if (url.match(pattern) && url.match(pattern)[1]) {
       extension = url.match(pattern)[1];
    }
    return extension;
  }

async function sendTrackingData(url = '', data = {}) {
    const response = await fetch (url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;
}

function isSearchRequest(url) {
    return url.includes('ep-search-backend/api/v1/search')
}

function buildSearchURL (obj) {
    let baseSearchKey = ""
    if (obj.Query != undefined && obj.Query != "") {
        baseSearchKey = baseSearchKey + 'query=' + obj.Query + "&"
    }
    if (obj.Filter != undefined && obj.Filter.length > 0) {
        for (let filters = obj.Filter, i = 0;  i < filters.length; i++) {
            baseSearchKey = baseSearchKey + filters[i].Attribute + "=" + filters[i].Value + "&"
        }
    }
    if (obj.Sortings != undefined && obj.Sortings.length > 0) {
       baseSearchKey = baseSearchKey + "sortings=" + obj.Sortings[0].Attribute + "-" + obj.Sortings[0].Order
    }
    
    return baseSearchKey
}

function getTrackingRequestUrl(url) {
    const MEDIUM = "secure8"
    const SECURE = "secure4"
    const WEBAPPS = "webapps"
    const trackingRequestUrl = "https://apps.datev.de/tracking-backend/api/v1/tracking"
    const trackingRequestUrl_SEC = "https://secure4.datev.de/tracking-backend/api/v1/tracking"
    const trackingRequestUrl_MED = "https://secure8.datev.de/tracking-backend/api/v1/tracking"
    const trackingRequestUrl_webapps = "https://webapps.datev.de/tracking-backend/api/v1/tracking"
    switch(true) {
        case url.includes(SECURE): 
            return  trackingRequestUrl_SEC
        case url.includes(MEDIUM):
            return  trackingRequestUrl_MED
        case url.includes(WEBAPPS):
            return trackingRequestUrl_webapps
        default:
            return trackingRequestUrl
    }
}

async function getState() {
   return  await worker.registration.navigationPreload.getState();
}

worker.addEventListener('install', onInstall);

worker.addEventListener('activate', onActive);

worker.addEventListener('fetch', onFetch);

worker.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim().then(() => console.log('active')))
})

worker.addEventListener('message', event => {    
    if (event.data && event.data.type === 'MESSAGE_TITLE') {
        // console.log('--------- title ', event.data)
       pageName = event.data.content;
    }
    if (event.data && event.data.type === 'MESSAGE_REFERRER') {
        // console.log('--------- referrer ', event.data)
        referrer = event.data.content;
     }
})