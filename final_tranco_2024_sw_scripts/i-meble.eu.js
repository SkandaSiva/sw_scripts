const SW_VERSION ='45';
const FETCH_URL = "https://i-meble.eu/img/by-id/";
 

let CURRENT_CACHES = {
    offline: 'offline-1',
    app: 'app',
	cachePreload : 'cache-preload',
	images_by_id: 'ima-by-id'
};
const OFFLINE_URL = "offline.html";

function createCacheBustedRequest(event) {
    let request = new Request(event, { cache: "reload" });

    if ("cache" in request) {
        return request;
    }

    let url = new URL(event, self.location.href);
    url.search += (url.search ? "&" : "") + "cachebust=" + Date.now();

    return new Request(url);
}

self.addEventListener("install", event => {
    event.waitUntil(installEvent());
	self.skipWaiting();
	//od instalacji wersji workera
	self.clients.matchAll().then(clients => {
        clients.forEach(client => {
			client.postMessage({ type: 'INSTALL_VERSION', version: SW_VERSION });
        });
    })
});

async function installEvent() {
    const response = await fetch(createCacheBustedRequest(OFFLINE_URL));
    const cache = await caches.open(CURRENT_CACHES.offline);
    await cache.put(OFFLINE_URL, response);
}
// od poprawnego przeładowania zakłądek
self.addEventListener('message', async event => {
    if (event.data === 'reloadClients') {
	    let cacheNames = await caches.keys();
		let validCacheNames = Object.values(CURRENT_CACHES);
		let deletePromises = [];

		for(let cacheName of cacheNames) {
			if(!validCacheNames.includes(cacheName)) {
				//console.log("Deleting out of date cache:", cacheName);
				deletePromises.push(caches.delete(cacheName));
			}
		}

		await Promise.all(deletePromises);
		
		const clients = await self.clients.matchAll({type: 'window'});
        for (const client of clients) {
            client.postMessage({type: 'RELOAD'});
        }
    }
});

self.addEventListener("activate", event => {
    event.waitUntil(handleActivation());
	self.skipWaiting();
	self.clients.claim();
	//od aktualizacji wersji workera
	self.clients.matchAll().then(clients => {
        clients.forEach(client => {
			client.postMessage({ type: 'SET_VERSION', version: SW_VERSION });
        });
    })
});

async function handleActivation() {
  
}

self.addEventListener('fetch', event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  //console.log('event.request.mode:', event.request.mode.toString(),  event.request.url.toString());

  // sprawdź, czy żądanie jest do zasobów, które chcemy obsłużyć w serwisie worker
  if (url.hostname === 'i-meble.eu' && url.pathname.startsWith('/images/')) { 
    // Obsłuż żądanie w serwisie worker
    event.respondWith(handleRequest(event.request));
  } else {
    // Inne żądania przekaż bezpośrednio do sieci
    //event.respondWith(orgRequest(event.request));
  }
});

async function orgRequest(request){
 try {
   return await fetch(request);
   //return request;
 } catch (error) {
   console.error('Błąd orginalnego request dla Url: ' + request.url.toString(), error);
   return new Response("Nie znaleziono", { status: 404 });
 }
}

async function handleRequest(request) {
  //return request;
  /*
  try {
    const clientIP = await Promise.race([
      getClientIP(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out')), 500))
    ]);

    if (allowedIPs.includes(clientIP)) {
      return fetchAndHandleErrors(request);
    } else {
      return orgRequest(request);
    }
  } catch (error) {
    return orgRequest(request);
  }
  */
	return fetchAndHandleErrors(request);
}

async function cacheMatch(nameCache, url) {
 try {
        const cache = await caches.open(nameCache );
        const cachedResponse = await cache.match(url);
        // Jeśli zasób jest w pamięci podręcznej i nie wygasł, zwróć go
        if (cachedResponse) {
          const expiresHeader = cachedResponse.headers.get('Expires');
          if (expiresHeader) {
            if (new Date(expiresHeader) > new Date()) {
              return cachedResponse;
            }
          }
        }
      } catch (error) {
        console.error('Błąd odczytu z pamięci podręcznej:', error);
      }
}

async function cachePut(url, response) {
      const expiresHeader = response.headers.get('Expires');
      if (expiresHeader) {
        if (new Date(expiresHeader) > new Date()) {
          // Jeśli zasób nie wygasł, dodaj go do pamięci podręcznej
          try {
            const cache = await caches.open(CURRENT_CACHES.images_by_id);
            cache.put(url, response);
          } catch (error) {
            console.error('Błąd zapisu do pamięci podręcznej:', error);
          }
        }
      }

}

