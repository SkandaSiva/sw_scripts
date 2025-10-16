const CACHE = 'cache-v-pwa';
const CACHING_DURATION = 120 * 1000;
const CACHING_DURATION_RESOURSE = 10 * 60 * 1000;

self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener("activate", () => caches.delete(CACHE));

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url.toLowerCase());
    const method = event.request.method.toLowerCase();

    if(
        ["develop.skarb", "skarb.com.ua", "www.skarb.com.ua", "localhost"].includes(url.hostname)
        && method === 'get'
    ) {
        let file = event.request.url.replace(/^http(s?):\/\/(.+)\//, '').split('?')[0];
        let uri = event.request.url.replace(/^http(s?):\/\/(.[^\/]+)\//, '').split('?')[0];

        if(
            // Определенные страницы
            (!/^admin/.test(uri) && !/^(404|403|401|301)/.test(uri))
            || /(png|jpg|svg|ttf|eot|woff|woff2|gif|js|css|json)$/.test(file)
        ) {
            event.respondWith(
                new Promise((resolve, reject) => {
                    fromCache(event.request)
                        .then((response => {

                                let duration = !/(png|jpg|svg|ttf|eot|woff|woff2|gif|js|css|json)$/.test(file) ? CACHING_DURATION : CACHING_DURATION_RESOURSE;
                                let expires = Date.parse(response.headers.get('date'));
                                expires = expires + duration;
                                let date = new Date();
                                let now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                                    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

                                if(expires < now_utc || response.status !== 200) {
                                    fromNetwork(event.request)
                                        .then(r => resolve(r))
                                        .catch(err => resolve(response))
                                } else {
                                    resolve(response);
                                }
                            }
                        ))
                        .catch((err) => {
                                fromNetwork(event.request)
                                    .then(response => {
                                        resolve(response);
                                    })
                                    .catch(err => {
                                        reject(err);
                                    });
                            }
                        )
                })
            );
        }
    }
});

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) => {

                return matching || Promise.reject('no-match');
            }
        ));
}

function fromNetwork(request) {
    return new Promise((resolve, reject) => {
        fetch(request)
            .then((response) => {

                if(response.status === 404) {
                    reject('Error ' + response.status);
                }

                if(response.status === 200) {
                    caches.open(CACHE).then((cache) => {
                        cache.put(request, response.clone());
                        //console.log(request.url);

                        resolve(response);
                    });
                } else {
                    resolve(response);
                }

            })
            .catch(err => reject(err));
    });
}

//5880ce1a23179833ef1b98493deeee9d2cdae064
//0001f679275b14e706508f1aded7d3be77388399
//55c19b6e63faecb7022470eedea431cbd8532db1
//628bf683545da7938cec2b689dce02a7140275b2
//bdd4387d3ebb86677988d3e440e6fad1a1f691ef
//9a1718926b1669fa60af62725fea02aca8a3c83d
//9e2a267647103b0ee2023d6096e2b392297af022
//e54a9c71ba373473bc6a4ea6bc54ebf3b492f765
//5d543cce83f240dcf39b03eaac6d3db9d7be5afa
//4747aa1617e9e65b87c7dee55bdcc3e456472b0c
//1ed396a9893d0f8b8491b6404c1445a34fd5572c
//a77e225163d9c63451099491327975c208be26d5
//17b7e6435c59b05b2c0ef89838eac98dbb207369
//57122fe47eb5a2fc816fafc6f042e653e5c6a4e4
//933543dc0443975c336eebfa4d0147bdc6913ae4
//9e3eaac0238602ae2b882763bcfc5a150c73255b
//33f2125b7d20222e82b6a0722d0b06c3d78e0634
//3f3a4156f46a3280c355db65280119cb47829939
//8a53ace8639555c37850d6559370d60b5792a0c5
//a1bae194866187afa0d76ad8f523fe6c25c748f8
//a6bdc3a1de88da31dcf607f27ff05a07796009c5
//5f9c2ee6eae3ca08c342941b3fe440d8c998359b
//d7e54c400333e84234119b55305e4ed686ba4f15
//5f203fe1d4ba687544a2154453c1e3113f1fb22c
//dde975071a07fdcd847953a9309432682c057c37
//9cdc5c56a9d7c67cbfe5e42ae12e0fce35daa48f
//0d4c85cc18367aa6f1083b0990a091381ab808b0
//2875386b814146c9e49338312411817e7b650f72
//417e74013c1213283382e107f56d1653ca3855c8
//641335c573d48ff7059927737484455d3bbb8d0f
//edbf3eb834ff4434b4e2e77ed0be0794ae5be1b9
//bb11bddca0a384da412a389ec95c7a022057e5ea
//cdfafce2306f0786ff5aab7f90a68d855121c88e
//8506855c6d4238a6bbf3f48b872d9b770aee0da3
//56d1367c6b5c136e4b665ddf31952ff2531be45e
//8cc80bf90ec3b20515e091d7c3c546e5ecdf48d9
//086449eb274f858bb983417510399b54fc29d518
//9f5d983330e5c84a6a77c6df57ec515527a55ced
//25a252238034676cb0a8cd785bfdea435cd767c7
//261657b577789b70f3631f6c8f1aae14961386ed
//4eb827ac05659c9fd80ab7539f151cd431634df0
//0a0f338b3bb172c4938100981d541ff62d4af4e9
//a6bdd21b6fea56eb755243b8c4597bea2071897b
//8902a3630166d146362748d32802cabaf0d86e75
//fdee9257c9e9849b967c00909b990d5d6f3c6d98
//2355041359947d9081fbe03c30a04c063d18b038
//2daa281a53308a18b94152a825f5781835c70749