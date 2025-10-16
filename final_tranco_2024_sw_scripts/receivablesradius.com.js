const defaultBuildTimeStamp="2024-10-18 15:05";
var allBuildTimeStamps = {
	"RRDMSProject_STATIC":"RRDMSProject_STATIC_BUILD_TIME_STAMP_HOLDER",
	"RRDMSProject_DYNAMIC":"2024-10-18 15:05"
};

var scriptArray=[
	'/RRDMSProject/i18n/i18n_en.js?b=',
	'/RRDMSProject/static/extjs6ml/app/view/util/sha256.js',
	'/RRDMSProject/static/extjs6ml/MetaDataLoader.js?b=',
	'/RRDMSProject/static/extjs6ml/ext/build/ext-all-6.0.2.js',
	'/RRDMSProject/static/extjs/js/jquery_3.6.0.min.js',
	'/RRDMSProject/static/extjs/js/custom.modernizr_3.11.8.js',
	'/RRDMSProject/i18n/ext-locale/ext-locale-en.js',
	'/RRDMSProject/static/extjs6ml/rrdms-home.js?b=',
	'/RRDMSProject/static/extjs/js/tiff-min.js',
	'/RRDMSProject/static/extjs/js/charts.js?b=',
	'/RRDMSProject/static/extjs6ml/app/view/thirdPartylib/TinyMCETextArea/tinymce/tinymce.min.js?b=',
	'/RRDMSProject/static/extjs6ml/app/view/thirdPartylib/CallAssets/assets/js/SIPml-api.js?b=',
	'/RRDMSProject/static/extjs6ml/app/view/thirdPartylib/Moment_2.29.4/moment_2.29.4.js?b=',
	'/RRDMSProject/static/extjs6ml/app/view/thirdPartylib/Moment_2.29.4/moment-timezone-with-data_0.5.23.js?b=',
	'/RRDMSProject/static/extjs6ml/app/view/thirdPartylib/mousetrap_1.6.5.js?b=',
	'/RRDMSProject/static/extjs6ml/ext/build/ext-all-6.0.2.js',	
	'/RRDMSProject/static/extjs6ml/app/view/thirdPartylib/jsoneditor.js',
	'/RRDMSProject/static/extjs6ml/app/view/thirdPartylib/CronParser/cronstrue.js',
	'/RRDMSProject/static/extjs6ml/app/view/thirdPartylib/CronParser/cronparser.js'
]

var cssArray=[
	'/RRDMSProject/static/extjs6ml/build/development/theme-triton-6.0.2/resources/theme-triton-all_1.css',
	'/RRDMSProject/static/extjs6ml/build/development/theme-triton-6.0.2/resources/theme-triton-all_2.css',
	'/RRDMSProject/static/extjs6ml/build/development/theme-triton-6.0.2/resources/theme-triton-custom.css',
	'/Analytics/static/ext6.0/ext/theme-crisps/theme-crisp-all-min_1.css',
	'/Analytics/static/ext6.0/ext/theme-crisps/theme-crisp-all-min_2.css',
	'/RRDMSProject/static/css/eippIcons.css',
	'/RRDMSProject/static/css/introjs.min.css',
	'/RRDMSProject/static/css/eippKachingg.css',
	'/RRDMSProject/static/extjs6ml/build/development/theme-triton-6.0.2/resources/theme-triton-all.css',
	'/RRDMSProject/static/css/triton_theme.css?b=',
	'/Chatbot/static/css/chatBotCss.css?b='+defaultBuildTimeStamp,
	'/Analytics/static/css/analytics.css?b='+defaultBuildTimeStamp,
	'/Crossfunctional-ui/static/css/eciCss.css?b='+defaultBuildTimeStamp,
	'/Crossfunctional-ui/static/css/hiconnectCss.css?b='+defaultBuildTimeStamp,
	'/Crossfunctional-ui/static/css/tmtTaskCss.css?b='+defaultBuildTimeStamp,
	'/Analytics/static/css/pivot-all.css?b='+defaultBuildTimeStamp,
	'/Analytics/static/ext6.0/ext/theme-crisps/theme-crisp-all-min.css',
	'/RRDMSProject/static/css/caastyles.css?b=',
	'/RRDMSProject/static/css/notification.css',
	'/RRDMSProject/static/css/jsoneditor.css',
	'/DMS/static/css/dmsStyles.css?b='
	
]

var fontArray=[
	'/RRDMSProject/static/extjs6ml/build/development/theme-triton-6.0.2/resources/fonts/OpenSans-Light.ttf',
	'/RRDMSProject/static/extjs6ml/build/development/theme-triton-6.0.2/resources/fonts/OpenSans-Regular.ttf',
	'/RRDMSProject/static/extjs6ml/build/development/theme-triton-6.0.2/resources/fonts/OpenSans-Bold.ttf',
	'/RRDMSProject/static/extjs6ml/build/development/theme-triton-6.0.2/resources/images/loadmask/loading.gif'
]

