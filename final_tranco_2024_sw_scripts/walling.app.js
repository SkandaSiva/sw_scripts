self.addEventListener('fetch', function(event) {});

// onfetch = async (event) => {
//   if (event.request.method !== 'POST') return;
//   if (event.request.url.includes('/share-') === false) return;

//   event.respondWith(Response.redirect('/web/daily-desk/'));
  
//   event.waitUntil(async function () {
//   	alert("got file")
//     const data = await event.request.formData();
//     const client = await self.clients.get(event.resultingClientId || event.clientId);
//     // Get the data from the named element 'file'
//     const file = data.get('share-file');

//     client.postMessage({file, action: 'load-image'});
//   }());
// };