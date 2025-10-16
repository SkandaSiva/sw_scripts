self.addEventListener("install", e => {
	console.log('Evento instalado')
});

self.addEventListener("active", e => {
	console.log('Evento activado')
});

self.addEventListener("fetch", e => {
	console.log('Evento recuperado')
});