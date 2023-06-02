const express = require('express');
const path = require('path');
const PORT = 8080;
const routes = require('./routes');

class Server {
  constructor() {
    this.app = express();
    this.settings();
    this.routes();
  }

  settings() {
    this.app.use(express.json());
    this.app.use(
      express.urlencoded({
        extended: true,
      })
    );
    // Rutas públicas
    const publicPath = path.join(__dirname, 'public');
    this.app.use(express.static(publicPath));

    // Ruta para el archivo index.html
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(publicPath, 'index.html'));
    });
  }

  routes() {
    routes(this.app);
  }

  listen() {
    this.app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
}

module.exports = new Server();
