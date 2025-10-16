/*eslint-disable */
const idsMap = {
    'www.gazetkowo.pl': '5cfe5c4928cc69000b64ac9d',
    'gazetkowo.pl': '5cfe5c4928cc69000b64ac9d',
    'uk.promotons.com': '5d3ac3241631e5000b701d79',
    'br.promotons.com': '5d3ac36b3a28fa000b21b942',
    'us.promotons.com': '5d3ac382ea9cc0000b5a7af0',
    'de.promotons.com': '5d3ac412ea9cc0000b5a8a38',
    'es.promotons.com': '5d3ac42b6b7334000bf928be',
    'fr.promotons.com': '5d3ac44248c9c0000bc017d1',
    'cz.promotons.com': '5d3ac451bfd1c3000b2a6c35',
    'ro.promotons.com': '5d3ac45cd7d950000b6cff93',
    'it.promotons.com': '65fabca87b3e49cd9719b186',
    'tr.promotons.com': '5d3ac4773a28fa000b21d2da',
    'gr.promotons.com': '5d3ac483308bb1000cf4bed9',
    'promoaccro.fr': '62d953165b618137c4ea91ac',
    'sparstark.de': '638745c60602f4b746aca44e',
    'ofertomania.es': '642d4b5b1c0d1376a25c2f11',
    'dottorsconti.it': '65fabca87b3e49cd9719b186',
}

let id = null;
if (idsMap[self.location.hostname]) {
    id = idsMap[self.location.hostname];
}

importScripts('https://s-eu-1.pushpushgo.com/' + id + '/worker.js');