var imgArray=[
	'/RRDMSProject/static/images/loadanim.gif',
	'/RRDMSProject/static/images/HRLogo_6.png',
	'/RRDMSProject/static/images/triton/Common_Edit-Filter-big.png',
	'/RRDMSProject/static/images/triton/Common_Delete-Filter-big.png',
	'/RRDMSProject/static/images/Loading.gif'
]

function getProductModule(staticURL){
	if(staticURL!=undefined){
		let fileNameArray = staticURL.split("/");
		if(fileNameArray.length>1){
			return fileNameArray[1];
		}else{
			return null;
		}
	}
	return null;
}

function handleAppendBuildTimeStamp(array,cache){
	for(var key in array){
		if(array[key].endsWith("?b=")){
			var productModule = getProductModule(array[key]);
			if(allBuildTimeStamps[productModule+"_STATIC"]==undefined){
				if(productModule != 'RRDMSProject'){
					fetch('/'+productModule+'/static/build.json?b='+Date.now()).then(function(response){
						return response.json();
					}).then(function(responseStr){
						for(var key in responseStr){
							allBuildTimeStamps[key] = responseStr[key];
						}
						if(allBuildTimeStamps[productModule+"_STATIC"]!=undefined 
							&& allBuildTimeStamps[productModule+"_STATIC"]!=productModule+"_STATIC_BUILD_TIME_STAMP_HOLDER"){
							cache.add(array[key]+""+allBuildTimeStamps[productModule+"_STATIC"]);
						}else{
							cache.add(array[key]+""+allBuildTimeStamps[productModule+"_DYNAMIC"]);
						}
					});
				}else{
					if(allBuildTimeStamps[productModule+"_STATIC"]!=undefined 
					&& allBuildTimeStamps[productModule+"_STATIC"]!=productModule+"_STATIC_BUILD_TIME_STAMP_HOLDER"){
						cache.add(array[key]+""+allBuildTimeStamps[productModule+"_STATIC"]);
					}else{
						cache.add(array[key]+""+allBuildTimeStamps[productModule+"_DYNAMIC"]);
					}
				}
			}else{
				if(allBuildTimeStamps[productModule+"_STATIC"]!=productModule+"_STATIC_BUILD_TIME_STAMP_HOLDER"){
					cache.add(array[key]+""+allBuildTimeStamps[productModule+"_STATIC"]);
				}else{
					cache.add(array[key]+""+allBuildTimeStamps[productModule+"_DYNAMIC"]);
				}
			}
		}else{
			cache.add(array[key]);
		}
	}
}

self.addEventListener('install', function(event) {
	var productModule = "RRDMSProject";
	if(allBuildTimeStamps["RRDMSProject_STATIC"]!=undefined && allBuildTimeStamps["RRDMSProject_STATIC"]!=productModule+"_STATIC_BUILD_TIME_STAMP_HOLDER"){
		caches.open(allBuildTimeStamps["RRDMSProject_STATIC"]).then(function(cache) {
			var array=scriptArray.concat(cssArray).concat(fontArray).concat(imgArray);
			handleAppendBuildTimeStamp(array,cache);
		})
	}else{
		caches.open(allBuildTimeStamps["RRDMSProject_DYNAMIC"]).then(function(cache) {
			var array=scriptArray.concat(cssArray).concat(fontArray).concat(imgArray);
			handleAppendBuildTimeStamp(array,cache);
		})
	}
});

self.addEventListener('activate', e => {
	var productModule = "RRDMSProject";
	  e.waitUntil(
	    caches.keys().then(cacheNames => {
	      return Promise.all(
	        cacheNames.map(cache => {
			  if(allBuildTimeStamps["RRDMSProject_STATIC"]!=undefined 
			  && allBuildTimeStamps["RRDMSProject_STATIC"]!=productModule+"_STATIC_BUILD_TIME_STAMP_HOLDER"){
				  if (cache !== allBuildTimeStamps["RRDMSProject_STATIC"]) {
		            return caches.delete(cache);
		          }
			  }else{
				  if (cache !== allBuildTimeStamps["RRDMSProject_DYNAMIC"]) {
		            return caches.delete(cache);
		          }
			  }
	        })
	      );
	    })
	  );
	});

self.addEventListener('fetch', function(event) {
	if(event.request.url.includes("/static/")||event.request.url.includes("/i18n/")){
		event.respondWith(
			    caches.match(event.request).then(function(response) {
			      return response || fetch(event.request);
			    })
			  );
	}
	});

self.addEventListener("message", function(event){
	console.log(`Message received: ${event.data}`);
	if(event.data.rrdmsStaticBuildTimeStampValue!=undefined){
		allBuildTimeStamps["RRDMSProject_STATIC"]=event.data.rrdmsStaticBuildTimeStampValue;
	}
});
	