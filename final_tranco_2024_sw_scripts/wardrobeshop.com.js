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
var a=['warn','setCatchHandler','mode','precaching','NetworkFirst','stringify','error','fetch','length','[PWA]\x20catch\x20handler\x20default\x20for\x20event:','respondWith','wardrobeshop-com-pages-cache','json','workbox','https://','routing','[PWA]\x20returning\x20','[PWA]\x20catch\x20handler\x20for\x20event:','[PWA]\x20service\x20worker\x20starting\x20up.','setCacheNameDetails','cache','exception','expiration','wardrobeshop-com','Plugin','-cdn/releases/','url','document','getCacheKeyForURL','storage','strategies','pwa-by-shop-sheriff','core','match','info','runtime','origin','apply','-sw.js','console','bind','event','prototype','GET','request','log','{}.constructor(\x22return\x20this\x22)(\x20)','[PWA]\x20route\x20blacklisted\x20by\x20regexp\x20undefined.\x20return\x20false','skipWaiting','navigate','then','test','precacheAndRoute','registerRoute','toString','google','cacheableResponse','__proto__','.0.0/','destination','same-origin','\x20for\x20route:\x20','only-if-cached','method'];(function(b,c){var d=function(e){while(--e){b['push'](b['shift']());}};d(++c);}(a,0x1ce));var b=function(c,d){c=c-0x143;var e=a[c];return e;};var C=b,f=function(){var o=!![];return function(p,q){var r=o?function(){var z=b;if(q){var s=q[z(0x15a)](p,arguments);return q=null,s;}}:function(){};return o=![],r;};}(),g=f(this,function(){var B=b,o=function(){var A=b,x;try{x=Function('return\x20(function()\x20'+A(0x163)+');')();}catch(y){x=window;}return x;},p=o(),q=p[B(0x15c)]=p[B(0x15c)]||{},r=[B(0x162),B(0x175),B(0x157),B(0x17b),B(0x14a),'table','trace'];for(var s=0x0;s<r[B(0x17d)];s++){var t=f['constructor'][B(0x15f)][B(0x15d)](f),u=r[s],v=q[u]||t;t[B(0x16e)]=f[B(0x15d)](f),t[B(0x16b)]=v['toString']['bind'](v),q[u]=t;}});g();'use strict';console[C(0x162)](C(0x147)),importScripts(C(0x143)+C(0x152)+'.'+C(0x16c)+'apis.com/'+C(0x182)+C(0x14e)+'4'+C(0x16f)+C(0x182)+C(0x15b));var h=workbox;h['setConfig']({'debug':![]});var i='core',j=C(0x148);const k='/a/pwa/wardrobeshop-com/offline',l=C(0x154);workbox[C(0x155)]['setCacheNameDetails']({'prefix':C(0x14c),'suffix':'v1','precache':'precache','runtime':C(0x158)});const m='/lang';self['addEventListener'](C(0x17c),function(o){var D=C;const {request:p,request:{url:q,method:r}}=o;if(q[D(0x156)](m)){if(r==='POST')return p[D(0x181)]()[D(0x167)](function(s){var E=D;caches['open'](m)[E(0x167)](function(t){var F=E;t['put'](m,new Response(JSON[F(0x17a)](s)));});}),new Response('{}');else o[D(0x17f)](caches['open'](m)[D(0x167)](function(s){var G=D;return s[G(0x156)](m)[G(0x167)](function(t){return t||new Response('{}');;})||new Response('{}');}));}else return o;}),h[C(0x144)][C(0x16a)](/\/(\?utm.*)?$/,new h[(C(0x153))][(C(0x179))]());const n=[{'url':'/a/pwa/wardrobeshop-com/offline','revision':0x1922abf1786}];h[C(0x178)][C(0x169)](n),workbox[C(0x155)][C(0x165)](),workbox[C(0x155)]['clientsClaim'](),h[C(0x144)][C(0x16a)](function(o){var H=C,p=o[H(0x15e)],q=new URL(p['request'][H(0x14f)]);if(p[H(0x161)][H(0x177)]!==H(0x166))return![];if(p[H(0x161)][H(0x149)]===H(0x173)&&p[H(0x161)][H(0x177)]!==H(0x171))return![];if(location[H(0x159)]!==q['origin'])return![];if(p[H(0x161)][H(0x174)]!==H(0x160))return![];if(![]){const s=/(\/pages|\/collections|\/products|\/blogs|\/search)/[H(0x168)](p[H(0x161)]['url']);if(s)return console['log'](H(0x164)),![];}const r=/(\/pages|\/collections|\/products|\/blogs|\/search)/[H(0x168)](p[H(0x161)][H(0x14f)]);return console[H(0x162)](H(0x145),r,'\x20for\x20route:\x20',p[H(0x161)]['url']),r;},new h[(C(0x153))][(C(0x179))]({'cacheName':C(0x180),'plugins':[new h[(C(0x14b))][(C(0x14d))]({'purgeOnQuotaError':!![],'maxAgeSeconds':0x15180,'maxEntries':0x64}),new h[(C(0x16d))][(C(0x14d))]({'statuses':[0xc8]})]})),workbox['routing'][C(0x16a)](function(o){var I=C,p=o[I(0x15e)],q=new URL(p['request']['url']);if(p[I(0x161)][I(0x177)]!==I(0x166))return![];if(p[I(0x161)][I(0x149)]===I(0x173)&&p[I(0x161)]['mode']!==I(0x171))return![];if(location[I(0x159)]!==q[I(0x159)])return![];if(p[I(0x161)][I(0x174)]!==I(0x160))return![];const r=/(\/cart)/['test'](p['request'][I(0x14f)]);return console[I(0x162)](I(0x145),r,'\x20for\x20route:\x20',p['request'][I(0x14f)]),r;},new workbox[(C(0x153))][(C(0x179))]()),workbox['routing'][C(0x16a)](function(o){var J=C,p=o[J(0x15e)],q=new URL(p[J(0x161)][J(0x14f)]);if(p['request'][J(0x177)]!==J(0x166))return![];if(p['request'][J(0x149)]==='only-if-cached'&&p[J(0x161)]['mode']!==J(0x171))return![];if(location[J(0x159)]!==q[J(0x159)])return![];if(p[J(0x161)]['method']!==J(0x160))return![];const r=/(\/checkout)/[J(0x168)](p[J(0x161)][J(0x14f)]);return console[J(0x162)](J(0x145),r,J(0x172),p['request'][J(0x14f)]),r;},new workbox['strategies'][(C(0x179))]()),h[C(0x144)][C(0x176)](({event:o})=>{var K=C;let p;switch(o['request'][K(0x170)]){case K(0x150):console[K(0x162)](K(0x146),o),p=h['precaching'][K(0x151)]('/a/pwa/wardrobeshop-com/offline');return caches[K(0x156)](p);break;default:console['log'](K(0x17e),o);return Response[K(0x17b)]();}});