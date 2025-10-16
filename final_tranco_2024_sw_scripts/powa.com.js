self.addEventListener("message", (event) => {
  const scriptsArray = event.data.scripts;
  console.log(event);

  if (scriptsArray && Array.isArray(scriptsArray)) {
    scriptsArray.map((url) => {
      fetch(new Request(url, { mode: "no-cors", redirect: "follow" }));
    });
  }
});
