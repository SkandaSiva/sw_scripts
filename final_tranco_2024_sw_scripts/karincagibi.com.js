/* eslint-disable */
// use ES5 syntax for old browsers support

var USER_ASSETS_BACKET_NAMES = ['images', 'images2'];


function isUserAssets(url) {
    return USER_ASSETS_BACKET_NAMES.some(function (backetName) {
        return url.startsWith('https://'.concat(backetName));
    });
};


function isImage(fetchRequest) {
    return fetchRequest.method === 'GET' && fetchRequest.destination === 'image';
};


function sendBrokenImage(imgUrl) {
  fetch('/file/restore?url='.concat(imgUrl));
};


self.addEventListener('fetch', function (e) {
    if (isUserAssets(e.request.url) && isImage(e.request)) {
        e.respondWith(fetch(e.request, {
            mode: 'cors',
            credentials: 'same-origin',
            cache: 'no-store',
        }).then(function (response) {
            var contentLength = response.headers.get('content-length');
            // firefox blocking access to Content-Length header returning null value
            if (!response.ok || contentLength !== null && !parseInt(contentLength, 10)) throw new Error();
            return response.blob();
        }).then(function (responseBlob) {
            return new Response(responseBlob);
        }).catch(function () {
            sendBrokenImage(e.request.url);
            return Response.error();
        }));
    }
});