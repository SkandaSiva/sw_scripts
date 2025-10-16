importScripts("https://cdn.moengage.com/webpush/releases/serviceworker_cdn.min.latest.js");

  
    if ('serviceWorker' in navigator) {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          const swUrl = `/service-worker.js`; // Adjusted to a direct path
          registerServiceWorker(swUrl);
        });
      }
    }
  
  
  function registerValidSW(swUrl) {
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the old content will have been purged and
                // the fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in your web app.
                window.location.reload()
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a
                // "Content is cached for offline use." message.
              }
            }
          }
        }
      })
      .catch(error => {
        console.error('Error during service worker registration:', error)
      })
  }
  
  function registerServiceWorker(swUrl) {
    navigator.serviceWorker.register(swUrl).then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log("New content is available; please refresh.");
              // Optionally prompt the user to reload the page
            } else {
              console.log("Content is cached for offline use.");
            }
          }
        };
      };
    }).catch(error => {
      console.error('Error during service worker registration:', error);
    });
  }
  

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister()
      })
    }
  
  