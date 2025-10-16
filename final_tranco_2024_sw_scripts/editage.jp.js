var version = '2.1';
var amp_version = '2.1';
var host = self.location.hostname.replace(/^(local|(development)(\d?)|staging|www)\./, '');
switch (host) {
  case 'editage.com':
    var NOTIFYVISITORS_BRAIND_ID = '7379';
    var _nvClientConfig = {
      auth: {
        bid: '7379',
        bid_e: 'FBD0ED1E7849126E07B2983F4F34D1AA',
        t: '420',
      },
      data: {},
      cPubKey: 'BGghkS0Jgylm/oh6aJSGE0f/8qfDCPXo4sX86OL5S8RWFy8ux5uYZf4qYZQbHdDvGmh3EHUZoQp7tUqF5g27CeM=',
    };
    break;
  case 'editage.cn':
    var NOTIFYVISITORS_BRAIND_ID = '7380';
    var _nvClientConfig = {
      auth: {
        bid: '7380',
        bid_e: 'B14D2C839486173EDF8D573FCAF1D7E0',
        t: '420',
      },
      data: {},
      cPubKey: 'BOeVgc+RaZwjYtzIHqfXJ5wxv360vFRwCNyUJoXIAsTDVlVNpwHo4VP6SXQTHa+phyYlcHrHj7bGBg88SLkdEFQ=',
    };
    break;
  case 'editage.co.kr':
    var NOTIFYVISITORS_BRAIND_ID = '7381';
    var _nvClientConfig = {
      auth: {
        bid: '7381',
        bid_e: '31AC3889B1185F82F00661EFC53364DD',
        t: '420',
      },
      data: {},
      cPubKey: 'BKtQ2pJyOLvIdONVuRzwQETviw2qxIhpj003Xnx135vhLzg/+0AvIU4gQ7o6O7yTx2gU0hkQdqauXNRju+8BULs=',
    };
    break;
  case 'editage.jp':
    var NOTIFYVISITORS_BRAIND_ID = '7386';
    var _nvClientConfig = {
      auth: {
        bid: '7386',
        bid_e: 'C5A3C67917BFE548904E957D5551246E',
        t: '420',
      },
      data: {},
      cPubKey: 'BGyOGI0UHnzdRyEvSju7Y7EzmNO44ETTxcGd3qteQXbXov1AvVAMr8Df3XXR0Xnn8AaHu5DLiB+RZTMM4uLWsLY=',
    };
    break;
    case 'editage.us':
      var NOTIFYVISITORS_BRAIND_ID = '7379';
      var _nvClientConfig = {
        auth: {
          bid: '7379',
          bid_e: 'FBD0ED1E7849126E07B2983F4F34D1AA',
          t: '420',
        },
        data: {},
        cPubKey: 'BGghkS0Jgylm/oh6aJSGE0f/8qfDCPXo4sX86OL5S8RWFy8ux5uYZf4qYZQbHdDvGmh3EHUZoQp7tUqF5g27CeM=',
      };
      break;
      case 'editage.id':
      var NOTIFYVISITORS_BRAIND_ID = '7379';
      var _nvClientConfig = {
        auth: {
          bid: '7379',
          bid_e: 'FBD0ED1E7849126E07B2983F4F34D1AA',
          t: '420',
        },
        data: {},
        cPubKey: 'BGghkS0Jgylm/oh6aJSGE0f/8qfDCPXo4sX86OL5S8RWFy8ux5uYZf4qYZQbHdDvGmh3EHUZoQp7tUqF5g27CeM=',
      };
      break;
}
importScripts('https://cdnp.notifyvisitors.com/js/brand_hosted/amp-push-worker.js');
importScripts('https://cdnp.notifyvisitors.com/js/brand_hosted/push-worker.js');
importScripts('https://s3-eu-west-1.amazonaws.com/static.wizrocket.com/js/sw_webpush.js');