async function fetchAndHandleErrors(request) {
  try {
	let res = await cacheMatch(CURRENT_CACHES.images_by_id, request.url);
    if(res){
        return res;
    }
	let url = new URL(request.url);
    let regex = /^\/images\/([_a-zA-Z0-9-]*)\/([0-9]{1,10})(\-[_a-zA-Z0-9-]*)?(-[0-9]+)?\/.+\.(jpg|webp|svg|png|gif)$/;
   

	try {
		let match = url.pathname.match(regex);
		if (match) {
			  let pathFolders = match[2].split('').join('/');
			  let r3url = `${FETCH_URL}${match[1]}/${pathFolders}/${match[2]}${match[3] ? match[3] : ''}${match[4] ? match[4] : ''}.${match[5]}`;
			  let response = await fetch(r3url);

			  if (!response.ok) {
				throw new Error(`Żądanie nie powiodło się ze statusem: ${response.status}`);
			  }

			  await cachePut(request.url, response.clone());
			  
			  //console.log('ok-worker');
			  return response;
		}
		else {
		  // Jeśli brak dopasowania, przekaż żądanie do serwera pochodzenia
		  //return fetch(request);
		  return orgRequest(request);
		}
	} catch (error) {
		return orgRequest(request);
		console.error("Error matching regex:", error);
	}
	
   
  } catch (error) {
    console.error(error);
    return new Response("Wystąpił błąd.", { status: 500 });
  }
}

/*
async function getClientIP() {
  const cache = await caches.open('ip-cache');
  const cachedResponse = await cache.match('client-ip');
  if (cachedResponse) {
    const cachedIP = await cachedResponse.text();
    const [ip, timestamp] = cachedIP.split(',');
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    if (parseInt(timestamp, 10) > oneHourAgo) {
      return ip;
    }
  }

  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    const ipData = `${data.ip},${Date.now()}`;
    const blob = new Blob([ipData], { type: 'text/plain' });
    await cache.put('client-ip', new Response(blob));
    return data.ip;
  } catch (error) {
    console.error(error);
    return "";
  }
}
*/

// część od preload inicjowana przez skrypt w HTML
self.addEventListener('message', async function(event) {
	if (event.data && event.data.type === 'CACHE_URLS') {
		try {
			const cacheName = event.data.cacheName;
			const cache = await caches.open(cacheName);
			
			// wersja szybsza ale jak jeden zasób da błąd to całość daje błąd
			if (event.data.actions.DELETE_CACHE) {
				try {
					await Promise.all(event.data.actions.DELETE_CACHE.map(url => cache.delete(url)));
					//console.log('Successfully deleted all the URLs in DELETE_CACHE');
				} catch(deleteError) {
					console.error('There was an error deleting some of the URLs in DELETE_CACHE', deleteError);
				}
			}
		
			if (event.data.actions.ADD_CACHE) {
				try {
					await cache.addAll(event.data.actions.ADD_CACHE);
					//console.log('Successfully cached all the URLs in ADD_CACHE');
				} catch(addError) {
					console.error('There was an error caching some of the URLs in ADD_CACHE', addError);
				}
			}
		
			if (event.data.actions.UPDATE_CACHE) {
				try {
					await Promise.all(event.data.actions.UPDATE_CACHE.map(url => cache.delete(url)));
					await cache.addAll(event.data.actions.UPDATE_CACHE);
					//console.log('Successfully updated all the URLs in UPDATE_CACHE');
				} catch(updateError) {
					console.error('There was an error updating some of the URLs in UPDATE_CACHE', updateError);
				}
			}
			// wersja szybsza ale jak jeden zasób da błąd to całość daje błąd

			// wersja bezpieczniejsza wolniejsza  może dla trybu dev lepsza
			/*
				if (event.data.actions.UPDATE_CACHE) {
					for(let url of event.data.actions.UPDATE_CACHE) {
						try {
							await cache.delete(url);
							console.log('Successfully deleted', url);
						} catch(deleteError) {
							console.error('There was an error deleting', url, deleteError);
						}
					}
				}
				if (event.data.actions.ADD_CACHE) {
					for(let url of event.data.actions.ADD_CACHE) {
						try {
							await cache.add(url);
							console.log('Successfully cached', url);
						} catch(addError) {
							console.error('There was an error caching', url, addError);
						}
					}
				}
				if (event.data.actions.UPDATE_CACHE) {
					for(let url of event.data.actions.UPDATE_CACHE) {
						try {
							await cache.delete(url);
							await cache.add(url);
							console.log('Successfully updated', url);
						} catch(updateError) {
							console.error('There was an error updating', url, updateError);
						}
					}
				}
			*/
			// wersja bezpieczniejsza wolniejsza
		} catch (error) {
		  console.error('There was an error processing the CACHE message:', error);
		}
    }
});

