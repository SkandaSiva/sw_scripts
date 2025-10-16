self.addEventListener("fetch", function (event) {
    event.respondWith(
        fetch(event.request).then(function (response) {
            const contentLength = parseInt(response.headers.get("content-length"));

            // Check if the image is larger than 2.5MB
            if (contentLength > 1024 * 1024 * 2.5) {
                // Return a new Response with a 413 status code (Payload Too Large)
                return new Response(null, { status: 413, statusText: "File is too big" });
            }

            return response;
        })
        .catch(function (err) {
            console.error(err);
        })
    );
});
