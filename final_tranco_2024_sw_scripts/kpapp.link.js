'use strict';

importScripts('/sw-toolbox.js');

/*toolbox.precache([
    "/tpl/css/main.css?" + ver,
    "/lib/jquery.js?" + ver
]);*/

toolbox.router.get('https://cdn.service-kp.com/poster/*', toolbox.cacheFirst);
toolbox.router.get('/tpl/*', toolbox.cacheFirst);
toolbox.router.get('/lib/*', toolbox.cacheFirst);
// toolbox.router.get('/*', toolbox.cacheFirst);

// toolbox.router.get('/*', toolbox.networkFirst, {networkTimeoutSeconds: 5});
