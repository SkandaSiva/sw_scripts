'use strict';
(function () {
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

  const {hostname, pathname} = self.location
  const safeFetchHandlers = new WeakMap();
  let currentOnFetch = null;

  const matches = /^\/(apps|a|community|tools)\/[^\/]+/.exec(pathname);
  const proxy = matches && matches[0];
  const hostnameRegex = hostname.replace(/\./g, '\\.');
  const ALLOWLIST = [
    // Allow only specific subroutes within a storefront
    `^https\:\/\/${hostnameRegex}+\/($|collections|products|pages|cart|search|blogs|account|recommendations)`,
    // Allow requests from the app proxy in which the service worker was served
    `^https\:\/\/${hostnameRegex}+${proxy}`,
    // Allow all 3rd party urls
    `^https?\:\/\/(?!${hostnameRegex}).+`,
  ];

  function isAllowlisted(url) {
    return ALLOWLIST.some((str) => {
      const re = new RegExp(str);
      return url.match(re)
    })
  }

  function safeAddEventListener(event, handler, options) {
    if (event !== 'fetch') return originalAddEventListener.call(this, event, handler, options);
    function safeHandler(event) {
      if (!isAllowlisted(event.request.url)) {
        return console.debug(`FETCH EVENT BLOCKED: Cannot execute fetch event handler on following request: ${event.request.url}`)
      }
      return handler.call(this, event);
    }
    safeFetchHandlers.set(handler, safeHandler);
    originalAddEventListener.call(this, event, safeHandler, options);
  };

  function safeRemoveEventListener(event, handler) {
    if (!safeFetchHandlers.has(handler)) return;
    const safeHandler = safeFetchHandlers.get(handler)
    safeFetchHandlers.delete(handler);
    originalRemoveEventListener.call(this, event, safeHandler);
  }

  Object.defineProperty(EventTarget.prototype, 'addEventListener', {
    ...Object.getOwnPropertyDescriptor(EventTarget.prototype, 'addEventListener'),
    value: safeAddEventListener
  });

  Object.defineProperty(EventTarget.prototype, 'removeEventListener', {
    ...Object.getOwnPropertyDescriptor(EventTarget.prototype, 'removeEventListener'),
    value: safeRemoveEventListener
  });

  Object.defineProperty(self, 'onfetch', {
    ...Object.getOwnPropertyDescriptor(self, 'onfetch'),
    get() { return currentOnFetch; },
    set(newOnFetch) {
      if (currentOnFetch !== null) {
        safeRemoveEventListener.call(self, 'fetch', currentOnFetch);
      }
      if (typeof newOnFetch === 'function') {
        safeAddEventListener.call(self, 'fetch', newOnFetch);
      }
      currentOnFetch = newOnFetch;
    },
  });
}());
importScripts("https://static.edgeme.sh/edgemesh-sw.js");
