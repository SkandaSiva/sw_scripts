var responseContent =
"<html>" +
"<body>" +
"<style>" +
"body {text-align: center; padding: 30px; background-color: #214C63; color: #ffffff; font-family: Calibri, Helvetica, sans-serif;}" +
"p {font-size: large;}" +
"</style>" +
"<p></p>" +
"<p></p>" +
"<p></p>" +
"<h1>terazKrosno.pl</h1>" +
"<p>Obecnie jesteś poza zasięgiem sieci Internet / odśwież stronę</p>" +
"" +
"</body>" +
"</html>";
 
self.addEventListener("fetch", function(event) {
event.respondWith(
fetch(event.request).catch(function() {
return new Response(
responseContent,
{headers: {"Content-Type": "text/html; charset=utf-8"}}
);
})
);
});