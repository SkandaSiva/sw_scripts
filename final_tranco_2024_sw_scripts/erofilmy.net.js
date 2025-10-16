'use strict';

 importScripts('/sw-toolbox.js');

toolbox.precache(["/","/templates/app/css/app.min.css"]);

toolbox.router.get('/img/*', toolbox.cacheFirst);

toolbox.router.get('/', toolbox.networkFirst, {
  networkTimeoutSeconds: 3
});

