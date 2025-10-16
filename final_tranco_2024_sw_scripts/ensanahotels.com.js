// self.addEventListener('fetch', (event) => {
//   // const url = event.request.url;
//   // const fontPattern = /\.(woff2|woff|ttf|otf)$/i;
//   if (!event?.request?.url.startsWith(self.location.origin)) {
//     event.stopImmediatePropagation();
//   }
// });

importScripts('./ngsw-worker.js');
