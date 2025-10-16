"use strict";

self.addEventListener("install", function(event) {
    // console.log("PWA install");
});

self.addEventListener("activate", function(event) {
    // console.log("PWA activat");
});

self.addEventListener("fetch", function(event) {
    // console.log("PWA fetch:");
});

self.addEventListener('push', function(e) {
    // Track event: Push Message Received
    // console.log("PWA notif push:");
});
self.addEventListener('notificationclick', function(e) {
    // Track event: Push Message Clicked, you can read e.action.id to track actions
    // console.log("PWA notif clicked");
});
self.addEventListener('notificationclose', function(e) {
    // Track event: Push Message Dismissed
    // console.log("PWA notif close");
});