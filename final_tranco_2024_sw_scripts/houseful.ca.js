!function(){"use strict";try{self["workbox:sw:5.1.2"]&&_()}catch(t){}const t={backgroundSync:"background-sync",broadcastUpdate:"broadcast-update",cacheableResponse:"cacheable-response",core:"core",expiration:"expiration",googleAnalytics:"offline-ga",navigationPreload:"navigation-preload",precaching:"precaching",rangeRequests:"range-requests",routing:"routing",strategies:"strategies",streams:"streams"};self.workbox=new class{constructor(){return this.v={},this.t={debug:"localhost"===self.location.hostname,modulePathPrefix:null,modulePathCb:null},this.s=this.t.debug?"dev":"prod",this.o=!1,new Proxy(this,{get(e,s){if(e[s])return e[s];const o=t[s];return o&&e.loadModule(`workbox-${o}`),e[s]}})}setConfig(t={}){if(this.o)throw new Error("Config must be set before accessing workbox.* modules");Object.assign(this.t,t),this.s=this.t.debug?"dev":"prod"}loadModule(t){const e=this.i(t);try{importScripts(e),this.o=!0}catch(s){throw console.error(`Unable to import module '${t}' from '${e}'.`),s}}i(t){if(this.t.modulePathCb)return this.t.modulePathCb(t,this.t.debug);let e=["https://storage.googleapis.com/workbox-cdn/releases/5.1.2"];const s=`${t}.${this.s}.js`,o=this.t.modulePathPrefix;return o&&(e=o.split("/"),""===e[e.length-1]&&e.splice(e.length-1,1)),e.push(s),e.join("/")}}}();


if (workbox) {
    const minute = 60;
    workbox.setConfig({debug: false});
    workbox.routing.registerRoute(new RegExp('^https://ojohomes-static.prod.ojocore.ca/187686be/images/.*./[a-zA-Z0-9_\-]+.(jpg|svg|gif|png)$'), new workbox.strategies.CacheFirst({
        cacheName: 'image',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 20,
                maxAgeSeconds: minute * 24 * 7
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    }));

    const resourceRegExp = '^(https://ojohomes-static.prod.ojocore.ca/187686be/|https://cdn.ojo.me/).*.(css|ico|ttf|eot|woff|woff2)$';
    workbox.routing.registerRoute(new RegExp(resourceRegExp), new workbox.strategies.CacheFirst({
        cacheName: 'resource',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: minute * 60 * 24 * 7
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    }));

    workbox.routing.registerRoute(new RegExp('^https://www.houseful.ca/api/(home/|property/|search/).*'), new workbox.strategies.CacheFirst({
        cacheName: 'api',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 200,
                maxAgeSeconds: minute * 60
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [200]
            })
        ]
    }));

    workbox.routing.registerRoute(new RegExp('^https://www.houseful.ca/(?!(my-account/|css/|api/|webservices/|javascripts/|images/|mortgages/preapproved-vs-prequalified/|homebuying-with-rbc/)).*'), new workbox.strategies.CacheFirst({
        cacheName: 'page',
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 30,
                maxAgeSeconds: minute * 60
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [200]
            })
        ]
    }));
}