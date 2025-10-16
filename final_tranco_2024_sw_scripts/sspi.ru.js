'use strict';
importScripts('sw-toolbox.js');
toolbox.precache(["/index.php"]);
toolbox.router.get('/source/icons/*', toolbox.cacheFirst);
//toolbox.router.get('/templates/*', toolbox.networkFirst, { networkTimeoutSeconds: 5});