'use strict';

const NAME = 'PHPJabbers';
const VERSION = '1.0.0';

self.onmessage = evt => {
  if (evt.data === 'version') {
    evt.source.postMessage({
      version: VERSION
    });
  }
};

self.addEventListener("fetch", function (event) {
  
});