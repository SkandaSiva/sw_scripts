
self.addEventListener('install', (event) => {
  console.log('👍', 'install', event);
  // // Esconder o evento para que possa ser acionado mais tarde.
  // window.deferredPrompt = event;
  // // Remover a classe 'oculta' do contêiner do botão de instalação.
  // divInstall.classList.toggle('hidden', false);
}); 

self.addEventListener('beforeinstallprompt', (event) => {
  // Impedir que o mini-infobar apareça no celular.
  event.preventDefault();
  console.log('👍', 'beforeinstallprompt', event);
  // // Esconder o evento para que possa ser acionado mais tarde.
  // window.deferredPrompt = event;
  // // Remover a classe 'oculta' do contêiner do botão de instalação.
  // divInstall.classList.toggle('hidden', false);
}); 

self.addEventListener('fetch', function (event) {
  // do nothing here, just log all the network requests
  // console.log('👍', 'fetch', event);
});