if (typeof (Worker) !== "undefined") {
    if (typeof (w) == "undefined") {
        w = new Worker("page-sense.js");
    }
} else {
    console.log("Sorry! No Web Worker support.");
}