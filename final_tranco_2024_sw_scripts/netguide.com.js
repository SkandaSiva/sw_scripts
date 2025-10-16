var CACHE = 'netguide-precache';

var precacheFiles = [
        'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
        'https://use.typekit.net/epj6erf.js',
        'https://use.typekit.net/af/cafa63/00000000000000000001709a/27/l?subset_id=2&fvd=n4&v=3',
        'https://use.typekit.net/af/c630c3/000000000000000000017098/27/l?subset_id=2&fvd=n3&v=3',
        'https://use.typekit.net/af/80c5d0/00000000000000000001709c/27/l?subset_id=2&fvd=n6&v=3'
];

var hostWithNoCache = [
    'netguidecachefeedsimage.s3-eu-west-1.amazonaws.com',
    's3-eu-west-1.amazonaws.com',

    'searchapp.netguide.com',
    'i.netguide.com',
    'f.netguide.com',
    's.netguide.com',
    'analytics.netguide.com',

    'p.typekit.net',

    'tse1.mm.bing.net',
    'tse2.mm.bing.net',
    'tse3.mm.bing.net',
    'tse4.mm.bing.net',
    'tse5.mm.bing.net',
    'tse6.mm.bing.net',
    'tse7.mm.bing.net',
    'tse8.mm.bing.net',
    'www.bing.com'
];

self.addEventListener('install', function (event) {
    //event.waitUntil(
    //  caches.open(CACHE).then(function (cache) {
    //      return cache.addAll(
    //        precacheFiles
    //      );
    //  })
    //);
});


//self.addEventListener('activate', function (event) {
//    return self.clients.claim();
//});


//self.addEventListener('fetch', function (event) {

//    const requestUrl = new URL(
//        event.request.url
//     );

//    if ((requestUrl+ '').indexOf('https://') == 0) {
//        if ((requestUrl + '') != 'https://www.netguide.com/' && (requestUrl + '').indexOf('https://www.netguide.com/') == 0)
//        {
//            //event.respondWith(fetch(event.request, { cache: "reload" }));

//            event.respondWith(fetch(event.request));
//        }
//        else if (
//            hostWithNoCache.includes(requestUrl.hostname) == false &&
//            (requestUrl + '').indexOf('https://www.netguide.com/?q=') != 0 &&
//            (requestUrl + '').indexOf('https://www.netguide.com/search/') != 0
//            )
//        {

//            //event.respondWith(
//            //    caches.open(CACHE).then(
//            //        function (cache) {
//            //            return cache.match(event.request).then(
//            //                function (response)
//            //                {
//            //                    return fetchAndUpdateCache(response, event.request) || fetch(event.request, { cache: "reload" }).then(
//            //                        function (response) {
//            //                            cache.put(event.request, response.clone());
//            //                            console.log(event.request.url + ' : cache initially not found & created');
//            //                            return response;
//            //                        }
//            //                    );
//            //                }
//            //            );
//            //        }
//            //    )
//            //);

//            event.respondWith(fromCache(event.request).then(function (response) { return response || fetch(event.request) }).then(function(response){return response}));


//            event.waitUntil(
//                //update(event.request)
//                function () {

//                    var ip = '0.0.0.0';

//                    fetch('https://api.ipify.org/').then(function (response) {
//                        ip = response.text();
//                    });

//                    console.log('IP : ' + ip);

//                    if (ip == '5.51.216.171') {
//                        var resp = fromCache(event.request).then(function (response) { return response.clone() });

//                        //console.log(resp);

//                        if (resp == undefined) {
//                            console.log('no cache found');
//                        }
//                        else {
//                            try {
//                                console.log('cache date header is ' + resp.headers.get('Modified'));
//                            }
//                            catch (e) {
//                                console.log('can\'t read cache date header');
//                            }
//                        }
//                        console.log('waitUntil executed');

//                    }
//                }
//            );
            
  
//            //event.respondWith(fetch(event.request));
//        }
//        else {
//            //event.respondWith(fetch(event.request, { cache: "reload" })); 

//            event.respondWith(fetch(event.request));
//        }
//    }
//});

function fromCache(request) {
    return caches.open(CACHE).then(function (cache) {
        return cache.match(request);
    });
}

function update(request) {
    return caches.open(CACHE).then(function (cache) {
        return fetch(request, { cache: "reload" }).then(function (response) {
            return cache.put(request, response.clone()).then(function () {
                return response;
            });
        });
    });
}

//function fetchAndUpdateCache(response, request)
//{
//    console.log(request.url + ' : cache found');

//    return response;
    
//    //.then(fetch(event.request, { cache: "reload" }).then(
//    //                                function (response) {
//    //                                    cache.put(event.request, response.clone());
//    //                                    console.log(request.url + ' : cache udpdated');
//    //                                    return response;
//    //                                }
//    //                            ));
//}

