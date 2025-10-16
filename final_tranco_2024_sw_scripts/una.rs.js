if ('function' === typeof importScripts) {
  importScripts(
    'https://cdn.pushpushgo.com/64b002c479a903acbe12d0a5/worker.js'
  );

  addEventListener('message', onMessage);

  function onMessage(e) {}
}
