importScripts('https://static.cleverpush.com/channel/worker/JEmqXMZbDqfokooJX.js' + self.location.search);
importScripts('https://cdn.ampproject.org/sw/amp-sw.js');

AMP_SW.init({
  offlinePageOptions: {
    url: '/offline.html',
    assets: [],
  },
  linkPrefetchOptions: {},
});
