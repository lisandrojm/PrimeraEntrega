/* ************************************************************************** */
/* /src/components/carts - Contiene el controlador de los carritos de compra 
(productsController.js) */
/* ************************************************************************** */

const { Router } = require('express');
const productsController = require('./productsController/productsController');

module.exports = (app) => {
  let router = new Router();
  app.use('/api/products', router);

  router.get('/', productsController.getAllProducts);
  router.get('/:pid', productsController.getProductById);
  router.post('/', productsController.addProduct);
  router.put('/:pid', productsController.updateProduct);
  router.delete('/:pid', productsController.deleteProduct);
};
