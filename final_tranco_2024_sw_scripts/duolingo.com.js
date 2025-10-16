/**
 * The service worker should be located at the site root (/sw.js),
 * to ensure it can handle requests for the entire website and not
 * just a particular sub-path.
 *
 * It cannot be served from the CDN, because that's on a different origin.
 *
 * A website can only register a single service worker per scope. The
 * current service worker is named `gcm-service-worker` because it used
 * to only enable push messages. In reality, different functionalities are
 * imported below.
 *
 * When updating the service worker, you can change this or any imported
 * script without having to rename the file, as recommended by
 * https://web.dev/service-worker-lifecycle/#avoid-url-change.
 */

importScripts("./sw/gcm.js");
importScripts("./sw/offline.js");
