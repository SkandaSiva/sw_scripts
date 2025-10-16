/* eslint-disable no-restricted-globals */

const config = {};

self.addEventListener('install', () => {
  const params = new URL(self.location).searchParams;
  config.cdnUri = params.get('cdnUri') || '';
  config.cdnHostname = config.cdnUri.replace(/https?:\/\//, '');
  config.version = params.get('version') || '';
  config.cacheName = `cdn-${config.version}`;
});

/* eslint-enable no-restricted-globals */
