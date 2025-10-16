self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Renvoie la réponse du réseau au navigateur
        return response;
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de la ressource:', error);
      })
  );
});