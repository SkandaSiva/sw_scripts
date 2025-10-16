// self.addEventListener('fetch', event => {
//     event.respondWith(
//         fetch(event.request).then(response => {
//             // Check if the response is an HTTP 500 error
//             if (response.status === 500) {
//                 // Attempt to use the Referer header as a fallback redirect location
//                 const redirectUrl = event.request.referrer || '/';
//                 return Response.redirect(redirectUrl, 302);
//             }
//             return response;
//         }).catch(() => {
//             // Handle network or other fetch errors
//             return new Response('Network error', { status: 404 });
//         })
//     );
// });