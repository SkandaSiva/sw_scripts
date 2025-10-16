importScripts('https://cdnjs.cloudflare.com/ajax/libs/co/4.1.0/index.js');
var co;
 
var RETRY_TMOS = [0, 0, 500, 1000, 2000, 4000, 8000];

self.onfetch = function (event) {
    if (event.request.method === "GET" && co) {
        event.respondWith(co(fetchWithRetryWorker(event)));
    } else {
        event.respondWith(fetch(event.request));
    }
}

function* fetchWithRetryWorker(event) {
    for (var i = 0; i < RETRY_TMOS.length; i++) {
        //if (i > 0) console.log("retry " + i);

        try {
            var resp = yield fetch(event.request);

            if (resp.status >= 500) {
                //console.log("fail " + i + ": " + resp.status);
                if (i >= RETRY_TMOS.length - 1) return resp;
            } else {
                return resp;
            }

        } catch (err) {
            console.log(err);
            if (i >= RETRY_TMOS.length - 1) {
                throw err
            }
        }

        if (RETRY_TMOS[i]) yield sleep(RETRY_TMOS[i]) //sleep before retry
    }
}


//helper function for sleeping a couple ms
function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}