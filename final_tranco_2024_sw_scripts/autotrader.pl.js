self['appKey'] = location.hostname.indexOf('test') === -1 ? 'fc7106d3f83841b4d561e72987950eeb' : '2dd21cbd1afc23ca6062a4ab1ac97f61';
self['hostUrl'] = 'https://cdn.gravitec.net/sw';
self.importScripts(self['hostUrl'] + '/worker.js');
self.importScripts('https://' + location.hostname + '/sw.js');