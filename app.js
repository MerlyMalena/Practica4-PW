// Módulo nativo de Node para crear el servidor web
const http = require('http');

// Importa el manejador de rutas que está creado en routes.js
const routesHandler = require('./src/routes/routes');

// Definir el puerto
const PORT = process.env.PORT || 3000;

// Crea el servidor pasándole la función con la ruta routesHandler
const server = http.createServer(routesHandler);

// Pone el servidor a escuchar peticiones en el puerto indicado
server.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
});