let CACHE_VERSION = 757715435690;
        let CURRENT_CACHE = {
            static: 'static-cache-v' + CACHE_VERSION
        }
        importScripts('swenv.js');
        let baseUrl = self.location.origin ;
        const ArrayOfAddressHtmlImpPages = [
            "/flight",
            "/flight/THR-MHD" ,
            "/flight/MHD-THR" ,
            "/flight/THR-KIH" ,
            "/flight/SYZ-THR" ,
            "/flight/THR-SYZ" ,
            "/flight/IFN-MHD" ,
            "/flight/KIH-THR" ,
            "/flight/AWZ-THR" ,
            "/flight/TBZ-THR" ,
            "/flight/international" ,
            "/flight/IKA-IST" ,
            "/flight/IKA-NJF" ,
            "/flight/MHD-NJF" ,
            "/flight/IST-IKA" ,
            "/flight/IKA-DXB" ,
            "/flight/NJF-IKA" ,
            "/flight/IKA-AYT" ,
            "/flight/MHD-IST" ,
            "/flight/SYZ-IST" ,
            "/train" ,
            "/train/tehran-mashhad" ,
            "/train/mashhad-tehran" ,
            "/train/esfahan-mashhad" ,
            "/train/ahvaz-mashhad" ,
            "/train/shiraz-mashhad" ,
            "/train/tabriz-mashhad" ,
            "/train/ghom-tehran" ,
            "/train/tehran-ghom" ,
            "/train/tehran-shiraz" ,
            "/tour/mashhad" ,
            "/tour/esfahan-mashhad" ,
            "/tour" ,
            "/tour/shiraz-mashhad" ,
            "/tour/tabriz-mashhad" ,
            "/tour/mashhad-kish" ,
            "/tour/kish" ,
            "/tour/esfahan-kish" ,
            "/tour/shiraz" ,
            "/tour/bushehr-mashhad" ,
            "/hotel" ,
            "/hotel/mashhad-boshra" ,
            "/hotel/mashhad-dayan" ,
            "/hotel/mashhad" ,
            "/hotel/istanbul" ,
            "/hotel/kish-palas" ,
            "/hotel/kish-kourosh" ,
            "/hotel/mashhad-darvishi" ,
            "/hotel/tehran" ,
            "/hotel/mashhad-sharestan" ,
            "/bus" ,
            "/bus/esfahan-tehran" ,
            "/bus/tehran-mashhad" ,
            "/bus/tehran-esfahan" ,
            "/bus/tehran-mehran" ,
            "/bus/tehran-istanbul" ,
            "/bus/tehran-kermanshah" ,
            "/bus/mashhad-tehran" ,
            "/bus/tabriz-tehran" ,
            "/bus/shiraz-tehran" ,
        ]
        self.addEventListener("install", e => {
            self.skipWaiting();
            console.log('install custom sw');
        })
        self.addEventListener('activate', e => {
            let expectedCachesNames = Object.values(CURRENT_CACHE)
            e.waitUntil(
                caches.keys().then(cacheNames => {
                    return Promise.all(
                        cacheNames.forEach(cacheName => {
                            if (!expectedCachesNames.includes(cacheName)) {
                                return caches.delete(cacheName);
                            }
                        })
                    )
                })
            )
        })
        self.addEventListener("fetch", e => {
            if (e.request.url.indexOf('.jpg') != -1 || e.request.url.indexOf('.png') != -1 || e.request.url.indexOf('.js') != -1  || e.request.url.indexOf('.woff2') != -1) {
                e.respondWith(
                    caches.open(CURRENT_CACHE['static']).then(cache => {
                        return cache.match(e.request).then(response => {
                            if(!response) {
                                return fetch(e.request).then(netRes => {
                                    cache.put(e.request, netRes.clone());
                                    return netRes;
                                });
                            }
                            const date = new Date(response.headers.get('date'))
                            // if cached file is older than 1 minutes
                            let arrayOfAddressConverted = ArrayOfAddressHtmlImpPages.map(item => {
                                return baseUrl + item ;
                            })
                            if(arrayOfAddressConverted.includes(e.request.url) && Date.now() > date.getTime() + 1000 * 60){
                                return fetch(e.request).then(netRes => {
                                    cache.put(e.request, netRes.clone());
                                    return netRes;
                                }).catch((err => {
                                    return response
                                }));
                            }
                            return response;
                            // else return cached version
                        })
                    })
                )
            }
        })
        