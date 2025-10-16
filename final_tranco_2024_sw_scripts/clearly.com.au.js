/* eslint-disable no-undef */
/* eslint-disable semi */
'use client';
importScripts('./swenv.js')

self.__WB_DISABLE_DEV_LOGS = process.env.SW_ENABLE_LOGGING === 'true'

if (process.env.SW_ENABLE_CACHE === 'true') {
  /* TODO: use internal host and assets host specific for each store's domain */
  importScripts('https://assets.clearly.ca/extra/service-worker/sw.js')
}

