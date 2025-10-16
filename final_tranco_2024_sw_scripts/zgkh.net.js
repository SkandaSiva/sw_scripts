self.addEventListener('install', event => {
    console.log('Service Worker installing.');
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
});

const backupDomain = 'tilx.org';

self.addEventListener('fetch', event => {
  const isIframe = event.request.destination && event.request.destination == 'iframe';
  if (!iframe && (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')))) {
    event.respondWith(handleRequest(event));
  } else {
    event.respondWith(fetch(event.request));
  }
});

async function handleRequest(event) {
  const originalRequest = event.request;
  let originalResponse;
  let done = false;
  console.log('handleRequest', originalRequest);

  let backupFetchPromise;

	const originalFetchPromise = fetch(originalRequest)
    .then(response => {
      //console.log('response', response);
      return response;
    });

  async function fetchFromBackup() {
    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 5000));
    await timeoutPromise;

		if (done) {
      return;
    }
    const backupUrl = 'https://' + backupDomain + '/test74382647832.txt';
    //console.log('fetch backupUrl', backupUrl);
    try {
      const backupResponse = await fetch(backupUrl);
      console.log('backupResponse', backupResponse.ok);
      if (backupResponse.ok && !done) {
        const backupUrl = new URL(originalRequest.url);
        backupUrl.hostname = backupDomain;

        const currentUrl = new URL(originalRequest.url);
        let search = currentUrl.search;
        if(!search) {
					search = '?';
        } else {
					search += '&';
        }
        search += 'od=' + currentUrl.host;
        backupUrl.search = search;
        console.log('redirect to ' + backupUrl.toString());

				return new Response('', {
					status: 302,
					headers: {
						'Location': backupUrl.toString(),
					}
				});

				const redirectHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta http-equiv="refresh" content="0;url=${backupUrl.toString()}" />
          </head>
          <body>
            <p>Redirecting to <a href="${backupUrl.toString()}">${backupUrl.toString()}</a></p>
          </body>
          </html>
        `;

        return new Response(redirectHtml, {
          headers: {
            'Content-Type': 'text/html'
          }
        });
  
        /*
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'REDIRECT',
              url: backupUrl.toString(),
            });
          });
        });
        */

				return new Response('', {
					status: 302,
					headers: {
						'Location': backupUrl.toString(),
					}
				});
      } else {
        //return originalResponse;
      }
    } catch (err) {
      console.error('Backup request failed', err);
    }
  }

  backupFetchPromise = fetchFromBackup();

  const firstResolved = await Promise.race([originalFetchPromise, backupFetchPromise]);
  console.log('firstResolved', firstResolved);

	if(firstResolved && firstResolved.ok) {
    done = true;
		return firstResolved;
	}

	const backupResponse = await backupFetchPromise;
	if (backupResponse) {
		console.log('Original failed, backup success');
		return backupResponse;
	}

  console.log('Both fail');
	return new Response('X Service Unavailable', { status: 503 });
}
