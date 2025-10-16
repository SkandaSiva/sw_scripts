var host = self.location.host;
let allowed_hosts = ['jardin.renovation',
                    'monjardinmamaison.maison-travaux',
                    'lejournaldelamaison',
                    'autojournal',
                    'bibamagazine'
                    ];

allowed_hosts.forEach(allowed_host => {
  if (host.includes(allowed_host) ) {
    importScripts('https://notifpush.com/serviceworker-mix.js');
  }
});

importScripts("https://via.batch.com/v3/worker.min.js");

const eventsList = ["pushsubscriptionchange", "install", "push", "notificationclick", "message"];
eventsList.forEach(eventName => {
  self.addEventListener(eventName, event => {
    event.waitUntil(self.handleBatchSDKEvent(eventName, event));
  });
});

