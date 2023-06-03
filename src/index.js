/* ************************************************************************** */
/* /src/index.js - Inicia el servidor y configura las rutas. */
/* ************************************************************************** */

/* Importar el módulo 'express' para crear y configurar la aplicación del servidor */
const express = require('express');

/* Importar el módulo 'path' para trabajar con rutas de archivos y directorios */
const path = require('path');

/* Definir el puerto en el que se ejecutará el servidor */
const PORT = 8080;

/* Importar el módulo de rutas definido en './routes' */
const routes = require('./routes');

/* Definir la clase 'Server' */
class Server {
  constructor() {
    /* Crear una nueva instancia de la aplicación de Express */
    this.app = express();

    /* Llamar al método 'settings' para configurar la aplicación */
    this.settings();

    /* Llamar al método 'routes' para definir las rutas de la aplicación */
    this.routes();
  }

  /* Configurar la aplicación */
  settings() {
    /* Utilizar el middleware de Express para el manejo de JSON */
    this.app.use(express.json());

    /* Utilizar el middleware de Express para el manejo de datos codificados en la URL */
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );

    /* Rutas públicas */
    /* Obtener la ruta absoluta de la carpeta 'public' usando el módulo 'path' */
    const publicPath = path.join(__dirname, '../public');

    /* Servir archivos estáticos desde la carpeta 'public' */
    this.app.use(express.static(publicPath));

    /* Ruta para el archivo index.html */
    this.app.get('/', (req, res) => {
      /* Enviar el archivo 'index.html' al realizar una petición GET a la ruta raíz ('/') */
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }

  /* Definir las rutas de la aplicación */
  routes() {
    /* Llamar a la función de enrutamiento definida en el módulo de rutas */
    routes(this.app);
  }

  /* Iniciar el servidor */
  listen() {
    this.app.listen(PORT, () => {
      /* Mostrar un mensaje en la consola indicando la URL de acceso */
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
}

/* Exportar una instancia de la clase Server para su uso en otros archivos */
module.exports = new Server();
