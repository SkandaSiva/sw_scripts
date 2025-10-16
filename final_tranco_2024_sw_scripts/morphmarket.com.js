// This file was previously far more fleshed out. Refer to aeb386097bddae54ed94a57da01538f400b5109e for the prior "PWA" version.
//
/* eslint-disable-next-line no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.3.0/workbox-sw.js');

if (!workbox) {
  /* eslint-disable-next-line no-console */
  console.log(`Boo! Workbox didn't load 😬`);
}

// Turns on/off console.log statements for Workbox.
workbox.setConfig({ debug: 'False' === 'True' });

//  when publishing a new service worker, this allows it to control already-open web pages as soon as soon as it activates
//  https://developers.google.com/web/tools/workbox/modules/workbox-core#clients_claim
workbox.core.clientsClaim();

const cloudfrontDomain = 'd20zyr0oabjxc2.cloudfront.net';

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('install', async () => {
  /* eslint-disable-next-line no-console */
  console.log('install event fired');
  // so that the newly installed service worker doesn't wait and activates immediately
  /* eslint-disable-next-line no-restricted-globals */
  self.skipWaiting();
});

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener('fetch', (event) => {
  // Currently using fetch event listener to override requests for jpg and png images and fetch webp version if they exist in Cloudfront/S3 Bucket
  // Let the browser do its default thing for non-GET requests
  if (event.request.method !== 'GET') return;

  // Check if the image is one of the img types we want to instead fetch the .webp version (b/c smaller file) which we will either fetch/create
  // Accept .jpg, .jpeg, .png files, also can expect URL params for "signature" mainly to send that to cloudfront on-fly/lazy lambda
  // accepted urls: [.../abc/xyz.png, .../abc/xyz.png?signature=AABBCC, ..]
  if (!/\.jpg$|\.jpeg$|\.png$|\.jpg\?|\.jpeg\?|\.png\?/.test(event.request.url)) return;

  //  early return if localhost b/c we won't have webp images locally
  if (/127.0.0.1|localhost/.test(event.request.url)) return;

  // Inspect the accept header for WebP support
  let supportsWebp = false;
  if (event.request.headers.has('accept')) {
    supportsWebp = event.request.headers.get('accept').includes('webp');
  }

  if (!supportsWebp) return;

  // Clone the request
  const req = event.request.clone();
  const origUrl = req.url;
  // NOTE: for mode = "cors" to work correctly, s3 bucket needs to be configured for CORS and Cloudwatch
  const options = { mode: 'cors' };

  const testCloudfrontDomain = new RegExp(cloudfrontDomain, 'i');

  // if it's not our cloudfront domain or we can't resolve our cloudfront domain (e.g. when on localhost), continue
  if (!testCloudfrontDomain.test(origUrl) || !cloudfrontDomain) return;

  // Build the .webp version of the Url
  let webpImgUrl = origUrl.split(cloudfrontDomain);
  const protocol = webpImgUrl[0];
  const path = webpImgUrl[1];
  const urlParams =
    path.lastIndexOf('?') === -1 ? '' : path.substr(path.lastIndexOf('?'), path.length);
  // The s3 bucket has a root folder for webp images but the rest of the path is the same as for the original image
  webpImgUrl = `${protocol + cloudfrontDomain}/webp${path.substr(
    0,
    path.lastIndexOf('.')
  )}.webp${urlParams}`;

  // try to fetch the .webp version of the img
  event.respondWith(
    fetch(webpImgUrl, options)
      .then((response) => {
        //  response code from AWS Cloudfront or S3 Bucket will be a 403 rather than 404 usually. NOTE: have to use mode: "cors" to get the status response otherwise with no-cors, it's an "opaque" response
        //   if the corresponding PNG or JPG exists, the .webp will be created and return 200 otherwise we may get 403 or 404 (or possibly an error) so return original
        if (response && response.status >= 400) {
          /* eslint-disable-next-line no-console */
          console.log(
            `response.status: ${response.status}; file doesn't exist or there was an error!`
          );
          return fetch(origUrl, options);
        }
        // console.log('file DOES exist: ' + webpImgUrl);
        return response;
      })
      .catch((error) => {
        /* eslint-disable-next-line no-console */
        console.error(error);
      })
  );
});

// Listen for messages from the browser app JS code
/* eslint-disable-next-line no-restricted-globals */
addEventListener('message', (event) => {
  // respond to user interaction to Refresh the page
  if (event.data && event.data.type === 'SKIP_WAITING') {
    /* eslint-disable-next-line no-restricted-globals */
    self.skipWaiting();
  }
});
