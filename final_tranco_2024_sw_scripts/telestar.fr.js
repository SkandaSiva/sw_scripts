
var use_wonderpush = false;
var key = "";
var host = self.location.host;

if (host.includes('astro.nextplz')) {
    use_wonderpush = true;
    key = "a3bc84907e4b3b6d79ab97e7485bf62fadc402ab1034b3f43c910fff54a30ecf";
} else if (host.includes('nextplz')) {
    use_wonderpush = true;
    key = "a80db1b3627e14e08476d518d665bed3f70bb43c4b19bfbffdf280a3a83785ac";
} else if (host.includes('cnetfrance')) {
    use_wonderpush = true;
    key = "cd3fd42d2cb0d5ae51a971ea69085f7a9b620cc5162c87519ccb86f737d89447";
} else if (host.includes('grazia')) {
    use_wonderpush = true;
    key = "87004886e76067f76eec763e68aafe76394e2140512f1ed4f59451788913869b";
} else if (host.includes('paroledemamans')) {
    use_wonderpush = true;
    key = "c688bc9a78b4776ea36cc5941ea9c2b2903749ba7b24205f5ec6955f0f683aa4";
} else if (host.includes('tanin')) {
    use_wonderpush = true;
    key = "10c449b24be8c77c5486fde4704d0006adf171736a5eb245485b8c90c572c37f";
} else if (host.includes('zdnet')) {
    use_wonderpush = true;
    key = "9b7cbead40708546f4f91608e2251e25e9e0dea3c906663de36ac5be5f8d1548";
}

var version = '1.9.2';
importScripts('https://notifpush.com/serviceworker.js');
  
if (use_wonderpush) {
    importScripts('https://cdn.by.wonderpush.com/sdk/1.1/wonderpush-loader.min.js');
    WonderPush = self.WonderPush || [];
    WonderPush.push(['init', {
        webKey: key,
    }]);
}

