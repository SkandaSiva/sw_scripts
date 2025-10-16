/**
 * @typedef {object} WorkerLocation
 * @property {string} host - Host part of the worker's location
 * @property {function(): string} toString - Serialized URL for the worker's location
 * @property {string} origin - Worker's origin
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WorkerLocation
 */

/**
 * @typedef {object} ServiceWorkerGlobalScope
 * @property {function(...(string | URL)): void} importScripts - Imports scripts into worker's scope
 * @property {WorkerLocation} location -  WorkerLocation associated with the worker
 * @property {function(string, Function): void} addEventListener -  Registers an event handler
 * @property {function(): Promise<void>} skipWaiting - Force waiting service worker to become active
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope
 */

/**
 * @typedef {object & ServiceWorkerGlobalScope} GujWorkerGlobalScope
 */

/** @type {GujWorkerGlobalScope} */
const workerGlobalScope = self;

const env = /dev|local/.test(workerGlobalScope.location.host) ? "dev" : "prod";

// CleverPush channelId which is defined in config.[tenantShortName].js.
// Gets replaced by "ServiceWorkerGeneratorPlugin" in the build chain.
const webPushConfig = {
  dev: "T5orFWhkxXeoLeNHn",
  prod: "HN6twFsQkYyoLxsSk",
};

// import cleverpush-worker.js
if (webPushConfig[env] && typeof workerGlobalScope.importScripts === "function") {
  const channelId = webPushConfig[env];
  workerGlobalScope.importScripts(
    `https://static.cleverpush.com/channel/worker/${channelId}.js${workerGlobalScope.location.search}`
  );
}
