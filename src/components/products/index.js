/* ************************************************************************** */
/* /src/components/products - Contiene el controlador de los productos 
 (productsController.js). */
/* ************************************************************************** */

// Importar el módulo de enrutador de Express
const { Router } = require('express');

// Importar el controlador de productos
const productsController = require('./productsController/productsController');

module.exports = (app) => {
  // Crear una nueva instancia del enrutador de Express
  let router = new Router();

  // Registrar el enrutador en la aplicación principal
  app.use('/api/products', router);

  // Definir las rutas y asignar los controladores correspondientes
  router.get('/', productsController.getAllProducts);
  router.get('/:pid', productsController.getProductById);
  router.post('/', productsController.addProduct);
  router.put('/:pid', productsController.updateProduct);
  router.delete('/:pid', productsController.deleteProduct);
};
