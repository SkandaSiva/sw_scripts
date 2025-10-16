self.addEventListener( 'install', ( event ) => {
	console.log( 'SW: Installation succeeded.' );
} );
self.addEventListener( 'activate', ( event ) => {
	console.log( 'SW: Activation succeeded.' );
} );
self.addEventListener( 'fetch', ( event ) => {
	console.log( 'SW: Query execution...' );
} );
