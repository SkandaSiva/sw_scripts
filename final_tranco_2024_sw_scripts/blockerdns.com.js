self.addEventListener( 'install', event => {
    event.waitUntil( self.skipWaiting() );
} );

self.addEventListener( 'activate', event => {
    event.waitUntil( self.clients.claim() );
} );

self.addEventListener( 'fetch', event => {
    if ( event.request.method == 'GET' && event.request.url.startsWith( self.location.origin ) ) {
        event.respondWith(
            fetch( event.request ).then( function ( response ) {
                if ( !response.ok ) {
                    if ( response.status == 404 ) {
                        return response;
                    }
                    else {
                        throw Error( 'response status ' + response.status );
                    }
                }
                else {
                    return response;
                }
            } ).catch( function ( error ) {

                var fallbackResponse = {
                    result: true
                };
                return new Response( JSON.stringify( fallbackResponse ), {
                    headers: { 'Content-Type': 'application/json' }
                } );
            } )
        );
    }
} );