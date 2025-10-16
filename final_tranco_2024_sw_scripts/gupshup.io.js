self.addEventListener("fetch", function (event) {
  if (event.origin !== self.location.origin)
    // Compliant
    return;
  console.log("Hello world from the Service Worker 🤙");
});
