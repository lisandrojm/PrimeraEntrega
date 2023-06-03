/* ************************************************************************** */
/* /src/routes - Contiene las definiciones de rutas para los productos y
carritos de compra.
/* ************************************************************************** */

const productsApi = require('../components/products');
const cartsApi = require('../components/carts');

module.exports = (app) => {
  productsApi(app);
  cartsApi(app);
};
