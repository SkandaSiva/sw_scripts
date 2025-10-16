// Serwis Worker Script - Web app install banner
this.addEventListener("beforeinstallprompt", function (e) {
  e.userChoice.then(function (choiceResult) {
    if (choiceResult.outcome == "dismissed") {
      console.log("User cancelled home screen install");
    } else {
      console.log("User added to home screen");
    }
  });
});
