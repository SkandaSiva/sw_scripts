var scriptBase =
  self.location.origin === 'https://www.newzit.com' ? 'https://www.newzit.com' : 'https://www.newzitint.com';

importScripts(scriptBase + '/api/web-push-notification/v1/static/latest/mol-fe-web-push-sw/sw.js');
