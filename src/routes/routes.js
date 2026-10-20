const fs = require('fs'); // filesystem, sirve para manipular archivos (propio de node.js)
const path = require('path'); // Sirve para construir rutas de archivos de manera segura (las barritas pueden dar problemas dependiendo el SO) (propio de node.js)

// Función auxiliar para servir archivos HTML
function serveView(res, fileName, statusCode = 200) { // Enviar un OK
  const filePath = path.join(__dirname, '..', 'views', fileName);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }); // Res: Canal para responder. Responde al codigo 500 y el tipo de contenido que va a enviar.
      res.end('Error interno del servidor al cargar la página.'); // Enviar el HTML final y cierra la llamada.
      return;
    }
    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(content);
  });
}

// Función auxiliar para servir archivos estáticos (CSS, JS, imágenes)
function serveStatic(res, relativePath) {
  const filePath = path.join(__dirname, '..', 'public', relativePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Recurso no encontrado.');
      return;
    }

    // Detectar el tipo de contenido según la extensión
    const ext = path.extname(filePath).toLowerCase(); // Obtiene la extensión del archivo (path.extname)
    const mimeTypes = {
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream'; // Tipo de contenido por defecto si no se encuentra en mimeTypes
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

// Manejador principal de rutas
function routesHandler(req, res) {
  const { url, method } = req;

  // 1. Archivos estáticos (/public/...)
  if (url.startsWith('/public/')) {
    const cleanPath = url.replace(/^\/public\//, '');
    serveStatic(res, cleanPath);
    return;
  }

  // 2. Rutas principales de la aplicación
  if (method === 'GET') {
    switch (url) {
      case '/':
      case '/home':
        serveView(res, 'index.html');
        break;

      case '/valores':
        serveView(res, 'valores.html');
        break;

      case '/skills':
        serveView(res, 'skills.html');
        break;

      case '/proyectos':
        serveView(res, 'proyectos.html');
        break;

      case '/contacto':
        serveView(res, 'contacto.html');
        break;

      default:
        // Ruta no encontrada (404)
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Página no encontrada</h1><p><a href="/">Volver al Home</a></p>');
        break;
    }
  } else if (method === 'POST' && url === '/contacto') {
    // Manejo de envío del formulario de contacto
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      console.log('Datos recibidos del formulario:', body);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>¡Mensaje recibido!</h1><p>Gracias por contactarme.</p><a href="/">Volver al Home</a>');
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Método no permitido.');
  }
}

// Exportamos el manejador para que app.js lo utilice
module.exports = routesHandler; // Cuando solicite routesHandler, le va a dar la funcion routesHandler solamente.
