self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Si hay un problema con la red, puedes personalizar el comportamiento aquí
      // Puedes regresar una respuesta personalizada o una página de error, según tus necesidades
    })
  );
});