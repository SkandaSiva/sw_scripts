var cacheName = 'myshiptracking-app2';
var filesToCache = ['/no-internet?is_mob=1'];
var filesToCache3 = [
	'/scripts/base1.css?id=6.44.65464',
	'/scripts/base1.js?id=6.44.65464',
	'/scripts/footer.js?id=6.44.65464',
	'/js/openlayers/newmap.js?id=6.44.65464',
	'/js/openlayers/newmap-2d.js?id=6.44.65464',
	'/js/stackblur.min.js?id=6.44.65464',
	'/css/fa/fonts/fontawesome-webfont.woff?v=4.2.0',
	'/misc/myst-logo.svg',
	'/js/rangeSlider/ion.rangeSlider.min.js',
	'/js/nouislider-15.4.0/nouislider.min.js',
	'/scripts/basemap.js',
	'/js/daterangepicker/daterangepicker.min.js',
	'/js/exif-js.js',
	'/js/maplibre/2.1.6/maplibre-gl.js',
	'/js/dropzone/dropzone-min.js',
	'/js/turf/turf.min.js',
	
	'/no-internet?is_mob=1',
	
	'/icons/icon0g.png',
	'/icons/icon3g.png',
	'/icons/icon4g.png',
	'/icons/icon6g.png',
	'/icons/icon7g.png',
	'/icons/icon8g.png',
	'/icons/icon9g.png',
	'/icons/icon10g.png',
	'/icons/icon11g.png',
	'/icons/icon12g.png',
	'/icons/icon13g.png',
	
	];

self.addEventListener('fetch', function(event) {
	return event.request;
});