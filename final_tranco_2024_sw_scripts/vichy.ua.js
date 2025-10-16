// Service Worker

// Version [31/01/2019]
const g_sVersionSW = '1.0.2'; // Update To force reloading

// Params: versionAOX / enablePushNotification

// Service workers are basically a proxy between your web application and the internet, so it can intercept calls to the network if so desired.

// Scope : Site Root { scope: '/' }
// Scope in this instance refers to the path that the service worker will be able to intercept network calls from
// Service workers can only intercept requests originating in the scope of the current directory that the service worker script is located in and its subdirectories.

// self: The ServiceWorkerGlobalScope interface of the ServiceWorker API represents the global execution context of a service worker.

// !! Don't use AOXJsManager, it is not loaded !!

// -- Debugging Module --

const g_bDebugMode = false;

class AOXDebugSWClass {

	constructor(bDebugMode) {
		this._bIsError = false;
		this._bDebugMode = bDebugMode;

		self.addEventListener('install', () => this.trace('Installing the service worker version ' + g_sVersionSW));
		self.addEventListener('activate', () => this.trace('Activation of the service worker version ' + g_sVersionSW));
	}

	_traceConsole(sMsg, oData) {

		sMsg = "[SW] " + sMsg;

		if (typeof console == "object")
		{
			if (typeof oData !== 'undefined') {
				console.log(sMsg, oData);	
			}
			else
			{
				console.log(sMsg);	
			}
		}
	}

	_traceErrorConsole(sError, oData) {

		sError = "[SW] " + sError;

		if (typeof console == "object")
		{
			if (typeof oData !== 'undefined') {
				console.error(sError, oData);	
			}
			else
			{
				console.error(sError);	
			}
		}
	}

	trace(sMsg, oData) {
		this._traceConsole(sMsg, oData);
	}

	addBreakPoint() {
		if (this._bDebugMode)
		{
			debugger;
		}
	}

	addError(sError, oData) {
		this._bIsError = true;
		this._traceErrorConsole(sError, oData);
	}

	isError() {
		return this._bIsError;
	}
}

if (typeof self !== 'undefined') {
	self.AOXDebugSW = new AOXDebugSWClass(g_bDebugMode);
}

// -- Tools Module --

class AOXToolsSWClass {

	getVersionAOX() {
		// Get "revisioning" information from url params
		return new URL(location.href).searchParams.get('versionAOX').trim();
	}

	getSiteRoot() {
		//Get "site root" information from url
		var nPosServiceWorker = location.href.indexOf('serviceWorker');

		if ( nPosServiceWorker >= 0 )
		{
			return location.href.substring(0, nPosServiceWorker).trim();
		}

		return "";
	}
}

if (typeof self !== 'undefined') {
	self.AOXToolsSW = new AOXToolsSWClass();
}

// Analytics : For future use

class AOXAnalyticsSWClass {

	trackEvent(sEvent) {
		self.AOXDebugSW.trace('Analytics: ' + sEvent);
	}
}

if (typeof self !== 'undefined') {
	self.AOXAnalyticsSW = new AOXAnalyticsSWClass();
}

// -- Define const --

const g_sVersionAOX = self.AOXToolsSW.getVersionAOX();
		
if ( g_sVersionAOX == "" )
{
	self.AOXDebugSW.addError('Error serviceWorker : versionAOX not defined');
}

const g_sSiteRoot = self.AOXToolsSW.getSiteRoot();

if ( g_sSiteRoot == "" )
{
	self.AOXDebugSW.addError('Error serviceWorker : site root not defined');
}

// -- Functions --

if ('function' !== typeof importScripts) {
	self.AOXDebugSW.addError('Error serviceWorker : importScripts not defined');
}

// -- Precaching Module ---

if (!self.AOXDebugSW.isError())
{
	// workbox-precaching does all of this during the service worker's install event.

	importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js');

	if (workbox)
	{
		//skipping the default service worker lifecycle.
		workbox.skipWaiting();
		workbox.clientsClaim();

		// Save a set of files to the cache when the service worker is installing

		// This list references a set of URLs, each with their own piece of "revisioning" information
		workbox.precaching.precache([ 		
			{ url: g_sSiteRoot + 'include/js/preloadcss.js?versionAOX=' + g_sVersionAOX, revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/js/modernizr.min.js', revision: g_sVersionAOX },

			{ url: g_sSiteRoot + 'include/js/AOX_Light.min.js?versionAOX=' + g_sVersionAOX, revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/js/AOX.min.js?versionAOX=' + g_sVersionAOX, revision: g_sVersionAOX },

			{ url: g_sSiteRoot + 'include/css/AOX.min.css?versionAOX=' + g_sVersionAOX, revision: g_sVersionAOX },
			
			{ url: g_sSiteRoot + 'include/webfonts/FuturaPT/FuturaPT-Light.woff2', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/webfonts/FuturaPT/FuturaPT-Light.woff', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/webfonts/FuturaPT/FuturaPT-Book.woff2', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/webfonts/FuturaPT/FuturaPT-Book.woff', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/webfonts/FuturaPT/FuturaPT-Demi.woff2', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/webfonts/FuturaPT/FuturaPT-Demi.woff', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/webfonts/FuturaPT/FuturaPT-Bold.woff2', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/webfonts/FuturaPT/FuturaPT-Bold.woff', revision: g_sVersionAOX },

			{ url: g_sSiteRoot + 'include/images/sprites-1x.png', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/images/sprites-2x.png', revision: g_sVersionAOX },
			{ url: g_sSiteRoot + 'include/images/icons-svg/globe.svg', revision: g_sVersionAOX }
		]
		);

		// Add Precache Route
		workbox.precaching.addRoute();	
		
		self.AOXDebugSW.trace('Precaching using Service Worker is activated version ' + g_sVersionSW);
	}
}
