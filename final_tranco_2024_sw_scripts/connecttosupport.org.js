let obsoleteApis = [];
fetch(self.registration.scope.replace(/\/$/, '') 
    + "/api/Technical/ObsoleteEndpoints")
.then(async response => {
    return await response.json();
})
    .then(data => {
        obsoleteApis = data.Data;
    })

self.addEventListener("fetch", (event) => {
    const obsoleteEndpoint = obsoleteApis.find(x=> new URL(event.request.url).pathname.toLowerCase().startsWith(x.Url.toLowerCase()));
    if(!!obsoleteEndpoint){
        console.warn(`Detected usage of the obsolete endpoint ${event.request.url}. Deprecation message: ${obsoleteEndpoint.Message}`);
    }
});