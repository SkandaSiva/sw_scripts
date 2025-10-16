self.addEventListener("install", (e) => {
  console.log("sw install", e);
});

self.addEventListener("fetch", () => {
  // console.log("fetch", e);
});
