/* globals Headers,self,Response,Promise */
/**
 * delay fetch any images without query string parameter
 * @param {Event} event
 * @ignore
 */
self.addEventListener('fetch', function (event) {
    var resp,
        blankImg = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        headers = new Headers(),
        requestURL = new URL(event.request.url);

    // Rewrite the image tags of any html pages we encounter
    if (/\.(html)$/i.test(requestURL.pathname) && !requestURL.search) {
        // Assume that the html page in this folder has included the lazyload script.
        req = fetch(requestURL).then(function (response) {
            return response.text().then(function (body) {
                // Replace any instances of src attribute
                body = body.replace(/src="(.*\.)(png|jpg|jpeg)"/gi, 'src="' + blankImg + '" data-src="$1$2"');
                return new Response(body, {
                    headers: response.headers
                });
            });
        });
        event.respondWith(req);
    }
});